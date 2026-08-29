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

export default function GoogleTranslateToggle({
  embedded = false,
  className = "",
}: {
  embedded?: boolean;
  className?: string;
}) {
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
    setTranslateCookie(language);
    triggerTranslate(language);
    localStorage.setItem("site-language", language);

    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language },
      })
    );
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <div id="google_translate_element" className="sr-only" />
      <div
        translate="no"
        className={`notranslate z-40 flex shrink-0 items-center rounded-full border border-[#D4AF37]/60 bg-white/95 p-0.5 shadow-sm backdrop-blur ${
          embedded
            ? "relative"
            : "fixed right-3 top-20 sm:right-6 sm:top-24 shadow-lg"
        } ${className}`}
      >
        <button
          type="button"
          translate="no"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
            language === "en"
              ? "bg-[#0A4D9B] text-white"
              : "text-[#0A4D9B] hover:bg-[#EAF4FF]"
          }`}
        >
          ENG
        </button>
        <button
          type="button"
          translate="no"
          onClick={() => setLanguage("kn")}
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
            language === "kn"
              ? "bg-[#0A4D9B] text-white"
              : "text-[#0A4D9B] hover:bg-[#EAF4FF]"
          }`}
        >
          KAN
        </button>
      </div>
    </>
  );
}