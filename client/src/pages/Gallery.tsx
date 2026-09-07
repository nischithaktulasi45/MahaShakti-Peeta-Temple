import { useState, useEffect } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import ShaktiPeethaCard from "@/components/ShaktiPeethaCard";
import { mahaShaktiPeeta } from "@/data/mahaShaktiPeeta";

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
    const scrollToHash = () => {
      if (window.location.hash !== "#shakti-peetha") {
        window.scrollTo(0, 0);
        return;
      }

      window.requestAnimationFrame(() => {
        document.getElementById("shakti-peetha")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
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
        <section
          id="shakti-peetha"
          className="mt-16 scroll-mt-[calc(var(--header-height)+1rem)] border-t border-[#D4AF37]/40 pt-12"
        >
          <div className="mb-10 text-center">
            <h2 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">18 Shakti Peetha</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
            <p className="mx-auto mt-5 max-w-3xl font-sans text-sm text-gray-600 sm:text-base md:text-lg">
              Explore the sacred temples and stories of all 18 Maha Shakti Peethas.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {mahaShaktiPeeta.map((peetha, index) => (
              <ShaktiPeethaCard key={peetha.id} peetha={peetha} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}