// ================================================================
// FILE: ServiceCard.tsx
// ================================================================

import { motion } from "framer-motion";

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  delay?: number;
}

export default function ServiceCard({
  image,
  title,
  description,
  delay = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 blur-sm group-hover:blur-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
          <h3 className="text-2xl font-serif font-bold drop-shadow-lg mb-2">
            {title}
          </h3>
          <p className="text-sm font-sans leading-relaxed max-w-xs drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}