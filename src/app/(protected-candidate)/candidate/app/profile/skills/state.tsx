'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCandidateSkills, updateCandidateSkills } from '@/redux/slices/candidateSlice';
import { SkillWithLevel } from '@/types/shared';

export function useSkillsForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { skills, skillsLoading, skillsCount } = useAppSelector((state) => state.candidate);
    
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
    
  const initialStateRef = useRef<{
    skills: SkillWithLevel[];
  }>({ skills: [] });
    
  const [candidateSkills, setCandidateSkills] = useState<SkillWithLevel[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    added: SkillWithLevel[];
    updated: SkillWithLevel[];
    deleted: string[];
  }>({
    added: [],
    updated: [],
    deleted: [],
  });
    
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCandidateSkills(user.id));
    }
  }, [dispatch, user?.id]);
    
  useEffect(() => {
    if (skills) {            
      const mappedSkills = skills.map(skill => ({
        id: skill.skill.id,
        name: skill.skill.name,
        level: skill.skillLevel as 'beginner' | 'intermediate' | 'advanced'
      }));
      
      setCandidateSkills(mappedSkills);
            
      if (initialStateRef.current.skills.length === 0) {
        initialStateRef.current.skills = [...mappedSkills];
      }
    }
  }, [skills]);
    
  useEffect(() => {
    setFormChanged(
      pendingChanges.added.length > 0 || 
      pendingChanges.updated.length > 0 || 
      pendingChanges.deleted.length > 0
    );
  }, [pendingChanges]);
    
  const handleSkillSelect = useCallback((skill: SkillWithLevel) => {    
    setPendingChanges(prev => ({
      ...prev,
      added: [...prev.added, skill]
    }));
        
    setCandidateSkills(prev => [...prev, skill]);
  }, []);
    
  const handleSkillRemove = useCallback((skillId: string) => {    
    const isNewlyAdded = pendingChanges.added.some(skill => skill.id === skillId);
    const isUpdated = pendingChanges.updated.some(skill => skill.id === skillId);
    
    if (isNewlyAdded) {      
      setPendingChanges(prev => ({
        ...prev,
        added: prev.added.filter(skill => skill.id !== skillId)
      }));
    } else if (isUpdated) {      
      setPendingChanges(prev => ({
        ...prev,
        updated: prev.updated.filter(skill => skill.id !== skillId),
        deleted: [...prev.deleted, skillId]
      }));
    } else {      
      setPendingChanges(prev => ({
        ...prev,
        deleted: [...prev.deleted, skillId]
      }));
    }
        
    setCandidateSkills(prev => prev.filter(skill => skill.id !== skillId));
  }, [pendingChanges]);
    
  const handleSkillLevelChange = useCallback((skillId: string, level: 'beginner' | 'intermediate' | 'advanced') => {    
    const isNewlyAdded = pendingChanges.added.some(skill => skill.id === skillId);
    
    if (isNewlyAdded) {      
      setPendingChanges(prev => ({
        ...prev,
        added: prev.added.map(skill => 
          skill.id === skillId ? { ...skill, level } : skill
        )
      }));
    } else {      
      const originalSkill = initialStateRef.current.skills.find(
        skill => skill.id === skillId
      );
      
      if (originalSkill && originalSkill.level !== level) {                
        const isAlreadyUpdated = pendingChanges.updated.some(skill => skill.id === skillId);
        
        if (isAlreadyUpdated) {          
          setPendingChanges(prev => ({
            ...prev,
            updated: prev.updated.map(skill => 
              skill.id === skillId ? { ...skill, level } : skill
            )
          }));
        } else {          
          const skillToUpdate = candidateSkills.find(skill => skill.id === skillId);
          if (skillToUpdate) {
            setPendingChanges(prev => ({
              ...prev,
              updated: [...prev.updated, { ...skillToUpdate, level }]
            }));
          }
        }
      }
    }
        
    setCandidateSkills(prev => 
      prev.map(skill => skill.id === skillId ? { ...skill, level } : skill)
    );
  }, [pendingChanges, candidateSkills]);
    
  const handleResetAll = useCallback(() => {    
    setCandidateSkills([...initialStateRef.current.skills]);
        
    setPendingChanges({
      added: [],
      updated: [],
      deleted: [],
    });
    
    setSaveSuccess(false);
  }, []);
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !formChanged) {
      return;
    }
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    
    try {      
      await dispatch(updateCandidateSkills({
        userId: user.id,
        newSkills: pendingChanges.added.map(skill => ({
          skillId: skill.id,
          skillLevel: skill.level
        })),
        updatedSkills: pendingChanges.updated.map(skill => ({
          id: skill.id,
          skillId: skill.id,
          skillLevel: skill.level
        })),
        deletedSkills: pendingChanges.deleted
      })).unwrap();
            
      await dispatch(fetchCandidateSkills(user.id));
            
      setPendingChanges({ added: [], updated: [], deleted: [] });
      setFormChanged(false);
      setSaveSuccess(true);
            
      if (skills) {
        initialStateRef.current.skills = skills.map(skill => ({
          id: skill.skill.id,
          name: skill.skill.name,
          level: skill.skillLevel as 'beginner' | 'intermediate' | 'advanced'
        }));
      }
      
      const successTimer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(successTimer);
    } catch (error) {
      console.error('Error updating skills:', error);
      alert('Failed to update skills. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {    
    candidateSkills,
    isLoading: skillsLoading,
    skillsCount,
        
    formChanged,
    isSubmitting,
    saveSuccess,
        
    handleSkillSelect,
    handleSkillRemove,
    handleSkillLevelChange,
    handleSubmit,
    handleResetAll
  };
}
