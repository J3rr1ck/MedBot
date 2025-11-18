import React, { useState, useRef, useEffect } from 'react';
import { 
  LucideSearch, 
  LucideImage, 
  LucidePlus, 
  LucideChevronLeft, 
  LucideChevronRight, 
  LucideTrash2,
  LucideUpload,
  LucideCamera,
  LucideX
} from 'lucide-react';

interface SymptomFormProps {
  onSubmit: (symptoms: string, images: string[]) => void;
}

export const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit }) => {
  const [symptoms, setSymptoms] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle active index bounds when images are removed
  useEffect(() => {
    if (selectedImages.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= selectedImages.length) {
      setActiveIndex(selectedImages.length - 1);
    }
  }, [selectedImages.length, activeIndex]);

  // Camera handling effect
  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      if (isCameraOpen) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          if (mounted) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } else {
            // Clean up if unmounted during load
            stream.getTracks().forEach(track => track.stop());
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please ensure you have granted permissions.");
          if (mounted) setIsCameraOpen(false);
        }
      } else {
        // Cleanup stream when camera closes
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentCount = selectedImages.length;
    const newCount = files.length;
    
    if (currentCount + newCount > 5) {
        alert("You can upload a maximum of 5 images.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
    }

    const readers: Promise<string>[] = [];

    Array.from(files).forEach((file: File) => {
        if (file.size > 5 * 1024 * 1024) {
             alert(`File ${file.name} exceeds 5MB limit.`);
             return;
        }
        readers.push(new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        }));
    });

    Promise.all(readers).then(newBase64Images => {
        setSelectedImages(prev => [...prev, ...newBase64Images]);
        if (selectedImages.length === 0) {
           setActiveIndex(0);
        }
    });

    // Reset input to allow selecting the same file again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  const startCamera = () => {
    if (selectedImages.length >= 5) {
      alert("Max 5 images allowed.");
      return;
    }
    setIsCameraOpen(true);
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        if (selectedImages.length < 5) {
          setSelectedImages(prev => {
            const newState = [...prev, dataUrl];
            // Automatically view the new image
            setTimeout(() => setActiveIndex(newState.length - 1), 0);
            return newState;
          });
        }
        stopCamera();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    onSubmit(symptoms, selectedImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Text Input Section */}
      <div className="space-y-3">
        <label htmlFor="symptoms" className="block text-base font-semibold text-slate-900">
          Describe your symptoms
        </label>
        <div className="relative group">
          <textarea
            id="symptoms"
            rows={5}
            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none outline-none text-slate-800 placeholder:text-slate-400 text-lg leading-relaxed shadow-sm"
            placeholder="Describe what you're feeling in detail. E.g., 'Sharp pain in lower right abdomen, started 2 hours ago, accompanied by nausea...'"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
          <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-400 pointer-events-none">
            {symptoms.length} chars
          </div>
        </div>
      </div>

      {/* Image Upload / Camera Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-base font-semibold text-slate-900">
            Visual Evidence <span className="font-normal text-slate-500 text-sm ml-1">(Optional)</span>
          </label>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            Max 5 images
          </span>
        </div>
        
        {isCameraOpen ? (
          <div className="relative bg-black rounded-2xl overflow-hidden h-96 flex flex-col items-center justify-center animate-fade-in shadow-lg">
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover" 
              autoPlay 
              playsInline 
              muted 
            />
            
            {/* Camera Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex items-center justify-center gap-8 z-10">
              <button 
                type="button" 
                onClick={stopCamera} 
                className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all"
                title="Cancel"
              >
                <LucideX size={24} />
              </button>
              
              <button 
                type="button" 
                onClick={capturePhoto} 
                className="p-1.5 rounded-full border-4 border-white/30 hover:border-white/50 transition-all hover:scale-105 active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-300"></div>
                </div>
              </button>
              
              <div className="w-14"></div> {/* Spacer to balance Cancel button */}
            </div>
          </div>
        ) : selectedImages.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-48">
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-blue-200 transition-all">
                <LucideUpload className="text-slate-400 group-hover:text-blue-500" size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Upload Photo</p>
              <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
            </div>

            <div 
              onClick={startCamera}
              className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-blue-200 transition-all">
                <LucideCamera className="text-slate-400 group-hover:text-blue-500" size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Take Photo</p>
              <p className="text-xs text-slate-500 mt-1">Use device camera</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Carousel Main Stage */}
            <div className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden group select-none shadow-md ring-1 ring-slate-900/5">
              <img 
                src={selectedImages[activeIndex]} 
                alt={`Evidence ${activeIndex + 1}`} 
                className="w-full h-full object-contain transition-transform duration-500"
              />
              
              {/* Image Counter */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/10">
                Image {activeIndex + 1} of {selectedImages.length}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeImage(activeIndex)}
                className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0"
                title="Remove this image"
              >
                <LucideTrash2 size={18} />
              </button>

              {/* Navigation Controls */}
              {selectedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <LucideChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <LucideChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-center">
              {selectedImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                    idx === activeIndex 
                      ? 'ring-2 ring-blue-600 ring-offset-2 opacity-100 scale-105' 
                      : 'opacity-60 hover:opacity-100 hover:ring-1 hover:ring-slate-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover bg-white"
                  />
                </button>
              ))}
              
              {selectedImages.length < 5 && (
                <>
                  <div className="w-px h-12 bg-slate-200 mx-1"></div>
                  
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all bg-white"
                    title="Upload another image"
                  >
                    <LucideUpload size={20} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all bg-white"
                    title="Take another photo"
                  >
                    <LucideCamera size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden" 
          multiple
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!symptoms.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98]"
        >
          <LucideSearch size={20} />
          Analyze Symptoms
        </button>
      </div>
    </form>
  );
};