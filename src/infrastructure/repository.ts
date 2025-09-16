import { supabase } from "../lib/supabase";
import { Thread } from "../domain/entities/Thread";
import { Message } from "../domain/entities/Message";
import { Conversation } from "../domain/entities/Conversation";

export const repository = {
  async saveThread(thread: Thread, conversationId: string): Promise<void> {
    const changes = thread.getChanges();
    if (!changes.length) return;

    const grouped = {
      add: changes.filter(c => c.type === "add"),
      update: changes.filter(c => c.type === "update"),
      delete: changes.filter(c => c.type === "delete")
    };

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id || "";

    const mapMessageToRecord = (message: Message) => ({
      id: message.getId(),
      provider: message.provider,
      capability: message.capability,
      model: message.model,
      content: message.getParts(),
      role: message.role,
      created_at: new Date(message.createdAt).toISOString(),
      order_index: message.createdAt
    });

    await Promise.all([
      grouped.add.length &&
        supabase.from("conversation_messages")
          .insert(grouped.add.map(c => ({
            ...mapMessageToRecord(c.entity),
            conversation_id: conversationId,
            user_id: userId
          }))),

      grouped.update.length &&
        supabase.from("conversation_messages")
          .upsert(grouped.update.map(c => ({
            ...mapMessageToRecord(c.entity),
            conversation_id: conversationId,
            user_id: userId
          }))),

      grouped.delete.length &&
        supabase.from("conversation_messages")
          .delete()
          .in("id", grouped.delete.map(c => c.id))
    ].filter(Boolean));

    thread.markClean();
  },

  async loadThread(conversationId: string): Promise<Thread> {
    const { data } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("order_index");

    const thread = Thread.create();

    if (data) {
      data.forEach((row: any) => {
        thread.addExistingMessage(Message.fromData({
          id: row.id,
          provider: row.provider,
          capability: row.capability,
          model: row.model,
          content: { parts: row.content },
          role: row.role,
          createdAt: new Date(row.created_at).getTime()
        }));
      });
    }

    return thread;
  },

  async saveConversation(conversation: Conversation): Promise<void> {
    const data = conversation.toJSON();
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id || "";

    await supabase.from("conversations")
      .upsert({
        ...data,
        user_id: userId
      });
  },

  async loadConversations(limit: number = 20): Promise<Conversation[]> {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(limit);

    return (data || []).map((row: any) =>
      Conversation.fromData({
        id: row.id,
        title: row.title,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        metadata: row.metadata
      })
    );
  },

  async deleteConversation(id: string): Promise<void> {
    await supabase.from("conversations").delete().eq("id", id);
  }
};
