import { motion } from 'framer-motion';
import { Download, Wand2, X, Share2, ArrowLeft } from 'lucide-react';
import { ImageData } from '../types';
import { useState } from 'react';

interface ImageResultsProps {
  images: ImageData[];
  onImageClick: (index: number) => void;
  onEditImage: (index: number, editPrompt: string) => void;
  downloadImage: (image: string, index: number) => void;
  shareImage: (image: string) => void;
}

export function ImageResults({ images, onImageClick, onEditImage, downloadImage, shareImage }: ImageResultsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = (index: number) => {
    if (!editPrompt.trim()) return;
    onEditImage(index, editPrompt);
    setEditPrompt('');
    setEditingIndex(null);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto px-4 sm:px-0"
        >
          {images.map((image, index) => {
            const aspectRatio = image.settings?.aspectRatio || 'square';
            const aspectRatioClass = 
              aspectRatio === 'vertical' ? 'aspect-[3/4]' : 
              aspectRatio === 'horizontal' ? 'aspect-[4/3]' : 
              'aspect-square';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1
                }}
                className={`relative group bg-purple-darker rounded-xl overflow-hidden ${aspectRatioClass}`}
                style={{ 
                  width: '100%',
                  maxWidth: '512px',
                  margin: '0 auto'
                }}
              >
                <div className={`${aspectRatioClass} overflow-hidden rounded-2xl glass-morphism relative`}>
                  <img
                    src={image.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {image.isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-white/80 text-sm">Enhancing your image...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          {image.prompt && (
                            <p className="text-white/90 text-sm mb-3 line-clamp-2 font-space-grotesk">
                              {image.prompt}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => downloadImage(image.url, index)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                            title="Download image"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => shareImage(image.url)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                            title="Share image"
                          >
                            <Share2 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => setEditingIndex(index)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                            title="Edit image"
                          >
                            <Wand2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Panel */}
                  {editingIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute inset-0 bg-black/95 backdrop-blur-md p-6 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <button
                          onClick={() => {
                            setEditingIndex(null);
                            setEditPrompt('');
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
                        >
                          <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
                        </button>
                        <h3 className="text-lg font-medium text-white/90">Enhance Image</h3>
                        <div className="w-9"></div>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="mb-4">
                          <p className="text-white/60 text-sm mb-2">Original Prompt:</p>
                          <p className="text-white/90 text-sm font-medium">{image.prompt}</p>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <label className="text-white/60 text-sm mb-2">
                            What would you like to change?
                          </label>
                          <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Describe the changes you want to make..."
                            className="flex-1 min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all duration-300 text-sm resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey && editPrompt.trim()) {
                                e.preventDefault();
                                handleEditSubmit(index);
                              }
                            }}
                          />
                        </div>

                        <button
                          onClick={() => handleEditSubmit(index)}
                          disabled={!editPrompt.trim() || image.isLoading}
                          className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white/90 disabled:text-white/50 font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Wand2 className="w-4 h-4" />
                          <span>Enhance Image</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}