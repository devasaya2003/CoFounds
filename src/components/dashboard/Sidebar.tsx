import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  href?: string; // Optional direct href if needed
}

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  menuItems: MenuItem[];
  title?: string; // Optional title for the sidebar
}

export default function Sidebar({ activeView, onViewChange, menuItems, title = "Cofounds" }: SidebarProps) {
  return (
    <aside className="bg-white w-64 shadow-md hidden md:block">
      <div className="h-16 flex items-center justify-center">
        <span className="text-xl font-display font-bold text-gradient">{title}</span>
      </div>
      <nav className="mt-5">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full text-left px-6 py-3 hover:bg-gray-100 ${
                  activeView === item.id 
                    ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700" 
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}