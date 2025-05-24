
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { SlideData } from "@/services/courseService";
import { toast } from "@/components/ui/use-toast";
import { useImageGenerator } from "@/hooks/useImageGenerator";

interface SlidePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: SlideData | null;
}

const SlidePreviewModal: React.FC<SlidePreviewModalProps> = ({ isOpen, onClose, slide }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(slide.imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(!slide.imageUrl);
  const { generateImage, results } = useImageGenerator();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Create a URL for the image file
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setShowImageOptions(false);
    setIsUploading(false);

    // In a real app, you would upload the image to your server here
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully",
    });
  };

  const handleGenerateImage = async () => {
    // Generate a prompt from the slide content
    const prompt = `Create a professional educational illustration for: ${slide.title}. ${slide.content}`;
    
    try {
      setIsUploading(true);
      const generatedUrl = await generateImage(prompt, slide.id);
      
      if (generatedUrl) {
        setImageUrl(generatedUrl);
        setShowImageOptions(false);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: "There was an error generating your image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setShowImageOptions(true);
  };

  const isGeneratingImage = results[slide.id]?.loading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slide.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-800/50">
              {imageUrl ? (
                <div className="relative">
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <img 
                      src={imageUrl} 
                      alt={slide.title} 
                      className="object-cover w-full h-full rounded-md"
                    />
                  </AspectRatio>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : showImageOptions ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-full mb-4">
                    <ImageIcon className="h-10 w-10 text-slate-400 dark:text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Add an image to your slide</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
                    Upload your own image or let AI generate one based on slide content
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      className="flex items-center gap-2" 
                      variant="outline"
                      onClick={() => document.getElementById("imageUpload")?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isUploading || isGeneratingImage}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Generate Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-5">
              <h3 className="font-medium text-lg mb-3">Content</h3>
              <p className="text-slate-600 dark:text-slate-300">{slide.content}</p>
            </div>
            
            {slide.example && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-md p-5">
                <h3 className="font-medium text-lg mb-2 text-amber-800 dark:text-amber-300">Example</h3>
                <p className="text-amber-700 dark:text-amber-200">{slide.example}</p>
              </div>
            )}
            
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md p-5">
              <h3 className="font-medium text-lg mb-2">Audio Script</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm italic">{slide.voiceoverScript}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlidePreviewModal;
