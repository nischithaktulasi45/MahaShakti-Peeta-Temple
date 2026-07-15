import { motion } from "framer-motion";
import { ShaktiPeetha } from "@/data/mahaShaktiPeeta";

interface Props {
  peeta: ShaktiPeetha;
  index: number;
}

export default function ShaktiPeethaCard({ peetha, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Square image container */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={peetha.image}
          alt={peetha.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x400/e2e8f0/1e293b?text=Peeta";
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="mb-1 font-serif text-lg font-bold text-[#0A4D9B] sm:text-xl md:text-2xl">
          {peetha.name}
        </h3>
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">📍</span> {peetha.location}
        </p>
        <p className="mb-1 text-sm text-gray-700">
          <span className="font-semibold">Goddess:</span> {peetha.presidingGoddess}
        </p>
        <p className="mb-3 text-sm text-gray-700">
          <span className="font-semibold">Bhairava:</span> {peetha.associatedBhairava}
        </p>

        <div className="space-y-2 text-sm leading-relaxed text-gray-700">
          {peetha.description.slice(0, 2).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold text-[#0A4D9B]">Significance:</p>
          <p className="text-sm text-gray-700">{peetha.significance}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {peetha.highlights.slice(0, 3).map((item, i) => (
            <span
              key={i}
              className="inline-block bg-[#EEF6FF] px-2 py-1 rounded-md text-xs text-[#0A4D9B] font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}