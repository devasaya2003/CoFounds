'use client';

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Certificate } from "@/types/candidate_onboarding";
import { CertificateFieldErrors } from '../types';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { OnboardingFormFields } from '../types';
import DateSelector from '@/components/DateSelector/DateSelector';
import MarkdownEditor from '@/components/RichTextEditor/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface CertificateFormProps {
    certificate: Certificate;
    index: number;
    register: UseFormRegister<OnboardingFormFields>;
    watch: UseFormWatch<OnboardingFormFields>;
    setValue: UseFormSetValue<OnboardingFormFields>;
    onRemove: () => void;
    onUpdate: (updates: Partial<Certificate>) => void;
    years: string[];
    months: { value: string; label: string }[];
    days: string[];
    errors?: CertificateFieldErrors;
}

export default function CertificateForm({
    certificate,
    index,
    register,
    watch,
    setValue,
    onRemove,
    onUpdate,
    years,
    months,
    days,
    errors,
}: CertificateFormProps) {
    const [uploading, setUploading] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ title: e.target.value });
    };

    const handleDescriptionChange = (value: string) => {
        onUpdate({ description: value });
        setValue(`certificates.${index}.description`, value);
    };

    const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ externalUrl: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            // Here you would typically upload to your storage service
            // For this example, we'll simulate a successful upload
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate successful upload with generated URL
            const fakeUploadUrl = `https://storage.example.com/${Date.now()}-${file.name}`;

            onUpdate({ fileUrl: fakeUploadUrl });
            setValue(`certificates.${index}.fileUrl`, fakeUploadUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-5 border border-gray-200 rounded-lg relative">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
                <Label htmlFor={`certificates.${index}.title`} className="mb-1 block py-3">
                    Title<span className="text-red-500">*</span>
                </Label>
                <Input
                    id={`certificates.${index}.title`}
                    {...register(`certificates.${index}.title`, { required: "Title is required" })}
                    placeholder="Enter certificate title"
                    value={certificate.title}
                    onChange={handleTitleChange}
                    className={errors?.title ? "border-red-500" : ""}
                />
                {errors?.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <Label htmlFor={`certificates.${index}.description`} className="mb-1 block py-3">
                    Description<span className="text-red-500">*</span>
                </Label>
                <MarkdownEditor
                    initialValue={certificate.description}
                    onChange={handleDescriptionChange}
                />
                {errors?.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
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
                            onUpdate({
                                startDate: { ...certificate.startDate, year }
                            });
                            setValue(`certificates.${index}.startDate.year`, year);
                        }}
                        onMonthChange={(month) => {
                            onUpdate({
                                startDate: { ...certificate.startDate, month }
                            });
                            setValue(`certificates.${index}.startDate.month`, month);
                        }}
                        onDayChange={(day) => {
                            onUpdate({
                                startDate: { ...certificate.startDate, day }
                            });
                            setValue(`certificates.${index}.startDate.day`, day);
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
                            onUpdate({
                                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), year }
                            });
                            setValue(`certificates.${index}.endDate.year`, year);
                        }}
                        onMonthChange={(month) => {
                            onUpdate({
                                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), month }
                            });
                            setValue(`certificates.${index}.endDate.month`, month);
                        }}
                        onDayChange={(day) => {
                            onUpdate({
                                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), day }
                            });
                            setValue(`certificates.${index}.endDate.day`, day);
                        }}
                    />
                </div>
            </div>

            <div className="mt-4">
                <Label className="mb-1 block py-3">
                    Certificate URL or Upload
                </Label>
                <Tabs defaultValue="url">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">External URL</TabsTrigger>
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="pt-4">
                        <Input
                            id={`certificates.${index}.externalUrl`}
                            {...register(`certificates.${index}.externalUrl`)}
                            placeholder="https://example.com/certificate"
                            value={certificate.externalUrl || ""}
                            onChange={handleExternalUrlChange}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                            {certificate.fileUrl ? (
                                <div className="flex flex-col items-center">
                                    <p className="mb-2 font-medium text-green-600">File uploaded successfully</p>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-600 mt-2 text-sm"
                                        onClick={() => {
                                            onUpdate({ fileUrl: "" });
                                            setValue(`certificates.${index}.fileUrl`, "");
                                        }}
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        id={`file-upload-${certificate.id}`}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept="application/pdf,image/*"
                                    />
                                    <label
                                        htmlFor={`file-upload-${certificate.id}`}
                                        className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                        <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-sm font-medium mb-1">
                                            {uploading ? "Uploading..." : "Click to upload file"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, PNG, JPG up to 10MB
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}