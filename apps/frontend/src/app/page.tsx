'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [backendHealth, setBackendHealth] = useState<{
    status: 'ok' | 'error';
    service?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/health`
        );
        if (response.ok) {
          const data = await response.json();
          setBackendHealth(data);
        } else {
          setBackendHealth({ status: 'error' });
        }
      } catch (error) {
        setBackendHealth({ status: 'error' });
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
  }, []);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Study Platform</h1>
      <p>Welcome to your educational study platform</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>System Status</h2>
        <div style={{ marginTop: '1rem' }}>
          <p>Frontend: ✓ Running</p>
          {loading ? (
            <p>Checking backend...</p>
          ) : backendHealth?.status === 'ok' ? (
            <p>Backend: ✓ Connected</p>
          ) : (
            <p>Backend: ✗ Disconnected</p>
          )}
        </div>
      </div>
    </main>
  );
}
