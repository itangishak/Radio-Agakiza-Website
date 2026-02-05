"use client";
import { useState, useEffect } from "react";
import ConfirmModal from "../../../components/ConfirmModal";
import ProgressBar from "../../../components/ProgressBar";

interface Article {
  id: number;
  title: string;
  content: string;
  status: string;
  author_name?: string;
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

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    image_thumbnail: '',
    image_medium: '',
    image_large: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState<{ algorithm: string; progress: number; processedMB: string; totalMB: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; article: Article | null }>({ show: false, article: null });
  const [infoModal, setInfoModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/news', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const totalMB = (file.size / (1024 * 1024)).toFixed(2);
    setImageProgress({ algorithm: 'Lanczos-3 Resampling', progress: 0, processedMB: '0', totalMB });
    
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
      setImageProgress({ algorithm: 'Lanczos-3 Resampling', progress: 100, processedMB: totalMB, totalMB });
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingId ? `/api/v1/admin/news/${editingId}` : '/api/v1/admin/news';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const wasEditing = !!editingId;
      if (res.ok) {
        fetchArticles();
        resetForm();
        setInfoModal({ show: true, title: 'Success', message: wasEditing ? 'Article updated successfully!' : 'Article created successfully!' });
      } else {
        let errMsg = 'Failed to save article.';
        try {
          const err = await res.json();
          if (err?.error) errMsg = err.error;
        } catch {}
        setInfoModal({ show: true, title: 'Save Failed', message: errMsg });
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      setInfoModal({ show: true, title: 'Save Failed', message: 'Failed to save article: ' + (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      status: article.status,
      image_thumbnail: article.image_thumbnail || '',
      image_medium: article.image_medium || '',
      image_large: article.image_large || ''
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (article: Article) => {
    setDeleteModal({ show: true, article });
  };

  const confirmDelete = async () => {
    if (!deleteModal.article) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/v1/admin/news/${deleteModal.article.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModal({ show: false, article: null });
      fetchArticles();
      setInfoModal({ show: true, title: 'Deleted', message: 'Article deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete article:', error);
      setInfoModal({ show: true, title: 'Delete Failed', message: 'Failed to delete article.' });
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      content: '', 
      status: 'draft',
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
        <h1 className="text-2xl font-bold">News Articles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Article' : 'Add Article'}
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
              <label className="block text-sm font-medium mb-1">Featured Image</label>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Optimized with Lanczos-3 resampling
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-md h-40"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !!imageProgress}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4">
                  {article.image_thumbnail ? (
                    <img 
                      src={article.image_thumbnail} 
                      alt={article.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{article.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4">{article.author_name || '-'}</td>
                <td className="px-6 py-4">{new Date(article.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
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
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteModal.article?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ show: false, article: null })}
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
