import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddScamFormProps {
  onClose: () => void;
  onSubmit: (scamData: any) => void;
}

export const AddScamForm = ({ onClose, onSubmit }: AddScamFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "",
    evidence: "",
    location: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const availableTags = [
    "#JobScam", "#LoanFraud", "#CryptoTrap", "#Phishing", 
    "#UPIFraud", "#FakeApp", "#WhatsAppScam", "#InvestmentFraud",
    "#OTPScam", "#BankingFraud", "#OnlineShoppingScam", "#RealEstateFraud"
  ];

  const platforms = [
    "WhatsApp", "Telegram", "Facebook", "Instagram", "SMS", 
    "Email", "Phone Call", "Mobile App", "Website", "UPI Apps"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag)) {
      const formattedTag = customTag.startsWith('#') ? customTag : `#${customTag}`;
      setSelectedTags(prev => [...prev, formattedTag]);
      setCustomTag("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || selectedTags.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, description, and select at least one tag.",
        variant: "destructive",
      });
      return;
    }

    const scamData = {
      ...formData,
      tags: selectedTags,
      submittedAt: new Date().toISOString(),
      status: "pending_review"
    };

    onSubmit(scamData);
    toast({
      title: "Scam Report Submitted",
      description: "Thank you for helping the community stay safe. Your report is being reviewed.",
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Report a New Scam</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Scam Title*</label>
            <Input
              placeholder="e.g., Fake investment app promising 20% returns"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Detailed Description*</label>
            <Textarea
              placeholder="Describe how the scam works, what they promise, how they contact victims, etc."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Tags Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Categories* (Select all that apply)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="flex-1 border-border/50"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddCustomTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="text-sm font-medium mb-2 block">Platform Used</label>
            <Input
              placeholder="e.g., WhatsApp, Telegram, Mobile App"
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              className="border-border/50 focus:border-primary/50"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {platforms.slice(0, 6).map((platform) => (
                <Badge
                  key={platform}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-muted transition-smooth"
                  onClick={() => setFormData(prev => ({ ...prev, platform }))}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Evidence/Source */}
          <div>
            <label className="text-sm font-medium mb-2 block">Evidence or Source Link</label>
            <Input
              placeholder="Link to news article, screenshot, or other evidence"
              value={formData.evidence}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
              className="border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium mb-2 block">Location (Optional)</label>
            <Input
              placeholder="State or city where this scam was reported"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="search" className="flex-1">
              <Upload className="w-4 h-4" />
              Submit Report
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};