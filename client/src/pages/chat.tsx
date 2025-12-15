import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Copy, Check, Sparkles, Linkedin, Moon, Sun, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { apiRequest } from "@/lib/queryClient";
import type { Message, ChatResponse } from "@shared/schema";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function Header({ sessionId }: { sessionId: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight" data-testid="text-app-title">Aaditya's AI Agent</span>
            <span className="hidden text-xs text-muted-foreground sm:block">LinkedIn Viral Post Generator</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12"
    >
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Linkedin className="h-10 w-10 text-primary-foreground" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight" data-testid="text-welcome-title">
          Create Viral LinkedIn Posts
        </h2>
        <p className="max-w-md text-muted-foreground" data-testid="text-welcome-description">
          Describe the topic or idea you want to share, and I'll help you craft an engaging post that resonates with your professional network.
        </p>
      </div>
    </motion.div>
  );
}

function UserMessage({ content, timestamp }: { content: string; timestamp: Date }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-end"
    >
      <div className="max-w-2xl space-y-1">
        <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground" data-testid="message-user">
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        <p className="pr-2 text-right text-xs text-muted-foreground" data-testid="text-message-time">
          {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

function AIMessage({ content, timestamp, isStreaming }: { content: string; timestamp: Date; isStreaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The post has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-start"
    >
      <div className="max-w-2xl space-y-2">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
            <Sparkles className="h-4 w-4 text-foreground" />
          </div>
          <div className="space-y-2">
            <div className="rounded-2xl rounded-tl-md bg-card border border-card-border px-4 py-3" data-testid="message-assistant">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {content}
                {isStreaming && (
                  <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-foreground" />
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground" data-testid="text-ai-message-time">
                {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              {!isStreaming && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
                  onClick={handleCopy}
                  data-testid="button-copy-message"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
          <Sparkles className="h-4 w-4 text-foreground" />
        </div>
        <div className="rounded-2xl rounded-tl-md bg-card border border-card-border px-4 py-3" data-testid="message-loading">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Generating your viral post...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MessageInput({
  onSend,
  isLoading,
}: {
  onSend: (message: string) => void;
  isLoading: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="sticky bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-4xl px-4 py-4 md:px-6">
        <div className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Describe the LinkedIn post you want to generate..."
              disabled={isLoading}
              className="min-h-[44px] max-h-[120px] resize-none pr-12 text-base focus-visible:ring-1 focus-visible:ring-ring"
              rows={1}
              data-testid="input-message"
            />
            <div className="absolute bottom-2 right-2">
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={!value.trim() || isLoading}
                className="h-8 w-8 rounded-full"
                aria-label="Send message"
                data-testid="button-send-message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground" data-testid="text-input-hint">
          Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to send, <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => `${Date.now()}-${generateId()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const res = await apiRequest("POST", "/api/chat", {
        message,
        sessionId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: () => {
      toast({
        title: "Failed to generate post",
        description: "Please try again. If the problem persists, refresh the page.",
        variant: "destructive",
      });
    },
  });

  const handleSend = (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(content);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header sessionId={sessionId} />

      <main className="flex flex-1 flex-col">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-6">
              <AnimatePresence mode="popLayout">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <UserMessage
                      key={message.id}
                      content={message.content}
                      timestamp={message.timestamp}
                    />
                  ) : (
                    <AIMessage
                      key={message.id}
                      content={message.content}
                      timestamp={message.timestamp}
                    />
                  )
                )}
              </AnimatePresence>
              {chatMutation.isPending && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <MessageInput onSend={handleSend} isLoading={chatMutation.isPending} />
    </div>
  );
}
