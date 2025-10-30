export interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  attachments: string[];
}

export interface ParsedChat {
  messages: ChatMessage[];
  participants: string[];
}

/**
 * Parses WhatsApp export chat text file
 * Format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
 */
export function parseChatFile(content: string): ParsedChat {
  const lines = content.split('\n');
  const messages: ChatMessage[] = [];
  const participantsSet = new Set<string>();
  
  // Regex to match message start: [DD/MM/YYYY, HH:MM:SS] Sender: 
  // Added optional whitespace and zero-width characters at start
  // Added optional \r at end to handle Windows line endings
  const messageRegex = /^[\s\u200E\u200F\u202A-\u202E]*\[(\d{2}\/\d{2}\/\d{4}),\s(\d{2}:\d{2}:\d{2})\]\s([^:]+):\s(.*?)\r?$/;
  const attachmentRegex = /[\u200E\u200F\u202A-\u202E]*<attached:\s*([^>]+)>/;
  
  let currentMessage: ChatMessage | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(messageRegex);
    
    if (match) {
      // Save previous message if exists
      if (currentMessage) {
        messages.push(currentMessage);
      }
      
      const [, date, time, sender, content] = match;
      
      // Parse date (DD/MM/YYYY, HH:MM:SS)
      const [day, month, year] = date.split('/').map(Number);
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const timestamp = new Date(year, month - 1, day, hours, minutes, seconds);
      
      participantsSet.add(sender);
      
      // Check for attachments
      const attachments: string[] = [];
      const attachmentMatch = content.match(attachmentRegex);
      let messageContent = content;
      
      if (attachmentMatch) {
        attachments.push(attachmentMatch[1]);
        messageContent = content.replace(attachmentRegex, '').trim();
      }
      
      currentMessage = {
        id: `${timestamp.getTime()}-${i}`,
        timestamp,
        sender,
        content: messageContent,
        attachments,
      };
    } else if (currentMessage && line.trim()) {
      // Multi-line message continuation
      currentMessage.content += '\n' + line;
    }
  }
  
  // Add last message
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  return {
    messages,
    participants: Array.from(participantsSet),
  };
}

/**
 * Groups messages by date
 */
export function groupMessagesByDate(messages: ChatMessage[]): Map<string, ChatMessage[]> {
  const grouped = new Map<string, ChatMessage[]>();
  
  messages.forEach(message => {
    const dateKey = message.timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(message);
  });
  
  return grouped;
}

/**
 * Formats time for display
 */
export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gets the attachment type from filename
 */
export function getAttachmentType(filename: string): 'audio' | 'photo' | 'video' | 'sticker' | 'document' {
  const lower = filename.toLowerCase();
  
  // Check by filename pattern first (WhatsApp naming convention)
  if (lower.includes('-audio-')) {
    return 'audio';
  }
  if (lower.includes('-photo-')) {
    return 'photo';
  }
  if (lower.includes('-video-') || lower.includes('-gif-')) {
    return 'video';
  }
  if (lower.includes('-sticker-')) {
    return 'sticker';
  }
  
  // Fallback to extension-based detection
  if (lower.endsWith('.opus') || lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.wav')) {
    return 'audio';
  }
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
    return 'photo';
  }
  if (lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.avi') || lower.endsWith('.webm')) {
    return 'video';
  }
  if (lower.endsWith('.webp')) {
    return 'sticker';
  }
  
  return 'document';
}

