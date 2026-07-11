import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages?: string; autoDisplay?: boolean },
          elementId: string,
        ) => void;
      };
    };
  }
}

type Language = "en" | "kn";

const scriptId = "google-translate-script";

function loadGoogleTranslateScript() {
  if (document.getElementById(scriptId)) return;

  const script = document.createElement("script");
  script.id = scriptId;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

function setTranslateCookie(language: Language) {
  document.cookie = `googtrans=/en/${language};path=/`;
}

function triggerTranslate(language: Language) {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = language;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export default function GoogleTranslateToggle() {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("site-language");
    return savedLanguage === "kn" ? "kn" : "en";
  });

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,kn",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
    loadGoogleTranslateScript();
  }, []);

  useEffect(() => {
    localStorage.setItem("site-language", language);
    document.documentElement.lang = language;
    setTranslateCookie(language);
    triggerTranslate(language);

    // 🔔 Notify other components (e.g., HeroSlider) about the language change
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language },
      })
    );
  }, [language]);

  return (
    <>
      <div id="google_translate_element" className="sr-only" />
      <div className="fixed right-2 top-24 z-[50] flex max-w-[calc(100vw-1rem)] flex-wrap items-center justify-end rounded-full border border-[#D4AF37]/40 bg-white/95 p-1 shadow-lg backdrop-blur sm:right-6 sm:top-36">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition sm:px-4 sm:py-2 sm:text-xs ${
            language === "en" ? "bg-[#0A4D9B] text-white" : "text-[#0A4D9B] hover:bg-[#EAF4FF]"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("kn")}
          className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition sm:px-4 sm:py-2 sm:text-xs ${
            language === "kn" ? "bg-[#0A4D9B] text-white" : "text-[#0A4D9B] hover:bg-[#EAF4FF]"
          }`}
        >
          ಕನ್ನಡ
        </button>
      </div>
    </>
  );
}