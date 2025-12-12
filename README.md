# FeedbackFlow - Micro SaaS Feedback Board

A modern feedback board application where companies can create boards for their SaaS products and users can submit, vote on, and track feedback.

![FeedbackFlow](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## Features

### For Companies
- 🏢 **Create Companies** - Set up your organization with branding
- 📋 **Multiple Boards** - Create different feedback boards (Feature Requests, Bug Reports, etc.)
- 📊 **Status Management** - Track feedback through stages: Under Review → Planned → In Progress → Completed
- 💬 **Official Responses** - Reply to feedback as a team member

### For Users
- ✨ **Submit Feedback** - Share ideas, report bugs, request features
- 🗳️ **Vote** - Upvote feedback you want to see implemented
- 💬 **Comment** - Discuss feedback with others
- 🔍 **Filter & Search** - Find relevant feedback quickly

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 with CSS Variables for theming
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context + useReducer
- **Storage**: LocalStorage (can be replaced with a database)
- **Language**: TypeScript

## Theme System

The application uses CSS variables for centralized theme management, mapped to Tailwind utility classes:

```css
:root {
  /* Primary colors - Deep Teal */
  --color-primary-500: #0d9488;
  
  /* Accent colors - Warm Coral */
  --color-accent-500: #f95d3a;
  
  /* Semantic colors */
  --color-bg-primary: var(--color-neutral-50);
  --color-text-primary: var(--color-neutral-900);
  --color-border-primary: var(--color-neutral-200);
}
```

Toggle dark mode with `data-theme="dark"` on the `<html>` element.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # CSS variables and Tailwind theme
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Company & board management
│   ├── board/[company]/[board]/  # Public feedback board
│   └── demo/                # Demo board setup
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   │   └── Navbar.tsx
│   └── feedback/            # Feedback-specific components
│       ├── FeedbackCard.tsx
│       ├── FeedbackForm.tsx
│       └── FeedbackDetail.tsx
├── context/
│   └── FeedbackContext.tsx  # Global state management
└── types/
    └── index.ts             # TypeScript types
```

## Key Features Explained

### CSS Variables + Tailwind

All colors, shadows, and typography are defined as CSS variables and mapped to Tailwind:

```css
@theme {
  --color-primary-500: var(--color-primary-500);
  --color-bg-primary: var(--color-bg-primary);
}
```

Use in components: `bg-bg-primary`, `text-text-primary`, `border-border-primary`

### Feedback Status Flow

1. **Under Review** - New feedback awaiting evaluation
2. **Planned** - Accepted and added to roadmap
3. **In Progress** - Currently being worked on
4. **Completed** - Shipped and available

### Data Persistence

Data is stored in localStorage with keys:
- `feedback-board-companies`
- `feedback-board-boards`
- `feedback-board-feedbacks`
- `feedback-board-comments`
- `feedback-board-user`

## Customization

### Changing Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --color-primary-500: #your-color;
  --color-accent-500: #your-accent;
}
```

### Adding a Database

Replace localStorage calls in `FeedbackContext.tsx` with your database API calls.

## License

MIT
