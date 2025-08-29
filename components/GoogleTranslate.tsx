"use client";
import { useEffect } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: number;
              autoDisplay?: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export const GoogleTranslate = () => {
  useEffect(() => {
    if (window.google?.translate?.TranslateElement) return;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn,ru,fr,el,hi,mr,es,de,it,ja,zh-CN,ar,pt,tr",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google-translate-element"
      );
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex items-center">
      <div
        className="bg-white/40 backdrop-blur-md shadow-lg rounded-xl px-3 py-2 border border-white/30 flex items-center gap-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() =>
          document
            .querySelector<HTMLSelectElement>(
              "#google-translate-element select"
            )
            ?.focus()
        }
      >
        <Languages className="h-4 w-4" />
        <div
          id="google-translate-element"
          className="inline-block translate-dropdown"
        ></div>
      </div>

      <style jsx global>{`
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 14px !important;
          color: #374151 !important;
        }
        .goog-te-gadget .goog-te-combo {
          appearance: none !important;
          border: none !important;
          background: transparent !important;
          padding: 0.25rem 1.5rem 0.25rem 0.5rem !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #1f2937 !important;
          cursor: pointer !important;
          position: relative !important;
          transition: all 0.2s ease-in-out !important;
          min-width: 100px;
        }
        .goog-te-gadget .goog-te-combo:hover {
          color: #1488CC !important;
        }
        .goog-te-gadget .goog-te-combo {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.5rem center !important;
          background-size: 1rem !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget span {
          display: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </div>
  );
};