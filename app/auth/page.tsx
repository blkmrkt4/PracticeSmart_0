"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthAction = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // User is logged in, so log them out
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            title: 'Logout Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
          });
        }
      } else {
        // User is not logged in, so log them in as blkmrkt.runner@gmail.com
        // IMPORTANT: Ensure this user exists in Supabase Auth with this password
        const email = 'blkmrkt.runner@gmail.com';
        const password = 'password123'; // Replace with the actual password if different

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          toast({
            title: 'Login Failed',
            description: signInError.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Logged In',
            description: `Successfully logged in as ${email}.`,
          });
        }
      }
      // Redirect to dashboard after action
      // Using replace to prevent this page from being in the history stack
      router.replace('/dashboard'); 
    };

    handleAuthAction();
  }, [router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <p>Processing authentication...</p>
      <p>You will be redirected shortly.</p>
    </div>
  );
}
