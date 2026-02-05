"use client";
import { useState, useEffect } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

interface Program {
  id: number;
  name: string;
  host_name?: string;
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    day_of_week: 0,
    start_time: '',
    end_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; program: Program | null }>({ show: false, program: null });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/v1/admin/programs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPrograms(data);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingId ? `/api/v1/admin/programs/${editingId}` : '/api/v1/admin/programs';
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
        fetchPrograms();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program: Program) => {
    setFormData({
      name: program.name,
      host: program.host_name || '',
      day_of_week: program.day_of_week || 0,
      start_time: program.start_time || '',
      end_time: program.end_time || ''
    });
    setEditingId(program.id);
    setShowForm(true);
  };

  const handleDelete = async (program: Program) => {
    setDeleteModal({ show: true, program });
  };

  const confirmDelete = async () => {
    if (!deleteModal.program) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/v1/admin/programs/${deleteModal.program.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModal({ show: false, program: null });
      fetchPrograms();
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', host: '', day_of_week: 0, start_time: '', end_time: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Program
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Program' : 'Add Program'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Host</label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {DAYS.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{program.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{program.host_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {program.day_of_week !== undefined && program.start_time && program.end_time
                    ? `${DAYS[program.day_of_week]} ${program.start_time}-${program.end_time}`
                    : '-'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(program)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(program)}
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
        title="Delete Program"
        message={`Are you sure you want to delete "${deleteModal.program?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ show: false, program: null })}
      />
    </div>
  );
}
