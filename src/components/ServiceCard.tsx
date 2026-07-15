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
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative h-[280px] w-full overflow-hidden sm:h-72">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-all duration-500 blur-sm group-hover:scale-110 group-hover:blur-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white sm:p-6">
          <h3 className="mb-2 font-serif text-xl font-bold drop-shadow-lg sm:text-2xl">
            {title}
          </h3>
          <p className="max-w-xs font-sans text-sm leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}