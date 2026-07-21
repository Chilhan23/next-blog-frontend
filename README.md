# Next.js Blog Frontend Client (TechPulse)


---

## Features

- **Backend Integration:** Consumes the REST API from `golang-blog-api` via a centralized service layer (`services/`).
- **Authentication & JWT Session:** Client-side JWT session management, automatic Bearer header attachment, and state synchronization across browser tabs.
- **Role-Aware UI:** Admin-exclusive actions (e.g. `+ Category` button) are dynamically rendered based on the decoded JWT claims (`role === 'admin'`).
- **Resource Ownership Authorization:** Edit & Delete buttons for articles and comments are displayed only when the authenticated user is the resource owner or an Admin.
- **Interactive Likes System:** Optimistic UI updates for instant heart animations and live like counter toggle.
- **Discussion & Comments System:** Real-time comment submission, relative timestamps, author avatars, and comment deletion permissions.
- **Responsive Category Filters:** Filter articles by topic with Framer Motion layout animations.
- **Framer Motion Micro-Animations:** Page entrance transitions, hover-lift card effects, tab scaling, and tap feedback.
- **Dark & Light Monochrome Design:** Sleek typography, reading time estimates (`4 min read`), and glassmorphism.

---

## Tech Stack

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router & Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & Custom CSS Utilities
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** Lucide React

---

## Project Structure

```
.
├── app/
│   ├── blogs/
│   │   ├── [id]/
│   │   │   ├── edit/page.tsx         # Edit blog post page
│   │   │   └── page.tsx              # Single blog article & discussion view
│   │   ├── create/page.tsx           # Create blog post page
│   │   └── my/page.tsx               # Author profile dashboard ("My Posts")
│   ├── categories/
│   │   └── create/page.tsx           # Create category page (Admin restricted)
│   ├── components/
│   │   ├── BlogCard.tsx              # Blog card component with reading time & likes
│   │   ├── CategoryFilter.tsx        # Topic filter pills component
│   │   ├── CommentSection.tsx        # Discussion & comment list component
│   │   ├── Footer.tsx                # Application footer
│   │   ├── Modal.tsx                 # Modal dialog component
│   │   └── Navbar.tsx                # Responsive glassmorphic header
│   ├── login/page.tsx                # Authentication login page
│   ├── register/page.tsx             # User registration page
│   ├── types/index.ts                # TypeScript type definitions
│   ├── globals.css                   # Global styles & design system utilities
│   ├── layout.tsx                    # Root layout wrapper
│   └── page.tsx                      # Main home feed & hero section
├── services/
│   ├── api.ts                        # Centralized fetch wrapper & JWT header injector
│   ├── auth.ts                       # Authentication & JWT session helpers
│   ├── blogs.ts                      # Blog CRUD & like API service methods
│   ├── categories.ts                 # Category API service methods
│   └── comments.ts                   # Comment API service methods
├── types/
│   └── index.ts                      # Centralized TypeScript interfaces
├── .env.local                        # Frontend environment variables
├── next.config.mjs                   # API proxy rewrite configuration
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Running instance of [`golang-blog-api`](https://github.com/Chilhan23/golang-blog-api) on `http://localhost:8080`

---

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

### Installation & Local Development

1. Clone the repository:
   ```bash
   git clone git@github.com:Chilhan23/next-blog-frontend.git
   cd next-blog-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

All `/api/*` requests will be proxied automatically to the Golang backend running at `http://localhost:8080`.

---

## Production Build

To verify type safety and generate an optimized production bundle:

```bash
# Type-check TypeScript
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start
```

---

## Backend Reference

This frontend client consumes the REST API built in Golang. For database setup, API endpoint reference, and migration instructions, see the [Golang REST API Repository](https://github.com/Chilhan23/golang-blog-api).

---

## License

This project is open-source software under the MIT License.
