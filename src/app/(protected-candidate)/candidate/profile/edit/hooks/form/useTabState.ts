import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VALID_TABS } from "../../components/types";

export function useTabState(defaultTab: string, hasUnsavedChanges: boolean) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams?.get('tab');
  const isValidTab = tabParam && VALID_TABS.includes(tabParam);
  const hasInitializedTab = useRef<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>(
    isValidTab && tabParam ? tabParam : defaultTab
  );

  // Initialize tab based on URL or default
  useEffect(() => {
    if (hasInitializedTab.current) return;

    if (isValidTab && tabParam) {
      setActiveTab(tabParam);
    } else if (!isValidTab && !hasInitializedTab.current) {
      router.push(`/candidate/profile/edit?tab=${defaultTab}`);
    }

    hasInitializedTab.current = true;
  }, [defaultTab, isValidTab, router, tabParam]);

  // Handle tab change with unsaved changes protection
  const handleTabChange = useCallback((value: string) => {
    if (hasUnsavedChanges) {
      return false; // Let parent component handle showing warning
    }

    // Only update active tab locally if already on the path
    setActiveTab(value);
    
    // Only update URL if necessary to minimize re-renders
    if (value !== tabParam) {
      // Use a more controlled approach to URL updates
      const url = new URL(window.location.href);
      url.searchParams.set('tab', value);
      
      // Use history.replaceState to avoid full navigation
      window.history.replaceState({}, '', url.toString());
    }
    
    return true; // Tab change succeeded
  }, [hasUnsavedChanges, tabParam]);

  return {
    activeTab,
    setActiveTab,
    handleTabChange
  };
}