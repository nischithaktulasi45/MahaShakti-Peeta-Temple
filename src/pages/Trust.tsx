import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper/modules";

import { motion } from "framer-motion";

const trustItems = [
  {
    name: "Prasada Nilaya",
    image: "/image/page_11.jpg",
    description:
      "Prasada Nilaya serves devotees with sacred meals and a calm space for rest, reflecting the temple's spirit of care and hospitality.",
    significance:
      "Supporting annadanam, nourishment, and devotional service for visitors.",
  },
  {
    name: "Basavannavara Anubhava Mantapa",
     image: "/image/trust/mantapa.png",
    description:
      "Basavannavara Anubhava Mantapa is a place for spiritual reflection, community learning, and sharing the values of devotion and wisdom.",
    significance:
      "Encouraging spiritual discussions, cultural learning, and shared growth.",
  },
  {
    name: "Brundavana",
    image: "/image/trust/park.jpeg",
    description:
      "The Brundavana area provides a serene and sacred atmosphere for prayer, remembrance, and peaceful contemplation.",
    significance:
      "Honouring sacred memory and offering a quiet devotional environment.",
  },
  {
    name: "Atithi Gruha",
    image: "/image/trust/atithi.jpeg",
    description:
      "Atithi Gruha welcomes guests and devotees with comfort and dignity, ensuring a warm and peaceful stay within the temple premises.",
    significance:
      "Offering hospitality, convenience, and respectful accommodation.",
  },
  {
    name: "Ashrama",
    image: "/image/page_10.jpg",
    description:
      "Ashrama supports spiritual discipline, learning, and service, helping devotees spend time in a focused and devotional setting.",
    significance:
      "Promoting meditation, guidance, and a life of spiritual practice.",
  },
];

export default function Trust() {
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
        {trustItems.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex h-full flex-col md:flex-row">
              <div className="flex w-full items-center justify-center border-r-4 border-[#D4AF37] bg-[#FFF8E7] p-3 md:w-1/2 md:p-5">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-[68vh] max-w-full rounded-lg object-contain shadow-xl"
                  />
                ) : (
                  <div className="h-[60vh] w-full rounded-lg border border-dashed border-[#E8D8A3] bg-white/40" />
                )}
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
                    {item.name}
                  </h2>

                  <div className="w-24 h-1 bg-[#D4AF37] mb-4" />

                  <p className="text-sm md:text-base text-gray-700 leading-6 md:leading-7 mb-3">
                    {item.description}
                  </p>

                  <div className="bg-[#EEF6FF] border-l-4 border-[#0A4D9B] p-4 md:p-5 rounded-md mb-3 shadow">
                    <h3 className="font-serif text-lg md:text-xl text-[#0A4D9B] mb-1">
                      Trust Significance
                    </h3>

                    <p className="text-gray-700 text-sm md:text-base leading-6 md:leading-7">
                      {item.significance}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
