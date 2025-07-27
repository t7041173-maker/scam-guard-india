export interface Scam {
  _id?: string;
  id?: string;
  title: string;
  summary: string; // Changed from description
  tags: string[];
  platform: string[];
  regions: string[]; // Changed from origin
  sourceUrls?: string[]; // Changed from verifiedSource
  fraudScore: number;
  detectionTips: string[];
  createdAt: string;
  updatedAt: string;
}

// Updated tag categories to match the comprehensive dataset
export const ALL_TAGS = [
  // Job Scams
  'JobScam', 'FakeJobOffer', 'EmploymentFraud', 'WorkFromHome', 'RecruitmentFraud', 'DataEntryFraud',
  
  // Loan Scams
  'LoanFraud', 'UPIFraud', 'Harassment', 'FakeDocuments', 'BankingFraud', 'WebsiteFraud',
  
  // Banking Frauds
  'OTPScam', 'Phishing', 'NetBankingFraud', 'CardFraud', 'Skimming', 'SMSFraud',
  
  // Investment Scams
  'CryptoFraud', 'InvestmentScam', 'PonziScheme', 'CryptoTrap', 'StockScam', 'ICOFraud', 'CryptoScam', 'MutualFundFraud',
  
  // Romance Scams
  'RomanceFraud', 'RomanceScam', 'PigButchering', 'MarriageFraud', 'GiftFraud',
  
  // Digital Arrest Scams
  'DigitalArrest', 'FakePolice', 'ImpersonationFraud', 'CustomsFraud', 'LegalFraud', 'InterpolFraud',
  
  // Major Ponzi Scheme tags
  'SaradhaScam', 'RoseValleyScam', 'PACLScam', 'FalconScam', 'WebworkScam', 'ChitFund', 'LandInvestmentFraud', 'ClickEarningFraud',
  
  // Phishing and Email Fraud tags
  'Phishing', 'EmailFraud', 'IDTheft', 'GovernmentFraud', 'Smishing', 'SIMClosure', 'IndiaPostScam', 'LegalNoticeScam', 'EmailSecurity',
  
  // Loan Fraud tags
  'LoanFraud', 'AppFraud', 'ChineseAppScam', 'Blackmail', 'AppExtortion', 'AppScam', 'Harassment', 'InternationalScam', 'DataHarvest',
  
  // Additional tags
  'BankFraud', 'IdentityTheft', 'SocialEngineering', 'AdvanceFee', 'OnlineFraud', 'CredentialTheft', 'PaymentFraud', 'Extortion'
];

// Tag categories with emojis and descriptions
export const TAG_CATEGORIES = {
  'JobScam': { emoji: '💼', color: 'blue', description: 'Fake job offers and employment scams' },
  'LoanFraud': { emoji: '💰', color: 'red', description: 'Loan and advance-fee scams' },
  'PonziScheme': { emoji: '🎪', color: 'darkred', description: 'Ponzi and pyramid schemes' },
  'BankingFraud': { emoji: '🏦', color: 'purple', description: 'Banking and OTP frauds' },
  'CryptoFraud': { emoji: '₿', color: 'orange', description: 'Cryptocurrency investment scams' },
  'RomanceFraud': { emoji: '💔', color: 'pink', description: 'Romance and pig-butchering scams' },
  'DigitalArrest': { emoji: '🚔', color: 'darkblue', description: 'Police impersonation scams' },
  'Phishing': { emoji: '🎣', color: 'yellow', description: 'Phishing and credential theft' },
  'UPIFraud': { emoji: '📱', color: 'green', description: 'UPI payment frauds' }
};

// No mock data - data will be fetched from backend
export const mockScams: Scam[] = [];

// Utility functions for client-side filtering and processing
export const searchScams = (scams: Scam[], query: string): Scam[] => {
  if (!query.trim()) return scams;

  const searchTerm = query.toLowerCase();
  return scams.filter(scam => 
    scam.title.toLowerCase().includes(searchTerm) ||
    scam.summary.toLowerCase().includes(searchTerm) ||
    scam.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    scam.platform.some(platform => platform.toLowerCase().includes(searchTerm)) ||
    scam.regions.some(region => region.toLowerCase().includes(searchTerm))
  );
};

export const filterScamsByTags = (scams: Scam[], selectedTags: string[]): Scam[] => {
  if (selectedTags.length === 0) return scams;
  
  return scams.filter(scam => 
    selectedTags.some(tag => scam.tags.includes(tag))
  );
};

export const filterScamsByFraudScore = (scams: Scam[], minScore: number, maxScore: number): Scam[] => {
  return scams.filter(scam => 
    scam.fraudScore >= minScore && scam.fraudScore <= maxScore
  );
};

export const sortScams = (scams: Scam[], sortBy: 'date' | 'fraudScore' | 'title'): Scam[] => {
  const sortedScams = [...scams];
  
  switch (sortBy) {
    case 'date':
      return sortedScams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'fraudScore':
      return sortedScams.sort((a, b) => b.fraudScore - a.fraudScore);
    case 'title':
      return sortedScams.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedScams;
  }
};

export const getFraudLevel = (score: number): { level: string; color: string; bgColor: string } => {
  if (score >= 80) return { level: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-100' };
  if (score >= 60) return { level: 'Medium Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  return { level: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100' };
};

export const getTrendingScams = (scams: Scam[], limit: number = 5): Scam[] => {
  return scams
    .sort((a, b) => b.fraudScore - a.fraudScore)
    .slice(0, limit);
};

export const getScamStats = (scams: Scam[]) => {
  const totalScams = scams.length;
  const highRiskScams = scams.filter(scam => scam.fraudScore >= 80).length;
  const totalViews = 0; // Not in new schema
  const totalReports = 0; // Not in new schema

  return {
    totalScams,
    highRiskScams,
    totalViews,
    totalReports
  };
};

export const getTagStats = (scams: Scam[]) => {
  const tagCounts: { [key: string]: number } = {};
  
  scams.forEach(scam => {
    scam.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};