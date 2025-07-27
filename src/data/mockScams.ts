export interface Scam {
  id: string;
  title: string;
  type: string;
  tags: string[];
  detectionTips: string[];
  fraudScore: number;
  platform: string[];
  origin?: string;
  verifiedSource?: string;
  description: string;
}

export const mockScams: Scam[] = [
  {
    id: "1",
    title: "Fake Investment App - 'QuickProfit Pro'",
    type: "Investment Fraud",
    tags: ["#CryptoTrap", "#FakeApp", "#InvestmentFraud"],
    detectionTips: [
      "App not available on official Play Store/App Store",
      "Promises guaranteed 20-30% weekly returns",
      "Asks for KYC documents upfront before showing any investments",
      "Customer support only via WhatsApp or Telegram"
    ],
    fraudScore: 95,
    platform: ["Android APK", "WhatsApp"],
    origin: "Delhi, Mumbai",
    verifiedSource: "https://example.com/rbi-warning",
    description: "Fake trading app that steals user documents and deposits"
  },
  {
    id: "2", 
    title: "WhatsApp Loan Approval Scam",
    type: "Loan Fraud",
    tags: ["#LoanFraud", "#WhatsAppScam", "#UPIFraud"],
    detectionTips: [
      "Instant loan approval without credit check",
      "Asks for processing fee via UPI before loan disbursal",
      "Uses fake RBI/Bank logos in messages",
      "Contact number not linked to any official bank"
    ],
    fraudScore: 88,
    platform: ["WhatsApp", "UPI Apps"],
    origin: "Rajasthan, UP",
    description: "Scammers pose as loan officers promising instant personal loans"
  },
  {
    id: "3",
    title: "Flipkart Job Offer Email Scam", 
    type: "Employment Fraud",
    tags: ["#JobScam", "#Phishing", "#EmailFraud"],
    detectionTips: [
      "Email from non-official domain (@flipkart-jobs.com instead of @flipkart.com)",
      "Asks for registration fee for 'guaranteed' job placement",
      "Poor grammar and spelling in official communications",
      "Promises work-from-home with unrealistic salary packages"
    ],
    fraudScore: 72,
    platform: ["Email", "WhatsApp"],
    origin: "Bangalore, Hyderabad",
    verifiedSource: "https://example.com/flipkart-warning",
    description: "Fake recruitment emails targeting job seekers with lucrative offers"
  },
  {
    id: "4",
    title: "OTP Banking Fraud Call",
    type: "Banking Scam", 
    tags: ["#BankingFraud", "#OTPScam", "#Phishing"],
    detectionTips: [
      "Caller claims to be from bank's fraud prevention team",
      "Creates urgency by saying account will be blocked",
      "Asks to share OTP to 'secure' the account",
      "May have some personal details to sound legitimate"
    ],
    fraudScore: 85,
    platform: ["Phone Call", "SMS"],
    origin: "Multiple states",
    description: "Fraudsters call pretending to be bank officials to steal OTPs and access accounts"
  },
  {
    id: "5",
    title: "Government Subsidy WhatsApp Forward",
    type: "Government Scheme Fraud",
    tags: ["#GovernmentScam", "#WhatsAppScam", "#SubsidyFraud"],
    detectionTips: [
      "Claims PM announced new subsidy scheme not covered by news",
      "Asks to click suspicious links to register",
      "Requests Aadhar and bank details for 'verification'",
      "Messages forwarded in family groups to build trust"
    ],
    fraudScore: 67,
    platform: ["WhatsApp", "Fake Websites"],
    origin: "Rural areas, Small cities",
    description: "Fake government scheme announcements targeting rural populations"
  },
  {
    id: "6",
    title: "Cryptocurrency Investment Telegram Group",
    type: "Crypto Fraud",
    tags: ["#CryptoTrap", "#TelegramScam", "#InvestmentFraud"],
    detectionTips: [
      "Admin posts fake trading screenshots showing huge profits",
      "New members must pay 'signal fee' to get trading tips",
      "Claims to have insider information about upcoming coins",
      "Promotes unknown exchanges or wallets"
    ],
    fraudScore: 91,
    platform: ["Telegram", "Unknown Crypto Exchanges"],
    origin: "International/Online",
    description: "Telegram groups luring people into crypto investment scams with fake profit proofs"
  }
];

export const searchScams = (query: string, scams: Scam[] = mockScams): Scam[] => {
  if (!query.trim()) return scams;

  const normalizedQuery = query.toLowerCase();
  
  return scams.filter(scam => 
    scam.title.toLowerCase().includes(normalizedQuery) ||
    scam.type.toLowerCase().includes(normalizedQuery) ||
    scam.description.toLowerCase().includes(normalizedQuery) ||
    scam.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
    scam.platform.some(platform => platform.toLowerCase().includes(normalizedQuery)) ||
    scam.detectionTips.some(tip => tip.toLowerCase().includes(normalizedQuery))
  );
};

export const filterScamsByTag = (tag: string, scams: Scam[] = mockScams): Scam[] => {
  return scams.filter(scam => 
    scam.tags.some(scamTag => scamTag.toLowerCase() === tag.toLowerCase())
  );
};