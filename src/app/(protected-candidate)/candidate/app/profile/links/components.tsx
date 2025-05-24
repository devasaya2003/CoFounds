'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, X, Globe, Pencil } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter, FaFigma, FaTelegram, FaYoutube, FaBehance, FaDribbble } from 'react-icons/fa';
import { CandidateLink, SocialPlatform, SOCIAL_PLATFORMS } from './state';

// Component for the add/edit link form
export function LinkForm({
  selectedPlatform,
  linkUrl,
  setSelectedPlatform,
  setLinkUrl,
  handleAddLink,
  editingLink,
  handleCancelEdit
}: {
  selectedPlatform: SocialPlatform;
  linkUrl: string;
  setSelectedPlatform: (platform: SocialPlatform) => void;
  setLinkUrl: (url: string) => void;
  handleAddLink: () => void;
  editingLink: CandidateLink | null;
  handleCancelEdit: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors appearance-none"
          >
            <option value="">Select Social</option>
            {SOCIAL_PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter your profile URL"
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddLink}
            disabled={!selectedPlatform || !linkUrl}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {editingLink ? 'Update' : 'Add'}
          </button>
          
          {editingLink && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full md:w-auto px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      {editingLink && (
        <div className="text-sm text-indigo-600 font-medium pl-1">
          Editing: {editingLink.platform || editingLink.linkTitle}
        </div>
      )}
    </div>
  );
}

// Get the appropriate icon for a social platform
function getPlatformIcon(platform: SocialPlatform) {
  switch (platform) {
    case 'Instagram':
      return <FaInstagram className="h-5 w-5 text-pink-500" />;
    case 'LinkedIn':
      return <FaLinkedin className="h-5 w-5 text-blue-600" />;
    case 'GitHub':
      return <FaGithub className="h-5 w-5 text-gray-800" />;
    case 'Twitter':
      return <FaTwitter className="h-5 w-5 text-blue-400" />;
    case 'Behance':
      return <FaBehance className="h-5 w-5 text-blue-400" />;
    case 'Dribbble':
        return <FaDribbble className="h-5 w-5 text-blue-400" />;        
    case 'Pinterest':
      return <FaFigma className="h-5 w-5 text-red-500" />;
    case 'Telegram':
      return <FaTelegram className="h-5 w-5 text-blue-500" />;
    case 'YouTube':
      return <FaYoutube className="h-5 w-5 text-red-600" />;
    default:
      return <Globe className="h-5 w-5 text-gray-500" />;
  }
}

// Component for displaying the list of links
export function LinksList({
  links,
  isLoading,
  onDeleteLink,
  onEditLink,
}: {
  links: CandidateLink[];
  isLoading: boolean;
  onDeleteLink: (id: string) => void;
  onEditLink: (link: CandidateLink) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDeleteLink(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      // Reset after a delay
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }
  
  if (links.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-500">No social links added yet. Add your first link above.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-3">
      {links.map((link) => (
        <div 
          key={link.id}
          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-4"
        >
          <div className="flex items-center gap-3">
            {getPlatformIcon(link.platform || (link.linkTitle as SocialPlatform))}
            <div className="min-w-0">
              <p className="font-medium text-gray-800">
                {link.platform || link.linkTitle}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {link.linkUrl}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditLink(link)}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
              title="Edit link"
            >
              <Pencil className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              onClick={() => handleDelete(link.id)}
              className={`p-1.5 rounded-md transition-colors ${confirmDelete === link.id ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
              title={confirmDelete === link.id ? 'Click again to confirm' : 'Delete link'}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component for the form submit button with status
export function SubmitButtonWithStatus({
  isSubmitting,
  saveSuccess,
  formChanged,
  onCancel,
}: {
  isSubmitting: boolean;
  saveSuccess: boolean;
  formChanged: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center pt-4 border-t border-gray-200 mt-6">
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !formChanged}
          className="px-6 py-2.5 rounded-md font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
        
        {formChanged && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-md font-medium transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
      
      {saveSuccess && (
        <div className="ml-4 flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-1.5" />
          <span>Changes saved successfully!</span>
        </div>
      )}
    </div>
  );
}
