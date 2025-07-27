import { Badge } from "@/components/ui/badge";

interface PlatformChipProps {
  platform: string;
  selected: boolean;
  onToggle: () => void;
}

export const PlatformChip = ({ platform, selected, onToggle }: PlatformChipProps) => {
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
        cursor-pointer transition-smooth rounded-full px-4 py-2 text-sm font-medium border-2
        ${selected 
          ? 'bg-paypal-blue text-white border-paypal-blue shadow-paypal' 
          : 'bg-card text-card-foreground border-border hover:border-paypal-blue/50 hover:bg-paypal-blue/5'
        }
        flex items-center gap-2
      `}
      onClick={onToggle}
    >
      <span className="text-base">{getPlatformIcon(platform)}</span>
      <span>{platform}</span>
    </Badge>
  );
};