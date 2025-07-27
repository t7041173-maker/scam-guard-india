import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FraudScoreSlider } from "@/components/FraudScoreSlider";
import { TagWithIcon } from "@/components/TagWithIcon";
import { PlatformChip } from "@/components/PlatformChip";
import { HelpTooltip } from "@/components/HelpTooltip";
import { X, Upload, Shield, CheckCircle, AlertCircle, Camera, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddScamFormProps {
  onClose: () => void;
  onSubmit: (scamData: any) => void;
}

export const AddScamForm = ({ onClose, onSubmit }: AddScamFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    evidence: "",
  });
  
  const [fraudScore, setFraudScore] = useState(50);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const availableTags = [
    "#LoanScam", "#Phishing", "#JobScam", "#CryptoTrap", "#FakeOffer",
    "#BankingFraud", "#OTPScam", "#OnlineShoppingScam", "#InvestmentFraud"
  ];

  const platforms = ["WhatsApp", "SMS", "UPI", "Email", "App", "Website"];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag)) {
      const formattedTag = customTag.startsWith('#') ? customTag : `#${customTag}`;
      setSelectedTags(prev => [...prev, formattedTag]);
      setCustomTag("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || selectedTags.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, description, and select at least one tag.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call with enhanced feedback
    setTimeout(() => {
      const scamData = {
        ...formData,
        fraudScore,
        tags: selectedTags,
        platforms: selectedPlatforms,
        submittedAt: new Date().toISOString(),
        status: "pending_review"
      };

      onSubmit(scamData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        toast({
          title: "✅ Scam Report Submitted Successfully",
          description: "Thank you for helping keep our community safe. Your report is being reviewed.",
        });
        
        setIsSubmitting(false);
        onClose();
      }, 1500);
    }, 2000);
  };
  
  const handleImageUpload = () => {
    // Simulate image upload
    setImageUploaded(true);
    setTimeout(() => setImageUploaded(false), 3000);
  };

  const ScamPreviewCard = () => (
    <div className="animate-slide-up">
      <Card className="bg-gradient-card border border-paypal-blue/20 shadow-paypal">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-paypal-blue" />
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
          </div>
          <h3 className="font-semibold text-lg">{formData.title || "Your scam title"}</h3>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              fraudScore >= 70 ? 'bg-danger text-white' : 
              fraudScore >= 30 ? 'bg-warning text-black' : 'bg-success text-white'
            }`}>
              {fraudScore}/100
            </div>
            <span className="text-sm text-muted-foreground">
              {fraudScore >= 70 ? 'High Risk' : fraudScore >= 30 ? 'Moderate Risk' : 'Low Risk'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTags.slice(0, 3).map((tag) => (
                  <TagWithIcon
                    key={tag}
                    tag={tag}
                    selected={true}
                    onToggle={() => {}}
                  />
                ))}
              </div>
            )}
            {selectedPlatforms.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Platforms: </span>
                <span className="text-muted-foreground">{selectedPlatforms.join(", ")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with enhanced animations */}
        <Card className="bg-gradient-card shadow-paypal border-0 animate-fade-in">
          <CardHeader className="text-center relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`p-3 rounded-full transition-all duration-500 ${
                submitSuccess ? 'bg-success/20 animate-pulse-success' : 'bg-paypal-blue/10'
              }`}>
                {submitSuccess ? (
                  <CheckCircle className="w-8 h-8 text-success animate-bounce-in" />
                ) : (
                  <Shield className="w-8 h-8 text-paypal-blue" />
                )}
              </div>
            </div>
            <CardTitle className={`text-2xl font-bold transition-all duration-300 ${
              submitSuccess ? 'text-success' : 'text-card-foreground'
            }`}>
              {submitSuccess ? 'Report Submitted!' : 'Report a Scam'}
            </CardTitle>
            <p className="text-muted-foreground">
              {submitSuccess 
                ? 'Thank you for helping protect our community' 
                : 'Help protect the community by sharing scam details'
              }
            </p>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="absolute top-4 right-4 hover:bg-red-50 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
        </Card>

        {/* Main Form with enhanced styling */}
        <Card className="shadow-paypal border-paypal-blue-light animate-slide-up">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Scam Name with tooltip */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-card-foreground">Scam Name *</label>
                  <HelpTooltip content="Enter a clear, descriptive name for the scam (e.g., 'Fake investment app promising 20% returns')" />
                </div>
                <Input
                  placeholder="e.g., Fake investment app promising 20% returns"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="h-12 rounded-xl border-paypal-blue-light focus:border-paypal-blue focus:ring-paypal-blue/20 transition-all duration-300"
                />
              </div>

              {/* Scam Description with tooltip */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-card-foreground">Detailed Description *</label>
                  <HelpTooltip content="Provide detailed information about how the scam works, what they promise, how they contact victims, etc." />
                </div>
                <Textarea
                  placeholder="Describe how the scam works, what they promise, how they contact victims..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] rounded-xl border-paypal-blue-light focus:border-paypal-blue focus:ring-paypal-blue/20 resize-none transition-all duration-300"
                />
              </div>

              {/* Enhanced Fraud Score Slider */}
              <FraudScoreSlider value={fraudScore} onChange={setFraudScore} />

              {/* Platform Selector with tooltip */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-card-foreground">Platform Used</label>
                  <HelpTooltip content="Select all platforms where this scam was encountered" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <PlatformChip
                      key={platform}
                      platform={platform}
                      selected={selectedPlatforms.includes(platform)}
                      onToggle={() => handlePlatformToggle(platform)}
                    />
                  ))}
                </div>
              </div>

              {/* Location with tooltip */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-card-foreground">Location</label>
                  <HelpTooltip content="Select the state where this scam was reported" />
                </div>
                <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger className="h-12 rounded-xl border-paypal-blue-light focus:border-paypal-blue transition-all duration-300">
                    <SelectValue placeholder="Select state or city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Attach Proof */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-card-foreground">Attach Proof</label>
                  <HelpTooltip content="Add evidence like news articles, screenshots, or other supporting documents" />
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="Paste link to evidence or news article"
                    value={formData.evidence}
                    onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
                    className="flex-1 h-12 rounded-xl border-paypal-blue-light focus:border-paypal-blue transition-all duration-300"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleImageUpload}
                    className={`h-12 px-4 rounded-xl border-paypal-blue-light transition-all duration-300 ${
                      imageUploaded ? 'bg-success/10 border-success text-success' : ''
                    }`}
                  >
                    {imageUploaded ? <CheckCircle className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Enhanced Tags with tooltips */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-card-foreground">Categories * (Select all that apply)</label>
                  <HelpTooltip content="Choose tags that best describe this scam type. Multiple selections help others find similar threats." />
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <TagWithIcon
                      key={tag}
                      tag={tag}
                      selected={selectedTags.includes(tag)}
                      onToggle={() => handleTagToggle(tag)}
                      showRemove={selectedTags.includes(tag)}
                      onRemove={() => handleTagToggle(tag)}
                    />
                  ))}
                </div>
                
                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    className="flex-1 h-10 rounded-xl border-paypal-blue-light"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCustomTag} className="rounded-xl">
                    Add
                  </Button>
                </div>
              </div>

              {/* Enhanced Preview Toggle */}
              <div className="flex items-center justify-center pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-paypal-blue hover:bg-paypal-blue/10 transition-all duration-300 hover:scale-105"
                >
                  {showPreview ? '👁️ Hide Preview' : '👀 Show Preview'}
                </Button>
              </div>

              {/* Animated Preview Card */}
              {showPreview && <ScamPreviewCard />}

              {/* Enhanced Submit Button with success animation */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || submitSuccess}
                  className={`
                    w-full h-14 text-base font-semibold rounded-xl transition-all duration-500 transform
                    ${submitSuccess 
                      ? 'bg-success text-success-foreground animate-pulse-success' 
                      : 'bg-gradient-primary shadow-paypal hover:opacity-90 hover:scale-105 active:scale-95'
                    }
                    ${isSubmitting ? 'animate-pulse' : ''}
                    disabled:opacity-50 disabled:scale-100
                  `}
                >
                  {submitSuccess ? (
                    <div className="flex items-center gap-2 animate-fade-in">
                      <CheckCircle className="w-6 h-6 animate-bounce-in" />
                      <span>Report Submitted Successfully!</span>
                    </div>
                  ) : isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Report...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span>Submit Scam Report</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <Card className="bg-paypal-blue/5 border-paypal-blue/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-paypal-blue mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-card-foreground">Safety First</p>
                <p className="text-muted-foreground">
                  Never share personal information like passwords, OTPs, or bank details in this form. 
                  This platform is for educational awareness only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};