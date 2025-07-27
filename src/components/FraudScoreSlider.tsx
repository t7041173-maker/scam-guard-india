import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface FraudScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const FraudScoreSlider = ({ value, onChange }: FraudScoreSliderProps) => {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: "Low Risk", color: "text-success", bg: "bg-success" };
    if (score <= 70) return { level: "Moderate Risk", color: "text-warning", bg: "bg-warning" };
    return { level: "High Risk", color: "text-danger", bg: "bg-danger" };
  };

  const riskInfo = getRiskLevel(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-card-foreground">Fraud Score</label>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${riskInfo.color}`}>
            {value}/100
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${riskInfo.bg} text-white`}>
            {riskInfo.level}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
        
        {/* Score markers */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0</span>
          <span>30</span>
          <span>70</span>
          <span>100</span>
        </div>
        
        {/* Risk zone indicators */}
        <div className="flex mt-1 text-xs gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Safe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-danger"></div>
            <span className="text-muted-foreground">Dangerous</span>
          </div>
        </div>
      </div>
    </div>
  );
};