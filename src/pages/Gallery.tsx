import GalleryGrid from "@/components/GalleryGrid";

export default function Gallery() {
  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-[#083C78] mb-4">Temple Gallery</h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mt-5 text-base md:text-lg text-gray-600 max-w-3xl mx-auto font-sans">
            A visual journey through the sacred moments, grand festivals, and architectural beauty of Mahashakti Peeta Temple.
          </p>
        </div>
        <GalleryGrid />
      </div>
    </div>
  );
}