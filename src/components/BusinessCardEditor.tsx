import { useState } from 'react';
import { CelebrationSelector } from './CelebrationSelector';
import { CanvasEditor } from './editor/CanvasEditor';
import { CardCategory, BusinessCardData, createDefaultCardData } from '@/types/businessCard';

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
    <CanvasEditor
      cardData={cardData}
      onUpdate={setCardData}
      onBack={handleBack}
    />
  );
};
