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
    if (tagLower.includes('loan') || tagLower.includes('lending')) {
      return {
        icon: '🧾',
        bgClass: selected ? 'bg-tag-loan text-white border-tag-loan' : 'bg-tag-loan/10 text-tag-loan border-tag-loan/30',
        hoverClass: 'hover:bg-tag-loan hover:text-white hover:border-tag-loan',
        shadowClass: selected ? 'shadow-lg shadow-tag-loan/25' : ''
      };
    }
    if (tagLower.includes('phishing') || tagLower.includes('fake')) {
      return {
        icon: '🎣',
        bgClass: selected ? 'bg-tag-phishing text-black border-tag-phishing' : 'bg-tag-phishing/10 text-tag-phishing border-tag-phishing/30',
        hoverClass: 'hover:bg-tag-phishing hover:text-black hover:border-tag-phishing',
        shadowClass: selected ? 'shadow-lg shadow-tag-phishing/25' : ''
      };
    }
    if (tagLower.includes('job') || tagLower.includes('employment')) {
      return {
        icon: '💼',
        bgClass: selected ? 'bg-tag-job text-white border-tag-job' : 'bg-tag-job/10 text-tag-job border-tag-job/30',
        hoverClass: 'hover:bg-tag-job hover:text-white hover:border-tag-job',
        shadowClass: selected ? 'shadow-lg shadow-tag-job/25' : ''
      };
    }
    if (tagLower.includes('crypto') || tagLower.includes('bitcoin') || tagLower.includes('investment')) {
      return {
        icon: '🪙',
        bgClass: selected ? 'bg-tag-crypto text-white border-tag-crypto' : 'bg-tag-crypto/10 text-tag-crypto border-tag-crypto/30',
        hoverClass: 'hover:bg-tag-crypto hover:text-white hover:border-tag-crypto',
        shadowClass: selected ? 'shadow-lg shadow-tag-crypto/25' : ''
      };
    }
    if (tagLower.includes('offer') || tagLower.includes('deal') || tagLower.includes('shopping')) {
      return {
        icon: '🛍️',
        bgClass: selected ? 'bg-tag-fake-offer text-white border-tag-fake-offer' : 'bg-tag-fake-offer/10 text-tag-fake-offer border-tag-fake-offer/30',
        hoverClass: 'hover:bg-tag-fake-offer hover:text-white hover:border-tag-fake-offer',
        shadowClass: selected ? 'shadow-lg shadow-tag-fake-offer/25' : ''
      };
    }
    
    // Default style
    return {
      icon: '🏷️',
      bgClass: selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-primary/10 text-primary border-primary/30',
      hoverClass: 'hover:bg-primary hover:text-primary-foreground hover:border-primary',
      shadowClass: selected ? 'shadow-lg shadow-primary/25' : ''
    };
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