import { Link } from "wouter";
import { useEffect, useState } from "react";

const TITLE_LINES: Record<string, string[]> = {
  en: ["MahaShakti", "Peeta", "Temple"],
  kn: ["ಮಹಾಶಕ್ತಿ", "ಪೀಠ", "ದೇವಸ್ಥಾನ"],
};

export default function HeroSlider() {
  const [language, setLanguage] = useState<"en" | "kn">(() => {
    const saved = localStorage.getItem("site-language");
    return saved === "kn" ? "kn" : "en";
  });

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: "en" | "kn" }>;
      setLanguage(customEvent.detail.language);
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  const titleLines = TITLE_LINES[language] || TITLE_LINES.en;
  const wordDelay = 0.25;

  return (
    <section className="relative min-h-[calc(100dvh-160px)] overflow-hidden flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6, 22, 48, 0.38), rgba(6, 22, 48, 0.58)), url('/image/Mahashakti_Temple.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/45" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8 text-center">
        <p className="mb-3 mx-auto max-w-5xl text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white md:text-sm">
          Sacred Abode of the Divine Grace and Spiritual Enlightenment
        </p>

        <h1
          className="mx-auto max-w-6xl font-serif text-4xl font-black uppercase leading-[1.05] tracking-[0.04em] md:text-6xl lg:text-7xl"
          translate="no"
        >
          {titleLines.map((line, index) => (
            <span
              key={index}
              className="char-glow"
              style={{
                display: "block",           // <-- ensures each line is on its own row
                animationDelay: `${index * wordDelay}s`,
              }}
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-4 mx-auto max-w-4xl text-lg font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:text-xl">
          Sacred Abode of the Divine Grace and Spiritual Enlightenment
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/about"
            className="inline-flex items-center justify-center bg-[#D4AF37] px-8 py-3 text-base font-bold text-[#083C78] shadow-[0_18px_35px_rgba(212,175,55,0.28)] transition-transform duration-300 hover:scale-105"
          >
            Visit Temple
          </Link>
          <Link
            href="/donate/qr"
            className="inline-flex items-center justify-center border-2 border-white px-8 py-3 text-base font-bold text-white transition-colors duration-300 hover:bg-white hover:text-[#083C78]"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </section>
  );
}