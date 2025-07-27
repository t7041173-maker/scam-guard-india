import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PlatformChipProps {
  platform: string;
  selected: boolean;
  onToggle: () => void;
}

export const PlatformChip = ({ platform, selected, onToggle }: PlatformChipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'whatsapp': return '💬';
      case 'sms': return '📱';
      case 'upi': return '💳';
      case 'email': return '📧';
      case 'app': return '📲';
      case 'website': return '🌐';
      case 'telegram': return '✈️';
      case 'instagram': return '📷';
      case 'facebook': return '👥';
      default: return '🔗';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`
        cursor-pointer transition-all duration-300 ease-out rounded-full px-5 py-2.5 text-sm font-medium border-2
        transform hover:scale-105 active:scale-95
        ${selected 
          ? 'bg-paypal-blue text-white border-paypal-blue shadow-paypal ring-2 ring-paypal-blue/20 ring-offset-2' 
          : 'bg-card text-card-foreground border-border hover:border-paypal-blue/50 hover:bg-paypal-blue/5 hover:shadow-sm'
        }
        ${isHovered && !selected ? 'animate-shimmer bg-gradient-to-r from-transparent via-paypal-blue/5 to-transparent' : ''}
        flex items-center gap-2.5
      `}
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text-lg transition-transform duration-300 ${selected ? 'animate-bounce' : ''}`}>
        {getPlatformIcon(platform)}
      </span>
      <span className="font-semibold">{platform}</span>
      {selected && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
    </Badge>
  );
};