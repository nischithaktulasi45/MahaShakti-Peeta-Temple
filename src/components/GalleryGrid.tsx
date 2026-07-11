import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CATEGORIES = ["All"];

const IMAGES = [
  
  // New 10 photos (photo1.jpg to photo10.jpg)
  { id: 13, src: "/image/photo1.jpeg", category: "All" },
  { id: 14, src: "/image/photo2.jpeg", category: "All" },
  { id: 15, src: "/image/photo3.jpeg", category: "All" },
  { id: 16, src: "/image/photo4.jpeg", category: "All" },
  { id: 17, src: "/image/photo5.jpeg", category: "All" },
  { id: 18, src: "/image/photo6.jpeg", category: "All" },
  { id: 19, src: "/image/photo7.jpeg", category: "All" },
  { id: 20, src: "/image/photo8.jpeg", category: "All" },
  


  // Existing 12 images
  { id: 1, src: "/image/page_1.jpg", category: "All" },
  { id: 2, src: "/image/page_2.jpg", category: "All" },
  { id: 3, src: "/image/page_3.jpg", category: "All" },
  { id: 4, src: "/image/page_4.jpg", category: "All" },
  { id: 5, src: "/image/page_5.jpg", category: "All" },
  { id: 6, src: "/image/page_6.jpg", category: "All" },
  { id: 7, src: "/image/page_7.jpg", category: "All" },
  { id: 8, src: "/image/page_8.jpg", category: "All" },
  { id: 9, src: "/image/page_9.jpg", category: "All" },
  { id: 10, src: "/image/page_10.jpg", category: "All" },
  { id: 11, src: "/image/page_11.jpg", category: "All" },
  { id: 12, src: "/image/page_12.jpg", category: "All" },
];

// Smaller placeholder SVG
const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%234a5568' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const filteredImages = IMAGES.filter(img => activeCategory === "All" || img.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIdx(index);
    setLightboxOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-3 sm:mb-12 sm:gap-4">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all duration-300 sm:px-6 ${
              activeCategory === category 
                ? 'bg-[#0A4D9B] text-white shadow-md' 
                : 'bg-white text-[#0A4D9B] border border-[#0A4D9B] hover:bg-[#EAF4FF]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 4‑column grid with smaller images */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {filteredImages.map((img, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={img.id}
              className="relative rounded-lg overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
              onClick={() => openLightbox(idx)}
            >
              {/* Smaller aspect ratio: 3:4 (portrait) to reduce width, or use fixed height */}
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={img.src}
                  alt="Gallery item"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-[#0A4D9B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                  <span className="text-xl">+</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox – unchanged, but placeholder also smaller in lightbox? No, lightbox should be large */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-white text-4xl hover:text-[#D4AF37] transition-colors z-[110]">
              <FaTimes />
            </button>
            <button onClick={prevImage} className="absolute left-6 text-white text-5xl hover:text-[#D4AF37] transition-colors z-[110]">
              <FaChevronLeft />
            </button>
            <img 
              src={filteredImages[currentImageIdx].src} 
              alt="Lightbox view" 
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
              }}
            />
            <button onClick={nextImage} className="absolute right-6 text-white text-5xl hover:text-[#D4AF37] transition-colors z-[110]">
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}