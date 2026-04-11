import { motion } from 'framer-motion';
import { Download, Share2, Trash2, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageData } from '../types';
import { getStoredImages, removeImage } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const IMAGES_PER_PAGE = 12;

export function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [displayedImages, setDisplayedImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  useEffect(() => {
    const loadedImages = getStoredImages();
    setImages(loadedImages);
    setDisplayedImages(loadedImages.slice(0, IMAGES_PER_PAGE));
  }, []);

  useEffect(() => {
    if (inView) {
      loadMoreImages();
    }
  }, [inView]);

  const loadMoreImages = () => {
    const nextImages = images.slice(
      displayedImages.length,
      displayedImages.length + IMAGES_PER_PAGE
    );
    if (nextImages.length > 0) {
      setDisplayedImages(prev => [...prev, ...nextImages]);
      setPage(prev => prev + 1);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'imagio-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleShare = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my AI-generated image!',
          text: 'Created with Imagio',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const handleDelete = (index: number) => {
    removeImage(index);
    const updatedImages = getStoredImages();
    setImages(updatedImages);
    setDisplayedImages(updatedImages.slice(0, displayedImages.length));
  };

  return (
    <div className="container mx-auto px-4 min-h-[80vh] relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-syne font-bold mb-4 text-white">
          Your Creations
        </h1>
        <p className="text-lg text-white/60 font-space-grotesk">Your personal gallery of generated masterpieces</p>
      </motion.div>

      {displayedImages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[50vh]"
        >
          <div className="text-center">
            <h2 className="text-2xl font-syne font-medium text-white mb-4">Your gallery is empty</h2>
            <p className="text-white/60 max-w-md mb-8 font-space-grotesk">
              Start creating amazing images to fill your gallery with masterpieces
            </p>
            <button
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            >
              <span className="font-space-grotesk">Create Your First Image</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group bg-purple-darker rounded-xl overflow-hidden aspect-square"
            >
              <div className="aspect-square overflow-hidden rounded-2xl glass-morphism">
                <img
                  src={image.url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm mb-3 line-clamp-2">{image.prompt}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDownload(image.url)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title="Download image"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleShare(image.url)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title="Share image"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {displayedImages.length < images.length && (
        <div ref={ref} className="mt-8 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
}