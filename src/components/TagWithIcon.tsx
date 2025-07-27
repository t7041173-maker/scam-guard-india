import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface TagWithIconProps {
  tag: string;
  selected: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const TagWithIcon = ({ tag, selected, onToggle, onRemove, showRemove = false }: TagWithIconProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const getTagStyle = (tagName: string) => {
    const tagLower = tagName.toLowerCase();
    
    // All tags now use purple blue color scheme
    const purpleStyle = {
      icon: '🏷️',
      bgClass: selected ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      hoverClass: 'hover:bg-purple-500 hover:text-white hover:border-purple-500',
      shadowClass: selected ? 'shadow-lg shadow-purple-500/25' : ''
    };

    // Assign specific icons based on tag type
    if (tagLower.includes('loan') || tagLower.includes('lending')) {
      return { ...purpleStyle, icon: '🧾' };
    }
    if (tagLower.includes('phishing') || tagLower.includes('fake')) {
      return { ...purpleStyle, icon: '🎣' };
    }
    if (tagLower.includes('job') || tagLower.includes('employment')) {
      return { ...purpleStyle, icon: '💼' };
    }
    if (tagLower.includes('crypto') || tagLower.includes('bitcoin') || tagLower.includes('investment')) {
      return { ...purpleStyle, icon: '🪙' };
    }
    if (tagLower.includes('whatsapp')) {
      return { ...purpleStyle, icon: '💬' };
    }
    if (tagLower.includes('upi')) {
      return { ...purpleStyle, icon: '💳' };
    }
    if (tagLower.includes('offer') || tagLower.includes('deal') || tagLower.includes('shopping')) {
      return { ...purpleStyle, icon: '🛍️' };
    }
    
    // Default style
    return purpleStyle;
  };

  const tagStyle = getTagStyle(tag);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle();
  };

  return (
    <Badge
      variant="outline"
      className={`
        cursor-pointer transition-all duration-300 ease-out border-2 rounded-full px-4 py-2 text-sm font-medium
        ${tagStyle.bgClass} ${tagStyle.hoverClass} ${tagStyle.shadowClass}
        ${isAnimating ? 'animate-bounce-in scale-105' : 'scale-100'}
        ${selected ? 'ring-2 ring-offset-2 ring-current/20' : ''}
        flex items-center gap-2 max-w-fit
        hover:scale-105 active:scale-95
        transform-gpu
      `}
      onClick={handleClick}
    >
      <span className={`text-base transition-transform duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
        {tagStyle.icon}
      </span>
      <span className="font-medium">{tag}</span>
      {showRemove && selected && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/20 rounded-full p-1 transition-all duration-200 hover:scale-110"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
};