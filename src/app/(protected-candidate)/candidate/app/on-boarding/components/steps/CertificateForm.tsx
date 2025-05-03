'use client';

import { X, UploadCloud } from 'lucide-react';
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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeCertificate } from '@/redux/slices/candidateOnboardingSlice';
import { fetchWithAuth_UPLOAD, fetchWithAuth_POST } from '@/utils/api';

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
    disabled?: boolean;
    onDelete?: (id: string) => void;
}

interface UploadResponse {
    fileUrl: string;
    fileId: string;
    success?: boolean;
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
    disabled = false,
    onDelete,
}: CertificateFormProps) {
    const [uploading, setUploading] = useState(false);
    const dispatch = useAppDispatch();
    const authState = useAppSelector(state => state.auth);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onUpdate({ title: e.target.value });
    };

    const handleDescriptionChange = (value: string) => {
        if (disabled) return;
        onUpdate({ description: value });
        setValue(`certificates.${index}.description`, value);
    };

    const handleExternalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onUpdate({ externalUrl: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', authState.user?.id || '');
            formData.append('tempUpload', 'true');
            formData.append('certificateId', certificate.id);

            const data = await fetchWithAuth_UPLOAD<UploadResponse>('/api/v1/upload/temp', formData);

            const tempFileUrl = data.fileUrl;
            onUpdate({ fileUrl: tempFileUrl, tempFileId: data.fileId });
            setValue(`certificates.${index}.fileUrl`, tempFileUrl);
            setValue(`certificates.${index}.tempFileId`, data.fileId);

        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        console.log("inside handle delete...!")
        await dispatch(removeCertificate(certificate.id));
        if (onDelete) {
            onDelete(certificate.id);
        }
    };

    const handleRemoveFile = async () => {
        if (certificate.tempFileId) {
            try {
                await fetchWithAuth_POST('/api/v1/upload/delete', {
                    fileId: certificate.tempFileId
                });

                onUpdate({ fileUrl: "", tempFileId: "" });
                setValue(`certificates.${index}.fileUrl`, "");
                setValue(`certificates.${index}.tempFileId`, "");

                console.log("File removed successfully");
            } catch (error) {
                console.error("Error removing file:", error);
            }
        } else {
            onUpdate({ fileUrl: "", tempFileId: "" });
            setValue(`certificates.${index}.fileUrl`, "");
            setValue(`certificates.${index}.tempFileId`, "");
        }
    };

    return (
        <div className="p-5 border border-gray-200 rounded-lg relative">
            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className={`absolute top-4 right-4 text-gray-400 hover:text-gray-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
                    disabled={disabled}
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
                    disabled={disabled}
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
                            if (disabled) return;
                            onUpdate({
                                startDate: { ...certificate.startDate, year }
                            });
                            setValue(`certificates.${index}.startDate.year`, year);
                        }}
                        onMonthChange={(month) => {
                            if (disabled) return;
                            onUpdate({
                                startDate: { ...certificate.startDate, month }
                            });
                            setValue(`certificates.${index}.startDate.month`, month);
                        }}
                        onDayChange={(day) => {
                            if (disabled) return;
                            onUpdate({
                                startDate: { ...certificate.startDate, day }
                            });
                            setValue(`certificates.${index}.startDate.day`, day);
                        }}
                        disabled={disabled}
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
                            if (disabled) return;
                            onUpdate({
                                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), year }
                            });
                            setValue(`certificates.${index}.endDate.year`, year);
                        }}
                        onMonthChange={(month) => {
                            if (disabled) return;
                            onUpdate({
                                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), month }
                            });
                            setValue(`certificates.${index}.endDate.month`, month);
                        }}
                        onDayChange={(day) => {
                            if (disabled) return;
                            onUpdate({
                                endDate: { ...(certificate.endDate || { year: "", month: "", day: "" }), day }
                            });
                            setValue(`certificates.${index}.endDate.day`, day);
                        }}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="mt-4">
                <Label className="mb-1 block py-3">
                    Certificate URL or Upload
                </Label>
                <Tabs defaultValue="url">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url" disabled={disabled}>External URL</TabsTrigger>
                        <TabsTrigger value="upload" disabled={disabled}>Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="pt-4">
                        <Input
                            id={`certificates.${index}.externalUrl`}
                            {...register(`certificates.${index}.externalUrl`)}
                            placeholder="https://example.com/certificate"
                            value={certificate.externalUrl || ""}
                            onChange={handleExternalUrlChange}
                            disabled={disabled}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4">
                        <div className={`border-2 border-dashed border-gray-300 rounded-md p-6 ${disabled ? 'opacity-70 bg-gray-50' : ''}`}>
                            {certificate.fileUrl ? (
                                <div className="flex flex-col items-center">
                                    {/* File Preview Section */}
                                    <div className="w-full mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {certificate.fileUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded flex items-center justify-center mr-3">
                                                        <span className="font-bold">PDF</span>
                                                    </div>
                                                ) : certificate.fileUrl.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                                                    <img
                                                        src={certificate.fileUrl}
                                                        alt="Certificate preview"
                                                        className="w-12 h-12 object-cover rounded mr-3"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://placehold.co/48x48/gray/white?text=IMG';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-3">
                                                        <UploadCloud className="h-6 w-6" />
                                                    </div>
                                                )}

                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium truncate">
                                                        {/* Extract file name from URL */}
                                                        {certificate.tempFileId
                                                            ? certificate.tempFileId.split('/').pop()
                                                            : 'Uploaded file'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded {new Date().toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* View button */}
                                            <a
                                                href={certificate.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </div>

                                    <p className="mb-4 font-medium text-green-600">
                                        File uploaded successfully
                                    </p>

                                    {/* Single button to remove certificate */}
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Remove File
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
                                        disabled={disabled}
                                    />
                                    <label
                                        htmlFor={`file-upload-${certificate.id}`}
                                        className={`cursor-pointer flex flex-col items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
