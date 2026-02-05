"use client";
import { useState, useEffect } from "react";

export default function StreamingPage() {
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStreamSettings();
  }, []);

  const fetchStreamSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/settings/stream', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStreamUrl(data.stream_url);
    } catch (error) {
      console.error('Failed to fetch stream settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/settings/stream', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stream_url: streamUrl })
      });

      if (res.ok) {
        setMessage('Stream URL updated successfully');
      } else {
        setMessage('Failed to update stream URL');
      }
    } catch (error) {
      setMessage('Failed to update stream URL');
      console.error('Failed to update stream settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Streaming Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Live Stream URL</h2>
        <p className="text-gray-600 mb-4">
          Update the live stream URL. Changes take effect immediately without requiring a server restart.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stream URL</label>
            <input
              type="url"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://cast6.asurahosting.com/proxy/radioaga/stream"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the complete URL to your live audio stream
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Stream URL'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Current Stream URL:</h3>
          <code className="text-sm bg-white px-2 py-1 rounded border break-all">
            {streamUrl || 'Loading...'}
          </code>
        </div>
      </div>
    </div>
  );
}
