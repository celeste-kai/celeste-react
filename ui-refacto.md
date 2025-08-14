## UI Refactor Proposal — celeste-react

### Goals

- **Keep Input independent of capability**: the same input bar UX for text, image, and video
- **Separate concerns**: input/view logic vs capability execution vs API
- **One place to decide how to execute** based on capability (no scattered branching)
- **Consistent state model**: text thread, image gallery, video gallery managed predictably
- **Predictable discovery**: capability → filtered providers/models is a read-only concern

### Current Issues (What’s wrong now)

- **Capability branching inside `useChat`**: `useChat` calls both text and image APIs. This couples text state (messages) with non-text flows, and forces the chat hook to know about other capabilities.
- **Conditional rendering in `App.tsx` hides content**: Greeting vanishes when switching to image/video, revealing that “view state” is tied to text-only logic rather than the selected capability.
- **`ChatInput` has mixed responsibilities**: it’s a capability selector, provider selector, model selector, and a text input; but its submit handler semantics are text-oriented. It should be a generic input bar that simply emits the prompt to a controller.
- **Duplicated/fragmented types**: `ModelOut` appears both in `hooks/useModels.ts` and `types/api.ts` with slightly different shapes. This is brittle and confusing.
- **Discovery vs execution mixed across layers**: `useChat` infers provider by fetching all models when none is set. Provider/model validation belongs outside the text-only hook.
- **Environment variable**: Standardize on `VITE_API_BASE_URL` across code and docs.

### Design Principles

- **Single responsibility** per module:
  - **InputBar**: capture prompt and user choices, never decides execution
  - **Controllers**: map a prompt to an execution for the current capability
  - **Services**: call backend endpoints
  - **Stores**: hold UI state and results, one store per result domain
- **Data flows one way** from input → controller → service → stores → views
- **Capability is a runtime parameter**, not a compile-time branching across the app

### Proposed Architecture

#### Directory Structure

```
src/
  domain/
    capability.ts         # CapabilityId, result unions
    types.ts              # Shared UI/domain types (e.g., TextMessage)
  services/
    text.ts               # generateText
    images.ts             # generateImages
    video.ts              # generateVideo (future)
  controllers/
    textController.ts     # useTextController
    imageController.ts    # useImageController
    videoController.ts    # useVideoController
    interaction.ts        # useInteraction (selects correct controller based on capability)
  stores/
    selections.ts         # capability/provider/model/streaming (existing)
    thread/
      store.ts            # mixed-content conversation store (turns)
      selectors.ts        # derived selectors (e.g., all images/videos)
  lib/queries/
    discovery.ts          # capabilities/providers/models (existing)
  components/
    input/
      InputBar.tsx        # presentational input (rename from ChatInput)
    results/
      ResultSurface.tsx   # renders Greeting or the conversation thread
      ThreadItemView.tsx  # renders one turn with all its parts
      parts/
        TextPart.tsx      # presentational text renderer
        ImagePart.tsx     # presentational image renderer
        VideoPart.tsx     # presentational video renderer
    chat/
      MessagesList.tsx    # remains presentational (no hook types import)
      Greeting.tsx
```

#### Domain Types

```ts
// domain/capability.ts
export type CapabilityId = 'text' | 'image' | 'video';

export type TextResult = { kind: 'text'; message: string; metadata?: Record<string, unknown> };
export type ImageResult = {
  kind: 'image';
  items: Array<{ dataUrl?: string; path?: string; metadata?: Record<string, unknown> }>;
};
export type VideoResult = {
  kind: 'video';
  items: Array<{ url?: string; path?: string; metadata?: Record<string, unknown> }>;
};

export type GenerationResult = TextResult | ImageResult | VideoResult;
```

```ts
// domain/types.ts
export type TextMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
};
```

#### Services (pure API layer)

```ts
// services/text.ts
export async function generateText(args: { provider: string; model: string; prompt: string }) {
  /* ... */
}

// services/images.ts
export async function generateImages(args: {
  provider: string;
  model?: string;
  prompt: string;
  options?: Record<string, unknown>;
}) {
  /* ... */
}

// services/video.ts (future)
export async function generateVideo(args: {
  provider: string;
  model?: string;
  prompt: string;
  options?: Record<string, unknown>;
}) {
  /* ... */
}
```

#### Controllers

Each controller performs one capability flow and appends turns to the unified thread:

- Text: add user text turn → call `generateText` → add assistant text turn
- Image: add user prompt turn → call `generateImages` → add assistant image parts turn
- Video: same pattern when API is available

Example (text):

