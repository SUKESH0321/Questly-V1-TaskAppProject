import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Phone, Video, MoreHorizontal, ArrowLeft, Paperclip } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    lastMessage: "Sure, I can help with that! When are you available?",
    lastTime: "2m ago",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", text: "Hi! I saw your task about deep cleaning.", sender: "them", time: "2:15 PM" },
      { id: "m2", text: "Yes, I need it done this weekend.", sender: "me", time: "2:16 PM" },
      { id: "m3", text: "Sure, I can help with that! When are you available?", sender: "them", time: "2:18 PM" },
    ],
  },
  {
    id: "conv-2",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    lastMessage: "I'll bring my own cleaning supplies",
    lastTime: "1h ago",
    unread: 0,
    online: false,
    messages: [
      { id: "m4", text: "Hello! I'm interested in the cleaning task.", sender: "them", time: "1:00 PM" },
      { id: "m5", text: "Great! Do you have equipment?", sender: "me", time: "1:05 PM" },
      { id: "m6", text: "I'll bring my own cleaning supplies", sender: "them", time: "1:10 PM" },
    ],
  },
  {
    id: "conv-3",
    name: "Emily Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    lastMessage: "Perfect, see you tomorrow!",
    lastTime: "3h ago",
    unread: 1,
    online: true,
    messages: [
      { id: "m7", text: "The delivery will be ready by 9 AM.", sender: "them", time: "11:00 AM" },
      { id: "m8", text: "Perfect, see you tomorrow!", sender: "me", time: "11:05 AM" },
    ],
  },
  {
    id: "conv-4",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    lastMessage: "I can fix the sink tomorrow afternoon",
    lastTime: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: "m9", text: "I can fix the sink tomorrow afternoon", sender: "them", time: "Yesterday" },
      { id: "m10", text: "That works for me!", sender: "me", time: "Yesterday" },
    ],
  },
];

export default function MessagesPage() {
  const navigate = useNavigate();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = DUMMY_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConv) return;
    setMessageInput("");
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // Mobile: show conversation list or chat
  const [showChat, setShowChat] = useState(false);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    setShowChat(true);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation List */}
      <div className={`w-full md:w-96 border-r border-border bg-card flex flex-col ${
        showChat ? "hidden md:flex" : "flex"
      }`}>
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
          {filteredConversations.length === 0 ? (
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
                    <AvatarImage src={conv.avatar} />
                    <AvatarFallback>{initials(conv.name)}</AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground truncate">{conv.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conv.lastTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs">
                    {conv.unread}
                  </Badge>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${showChat ? "flex" : "hidden md:flex"}`}>
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
                <AvatarImage src={selectedConv.avatar} />
                <AvatarFallback>{initials(selectedConv.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{selectedConv.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedConv.online ? "Online" : "Offline"}
                </p>
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
              {selectedConv.messages.map((msg) => (
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
                        msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
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
              <h3 className="font-bold text-lg text-foreground">Your Messages</h3>
              <p className="text-muted-foreground text-sm mt-1">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}