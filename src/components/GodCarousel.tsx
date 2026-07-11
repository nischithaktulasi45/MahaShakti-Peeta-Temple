import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "wouter";

const gods = [
  {
    name: "Shri Chakra",
    image: "/image/gods/shri-chakra1.png",
    description:
      "The sacred Shri Chakra is the supreme mystical diagram representing Goddess Mahashakti. It symbolizes the union of Shiva and Shakti and is worshipped for spiritual growth, prosperity, and divine blessings.",
    significance:
      "Worshipped for prosperity, spiritual enlightenment, peace, and fulfillment of wishes.",
    showKnowMore: true,
  },
  {
    name: "Sapta Matrikeyaru",
    image: "/image/gods/sapta-matrikeyaru.jpg",
    description:
      "The Sapta Matrikeyaru are the seven divine mother goddesses who symbolize the feminine powers of the principal deities. They protect devotees from negative energies and bless families with health and prosperity. The seven goddesses are: Brahmi, Maheshwari, Kaumari, Vaishnavi, Varahi, Indrani, and Chamundi.",
    significance:
      "Worshipped for protection, courage, health, and family well-being.",
  },
  {
    name: "Bangi (Sacred Statues)",
    image: "/image/gods/bangi-statues.jpg",
    description:
      "The beautifully carved Bangi statues reflect the rich artistic heritage of the temple. These sacred sculptures inspire devotion and preserve the timeless traditions of Hindu culture.",
    significance:
      "Represents divine protection, temple heritage, and traditional craftsmanship.",
  },
  {
    name: "Second Highest Raja Gopura",
    image: "/image/gods/raja-gopura.jpg",
    description:
      "The magnificent Raja Gopura is one of the tallest temple towers and stands as a symbol of architectural excellence and spiritual grandeur. It welcomes devotees into the divine abode of Goddess Mahashakti.",
    significance:
      "Symbolizes the gateway to the divine and the glory of ancient temple architecture.",
  },
];

export default function GodCarousel() {
  return (
    <div className="w-full bg-transparent overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-[calc(100dvh-160px)] w-full"
      >
        {gods.map((god, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex h-full flex-col md:flex-row">
              <div className="flex w-full items-center justify-center border-r-4 border-[#D4AF37] bg-[#FFF8E7] p-3 md:w-1/2 md:p-5">
                <img
                  src={god.image}
                  alt={god.name}
                  className="max-h-[68vh] max-w-full rounded-lg object-contain shadow-xl"
                />
              </div>
              <div className="flex w-full items-center bg-white p-4 md:w-1/2 md:p-6 lg:p-8">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-xl"
                >
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-[2.65rem] text-[#0A4D9B] leading-tight mb-3">
                    {god.name}
                  </h2>
                  <div className="w-24 h-1 bg-[#D4AF37] mb-4" />
                  <p className="text-sm md:text-base text-gray-700 leading-6 md:leading-7 mb-3">
                    {god.description}
                  </p>
                  <div className="bg-[#EEF6FF] border-l-4 border-[#0A4D9B] p-4 md:p-5 rounded-md mb-3 shadow">
                    <h3 className="font-serif text-lg md:text-xl text-[#0A4D9B] mb-1">
                      Temple Significance
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7">
                      {god.significance}
                    </p>
                  </div>
                  {god.showKnowMore && (
                    <Link
                      href="/maha-shakti-peethas"
                      className="inline-flex items-center justify-center bg-[#D4AF37] px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-[#083C78] shadow-[0_8px_20px_rgba(212,175,55,0.3)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(212,175,55,0.4)] md:px-8 md:py-3 md:text-base"
                    >
                      Know More
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}