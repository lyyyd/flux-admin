"use client";

import { useState } from "react";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const contacts = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/avatars/01.png",
    lastMessage: "See you tomorrow!",
    time: "2m ago",
    online: true
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/avatars/02.png",
    lastMessage: "Thanks for the update",
    time: "1h ago",
    online: true
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "/avatars/03.png",
    lastMessage: "Can we schedule a call?",
    time: "3h ago",
    online: false
  },
  {
    id: 4,
    name: "Diana Prince",
    avatar: "/avatars/04.png",
    lastMessage: "Great work on the project!",
    time: "5h ago",
    online: true
  },
  {
    id: 5,
    name: "Ethan Hunt",
    avatar: "/avatars/05.png",
    lastMessage: "Let me know when you're free",
    time: "1d ago",
    online: false
  }
];

const mockMessages = [
  {
    id: 1,
    sender: "other",
    content: "Hey! How are you doing?",
    time: "10:30 AM"
  },
  {
    id: 2,
    sender: "me",
    content: "I'm doing great! Just working on the new features.",
    time: "10:32 AM"
  },
  {
    id: 3,
    sender: "other",
    content: "That sounds exciting! Need any help?",
    time: "10:33 AM"
  },
  {
    id: 4,
    sender: "me",
    content: "Thanks! I might reach out later if I get stuck.",
    time: "10:35 AM"
  },
  {
    id: 5,
    sender: "other",
    content: "Sure thing! I'll be around.",
    time: "10:36 AM"
  }
];

export default function ChatsPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Contacts List */}
      <Card className="flex w-80 flex-col">
        <div className="space-y-4 p-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`hover:bg-accent w-full rounded-lg p-3 text-left transition-colors ${
                  selectedContact.id === contact.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium">{contact.name}</p>
                      <span className="text-muted-foreground text-xs">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate text-sm">
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={selectedContact.avatar}
                alt={selectedContact.name}
              />
              <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedContact.name}</h3>
              <p className="text-muted-foreground text-xs">
                {selectedContact.online ? "Active now" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.sender === "me"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  setMessage("");
                }
              }}
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
