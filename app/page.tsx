'use client'
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Open_Sans } from 'next/font/google';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import RecipeGenerator from '../components/RecipeGenerator';
import RecipeDisplay from '../components/RecipeDisplay';
import { Toaster } from 'react-hot-toast';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Font optimization
const openSans = Open_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'] 
});

export default function CulinaryCampanionApp() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  return (
    <div className={`
      min-h-screen 
      bg-gradient-to-br 
      from-blue-50 
      to-blue-100 
      ${openSans.className}
    `}>
      <Navbar 
        user={user} 
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          supabase.auth.signOut();
          setUser(null);
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {generatedRecipe ? (
          <RecipeDisplay 
            recipe={generatedRecipe}
            onBack={() => setGeneratedRecipe(null)}
          />
        ) : (
          <RecipeGenerator 
            onRecipeGenerated={(recipe) => setGeneratedRecipe(recipe)}
          />
        )}
      </main>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticate={(userData) => {
            setUser(userData);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}