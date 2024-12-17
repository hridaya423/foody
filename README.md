# 🍽️ Foody: Your Personal Recipe Companion

## Overview

Foody is a full-stack recipe management application that allows users to explore recipes. Built with modern web technologies, Foody provides a seamless and intuitive cooking experience.

## 🚀 Features

### User Authentication
- Secure user registration and login
- Session management with Supabase Auth
- Protected routes for authenticated users


### Key Technologies
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)
- Lucide React Icons
- OpenAI

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18+ recommended)
- npm or Yarn
- A Supabase account
- OpenAI API key

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/hridaya423/foody.git
cd foody
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the project root with the following:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openapi_key
```

4. Set up Supabase Database
- Create the following tables in your Supabase database:

```sql
-- Favorites Table
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  recipe_id text not null,
  recipe_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, recipe_id)
);

-- Cookbook Table
create table cookbook (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  recipe_id text not null,
  recipe_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, recipe_id)
);
```

5. Run the development server
```bash
npm run dev
# or
yarn dev
```

## 🔒 Authentication Flow

- Users can register with email and password
- Secure login with Supabase authentication
- Persistent sessions across page reloads

