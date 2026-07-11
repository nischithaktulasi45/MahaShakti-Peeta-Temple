import { motion } from "framer-motion";
import { ShaktiPeetha } from "@/data/mahaShaktiPeethas";

interface Props {
  peetha: ShaktiPeetha;
  index: number;
}

export default function ShaktiPeethaCard({ peetha, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
              "https://placehold.co/400x400/e2e8f0/1e293b?text=Peetha";
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl md:text-2xl text-[#0A4D9B] font-bold mb-1">
          {peetha.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">📍</span> {peetha.location}
        </p>
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-semibold">Goddess:</span> {peetha.presidingGoddess}
        </p>
        <p className="text-sm text-gray-700 mb-3">
          <span className="font-semibold">Bhairava:</span> {peetha.associatedBhairava}
        </p>

        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          {peetha.description.slice(0, 2).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="font-semibold text-[#0A4D9B] text-sm">Significance:</p>
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