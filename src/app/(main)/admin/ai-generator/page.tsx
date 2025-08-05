import { Metadata } from 'next';
import AIGenerator from '@/components/admin/AIGenerator';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'AI Content Generator',
  description: 'Generate blog content using AI',
};

export default async function AIGeneratorPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AIGenerator />
    </div>
  );
} 