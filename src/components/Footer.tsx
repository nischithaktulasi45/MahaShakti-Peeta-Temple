import { Link } from "wouter";
import { FaYoutube, FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#083C78] text-white pt-16 pb-8 border-t-4 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="font-serif text-2xl text-[#D4AF37] mb-4 flex items-center gap-2">
            <span></span> Mahashakti Peeta
          </h2>
          <p className="font-sans text-sm text-gray-300 mb-6 leading-relaxed">
            A sacred, premium spiritual destination. Step into our divine ancient temple — unhurried, serene, and awe-inspiring.
          </p>
          <div className="flex gap-4">
            <FaYoutube className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaFacebook className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaInstagram className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
            <FaWhatsapp className="text-xl hover:text-[#D4AF37] cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-xl mb-4 text-[#D4AF37]">Quick Links</h3>
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
        <div>
          <h3 className="font-serif text-xl mb-4 text-[#D4AF37]">Services & Events</h3>
          <ul className="flex flex-col gap-2 font-sans text-sm text-gray-300 mb-6">
            <li><Link href="/services" className="hover:text-white transition-colors">Daily Pooja</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Annadanam</Link></li>
            <li><Link href="/events" className="hover:text-white transition-colors">Upcoming Festivals</Link></li>
            <li><Link href="/donate" className="hover:text-white transition-colors">Donate Now</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif text-xl mb-4 text-[#D4AF37]">Contact Us</h3>
          <ul className="flex flex-col gap-3 font-sans text-sm text-gray-300 mb-6">
            <li className="flex gap-3 items-start">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-[#D4AF37]" />
              <span className="text-xs md:text-sm leading-snug">
                Magadi Main Road, Bantarakuppe Colony, Magadi Taluk
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <FaPhoneAlt className="text-[#D4AF37]" />
              <span>+91 9876543210<br/> 
                +91 9876543211 
                 <br></br>    
                +91 9686903945</span>
            </li>
            <li className="flex gap-2 items-center">
              <SiGmail className="text-[#D4AF37] text-sm md:text-base flex-shrink-0" />
              <span className="text-[8px] md:text-[10px] whitespace-nowrap leading-tight">
                mahashakthipeetacharitabletres@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#0A4D9B] text-center font-sans text-sm text-gray-400">
        © 2026 Mahashakti Peeta Temple. All Rights Reserved. Designed with ❤️ for Devotees
      </div>
    </footer>
  );
}
