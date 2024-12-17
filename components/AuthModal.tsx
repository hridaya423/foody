/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { X, User, Lock } from 'lucide-react';
import { useRouter } from 'next/router';

interface AuthModalProps {
  onClose: () => void;
  onAuthenticate: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthenticate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check session on component mount
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is already logged in
        onAuthenticate(session.user);
        onClose(); // Close modal if open
      }
    };

    checkSession();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Persist user session
        if (session?.user) {
          onAuthenticate(session.user);
          
          // Optional: Redirect after login if desired
          // router.push('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        // Handle logout
        onAuthenticate(null);
      }
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, onAuthenticate, onClose]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await supabase.auth.signInWithPassword({
          email,
          password
        });
      } else {
        response = await supabase.auth.signUp({
          email,
          password
        });
      }

      const { data, error } = response;

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success(isLogin ? 'Login Successful!' : 'Account Created!');
        onAuthenticate(data.user);
        onClose(); // Close the modal after successful authentication
      }
    } catch (error) {
      toast.error('Authentication failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout method (you can call this from a logout button elsewhere)
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-8 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-500 text-white 
              py-3 rounded-lg 
              hover:bg-blue-600 
              transition-colors
              disabled:opacity-50
            "
          >
            {loading 
              ? 'Processing...' 
              : (isLogin ? 'Login' : 'Create Account')
            }
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {isLogin 
              ? 'Need an account? Sign Up' 
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;