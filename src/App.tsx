import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageResults } from './components/ImageResults';
import { ImageViewer } from './components/ImageViewer';
import { GalleryPage } from './pages/GalleryPage';
import { generateImages, downloadImage } from './services/imageService';
import { ImageData, ImageSettings } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { saveImages, getStoredImages } from './utils/storage';

function App() {
  const [generatedImages, setGeneratedImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: 0.2
      }
    }
  };

  const handleGenerate = async (prompt: string, model: string, settings: Partial<ImageSettings>) => {
    try {
      setIsGenerating(true);
      setMessage('');
      
      const newImages = await generateImages(prompt, model, settings.imageCount || 2, settings);
      
      const imageDataArray = newImages.map(img => ({
        url: img.url,
        prompt: prompt,
        isEditing: false,
        isLoading: false,
        settings: img.settings,
        history: []
      }));
      
      setGeneratedImages(imageDataArray);

      const currentGallery = getStoredImages();
      saveImages([...currentGallery, ...imageDataArray]);

      setMessage('Images generated successfully!');
    } catch (error) {
      setMessage('Error generating images. Please try again.');
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(generatedImages[index].url);
    setIsModalOpen(true);
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

  return (
    <motion.div 
      className="min-h-screen bg-[#1a0702] relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Glowing Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[#4a1206] via-[#1a0702] to-[#1a0702]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[80px]" />
      </div>

      <motion.nav 
        variants={navVariants}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4"
      >
        <motion.div 
          className="nav-container w-full max-w-md"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-pill flex-1 text-center ${isActive ? 'active' : ''}`
            }
          >
            Create
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `nav-pill flex-1 text-center ${isActive ? 'active' : ''}`
            }
          >
            Gallery
          </NavLink>
        </motion.div>
      </motion.nav>
      
      <motion.header 
        className="relative container mx-auto px-4 pt-24 pb-6 text-center"
        variants={containerVariants}
      >
        <motion.h1 
          variants={itemVariants}
          className="text-6xl sm:text-7xl mb-3 font-syne font-bold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 text-transparent bg-clip-text">
            Imagio
          </span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg text-white/60 font-space-grotesk"
        >
          Transform your imagination into reality
        </motion.p>
      </motion.header>

      <motion.main 
        className="relative container mx-auto px-4 py-6"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <ImageGenerator
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    message={message}
                  />
                  <ImageResults
                    images={generatedImages}
                    onImageClick={handleImageClick}
                    onEditImage={() => {}}
                    downloadImage={downloadImage}
                    shareImage={handleShare}
                  />
                  {selectedImage && (
                    <ImageViewer
                      imageUrl={selectedImage}
                      isModalOpen={isModalOpen}
                      onModalClose={() => setIsModalOpen(false)}
                      onCopyLink={() => {}}
                      onShare={() => handleShare(selectedImage)}
                      prompt=""
                      onDownload={async () => {
                        if (selectedImage) {
                          await downloadImage(selectedImage);
                        }
                      }}
                    />
                  )}
                </motion.div>
              }
            />
            <Route 
              path="/gallery" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <GalleryPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </motion.main>

      <footer className="mt-auto py-8 text-center text-white/70 text-sm">
        <p className="mb-2">
          Built with ❤️ using
          <span className="font-semibold"> React</span>,
          <span className="font-semibold"> Vite</span>,
          <span className="font-semibold"> Tailwind CSS</span>, and
          <span className="font-semibold"> Pollinations API</span>
        </p>
        <p>© {new Date().getFullYear()} Ali Sayed • All rights reserved</p>
      </footer>
    </motion.div>
  );
}

export default App;