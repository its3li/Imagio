import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageResults } from './components/ImageResults';
import { ImageViewer } from './components/ImageViewer';
import { HomeContent } from './components/HomeContent';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { PromptGuidePage } from './pages/PromptGuidePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { generateImages, downloadImage } from './services/imageService';
import { ImageData, ImageSettings } from './types';
import { saveImages, getStoredImages } from './utils/storage';

const primaryNavItems = [
  { to: '/', label: 'Create' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/prompt-guide', label: 'Guide' },
];

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/prompt-guide', label: 'Prompt Guide' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/contact', label: 'Contact' },
];

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};

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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: pageTransition,
    },
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...pageTransition,
        delay: 0.2,
      },
    },
  };

  const handleGenerate = async (prompt: string, model: string, settings: Partial<ImageSettings>) => {
    try {
      setIsGenerating(true);
      setMessage('');

      const newImages = await generateImages(prompt, model, settings.imageCount || 2, settings);

      const imageDataArray = newImages.map((img) => ({
        url: img.url,
        prompt,
        isEditing: false,
        isLoading: false,
        settings: img.settings,
        history: [],
      }));

      setGeneratedImages(imageDataArray);

      const currentGallery = getStoredImages();
      saveImages([...imageDataArray, ...currentGallery]);

      setMessage('Images generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating images. Please try again.';
      setMessage(`Error: ${errorMessage}`);
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
          url,
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
      className="relative min-h-screen overflow-hidden bg-[#1a0702]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#4a1206] via-[#1a0702] to-[#1a0702]" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[100px]" />
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-orange-500/20 blur-[80px]" />
      </div>

      <motion.nav
        variants={navVariants}
        className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 py-4"
      >
        <motion.div
          className="nav-container w-full max-w-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-pill flex-1 text-center ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </motion.div>
      </motion.nav>

      <motion.header
        className="container relative mx-auto px-4 pb-6 pt-24 text-center"
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className="mb-3 font-syne text-6xl font-bold sm:text-7xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Imagio
          </span>
          <span className="sr-only"> AI Image Generator</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-space-grotesk text-base text-white/60 sm:text-lg"
        >
          Free AI image generator that transforms text prompts into downloadable artwork
        </motion.p>
      </motion.header>

      <motion.main className="container relative mx-auto px-4 py-6" variants={containerVariants}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={pageTransition}
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
                  <HomeContent />
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
                  transition={pageTransition}
                >
                  <GalleryPage />
                </motion.div>
              }
            />
            <Route
              path="/prompt-guide"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={pageTransition}
                >
                  <PromptGuidePage />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={pageTransition}
                >
                  <AboutPage />
                </motion.div>
              }
            />
            <Route
              path="/privacy"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={pageTransition}
                >
                  <PrivacyPolicyPage />
                </motion.div>
              }
            />
            <Route
              path="/terms"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={pageTransition}
                >
                  <TermsPage />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={pageTransition}
                >
                  <ContactPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </motion.main>

      <footer className="relative mt-auto px-4 py-8 text-center text-sm text-white/70">
        <nav className="mb-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {footerLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className="hover:text-cyan-100">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="mb-2">
          Built with care using
          <span className="font-semibold"> React</span>,
          <span className="font-semibold"> Vite</span>,
          <span className="font-semibold"> Tailwind CSS</span>, and
          <span className="font-semibold"> Pollinations API</span>
        </p>
        <p>Copyright {new Date().getFullYear()} Ali Sayed. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}

export default App;
