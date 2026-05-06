import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';
import { Languages, ChevronDown, Check, Loader2 } from 'lucide-react';

const LanguageSwitcher = () => {
  const { lang, setLang, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' }
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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : (
          <Languages className="w-4 h-4 text-gray-400" />
        )}
        <span className="hidden md:inline-block">{currentLang.native}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white border border-gray-100 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLang(language.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors ${
                  lang === language.code 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{language.flag}</span>
                  <div className="flex flex-col items-start leading-tight">
                    <span>{language.native}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {language.name}
                    </span>
                  </div>
                </div>
                {lang === language.code && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;