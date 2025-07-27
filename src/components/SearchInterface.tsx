import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Sparkles } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  onAddScam: () => void;
  onFilterByTag: (tag: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchInterface = ({
  onSearch,
  onAddScam,
  onFilterByTag,
  searchQuery,
  setSearchQuery,
}: SearchInterfaceProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSuggestions = [
    "WhatsApp investment scam",
    "fake loan app fraud",
    "UPI payment scam",
    "crypto investment trap",
    "job offer fraud",
    "OTP scam banking",
    "fake government scheme",
    "online shopping fraud"
  ];

  const popularTags = [
    "#JobScam", "#LoanFraud", "#CryptoTrap", "#Phishing", 
    "#UPIFraud", "#FakeApp", "#WhatsAppScam", "#InvestmentFraud"
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Search */}
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search scams naturally: 'WhatsApp investment scam', 'fake loan app'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 h-12 text-base shadow-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            <Button 
              type="submit" 
              variant="search" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Sparkles className="w-4 h-4" />
              Search
            </Button>
          </div>
        </form>

        {/* Auto Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg shadow-elevated mt-1 z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-smooth text-sm border-b border-border/30 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3 h-3 text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Tags */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Popular Categories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
              onClick={() => onFilterByTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Add Scam Button */}
      <div className="flex justify-center">
        <Button variant="secondary" onClick={onAddScam} className="shadow-card">
          <Plus className="w-4 h-4" />
          Add New Scam Report
        </Button>
      </div>
    </div>
  );
};