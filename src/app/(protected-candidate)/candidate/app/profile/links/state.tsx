'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  fetchCandidateLinks, 
  updateCandidateLinks,
} from '@/redux/slices/candidateSlice';

export type SocialPlatform = 
  | 'Instagram' 
  | 'LinkedIn' 
  | 'GitHub' 
  | 'Twitter' 
  | 'Behance' 
  | 'Dribbble' 
  | 'Pinterest' 
  | 'Telegram' 
  | 'YouTube' 
  | '';

export interface CandidateLink {
  id: string;
  linkTitle: string;
  linkUrl: string;
  platform?: SocialPlatform;
}

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'GitHub', label: 'GitHub' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Behance', label: 'Behance' },
  { value: 'Dribbble', label: 'Dribbble' },
  { value: 'Pinterest', label: 'Pinterest' },
  { value: 'Telegram', label: 'Telegram' },
  { value: 'YouTube', label: 'YouTube' },
];

export function useSocialLinksForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { links, linksLoading } = useAppSelector((state) => state.candidate);
  
  // Form state
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('');
  const [linkUrl, setLinkUrl] = useState<string>('');
  
  // Edit state
  const [editingLink, setEditingLink] = useState<CandidateLink | null>(null);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Initial state reference for global cancel
  const initialStateRef = useRef<{
    links: CandidateLink[];
  }>({ links: [] });
  
  // Link tracking
  const [candidateLinks, setCandidateLinks] = useState<CandidateLink[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    added: CandidateLink[];
    deleted: string[];
  }>({
    added: [],
    deleted: [],
  });
  
  // Load initial links data
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCandidateLinks(user.id));
    }
  }, [dispatch, user?.id]);
  
  // Update local links when Redux state changes
  useEffect(() => {
    if (links) {
      // Map links and identify platform based on linkTitle
      const mappedLinks = links.map(link => ({
        ...link,
        platform: link.linkTitle as SocialPlatform
      }));
      setCandidateLinks(mappedLinks);
      
      // Store initial state for global cancel
      if (initialStateRef.current.links.length === 0) {
        initialStateRef.current.links = [...mappedLinks];
      }
    }
  }, [links]);
  
  // Track form changes
  useEffect(() => {
    setFormChanged(pendingChanges.added.length > 0 || pendingChanges.deleted.length > 0);
  }, [pendingChanges]);
  
  // Handle editing a link
  const handleEditLink = useCallback((link: CandidateLink) => {
    setEditingLink(link);
    setSelectedPlatform(link.platform || link.linkTitle as SocialPlatform);
    setLinkUrl(link.linkUrl);
    
    // Enhanced scrolling to make sure it works in all browsers
    setTimeout(() => {
      // First try the modern smooth scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Fallback for older browsers
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }, 10);
  }, []);
  
  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingLink(null);
    setSelectedPlatform('');
    setLinkUrl('');
  }, []);
  
  // Reset entire form to original state
  const handleResetAll = useCallback(() => {
    // Reset form
    setEditingLink(null);
    setSelectedPlatform('');
    setLinkUrl('');
    
    // Reset links to original state
    setCandidateLinks([...initialStateRef.current.links]);
    
    // Clear pending changes
    setPendingChanges({
      added: [],
      deleted: [],
    });
    
    setSaveSuccess(false);
  }, []);
  
  // Validate a URL for the given platform
  const validateUrl = (url: string, platform: SocialPlatform): boolean => {
    if (!url) return false;
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return false;
    }
    
    // Platform-specific validation could be added here
    return true;
  };
  
  // Handle adding a new link
  const handleAddLink = useCallback(() => {
    if (!selectedPlatform || !linkUrl || !validateUrl(linkUrl, selectedPlatform)) {
      alert('Please enter a valid URL for the selected platform.');
      return;
    }
    
    if (editingLink) {
      // We're updating an existing link
      const updatedLinks = candidateLinks.map(link => 
        link.id === editingLink.id 
          ? { ...link, linkTitle: selectedPlatform, linkUrl, platform: selectedPlatform }
          : link
      );
      
      setCandidateLinks(updatedLinks);
      
      // Add to updated links for API call
      const isNewlyAddedLink = editingLink.id.startsWith('temp-');
      
      if (isNewlyAddedLink) {
        // Update in pending changes
        setPendingChanges(prev => ({
          ...prev,
          added: prev.added.map(link => 
            link.id === editingLink.id 
              ? { ...link, linkTitle: selectedPlatform, linkUrl, platform: selectedPlatform }
              : link
          )
        }));
      } else {
        // For existing links, we'll delete the old one and add a new one
        setPendingChanges(prev => ({
          ...prev,
          deleted: [...prev.deleted, editingLink.id],
          added: [...prev.added, {
            id: `temp-${Date.now()}`,
            linkTitle: selectedPlatform,
            linkUrl,
            platform: selectedPlatform
          }]
        }));
      }
      
      // Reset form
      setEditingLink(null);
      setSelectedPlatform('');
      setLinkUrl('');
    } else {
      // Adding a new link (existing logic)
      // Check if this platform already exists in the links
      const existingLinkIndex = candidateLinks.findIndex(
        link => link.platform === selectedPlatform
      );
      
      if (existingLinkIndex !== -1) {
        alert(`A ${selectedPlatform} link already exists. Please delete it first if you want to add a new one.`);
        return;
      }
      
      // Add to pending changes
      const newLink: CandidateLink = {
        id: `temp-${Date.now()}`,
        linkTitle: selectedPlatform,
        linkUrl,
        platform: selectedPlatform
      };
      
      setPendingChanges(prev => ({
        ...prev,
        added: [...prev.added, newLink]
      }));
      
      // Add to local state
      setCandidateLinks(prev => [...prev, newLink]);
      
      // Reset form
      setSelectedPlatform('');
      setLinkUrl('');
    }
  }, [selectedPlatform, linkUrl, candidateLinks, editingLink, setCandidateLinks]);
  
  // Handle deleting a link
  const handleDeleteLink = useCallback((linkId: string) => {
    // Check if this is a newly added link
    const isNewlyAdded = pendingChanges.added.some(link => link.id === linkId);
    
    if (isNewlyAdded) {
      // Remove from added links
      setPendingChanges(prev => ({
        ...prev,
        added: prev.added.filter(link => link.id !== linkId)
      }));
    } else {
      // Add to deleted links
      setPendingChanges(prev => ({
        ...prev,
        deleted: [...prev.deleted, linkId]
      }));
    }
    
    // Remove from local state
    setCandidateLinks(prev => prev.filter(link => link.id !== linkId));
  }, [pendingChanges]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !formChanged) {
      return;
    }
    
    setIsSubmitting(true);
    setSaveSuccess(false);
    
    try {
      // Use the batch operation
      await dispatch(updateCandidateLinks({
        userId: user.id,
        newLinks: pendingChanges.added.map(link => ({
          linkUrl: link.linkUrl,
          linkTitle: link.linkTitle
        })),
        deletedLinks: pendingChanges.deleted
      })).unwrap();
      
      // Refresh links
      await dispatch(fetchCandidateLinks(user.id));
      
      // Reset changes
      setPendingChanges({ added: [], deleted: [] });
      setFormChanged(false);
      setSaveSuccess(true);
      
      const successTimer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(successTimer);
    } catch (error) {
      console.error('Error updating links:', error);
      alert('Failed to update links. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    // Data
    candidateLinks,
    isLoading: linksLoading,
    
    // Form state
    selectedPlatform,
    linkUrl,
    formChanged,
    isSubmitting,
    saveSuccess,
    editingLink,
    
    // Handlers
    setSelectedPlatform,
    setLinkUrl,
    handleAddLink,
    handleDeleteLink,
    handleSubmit,
    handleEditLink,
    handleCancelEdit,
    handleResetAll
  };
}
