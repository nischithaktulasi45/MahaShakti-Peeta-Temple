import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <div className="w-full bg-transparent">
      <div className="px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8">
        <h1 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">Temple Services</h1>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
        <p className="mt-5 font-sans text-base md:text-lg max-w-3xl mx-auto text-gray-600">
          Experience the divine presence through our daily rituals, sevas, and offerings.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        
        {/* Timings Section */}
        <section className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="mb-4 font-serif text-xl text-[#083C78] sm:text-2xl md:text-3xl">Temple Timings</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          >
            <div className="grid grid-cols-1 border-b-2 border-[#0A4D9B] bg-[#EAF4FF] p-4 sm:grid-cols-2 sm:p-6">
              <div className="font-serif text-lg font-bold text-[#083C78] sm:text-xl">Days</div>
              <div className="font-serif text-lg font-bold text-[#083C78] sm:text-xl">Timings</div>
            </div>
            <div className="divide-y divide-gray-100 font-sans">
              <div className="grid grid-cols-1 gap-2 p-4 transition-colors hover:bg-gray-50 sm:grid-cols-2 sm:gap-0 sm:p-6">
                <div className="font-medium text-gray-800">Monday - Friday</div>
                <div className="font-bold text-[#0A4D9B]">5:00 AM - 9:00 PM</div>
              </div>
              <div className="grid grid-cols-1 gap-2 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 sm:grid-cols-2 sm:gap-0 sm:p-6">
                <div className="font-medium text-gray-800">Saturday - Sunday</div>
                <div className="font-bold text-[#0A4D9B]">5:00 AM - 10:00 PM</div>
              </div>
              <div className="grid grid-cols-1 gap-2 p-4 transition-colors hover:bg-gray-50 sm:grid-cols-2 sm:gap-0 sm:p-6">
                <div className="font-medium text-gray-800">Festival Days</div>
                <div className="font-bold text-[#0A4D9B]">4:00 AM - 11:00 PM</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Daily Sevas Section */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="mb-4 font-serif text-xl text-[#083C78] sm:text-2xl md:text-3xl">Daily Sevas</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon="🌅" title="Morning Suprabhata Seva" 
              description="Awakening the deity with sacred morning hymns and offering the first harathi." delay={0} 
            />
            <ServiceCard 
              icon="🐘" title="Ganapathi Pooja" 
              description="Special pooja to Lord Ganesha to remove obstacles before starting any auspicious work." delay={0.1} 
            />
            <ServiceCard 
              icon="🌺" title="Archana" 
              description="Chanting the 108 or 1000 names of the deity with offerings of flowers and kumkum." delay={0.2} 
            />
            <ServiceCard 
              icon="🥛" title="Abhisheka" 
              description="Sacred bathing of the deity with milk, curd, honey, ghee, and holy water." delay={0.3} 
            />
            <ServiceCard 
              icon="✨" title="Alankara Seva" 
              description="Decorating the deity with special vastras (clothes) and exquisite floral garlands." delay={0.4} 
            />
            <ServiceCard 
              icon="🔥" title="Maha Mangala Harathi" 
              description="The grand concluding light offering accompanied by bells, drums, and chanting." delay={0.5} 
            />
            <ServiceCard 
              icon="🍚" title="Annadanam" 
              description="Offering sacred food as prasadam to devotees and the needy." delay={0.6} 
            />
            <ServiceCard 
              icon="🕊️" title="Special Homa" 
              description="Sacred fire rituals for specific planetary alignments, peace, and prosperity." delay={0.7} 
            />
            <ServiceCard 
              icon="👑" title="VIP Darshan" 
              description="Special direct access for darshan without waiting in regular queues." delay={0.8} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}
