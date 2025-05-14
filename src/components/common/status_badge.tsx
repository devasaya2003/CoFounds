interface StatusBadgeProps {
    label: string;
    count: number;
    color: 'blue' | 'orange' | 'gray' | 'red' | 'green';
  }
  
  export default function StatusBadge({ label, count, color }: StatusBadgeProps) {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      orange: "bg-orange-100 text-orange-800",
      gray: "bg-gray-100 text-gray-800",
      red: "bg-red-100 text-red-800",
      green: "bg-green-100 text-green-800",
    };
    
    return (
      <div className={`rounded-lg px-2 py-1 text-center ${colorClasses[color]}`}>
        <div className="text-xs font-medium">{label}</div>
        <div className="text-sm font-semibold">{count}</div>
      </div>
    );
  }