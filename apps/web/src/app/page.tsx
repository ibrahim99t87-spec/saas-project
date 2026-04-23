import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold tracking-tight">SaaS Starter</h1>
      <p className="mt-4 text-xl text-gray-600">Production-ready. Multi-tenant. Ready to ship.</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Get started
        </Link>
        <Link href="/login" className="rounded-lg border px-6 py-3 hover:bg-gray-100">
          Sign in
        </Link>
      </div>
    </main>
  );
}
