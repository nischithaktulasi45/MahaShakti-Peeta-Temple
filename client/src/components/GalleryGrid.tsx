import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { contentService } from "@/services/contentService";
import { type MediaOrientation } from "@/lib/mediaOrientation";

export default function GalleryGrid() {
  const [images, setImages] = useState<Array<{ _id: string; title: string; imageUrl: string; category: string; orientation?: MediaOrientation }>>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [imageOrientations, setImageOrientations] = useState<Record<string, MediaOrientation>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const response = await contentService.getGallery();
        const responseData = Array.isArray(response?.data) ? response.data : [];
        setImages(responseData);
      } catch (error) {
        console.error("Failed to load gallery from server:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const filteredImages = useMemo(() => images, [images]);

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
      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading gallery...</p>
        </div>
      )}

      {/* Empty state - no photos uploaded */}
      {!loading && filteredImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#083C78]/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#083C78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">No photos yet</p>
          <p className="text-gray-400 text-sm mt-1">Gallery photos will appear here once uploaded.</p>
        </div>
      )}

      {/* 4‑column grid with smaller images */}
      {!loading && filteredImages.length > 0 && (
        <div className="grid max-w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {filteredImages.map((img, idx) => {
              const orientation = (img.orientation as MediaOrientation) || imageOrientations[img._id] || "landscape";
              const aspectStyle =
                orientation === "portrait"
                  ? { aspectRatio: "3 / 4" }
                  : orientation === "square"
                  ? { aspectRatio: "1 / 1" }
                  : orientation === "vertical"
                  ? { aspectRatio: "9 / 16" }
                  : { aspectRatio: "16 / 9" };

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img._id}
                  className="relative max-w-full overflow-hidden rounded-lg bg-slate-950 shadow-sm transition-shadow group cursor-pointer hover:shadow-xl"
                  onClick={() => openLightbox(idx)}
                >
                  <div className="w-full overflow-hidden" style={aspectStyle}>
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="h-full w-full max-w-full object-contain bg-slate-950"
                      loading="lazy"
                      onLoad={(event) => {
                        if (!img.orientation) {
                          const media = event.currentTarget;
                          const autoOrientation: MediaOrientation = media.naturalWidth >= media.naturalHeight ? "landscape" : "portrait";
                          setImageOrientations((current) =>
                            current[img._id] === autoOrientation ? current : { ...current, [img._id]: autoOrientation },
                          );
                        }
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[#0A4D9B]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                      <span className="text-xl">+</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

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
              src={filteredImages[currentImageIdx]?.imageUrl} 
              alt={filteredImages[currentImageIdx]?.title || "Lightbox view"} 
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
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