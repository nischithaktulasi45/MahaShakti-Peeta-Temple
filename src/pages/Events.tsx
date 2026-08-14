import { useState, useEffect } from "react";
import { contentService } from "@/services/contentService";

type EventCard = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag?: string;
};

export default function Events() {
  const [events, setEvents] = useState<EventCard[]>([]);
  const [language, setLanguage] = useState<"en" | "kn">(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("site-language") : null;
    return saved === "kn" ? "kn" : "en";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contentService.getEvents();
        const responseData = Array.isArray(response?.data) ? response.data : [];
        console.info("Temple Events loaded:", responseData.length);
        setEvents(responseData);
      } catch (error) {
        console.error("Failed to load temple events:", error);
        setError("Unable to load events right now. Please try again later.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: "en" | "kn" }>;
      setLanguage(customEvent.detail.language);
    };

    window.addEventListener("languageChanged", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChanged", handleLanguageChange as EventListener);
  }, []);

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <section className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className={`text-sm font-semibold ${language === "kn" ? "tracking-normal" : "uppercase tracking-[0.35em]"} text-[#D4AF37]`}>
            {language === "kn" ? "ಕಾರ್ಯಕ್ರಮಗಳು" : "Events"}
          </p>
          <h1
            className={`mt-4 font-serif text-[#083C78] ${
              language === "kn"
                ? "text-2xl sm:text-3xl md:text-4xl leading-snug"
                : "text-3xl sm:text-4xl md:text-5xl"
            }`}
          >
            {language === "kn" ? "ದೇವಾಲಯದ ಕಾರ್ಯಕ್ರಮಗಳು" : "Temple Events"}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Join us in regular seva, community care, and devotional service through our monthly temple events.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-600 shadow-sm">
            Loading events...
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-600 shadow-sm">
            No events available.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((item) => (
              <article
                key={item._id}
                className="group flex h-full max-w-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(10,77,155,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(10,77,155,0.14)]"
              >
                <div className="relative h-64 w-full max-w-full overflow-hidden rounded-t-[32px] bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full max-w-full object-contain object-center"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-4 flex-1 p-5 sm:p-6">
                  {item.tag ? (
                    <span className="inline-flex rounded-full bg-[#fff6d9] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#d1a21f]">
                      {item.tag}
                    </span>
                  ) : null}
                  <h2 className="font-serif text-2xl uppercase tracking-wide text-[#083C78] sm:text-3xl">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-7 text-slate-600 sm:text-base">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}