import React, { useState, useEffect, useCallback } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { TagWithIcon } from './TagWithIcon';
import { Scam } from '../data/mockScams';
import { apiService } from '../services/api';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
  allTags: string[];
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  onTagSelect,
  selectedTags,
  allTags
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Scam[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim().length >= 2) {
            setIsSearching(true);
            try {
              const results = await apiService.searchScams(query, 10);
              setSearchResults(results);
              setShowResults(true);
            } catch (error) {
              console.error('Search failed:', error);
              setSearchResults([]);
            } finally {
              setIsSearching(false);
            }
          } else {
            setSearchResults([]);
            setShowResults(false);
          }
        }, 300); // 300ms debounce
      };
    })(),
    []
  );

  // Handle search input changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowResults(false);
    }
  };

  const handleResultClick = (scam: Scam) => {
    setSearchQuery(scam.title);
    setShowResults(false);
    onSearch(scam.title);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const popularTags = [
    'PonziScheme', 'Phishing', 'LoanFraud', 'UPIFraud', 
    'JobScam', 'CryptoTrap', 'BankingFraud', 'RomanceFraud', 'DigitalArrest'
  ];

  return (
    <div className="space-y-8">
      {/* Main Search */}
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search scams naturally: 'WhatsApp investment scam', 'fake loan app'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-14 text-base shadow-soft border-purple-500 focus:border-paypal-blue focus:ring-paypal-blue/20 rounded-2xl bg-purple-50"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button 
              type="submit" 
              variant="default" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-paypal hover:bg-paypal-blue-dark text-white px-6 py-2 rounded-xl shadow-soft"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Search
            </Button>
          </div>
        </form>

        {/* Real-time Search Results */}
        {showResults && (searchResults.length > 0 || isSearching) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((scam) => (
                  <div
                    key={scam._id}
                    onClick={() => handleResultClick(scam)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{scam.title}</div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {scam.summary}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {scam.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Popular Categories
        </h3>
        <div className="flex flex-wrap gap-3">
          {popularTags.map((tag) => (
            <TagWithIcon
              key={tag}
              tag={tag}
              selected={selectedTags.includes(tag)}
              onToggle={() => onTagSelect(tag)}
            />
          ))}
        </div>
      </div>

      {/* Add Scam Button */}
      <div className="pt-4">
        <Button 
          className="bg-gradient-paypal hover:bg-paypal-blue-dark text-white px-8 py-3 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="mr-2 w-5 h-5" />
          + Add New Scam Report
        </Button>
      </div>
    </div>
  );
};