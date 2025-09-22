"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X, Grid, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  side: 'front' | 'back';
}

export default function PhotoGradingComponent() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [activeImage, setActiveImage] = useState<'front' | 'back'>('front');
  const [showCenteringLines, setShowCenteringLines] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random(),
            file,
            preview: e.target?.result as string,
            side: uploadedImages.length === 0 ? 'front' : 'back'
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const currentImage = uploadedImages.find(img => img.side === activeImage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Upload Card Photos</CardTitle>
          <CardDescription className="text-gray-400">
            Upload front and back photos of your card for AI grading analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">Drag and drop your card images here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Select Photos
            </Button>
          </div>

          {/* Image Tabs */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={activeImage === 'front' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveImage('front')}
                  className={activeImage === 'front' 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                  }
                >
                  Front
                </Button>
                <Button
                  variant={activeImage === 'back' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveImage('back')}
                  className={activeImage === 'back' 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                  }
                >
                  Back
                </Button>
              </div>

              {/* Image Preview */}
              {currentImage && (
                <div className="relative">
                  <div className="relative aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden">
                    <img
                      src={currentImage.preview}
                      alt={`Card ${currentImage.side}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Centering Lines Overlay */}
                    {showCenteringLines && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Vertical center line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500 opacity-70"></div>
                        {/* Horizontal center line */}
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500 opacity-70"></div>
                        {/* Grid lines */}
                        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                          {Array.from({ length: 100 }).map((_, i) => (
                            <div key={i} className="border border-red-500/20"></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remove button */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(currentImage.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Analysis Controls */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCenteringLines(!showCenteringLines)}
                      className="border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                    >
                      <Grid className="w-4 h-4 mr-2" />
                      {showCenteringLines ? 'Hide' : 'Show'} Centering Lines
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700/50"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Zoom
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Tips */}
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-white mb-2">Photo Tips for Best Results:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Use good lighting without glare or shadows</li>
              <li>• Place card on a flat, contrasting background</li>
              <li>• Ensure the entire card is visible and in focus</li>
              <li>• Take photos straight on, not at an angle</li>
              <li>• Upload both front and back for complete analysis</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results Section (Placeholder for now) */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white">AI Grading Analysis</CardTitle>
          <CardDescription className="text-gray-400">
            Preliminary grade estimation based on photo analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedImages.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Upload card photos to begin analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 text-center">
                  Analysis will appear here once implemented
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}