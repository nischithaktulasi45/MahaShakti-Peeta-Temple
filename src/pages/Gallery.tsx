import { useState, useEffect } from "react";
import GalleryGrid from "@/components/GalleryGrid";

export default function Gallery() {
  const [language, setLanguage] = useState<"en" | "kn">(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("site-language") : null;
    return saved === "kn" ? "kn" : "en";
  });

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: "en" | "kn" }>;
      setLanguage(customEvent.detail.language);
    };

    window.addEventListener("languageChanged", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChanged", handleLanguageChange as EventListener);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1
            className={`mb-4 font-serif text-[#083C78] ${
              language === "kn" ? "text-2xl sm:text-3xl md:text-3xl leading-snug" : "text-2xl sm:text-3xl md:text-4xl"
            }`}
          >
            {language === "kn" ? "ದೇವಾಲಯದ ಗ್ಯಾಲರಿ" : "Temple Gallery"}
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mx-auto mt-5 max-w-3xl font-sans text-sm text-gray-600 sm:text-base md:text-lg">
            A visual journey through the sacred moments, grand festivals, and architectural beauty of Mahashakti Peeta Temple.
          </p>
        </div>
        <GalleryGrid />
      </div>
    </div>
  );
}