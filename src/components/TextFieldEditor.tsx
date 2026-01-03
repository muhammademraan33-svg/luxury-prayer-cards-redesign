import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusinessCardData, categoryInfo } from '@/types/businessCard';
import { Type } from 'lucide-react';

interface TextFieldEditorProps {
  data: BusinessCardData;
  onChange: (field: keyof BusinessCardData, value: string) => void;
}

const getFieldLabels = (category: BusinessCardData['category']) => {
  switch (category) {
    case 'wedding':
      return {
        name: 'Header Text',
        title: 'Names / Main Text',
        subtitle: 'Subtitle',
        line1: 'Date',
        line2: 'Venue & Time',
        line3: 'Additional Info',
      };
    case 'baby':
      return {
        name: 'Header',
        title: 'Baby Name',
        subtitle: 'Birth Date',
        line1: 'Details',
        line2: 'Parents',
        line3: 'Accent Symbol',
      };
    case 'prayer':
    case 'memorial':
      return {
        name: 'Header',
        title: 'Name',
        subtitle: 'Years',
        line1: 'Quote / Message',
        line2: 'Line 2',
        line3: 'Line 3',
      };
    case 'graduation':
      return {
        name: 'Class Year',
        title: 'Graduate Name',
        subtitle: 'Degree / Honors',
        line1: 'Institution',
        line2: 'Ceremony Details',
        line3: 'Quote',
      };
    case 'anniversary':
      return {
        name: 'Milestone',
        title: 'Names',
        subtitle: 'Subtitle',
        line1: 'Invitation Text',
        line2: 'Date & Time',
        line3: 'Venue',
      };
    default:
      return {
        name: 'Header',
        title: 'Main Text',
        subtitle: 'Subtitle',
        line1: 'Line 1',
        line2: 'Line 2',
        line3: 'Line 3',
      };
  }
};

export const TextFieldEditor = ({ data, onChange }: TextFieldEditorProps) => {
  const labels = getFieldLabels(data.category);
  const icon = categoryInfo[data.category]?.icon || '📝';

  const fields: { key: keyof BusinessCardData; label: string }[] = [
    { key: 'name', label: labels.name },
    { key: 'title', label: labels.title },
    { key: 'subtitle', label: labels.subtitle },
    { key: 'line1', label: labels.line1 },
    { key: 'line2', label: labels.line2 },
    { key: 'line3', label: labels.line3 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <Label className="text-sm font-medium">Card Text</Label>
      </div>
      <div className="space-y-2.5">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={data[key] as string}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={label}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
