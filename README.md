# Hepta.no Website

This is the official codebase for the [Hepta.no](https://hepta.no) website. It's a modern, full-stack web application built with Next.js, TypeScript, and Tailwind CSS, featuring a range of services from user authentication to payment processing with Stripe.

## Key Features

-   **Modern Frontend**: Built with Next.js 14 (App Router), React, and TypeScript.
-   **Responsive Design**: Styled with Tailwind CSS and utilizing Shadcn/ui for a rich component library.
-   **Dynamic Animations**: Smooth and interactive animations powered by Framer Motion.
-   **User Authentication**: Secure user sign-up, login, and session management using NextAuth.js.
-   **Backend Services**: Leveraging Supabase for the database and backend-as-a-service functionality.
-   **Payment Integration**: Full integration with Stripe for creating and managing customers, invoices, and payments.
-   **API Layer**: Backend logic is handled through a set of robust Next.js API routes.

## Technologies Used

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Database**: [Supabase](https://supabase.io/)
-   **Payments**: [Stripe](https://stripe.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/hepta-3.git
    cd hepta-3
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the necessary environment variables. You can use `.env.example` as a template if one is available.

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Stripe
    STRIPE_SECRET_KEY=your_stripe_secret_key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=a_secure_random_string_for_session_encryption

    # Optional: Add any other provider keys if needed (e.g., Google, GitHub)
    GITHUB_ID=
    GITHUB_SECRET=
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Folder Structure

Here is a high-level overview of the project's folder structure:

```
hepta-3/
├── app/                # Next.js App Router: pages, layouts, and API routes
├── components/         # Reusable React components (including UI components from shadcn)
├── lib/                # Core logic, helpers, and third-party service initializations (Stripe, Supabase, etc.)
├── public/             # Static assets like images, videos, and fonts
├── styles/             # Global styles
├── supabase/           # Supabase database migrations
└── ...                 # Configuration files (Next.js, Tailwind, etc.)
```

## Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/), the platform created by the developers of Next.js.

-   Push your code to a Git repository (GitHub, GitLab, Bitbucket).
-   Import the repository into Vercel.
-   Vercel will automatically detect the Next.js framework, build your project, and deploy it.
-   Remember to add your environment variables to the Vercel project settings. 