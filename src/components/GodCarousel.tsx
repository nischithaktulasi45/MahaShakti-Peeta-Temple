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
    <div className="w-full h-screen overflow-hidden bg-[#f9f6ef]">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        autoHeight={false}
        className="w-full h-full"
      >
        {gods.map((god, idx) => (
          <SwiperSlide key={idx} className="!h-screen">
            <div className="flex h-full w-full flex-col md:flex-row overflow-hidden">
              <div className="flex w-full items-center justify-center border-b-4 border-[#D4AF37] bg-[#FFF8E7] p-2 sm:p-3 md:w-1/2 md:h-full md:border-b-0 md:border-r-4 md:p-6 lg:p-8">
                <img
                  src={god.image}
                  alt={god.name}
                  className="h-[240px] w-full rounded-lg object-cover shadow-xl sm:h-[320px] md:h-full md:w-full md:rounded-lg md:object-contain"
                />
              </div>
              <div className="flex w-full items-center justify-center bg-white p-4 sm:p-5 md:w-1/2 md:h-full md:p-8 lg:p-10 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-full"
                >
                  <h2 className="mb-3 font-serif text-[1.8rem] leading-tight text-[#0A4D9B] sm:text-[2.2rem] md:text-4xl lg:text-5xl">
                    {god.name}
                  </h2>
                  <div className="mb-4 h-1.5 w-24 bg-[#D4AF37] sm:w-28" />
                  <p className="mb-4 text-sm leading-7 text-gray-700 sm:text-base md:text-lg md:leading-8">
                    {god.description}
                  </p>
                  <div className="mb-6 rounded-md border-l-4 border-[#0A4D9B] bg-[#EEF6FF] p-4 shadow sm:p-5 md:p-6">
                    <h3 className="mb-2 font-serif text-lg text-[#0A4D9B] sm:text-xl md:text-2xl">
                      Temple Significance
                    </h3>
                    <p className="text-sm leading-7 text-gray-700 sm:text-base md:text-lg md:leading-8">
                      {god.significance}
                    </p>
                  </div>
                  {god.showKnowMore && god.name === "Shri Chakra" && (
                    <Link
                      href="/maha-shakti-peeta"
                      className="inline-flex items-center justify-center bg-[#D4AF37] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#083C78] shadow-[0_8px_20px_rgba(212,175,55,0.3)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(212,175,55,0.4)] sm:px-7 sm:text-base md:px-10 md:py-4 md:text-lg"
                    >
                      More Details
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