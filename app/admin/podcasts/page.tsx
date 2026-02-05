"use client";
import { useState, useEffect } from "react";
import ConfirmModal from "../../../components/ConfirmModal";
import ProgressBar from "../../../components/ProgressBar";

interface Podcast {
  id: number;
  title: string;
  description: string;
  audio_url: string;
  series_title?: string;
  created_at: string;
  image_thumbnail?: string;
  image_medium?: string;
  image_large?: string;
}

interface ImageUploadResult {
  thumbnail: { url: string; width: number; height: number };
  medium: { url: string; width: number; height: number };
  large: { url: string; width: number; height: number };
}

interface AudioUploadResult {
  url: string;
  size: number;
  format: string;
}

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audio_url: '',
    series_title: 'Default Series',
    image_thumbnail: '',
    image_medium: '',
    image_large: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState<{ algorithm: string; progress: number; processedMB: string; totalMB: string } | null>(null);
  const [audioProgress, setAudioProgress] = useState<{ algorithm: string; progress: number; processedMB: string; totalMB: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; podcast: Podcast | null }>({ show: false, podcast: null });
  const [infoModal, setInfoModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/podcasts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const totalMB = (file.size / (1024 * 1024)).toFixed(2);
    setImageProgress({ algorithm: 'Processing...', progress: 0, processedMB: '0', totalMB });
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setImageProgress(prev => {
        if (!prev || prev.progress >= 90) return prev;
        const newProgress = prev.progress + Math.random() * 15;
        const cappedProgress = Math.min(newProgress, 90);
        const processedMB = ((cappedProgress / 100) * file.size / (1024 * 1024)).toFixed(2);
        return { ...prev, progress: Math.round(cappedProgress), processedMB };
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await res.json();
      const images = result.images as ImageUploadResult;

      // Complete progress
      setImageProgress({ algorithm: 'Processing...', progress: 100, processedMB: totalMB, totalMB });
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          image_thumbnail: images.thumbnail.url,
          image_medium: images.medium.url,
          image_large: images.large.url
        }));
        setImageProgress(null);
        setInfoModal({ show: true, title: 'Image Upload', message: 'Image uploaded successfully!' });
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Image upload failed:', error);
      setInfoModal({ show: true, title: 'Upload Failed', message: 'Image upload failed: ' + (error as Error).message });
      setImageProgress(null);
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!file) return;

    const totalMB = (file.size / (1024 * 1024)).toFixed(2);
    setAudioProgress({ algorithm: 'Processing...', progress: 0, processedMB: '0', totalMB });
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAudioProgress(prev => {
        if (!prev || prev.progress >= 85) return prev;
        const newProgress = prev.progress + Math.random() * 10;
        const cappedProgress = Math.min(newProgress, 85);
        const processedMB = ((cappedProgress / 100) * file.size / (1024 * 1024)).toFixed(2);
        return { ...prev, progress: Math.round(cappedProgress), processedMB };
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/upload-audio', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await res.json();
      const audio = result.audio as AudioUploadResult;

      // Complete progress
      setAudioProgress({ algorithm: 'Completed', progress: 100, processedMB: totalMB, totalMB });
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          audio_url: audio.url
        }));
        setAudioProgress(null);
        setInfoModal({ show: true, title: 'Audio Upload', message: 'Audio uploaded successfully!' });
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Audio upload failed:', error);
      setInfoModal({ show: true, title: 'Upload Failed', message: 'Audio upload failed: ' + (error as Error).message });
      setAudioProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingId ? `/api/v1/admin/podcasts/${editingId}` : '/api/v1/admin/podcasts';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchPodcasts();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save podcast:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (podcast: Podcast) => {
    setFormData({
      title: podcast.title,
      description: podcast.description,
      audio_url: podcast.audio_url,
      series_title: podcast.series_title || 'Default Series',
      image_thumbnail: podcast.image_thumbnail || '',
      image_medium: podcast.image_medium || '',
      image_large: podcast.image_large || ''
    });
    setEditingId(podcast.id);
    setShowForm(true);
  };

  const handleDelete = async (podcast: Podcast) => {
    setDeleteModal({ show: true, podcast });
  };

  const confirmDelete = async () => {
    if (!deleteModal.podcast) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/v1/admin/podcasts/${deleteModal.podcast.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModal({ show: false, podcast: null });
      fetchPodcasts();
    } catch (error) {
      console.error('Failed to delete podcast:', error);
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      audio_url: '', 
      series_title: 'Default Series',
      image_thumbnail: '',
      image_medium: '',
      image_large: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Podcast Episodes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Episode
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Episode' : 'Add Episode'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Episode Thumbnail</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="w-full px-3 py-2 border rounded-md"
                disabled={!!imageProgress}
              />
              {imageProgress && (
                <ProgressBar 
                  algorithm={imageProgress.algorithm}
                  progress={imageProgress.progress}
                  processedMB={imageProgress.processedMB}
                  totalMB={imageProgress.totalMB}
                />
              )}
              {formData.image_thumbnail && !imageProgress && (
                <div className="mt-2">
                  <img 
                    src={formData.image_thumbnail} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optimized with Lanczos-3</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md h-32"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Audio File</label>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAudioUpload(file);
                }}
                className="w-full px-3 py-2 border rounded-md"
                disabled={!!audioProgress}
              />
              {audioProgress && (
                <ProgressBar 
                  algorithm={audioProgress.algorithm}
                  progress={audioProgress.progress}
                  processedMB={audioProgress.processedMB}
                  totalMB={audioProgress.totalMB}
                />
              )}
              {formData.audio_url && !audioProgress && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={formData.audio_url} type="audio/mpeg" />
                  </audio>
                  <p className="text-xs text-gray-500 mt-1">Optimized with Kaiser-Windowed Sinc FIR</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !!imageProgress || !!audioProgress}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Series</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {podcasts.map((podcast) => (
              <tr key={podcast.id}>
                <td className="px-6 py-4">
                  {podcast.image_thumbnail ? (
                    <img 
                      src={podcast.image_thumbnail} 
                      alt={podcast.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{podcast.title}</td>
                <td className="px-6 py-4">{podcast.series_title || '-'}</td>
                <td className="px-6 py-4">{new Date(podcast.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(podcast)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(podcast)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModal.show}
        title="Delete Podcast Episode"
        message={`Are you sure you want to delete "${deleteModal.podcast?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ show: false, podcast: null })}
      />
      <ConfirmModal
        isOpen={infoModal.show}
        title={infoModal.title}
        message={infoModal.message}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => setInfoModal({ show: false, title: '', message: '' })}
        onCancel={() => setInfoModal({ show: false, title: '', message: '' })}
      />
    </div>
  );
}
