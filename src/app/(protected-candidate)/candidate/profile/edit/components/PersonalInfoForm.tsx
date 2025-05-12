'use client';

import { useState, useEffect, useMemo, useCallback, useImperativeHandle, forwardRef } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import FormInput from '@/components/FormElements/FormInput';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import DateSelector from '@/components/DateSelector/DateSelector';
import { Label } from '@/components/ui/label';
import { UserProfile } from '../api';
import { debounce } from 'lodash';
import { fetchWithAuth_GET } from '@/utils/api';
import { VALIDATE_USERNAME } from '@/utils/regex_utils/regex_validations';

interface UsernameCheckResponse {
  valid: boolean;
  available: boolean;
  message: string;
}

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
        const [userName, setUserName] = useState(profile.userName || '');
        
        // Username validation states
        const [isChecking, setIsChecking] = useState(false);
        const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
        const [validationMessage, setValidationMessage] = useState('');

        const dobDate = useMemo(() => profile.dob ? new Date(profile.dob) : null, [profile.dob]);
        const [dobYear, setDobYear] = useState(dobDate ? dobDate.getFullYear().toString() : '');
        const [dobMonth, setDobMonth] = useState(dobDate ? (dobDate.getMonth() + 1).toString().padStart(2, '0') : '');
        const [dobDay, setDobDay] = useState(dobDate ? dobDate.getDate().toString().padStart(2, '0') : '');

        const isUsernameEditable = !profile.userName;

        useEffect(() => {
            const hasChanges =
                firstName !== (profile.firstName || '') ||
                lastName !== (profile.lastName || '') ||
                description !== (profile.description || '') ||
                (isUsernameEditable && userName !== (profile.userName || '')) ||
                dobYear !== (dobDate ? dobDate.getFullYear().toString() : '') ||
                dobMonth !== (dobDate ? (dobDate.getMonth() + 1).toString().padStart(2, '0') : '') ||
                dobDay !== (dobDate ? dobDate.getDate().toString().padStart(2, '0') : '');

            onChange(hasChanges);
        }, [firstName, lastName, description, userName, dobYear, dobMonth, dobDay, profile, dobDate, onChange, isUsernameEditable]);

        const checkUsernameImmediate = useCallback(async (username: string) => {
            if (!username || username.length < 3 || username.length > 8) {
                setIsAvailable(null);
                setValidationMessage('Username must be between 3-8 characters');
                setIsChecking(false);
                return;
            }

            if (username.toLowerCase() === 'www') {
                setIsAvailable(false);
                setValidationMessage('"www" cannot be used as a username');
                setIsChecking(false);
                return;
            }

            if (!VALIDATE_USERNAME(username)) {
                setIsAvailable(false);
                setValidationMessage('Username must be 3-8 characters, lowercase letters and numbers only, with hyphens or underscores only in the middle');
                setIsChecking(false);
                return;
            }

            setIsChecking(true);

            try {
                const data = await fetchWithAuth_GET<UsernameCheckResponse>(`/api/v1/candidate/check-user/${username}`);

                setIsAvailable(data.available);
                setValidationMessage(data.message);
            } catch (error) {
                console.error('Error checking username:', error);
                setIsAvailable(false);
                setValidationMessage('Failed to check username availability.');
            } finally {
                setIsChecking(false);
            }
        }, []);

        const checkUsername = useMemo(
            () => debounce(checkUsernameImmediate, 500),
            [checkUsernameImmediate]
        );

        const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setUserName(value);

            if (value.length >= 3) {
                setIsChecking(true);
                checkUsername(value);
            } else {
                setIsAvailable(null);
                setValidationMessage('');
            }
        };

        useEffect(() => {
            return () => {
                checkUsername.cancel();
            };
        }, [checkUsername]);

        const prepareDataForSave = useCallback(() => {
            const data: Partial<UserProfile> = {
                id: profile.id,
                userName,
                firstName,
                lastName,
                description
            };

            // Only include username if it's editable and has been modified
            if (isUsernameEditable && userName && userName !== profile.userName && isAvailable) {
                data.userName = userName;
            }

            if (dobYear && dobMonth && dobDay) {
                const dobString = `${dobYear}-${dobMonth}-${dobDay}T00:00:00.000Z`;
                data.dob = new Date(dobString);
            }

            onSaveData(data);
        }, [dobDay, dobMonth, dobYear, description, firstName, lastName, userName, isUsernameEditable, isAvailable, onSaveData, profile.id, profile.userName]);

        const resetForm = useCallback(() => {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setDescription(profile.description || '');
            setUserName(profile.userName || '');
            setDobYear(dobDate ? dobDate.getFullYear().toString() : '');
            setDobMonth(dobDate ? (dobDate.getMonth() + 1).toString().padStart(2, '0') : '');
            setDobDay(dobDate ? dobDate.getDate().toString().padStart(2, '0') : '');
            setIsAvailable(null);
            setValidationMessage('');
        }, [dobDate, profile.firstName, profile.lastName, profile.description, profile.userName]);

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

                    <div className={`relative ${!isUsernameEditable ? 'group' : ''}`}>
                        <FormInput
                            id="userName"
                            label="Username"
                            type="text"
                            value={userName}
                            onChange={isUsernameEditable ? handleUsernameChange : undefined}
                            disabled={!isUsernameEditable}
                        />
                        {!isUsernameEditable && (
                            <div className="absolute inset-0 cursor-not-allowed">
                                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 -mt-12 left-0 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg">
                                    Username cannot be changed once set.
                                    <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 left-4 -bottom-1"></div>
                                </div>
                            </div>
                        )}
                        
                        {/* Username validation status */}
                        {isUsernameEditable && userName && userName.length >= 3 && (
                            <div className="mt-2">
                                {isChecking ? (
                                    <div className="flex items-center text-amber-600">
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        <span>Validating your username...</span>
                                    </div>
                                ) : (
                                    validationMessage && (
                                        <div className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                            {validationMessage}
                                        </div>
                                    )
                                )}
                            </div>
                        )}
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