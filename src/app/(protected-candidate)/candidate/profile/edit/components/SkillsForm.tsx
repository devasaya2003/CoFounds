'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import PaginatedSkillsSelector from '@/components/SkillsSelector/PaginatedSkillsSelector';
import { SkillWithLevel } from '@/types/shared';
import { UserProfile } from '../api';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { SkillLevel, SkillsUpdatePayload } from './types';


export interface SkillsFormRef {
    resetForm: () => void;
    saveForm: () => void;
}

interface SkillsFormProps {
    profile: UserProfile;
    onChange: (hasChanges: boolean) => void;
    onSaveData: (data: SkillsUpdatePayload) => void;
}

interface SkillWithLevelAndStatus extends Omit<SkillWithLevel, 'level'> {
    level: SkillLevel;
    status?: 'existing' | 'updated' | 'new' | 'deleted';
    originalLevel?: SkillLevel;
}

const SkillsForm = forwardRef<SkillsFormRef, SkillsFormProps>(
    ({ profile, onChange, onSaveData }, ref) => {
        const transformProfileSkills = useCallback((): SkillWithLevelAndStatus[] => {
            return (profile.skillset || []).map(skillItem => {
                const skillLevel = skillItem.skillLevel?.toLowerCase() as SkillLevel;
                const normalizedLevel: SkillLevel =
                    ['beginner', 'intermediate', 'advanced'].includes(skillLevel)
                        ? skillLevel as SkillLevel
                        : 'beginner';

                return {
                    id: skillItem.skill.id,
                    name: skillItem.skill.name,
                    level: normalizedLevel,
                    status: 'existing',
                    originalLevel: normalizedLevel
                };
            });
        }, [profile.skillset]);

        const [skills, setSkills] = useState<SkillWithLevelAndStatus[]>(transformProfileSkills());

        const [deletedSkills, setDeletedSkills] = useState<SkillWithLevelAndStatus[]>([]);

        useEffect(() => {
            const hasNewOrUpdatedSkills = skills.some(skill =>
                skill.status === 'new' || skill.status === 'updated'
            );

            const hasChanges = hasNewOrUpdatedSkills || deletedSkills.length > 0;
            onChange(hasChanges);
        }, [skills, deletedSkills, onChange]);

        useEffect(() => {

            setSkills(transformProfileSkills());
            setDeletedSkills([]);
        }, [profile, transformProfileSkills]);

        const resetForm = useCallback(() => {
            const freshSkills = transformProfileSkills();
            setSkills(freshSkills);
            setDeletedSkills([]);
        }, [transformProfileSkills]);

        const handleSkillSelect = (skill: SkillWithLevel) => {
            const normalizedLevel: SkillLevel =
                ['beginner', 'intermediate', 'advanced'].includes(skill.level)
                    ? skill.level as SkillLevel
                    : 'beginner';

            const newSkill: SkillWithLevelAndStatus = {
                ...skill,
                level: normalizedLevel,
                status: 'new'
            };

            setSkills(prevSkills => [...prevSkills, newSkill]);
        };

        const handleSkillRemove = (skillId: string) => {
            const skillToRemove = skills.find(s => s.id === skillId);

            if (skillToRemove) {
                if (skillToRemove.status === 'existing' || skillToRemove.status === 'updated') {
                    setDeletedSkills(prev => [...prev, { ...skillToRemove, status: 'deleted' }]);
                }

                setSkills(prevSkills => prevSkills.filter(s => s.id !== skillId));
            }
        };

        const handleSkillLevelChange = (skillId: string, level: SkillLevel) => {
            setSkills(prevSkills =>
                prevSkills.map(skill => {
                    if (skill.id === skillId) {
                        if (skill.status === 'existing' && skill.originalLevel !== level) {
                            return { ...skill, level, status: 'updated' };
                        }
                        else if (skill.status === 'updated' && skill.originalLevel === level) {
                            return { ...skill, level, status: 'existing' };
                        }
                        return { ...skill, level };
                    }
                    return skill;
                })
            );
        };

        const prepareDataForSave = useCallback(() => {
            const data: SkillsUpdatePayload = {
                user_id: profile.id,
                updated_skillset: skills
                    .filter(skill => skill.status === 'updated')
                    .map(skill => ({
                        skill_id: skill.id,
                        skill_level: skill.level
                    })),

                new_skillset: skills
                    .filter(skill => skill.status === 'new')
                    .map(skill => ({
                        skill_id: skill.id,
                        skill_level: skill.level
                    })),

                deleted_skillset: deletedSkills.map(skill => skill.id)
            };

            onSaveData(data);
        }, [skills, deletedSkills, onSaveData, profile.id]);

        useImperativeHandle(ref, () => ({
            resetForm,
            saveForm: prepareDataForSave
        }));

        return (
            <div className="space-y-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">Your Skills</h2>
                    <p className="text-gray-600">
                        Add, update or remove your skills to showcase your expertise.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="skills" className="text-base font-medium">
                                    Skills & Expertise
                                </Label>
                                <p className="text-sm text-gray-500 mb-2">
                                    Select skills and set your proficiency level for each.
                                </p>
                            </div>

                            <PaginatedSkillsSelector
                                selectedSkills={skills}
                                onSkillSelect={handleSkillSelect}
                                onSkillRemove={handleSkillRemove}
                                onSkillLevelChange={handleSkillLevelChange}
                                fetchAll={true}
                            />

                            {skills.length === 0 && (
                                <div className="p-4 border border-amber-200 bg-amber-50 rounded-md flex items-center">
                                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                    <span className="text-amber-700">
                                        You don't have any skills listed. Add skills to showcase your expertise.
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-2 text-sm text-gray-500">
                    <p>
                        <strong>Tip:</strong> Click the skill level indicator to change your proficiency level.
                    </p>
                </div>
            </div>
        );
    }
);

SkillsForm.displayName = "SkillsForm";
export default SkillsForm;