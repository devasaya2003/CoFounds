'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Instagram, 
  Linkedin, 
  Github, 
  Twitter, 
  Figma, 
  Dribbble, 
  Link2, 
  MessageCircle, 
  Youtube,
  Save,
  AlertCircle,
  ExternalLink,
  X,
  Info,
  Plus
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { useToast } from '@/hooks/use-toast'; // Import from our custom hook

// Define UserLink type to match the schema
interface UserLink {
  id?: string;
  userId?: string;
  linkUrl: string;
  linkTitle: string;
  isActive?: boolean;
}

// Define platform information for UI representation
interface PlatformInfo {
  name: string;
  icon: React.ReactNode;
  placeholder: string;
  color: string;
  validationRegex?: RegExp;
}

export default function LinksEditPage() {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  
  // State for user links array (matching the schema)
  const [links, setLinks] = useState<UserLink[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Platform information for display
  const platforms: Record<string, PlatformInfo> = {
    instagram: {
      name: 'Instagram',
      icon: <Instagram size={20} />,
      placeholder: 'https://instagram.com/yourusername',
      color: 'text-pink-500',
      validationRegex: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/
    },
    linkedin: {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      placeholder: 'https://linkedin.com/in/yourusername',
      color: 'text-blue-600',
      validationRegex: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/
    },
    github: {
      name: 'GitHub',
      icon: <Github size={20} />,
      placeholder: 'https://github.com/yourusername',
      color: 'text-slate-800',
      validationRegex: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/
    },
    twitter: {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      placeholder: 'https://twitter.com/yourusername',
      color: 'text-blue-400',
      validationRegex: /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/
    },
    behance: {
      name: 'Behance',
      icon: <Figma size={20} />,
      placeholder: 'https://behance.net/yourusername',
      color: 'text-blue-700',
      validationRegex: /^(https?:\/\/)?(www\.)?behance\.net\/[a-zA-Z0-9_-]+\/?$/
    },
    dribbble: {
      name: 'Dribbble',
      icon: <Dribbble size={20} />,
      placeholder: 'https://dribbble.com/yourusername',
      color: 'text-pink-600',
      validationRegex: /^(https?:\/\/)?(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+\/?$/
    },
    pinterest: {
      name: 'Pinterest',
      icon: <Link2 size={20} />,
      placeholder: 'https://pinterest.com/yourusername',
      color: 'text-red-600',
      validationRegex: /^(https?:\/\/)?(www\.)?pinterest\.com\/[a-zA-Z0-9_-]+\/?$/
    },
    telegram: {
      name: 'Telegram',
      icon: <MessageCircle size={20} />,
      placeholder: 'https://t.me/yourusername',
      color: 'text-blue-500',
      validationRegex: /^(https?:\/\/)?(www\.)?t\.me\/[a-zA-Z0-9_]+\/?$/
    },
    youtube: {
      name: 'YouTube',
      icon: <Youtube size={20} />,
      placeholder: 'https://youtube.com/c/yourusername',
      color: 'text-red-600',
      validationRegex: /^(https?:\/\/)?(www\.)?youtube\.com\/(c|channel|user)\/[a-zA-Z0-9_-]+\/?$/
    },
    other: {
      name: 'Other',
      icon: <Link2 size={20} />,
      placeholder: 'https://example.com',
      color: 'text-gray-500'
    }
  };

  // Mock data loading - would be replaced with real API call later
  useEffect(() => {
    if (user?.id) {
      // Generate mock data based on the UserLinks schema
      const mockLinks: UserLink[] = [
        { id: '1', userId: user.id, linkTitle: 'github', linkUrl: 'https://github.com/username', isActive: true },
        { id: '2', userId: user.id, linkTitle: 'linkedin', linkUrl: 'https://linkedin.com/in/username', isActive: true },
        { id: '3', userId: user.id, linkTitle: 'twitter', linkUrl: 'https://twitter.com/username', isActive: true }
      ];
      
      setLinks(mockLinks);
    }
  }, [user]);

  const handleLinkChange = (index: number, url: string) => {
    setLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], linkUrl: url };
      return updated;
    });
    
    // Clear error when user starts typing
    if (errors[`link-${index}`]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[`link-${index}`];
        return updated;
      });
    }
    
    setHasChanges(true);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Get list of available platforms that haven't been used yet
  const getAvailablePlatforms = () => {
    const usedPlatforms = new Set(links.map(link => link.linkTitle));
    return Object.keys(platforms).filter(platform => 
      platform !== 'other' && !usedPlatforms.has(platform)
    );
  };

  const handleAddLink = () => {
    const availablePlatforms = getAvailablePlatforms();
    const platform = availablePlatforms.length > 0 ? availablePlatforms[0] : 'other';
    
    const newLink: UserLink = {
      linkTitle: platform,
      linkUrl: '',
      userId: user?.id
    };
    
    setLinks(prev => [...prev, newLink]);
    setHasChanges(true);
  };

  const handleChangePlatform = (index: number, platform: string) => {
    setLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], linkTitle: platform, linkUrl: '' };
      return updated;
    });
    
    setHasChanges(true);
  };

  const validateLinks = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    links.forEach((link, index) => {
      const platform = platforms[link.linkTitle] || platforms.other;
      const url = link.linkUrl;
      
      // Skip validation if URL is empty
      if (!url) {
        newErrors[`link-${index}`] = 'URL is required';
        isValid = false;
        return;
      }
      
      // Validate URL format
      if (platform.validationRegex && !platform.validationRegex.test(url)) {
        newErrors[`link-${index}`] = `Please enter a valid ${platform.name} URL`;
        isValid = false;
      }
      
      // Basic URL validation for all links
      try {
        if (url && !url.match(/^https?:\/\//)) {
          // Add https:// prefix if missing
          setLinks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], linkUrl: `https://${url}` };
            return updated;
          });
        }
      } catch (error) {
        newErrors[`link-${index}`] = `Invalid URL format`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateLinks()) return;
    
    setSaving(true);
    
    // Simulate API call - would be replaced with real implementation later
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Links saved successfully",
        description: "Your social media links have been updated.",
      });
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Failed to save links",
        description: "There was a problem saving your social media links.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = (url: string) => {
    if (!url) return;
    
    let formattedUrl = url;
    if (!url.match(/^https?:\/\//)) {
      formattedUrl = `https://${url}`;
    }
    
    window.open(formattedUrl, '_blank');
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Social Media & Professional Links</h1>
        <p className="text-gray-600 mt-2">
          Connect your social media accounts and professional profiles to showcase your online presence.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {links.map((link, index) => {
              const platform = platforms[link.linkTitle] || platforms.other;
              
              return (
                <div key={link.id || index} className="group relative">
                  <div className="flex items-center mb-2 gap-2">
                    <label 
                      htmlFor={`platform-${index}`}
                      className="text-sm font-medium"
                    >
                      Platform
                    </label>
                    <select
                      id={`platform-${index}`}
                      value={link.linkTitle}
                      onChange={(e) => handleChangePlatform(index, e.target.value)}
                      className="text-sm rounded-md border border-gray-300 py-1 px-2"
                    >
                      {/* Show current platform */}
                      <option value={link.linkTitle}>
                        {platforms[link.linkTitle]?.name || link.linkTitle}
                      </option>
                      
                      {/* Show other available platforms */}
                      {getAvailablePlatforms()
                        .filter(p => p !== link.linkTitle)
                        .map(p => (
                          <option key={p} value={p}>
                            {platforms[p].name}
                          </option>
                        ))}
                      
                      {/* Always include "Other" option */}
                      {link.linkTitle !== 'other' && (
                        <option value="other">Other</option>
                      )}
                    </select>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className={`mr-2 ${platform.color}`}>
                      {platform.icon}
                    </span>
                    <Label 
                      htmlFor={`link-${index}`}
                      className="text-sm font-medium"
                    >
                      {platform.name} URL
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id={`link-${index}`}
                      value={link.linkUrl}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder={platform.placeholder}
                      className={`pr-16 ${errors[`link-${index}`] ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                      {link.linkUrl && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 opacity-70 hover:opacity-100"
                          onClick={() => handlePreview(link.linkUrl)}
                        >
                          <ExternalLink size={16} />
                        </Button>
                      )}
                      
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-70 hover:opacity-100 hover:text-red-500"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {errors[`link-${index}`] && (
                    <div className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors[`link-${index}`]}
                    </div>
                  )}
                </div>
              );
            })}
            
            <div className="flex justify-center mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={handleAddLink}
              >
                <Plus size={16} className="mr-1" />
                Add Another Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-1" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Links
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">About your social links</p>
          <p className="mt-1">Your linked social profiles will be visible to potential co-founders and help build credibility. Link to profiles that showcase your professional work and achievements.</p>
        </div>
      </div>
    </div>
  );
}