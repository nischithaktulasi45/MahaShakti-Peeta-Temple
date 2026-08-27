import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Doc = {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string; // view link
  downloadable?: boolean;
};

const SAMPLE_DOCS: Doc[] = [
  {
    id: "doc-1",
    title: "Mahashakti Peeta Trust Documents",
    description: "Official trust document for Mahashakti Peeta.",
    type: "PDF",
    url: "/image/mahapeeta.pdf",
    downloadable: true,
  },
];

export default function TrustDocuments() {
  const [docs] = useState<Doc[]>(SAMPLE_DOCS);
  const [language, setLanguage] = useState<"en" | "kn">(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("site-language") : null;
    return saved === "kn" ? "kn" : "en";
  });

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: "en" | "kn" }>;
      setLanguage(customEvent.detail.language);
    };

    window.addEventListener("languageChanged", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languageChanged", handleLanguageChange as EventListener);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-transparent py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className={`mb-4 font-serif text-[#083C78] ${language === "kn" ? "text-2xl sm:text-3xl md:text-3xl leading-snug" : "text-2xl sm:text-3xl md:text-4xl"}`}>
            {language === "kn" ? "ಟ್ರಸ್ಟ್ ಡಾಕ್ಯುಮೆಂಟ್ಸ್" : "Trust Documents"}
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          <p className="mx-auto mt-5 max-w-3xl font-sans text-sm text-gray-600 sm:text-base md:text-lg">
            Open the Mahashakti Peeta Trust document directly or download it for reference.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <motion.article
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#083C78]">{doc.title}</h3>
                </div>

                <div className="shrink-0">
                  <span className="inline-block rounded-md bg-[#0A4D9B] px-3 py-1 text-xs font-medium text-white">{doc.type}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={doc.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${doc.url ? "bg-[#D4AF37] text-[#083C78]" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                >
                  View
                </a>

                {doc.downloadable && doc.url ? (
                  <a
                    href={doc.url}
                    download
                    className="inline-flex items-center gap-2 rounded-md border border-[#0A4D9B] px-4 py-2 text-sm font-medium text-[#0A4D9B] hover:bg-[#0A4D9B] hover:text-white transition-colors"
                  >
                    Download
                  </a>
                ) : (
                  <button disabled className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                    Download
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
