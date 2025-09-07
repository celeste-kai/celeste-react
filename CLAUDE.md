# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Celeste React is the frontend interface for the Celeste multi-modal AI framework. It's a React + TypeScript application built with Vite that provides a unified interface for text generation, image generation/editing, and video generation capabilities.

## Architecture

### State Management

- **Zustand stores**: Primary state management solution
  - `useThreadStore` (`src/stores/thread.store.ts`): Manages conversation threads and messages
  - `useSelectionStore` (`src/stores/selection.store.ts`): Manages UI selections (capability, provider, model, filters)
  - `useUIStore` (`src/stores/ui.store.ts`): Manages UI state
- **TanStack Query**: Server state management and API caching (configured in `src/lib/queryClient.ts`)
- **Local storage**: Persists user selections across sessions

### Component Architecture

- **Hook-based logic**: Complex stateful logic extracted into custom hooks (`src/hooks/`)
- **Component composition**: Clean separation between UI components and business logic
- **CSS Modules**: Scoped styling with `.module.css` files
- **Capability-based UI**: Components adapt based on selected capability (text/image/video)

### Key Patterns

- **Custom hooks**: `useThread`, `useModelSelection`, `useInputHandling`, `useImageUpload`
- **Infrastructure layer**: API calls in `src/infrastructure/api.ts`, storage in `src/infrastructure/repository.ts`
- **Type-safe domain model**: TypeScript definitions in `src/domain/types.ts` and `src/core/types/`
- **Stream handling**: Real-time response streaming handled directly in API functions

## Development Commands

```bash
# Development server
npm start
npm run dev

# Build for production
npm run build
npm run preview

# Code quality
npm run check          # Run all checks (type-check + lint + format:check)
npm run type-check     # TypeScript checking only
npm run lint           # TypeScript + ESLint
npm run lint:fix       # Fix linting issues
npm run format         # Format with Prettier
npm run format:check   # Check formatting
```

## Key Development Notes

### Component Development

- Components in `src/components/` are organized by feature area (auth, chat, controls, conversations, icons, image, input, results)
- Use CSS modules for component-specific styles (`.module.css` files)
- Follow the existing pattern of extracting complex logic into custom hooks in `src/hooks/`

### State Updates

- Thread state updates are immutable using Zustand patterns
- Selection state is persisted to localStorage automatically
- Use TanStack Query for server data fetching and caching

### API Integration

- API calls in `src/infrastructure/api.ts` handle all backend communication
- Repository in `src/infrastructure/repository.ts` manages local storage
- Streaming responses handled directly in the API functions using AsyncGenerator

### Adding New Capabilities

1. Add capability type to `Capability` enum in `src/core/enums/capability.ts`
2. Add API function in `src/infrastructure/api.ts`
3. Update `useThread` hook in `src/hooks/useThread.ts` to handle new capability
4. Add UI components in appropriate `src/components/` subdirectory
5. Update `useModelSelection` hook to include new capability

## Important Patterns

### Stream Processing

The app handles real-time streaming responses from the API using NDJSON format. Streaming is implemented directly in `src/infrastructure/api.ts` using AsyncGenerator patterns.

### Image Upload Flow

Images can be uploaded via drag-and-drop or file selection. The `useImageUpload` hook handles all image upload logic and state management.

### Model Selection

The model selection system filters available models based on the selected capability and provider. This ensures only compatible models are shown for each use case.
