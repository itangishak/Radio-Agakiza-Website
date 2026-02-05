"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "../../../components/Skeleton";
import { LoadingButton } from "../../../components/Spinner";

export default function ProfilePage() {
  const [user, setUser] = useState({ email: "", full_name: "", photo_url: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", current_password: "", new_password: "" });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch("/api/v1/admin/verify", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setUser(data.user);
      setFormData(prev => ({ ...prev, full_name: data.user.full_name }));
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch("/api/v1/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, current_password: "", new_password: "" }));
      }
    } catch (error) {
      console.error("Failed to update profile");
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch("/api/v1/admin/profile/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, photo_url: data.photo_url }));
      }
    } catch (error) {
      console.error("Failed to upload image");
    }
    setUploadingImage(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-16" />
          </div>
          <div className="flex items-center gap-6 mb-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Account Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {user.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-500">
                    {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium mb-2">Profile Picture</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploadingImage}
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer inline-block"
              >
                {uploadingImage ? "Uploading..." : "Change Photo"}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={isEditing ? formData.full_name : user.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter current password to change"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={formData.new_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <LoadingButton
                onClick={handleSave}
                loading={saving}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </LoadingButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
