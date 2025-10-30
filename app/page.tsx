"use client";

import { useState, useEffect, useRef } from "react";
import { FolderPicker } from "@/components/folder-picker";
import { ChatMessageBubble, DateSeparator } from "@/components/chat-message";
import { parseChatFile, groupMessagesByDate, ChatMessage } from "@/lib/chat-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, X, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MediaGallery } from "@/components/media-gallery";

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelected = async (selectedFiles: FileList) => {
    setLoading(true);
    setFiles(selectedFiles);

    try {
      // Find and parse _chat.txt
      const chatFile = Array.from(selectedFiles).find(file => file.name === "_chat.txt");
      
      if (!chatFile) {
        throw new Error("_chat.txt not found");
      }

      const chatContent = await chatFile.text();
      const parsed = parseChatFile(chatContent);
      
      setMessages(parsed.messages);
      setParticipants(parsed.participants);

      // Create object URLs for media files
      const mediaMap = new Map<string, string>();
      Array.from(selectedFiles).forEach(file => {
        if (file.name !== "_chat.txt") {
          const url = URL.createObjectURL(file);
          mediaMap.set(file.name, url);
        }
      });
      setMediaFiles(mediaMap);
    } catch (error) {
      console.error("Error parsing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Clean up object URLs
    mediaFiles.forEach(url => URL.revokeObjectURL(url));
    setFiles(null);
    setMessages([]);
    setParticipants([]);
    setMediaFiles(new Map());
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    setGalleryOpen(false);
  };

  const handleGalleryToggle = () => {
    setGalleryOpen(!galleryOpen);
    if (!galleryOpen) {
      // Close search when opening gallery
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: string[] = [];

    messages.forEach(message => {
      if (
        message.content.toLowerCase().includes(query) ||
        message.sender.toLowerCase().includes(query)
      ) {
        results.push(message.id);
      }
    });

    setSearchResults(results);
    setCurrentResultIndex(0);
  }, [searchQuery, messages]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Scroll to current search result
  useEffect(() => {
    if (searchResults.length > 0 && currentResultIndex >= 0) {
      const messageId = searchResults[currentResultIndex];
      const element = document.getElementById(`message-${messageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentResultIndex, searchResults]);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleNextResult = () => {
    if (searchResults.length > 0) {
      setCurrentResultIndex((prev) => (prev + 1) % searchResults.length);
    }
  };

  const handlePrevResult = () => {
    if (searchResults.length > 0) {
      setCurrentResultIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    }
  };

  // Auto-scroll to bottom on mount when messages load
  useEffect(() => {
    if (messages.length > 0 && scrollRef.current && !searchOpen) {
      // Use a longer timeout to ensure all content (including images/media) is rendered
      const timeoutId = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, searchOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e5ddd5] dark:bg-[#0b141a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!files || messages.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e5ddd5] dark:bg-[#0b141a]">
        <FolderPicker onFolderSelected={handleFolderSelected} />
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);
  const chatName = participants.join(", ");

  // If gallery is open, show gallery view
  if (galleryOpen) {
    return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <header className="bg-[#008069] dark:bg-[#1f2c33] text-white shadow-md">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGalleryToggle}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold truncate">{chatName}</h1>
              <p className="text-xs text-white/80">Media Gallery</p>
            </div>
            
            <ThemeSwitcher variant="header" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <MediaGallery
            messages={messages}
            mediaFiles={mediaFiles}
            onClose={handleGalleryToggle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5] dark:bg-[#0b141a]">
      {/* Header */}
      <header className="bg-[#008069] dark:bg-[#1f2c33] text-white shadow-md">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">{chatName}</h1>
            <p className="text-xs text-white/80">{messages.length} messages</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGalleryToggle}
            className="text-white hover:bg-white/10"
            title="View Media Gallery"
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            className="text-white hover:bg-white/10"
          >
            <Search className="w-5 h-5" />
          </Button>
          
          <ThemeSwitcher variant="header" />
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="px-4 pb-3 pt-1 border-t border-white/10 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/90 text-gray-900 border-none placeholder:text-gray-500 pr-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.shiftKey ? handlePrevResult() : handleNextResult();
                    } else if (e.key === 'Escape') {
                      handleSearchToggle();
                    }
                  }}
                />
                {searchResults.length > 0 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-medium">
                      {currentResultIndex + 1}/{searchResults.length}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevResult}
                  disabled={searchResults.length === 0}
                  className="text-white hover:bg-white/10 h-9 w-9"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextResult}
                  disabled={searchResults.length === 0}
                  className="text-white hover:bg-white/10 h-9 w-9"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchToggle}
                  className="text-white hover:bg-white/10 h-9 w-9"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-[length:60px_60px] dark:bg-[length:60px_60px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          {Array.from(groupedMessages.entries()).map(([date, msgs]) => (
            <div key={date}>
              <DateSeparator date={date} />
              {msgs.map((message) => {
                // Create a message with resolved media URLs
                // Keep original filenames but create a structure with both filename and URL
                const messageWithMedia = {
                  ...message,
                  attachments: message.attachments.map(filename => ({
                    filename,
                    url: mediaFiles.get(filename) || filename
                  }))
                };
                
                const isSearchResult = searchResults.includes(message.id);
                const isCurrentResult = searchResults[currentResultIndex] === message.id;
                
                return (
                  <div 
                    key={message.id} 
                    id={`message-${message.id}`}
                    className={isCurrentResult ? "animate-in fade-in" : ""}
                  >
                    <ChatMessageBubble
                      message={messageWithMedia}
                      isOwn={message.sender === participants[0]}
                      showSender={true}
                      searchQuery={searchQuery}
                      isHighlighted={isCurrentResult}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#f0f2f5] dark:bg-[#1f2c33] px-4 py-2 text-center text-xs text-gray-600 dark:text-gray-400 border-t dark:border-[#2a3942]">
        Viewing exported WhatsApp chat • {messages.length} messages from {participants.length} participant(s)
      </div>
    </div>
  );
}
