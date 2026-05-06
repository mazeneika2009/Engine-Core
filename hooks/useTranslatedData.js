import { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';

export const useTranslatedData = (data, fieldsToTranslate) => {
  const { translateText, lang } = useTranslation();
  const [translatedData, setTranslatedData] = useState(data);

  useEffect(() => {
    const processTranslation = async () => {
      if (!data) return;
      
      const translateItem = async (item) => {
        const newItem = { ...item };
        for (const field of fieldsToTranslate) {
          if (newItem[field]) {
            newItem[field] = await translateText(newItem[field]);
          }
        }
        return newItem;
      };

      if (Array.isArray(data)) {
        const results = await Promise.all(data.map(translateItem));
        setTranslatedData(results);
      } else {
        const result = await translateItem(data);
        setTranslatedData(result);
      }
    };

    processTranslation();
  }, [data, lang, translateText, fieldsToTranslate]);

  return translatedData;
};