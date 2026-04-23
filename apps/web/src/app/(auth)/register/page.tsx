'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    try {
      const { token } = await api.auth.register({
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        password: fd.get('password') as string,
      });
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Create account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          name="name"
          type="text"
          placeholder="Full name"
          className="w-full rounded border p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (8+ chars)"
          required
          minLength={8}
          className="w-full rounded border p-2"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Create account
        </button>
        <p className="text-center text-sm text-gray-500">
          Have an account?{' '}
          <Link href="/login" className="text-blue-600">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
