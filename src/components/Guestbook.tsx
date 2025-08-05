import { useState, useEffect } from 'react';

interface GuestbookEntry {
  id: number;
  content: string;
  authorId: number;
  createdAt: string;
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/guestbook');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch guestbook entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newEntry,
          authorId: 1, // This should be replaced with the actual user ID
        }),
      });

      if (response.ok) {
        setNewEntry('');
        fetchEntries();
      }
    } catch (error) {
      console.error('Failed to submit guestbook entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Guestbook</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Leave a message..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          rows={3}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <p className="text-gray-800 mb-2">{entry.content}</p>
            <div className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 