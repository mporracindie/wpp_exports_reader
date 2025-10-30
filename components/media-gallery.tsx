"use client";

import { useState } from "react";
import { ChatMessage, getAttachmentType } from "@/lib/chat-parser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Download, Play, Music, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  filename: string;
  url: string;
  type: "photo" | "video" | "audio" | "sticker" | "document";
  message: ChatMessage;
}

interface MediaGalleryProps {
  messages: ChatMessage[];
  mediaFiles: Map<string, string>;
  onClose: () => void;
}

export function MediaGallery({ messages, mediaFiles, onClose }: MediaGalleryProps) {
  const [activeTab, setActiveTab] = useState<string>("photos");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Collect all media from messages
  const media: MediaItem[] = [];
  messages.forEach((message) => {
    message.attachments.forEach((filename) => {
      const type = getAttachmentType(filename);
      const url = mediaFiles.get(filename) || filename;
      media.push({ filename, url, type, message });
    });
  });

  // Group media by type
  const photos = media.filter((m) => m.type === "photo");
  const videos = media.filter((m) => m.type === "video");
  const audios = media.filter((m) => m.type === "audio");
  const stickers = media.filter((m) => m.type === "sticker");
  const documents = media.filter((m) => m.type === "document");

  const stats = {
    photos: photos.length,
    videos: videos.length,
    audios: audios.length,
    stickers: stickers.length,
    documents: documents.length,
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div>
          <h2 className="text-xl font-semibold">Media Gallery</h2>
          <p className="text-sm text-muted-foreground">
            {media.length} items total
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b px-4 flex-shrink-0">
          <TabsTrigger value="photos" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Photos ({stats.photos})
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Play className="w-4 h-4" />
            Videos ({stats.videos})
          </TabsTrigger>
          <TabsTrigger value="audios" className="gap-2">
            <Music className="w-4 h-4" />
            Audio ({stats.audios})
          </TabsTrigger>
          <TabsTrigger value="stickers" className="gap-2">
            <span className="text-lg">😊</span>
            Stickers ({stats.stickers})
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            Documents ({stats.documents})
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto min-h-0">
          <TabsContent value="photos" className="mt-0 p-4 h-full">
            <MediaGrid items={photos} onItemClick={setSelectedMedia} />
          </TabsContent>

          <TabsContent value="videos" className="mt-0 p-4 h-full">
            <MediaGrid items={videos} onItemClick={setSelectedMedia} />
          </TabsContent>

          <TabsContent value="audios" className="mt-0 p-4 h-full">
            <AudioList items={audios} />
          </TabsContent>

          <TabsContent value="stickers" className="mt-0 p-4 h-full">
            <MediaGrid items={stickers} onItemClick={setSelectedMedia} gridCols={8} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0 p-4 h-full">
            <DocumentList items={documents} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Lightbox */}
      {selectedMedia && (
        <MediaLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </div>
  );
}

interface MediaGridProps {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
  gridCols?: number;
}

function MediaGrid({ items, onItemClick, gridCols = 4 }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>No items found</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-2",
      gridCols === 4 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      gridCols === 8 && "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
    )}>
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onItemClick(item)}
          className="aspect-square rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all group relative"
        >
          {item.type === "video" ? (
            <>
              <video
                src={item.url}
                className="w-full h-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </>
          ) : (
            <img
              src={item.url}
              alt={item.filename}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
        </button>
      ))}
    </div>
  );
}

interface AudioListProps {
  items: MediaItem[];
}

function AudioList({ items }: AudioListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>No audio files found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.filename}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(item.message.timestamp).toLocaleDateString()}
            </p>
          </div>
          <audio src={item.url} controls className="h-10" />
        </div>
      ))}
    </div>
  );
}

interface DocumentListProps {
  items: MediaItem[];
}

function DocumentList({ items }: DocumentListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>No documents found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.url}
          download={item.filename}
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
        >
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.filename}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(item.message.timestamp).toLocaleDateString()}
            </p>
          </div>
          <Download className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      ))}
    </div>
  );
}

interface MediaLightboxProps {
  media: MediaItem;
  onClose: () => void;
}

function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/10"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        {media.type === "photo" || media.type === "sticker" ? (
          <img
            src={media.url}
            alt={media.filename}
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
        ) : media.type === "video" ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="w-full h-auto max-h-[85vh] rounded-lg"
          />
        ) : null}

        <div className="mt-4 text-center">
          <p className="text-white text-sm">{media.filename}</p>
          <p className="text-white/60 text-xs mt-1">
            {new Date(media.message.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

