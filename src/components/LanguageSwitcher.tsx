import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { PARAMS } from "@/i18n";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".lang-switcher")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const currentLang = i18n.language?.split("-")[0] || "en";

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
    // optionally append ?lang=xx to URL
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.pushState({}, "", url);
  };

  return (
    <div className="absolute top-4 right-4 z-50 lang-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-purple-100/50 hover:bg-white transition-all text-sm font-bold text-purple-900"
      >
        <span>🌐</span>
        <span className="uppercase">{currentLang.substring(0,2)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden max-h-64 overflow-y-auto">
          {Object.entries(PARAMS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => changeLanguage(key)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-purple-50 ${
                currentLang.startsWith(key) ? "font-bold text-purple-600 bg-purple-50/50" : "text-gray-700 font-medium"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
