import { motion } from "framer-motion";

type EventCardProps = {
  dateMonth?: string;
  dateDay?: string | number;
  title: string;
  description: string;
  image?: string; // new prop
  delay?: number;
};

export default function EventCard({
  dateMonth,
  dateDay,
  title,
  description,
  image,
  delay = 0,
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-slate-200 bg-white/80 shadow-sm transition hover:shadow-lg hover:border-[#D4AF37]/30 overflow-hidden"
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        {/* Date badge (optional) */}
        {(dateMonth || dateDay) && (
          <div className="mb-3 inline-flex items-center rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            {dateMonth} {dateDay}
          </div>
        )}

        <h3 className="font-serif text-xl font-semibold text-[#083C78]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </motion.div>
  );
}