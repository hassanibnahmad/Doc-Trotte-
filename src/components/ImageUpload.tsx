import { useState, useCallback, useRef, useEffect } from 'react';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  isRequired?: boolean;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageSelect,
  onError,
  onSuccess,
  isRequired = false,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file size (5MB)
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        onError('La taille de l\'image ne peut pas dépasser 5MB. Veuillez choisir une image plus petite.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        onError('Format d\'image non supporté. Veuillez utiliser JPG, PNG ou WebP.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setUploading(true);

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsDataURL(file);
      });

      setPreviewUrl(base64);
      onImageSelect(base64);
      onSuccess('Image téléchargée avec succès!');

    } catch (error) {
      console.error('Image upload error:', error);
      onError('Erreur lors du téléchargement de l\'image');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploading(false);
    }
  }, [onImageSelect, onError, onSuccess]);

  // Update preview when currentImage changes
  useEffect(() => {
    setPreviewUrl(currentImage || '');
  }, [currentImage]);

  // Cleanup file input on component unmount
  useEffect(() => {
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Image * (Max 5MB - JPG, PNG, WebP)
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        required={isRequired && !previewUrl}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-400 file:text-black disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Loading state */}
      {uploading && (
        <div className="flex items-center text-yellow-400">
          <div className="w-4 h-4 mr-2 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Téléchargement de l'image...</span>
        </div>
      )}

      {/* Image preview */}
      {previewUrl && !uploading && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-full h-80 object-cover rounded border-2 border-gray-600"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x200/374151/9CA3AF?text=No+Image';
            }}
          />
          <p className="text-xs text-gray-400 mt-2 text-center">
            Aperçu de l'image sélectionnée
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;