```ts
// controllers/textController.ts
import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { generateText } from '../services/text';

export function useTextController() {
  const provider = useSelectionsStore((s) => s.provider) || '';
  const model = useSelectionsStore((s) => s.model) || '';
  const addItem = useThreadStore((s) => s.addItem);
  const [isGenerating, setIsGenerating] = useState(false);

  const execute = useCallback(
    async (prompt: string) => {
      if (!provider || !model) return;
      addItem({
        role: 'user',
        capability: 'text',
        provider,
        model,
        parts: [{ kind: 'text', content: prompt }],
      });
      setIsGenerating(true);
      try {
        const res = await generateText({ provider, model, prompt });
        addItem({
          role: 'assistant',
          capability: 'text',
          provider,
          model,
          parts: [{ kind: 'text', content: String(res?.content ?? '') }],
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [provider, model, addItem],
  );

  return { execute, isGenerating };
}
```

```ts
// controllers/interaction.ts
export function useInteraction() {
  const capability = useSelectionsStore((s) => s.capability);
  const text = useTextController();
  const image = useImageController();
  const video = useVideoController();
  const isGenerating = text.isGenerating || image.isGenerating || video.isGenerating;
  const submit = useCallback(
    (prompt: string) => {
      if (capability === 'text') return text.execute(prompt);
      if (capability === 'image') return image.execute(prompt);
      return video.execute(prompt);
    },
    [capability, text.execute, image.execute, video.execute],
  );
  return { submit, isGenerating };
}
```

#### Stores

- **`useSelectionsStore`**: keep as-is (capability/provider/model/streaming)
- **`useTextThreadStore`**: manages `TextMessage[]`
- **`useImageGalleryStore`**: manages an array of image results (and maybe history across prompts)
- **`useVideoGalleryStore`**: analogous to images

These are independent, so switching capability doesn’t erase state. Greeting visibility becomes: “show greeting if the current capability store has no results/messages”.

#### Components

- **`InputBar`** (rename of `ChatInput`):
  - Props: `value`, `onChange`, `onSubmit`, `providers`, `models`, `selectedProvider`, `selectedModel`, `selectedCapability`, `onSelectCapability`
  - No capability-specific branching; placeholder text can optionally adapt, but behavior stays the same

- **`ResultSurface`**:
  - Reads selected capability
  - For `text`: render `TextThread` with `useTextThreadStore`
  - For `image`: render `ImageGallery` with `useImageGalleryStore`
  - For `video`: render `VideoGallery` with `useVideoGalleryStore`
  - If the chosen store is empty: render `Greeting`

- **`App.tsx`**:
  - Top-level discovery and selection
  - Renders `ResultSurface`
  - Renders `InputBar` wired to `useInteraction()`

### Validation Rules and UX

- Require `provider` and `model` before executing. If missing, surface a toast/banner or inline hint; don’t let controllers infer provider by fetching all models.
- Keep the input visible regardless of capability. Only results surface changes.
- Persist per-capability results in their own stores so users can switch back and forth without losing context.

### API/Types Cleanup

- **Unify types**: export and consume `ModelOut` from a single source (`types/api.ts`), delete the duplicate in `hooks/useModels.ts`.
- **Env var name**: standardized on `VITE_API_BASE_URL` across code and docs.
- **Binary handling**: for images, the backend should return `data` as base64 with media type (`data:image/png;base64,...`) to avoid latin1 encoding quirks. If that’s not possible, the client should convert bytes to base64 safely via `Blob`/`FileReader`.

### Step-by-step Refactor Plan

1. **Introduce domain types** (`domain/`) and result unions
2. **Split services** into `services/text.ts`, `services/images.ts`, `services/video.ts`
3. **Create stores**: `textThread`, `imageGallery`, `videoGallery`
4. **Extract controllers** for each capability
5. **Add `useInteraction`** that selects controller by capability
6. **Rename `ChatInput` → `InputBar`** and change props to `onSubmit(prompt: string)`; wire to `useInteraction().submit`
7. **Create `ResultSurface`** and make `App.tsx` render it unconditionally (no conditional greeting tied to text)
8. **Remove capability branching** from `useChat`; delete/replace with `useTextController`
9. **Unify `ModelOut`** type usage and fix env var naming
10. **Delete dead/duplicate hooks** (old `useModels` if superseded by query hooks)

### What This Fixes

- Greeting visibility no longer depends on text-only state
- Input remains the same across capabilities
- Capability logic lives in a single, swappable controller layer
- API calls are isolated and testable, stores are simple
- Reduced duplication, clearer mental model

### Optional Enhancements

- **Result history** per capability with tabs (e.g., per prompt) for images/videos
- **Background jobs** and polling for video generation
- **Streaming text** integration via WebSocket for the text controller

---

This architecture keeps UX consistent (one input, one surface) while enforcing clean boundaries between input, capability execution, and API details. It also makes adding new capabilities straightforward: implement a controller, a store, and a surface component, then register it with `useInteraction`.

### Task Breakdown and Checklist

#### Analysis (complete)

- [x] Audit current coupling and UX issues
- [x] Draft refactor architecture and plan in `ui-refacto.md`

#### Foundation & Cleanup

- [x] Standardize env var naming in code and docs (decided: `VITE_API_BASE_URL`)
- [x] Unify `ModelOut` type in `src/types/api.ts`; remove duplicate from `hooks/useModels.ts`
- [x] Remove provider inference logic from any execution path (validation happens before submit)

