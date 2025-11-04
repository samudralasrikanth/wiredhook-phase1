"use client";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  async function handleEmailLogin(formData: FormData) {
    "use server";
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <main>
      <section className="glass-card p-6 mb-6">
        <h1 className="mb-4">Sign in</h1>
        <button onClick={signInWithGoogle} className="btn-cta px-4 py-2 rounded">Continue with Google</button>
      </section>
    </main>
  );
}


