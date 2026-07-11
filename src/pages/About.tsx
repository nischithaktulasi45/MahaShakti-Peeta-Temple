import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeUpDelay = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
});

export default function About() {
  return (
    <div className="w-full bg-transparent">

      {/* ===== PART 1: HERO — Fits EXACTLY to screen height ===== */}
      <section className="flex min-h-[80dvh] w-full items-center justify-center overflow-hidden px-4 py-12 sm:min-h-[90dvh] sm:px-6 md:px-8 lg:h-screen lg:py-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center px-2"
        >
          <h1 className="font-serif text-3xl leading-tight text-[#083C78] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            ABOUT <br/>MAHASHAKTI PEETA <br className="hidden sm:block" /> TEMPLE
          </h1>
          <div className="w-20 md:w-24 h-1 bg-[#D4AF37] mx-auto mt-4 mb-6" />
          <p className="mx-auto max-w-3xl px-2 font-sans text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl lg:text-2xl">
            A divine sanctuary where ancient Vedic traditions meet heartfelt devotion,
            offering spiritual solace and guidance to all who seek the grace of the Divine Mother.
          </p>
        </motion.div>
      </section>

      {/* ===== PART 2: TEMPLE INTRODUCTION — Full image, no crop, light blue bg ===== */}
      <section className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-10 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-7xl py-2 sm:py-6 lg:py-10">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="order-1 md:order-none flex justify-center items-center"
            >
              <img
                src="/image/Mahashakti_Temple.png"
                alt="Maha Shaktipeetha Temple"
                className="h-auto max-h-[70vh] w-full rounded-2xl bg-gray-100 object-contain shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/e2e8f0/1e293b?text=Temple+Image";
                }}
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpDelay(0.2)}
              className="order-2"
            >
              <h2 className="mb-3 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">
                A Divine Sanctuary of Faith
              </h2>
              <div className="w-16 h-1 bg-[#D4AF37] mb-5" />
              <div className="space-y-4 text-justify font-sans text-[15px] leading-relaxed text-gray-700 md:text-[16px] md:leading-8 lg:text-[17px]">
                <p>
                  Maha Shaktipeetha Temple is a sacred place dedicated to the Divine Mother,
                  where devotees come with faith and devotion to seek her blessings. Located in
                  the peaceful surroundings of Magadi, the temple offers a calm and spiritual
                  atmosphere that inspires prayer, hope, and inner peace.
                </p>
                <p>
                  The temple follows traditional Vedic customs and is known for its daily poojas,
                  special rituals, and grand festivals celebrated with great devotion. Every
                  ceremony is performed with care, preserving the temple's rich spiritual
                  heritage and creating a meaningful experience for every visitor.
                </p>
                <p>
                  Whether you visit to offer prayers, participate in religious ceremonies, or
                  simply spend time in a peaceful environment, Maha Shaktipeetha Temple welcomes
                  everyone with warmth and devotion. It continues to be a place where faith is
                  strengthened, traditions are honored, and the blessings of the Divine Mother
                  are shared with all.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PART 3: DHARMADARSHI — Light blue bg, white card stays ===== */}
      <section className="min-h-screen px-6 flex items-center justify-center bg-blue-50">
        <div className="max-w-7xl mx-auto w-full py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-white p-5 shadow-xl sm:p-6 md:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12"
          >
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/image/client.png"
                  alt="Sri Shivappa S. S. - Dharmadarshi"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x500/e2e8f0/1e293b?text=Dharmadarshi";
                  }}
                />
              </div>
            </div>
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
                The Dharmadarshi of Maha Shaktipeetha Temple
              </span>
              <h2 className="mb-2 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">
                Sri Shivappa S. S. – Dharmadarshi
              </h2>
              <div className="w-16 h-1 bg-[#D4AF37] mb-5" />
              <div className="space-y-4 text-justify text-[15px] leading-relaxed text-gray-700 md:text-[16px] md:leading-8 lg:text-[17px]">
                <p>
                  <strong>Sri Shivappa S. S.</strong> is the Dharmadarshi of Maha Shaktipeetha Temple.
                  He leads the temple with great devotion, sincerity, and respect for its sacred
                  traditions. His dedication helps ensure that the temple remains a peaceful and
                  spiritual place where devotees can worship and seek the blessings of the Divine Mother.
                </p>
                <p>
                  He believes in following the values of Sanatana Dharma and makes sure that all
                  daily poojas, rituals, and temple festivals are performed according to traditional
                  customs and practices. His aim is to preserve the temple's rich heritage while
                  creating an atmosphere of faith, devotion, and spiritual growth for everyone.
                </p>
                <p>
                  Under his guidance, Maha Shaktipeetha Temple has become a place where people from
                  different backgrounds come to pray, find peace, and receive divine blessings.
                  Through his service and commitment, Sri Shivappa S. S. continues to inspire
                  devotees and supports the temple's mission of promoting spirituality, cultural
                  values, and service to society.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}