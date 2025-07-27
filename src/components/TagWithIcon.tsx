import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagWithIconProps {
  tag: string;
  selected: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const TagWithIcon = ({ tag, selected, onToggle, onRemove, showRemove = false }: TagWithIconProps) => {
  const getTagStyle = (tagName: string) => {
    const tagLower = tagName.toLowerCase();
    if (tagLower.includes('loan') || tagLower.includes('lending')) {
      return {
        icon: '🧾',
        bgClass: selected ? 'bg-tag-loan text-white' : 'bg-tag-loan/10 text-tag-loan border-tag-loan/20',
        hoverClass: 'hover:bg-tag-loan hover:text-white'
      };
    }
    if (tagLower.includes('phishing') || tagLower.includes('fake')) {
      return {
        icon: '🎣',
        bgClass: selected ? 'bg-tag-phishing text-black' : 'bg-tag-phishing/10 text-tag-phishing border-tag-phishing/20',
        hoverClass: 'hover:bg-tag-phishing hover:text-black'
      };
    }
    if (tagLower.includes('job') || tagLower.includes('employment')) {
      return {
        icon: '💼',
        bgClass: selected ? 'bg-tag-job text-white' : 'bg-tag-job/10 text-tag-job border-tag-job/20',
        hoverClass: 'hover:bg-tag-job hover:text-white'
      };
    }
    if (tagLower.includes('crypto') || tagLower.includes('bitcoin') || tagLower.includes('investment')) {
      return {
        icon: '🪙',
        bgClass: selected ? 'bg-tag-crypto text-white' : 'bg-tag-crypto/10 text-tag-crypto border-tag-crypto/20',
        hoverClass: 'hover:bg-tag-crypto hover:text-white'
      };
    }
    if (tagLower.includes('offer') || tagLower.includes('deal') || tagLower.includes('shopping')) {
      return {
        icon: '🛍️',
        bgClass: selected ? 'bg-tag-fake-offer text-white' : 'bg-tag-fake-offer/10 text-tag-fake-offer border-tag-fake-offer/20',
        hoverClass: 'hover:bg-tag-fake-offer hover:text-white'
      };
    }
    
    // Default style
    return {
      icon: '🏷️',
      bgClass: selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary border-primary/20',
      hoverClass: 'hover:bg-primary hover:text-primary-foreground'
    };
  };

  const tagStyle = getTagStyle(tag);

  return (
    <Badge
      variant="outline"
      className={`
        cursor-pointer transition-smooth border rounded-full px-3 py-1.5 text-sm font-medium
        ${tagStyle.bgClass} ${tagStyle.hoverClass}
        ${selected ? 'shadow-sm' : ''}
        flex items-center gap-2 max-w-fit
      `}
      onClick={onToggle}
    >
      <span className="text-base">{tagStyle.icon}</span>
      <span>{tag}</span>
      {showRemove && selected && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-smooth"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
};