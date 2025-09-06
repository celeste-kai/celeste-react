import React from "react";
import type { ReactNode } from "react";

interface StateContainerProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  children: ReactNode;
}

/**
 * Reusable component for handling loading, error, and empty states
 * Simplifies conditional rendering patterns across the app
 */
export function StateContainer({
  isLoading,
  error,
  isEmpty,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
}: StateContainerProps) {
  if (isLoading) {
    if (!loadingComponent)
      throw new Error("Loading component required but not provided");
    return <>{loadingComponent}</>;
  }

  if (error) {
    if (!errorComponent)
      throw new Error(`Error occurred but no error component provided: ${error}`);
    return <>{errorComponent}</>;
  }

  if (isEmpty) {
    if (!emptyComponent) throw new Error("Empty state but no empty component provided");
    return <>{emptyComponent}</>;
  }

  return <>{children}</>;
}

function _DefaultLoading() {
  return <div className="loading">Loading...</div>;
}

function _DefaultError({ error }: { error: string }) {
  return <div className="error">{error}</div>;
}

function _DefaultEmpty() {
  return <div className="empty">No items to display</div>;
}

/**
 * Higher-order component version for class components or function wrapping
 */
export function withStateContainer<P extends object>(
  Component: React.ComponentType<P>,
  stateSelector: (
    props: P,
  ) => Pick<StateContainerProps, "isLoading" | "error" | "isEmpty">,
) {
  return function WrappedComponent(props: P) {
    const states = stateSelector(props);

    return (
      <StateContainer {...states}>
        <Component {...props} />
      </StateContainer>
    );
  };
}
