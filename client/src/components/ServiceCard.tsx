// ================================================================
// FILE: ServiceCard.tsx
// ================================================================

import { motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

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
  const [touchActive, setTouchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardId = useId();

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) {
        setTouchActive(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    const handleCardActivation = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail !== cardId) setTouchActive(false);
    };
    document.addEventListener("service-card-activated", handleCardActivation);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("service-card-activated", handleCardActivation);
    };
  }, [cardId]);

  return (
    <motion.div
      ref={cardRef}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") {
          document.dispatchEvent(new CustomEvent("service-card-activated", { detail: cardId }));
          setTouchActive(true);
        }
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative h-[210px] sm:h-[250px] md:h-[270px] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`h-full w-full object-cover object-top scale-[1.15] transition-all duration-500 max-md:blur-none md:blur-sm md:group-hover:scale-125 md:group-hover:blur-none ${touchActive ? "scale-125 blur-none" : ""}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white sm:p-6">
          <h3 className="mb-2 font-serif text-lg font-bold drop-shadow-lg sm:text-2xl">
            {title}
          </h3>
          <p className="max-w-xs font-sans text-xs sm:text-sm leading-relaxed drop-shadow-md opacity-95">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}