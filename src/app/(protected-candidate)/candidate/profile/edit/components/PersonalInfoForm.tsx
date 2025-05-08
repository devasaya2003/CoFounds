'use client';

import { useState, useEffect, useMemo, useCallback, useImperativeHandle, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Label } from '@/components/ui/label';
import { UserProfile } from '../api';

// Define the ref interface
export interface PersonalInfoFormRef {
    resetForm: () => void;
    saveForm: () => void;
}

interface PersonalInfoFormProps {
    profile: UserProfile;
    onChange: (hasChanges: boolean) => void;
    onSaveData: (data: Partial<UserProfile>) => void;
}

const PersonalInfoForm = forwardRef<PersonalInfoFormRef, PersonalInfoFormProps>(
    ({ profile, onChange, onSaveData }, ref) => {
        const [firstName, setFirstName] = useState(profile.firstName || '');
        const [lastName, setLastName] = useState(profile.lastName || '');
        const [description, setDescription] = useState(profile.description || '');

        const dobDate = useMemo(() => profile.dob ? new Date(profile.dob) : null, [profile.dob]);
        const [dobYear, setDobYear] = useState(dobDate ? dobDate.getFullYear().toString() : '');
        const [dobMonth, setDobMonth] = useState(dobDate ? (dobDate.getMonth() + 1).toString().padStart(2, '0') : '');
        const [dobDay, setDobDay] = useState(dobDate ? dobDate.getDate().toString().padStart(2, '0') : '');

        useEffect(() => {
            const hasChanges =
                firstName !== (profile.firstName || '') ||
                lastName !== (profile.lastName || '') ||
                description !== (profile.description || '') ||
                dobYear !== (dobDate ? dobDate.getFullYear().toString() : '') ||
                dobMonth !== (dobDate ? (dobDate.getMonth() + 1).toString().padStart(2, '0') : '') ||
                dobDay !== (dobDate ? dobDate.getDate().toString().padStart(2, '0') : '');

            onChange(hasChanges);
        }, [firstName, lastName, description, dobYear, dobMonth, dobDay, profile, dobDate, onChange]);

        const prepareDataForSave = useCallback(() => {
            const data: Partial<UserProfile> = {
                id: profile.id,
                firstName,
                lastName,
                description
            };

            if (dobYear && dobMonth && dobDay) {
                const dobString = `${dobYear}-${dobMonth}-${dobDay}T00:00:00.000Z`;
                data.dob = new Date(dobString);
            }

            onSaveData(data);
        }, [dobDay, dobMonth, dobYear, description, firstName, lastName, onSaveData, profile.id]);

        const resetForm = useCallback(() => {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setDescription(profile.description || '');
            setDobYear(dobDate ? dobDate.getFullYear().toString() : '');
            setDobMonth(dobDate ? (dobDate.getMonth() + 1).toString().padStart(2, '0') : '');
            setDobDay(dobDate ? dobDate.getDate().toString().padStart(2, '0') : '');
        }, [dobDate, profile.firstName, profile.lastName, profile.description]);

        // Expose methods via the ref
        useImperativeHandle(ref, () => ({
            resetForm,
            saveForm: prepareDataForSave
        }));

        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 101 }, (_, i) => (currentYear - 100 + i).toString());
        const months = [
            { value: '01', label: 'January' }, { value: '02', label: 'February' },
            { value: '03', label: 'March' }, { value: '04', label: 'April' },
            { value: '05', label: 'May' }, { value: '06', label: 'June' },
            { value: '07', label: 'July' }, { value: '08', label: 'August' },
            { value: '09', label: 'September' }, { value: '10', label: 'October' },
            { value: '11', label: 'November' }, { value: '12', label: 'December' }
        ];

        return (
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">Personal Information</h2>
                    <p className="text-gray-600">Update your personal details and profile information.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <FormInput
                            id="email"
                            label="Email"
                            type="email"
                            value={profile.email || ''}
                            disabled={true}
                        />
                        <div className="absolute inset-0 cursor-not-allowed">
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 -mt-12 left-0 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg">
                                We currently do not support changing the email.
                                <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -bottom-1"></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <FormInput
                            id="userName"
                            label="Username"
                            type="text"
                            value={profile.userName || ''}
                            disabled={true}
                        />
                        <div className="absolute inset-0 cursor-not-allowed">
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 -mt-12 left-0 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg">
                                We currently do not support changing the user name.
                                <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -bottom-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormInput
                            id="firstName"
                            label="First Name"
                            required
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div>
                        <FormInput
                            id="lastName"
                            label="Last Name"
                            required
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>


                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                    </Label>
                    <DateSelector
                        years={years}
                        months={months}
                        selectedYear={dobYear}
                        selectedMonth={dobMonth}
                        selectedDay={dobDay}
                        onYearChange={(value) => setDobYear(value)}
                        onMonthChange={(value) => setDobMonth(value)}
                        onDayChange={(value) => setDobDay(value)}
                    />
                </div>

                <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        About Me
                    </Label>
                    <RichTextEditor
                        initialValue={description}
                        onChange={(html) => setDescription(html)}
                    />
                </div>
            </div>
        );
    }
);

PersonalInfoForm.displayName = "PersonalInfoForm";
export default PersonalInfoForm;