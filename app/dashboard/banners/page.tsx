'use client';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { ChevronLeft, ChevronRight, Play, Pause, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import Image from "next/image";

interface Banner {
  _id?: string;
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
}

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Banner>({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('https://all-mart-avenue-backend.vercel.app/banners');
        if (!res.ok) throw new Error('Failed to fetch banners');
        const data = await res.json();
        setBanners(data);
      } catch {
        Swal.fire('Error', 'Failed to load banners', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, banners.length]);

  // Image upload function
  const imageUpload = async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('https://api.imgbb.com/1/upload?key=19c9072b07556f7849d6dea75b7e834d', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.display_url;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Image size should be less than 5MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await imageUpload(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      Swal.fire('Success', 'Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire('Error', 'Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const openEditModal = (banner: Banner) => {
    setFormData(banner);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({ title: '', subtitle: '', description: '', buttonText: '', image: '' });
    setIsCreateMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirm = await Swal.fire({
      title: 'Delete this banner?',
      text: 'You cannot undo this action.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await fetch(`https://all-mart-avenue-backend.vercel.app/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setBanners(prev => prev.filter(b => b._id !== id));
      // Adjust current slide if needed
      if (currentSlide >= banners.length - 1) {
        setCurrentSlide(Math.max(0, banners.length - 2));
      }
      Swal.fire('Deleted!', 'Banner removed successfully.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to delete banner', 'error');
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title || !formData.subtitle || !formData.description || !formData.buttonText || !formData.image) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    try {
      const url = isCreateMode
        ? 'https://all-mart-avenue-backend.vercel.app/banners'
        : `https://all-mart-avenue-backend.vercel.app/banners/${formData._id}`;
      const method = isCreateMode ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save banner');
      const newData = await res.json();
      if (isCreateMode) {
        setBanners(prev => [...prev, newData]);
      } else {
        setBanners(prev => prev.map(b => (b._id === newData._id ? newData : b)));
      }
      setIsModalOpen(false);
      Swal.fire('Success', `Banner ${isCreateMode ? 'added' : 'updated'} successfully`, 'success');
    } catch {
      Swal.fire('Error', 'Failed to save banner', 'error');
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) return <div className="text-center text-lg mt-10">Loading banners...</div>;

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <div className="relative h-full w-full">
        {banners.length > 0 && banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-8 text-white">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {banner.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-4 text-gray-200">
                    {banner.subtitle}
                  </h2>
                  <p className="text-lg mb-8 text-gray-100 max-w-lg">
                    {banner.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg transition-opacity">
                      {banner.buttonText}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(banner)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
                        title="Edit banner"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
                        title="Delete banner"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${currentSlide === index
              ? 'bg-gradient-to-r from-[#1488CC] to-[#2B32B2]'
              : 'bg-white/50'
              }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-5 right-6 z-20 flex items-center space-x-4">
        <div className="flex space-x-2">
          <button
            className="rounded-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white border-none backdrop-blur-sm p-3 transition-opacity shadow-lg"
            onClick={goToPrevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="rounded-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white border-none backdrop-blur-sm p-3 transition-opacity shadow-lg"
            onClick={toggleAutoPlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            className="rounded-full bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white border-none backdrop-blur-sm p-3 transition-opacity shadow-lg"
            onClick={goToNextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Add Banner Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-opacity shadow-lg font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Banner
        </button>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-center">
              {isCreateMode ? 'Add New Banner' : 'Edit Banner'}
            </h2>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="grid grid-cols-1 gap-4">
              <input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Title"
                className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Subtitle"
                className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                rows={3}
                className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={formData.buttonText}
                onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Button Text"
                className="border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Banner Image
                </label>

                {formData.image ? (
                  <div className="relative">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      width={800}
                      height={400}
                      className="w-full h-48 object-cover rounded-md border"
                    />

                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload an image</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}

                <button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : (formData.image ? 'Change Image' : 'Upload Image')}
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-opacity disabled:opacity-50"
              >
                {isCreateMode ? 'Create Banner' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BannerManager;