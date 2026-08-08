import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  ArrowLeft,
  Paperclip,
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface Conversation {
  id: string;
  otherUser: { id: string; name: string; avatar?: string } | null;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  // Track the conversationId from the URL that we still need to auto-select
  const pendingConvId = searchParams.get("conversationId");
  const handledInitialSelect = useRef(false);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/conversations");
      const convs = res.data.conversations.map((c: any) => ({
        id: c.id ?? c._id?.toString?.(),
        otherUser: c.otherUser,
        lastMessage: c.lastMessage,
        lastTime: c.lastTime,
        messages: [],
      }));
      setConversations(convs);
    } catch (err) {
      console.error("Failed to fetch conversations", err);
      setError("We couldn’t load your conversations right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const fetchMessages = useCallback(
    async (convId: string) => {
      try {
        const res = await api.get(`/conversations/${convId}/messages`);
        const msgs = res.data.messages.map((m: any) => ({
          id: m.id ?? m._id?.toString?.(),
          text: m.text,
          sender: m.senderId === user?.id ? "me" : ("them" as "me" | "them"),
          time: m.time,
        }));
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, messages: msgs } : c)),
        );
        return msgs;
      } catch (err) {
        console.error("Failed to fetch messages", err);
        return [];
      }
    },
    [user?.id],
  );

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    setShowChat(true);
    // Fetch messages for this conversation
    if (conv.messages.length === 0) {
      const msgs = await fetchMessages(conv.id);
      setSelectedConv((prev) => (prev ? { ...prev, messages: msgs } : null));
    }
  };

  // Auto-select a conversation when arriving with ?conversationId=xxx
  useEffect(() => {
    if (handledInitialSelect.current) return;
    if (!pendingConvId) return;

    const autoSelect = async () => {
      // Check if the conversation is already in the list
      const existing = conversations.find((c) => c.id === pendingConvId);
      if (existing) {
        handledInitialSelect.current = true;
        await handleSelectConversation(existing);
        return;
      }

      // Otherwise fetch it directly
      try {
        const res = await api.get(`/conversations/${pendingConvId}`);
        const convData = res.data.conversation;
        if (convData) {
          const conv: Conversation = {
            id: convData.id ?? convData._id?.toString?.(),
            otherUser: convData.otherUser,
            lastMessage: convData.lastMessage,
            lastTime: convData.lastTime,
            messages: [],
          };
          // Add it to the conversations list so it appears in the sidebar
          setConversations((prev) =>
            prev.some((c) => c.id === conv.id)
              ? prev
              : [conv, ...prev],
          );
          handledInitialSelect.current = true;
          await handleSelectConversation(conv);
        }
      } catch (err) {
        console.error("Failed to auto-select conversation", err);
      }
    };

    autoSelect();
  }, [pendingConvId, conversations]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredConversations = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConv) return;
    try {
      const res = await api.post(`/conversations/${selectedConv.id}/messages`, {
        text: messageInput.trim(),
      });
      const newMsg = res.data.message;
      const chatMsg: ChatMessage = {
        id: newMsg.id ?? newMsg._id?.toString?.(),
        text: newMsg.text,
        sender: "me",
        time: newMsg.time,
      };
      setSelectedConv((prev) =>
        prev ? { ...prev, messages: [...prev.messages, chatMsg] } : null,
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConv.id
            ? { ...c, lastMessage: newMsg.text, lastTime: newMsg.time }
            : c,
        ),
      );
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message", err);
      setError("Your message could not be sent.");
    }
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation List */}
      <div
        className={`w-full md:w-96 border-r border-border bg-card flex flex-col ${
          showChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {error && (
            <div className="m-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left ${
                  selectedConv?.id === conv.id ? "bg-muted/50" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.otherUser?.avatar} />
                    <AvatarFallback>
                      {conv.otherUser ? initials(conv.otherUser.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground truncate">
                      {conv.otherUser?.name || "Unknown"}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {conv.lastTime}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${showChat ? "flex" : "hidden md:flex"}`}
      >
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowChat(false)}
              >
                <ArrowLeft size={20} />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConv.otherUser?.avatar} />
                <AvatarFallback>
                  {selectedConv.otherUser
                    ? initials(selectedConv.otherUser.name)
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {selectedConv.otherUser?.name || "Unknown"}
                </h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <Button variant="ghost" size="icon">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="icon">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={18} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {selectedConv.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                selectedConv.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.sender === "me"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card text-foreground border border-border rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === "me"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Paperclip size={18} />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 bg-background"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Send size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Your Messages
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
