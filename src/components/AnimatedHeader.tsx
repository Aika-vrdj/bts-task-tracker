
import { useEffect, useState } from 'react';

const headerImages = [
  { 
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    alt: "Retro coding scene" 
  },
  { 
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    alt: "White robot near brown wall" 
  },
  { 
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    alt: "Matrix style code" 
  },
  { 
    url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    alt: "Gray and black laptop" 
  },
];

const AnimatedHeader = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(() => {
    // Get a random image on initial load
    return Math.floor(Math.random() * headerImages.length);
  });

  return (
    <div className="relative h-40 md:h-64 mb-6 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10"></div>
      <img 
        src={headerImages[currentImageIndex].url} 
        alt={headerImages[currentImageIndex].alt}
        className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-5000 animate-fade-in"
      />
    </div>
  );
};

export default AnimatedHeader;
