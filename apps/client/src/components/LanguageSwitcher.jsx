import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';

const LanguageSwitcher = () => {
  const { lang, setLang, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ar', name: 'Arabic', native: 'العربية' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-cream bg-base rounded-lg transition-colors"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <span className="font-mono text-[11px] text-sand">{isLoading ? '…' : currentLang.code.toUpperCase()}</span>
        <span className="hidden md:inline-block">{currentLang.native}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-panel rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLang(language.code);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 text-[13px] hover:bg-white/[0.04]"
                style={{ color: lang === language.code ? '#F5F1EA' : '#A8A29E', fontWeight: lang === language.code ? 600 : 500 }}
              >
                <span>{language.native}</span>
                <span className="font-mono text-[10px] text-smoke">{language.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