#### Services Layer

- [x] Create `src/services/text.ts` and move `generateText` there
- [x] Create `src/services/images.ts` and move `generateImages` there
- [x] Create `src/services/video.ts` (stub with TODO for API contract)
- [x] Split into `services/base.ts` (config/helpers) and `services/discovery.ts` (health/capabilities/providers/models)
- [x] Remove broad `services/api.ts` usage; update imports across the app

#### Stores

- [x] Create `src/stores/thread` with a single mixed-content conversation
  - [x] `items: ThreadItem[]`
  - [x] Action: `addItem({ role, capability, provider, model, parts })`, plus `clear()`
  - [x] Optional convenience wrappers: `addText(content, role)`, `addImages(images, role)`, `addVideos(videos, role)`
  - [x] Selectors: `selectAllImages(items)`, `selectAllVideos(items)` for gallery views
  - [ ] Optional: persist to localStorage

Store breakdown (separation of concerns):

- `src/domain/thread.ts`: Role, ContentPart, ThreadItem, ThreadItemInput (types only)
- `src/lib/id.ts`: `generateId()` utility
- `src/stores/thread/store.ts`: Zustand store and actions (`addItem`, `addText`, `addImages`, `addVideos`, `clear`)
- `src/stores/thread/selectors.ts`: derived selectors (`selectAllImages`, `selectAllVideos`)
- `src/stores/thread/index.ts`: barrel re-exports (store, selectors, and types)

#### Controllers

- [x] Implement `src/controllers/textController.ts` (`useTextController`) to call text service and append assistant text to the thread
- [x] Implement `src/controllers/imageController.ts` (`useImageController`) to call image service and append assistant images to the thread
- [x] Implement `src/controllers/videoController.ts` (`useVideoController`) to call video service and append assistant videos to the thread
- [x] Add `src/controllers/index.ts` barrel to export all controllers

#### Interaction Layer

- [x] Implement `src/controllers/interaction.ts` with `useInteraction` exposing `{ submit(prompt), isGenerating }`
- [x] Ensure only one controller executes based on `useSelectionsStore().capability`

#### Components (Views)

- [x] Rename `src/components/chat/ChatInput.tsx` to `src/components/input/InputBar.tsx`
- [x] Change props to `onSend(prompt: string)` and delegate provider/model/capability changes via props
- [x] Create `src/components/results/ResultSurface.tsx` that renders Greeting when thread empty or the conversation when not
- [x] Create `src/components/results/ThreadItemView.tsx` to render a single ThreadItem (iterate its parts)
- [ ] Create presentational parts:
  - [x] `src/components/results/parts/TextPart.tsx`
  - [x] `src/components/results/parts/ImagePart.tsx`
  - [x] `src/components/results/parts/VideoPart.tsx`
- [x] Make input placeholder adapt to capability (optional polish)

Text rendering:

- [x] Render text parts as Markdown (.md) using `react-markdown` with `remark-gfm` for proper formatting

Styling polish (planned):

- [x] Style `ResultSurface` and `ThreadItemView` with CSS modules to match previous chat layout
- [x] Use `useInteraction().isGenerating` to show rotating star loader (reuse spinner from `MessagesList`)
- [x] Align turns left/right and show avatars based on role (user vs assistant)
- [x] Ensure spacing and add bottom spacer so `InputBar` doesn’t overlap content
- [ ] Reuse tokens from `MessagesList.module.css` where sensible

#### App Wiring

- [x] Update `src/App.tsx` to render `ResultSurface` and `InputBar` unconditionally (no conditional greeting tied to text)
- [x] Wire `InputBar.onSend` to `useInteraction().submit`
- [x] Keep discovery-driven provider/model lists; remove any execution logic from App
- [x] Remove usage of `hooks/useChat.ts` and delete the file after migration

#### Discovery / Queries

- [x] Choose single source for models: prefer `lib/queries/discovery.ts`; remove `hooks/useModels.ts` if redundant
- [x] Keep a single `capabilityFilterMap` and reuse it

#### Backend Integration

- [x] Include `images` router in API (already added)
- [ ] Align image response format (prefer `data:image/*;base64,....`) or add robust client-side conversion
- [ ] Define video generation endpoint contract (method, payload, response), implement later

#### UX & Validation

- [ ] Prevent submit until provider/model selected; show inline hint near selectors
- [ ] Preserve per-capability results when switching (stores independent of view)
- [ ] Add keyboard shortcut support (Enter to submit; Shift+Enter to newline if needed later)

#### Testing & CI

- [ ] Unit test controllers (mock services, assert store updates)
- [ ] E2E smoke tests for text/image flows
- [ ] Ensure lints and type checks pass

#### Documentation

- [ ] Update `README.md` to reflect InputBar and ResultSurface
- [ ] Link this architecture document from the repo root (ADR/Docs section)
