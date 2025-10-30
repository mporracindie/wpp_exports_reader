import { memo } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage as BaseChatMessage, formatMessageTime, getAttachmentType } from "@/lib/chat-parser";
import { FileText } from "lucide-react";
import { LazyAudioPlayer } from "./lazy-audio-player";

// Extended message type that includes URL mappings for attachments
interface ChatMessage extends Omit<BaseChatMessage, 'attachments'> {
  attachments: Array<{ filename: string; url: string } | string>;
}

interface ChatMessageProps {
  message: ChatMessage;
  isOwn?: boolean;
  showSender?: boolean;
  searchQuery?: string;
  isHighlighted?: boolean;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-300 text-gray-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export const ChatMessageBubble = memo(function ChatMessageBubble({ 
  message, 
  isOwn = false, 
  showSender = true,
  searchQuery = "",
  isHighlighted = false 
}: ChatMessageProps) {
  const hasContent = message.content && message.content.trim() !== '';
  
  return (
    <div className={cn("flex gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[75%] rounded-lg px-3 py-2 shadow-sm transition-all",
        isOwn ? "bg-[#d9fdd3] dark:bg-[#005c4b]" : "bg-white dark:bg-[#1f2c33]",
        isHighlighted && "ring-2 ring-yellow-400 ring-offset-2"
      )}>
        {showSender && (
          <div className={cn("text-sm font-semibold mb-1", isOwn ? "text-[#128c7e] dark:text-[#00d9a3]" : "text-primary dark:text-[#00a884]")}>
            {searchQuery ? highlightText(message.sender, searchQuery) : message.sender}
          </div>
        )}
        
        {message.attachments.map((attachment, idx) => {
          const filename = typeof attachment === 'string' ? attachment : attachment.filename;
          const url = typeof attachment === 'string' ? attachment : attachment.url;
          return (
            <AttachmentPreview 
              key={idx} 
              filename={filename}
              url={url}
            />
          );
        })}
        
        {hasContent && (
          <div className="text-sm whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">
            {searchQuery ? highlightText(message.content, searchQuery) : message.content}
          </div>
        )}
        
        <div className={cn("text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-right")}>
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
});

interface AttachmentPreviewProps {
  filename: string;
  url: string;
}

function AttachmentPreview({ filename, url }: AttachmentPreviewProps) {
  const type = getAttachmentType(filename);
  const displayName = filename.split('/').pop() || filename;
  
  switch (type) {
    case 'photo':
      return (
        <div className="mb-2 rounded overflow-hidden bg-gray-100 min-h-[100px] flex items-center justify-center">
          <img 
            src={url} 
            alt="Chat attachment"
            loading="lazy"
            decoding="async"
            className="max-w-full h-auto max-h-[300px] object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center gap-2 p-2"><div class="w-8 h-8 flex items-center justify-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div><span class="text-sm">${displayName}</span></div>`;
            }}
          />
        </div>
      );
      
    case 'video':
      return (
        <div className="mb-2 rounded overflow-hidden bg-gray-100 min-h-[100px] flex items-center justify-center">
          <video 
            src={url} 
            controls
            preload="metadata"
            className="max-w-full h-auto max-h-[300px]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center gap-2 p-2"><div class="w-8 h-8 flex items-center justify-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></div><span class="text-sm">${displayName}</span></div>`;
            }}
          />
        </div>
      );
      
    case 'sticker':
      return (
        <div className="mb-2 bg-transparent min-h-[128px] min-w-[128px] flex items-center justify-center">
          <img 
            src={url} 
            alt="Sticker"
            loading="lazy"
            decoding="async"
            className="w-32 h-32 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<div class="flex items-center gap-2 p-2 bg-gray-100 rounded"><div class="w-8 h-8 flex items-center justify-center"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg></div><span class="text-sm">${displayName}</span></div>`;
            }}
          />
        </div>
      );
      
    case 'audio':
      return (
        <div className="mb-2">
          <LazyAudioPlayer src={url} className="min-w-[280px] max-w-[320px]" />
        </div>
      );
      
    case 'document':
    default:
      return (
        <a 
          href={url} 
          download={displayName}
          className="flex items-center gap-2 mb-2 p-2 bg-gray-50/50 rounded hover:bg-gray-100 transition-colors"
        >
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm truncate">{displayName}</span>
        </a>
      );
  }
}

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200/80 dark:bg-[#1f2c33] text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-lg shadow-sm">
        {date}
      </div>
    </div>
  );
}

