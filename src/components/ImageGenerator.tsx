import { Sparkles, Wand2, Settings, Lightbulb, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ImageSettings } from '../types';

interface ImageGeneratorProps {
  onGenerate: (prompt: string, model: string, settings: Partial<ImageSettings>) => Promise<void>;
  isGenerating: boolean;
  message: string;
}

const promptSuggestions = [
  "A magical forest with glowing mushrooms",
  "A futuristic cityscape at sunset",
  "A cute robot making coffee",
  "An underwater palace with mermaids",
  "A steampunk flying machine"
];

export function ImageGenerator({ onGenerate, isGenerating, message }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel] = useState('zimage');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'vertical' | 'horizontal'>('square');
  const [imageCount, setImageCount] = useState(2);
  const [showPromptSuggestions, setShowPromptSuggestions] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('promptHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  const aspectRatioOptions = [
    {
      value: 'square',
      label: 'Square',
      dimensions: '1024×1024',
      description: 'Perfect for social media posts'
    },
    {
      value: 'vertical',
      label: 'Vertical',
      dimensions: '1080×1920',
      description: 'Ideal for TikTok, Reels, and Stories'
    },
    {
      value: 'horizontal',
      label: 'Horizontal',
      dimensions: '1920×1080',
      description: 'Perfect for YouTube thumbnails and videos'
    }
  ] as const;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    const newHistory = [prompt, ...promptHistory.slice(0, 9)];
    setPromptHistory(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
    
    onGenerate(prompt, selectedModel, {
      aspectRatio,
      imageCount,
      seed: Math.floor(Math.random() * 1000000)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto min-h-[calc(100vh-300px)] flex items-center"
    >
      <div className="relative glass-morphism rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 w-full backdrop-blur-xl bg-white/5 border border-white/10">
        <div className="relative">
          <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 z-10 flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              title="Prompt History"
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => setShowPromptSuggestions(!showPromptSuggestions)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              title="Prompt Suggestions"
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              title="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 hover:text-white transition-colors" />
            </button>
          </div>

          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 input-area">
            <Sparkles className="absolute left-3 sm:left-4 top-6 w-4 h-4 sm:w-5 sm:h-5 text-white/70 sparkle-icon" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isGenerating && prompt.trim()) {
                    handleGenerate();
                  }
                }
              }}
              placeholder="Describe your dream image..."
              className="w-full bg-transparent text-white/90 placeholder-white/50 py-4 sm:py-5 px-10 sm:px-12 focus:outline-none h-32 text-sm sm:text-base resize-none font-space-grotesk"
              disabled={isGenerating}
            />
          </div>
        </div>

        <AnimatePresence>
          {showPromptSuggestions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2"
            >
              <div className="text-sm font-medium text-white/70 mb-2">Try these prompts:</div>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(suggestion)}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg transition-colors font-space-grotesk"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHistory && promptHistory.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2"
            >
              <div className="text-sm font-medium text-white/70 mb-2">Recent prompts:</div>
              <div className="flex flex-col gap-2">
                {promptHistory.map((historyPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(historyPrompt)}
                    className="text-left text-sm bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg transition-colors truncate font-space-grotesk"
                  >
                    {historyPrompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6"
            >
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/70">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {aspectRatioOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectRatio(option.value)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 ${
                        aspectRatio === option.value
                          ? 'bg-white/20 border border-white/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white/90">{option.label}</div>
                          <div className="text-sm text-white/50">{option.dimensions}</div>
                        </div>
                        <div className="text-sm text-white/50">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-white/70">
                  Number of Images (1-4)
                </label>
                <div className="bg-white/5 p-4 rounded-xl">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={imageCount}
                    onChange={(e) => setImageCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="mt-2 text-center text-white/90 font-medium">
                    {imageCount} {imageCount === 1 ? 'image' : 'images'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="generate-button w-full mt-6 py-4 rounded-xl text-white/90 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Creating your masterpiece...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-white/70" />
              <span>Generate Images</span>
            </>
          )}
        </button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm ${
              message.includes('Error') ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}