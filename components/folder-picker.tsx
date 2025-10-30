"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeSwitcher } from "./theme-switcher";

interface FolderPickerProps {
  onFolderSelected: (files: FileList) => void;
}

export function FolderPicker({ onFolderSelected }: FolderPickerProps) {
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      setError("No files selected");
      return;
    }
    
    // Check if _chat.txt exists
    const chatFile = Array.from(files).find(file => file.name === "_chat.txt");
    
    if (!chatFile) {
      setError("_chat.txt file not found in the selected folder");
      return;
    }
    
    onFolderSelected(files);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 relative">
      {/* Theme switcher in top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Folder className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Select WhatsApp Export Folder</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Choose the folder containing your exported WhatsApp chat. 
          Make sure it includes the _chat.txt file and any media files.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        // @ts-ignore - webkitdirectory is not in the types but works
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderSelect}
        className="hidden"
      />

      <Button
        onClick={() => inputRef.current?.click()}
        size="lg"
        className="gap-2"
      >
        <Upload className="w-5 h-5" />
        Select Folder
      </Button>

      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-muted-foreground text-center max-w-md mt-4">
        <p className="font-medium mb-2">How to export your WhatsApp chat:</p>
        <ol className="text-left space-y-1">
          <li>1. Open WhatsApp and go to the chat you want to export</li>
          <li>2. Tap the three dots menu → More → Export chat</li>
          <li>3. Choose "Include Media" or "Without Media"</li>
          <li>4. Save and unzip the exported file</li>
          <li>5. Select the unzipped folder here</li>
        </ol>
      </div>
    </div>
  );
}

