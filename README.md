# Creator Drafts: Submit → Review → Publish

A single-user creator tool built with Next.js for drafting content, inline editing, and publishing. This application demonstrates modern full-stack development practices with TypeScript, React, and Node.js.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <your-repo-url>
   cd Creator-Drafts
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Project Structure

\`\`\`
├── app/
│ ├── api/
│ │ ├── drafts/
│ │ │ ├── route.ts # Get all drafts, create draft
│ │ │ └── [id]/
│ │ │ └── route.ts # Get, update, delete draft
│ │ └── content/
│ │ └── [id]/
│ │ └── route.ts # Get published content (public API)
│ ├── creator/
│ │ ├── new/
│ │ │ └── page.tsx # Create draft form
│ │ └── drafts/
│ │ └── page.tsx # Drafts table/management
│ ├── content/
│ │ └── [id]/
│ │ └── page.tsx # Public content view
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│ └── globals.css # Global styles
├── components/
│ ├── draft-form.tsx # New draft form component
│ ├── draft-view-modal.tsx # New draft content
│ ├── drafts-table.tsx # Drafts management table
│ ├── content-view.tsx # Public content display
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── db.ts # File-based database operations
│ ├── validation.ts # Input validation rules & functions
│ └── utils.ts # Utility functions
├── data/
│ └── drafts.json # JSON database file (auto-generated)
├── .env.example # Environment variables template
├── next.config.mjs # Next.js configuration
├── package.json # Dependencies
└── README.md # This file
\`\`\`

## 🎯 Core Features

### Pages & Routes

- **`/` (Home)** - Landing page with feature overview
- **`/creator/new`** - Form to create new draft

  - Title (3-200 chars, required)
  - Description (10-2000 chars, required)
  - Tags (max 10, 50 chars each)
  - Images (max 5, base64 encoded)

- **`/creator/drafts`** - Drafts management table

  - View all user drafts
  - Inline editing of titles and descriptions
  - Publish/unpublish drafts
  - Delete drafts

- **`/content/[id]`** - Public content view
  - Renders published content only
  - 404 for unpublished drafts
  - SEO-friendly metadata

### Backend API

#### REST Endpoints

- `GET /api/drafts` - Get all drafts
- `POST /api/drafts` - Create new draft
- `GET /api/drafts/[id]` - Get draft by ID
- `PUT /api/drafts/[id]` - Update draft
- `DELETE /api/drafts/[id]` - Delete draft
- `GET /api/content/[id]` - Get published content (public)

### Validation

All validation happens both client-side and server-side:

**Title**

- Required
- Min: 3 characters
- Max: 200 characters

**Description**

- Required
- Min: 10 characters
- Max: 2000 characters

**Tags**

- Max: 10 tags
- Max: 50 characters per tag

**Images**

- Max: 5 images
- Allowed types: JPEG, PNG, WebP, GIF
- Max: 10MB per image (stored as base64)

## 🔒 Security Considerations

### Implemented

1. **Server-side Validation** - All inputs validated on server before processing
2. **Draft vs Published Separation** - Only published drafts visible via public API (`/api/content/[id]`)
3. **Input Sanitization** - HTML entities escaped to prevent XSS
4. **No Secrets in Client** - All sensitive operations in API routes
5. **Type Safety** - Full TypeScript for compile-time safety
6. **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

## 📊 Data Storage

The application uses a file-based JSON database (`data/drafts.json`) for simplicity. This is suitable for development and MVP testing.

**Database Schema:**

\`\`\`typescript
interface Draft {
id: string; // Timestamp-based ID
title: string; // Draft title
description: string; // Draft description  
 tags: string[]; // Array of tags
images: string[]; // Array of base64 images
published: boolean; // Publication status
createdAt: Date; // Creation timestamp
updatedAt: Date; // Last update timestamp
}
\`\`\`

## 🎨 Design & UX

- **Modern UI** - Built with shadcn/ui components and Tailwind CSS v4
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Loading States** - Feedback for async operations
- **Error Handling** - User-friendly error messages
- **Empty States** - Clear messaging when no drafts exist
- **Inline Editing** - Click to edit titles and descriptions in drafts table
- **Image Preview** - Visual feedback when adding images

## 📈 Performance

- **Next.js Image Optimization** - `next/image` for responsive images
- **Lazy Loading** - Images load on demand
- **Code Splitting** - Route-based code splitting
- **Optimized Bundle** - Only shipped code used by page

## 🧪 Testing

### Test Coverage

Tests focus on core business logic:

- **Validation Functions** - `lib/validation.ts`

  - Title validation (length, required)
  - Description validation
  - Tags validation (count, length)
  - Images validation (count)

- **Database Operations** - `lib/db.ts`

  - Create draft
  - Update draft
  - Delete draft
  - Retrieve draft

- **API Routes** - Validation middleware
  - 400 errors for invalid input
  - 404 errors for missing resources
  - 201 response for creation

## 📝 Architectural Decisions

### File-based Database

- **Why:** Minimal setup, MVP-ready, easy to understand
- **Trade-offs:** Not scalable, no concurrent writes, data loss risk

### Server-side API Routes (Next.js API Routes)

- **Why:** Integrated with Next.js, same repo/deployment
- **Trade-offs:** Tied to Next.js framework
- **Alternative:** Extract to Express/Nest for flexibility

### Base64 Image Storage

- **Why:** Simplifies MVP, stores images with drafts
- **Trade-offs:** Large JSON file, poor performance at scale
- **Upgrade Path:** Use Vercel Blob or S3 with URL references

### Static Site Generation (SSG) + ISR

- **Why:** Published content is largely static, can prerender
- **Trade-offs:** Build time increases with content volume
- **Current:** Using dynamic rendering (`[id]` route)
- **Future:** Add `revalidate: 3600` for ISR

### Client-side File Upload

- **Why:** Simpler implementation, immediate preview
- **Trade-offs:** Large bundle size with base64 images
- **Future:** Implement Vercel Blob for server uploads

## Why Next.js API routes (instead of Express + MongoDB):

For this MVP assignment, a file-based database and built-in API routes provide a lightweight, self-contained backend without external dependencies. This simplifies setup while still demonstrating full-stack skills.
In a production scenario, I would migrate to Express/Nest + MongoDB for scalability and concurrent writes.

## 🚀 Future Enhancements

### +1 Day

- [ ] User authentication (Supabase Auth)
- [ ] Persistent database (Supabase PostgreSQL)
- [ ] Draft versioning/history
- [ ] Export as JSON/CSV
- [ ] Search & filtering
- [ ] Draft templates

### +3 Days

- [ ] Collaborative editing (Yjs/CRDT)
- [ ] Comment system
- [ ] Publishing to external platforms (Medium, Dev.to)
- [ ] Analytics dashboard
- [ ] Scheduled publishing
- [ ] SEO optimization tools
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)

### +1 Week

- [ ] AI-powered content suggestions
- [ ] Markdown editor with preview
- [ ] Image optimization & CDN
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Teams/collaboration
- [ ] Custom domains
- [ ] Premium features

## 📚 Technology Stack

- **Frontend:** React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Backend:** Next.js API Routes, Node.js
- **Database:** JSON (file-based) - upgrade to PostgreSQL recommended
- **Validation:** Custom validation functions
- **Styling:** Tailwind CSS v4

## 🛠️ Development

### Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm start # Start production server
npm run lint # Run linter
\`\`\`

### Environment Variables

Create `.env.local` (see `.env.example`):

\`\`\`env

# No secrets required for MVP

# All configuration is file-based

\`\`\`

## 🤖 AI Usage Log

### Tools & Prompts Used

1. **Initial Architecture Planning**

   - Tool: TodoManager
   - Prompt: "Plan multi-step Next.js app structure"

2. **File Structure & Database**

   - Tool: Code Generation
   - Prompt: "Create file-based DB with JSON storage"

3. **Validation Logic**

   - Tool: Code Generation
   - Prompt: "Build validation functions for drafts"

4. **API Routes**

   - Tool: Code Generation
   - Prompt: "Create REST API with Next.js API routes"

5. **React Components**

   - Tool: Code Generation
   - Prompt: "Build form and table components with Tailwind"

6. **Documentation**
   - Tool: Manual Writing
   - Prompt: "Write comprehensive README with architecture notes"

---

**Built with v0 by Vercel**
Created as a hiring assignment for Trufe | Next.js Developer Role

# Creator-Drafts
