import { SnapshotResult } from '../types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockSearchEntity = async (query: string): Promise<SnapshotResult> => {
  await sleep(1500); // Simulate network delay

  return {
    id: Math.random().toString(36).substring(7),
    entityName: query,
    analysis: `This is a comprehensive snapshot of ${query} based on currently available public data. We've synthesized information from various professional and social channels to provide a real-time perspective on their current focus and public sentiment.`,
    keyInsights: [
      `${query} has shown significant activity in their respective field over the last quarter.`,
      `Public sentiment remains largely positive, with a notable increase in professional engagements.`,
      `Recent mentions suggest a shift towards innovative projects and community-led initiatives.`
    ],
    sources: [
      { title: 'LinkedIn Professional Profile', url: '#', type: 'professional' },
      { title: 'Recent News Article', url: '#', type: 'news' },
      { title: 'Twitter/X Activity', url: '#', type: 'social' }
    ],
    timestamp: new Date().toISOString()
  };
};

export const mockSubmitWaitlist = async (email: string): Promise<{ success: boolean }> => {
  await sleep(1000);
  console.log(`Waitlist submission for: ${email}`);
  return { success: true };
};

export const mockSendConfirmationEmail = async (email: string): Promise<{ success: boolean }> => {
  await sleep(800);
  console.log(`Confirmation email sent to: ${email}`);
  return { success: true };
};
