# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Celeste React is the frontend interface for the Celeste multi-modal AI framework. It's a React + TypeScript application built with Vite that provides a unified interface for text generation, image generation/editing, and video generation capabilities.

## Architecture

### State Management

- **Zustand stores**: Primary state management solution
  - `useThreadStore` (`src/stores/thread/store.ts`): Manages conversation threads and messages
  - `useSelectionsStore` (`src/lib/store/selections.ts`): Manages UI selections (capability, provider, model, filters)
- **TanStack Query**: Server state management and API caching (configured in `src/lib/queryClient.ts`)
- **Local storage**: Persists user selections across sessions

### Component Architecture

- **Hook-based logic**: Complex stateful logic extracted into custom hooks (`src/hooks/`)
- **Component composition**: Clean separation between UI components and business logic
- **CSS Modules**: Scoped styling with `.module.css` files
- **Capability-based UI**: Components adapt based on selected capability (text/image/video)

### Key Patterns

- **Custom hooks**: `useSelections`, `useModelSelection`, `useInputHandling`, `useDragAndDrop`
- **Controller pattern**: Business logic in `src/controllers/` for different capabilities
- **Type-safe API**: TypeScript definitions in `src/types/api.ts`
- **Stream handling**: Real-time response streaming in `src/lib/stream.ts`

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

- Components in `src/components/` are organized by feature area (chat, controls, image, input, results, video)
- Shared/common components in `src/common/components/`
- Use CSS modules for component-specific styles
- Follow the existing pattern of extracting complex logic into custom hooks

### State Updates

- Thread state updates are immutable using Zustand patterns
- Selection state is persisted to localStorage automatically
- Use TanStack Query for server data fetching and caching

### API Integration

- Services in `src/services/` handle API communication
- Base API configuration in `src/services/base.ts`
- Streaming responses handled through `src/lib/stream.ts`

### Adding New Capabilities

1. Add capability type to `CapabilityId` in `src/lib/store/selections.ts`
2. Create controller in `src/controllers/`
3. Add UI components in appropriate `src/components/` subdirectory
4. Update `useModelSelection` hook to include new capability
5. Add API service in `src/services/`

## Important Patterns

### Stream Processing

The app handles real-time streaming responses from the API using NDJSON format. See `src/lib/stream.ts` for the streaming implementation.

### Image Upload Flow

Images can be uploaded via drag-and-drop or file selection. The `useImageUpload` hook handles all image upload logic and state management.

### Model Selection

The model selection system filters available models based on the selected capability and provider. This ensures only compatible models are shown for each use case.
