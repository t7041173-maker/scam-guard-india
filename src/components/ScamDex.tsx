import React, { useState, useEffect } from 'react';
import { SearchInterface } from './SearchInterface';
import { ScamCard } from './ScamCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, Database, TrendingUp, AlertTriangle, X, Loader2 } from 'lucide-react';
import { Scam, searchScams, filterScamsByTags, filterScamsByFraudScore, sortScams, getScamStats, getTrendingScams, ALL_TAGS } from '../data/mockScams';
import { apiService, ScamStats } from '../services/api';
import { useToast } from '../hooks/use-toast';

export const ScamDex: React.FC = () => {
  const [scams, setScams] = useState<Scam[]>([]);
  const [filteredScams, setFilteredScams] = useState<Scam[]>([]);
  const [stats, setStats] = useState<ScamStats>({
    totalScams: 0,
    highRiskScams: 0,
    totalViews: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [severityRange, setSeverityRange] = useState({ min: 1, max: 10 });
  const [sortBy, setSortBy] = useState<'date' | 'fraudScore' | 'title'>('date');
  const { toast } = useToast();

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch scams and stats in parallel
        const [scamsResponse, statsResponse] = await Promise.all([
          apiService.getScams(),
          apiService.getScamStats()
        ]);
        
        setScams(scamsResponse.scams);
        setStats(statsResponse);
        setFilteredScams(scamsResponse.scams);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load scam data. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load scam data. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = scams;

    // Apply search
    if (searchQuery) {
      filtered = searchScams(filtered, searchQuery);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filterScamsByTags(filtered, selectedTags);
    }

    // Apply fraud score filter
    filtered = filterScamsByFraudScore(filtered, severityRange.min * 10, severityRange.max * 10);

    // Apply sorting
    filtered = sortScams(filtered, sortBy);

    setFilteredScams(filtered);
  }, [scams, searchQuery, selectedTags, severityRange, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSeverityRange({ min: 1, max: 10 });
    setSortBy('date');
  };

  const handleReportSimilar = (scamId: string) => {
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting a similar scam. Our team will review it.",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-sm">
                <Shield className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  ScamDex 2.0
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Smart Scam Search Engine for India
                </p>
              </div>
            </div>
            {/* Removed dark mode toggle button */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-lg text-muted-foreground">Loading scam data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-danger mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Data</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
            {/* Search Interface */}
            <SearchInterface 
              onSearch={handleSearch}
              onTagSelect={handleTagSelect}
              selectedTags={selectedTags}
              allTags={ALL_TAGS}
            />

            {/* Active Filters */}
            {(searchQuery || selectedTags.length > 0 || severityRange.min > 1 || severityRange.max < 10) && (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm text-muted-foreground font-medium">Active Filters:</span>
                
                {searchQuery && (
                  <Badge className="bg-primary text-primary-foreground">
                    Search: "{searchQuery}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-primary-foreground hover:text-primary-foreground"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                
                {selectedTags.map(tag => (
                  <Badge key={tag} className="bg-muted text-muted-foreground">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleTagSelect(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                
                {(severityRange.min > 1 || severityRange.max < 10) && (
                  <Badge className="bg-gray-100 text-gray-700">
                    Severity: {severityRange.min}-{severityRange.max}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-gray-600 hover:text-gray-800"
                      onClick={() => setSeverityRange({ min: 1, max: 10 })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-paypal-blue"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Results Summary */}
            <div className="mb-8">
              <p className="text-gray-600 font-medium">
                Showing {filteredScams.length} of {scams.length} scams
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { key: 'date', label: 'Latest' },
                  { key: 'fraudScore', label: 'Fraud Score' },
                  { key: 'title', label: 'Title' }
                ].map(option => (
                  <Button
                    key={option.key}
                    variant={sortBy === option.key ? 'default' : 'outline'}
                    size="sm"
                    className={sortBy === option.key ? 'bg-gradient-paypal text-white' : ''}
                    onClick={() => setSortBy(option.key as any)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Scam Cards Grid */}
            {filteredScams.length > 0 ? (
              <div className="grid gap-8">
                {filteredScams.map((scam) => (
                  <ScamCard
                    key={scam.id}
                    scam={scam}
                    onReportSimilar={handleReportSimilar}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="text-gray-400 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No scams found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button 
                  className="bg-gradient-paypal hover:bg-paypal-blue-dark text-white px-6 py-3 rounded-xl"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Trending Scams Section */}
            {filteredScams.length === scams.length && (
              <div className="mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Trending Scams</h2>
                <div className="grid gap-6">
                  {getTrendingScams(scams, 3).map((scam) => (
                    <ScamCard
                      key={scam.id}
                      scam={scam}
                      onReportSimilar={handleReportSimilar}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium mb-2">
              ScamDex 2.0 - Protecting India from Scams
            </p>
            <p className="text-xs text-gray-500">
              Data sourced from verified reports and official sources
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};