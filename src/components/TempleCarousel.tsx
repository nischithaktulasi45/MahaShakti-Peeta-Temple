import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const temples = [
  {
    name: "Sri Mahashakti Peeta Temple",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    description: "The primary abode of Goddess Mahashakti, renowned for its ancient architecture, spiritual vibrations, and rich heritage dating back centuries. Experience profound peace in her divine presence."
  },
  {
    name: "Kanadikavu Bhagavathi Temple",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80",
    description: "A serene sanctuary dedicated to the divine mother. This historic temple is known for its unique traditions, vibrant festivals, and deep-rooted spiritual practices that draw devotees from everywhere."
  },
  {
    name: "Sri Venkateswara Swami Temple",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
    description: "A majestic temple of Lord Venkateswara, standing as a pillar of devotion. Famous for its exquisite carvings, powerful daily rituals, and an atmosphere of ultimate surrender and grace."
  }
];

export default function TempleCarousel() {
  return (
    <div className="w-full bg-[#083C78] text-white">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="w-full"
      >
        {temples.map((temple, idx) => (
          <SwiperSlide key={idx}>
            <div className="grid md:grid-cols-2 min-h-[600px]">
              <div 
                className="w-full h-[400px] md:h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${temple.image})` }}
              />
              <div className="flex flex-col justify-center p-12 md:p-20 bg-gradient-to-r from-[#083C78] to-[#0A4D9B]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-serif text-3xl md:text-5xl text-[#D4AF37] mb-6 leading-tight">{temple.name}</h2>
                  <div className="w-16 h-1 bg-[#D4AF37] mb-6" />
                  <p className="font-sans text-lg text-gray-200 leading-relaxed mb-8">
                    {temple.description}
                  </p>
                  <Link href="/services" className="inline-block border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded font-bold uppercase hover:bg-[#D4AF37] hover:text-[#083C78] transition-colors">
                    Know More
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}