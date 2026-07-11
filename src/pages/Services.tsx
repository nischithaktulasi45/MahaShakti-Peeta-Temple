import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <div className="w-full bg-transparent">
      <div className="py-14 px-6 text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-[#083C78] mb-4">Temple Services</h1>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
        <p className="mt-5 font-sans text-base md:text-lg max-w-3xl mx-auto text-gray-600">
          Experience the divine presence through our daily rituals, sevas, and offerings.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-14">
        
        {/* Timings Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-[#083C78] mb-4">Temple Timings</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          >
            <div className="bg-[#EAF4FF] grid grid-cols-2 p-6 border-b-2 border-[#0A4D9B]">
              <div className="font-serif text-xl font-bold text-[#083C78]">Days</div>
              <div className="font-serif text-xl font-bold text-[#083C78]">Timings</div>
            </div>
            <div className="divide-y divide-gray-100 font-sans">
              <div className="grid grid-cols-2 p-6 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-800">Monday - Friday</div>
                <div className="text-[#0A4D9B] font-bold">5:00 AM - 9:00 PM</div>
              </div>
              <div className="grid grid-cols-2 p-6 hover:bg-gray-50 transition-colors bg-gray-50/50">
                <div className="font-medium text-gray-800">Saturday - Sunday</div>
                <div className="text-[#0A4D9B] font-bold">5:00 AM - 10:00 PM</div>
              </div>
              <div className="grid grid-cols-2 p-6 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-800">Festival Days</div>
                <div className="text-[#0A4D9B] font-bold">4:00 AM - 11:00 PM</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Daily Sevas Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-[#083C78] mb-4">Daily Sevas</h2>
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
