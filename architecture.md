# Architecture Analysis & Transformation Plan

## Lines of Code Impact Analysis

**Current: 2,876 LOC**

**After Clean Architecture: ~2,200 LOC (-24%)**

## Why LESS Code:

### 1. Eliminate Duplication (-300 LOC)

```typescript
// CURRENT: Logic duplicated across components
// InputBar.tsx: 185 lines with mixed concerns
// ConversationHistory.tsx: Logic mixed with UI
// Multiple components handling same validation

// AFTER: Single source of truth
class MessageService {
  validate(content: string): Result<Message>;
  send(message: Message): Promise<void>;
}
// Components just call: messageService.send()
```

### 2. Remove Boilerplate (-200 LOC)

```typescript
// CURRENT: Manual state updates everywhere
setState((s) => ({
  items: s.items.map((item) => (item.id === id ? { ...item, parts } : item)),
}));

// AFTER: Domain handles it
thread.updateMessage(id, parts);
```

### 3. Consolidate Business Logic (-150 LOC)

```typescript
// CURRENT: Store with 141 lines doing everything
// AFTER: Split but shared logic extracted
class Thread {
  addMessage(content: string) {
    // All message logic in ONE place
  }
}
```

### 4. Simplify Data Flow (-150 LOC)

```typescript
// CURRENT: Complex prop drilling and state management
// AFTER: Clean dependency injection
const thread = useThread(); // That's it
```

### 5. Delete Redundant Code (-100 LOC)

- Remove `threadService.save()` delete-all pattern
- Remove manual type conversions
- Remove duplicate validation
- Remove unnecessary wrappers

## What Gets Added:

### Domain Models (+200 LOC)

```typescript
// Rich behavior, but replaces scattered logic
class Thread {
  addMessage(): Message;
  canAddMessage(): boolean;
  validate(): ValidationResult;
}
```

### Interfaces/Ports (+100 LOC)

```typescript
// But enables testing and swapping implementations
interface IMessageRepository {
  save(message: Message): Promise<void>;
}
```

## The Key Insight:

**Clean Architecture = LESS Code Because:**

1. **No Duplication**: Business logic in ONE place
2. **No Boilerplate**: Framework handles repetitive tasks
3. **No Coupling**: Clean interfaces = less glue code
4. **No Workarounds**: Proper patterns = direct solutions

## Real Example:

### Current `threadService.save()`: 56 lines

```typescript
async save() {
  const { items, conversationId } = useStore.getState();
  if (!items.length) return;
  let id = conversationId;
  if (!id) {
    // 10 lines creating conversation
  }
  // 15 lines deleting all messages
  // 20 lines recreating all messages
}
```

### After: 15 lines

```typescript
async save(thread: Thread) {
  const changes = thread.getChanges();
  await this.repo.batchUpdate(changes);
  thread.markClean();
}
```

## Component Simplification:

**Current `InputBar.tsx`**: 185 lines
**After**: ~80 lines (just UI, no logic)

**Current `store.ts`**: 141 lines
**After**: 3 stores × 30 lines = 90 lines total

## The Bottom Line:

**-676 lines (-24%)** by:

- Eliminating duplication
- Extracting shared logic
- Removing boilerplate
- Simplifying data flow
- Using proper patterns

**Plus these benefits:**

- 100% testable
- Easier to modify
- Faster to develop new features
- Less bugs (single source of truth)
- Better performance (optimized operations)

Clean architecture isn't about more code - it's about the RIGHT code in the RIGHT place.

---

## Backend Type Alignment

The backend (`celeste-core`) has a well-organized type system we should mirror:

### Backend Structure

- **Enums**: `Provider` (openai, anthropic, etc.), `Capability` (bitwise flags)
- **Types**: `AIResponse<T>`, `ImageArtifact`, `VideoArtifact`, `AudioArtifact`
- **Models**: `Model` class with provider, capabilities, display name

### Frontend Structure (Aligned)

```
src/
├── core/                      # Mirror backend types
│   ├── enums/
│   │   ├── capability.ts     # Exact copy of backend Capability
│   │   └── provider.ts       # Exact copy of backend Provider
│   ├── types/
│   │   ├── response.ts       # AIResponse<T> generic wrapper
│   │   ├── artifacts.ts      # Image/Video/Audio artifacts
│   │   └── message.ts        # Frontend-specific types
│   └── models/
│       └── model.ts          # Model interface matching backend
│
├── domain/                    # Business logic using core types
│   ├── entities/
│   └── services/
│
├── infrastructure/            # External integrations
└── presentation/             # UI layer
```

### Benefits

- **Type safety across stack** - Backend/frontend speak same language
- **No translation needed** - API responses map directly
- **Less code** - No conversion functions

## Implementation Steps

### Phase 1: Core Types Setup

- [x] Create `src/core/` directory structure
- [x] Mirror backend enums (Provider, Capability)
- [x] Create type definitions matching backend
- [x] Add Model interface with capability checking

### Phase 2: Domain Layer

- [x] Create Thread aggregate using core types
- [x] Implement Message entity with core types
- [x] Build Conversation entity
- [x] Define repository interfaces

### Phase 3: Infrastructure

- [x] Create API client using core types
- [x] Implement SupabaseRepository with batch updates
- [x] Remove type conversions

### Phase 4: State Management

- [x] Split monolithic store into domain stores
- [x] Remove direct store imports from services
- [x] Implement proper data flow

### Phase 5: Component Simplification

- [x] Remove business logic from InputBar (185 → 189 lines, but cleaner)
- [x] Clean up ConversationHistory
- [x] Make components presentation-only

### Phase 6: Optimize Operations

- [x] Replace delete-all pattern with diff
- [x] Implement change tracking
- [x] Add optimistic updates

## Migration Complete!

### Final Results

- **Initial**: 2,876 lines, ~60 files
- **After refactoring**: 3,119 lines (temporary increase)
- **After cleanup**: 2,462 lines, 52 files
- **Total reduction**: -414 lines (**-14.4%**)
- **Files removed**: 8 files

### What We Achieved

- Eliminated delete-all pattern with batch operations
- Clean domain layer with business logic
- Type-safe infrastructure using core types
- Separated UI, selection, and domain state
- No more tight coupling between services and stores
