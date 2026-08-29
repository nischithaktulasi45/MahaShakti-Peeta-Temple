import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaBars,
  FaTimes,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import GoogleTranslateToggle from "./GoogleTranslateToggle";

export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Gods", path: "/gods" },
  { name: "Trust", path: "/trust" },
  { name: "Trust Documents", path: "/trust-documents" },
  { name: "Events", path: "/events" },
  { name: "Progress Gallery", path: "/progress_gallery" },
  { name: "Gallery", path: "/gallery" },
  { name: "Donate", path: "/donate" },
  { name: "Contact Us", path: "/contact" },
];

const KANNADA_NAV_LABELS: Record<string, string> = {
  Home: "ಮುಖಪುಟ",
  "About Us": "ನಮ್ಮ ಬಗ್ಗೆ",
  Gods: "ದೇವರುಗಳು",
  Trust: "ಟ್ರಸ್ಟ್",
  "Trust Documents": "ಟ್ರಸ್ಟ್ ದಾಖಲೆಗಳು",
  Events: "ದೇವಾಲಯದ ಕಾರ್ಯಕ್ರಮಗಳು",
  "Progress Gallery": "ಪ್ರಗತಿ ಗ್ಯಾಲರಿ",
  Gallery: "ಗ್ಯಾಲರಿ",
  Donate: "ದಾನ ಮಾಡಿ",
  "Contact Us": "ಸಂಪರ್ಕಿಸಿ",
};

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [language, setLanguage] = useState<"en" | "kn">(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("site-language")
        : null;

    return saved === "kn" ? "kn" : "en";
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        language: "en" | "kn";
      }>;

      setLanguage(customEvent.detail.language);
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* =========================================================
          TOP BAR
      ========================================================= */}
      <div className="hidden items-center justify-between bg-[#083C78] px-5 py-2 text-xs font-sans text-white md:flex lg:px-6">
        {/* Contact Information */}
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <FaPhoneAlt className="text-[#D4AF37]" />
            +91 9008294112 , +91 9686903945
          </span>

          <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
            <FaEnvelope className="shrink-0 text-[#D4AF37]" />
            <span className="truncate">
             mahashakthipeetacharitabletrus@gmail.com
            </span>
          </span>

          <span className="hidden items-center gap-2 whitespace-nowrap xl:flex">
            <FaMapMarkerAlt className="shrink-0 text-[#D4AF37]" />
            Magadi Main Road, Bantarakuppe Colony, Magadi Taluk
          </span>
        </div>

        {/* Social Icons + Donate */}
        <div className="ml-4 flex shrink-0 items-center gap-4">
          <div className="flex items-center gap-3 text-sm">
            <a
              href="https://www.youtube.com/@mahashakthipeetacharitabletrus"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-colors hover:text-[#D4AF37]"
              aria-label="Visit Mahashakti Peeta Charitable Trust on YouTube"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.instagram.com/mahashakti_peeta/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-colors hover:text-[#D4AF37]"
              aria-label="Visit Mahashakti Peeta on Instagram"
            >
              <FaInstagram />
            </a>

            {/* Direct WhatsApp link */}
            <a
              href="https://wa.me/919686903945?text=Hello%20Shivappa,%20I%20would%20like%20to%20know%20more%20about%20the%20temple.%20Please%20assist%20me.%20Thank%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#D4AF37]"
              aria-label="Contact Mahashakti Peeta on WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>

          <Link
            href="/donate"
            onClick={scrollToTop}
            className="whitespace-nowrap rounded bg-[#D4AF37] px-4 py-1 font-bold text-[#083C78] transition hover:bg-white hover:text-[#083C78]"
          >
            Donate
          </Link>
        </div>
      </div>

      {/* =========================================================
          MAIN NAVBAR
      ========================================================= */}
      <nav className="relative bg-[#0A4D9B] px-3 py-2 text-white sm:px-4 lg:px-5">
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3">
          {/* =====================================================
              LOGO + TITLE
          ===================================================== */}
          <Link
            href="/"
            onClick={scrollToTop}
            className={`flex shrink-0 items-center gap-2 sm:gap-3 ${language === "kn" ? "lg:gap-1" : ""}`}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 p-1 shadow-lg shadow-black/25 ring-2 ring-[#D4AF37]/70 backdrop-blur-sm sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${language === "kn" ? "lg:h-14 lg:w-14" : ""}`}>
              <img
                src="/image/logo.png"
                alt="Mahashakti Peeta Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            {language === "kn" ? (
              <h1 className="max-w-[175px] whitespace-normal font-serif text-base font-bold leading-[0.95] tracking-normal text-[#D4AF37] sm:max-w-[210px] sm:text-lg md:text-xl lg:max-w-[175px] lg:text-base">
                ಮಹಾಶಕ್ತಿ ಪೀಠ
                <br />
                ದೇವಾಲಯ
              </h1>
            ) : (
              <h1 className="max-w-[175px] whitespace-normal font-serif text-base font-bold leading-[0.95] tracking-[0.06em] text-[#D4AF37] sm:max-w-[210px] sm:text-lg md:text-xl lg:max-w-[220px] lg:text-[1.7rem]">
                Mahashakti Peeta
                <br />
                Temple
              </h1>
            )}
          </Link>

          {/* =====================================================
              DESKTOP MENU
              
              IMPORTANT:
              - flex-nowrap keeps everything in one row
              - whitespace-nowrap prevents wrapping
              - smaller font allows Contact Us to remain visible
              - compact gap creates clean spacing
          ===================================================== */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 lg:flex xl:gap-3">
            {NAV_LINKS.map((link) => {
              const isDonate = link.name === "Donate";
              const isActive = location === link.path;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={scrollToTop}
                  className={
                    isDonate
                      ? `
                        relative
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        bg-gradient-to-r
                        from-yellow-500
                        via-orange-400
                        to-yellow-500
                        px-3
                        py-2
                        text-[0.72rem]
                        font-bold
                        text-white
                        shadow-lg
                        shadow-yellow-500/50
                        transition-all
                        duration-300
                        hover:scale-105
                        lg:px-3
                        xl:px-3.5
                        ${language === "kn" ? "px-1 text-[0.54rem] leading-none lg:px-1 lg:text-[0.56rem] xl:px-1.5 xl:text-[0.68rem]" : ""}
                      `
                      : `
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        whitespace-nowrap
                        border-b-2
                        border-transparent
                        px-1
                        py-2
                        text-[0.72rem]
                        font-medium
                        leading-none
                        transition-all
                        duration-300
                        lg:text-[0.76rem]
                        xl:text-[0.82rem]
                        ${language === "kn" ? "px-0 text-[0.54rem] leading-none lg:text-[0.56rem] xl:text-[0.68rem]" : ""}
                        ${
                          isActive
                            ? "border-[#D4AF37] text-[#D4AF37]"
                            : "hover:text-[#D4AF37]"
                        }
                      `
                  }
                >
                  {/* Donate Icon */}
                  {isDonate && (
                    <>
                      <FaHandHoldingHeart className="text-[0.75rem]" />

                      {/* Shine */}
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute left-[-120%] top-0 h-full w-1/2 skew-x-12 bg-white/30 animate-[shine_2.5s_linear_infinite]" />
                      </span>
                    </>
                  )}

                  {/* Navigation text */}
                  <span
                    translate="no"
                    className={
                      `notranslate ${
                        link.name === "Events" && language === "kn"
                          ? "text-[0.7rem]"
                          : ""
                      }`
                    }
                  >
                    {language === "kn"
                      ? KANNADA_NAV_LABELS[link.name]
                      : link.name === "Events"
                        ? "Temple Events"
                        : link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}
          <button
            type="button"
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 text-2xl text-[#D4AF37] transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <GoogleTranslateToggle embedded />
      </nav>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#083C78] bg-[#0A4D9B] lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-4 sm:px-6">
              {NAV_LINKS.map((link) => {
                const isDonate = link.name === "Donate";

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToTop();
                    }}
                    className={
                      isDonate
                        ? "my-2 flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 px-4 py-3 font-bold text-white shadow-lg animate-pulse"
                        : `min-h-[44px] whitespace-nowrap border-b border-[#083C78] py-3 font-sans text-base ${
                            location === link.path
                              ? "text-[#D4AF37]"
                              : "text-white"
                          }`
                    }
                  >
                    {isDonate && <FaHandHoldingHeart />}

                    <span translate="no" className="notranslate">
                      {language === "kn"
                        ? KANNADA_NAV_LABELS[link.name]
                        : link.name === "Events"
                          ? "Temple Events"
                          : link.name}
                    </span>
                  </Link>
                );
              })}

              {/* Mobile Donate Button */}
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/donate"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className="block min-h-[44px] rounded-lg bg-[#D4AF37] px-6 py-3 text-center font-bold text-[#083C78] transition-colors hover:bg-white"
                >
                  {language === "kn" ? "ಈಗಲೇ ದಾನ ಮಾಡಿ" : "Donate Now"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          SHINE ANIMATION
      ========================================================= */}
      <style>{`
        @keyframes shine {
          0% {
            left: -120%;
          }

          100% {
            left: 150%;
          }
        }
      `}</style>
    </header>
  );
}