import { useState } from 'react';
import { TemplateGalleryView } from './TemplateGalleryView';
import { CardEditorView } from './CardEditorView';
import { Template } from './TemplateCard';

type EditorView = 'gallery' | 'editor';

export const BusinessCardEditor = () => {
  const [view, setView] = useState<EditorView>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setView('editor');
  };

  const handleBackToGallery = () => {
    setView('gallery');
    setSelectedTemplate(null);
  };

  if (view === 'editor' && selectedTemplate) {
    return (
      <CardEditorView
        template={selectedTemplate}
        onBack={handleBackToGallery}
      />
    );
  }

  return (
    <TemplateGalleryView onSelectTemplate={handleSelectTemplate} />
  );
};
