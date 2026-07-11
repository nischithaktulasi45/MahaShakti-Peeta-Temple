import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaBars,
  FaTimes,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Gods", path: "/gods" },
  { name: "Trust", path: "/trust" },
  { name: "Events", path: "/events" },
  { name: "progress gallery", path: "/progress_gallery" },
  { name: "Gallery", path: "/gallery" },
  { name: "Donate", path: "/donate" },
  { name: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center bg-[#083C78] text-white px-6 py-2 text-xs font-sans">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <FaPhoneAlt className="text-[#D4AF37]" />
            +91 9876543210, +91 9876543211 
            <br />
            +91 9686903945
          </span>

          <span className="flex items-center gap-2">
            <FaEnvelope className="text-[#D4AF37]" />
            mahashakthipeetacharitabletres@gmail.com
          </span>

          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#D4AF37]" />
            Magadi Main Road, Bantarakuppe Colony, Magadi Taluk
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-sm">
            <FaYoutube className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaFacebook className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
            {/* ✅ WhatsApp link with the same pre‑filled message as the floating button */}
            <a
              href="https://api.whatsapp.com/send?phone=919686903945&text=Hello%20I%20would%20like%20to%20know%20more%20about%20temple%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors"
            >
              <FaWhatsapp />
            </a>
          </div>

          <Link
            href="/donate"
            onClick={scrollToTop}
            className="bg-[#D4AF37] text-[#083C78] font-bold px-4 py-1 rounded hover:bg-white hover:text-[#083C78] transition"
          >
            Donate
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#0A4D9B] text-white px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">

          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 p-1 shadow-lg shadow-black/25 ring-2 ring-[#D4AF37]/70 backdrop-blur-sm lg:h-16 lg:w-16">
              <img
                src="/image/logo.png"
                alt="Mahashakti Peeta Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <h1 className="font-serif text-xl font-bold tracking-wider text-[#D4AF37] lg:text-2xl">
              Mahashakti Peeta
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={scrollToTop}
                className={
                  link.name === "Donate"
                    ? `
                    relative
                    overflow-hidden
                    flex
                    items-center
                    gap-2
                    px-6
                    py-2
                    rounded-full
                    bg-gradient-to-r
                    from-yellow-500
                    via-orange-400
                    to-yellow-500
                    text-white
                    font-bold
                    shadow-lg
                    shadow-yellow-500/60
                    transition-all
                    duration-300
                    hover:scale-110
                    animate-pulse
                  `
                    : `font-sans text-sm font-medium transition-all duration-300 py-2 border-b-2 ${
                        location === link.path
                          ? "border-[#D4AF37] text-[#D4AF37]"
                          : "border-transparent hover:text-[#D4AF37]"
                      }`
                }
              >
                {link.name === "Donate" && (
                  <>
                    <FaHandHoldingHeart />

                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 animate-ping"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                    </span>

                    <span className="absolute inset-0 overflow-hidden rounded-full">
                      <span className="absolute left-[-120%] top-0 h-full w-1/2 bg-white/30 skew-x-12 animate-[shine_2.5s_linear_infinite]"></span>
                    </span>
                  </>
                )}

                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-[#D4AF37]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#0A4D9B] border-t border-[#083C78] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className={
                    link.name === "Donate"
                      ? "flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 text-white font-bold py-3 rounded-lg my-2 shadow-lg animate-pulse"
                      : `font-sans py-3 text-lg border-b border-[#083C78] ${
                          location === link.path
                            ? "text-[#D4AF37]"
                            : "text-white"
                        }`
                  }
                >
                  {link.name === "Donate" && <FaHandHoldingHeart />}
                  {link.name}
                </Link>
              ))}

              <div className="mt-4">
                <Link
                  href="/donate"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className="block text-center bg-[#D4AF37] text-[#083C78] font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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