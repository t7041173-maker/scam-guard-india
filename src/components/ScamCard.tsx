import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Shield, AlertTriangle, MapPin, Flag } from "lucide-react";

interface ScamCardProps {
  title: string;
  type: string;
  tags: string[];
  detectionTips: string[];
  fraudScore: number;
  platform: string[];
  origin?: string;
  verifiedSource?: string;
  onReport: () => void;
}

export const ScamCard = ({
  title,
  type,
  tags,
  detectionTips,
  fraudScore,
  platform,
  origin,
  verifiedSource,
  onReport,
}: ScamCardProps) => {
  const getFraudLevel = (score: number) => {
    if (score >= 80) return { level: "High Risk", variant: "danger", bg: "bg-gradient-danger" };
    if (score >= 60) return { level: "Medium Risk", variant: "warning", bg: "bg-gradient-warning" };
    return { level: "Low Risk", variant: "success", bg: "bg-gradient-success" };
  };

  const riskInfo = getFraudLevel(fraudScore);

  return (
    <Card className="group hover:shadow-elevated transition-smooth border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-smooth">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{type}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${riskInfo.bg} text-white`}>
            {fraudScore}/100
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground cursor-pointer transition-smooth">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Risk Level Indicator */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{riskInfo.level}</span>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${riskInfo.bg}`}
              style={{ width: `${fraudScore}%` }}
            />
          </div>
        </div>

        {/* Detection Tips */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium">Detection Tips</span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {detectionTips.slice(0, 3).map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform & Origin */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Platform:</span>
            <span className="text-muted-foreground">{platform.join(", ")}</span>
          </div>
          {origin && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{origin}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {verifiedSource && (
              <Button variant="ghost" size="sm" asChild>
                <a href={verifiedSource} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                  Source
                </a>
              </Button>
            )}
          </div>
          <Button variant="report" size="sm" onClick={onReport}>
            <Flag className="w-3 h-3" />
            Report Similar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};