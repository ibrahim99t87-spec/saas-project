'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type User = { id: string; email: string; name: string | null };
type Org = { id: string; name: string; slug: string; role: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, orgsRes] = await Promise.all([api.auth.me(), api.organizations.list()]);
        setUser(meRes.user);
        setOrgs(orgsRes.organizations);
      } catch {
        router.push('/login');
      }
    }
    load();
  }, [router]);

  if (!user) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Welcome, {user.name ?? user.email}</h1>
      <section className="mt-6">
        <h2 className="text-lg font-medium">Your organizations</h2>
        {orgs.length === 0 ? (
          <p className="mt-2 text-gray-500">No organizations yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {orgs.map((org) => (
              <li key={org.id} className="rounded border p-3">
                <span className="font-medium">{org.name}</span>
                <span className="ml-2 text-sm text-gray-400">({org.role})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
