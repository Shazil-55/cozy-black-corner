
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, UserCircle, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/services/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface AvatarUploadProps {
  name: string;
  onChange: (base64: string | null) => void;
}

export const AvatarUpload = ({ name, onChange }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [initials, setInitials] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (name) {
      const words = name.trim().split(' ');
      if (words.length >= 2) {
        setInitials(`${words[0][0]}${words[1][0]}`.toUpperCase());
      } else if (words.length === 1 && words[0].length >= 1) {
        setInitials(words[0].substring(0, 2).toUpperCase());
      }
    }
  }, [name]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary preview for immediate feedback
    const tempPreview = URL.createObjectURL(file);
    setPreview(tempPreview);
    setIsUploading(true);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('fileToUpload', file);

      // Upload file to API
      const response = await api.post('/common/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get image URL from response
      const imageUrl = response.data.data;
      
      if (imageUrl) {
        setPreview(imageUrl);
        onChange(imageUrl);
        
        // Store in localStorage for persistence across pages
        localStorage.setItem('userAvatar', imageUrl);
        toast.success('Profile image uploaded successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
      
      // Revert preview if upload fails
      setPreview(null);
      onChange(null);
    } finally {
      setIsUploading(false);
      // Revoke the temporary object URL
      URL.revokeObjectURL(tempPreview);
    }
  };

  const removeAvatar = () => {
    setPreview(null);
    onChange(null);
    localStorage.removeItem('userAvatar');
  };

  const gradientColors = [
    'from-blue-500 to-indigo-500',
    'from-[#1B68B3] to-blue-400',
    'from-sky-500 to-blue-600',
    'from-indigo-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-amber-500 to-orange-500'
  ];
  
  // Choose a consistent background color based on initials
  const colorIndex = name ? name.charCodeAt(0) % gradientColors.length : 0;
  const gradientColor = gradientColors[colorIndex];

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        {preview ? (
          <motion.div 
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="w-24 h-24 border-2 border-white dark:border-gray-800 shadow-xl">
              <AvatarImage src={preview} alt="Avatar preview" />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <Spinner size="md" color="primary" />
                </div>
              )}
            </Avatar>
            <button 
              type="button"
              onClick={removeAvatar} 
              className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              disabled={isUploading}
            >
              <X size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white text-xl font-semibold shadow-xl`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {initials || <UserCircle size={42} className="text-white/90" />}
          </motion.div>
        )}
        
        <label 
          htmlFor="avatar-upload" 
          className={`absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-2.5 cursor-pointer shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Camera size={18} className="text-[#1B68B3] dark:text-blue-400" />
          <input 
            id="avatar-upload" 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isUploading}
          />
        </label>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
        {isUploading ? 'Uploading...' : 'Upload profile photo'}
      </p>
    </div>
  );
};
