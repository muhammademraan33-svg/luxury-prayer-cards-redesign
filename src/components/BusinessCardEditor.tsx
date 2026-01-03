import { useState } from 'react';
import { CelebrationSelector } from './CelebrationSelector';
import { CardDesigner } from './CardDesigner';
import { CardCategory, BusinessCardData, createDefaultCardData, EditorStep } from '@/types/businessCard';

export const BusinessCardEditor = () => {
  const [category, setCategory] = useState<CardCategory | null>(null);
  const [cardData, setCardData] = useState<BusinessCardData | null>(null);

  const handleSelectCategory = (selectedCategory: CardCategory) => {
    setCategory(selectedCategory);
    setCardData(createDefaultCardData(selectedCategory));
  };

  const handleBack = () => {
    setCategory(null);
    setCardData(null);
  };

  if (!category || !cardData) {
    return <CelebrationSelector onSelect={handleSelectCategory} />;
  }

  return (
    <CardDesigner
      cardData={cardData}
      onUpdate={setCardData}
      onBack={handleBack}
    />
  );
};
