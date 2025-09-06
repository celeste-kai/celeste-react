// Type declarations for modules that TypeScript can't find

// Zustand v5 declarations
declare module "zustand" {
  import type { StateCreator } from "zustand/vanilla";

  export interface StoreApi<T> {
    getState: () => T;
    setState: (
      partial: T | Partial<T> | ((state: T) => T | Partial<T>),
      replace?: boolean,
    ) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }

  export type UseBoundStore<T> = {
    (): T;
    <U>(selector: (state: T) => U): U;
  } & StoreApi<T>;

  export function create<T>(initializer: StateCreator<T>): UseBoundStore<T>;
  export * from "zustand/vanilla";
}

// TanStack Query declarations
declare module "@tanstack/react-query" {
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export const useQuery: any;
  export const useMutation: any;
  export const useQueryClient: any;
  export const keepPreviousData: any;
  export * from "@tanstack/react-query";
}

declare module "@tanstack/react-query-devtools" {
  export const ReactQueryDevtools: any;
  export * from "@tanstack/react-query-devtools";
}

// Supabase declarations
declare module "@supabase/supabase-js" {
  export const createClient: any;
  export type User = any;
  export type Session = any;
  export type AuthError = any;
  export type RealtimeChannel = any;
  export * from "@supabase/supabase-js";
}

// React Markdown
declare module "react-markdown" {
  const ReactMarkdown: any;
  export default ReactMarkdown;
}

// Remark GFM
declare module "remark-gfm" {
  const remarkGfm: any;
  export default remarkGfm;
}

// CSS Modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// SVG imports
declare module "*.svg?url" {
  const url: string;
  export default url;
}

// Vite ImportMeta
interface ImportMeta {
  glob: (
    pattern: string,
    options?: { eager?: boolean; query?: string; import?: string },
  ) => Record<string, any>;
  env: Record<string, string>;
}
