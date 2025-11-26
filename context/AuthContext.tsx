
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabaseClient as supabase } from '../services/supabase';
import { User, SubscriptionTier } from '../types';
import { Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (fullName: string, email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateCredits: (newAmount: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCreditsForTier = (tier: SubscriptionTier): number => {
  switch (tier) {
    case SubscriptionTier.INDIVIDUAL:
      return 1000;
    case SubscriptionTier.TEAM:
      return 5000;
    case SubscriptionTier.ENTERPRISE:
      return 100000; // Effectively unlimited
    case SubscriptionTier.NONE:
    default:
      return 0;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Centralized function to fetch user profile and update state
  const processSession = useCallback(async (session: Session | null) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      
      try {
        const supabaseUser = session.user;
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        if (error && error.code === 'PGRST116') { // Profile doesn't exist, create it
          console.log("No profile found, creating one.");
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: supabaseUser.id,
              email: supabaseUser.email,
              display_name: supabaseUser.user_metadata.full_name || supabaseUser.email || 'New User',
              photo_url: supabaseUser.user_metadata.avatar_url || null,
              subscription_tier: SubscriptionTier.NONE,
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("Error creating profile:", insertError);
            setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                display_name: supabaseUser.user_metadata.full_name || 'User',
                photo_url: supabaseUser.user_metadata.avatar_url || null,
                subscription_tier: SubscriptionTier.NONE,
                credits: 0,
            });
          } else if (newProfile) {
            const tier = newProfile.subscription_tier as SubscriptionTier;
            setUser({
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              display_name: newProfile.display_name,
              photo_url: newProfile.photo_url,
              subscription_tier: tier,
              credits: getCreditsForTier(tier),
            });
          }
        } else if (error) {
          console.error("Error fetching profile:", error);
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            display_name: supabaseUser.user_metadata.full_name || 'User',
            photo_url: supabaseUser.user_metadata.avatar_url || null,
            subscription_tier: SubscriptionTier.NONE,
            credits: 0,
          });
        } else if (profile) {
          const tier = profile.subscription_tier as SubscriptionTier;
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            display_name: profile.display_name || supabaseUser.user_metadata.full_name || supabaseUser.email || 'User',
            photo_url: profile.photo_url || supabaseUser.user_metadata.avatar_url || null,
            subscription_tier: tier,
            credits: getCreditsForTier(tier),
          });
        }
      } catch (err) {
        console.error("Unexpected error in auth processing:", err);
        setUser(null);
      }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initializeSession = async () => {
        // Create a promise that rejects after 3 seconds
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Auth initialization timed out")), 3000)
        );

        try {
            const authFlow = async () => {
                 const { data, error } = await supabase.auth.getSession();
                 if (error) throw error;
                 if (data?.session) {
                     if (mounted) await processSession(data.session);
                 } else {
                     if (mounted) setUser(null);
                 }
            };

            await Promise.race([authFlow(), timeoutPromise]);

        } catch (err) {
            console.warn("Auth initialization bypassed due to error/timeout:", err);
            if (mounted) setUser(null);
        } finally {
            if (mounted) setLoading(false);
        }
    }
    
    setLoading(true);
    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
            await processSession(session);
            setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [processSession]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // If successful, we manually trigger processSession to update state faster
    // and ensuring the promise resolves only after user state is set.
    if (!error && data.session) {
        await processSession(data.session);
    }
    return { error };
  };

  const signUpWithEmail = async (fullName: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateCredits = (newAmount: number) => {
    setUser(prev => prev ? { ...prev, credits: newAmount } : null);
  };

  const value = { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateCredits };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
