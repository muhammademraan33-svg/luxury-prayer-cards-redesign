import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusinessCardData } from '@/types/businessCard';
import { User, Briefcase, Building2, Mail, Phone, Globe } from 'lucide-react';

interface TextFieldEditorProps {
  data: BusinessCardData;
  onChange: (field: keyof BusinessCardData, value: string) => void;
}

const fields = [
  { key: 'name' as const, label: 'Full Name', icon: User, placeholder: 'John Smith' },
  { key: 'title' as const, label: 'Job Title', icon: Briefcase, placeholder: 'Creative Director' },
  { key: 'company' as const, label: 'Company', icon: Building2, placeholder: 'Design Studio' },
  { key: 'email' as const, label: 'Email', icon: Mail, placeholder: 'john@example.com' },
  { key: 'phone' as const, label: 'Phone', icon: Phone, placeholder: '+1 (555) 123-4567' },
  { key: 'website' as const, label: 'Website', icon: Globe, placeholder: 'www.example.com' },
];

export const TextFieldEditor = ({ data, onChange }: TextFieldEditorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Card Information</Label>
      <div className="space-y-2.5">
        {fields.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={data[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              className="pl-10 h-10"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
