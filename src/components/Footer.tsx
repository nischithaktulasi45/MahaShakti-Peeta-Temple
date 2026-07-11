import { Link } from "wouter";
import { FaYoutube, FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#D4AF37] bg-[#083C78] pb-8 pt-12 text-white sm:pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:px-8">
        
        {/* Brand */}
        <div className="text-center sm:text-left">
          <h2 className="mb-4 flex items-center justify-center gap-2 font-serif text-2xl text-[#D4AF37] sm:justify-start">
            <span></span> Mahashakti Peeta
          </h2>
          <p className="mb-6 font-sans text-sm leading-relaxed text-gray-300">
            A sacred, premium spiritual destination. Step into our divine ancient temple — unhurried, serene, and awe-inspiring.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
            <FaYoutube className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaFacebook className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaInstagram className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaWhatsapp className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-left">
          <h3 className="mb-4 font-serif text-xl text-[#D4AF37]">Quick Links</h3>
          <ul className="flex flex-col gap-2 font-sans text-sm text-gray-300">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/gods" className="hover:text-white transition-colors">Gods</Link></li>
            <li><Link href="/trust" className="hover:text-white transition-colors">Trust</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Services & Events */}
        <div className="text-center sm:text-left">
          <h3 className="mb-4 font-serif text-xl text-[#D4AF37]">Services & Events</h3>
          <ul className="mb-6 flex flex-col gap-2 font-sans text-sm text-gray-300">
            <li><Link href="/services" className="hover:text-white transition-colors">Daily Pooja</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Annadanam</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Upcoming Festivals</Link></li>
            <li><Link href="/donate" className="hover:text-white transition-colors">Donate Now</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center sm:text-left">
          <h3 className="mb-4 font-serif text-xl text-[#D4AF37]">Contact Us</h3>
          <ul className="mb-6 flex flex-col gap-3 font-sans text-sm text-gray-300">
            <li className="flex items-start justify-center gap-3 text-center sm:justify-start sm:text-left">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-[#D4AF37]" />
              <span className="text-xs leading-snug md:text-sm">
                Magadi Main Road, Bantarakuppe Colony, Magadi Taluk
              </span>
            </li>
            <li className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
              <FaPhoneAlt className="text-[#D4AF37]" />
              <span>+91 9876543210<br/> 
                +91 9876543211 
                 <br></br>    
                +91 9686903945</span>
            </li>
            <li className="flex items-center justify-center gap-2 text-center sm:justify-start sm:text-left">
              <SiGmail className="flex-shrink-0 text-sm text-[#D4AF37] md:text-base" />
              <span className="break-all text-[8px] leading-tight md:text-[10px]">
                mahashakthipeetacharitabletres@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-[#0A4D9B] px-4 pt-8 text-center font-sans text-sm text-gray-400 sm:px-6 lg:px-8">
        © 2026 Mahashakti Peeta Temple. All Rights Reserved. Designed with ❤️ for Devotees
      </div>
    </footer>
  );
}
