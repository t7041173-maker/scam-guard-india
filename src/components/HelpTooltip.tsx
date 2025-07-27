import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 animate-fade-in">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

interface HelpTooltipProps {
  content: string;
}

export const HelpTooltip = ({ content }: HelpTooltipProps) => {
  return (
    <Tooltip content={content}>
      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-paypal-blue transition-smooth cursor-help" />
    </Tooltip>
  );
};