import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, AlertTriangle, ExternalLink, Flag, MapPin, Eye, MessageSquare, Calendar } from 'lucide-react';
import { Scam, getFraudLevel } from '../data/mockScams';

interface ScamCardProps {
  scam: Scam;
  onReportSimilar?: (scamId: string) => void;
}

export const ScamCard: React.FC<ScamCardProps> = ({ scam, onReportSimilar }) => {
  const fraudLevel = getFraudLevel(scam.fraudScore);

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 border-gray-100 hover:border-paypal-blue/30 shadow-card bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-paypal-blue transition-colors">
              {scam.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Fraud Score: {scam.fraudScore}/100
            </p>
          </div>
          
          {/* Fraud Score Badge */}
          <Badge 
            className={`px-4 py-2 rounded-xl text-sm font-bold shadow-soft ${fraudLevel.bgColor} text-white`}
          >
            {scam.fraudScore}/100
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {scam.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="bg-purple-500/10 text-purple-600 border-purple-500/30 px-3 py-1 rounded-lg shadow-soft"
            >
              {tag}
            </Badge>
          ))}
          {scam.tags.length > 3 && (
            <Badge variant="outline" className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
              +{scam.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div>
          <p className="text-gray-700 leading-relaxed">
            {scam.summary}
          </p>
        </div>

        {/* Risk Level Indicator */}
        <div className="flex items-center gap-3">
          <Shield className="text-gray-600 w-5 h-5" />
          <span className="text-sm font-semibold text-gray-700">Risk Level:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${fraudLevel.bgColor}`}
              style={{ width: `${scam.fraudScore}%` }}
            />
          </div>
          <span className={`text-sm font-bold ${fraudLevel.color}`}>
            {fraudLevel.level}
          </span>
        </div>

        {/* Detection Tips */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-paypal-blue w-5 h-5" />
            <span className="text-base font-semibold text-gray-700">Detection Tips</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {scam.detectionTips.map((tip, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-paypal-blue mt-1 text-lg">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform & Origin */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700">Platforms:</span>
          {scam.platform.map((platform) => (
            <Badge key={platform} variant="outline" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
              {platform}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="text-gray-500 w-4 h-4" />
          <span className="text-gray-600 text-sm">
            <span className="font-semibold">Regions:</span> {scam.regions.join(', ')}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(scam.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Verified
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Fraud Score:</span>
            <span className="text-sm font-medium text-gray-700">{scam.fraudScore}/100</span>
          </div>
          
          <div className="flex gap-2">
            {scam.sourceUrls && scam.sourceUrls.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gray-100 text-gray-600 hover:text-paypal-blue"
                asChild
              >
                <a href={scam.sourceUrls[0]} target="_blank" rel="noopener noreferrer" className="underline">
                  <ExternalLink className="mr-1 w-4 h-4" />
                  Source
                </a>
              </Button>
            )}
            
            <Button 
              size="sm"
              className="bg-gradient-paypal hover:bg-paypal-blue-dark text-white px-4 py-2 rounded-xl shadow-soft"
              onClick={() => onReportSimilar?.(scam._id || scam.id || '')}
            >
              <Flag className="mr-2 w-4 h-4" />
              Report Similar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};