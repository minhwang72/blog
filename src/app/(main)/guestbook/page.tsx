import { Metadata } from 'next';
import Guestbook from '@/components/Guestbook';

export const metadata: Metadata = {
  title: '방명록 - min.log',
  description: '방문자들의 메시지를 남겨주세요.',
};

export default function GuestbookPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          방명록
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          방문자들의 메시지를 남겨주세요.
        </p>
      </div>
      
      <Guestbook />
    </div>
  );
} 