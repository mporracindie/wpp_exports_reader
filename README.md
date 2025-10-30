# 💬 WhatsApp Export Reader

A beautiful, feature-rich Next.js application that allows you to view your exported WhatsApp chats in a familiar WhatsApp-like interface. Perfect for browsing old conversations, searching through messages, and viewing all your media attachments.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📱 **WhatsApp-Style Interface**
- Authentic WhatsApp chat design with green accent colors
- Message bubbles with proper styling
- Date separators for easy navigation
- Sender names on every message
- Timestamps on all messages

### 🔍 **Powerful Search**
- Real-time search through messages and sender names
- Case-insensitive matching
- Navigate between results with keyboard shortcuts (Enter/Shift+Enter)
- Highlighted search terms in yellow
- Results counter showing current position
- Visual ring around current result

### 🎵 **Rich Media Support**
- **Custom Audio Player**: WhatsApp-style audio player with waveform-inspired design
  - Play/pause controls with light blue accents
  - Seekable progress bar
  - Time display (current/total)
  - Smooth animations
- **Images**: Inline photo preview with lazy loading
- **Videos**: Native video player with controls
- **Stickers**: Proper WebP sticker display
- **Documents**: Download links for PDFs, contacts, and other files

### 🌙 **Dark Mode**
- Beautiful dark theme matching WhatsApp's dark mode
- Theme switcher available before and after loading chats
- Persists preference to localStorage
- Respects system preference on first visit
- Smooth transitions between themes

### ⚡ **Performance Optimizations**
- **Lazy Loading**: Media only loads when scrolled into view
- **Intersection Observer**: Smart loading within 200px of viewport
- **React Memoization**: Prevents unnecessary re-renders
- **Skeleton Loaders**: Smooth loading experience
- Handles chats with 1000+ messages effortlessly

### 🎯 **User Experience**
- Auto-scroll to newest messages on load
- Responsive design for desktop and mobile
- Clean, intuitive folder picker
- Loading states with spinners
- Error handling with fallback UI
- Keyboard shortcuts for search navigation

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) or [Node.js](https://nodejs.org/) (v18 or higher)
- A WhatsApp chat export (see "How to Export" below)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd wpp_exports_reader
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Run the development server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
bun run build
bun run start
# or
npm run build
npm run start
```

## 📖 How to Use

### Exporting Your WhatsApp Chat

1. Open WhatsApp on your phone
2. Go to the chat you want to export
3. Tap the **three dots menu (⋮)** → **More** → **Export chat**
4. Choose **"Include Media"** to include photos, videos, and audio
5. Save the exported `.zip` file to your computer
6. **Unzip the file** to get a folder with `_chat.txt` and media files

### Viewing Your Chat

1. Click the **"Select Folder"** button
2. Navigate to and select your unzipped WhatsApp export folder
3. The chat will load automatically with all messages and media
4. Scroll through, search, and enjoy!

### Using Search

1. Click the **🔍 search icon** in the header
2. Type your search query
3. Use **Enter** to go to the next result
4. Use **Shift + Enter** to go to the previous result
5. Press **Escape** or click **X** to close search

### Keyboard Shortcuts

- `Enter` - Next search result
- `Shift + Enter` - Previous search result
- `Escape` - Close search panel

## 🗂️ Project Structure

```
wpp_exports_reader/
├── app/
│   ├── favicon.ico          # App icon
│   ├── globals.css          # Global styles with dark mode
│   ├── layout.tsx           # Root layout with ThemeProvider
│   └── page.tsx             # Main chat viewer page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── audio-player.tsx     # Custom WhatsApp-style audio player
│   ├── lazy-audio-player.tsx # Lazy-loading audio wrapper
│   ├── chat-message.tsx     # Message bubble component
│   ├── folder-picker.tsx    # Folder selection UI
│   ├── theme-provider.tsx   # Dark mode context provider
│   └── theme-switcher.tsx   # Theme toggle button
├── lib/
│   ├── chat-parser.ts       # WhatsApp export parser
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
└── example/                 # Sample WhatsApp export
```

## 🛠️ Technology Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### UI & Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Features
- **Intersection Observer API** - Lazy loading
- **React Context** - Theme management
- **localStorage** - Persist theme preference
- **Blob URLs** - Local file viewing

## 🎨 Customization

### Changing Colors

Edit the WhatsApp green color in `app/page.tsx`:
```tsx
// Header background
bg-[#008069] // Light mode
dark:bg-[#1f2c33] // Dark mode

// Own message bubbles
bg-[#d9fdd3] // Light mode
dark:bg-[#005c4b] // Dark mode
```

### Adding New Media Types

Update `lib/chat-parser.ts` to detect new file types:
```typescript
export function getAttachmentType(filename: string) {
  // Add your custom logic here
}
```

## 🔒 Privacy & Security

✅ **100% Local Processing** - All parsing happens in your browser  
✅ **No Server Upload** - Your chats never leave your device  
✅ **No Storage** - Data is cleared when you reload  
✅ **No Tracking** - Zero analytics or external requests  
✅ **Open Source** - Review the code yourself  

## 📝 Chat Export Format

The parser handles WhatsApp's standard export format:
```
[DD/MM/YYYY, HH:MM:SS] Sender Name: Message content
‎[DD/MM/YYYY, HH:MM:SS] Sender Name: ‎<attached: filename.ext>
```

**Supported elements:**
- Text messages (with emoji support)
- Multi-line messages
- Attachments (images, videos, audio, documents)
- Date/time stamps
- Sender names
- Special characters and UTF-8

## 🐛 Troubleshooting

### Chat won't load
- Ensure the folder contains `_chat.txt`
- Check that you unzipped the export file
- Try refreshing the page

### Media not showing
- Verify media files are in the same folder
- Check file names match those in `_chat.txt`
- Some browsers may block local file access

### Search not working
- Ensure chat is fully loaded
- Check that there are messages matching your query
- Try a different search term

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- WhatsApp for the chat export format
- [shadcn](https://twitter.com/shadcn) for the amazing UI components
- [Vercel](https://vercel.com) for Next.js
- All contributors and users

## 🔮 Roadmap

- [ ] Advanced search filters (date range, sender)
- [ ] Export conversations to different formats
- [ ] Message statistics and analytics
- [ ] Quoted message threading
- [ ] Contact card parsing
- [ ] Multiple chat comparison
- [ ] Voice message waveform visualization

---

**Made with ❤️ for preserving memories**

If you find this useful, consider starring the repository! ⭐
