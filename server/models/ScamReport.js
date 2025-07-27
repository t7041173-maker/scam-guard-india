const mongoose = require('mongoose');

const ScamReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  detectionTips: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    required: true,
    enum: [
      // Digital Arrest tags
      'DigitalArrest', 'Impersonation', 'Extortion', 'VideoExtortion', 'Family', 'ElderlyScam', 'ImpersonationFraud', 'PhysicalCoercion', 'Deepfake', 'GangBust',
      // Romance Fraud tags
      'RomanceFraud', 'MatrimonyScam', 'PigButchering', 'ITBreach', 'Deepfake', 'Impersonation',
      // Banking Fraud tags
      'BankingFraud', 'FakeBankSite', 'InternalFraud', 'FDWithdrawal', 'MuleAccountFraud', 'InvestmentScam', 'InternalCollusion', 'ForgedAccount', 'CooperativeBankScam', 'Embezzlement',
      // CryptoTrap tags
      'PigButchering', 'CryptoTrap', 'FakeCoinScam', 'TelegramScam', 'StagedPayoutFraud', 'SocialEngineering', 'AITradingScam', 'USDTScam', 'P2PScam',
      // Job Scam tags
      'JobScam', 'OfferLetterFraud', 'OverseasEmploymentFraud', 'WorkFromHomeFraud', 'IdentityMisuse', 'GSTFraud', 'MicrotaskFraud', 'SocialMediaScam', 'VIPTaskFraud', 'ReferralScam',
      // UPI Fraud tags
      'UPIFraud', 'AutoDebitPhish', 'RefundScam', 'ReversePayment', 'SIMCloning', 'PINTheft', 'InternalFraud', 'AuthorizedUPIAbuse', 'QRCodedFraud', 'FakeAppScam',
      // Existing tags
      'PonziScheme', 'ChitFund', 'SaradhaScam', 'RoseValleyScam', 'PACLScam', 'FalconScam', 'WebworkScam', 'LandInvestmentFraud', 'ClickEarningFraud',
      'InvestmentFraud', 'Phishing', 'EmailFraud', 'IDTheft', 'GovernmentFraud', 'Smishing', 'SIMClosure', 'IndiaPostScam', 'Extortion', 'LegalNoticeScam', 'EmailSecurity',
      'LoanFraud', 'AppFraud', 'ChineseAppScam', 'Blackmail', 'AppExtortion', 'AppScam', 'Harassment', 'InternationalScam', 'DataHarvest'
    ]
  }],
  platform: [{
    type: String,
    enum: [
      // Digital Arrest platforms
      'WhatsApp', 'Video Call', 'Phone Call', 'WhatsApp Video Call',
      // Romance Fraud platforms
      'Matrimonial App', 'Matrimonial Site', 'Fake Trading Platform', 'Bost Base (Fake Crypto Link)', 'Facebook', 'Online Crypto Platform', 'Dating App (Hinge)', 'Fake Crypto App', 'Matrimony Website', 'International Bank Transfers',
      // Banking Fraud platforms
      'Website', 'Phone', 'Bank Branch', 'Bank Account', 'Bank Internal',
      // CryptoTrap platforms
      'Fake Crypto Site', 'Fake Trading Dashboard', 'P2P Trading',
      // Job Scam platforms
      'Agent Office', 'Mobile App', 'YouTube', 'Instagram', 'Telegram',
      // UPI Fraud platforms
      'UPI', 'WhatsApp', 'SMS', 'Email', 'Mobile Network', 'PhonePe UI', 'Public QR Scan',
      // Existing platforms
      'Offline Agent Network', 'Collective Investment Scheme', 'Agent Network', 'Offline Agents', 'Promotional Brochures', 'Website', 'Social Media', 'Mobile App', 'Web', 'iMessage', 'Mobile App (APK)', 'Android App', 'App', 'Mobile'
    ]
  }],
  regions: [{
    type: String,
    trim: true
  }],
  sourceUrls: [{
    type: String,
    trim: true
  }],
  fraudScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Create text index for search functionality
ScamReportSchema.index({
  title: 'text',
  summary: 'text',
  tags: 'text',
  regions: 'text'
});

module.exports = mongoose.model('ScamReport', ScamReportSchema); 