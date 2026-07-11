// ================================================================
// FILE: Home.tsx
// ================================================================

import HeroSlider from "@/components/HeroSlider";
import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";
import { Link } from "wouter";

const GALLERY_IMAGES = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  src: `/image/page_${index + 1}.jpg`,
}));

export default function Home() {
  return (
    <div className="w-full">
      <HeroSlider />

      {/* Mission Cards */}
      <section className="bg-[#EAF4FF] py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              image: "/image/icons/Spirituality.png",
              title: "Spirituality",
              desc: "Discover inner peace through devotion",
            },
            {
              image: "/image/icons/Tradition.jpg",
              title: "Tradition",
              desc: "Preserving ancient Vedic rituals",
            },
            {
              image: "/image/icons/Seva.jpg",
              title: "Seva",
              desc: "Serving mankind is serving God",
            },
            {
              image: "/image/icons/Togetherness.jpg",
              title: "Togetherness",
              desc: "Fostering community harmony",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:scale-105 transition-transform duration-300 hover:shadow-xl border-b-4 border-[#0A4D9B]"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-[#D4AF37]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/80x80/e2e8f0/1e293b?text=No+Image";
                  }}
                />
              </div>
              <h3 className="font-serif text-xl text-[#083C78] font-bold mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 font-sans text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-[#083C78] mb-4">Temple Services</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            image="/image/services/dailypooja.jpg"
            title="🪔 Daily Pooja"
            description="Participate in our daily worship rituals that bring peace and prosperity to you and your family."
            delay={0}
          />
          <ServiceCard
            image="/image/services/archana.jpg"
            title="🙏 Archana"
            description="Offer your prayers directly to the deity through personalized chanting of sacred names."
            delay={0.1}
          />
          <ServiceCard
            image="/image/services/abhisheka.jpg"
            title="🥛 Abhisheka"
            description="A sacred bathing ritual of the deity performed with holy water, milk, and honey."
            delay={0.2}
          />
          <ServiceCard
            image="/image/services/annadanam.jpg"
            title="🍲 Annadanam"
            description="Sponsor or participate in the holy tradition of offering free meals to devotees."
            delay={0.3}
          />
          <ServiceCard
            image="/image/services/spiritualprograms.jpg"
            title="🧘 Spiritual Programs"
            description="Join our weekly spiritual discourses, bhajan sessions, and meditation workshops."
            delay={0.4}
          />
          <ServiceCard
            image="/image/services/festivalcelebrations.jpg"
            title="🎉 Festival Celebrations"
            description="Experience the grandeur and divine energy during major Hindu festivals."
            delay={0.5}
          />
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="inline-block bg-[#0A4D9B] text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#083C78] transition-colors">
            View All Services
          </Link>
        </div>
      </section>

      {/* Donation Banner */}
      <section className="bg-gradient-to-r from-[#083C78] to-[#0A4D9B] py-12 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="font-serif text-2xl md:text-4xl text-[#D4AF37]">Support Temple Development</h2>
          <p className="font-sans text-lg md:text-xl text-gray-200">Your Contribution Makes a Difference</p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto my-4" />
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link
              href="/donate"
              className="bg-[#D4AF37] text-[#083C78] px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
              onClick={() => window.scrollTo(0, 0)}   // 👈 scrolls to top when clicked
            >
              Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-gray-50 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-[#083C78] mb-4">Temple Gallery</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          </div>
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {GALLERY_IMAGES.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={`Gallery ${image.id}`}
                className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/gallery" className="inline-block border-2 border-[#0A4D9B] text-[#0A4D9B] px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-[#0A4D9B] hover:text-white transition-colors">
              View Complete Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Widgets */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
      >
        <a
          href="https://api.whatsapp.com/send?phone=919686903945&text=Hello%20I%20would%20like%20to%20know%20more%20about%20temple%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <div className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors w-14 h-14 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            WhatsApp
          </span>
        </a>

        <Link href="/donate" className="group relative">
          <div className="bg-[#D4AF37] text-[#083C78] p-3 rounded-full shadow-lg hover:bg-[#c9a030] transition-colors w-14 h-14 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M12 2v4M12 22v-4M4 6h16M4 18h16M6 6v12M18 6v12M10 10h4M10 14h2M14 14h-2" />
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Donate
          </span>
        </Link>
      </motion.div>
    </div>
  );
}