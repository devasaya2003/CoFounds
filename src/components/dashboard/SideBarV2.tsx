'use client';

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  subItems?: SubMenuItem[];
}

interface SideBarV2Props {
  activeView: string;
  activeSubView?: string;
  onViewChange: (view: string, subView?: string) => void;
  menuItems: MenuItem[];
  title?: string;
}

export default function SideBarV2({ 
  activeView, 
  activeSubView, 
  onViewChange, 
  menuItems, 
  title = "Cofounds" 
}: SideBarV2Props) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    profile: true, // Default expanded for profile section
  });

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <aside className="bg-white w-64 shadow-md hidden md:block flex flex-col h-full">
      <div className="h-14 flex items-center justify-center">
        <span className="text-xl font-display font-bold text-gradient">{title}</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {menuItems.map(item => (
            <div key={item.id} className="py-1">
              {/* Main menu item */}
              <button
                onClick={() => {
                  if (item.subItems?.length) {
                    toggleExpand(item.id);
                  } else {
                    onViewChange(item.id);
                  }
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeView === item.id
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100",
                  item.subItems?.length ? "cursor-pointer" : ""
                )}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </div>

                {item.subItems?.length && (
                  <span className="ml-auto">
                    {expandedItems[item.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
              </button>

              {/* Sub items */}
              {item.subItems?.length && expandedItems[item.id] && (
                <div className="mt-1 pl-6 space-y-1">
                  {item.subItems.map(subItem => (
                    <button
                      key={subItem.id}
                      onClick={() => onViewChange(item.id, subItem.id)}
                      className={cn(
                        "w-full flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                        activeView === item.id && activeSubView === subItem.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      )}
                    >
                      {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
