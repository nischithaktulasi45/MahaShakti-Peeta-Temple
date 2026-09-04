import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import {
  Autoplay,
  EffectFade,
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
    name: "18th Century Basavannavara Anubhava Mantapa",
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
    <div
      className="w-full overflow-hidden bg-[#f9f6ef]"
      style={{ height: 'calc(100dvh / 0.9 - var(--header-height, 100px))' }}
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        autoHeight={false}
        className="w-full h-full"
      >
        {trustItems.map((item, idx) => (
          <SwiperSlide key={idx} className="!h-full">
            {/* Desktop: side-by-side row | Mobile: stacked column */}
            <div className="flex h-full w-full flex-col md:flex-row">
              {/* Image section */}
              <div className="shrink-0 flex w-full items-center justify-center border-b-4 border-[#D4AF37] bg-[#FFF8E7] p-3 sm:p-4 md:w-1/2 md:h-full md:border-b-0 md:border-r-4 md:p-8 lg:p-10">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[180px] w-full rounded-lg object-contain drop-shadow-xl sm:h-[220px] md:h-auto md:max-h-[420px] md:max-w-[92%] md:rounded-xl"
                  />
                ) : (
                  <div className="h-[180px] w-full rounded-lg border border-dashed border-[#E8D8A3] bg-white/40 sm:h-[220px] md:h-[80%] md:max-h-[420px] md:w-full" />
                )}
              </div>

              {/* Text section — flex-1 so it fills remaining height on mobile */}
              <div className="flex flex-1 w-full items-start md:items-center justify-start md:justify-center bg-white px-4 pt-4 pb-8 sm:px-5 sm:pt-5 md:w-1/2 md:h-full md:p-8 lg:p-10 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-full"
                >
                  <h2 className="mb-2 font-serif text-xl leading-tight text-[#0A4D9B] sm:text-2xl md:text-4xl lg:text-5xl">
                    {item.name}
                  </h2>

                  <div className="mb-3 h-1 w-20 bg-[#D4AF37] sm:w-28 md:h-1.5" />

                  <p className="mb-3 text-sm leading-6 text-gray-700 sm:text-base md:text-lg md:leading-8">
                    {item.description}
                  </p>

                  <div className="rounded-md border-l-4 border-[#0A4D9B] bg-[#EEF6FF] p-3 shadow sm:p-4 md:p-6">
                    <h3 className="mb-1 font-serif text-base text-[#0A4D9B] sm:text-lg md:text-2xl">
                      Trust Significance
                    </h3>

                    <p className="text-sm leading-6 text-gray-700 sm:text-base md:text-lg md:leading-8">
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
