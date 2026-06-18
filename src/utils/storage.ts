import { ImageData } from '../types';

const STORAGE_KEY = 'imagio_images';
const MAX_STORED_IMAGES = 12;

export function saveImages(images: ImageData[]) {
  const nextImages = images.slice(0, MAX_STORED_IMAGES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextImages));
  } catch (error) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextImages.slice(0, 6)));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    console.error('Error saving images:', error);
  }
}

export function getStoredImages(): ImageData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
}

export const removeImage = (index: number) => {
  const currentImages = getStoredImages();
  currentImages.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentImages));
};
