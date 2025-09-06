# Celeste Conversation History Setup Guide

This guide covers how to set up and integrate the conversation history feature with Supabase.

## Prerequisites

- Supabase project configured with authentication
- Environment variables configured (`.env.local`):
  ```env
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

## 1. Database Setup

### Apply Migrations

Run the SQL migrations in your Supabase SQL editor:

1. **Create Schema**: Execute `supabase/migrations/001_create_conversations_schema.sql`
2. **Setup RLS**: Execute `supabase/migrations/002_setup_rls_policies.sql`

### Verify Tables

Your Supabase dashboard should now show these tables:

- `conversations`
- `conversation_messages`
- `conversation_attachments`

## 2. Authentication Integration

The conversation system integrates with the existing `AuthContext`. Make sure your app is wrapped with both providers:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{/* Your app components */}</AuthProvider>
    </QueryClientProvider>
  );
}
```

## 3. Integration with Existing Components

### Add Conversation Manager to Your Layout

```tsx
import { useState } from "react";
import { ConversationManager } from "./components/conversations";

function Layout() {
  const [isConversationOpen, setIsConversationOpen] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ConversationManager
        isOpen={isConversationOpen}
        onToggle={() => setIsConversationOpen(!isConversationOpen)}
      />
      <main style={{ flex: 1 }}>{/* Your main content */}</main>
    </div>
  );
}
```

### Update Controllers to Save Conversations

Your existing controllers (textController, imageController, etc.) should be updated to save conversations:

```tsx
// Example: textController.ts
import { useThreadStore } from "../stores/thread/store";

export function useTextController() {
  const {
    addText,
    createNewConversation,
    saveCurrentConversation,
    currentConversationId,
  } = useThreadStore();

  const handleSubmit = async (prompt: string, params: any) => {
    // Create conversation if none exists
    if (!currentConversationId) {
      await createNewConversation();
    }

    // Add user message
    addText(prompt, { role: "user", ...params });

    // ... your existing AI generation logic ...

    // Save conversation after changes
    await saveCurrentConversation();
  };

  return { handleSubmit };
}
```

## 4. Features Available

### Core Features

- ✅ **Persistent Storage**: All conversations saved to Supabase
- ✅ **Real-time Updates**: Live syncing across sessions
- ✅ **Search**: Search through conversation titles and content
- ✅ **Auto-save**: Conversations save automatically every 30 seconds
- ✅ **User Authentication**: Each user sees only their conversations

### UI Features

- ✅ **Conversation List**: Browse conversation history
- ✅ **Create New**: Start new conversations
- ✅ **Delete**: Remove unwanted conversations
- ✅ **Auto-naming**: Conversations auto-titled from first message
- ✅ **Last Activity**: Shows when conversations were last updated

### Technical Features

- ✅ **Caching**: TanStack Query for optimal performance
- ✅ **Offline Support**: Works offline with sync when reconnected
- ✅ **Error Handling**: Graceful error states and recovery
- ✅ **TypeScript**: Full type safety

## 5. Usage Examples

### Basic Usage

```tsx
import { useThreadStore } from "./stores/thread/store";

function ChatInterface() {
  const {
    items,
    createNewConversation,
    loadConversation,
    currentConversationId,
    isLoading,
  } = useThreadStore();

  const handleNewChat = async () => {
    await createNewConversation("My New Chat");
  };

  const handleLoadChat = async (conversationId: string) => {
    await loadConversation(conversationId);
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <div>Current conversation: {currentConversationId}</div>
      <div>Messages: {items.length}</div>
    </div>
  );
}
```

### Using Conversation Hooks

```tsx
import { useConversations, useCreateConversation } from "./hooks/useConversations";

function ConversationList() {
  const { data: conversations, isLoading } = useConversations();
  const createMutation = useCreateConversation();

  const handleCreate = async () => {
    const conversation = await createMutation.mutateAsync({
      title: "New Conversation",
    });
    console.log("Created:", conversation);
  };

  return (
    <div>
      <button onClick={handleCreate}>Create New</button>
      {conversations?.map((conv) => (
        <div key={conv.id}>{conv.title}</div>
      ))}
    </div>
  );
}
```

## 6. Customization

### Styling

The components use CSS modules. Customize by:

1. Override CSS variables in your global styles
2. Create custom CSS modules
3. Use className props to apply custom styles

### Configuration

- **Auto-save interval**: Modify the interval in `ConversationManager.tsx`
- **Query caching**: Adjust stale times in `useConversations.ts`
- **Real-time subscriptions**: Configure in `conversationRealtimeService.ts`

## 7. Troubleshooting

### Common Issues

**Authentication Required**

- Ensure user is signed in before creating/loading conversations
- Check RLS policies are correctly applied

**Real-time Not Working**

- Verify Supabase Realtime is enabled
- Check network connectivity
- Confirm RLS policies allow real-time subscriptions

**Data Not Persisting**

- Check user authentication state
- Verify Supabase connection configuration
- Review browser console for errors

### Debug Mode

Enable React Query devtools in development:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Add to your app
<ReactQueryDevtools initialIsOpen={false} />;
```

## 8. Performance Considerations

- **Pagination**: Large conversation lists are paginated
- **Lazy Loading**: Messages load only when conversation opens
- **Caching**: Aggressive caching reduces API calls
- **Real-time Optimization**: Subscriptions only for active conversations

## 9. Security

- **Row Level Security**: Users can only access their own data
- **API Security**: All requests authenticated via Supabase Auth
- **Data Validation**: Input validation on client and server
- **Safe Deletion**: Cascade deletes protect data integrity

## Next Steps

1. Apply the database migrations
2. Integrate the conversation manager into your layout
3. Update your controllers to use conversation methods
4. Test the full workflow
5. Customize styling to match your design system
