'use client';

import { X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DateSelector from '@/components/DateSelector/DateSelector';
import MarkdownEditor from '@/components/RichTextEditor/RichTextEditor';
import { Certificate } from './types';
import { generateYears, generateMonths, generateDays } from './utils';

interface CertificateItemProps {
  certificate: Certificate;
  index: number;
  onUpdate: (id: string, updates: Partial<Certificate>) => void;
  onRemove: (id: string) => void;
}

export default function CertificateItem({ 
  certificate, 
  index, 
  onUpdate, 
  onRemove 
}: CertificateItemProps) {
  const years = generateYears();
  const months = generateMonths();
  const days = generateDays();

  return (
    <div className="p-5 border border-gray-200 rounded-lg relative">
      <button
        type="button"
        onClick={() => onRemove(certificate.id)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div className="mb-4">
        <Label htmlFor={`certificate-${index}-title`} className="mb-1 block py-3">
          Title<span className="text-red-500">*</span>
        </Label>
        <Input
          id={`certificate-${index}-title`}
          placeholder="Enter certificate title"
          value={certificate.title}
          onChange={(e) => onUpdate(certificate.id, { title: e.target.value })}
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor={`certificate-${index}-description`} className="mb-1 block py-3">
          Description<span className="text-red-500">*</span>
        </Label>
        <MarkdownEditor
          initialValue={certificate.description || ''}
          onChange={(value) => onUpdate(certificate.id, { description: value })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
        <div>
          <Label className="mb-1 block">
            Issue Date<span className="text-red-500">*</span>
          </Label>
          <DateSelector
            years={years}
            months={months}
            selectedYear={certificate.startDate.year}
            selectedMonth={certificate.startDate.month}
            selectedDay={certificate.startDate.day}
            onYearChange={(year) => {
              onUpdate(certificate.id, {
                startDate: { ...certificate.startDate, year }
              });
            }}
            onMonthChange={(month) => {
              onUpdate(certificate.id, {
                startDate: { ...certificate.startDate, month }
              });
            }}
            onDayChange={(day) => {
              onUpdate(certificate.id, {
                startDate: { ...certificate.startDate, day }
              });
            }}
          />
        </div>

        <div>
          <Label className="mb-1 block">
            Expiry Date (Optional)
          </Label>
          <DateSelector
            years={years}
            months={months}
            selectedYear={certificate.endDate?.year || ""}
            selectedMonth={certificate.endDate?.month || ""}
            selectedDay={certificate.endDate?.day || ""}
            onYearChange={(year) => {
              onUpdate(certificate.id, {
                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), year }
              });
            }}
            onMonthChange={(month) => {
              onUpdate(certificate.id, {
                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), month }
              });
            }}
            onDayChange={(day) => {
              onUpdate(certificate.id, {
                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), day }
              });
            }}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <Label htmlFor={`certificate-${index}-link`} className="mb-1 block py-3">
            Certificate URL
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-2">
                <Info className="h-4 w-4 text-blue-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">File uploads coming soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id={`certificate-${index}-link`}
          placeholder="https://example.com/certificate"
          value={certificate.link || ""}
          onChange={(e) => onUpdate(certificate.id, { link: e.target.value })}
        />
      </div>
    </div>
  );
}