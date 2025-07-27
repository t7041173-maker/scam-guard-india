import { useState } from "react";
import { SearchInterface } from "./SearchInterface";
import { ScamCard } from "./ScamCard";
import { AddScamForm } from "./AddScamForm";
import { mockScams, searchScams, filterScamsByTag, type Scam } from "@/data/mockScams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Database, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ScamDex = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredScams, setFilteredScams] = useState<Scam[]>(mockScams);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    const results = searchScams(query);
    setFilteredScams(results);
    setActiveFilter(null);
    
    if (results.length === 0) {
      toast({
        title: "No Results Found",
        description: "Try different keywords or check our popular categories.",
      });
    }
  };

  const handleFilterByTag = (tag: string) => {
    const results = filterScamsByTag(tag);
    setFilteredScams(results);
    setActiveFilter(tag);
    setSearchQuery("");
  };

  const handleAddScam = () => {
    setShowAddForm(true);
  };

  const handleSubmitScam = (scamData: any) => {
    // In a real app, this would submit to a backend
    console.log("New scam submitted:", scamData);
  };

  const handleReportSimilar = () => {
    toast({
      title: "Report Similar Scam",
      description: "Thank you for helping keep the community safe. Your report has been submitted.",
    });
  };

  const clearFilters = () => {
    setFilteredScams(mockScams);
    setActiveFilter(null);
    setSearchQuery("");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const stats = {
    totalScams: mockScams.length,
    highRiskScams: mockScams.filter(s => s.fraudScore >= 80).length,
    verifiedReports: mockScams.filter(s => s.verifiedSource).length,
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <AddScamForm 
            onClose={() => setShowAddForm(false)}
            onSubmit={handleSubmitScam}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ScamDex 2.0
                  </h1>
                  <p className="text-sm text-muted-foreground">Smart Scam Search Engine for India</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.totalScams}</p>
                <p className="text-sm text-muted-foreground">Total Scams Tracked</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-danger" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.highRiskScams}</p>
                <p className="text-sm text-muted-foreground">High Risk Alerts</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{stats.verifiedReports}</p>
                <p className="text-sm text-muted-foreground">Verified Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <SearchInterface
            onSearch={handleSearch}
            onAddScam={handleAddScam}
            onFilterByTag={handleFilterByTag}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Active Filters */}
        {(activeFilter || searchQuery) && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilter && (
              <Badge variant="default" className="gap-2">
                {activeFilter}
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="gap-2">
                Search: "{searchQuery}"
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredScams.length} scam{filteredScams.length !== 1 ? 's' : ''}
            {activeFilter && ` in ${activeFilter}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Scam Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScams.map((scam) => (
            <ScamCard
              key={scam.id}
              title={scam.title}
              type={scam.type}
              tags={scam.tags}
              detectionTips={scam.detectionTips}
              fraudScore={scam.fraudScore}
              platform={scam.platform}
              origin={scam.origin}
              verifiedSource={scam.verifiedSource}
              onReport={handleReportSimilar}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredScams.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Scams Found</h3>
            <p className="text-muted-foreground mb-4">
              No scams match your search criteria. Try different keywords or explore our categories.
            </p>
            <Button variant="secondary" onClick={clearFilters}>
              View All Scams
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ScamDex 2.0 - Protecting India from digital fraud through community awareness
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Report suspicious activities • Stay vigilant • Share knowledge
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};