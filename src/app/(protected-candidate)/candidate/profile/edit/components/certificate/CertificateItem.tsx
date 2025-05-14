'use client';

import React, { ChangeEvent, memo, useCallback, useMemo, Suspense, lazy } from 'react';
import { X, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Certificate } from './types';
import { generateYears, generateMonths, generateDays } from './utils';

// Lazy-load the markdown editor since it's heavy
const MarkdownEditor = lazy(() => import('@/components/RichTextEditor/RichTextEditor'));

// Pre-generate these values once to avoid regenerating them for each certificate
const years = generateYears();
const months = generateMonths();
const days = generateDays();

interface CertificateItemProps {
    certificate: Certificate;
    index: number;
    onUpdate: (id: string, updates: Partial<Certificate>) => void;
    onRemove: (id: string) => void;
    onContentReady?: (id: string) => void; // Add this new prop
}

const CertificateItem = memo(({
    certificate,
    index,
    onUpdate,
    onRemove,
    onContentReady
}: CertificateItemProps) => {
    const hasNoExpiryDate = certificate.noExpiryDate === true;

    const handleRemove = useCallback(() => {
        onRemove(certificate.id);
    }, [certificate.id, onRemove]);

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(certificate.id, { title: e.target.value });
    }, [certificate.id, onUpdate]);

    const handleDescriptionChange = useCallback((value: string) => {
        onUpdate(certificate.id, { description: value });
    }, [certificate.id, onUpdate]);

    // Add handler for content ready event
    const handleContentReady = useCallback(() => {
        if (onContentReady) {
            onContentReady(certificate.id);
        }
    }, [certificate.id, onContentReady]);

    const handleLinkChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onUpdate(certificate.id, { link: e.target.value });
    }, [certificate.id, onUpdate]);

    return (
        <div className="p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                type="button"
                onClick={handleRemove}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove certificate"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
                <Label htmlFor={`certificate-${index}-title`} className="text-sm font-medium block mb-2">
                    Certificate Title<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                    id={`certificate-${index}-title`}
                    placeholder="Enter certificate title (e.g., AWS Certified Solutions Architect)"
                    value={certificate.title}
                    onChange={handleTitleChange}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="mb-5">
                <Label htmlFor={`certificate-${index}-description`} className="text-sm font-medium block mb-2">
                    Description<span className="text-red-500 ml-1">*</span>
                </Label>
                <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse rounded"></div>}>
                    <MarkdownEditor
                        initialValue={certificate.description || ''}
                        onChange={handleDescriptionChange}
                        onContentReady={handleContentReady} // Add this prop
                    />
                </Suspense>
                <p className="text-xs text-gray-500 mt-1">
                    Briefly describe what this certificate represents and the skills it validates.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div>
                    <Label className="text-sm font-medium block mb-2">
                        Issue Date<span className="text-red-500 ml-1">*</span>
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
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">
                            Expiry Date
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`no-expiry-${certificate.id}`}
                                checked={hasNoExpiryDate}
                                onCheckedChange={(checked) => {
                                    onUpdate(certificate.id, {
                                        noExpiryDate: checked === true,
                                        endDate: checked === true
                                            ? certificate.endDate
                                            : certificate.endDate || {
                                                year: new Date().getFullYear().toString(),
                                                month: "01",
                                                day: "01"
                                            }
                                    });
                                }}
                            />
                            <Label
                                htmlFor={`no-expiry-${certificate.id}`}
                                className="text-xs cursor-pointer"
                            >
                                No expiry date
                            </Label>
                        </div>
                    </div>

                    {!hasNoExpiryDate && (
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
                    )}
                    {hasNoExpiryDate && (
                        <div className="text-sm text-gray-500 italic border border-dashed border-gray-200 rounded p-2 bg-gray-50 text-center">
                            This certificate does not expire
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3">
                <div className="flex items-center mb-2">
                    <Label htmlFor={`certificate-${index}-link`} className="text-sm font-medium">
                        Certificate URL
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="ml-2">
                                <Info className="h-4 w-4 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm">Add a link to your certificate if available. File uploads coming soon!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Input
                    id={`certificate-${index}-link`}
                    placeholder="https://example.com/certificate"
                    value={certificate.link || ""}
                    onChange={handleLinkChange}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Add a link to verify your certificate (optional)
                </p>
            </div>
        </div>
    );
});

CertificateItem.displayName = "CertificateItem";
export default CertificateItem;