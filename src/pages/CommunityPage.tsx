import { motion } from 'framer-motion';
import { Download, Share2, Heart, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageData } from '../types';
import { downloadImage } from '../services/imageService';

export function CommunityPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      loadMoreImages();
    }
  }, [inView]);

  const loadMoreImages = async () => {
    try {
      // In a real app, this would fetch from your backend
      const newImages = await fetchCommunityImages(page);
      setImages(prev => [...prev, ...newImages]);
      setPage(prev => prev + 1);
      setHasMore(newImages.length > 0);
    } catch (error) {
      console.error('Error loading community images:', error);
    }
  };

  const handleLike = async (imageId: string) => {
    // Implement like functionality
    console.log('Liked image:', imageId);
  };

  const handleShare = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this amazing AI-generated image!',
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Community Creations
        </h1>
        <p className="text-lg text-purple-300/70">
          Discover and get inspired by amazing AI-generated artwork
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group bg-purple-darker rounded-xl overflow-hidden"
          >
            <div className="aspect-square overflow-hidden rounded-2xl glass-morphism">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm mb-2 line-clamp-2">{image.prompt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(image.url)}
                      className="flex items-center gap-1 text-white/90 hover:text-pink-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">123</span>
                    </button>
                    <button className="flex items-center gap-1 text-white/90 hover:text-purple-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">45</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadImage(image.url)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleShare(image.url)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="mt-8 text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
}

// Temporary mock function - replace with actual API call
async function fetchCommunityImages(page: number): Promise<ImageData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return Array(6).fill(null).map((_, i) => ({
    url: `https://picsum.photos/seed/${page * 6 + i}/800/800`,
    prompt: 'Sample community image',
    isEditing: false,
    isLoading: false,
    settings: {
      seed: Math.random(),
      model: 'zimage'
    }
  }));
}