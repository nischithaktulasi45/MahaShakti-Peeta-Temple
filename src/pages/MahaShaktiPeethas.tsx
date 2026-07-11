import { useEffect } from "react";
import { Link } from "wouter";
import { mahaShaktiPeethas } from "@/data/mahaShaktiPeethas";
import ShaktiPeethaCard from "@/components/ShaktiPeethaCard";

export default function MahaShaktiPeethas() {
  useEffect(() => {
    document.title = "18 Maha Shakti Peethas – Sacred Abodes of Goddess Shakti";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Explore the 18 Maha Shakti Peethas, the most sacred shrines dedicated to Goddess Sati. Learn about each temple's legend, goddess, and spiritual significance."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Explore the 18 Maha Shakti Peethas, the most sacred shrines dedicated to Goddess Sati. Learn about each temple's legend, goddess, and spiritual significance.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back button – styled as a button with arrow */}
        <div className="mb-6">
          <Link
            href="/gods"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-[#0A4D9B] text-white px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#083C78] shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gods
          </Link>
        </div>

        {/* Header – same style as Gallery */}
        <div className="text-center mb-10">
          <h1 className="mb-4 font-serif text-2xl text-[#083C78] sm:text-3xl md:text-4xl">
            18 Maha Shakti Peethas
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mx-auto mt-5 max-w-3xl font-sans text-sm text-gray-600 sm:text-base md:text-lg">
            The 18 Maha Shakti Peethas are the holiest shrines dedicated to Goddess Sati
            (Adi Shakti). According to legend, the divine body parts of Sati fell at these
            sacred sites when Lord Shiva carried her. Each peetha is a powerful energy
            center and a destination for spiritual seekers from around the world.
          </p>
        </div>

        {/* Grid of cards – 3 columns on large, 2 on medium, 1 on small */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {mahaShaktiPeethas.map((peetha, idx) => (
            <ShaktiPeethaCard key={peetha.id} peetha={peetha} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}