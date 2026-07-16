import { Link } from "wouter";
import { FaYoutube, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#D4AF37] bg-[#083C78] pb-8 pt-10 text-white sm:pt-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="flex flex-col items-center text-center md:items-center">
          <div className="mb-4 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 p-1 shadow-lg shadow-black/25 ring-2 ring-[#D4AF37]/70 backdrop-blur-sm sm:h-[70px] sm:w-[70px]">
              <img
                src="/image/logo.png"
                alt="Maha Shakti Peeta logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <h2 className="font-serif text-2xl text-[#D4AF37]">Mahashakti Peeta</h2>
          </div>
          <p className="mb-6 max-w-[240px] font-sans text-sm leading-relaxed text-gray-300">
            A sacred, premium spiritual destination. Step into our divine ancient temple — unhurried, serene, and awe-inspiring.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <FaYoutube className="cursor-pointer text-xl transition-colors hover:text-[#D4AF37]" />
            <a
              href="https://www.instagram.com/mahashakti_peeta/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-xl transition-colors hover:text-[#D4AF37]"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/919686903945?text=Hello%20Shivappa,%20I%20would%20like%20to%20know%20more%20about%20the%20temple.%20Please%20assist%20me.%20Thank%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-xl transition-colors hover:text-[#D4AF37]"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-4 font-serif text-xl text-[#D4AF37]">Quick Links</h3>
          <ul className="flex flex-col gap-2 font-sans text-sm text-gray-300">
            <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
            <li><Link href="/gods" className="transition-colors hover:text-white">Gods</Link></li>
            <li><Link href="/trust" className="transition-colors hover:text-white">Trust</Link></li>
            <li><Link href="/gallery" className="transition-colors hover:text-white">Gallery</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Services & Events */}
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-4 font-serif text-xl text-[#D4AF37]">Services & Events</h3>
          <ul className="mb-6 flex flex-col gap-2 font-sans text-sm text-gray-300">
            <li><Link href="/services" className="transition-colors hover:text-white">Daily Pooja</Link></li>
            <li><Link href="/services" className="transition-colors hover:text-white">Annadanam</Link></li>
            <li><Link href="/events" className="transition-colors hover:text-white">Upcoming Festivals</Link></li>
            <li><Link href="/donate" className="transition-colors hover:text-white">Donate Now</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-4 font-serif text-xl text-[#D4AF37]">Contact Us</h3>
          <ul className="flex flex-col gap-3 font-sans text-sm text-gray-300">
            <li className="flex items-start justify-center gap-3 text-center">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-[#D4AF37]" />
              <span className="max-w-[220px] text-xs leading-snug md:text-sm">
                Magadi Main Road, Bantarakuppe Colony, Magadi Taluk
              </span>
            </li>
            <li className="flex items-center justify-center gap-3 text-center">
              <FaPhoneAlt className="text-[#D4AF37]" />
              <span>+91 9876543211, +91 9686903945</span>
            </li>
            <li className="flex items-center justify-center gap-2 text-center">
              <SiGmail className="flex-shrink-0 text-sm text-[#D4AF37] md:text-base" />
              <span className="max-w-[220px] break-all text-[10px] leading-tight md:text-[11px]">
                mahashakthipeetacharitabletres@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl justify-center border-t border-[#0A4D9B] px-4 pt-8 text-center font-sans text-sm text-gray-400 sm:px-6 lg:px-8">
        © 2026 Mahashakti Peeta Temple. All Rights Reserved. Designed with ❤️ for Devotees
      </div>
    </footer>
  );
}
