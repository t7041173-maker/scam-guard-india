import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface FraudScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const FraudScoreSlider = ({ value, onChange }: FraudScoreSliderProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { 
      level: "Low Risk", 
      color: "text-success", 
      bg: "bg-success",
      gradient: "from-success to-success/80",
      description: "Relatively safe, minimal threat detected"
    };
    if (score <= 70) return { 
      level: "Moderate Risk", 
      color: "text-warning", 
      bg: "bg-warning",
      gradient: "from-warning to-warning/80", 
      description: "Potential threat, exercise caution"
    };
    return { 
      level: "High Risk", 
      color: "text-danger", 
      bg: "bg-danger",
      gradient: "from-danger to-danger/80",
      description: "Significant threat, high probability of fraud"
    };
  };

  const riskInfo = getRiskLevel(value);

  useEffect(() => {
    if (value !== previousValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPreviousValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-card-foreground">Fraud Risk Assessment</label>
        <div className="flex items-center gap-3">
          <div className={`
            text-2xl font-bold transition-smooth transform
            ${isAnimating ? 'scale-110' : 'scale-100'}
            ${riskInfo.color}
          `}>
            {value}
          </div>
          <div className={`
            text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-300 transform
            ${isAnimating ? 'scale-105 animate-pulse-success' : 'scale-100'}
            bg-gradient-to-r ${riskInfo.gradient} text-white shadow-sm
          `}>
            {riskInfo.level}
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Main Slider */}
        <div className="relative">
          <Slider
            value={[value]}
            onValueChange={handleValueChange}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          
          {/* Animated progress indicator */}
          <div 
            className={`
              absolute top-0 h-2 rounded-full transition-all duration-300 ease-out
              bg-gradient-to-r ${riskInfo.gradient}
              ${isAnimating ? 'shadow-lg' : ''}
            `}
            style={{ width: `${value}%` }}
          />
        </div>
        
        {/* Score markers with animations */}
        <div className="flex justify-between text-xs text-muted-foreground mt-3 relative">
          <div className="flex flex-col items-center">
            <span className={`transition-smooth ${value <= 30 ? 'text-success font-medium' : ''}`}>0</span>
            <div className={`w-1 h-1 rounded-full mt-1 transition-smooth ${value <= 30 ? 'bg-success' : 'bg-muted-foreground/30'}`} />
          </div>
          <div className="flex flex-col items-center">
            <span className={`transition-smooth ${value > 30 && value <= 70 ? 'text-warning font-medium' : ''}`}>30</span>
            <div className={`w-1 h-1 rounded-full mt-1 transition-smooth ${value > 30 && value <= 70 ? 'bg-warning' : 'bg-muted-foreground/30'}`} />
          </div>
          <div className="flex flex-col items-center">
            <span className={`transition-smooth ${value > 70 ? 'text-danger font-medium' : ''}`}>70</span>
            <div className={`w-1 h-1 rounded-full mt-1 transition-smooth ${value > 70 ? 'bg-danger' : 'bg-muted-foreground/30'}`} />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">100</span>
            <div className="w-1 h-1 rounded-full mt-1 bg-muted-foreground/30" />
          </div>
        </div>
        
        {/* Risk zone indicators with enhanced styling */}
        <div className="flex justify-between mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-smooth ${value <= 30 ? 'bg-success animate-pulse' : 'bg-success/50'}`}></div>
            <span className={`transition-smooth ${value <= 30 ? 'text-success font-medium' : 'text-muted-foreground'}`}>Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-smooth ${value > 30 && value <= 70 ? 'bg-warning animate-pulse' : 'bg-warning/50'}`}></div>
            <span className={`transition-smooth ${value > 30 && value <= 70 ? 'text-warning font-medium' : 'text-muted-foreground'}`}>Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-smooth ${value > 70 ? 'bg-danger animate-pulse' : 'bg-danger/50'}`}></div>
            <span className={`transition-smooth ${value > 70 ? 'text-danger font-medium' : 'text-muted-foreground'}`}>Danger</span>
          </div>
        </div>
      </div>

      {/* Dynamic description with animation */}
      <div className={`
        text-sm text-center p-3 rounded-xl transition-all duration-300
        ${isAnimating ? 'animate-slide-up' : ''}
        bg-gradient-to-r ${riskInfo.gradient}/10 border border-current/20
        ${riskInfo.color}
      `}>
        {riskInfo.description}
      </div>
    </div>
  );
};