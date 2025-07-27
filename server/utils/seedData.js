const mongoose = require('mongoose');
const ScamReport = require('../models/ScamReport');

// Ponzi and Pyramid Scheme Scam Data
const seedScams = [
  {
    title: "Saradha Group Ponzi Scam (2013)",
    summary: "The Saradha Group, based in Kolkata, promised lavish returns—sometimes up to 50% per annum—through chit-fund and collective investment schemes. They raised over ₹2,500 crore from over 17 lakh investors across eastern India, especially in West Bengal, Odisha, Assam and Jharkhand. The money was funneled through a complex web of over 200 companies controlled by Sudipta Sen, and returns to earlier investors were paid using money from new depositors. The scheme collapsed abruptly in 2013, triggering widespread investor protests and multiple high-profile arrests.",
    detectionTips: [
      "Return rates well above market norms (30–50%) are major red flags.",
      "Funds collected without SEBI approval through multiple shell companies.",
      "Paying old investors from new investors' deposits is a classic Ponzi structure."
    ],
    tags: ["PonziScheme", "ChitFund", "SaradhaScam"],
    platform: ["Offline Agent Network"],
    regions: ["West Bengal", "Odisha", "Assam", "Jharkhand"],
    sourceUrls: [
      "https://www.bemoneyaware.com/ponzi-scheme-saradha-speakasia-bernard-madoff/",
      "https://www.indiatvnews.com/news/india-what-is-saradha-scam-how-did-india-s-biggest-ponzi-scheme-unravel-502950"
    ],
    fraudScore: 95
  },
  {
    title: "Rose Valley Chit Fund Ponzi Scam (2015)",
    summary: "The Rose Valley Group, operating across eastern India, collected deposits of over ₹15,000 crore by promising returns and holiday packages via chit funds and real estate ventures. It functioned like a Ponzi scheme, using new money to pay earlier investors. SEBI and ED investigations in 2015–16 revealed shell accounts, asset diversion, and political links. Despite asset seizures worth over ₹4,200 crore, most investors remain unpaid.",
    detectionTips: [
      "Chit-fund schemes promising unrealistic returns (15–20%) without proper business model.",
      "Presence of shell companies and affiliate accounts used for cycling money.",
      "Registered political backing or media appearances without legitimate investments."
    ],
    tags: ["PonziScheme", "ChitFund", "RoseValleyScam"],
    platform: ["Collective Investment Scheme", "Agent Network"],
    regions: ["West Bengal", "Assam", "Odisha", "Tripura", "Jharkhand"],
    sourceUrls: [
      "https://en.wikipedia.org/wiki/Rose_Valley_financial_scandal",
      "https://legalwellbeing.in/ponzi-schemes-a-financial-fraud/"
    ],
    fraudScore: 94
  },
  {
    title: "PACL / Pearls Group Scam (2016)",
    summary: "PACL (Pearls Agrotech Corporation Limited) raised nearly ₹49,000 crore from over 5 crore investors by promising land ownership and high returns. No actual land development occurred. SEBI declared it an illegal collective scheme, ordered refunds, and launched asset recovery. The case remains one of India's largest financial frauds, with only partial restitution and ongoing litigation.",
    detectionTips: [
      "Promises of guaranteed land plots without verified documentation.",
      "Returns paid from new investor proceeds rather than business revenue.",
      "Refusal by promoters to cooperate after regulatory warnings from SEBI."
    ],
    tags: ["PonziScheme", "PACLScam", "LandInvestmentFraud"],
    platform: ["Offline Agents", "Promotional Brochures"],
    regions: ["Pan-India"],
    sourceUrls: [
      "https://en.wikipedia.org/wiki/Sahara_India_Pariwar_investor_fraud_case",
      "https://timesofindia.indiatimes.com/city/delhi/delhi-court-summons-hayer-in-rs-48000-cr-ponzi-case/articleshow/122163334.cms"
    ],
    fraudScore: 98
  },
  {
    title: "Falcon Invoice Discounting Ponzi Scam (2021–2025)",
    summary: "Falcon Invoice Discounting claimed to partner with companies like Amazon and Britannia, promising returns of 20–22% to investors. It collected nearly ₹1,700 crore from almost 7,000 people in southern India. Victims were paid early returns to build trust; later repayments stopped, and the company allegedly diverted funds into shell accounts. Police chargesheeted two people, and the founder remains at large.",
    detectionTips: [
      "High fixed returns (20%+) without clear business model.",
      "Claims linking legitimate brands with no public partnerships.",
      "Evidence of shell bank accounts and diversion of proceeds uncovered by ED."
    ],
    tags: ["PonziScheme", "InvestmentFraud", "FalconScam"],
    platform: ["Website", "Social Media", "Mobile App"],
    regions: ["Telangana", "Andhra Pradesh"],
    sourceUrls: [
      "https://www.livemint.com/news/india/scam-alert-thousands-investors-lose-life-saving-rs-870-crore-ponzi-scheme-false-claim-link-britannia-amazon-high-returns-11739864075273.html",
      "https://www.reuters.com/world/india/thousands-indian-investors-lose-100-million-ponzi-scheme-police-say-2025-02-18/"
    ],
    fraudScore: 92
  },
  {
    title: "Webwork Trade Links Online Ponzi Scam (2017)",
    summary: "Webwork Trade Links promised earnings of ₹6 per website 'like' and asked customers to pay ₹11,000–₹57,500 to become 'publishers.' Bollywood endorsements boosted credibility. The Noida office was sealed in early 2017; over ₹240 crore and more than 2 lakh investors were impacted. Managers claimed it was monetizing online clicks—but the business model never existed.",
    detectionTips: [
      "Guaranteed returns per click with no verified profit mechanism.",
      "Large upfront membership fees with minimal transparency.",
      "Use of celebrity endorsements without audit or business documentation."
    ],
    tags: ["PonziScheme", "WebworkScam", "ClickEarningFraud"],
    platform: ["Website", "Social Media"],
    regions: ["UP", "Delhi", "National"],
    sourceUrls: [
      "https://en.wikipedia.org/wiki/Webwork_(Indian_web_site)",
      "https://www.thehindu.com/news/cities/Delhi/ponzi-scam-unearthed-1-arrested/article33763801.ece"
    ],
    fraudScore: 89
  },

  // 8️⃣ Phishing Email Scams (5)
  {
    title: "Fake 'PAN 2.0' Upgrade Phishing Scam",
    summary: "Fraudulent emails promising an upgraded 'PAN 2.0' card are being circulated widely. These messages use fake seals and Indonesian or other non-.gov domains like info@smt.plusoasis.com. They lure users to click links that lead to cloned sites mimicking Income Tax portals, prompting them to enter PAN, Aadhaar, bank credentials, and other sensitive data. This collected information is then used for identity theft or financial fraud. The Press Information Bureau (PIB) and Income Tax Department issued public warnings, stating these emails are fake and urging citizens to stay vigilant.",
    detectionTips: [
      "Genuine emails from the Income Tax Department always come from .gov.in domains.",
      "Never click links in emails asking for personal or financial information.",
      "Access PAN services only via official portals (IT Department, NSDL, UTIITSL)."
    ],
    tags: ["Phishing", "EmailFraud", "IDTheft"],
    platform: ["Email", "Website"],
    regions: ["Pan-India"],
    sourceUrls: [
      "https://economictimes.indiatimes.com/wealth/tax/income-tax-refund-manual-verification-email-could-be-a-trap-know-how-to-identify-this-fraud-and-avoid/articleshow/122813008.cms",
      "https://www.livemint.com/technology/tech-news/fake-pan-2-0-scam-alert-government-warns-citizens-against-phishing-emails-what-you-must-know-11753198585721.html"
    ],
    fraudScore: 82
  },
  {
    title: "Phishing Scam Mimicking Ministry of Defence Login Site",
    summary: "Sophisticated phishing attempts target government officials by creating fake websites that closely mimic the Ministry of Defence (MoD) portal. The URLs use domains like mod.gov.in.aboutcase.nl, tricking users into entering NIC-provided login credentials. Once credentials are entered, users are redirected to an error page, while attackers gain access to confidential data. A NIC advisory confirmed these URLs and warned officials to delete suspicious emails and update passwords immediately.",
    detectionTips: [
      "Phishing URLs often include extra subdomains like 'aboutcase.nl' before the legitimate domain.",
      "Government sites never send unsolicited emails requesting login credentials.",
      "When suspicious, access government services only via their main official domain."
    ],
    tags: ["Phishing", "GovernmentFraud"],
    platform: ["Email", "Website"],
    regions: ["Delhi"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/india/govt-employees-warned-of-phishing-links-that-mimic-defence-ministry-to-steal-data/articleshow/113110884.cms",
      "https://www.business-standard.com/external-affairs-defence-security/news/security-agencies-detect-phishing-fraud-that-mimics-mod-s-official-website-124090500801_1.html"
    ],
    fraudScore: 86
  },
  {
    title: "Smishing Scam Masquerading as India Post / TRAI",
    summary: "Smishing campaigns target iPhone and Android users by sending SMS or iMessages claiming to be from India Post or TRAI. These messages warn of a parcel awaiting processing or SIM closure due to fraudulent activity. Victims are asked to click a link or download an app, which installs malware or leads to credential theft. The Economic Times (ETGovernment) and CERT-In have issued warnings and urged people to ignore messages from suspicious IDs and verify via official channels.",
    detectionTips: [
      "Official postal or telecom agencies never send package or closure notices via SMS/iMessage.",
      "Do not click on links in SMS or WhatsApp claiming urgent action unless verified.",
      "Enable two-factor authentication and report suspicious messages promptly."
    ],
    tags: ["Smishing", "Phishing", "SIMClosure", "IndiaPostScam"],
    platform: ["SMS", "iMessage"],
    regions: ["Pan-India"],
    sourceUrls: [
      "https://www.ndtv.com/india-news/government-warns-of-smishing-attacks-heres-how-to-stay-safe-4709458",
      "https://government.economictimes.indiatimes.com/news/secure-india/smishing-attack-iphone-users-in-india-now-targeted-with-india-post-lures/112127573"
    ],
    fraudScore: 84
  },
  {
    title: "Fake Legal Notice Emails Impersonating Govt Agencies",
    summary: "Scammers send emails disguised as legal notices from respected Indian institutions like the Cyber Crime Coordination Centre (I4C), Delhi Police, and Intelligence Bureau. These emails falsely accuse recipients of cyber crimes and use alarming language to force them into responding. The PIB Fact Check and Home Ministry have flagged this as a major phishing campaign. Users are asked to pay fines or share personal data, under threat of litigation or arrest.",
    detectionTips: [
      "Government notices never arrive via email—especially with threats—or use unofficial domains.",
      "Verified officials' names and agencies should be cross-checked online.",
      "Never pay money or share PII in response to legal claims received via email without confirmation."
    ],
    tags: ["Phishing", "Extortion", "LegalNoticeScam"],
    platform: ["Email", "Website"],
    regions: ["Pan-India"],
    sourceUrls: [
      "https://www.business-standard.com/india-news/beware-of-fraudulent-govt-emails-home-ministry-issues-public-warning-124071500749_1.html",
      "https://www.technadu.com/fake-legal-notices-used-by-scammers-target-people-and-entities-in-india/563312/"
    ],
    fraudScore: 88
  },
  {
    title: "NIC Advisory: Phishing Attacks Targeting Govt Employee Emails",
    summary: "In March 2025, the National Informatics Centre (NIC) issued a formal advisory warning Indian government employees of rampant phishing attempts. Attackers were spoofing email addresses that resemble official NIC (.nic.in) or .gov.in domains, pressuring recipients to urgently click links or open attachments. The advisory emphasized looking out for spelling anomalies that replace characters (like 'i' with '1') and urged employees to report suspicious emails and change passwords if needed.",
    detectionTips: [
      "Check email domains carefully: phishing often mimics nic.in or gov.in with subtle spelling changes.",
      "Avoid clicking urgent links or opening suspicious attachments.",
      "Always report suspicious communications via official internal IT channels."
    ],
    tags: ["Phishing", "GovernmentFraud", "EmailSecurity"],
    platform: ["Email"],
    regions: ["Pan-India"],
    sourceUrls: [
      "https://www.moneycontrol.com/technology/inbox-intrusion-nics-advisory-to-government-employees-warns-against-phishing-attacks-article-12993234.html"
    ],
    fraudScore: 85
  },

  // 9️⃣ Loan Fraud Scams (5)
  {
    title: "Fake Chinese Loan Apps — ₹719 Cr Scam",
    summary: "In early 2025, Indian authorities arrested operators linked to Chinese entities who ran hundreds of fake loan apps. They created around 500 mule bank accounts to funnel ₹719 crore from unsuspecting borrowers, primarily in Kerala and Haryana. Victims were lured with instant loans, forced to pay advance EMIs, and blackmailed using personal data harvested via these apps. The Enforcement Directorate charged multiple people under PMLA, revealing a highly organized money-laundering network.",
    detectionTips: [
      "Check if the app is available only via link or APK—not official store.",
      "Be cautious of advance EMI charges before loan disbursement.",
      "Avoid apps that harvest personal data and threaten with morphed photos."
    ],
    tags: ["LoanFraud", "AppFraud", "ChineseAppScam"],
    platform: ["Mobile App (APK)", "UPI"],
    regions: ["Kerala", "Haryana"],
    sourceUrls: [
      "https://www.business-standard.com/india-news/ed-arrests-key-players-in-rs-719-crore-fake-chinese-loan-app-scam-125022101149_1.html"
    ],
    fraudScore: 92
  },
  {
    title: "Loan App Extortion via Harassment & Blackmail",
    summary: "A former loan recovery agent in Navi Mumbai was arrested for operating multiple fake loan apps that extorted users. The apps collected users' contact lists and images, which were later morphed and used for blackmail. Victims were coerced into paying escalating sums—even after clearing initial dues. The network, connected to handlers in Singapore, received over 10,000 complaints and was dismantled by cybercrime units.",
    detectionTips: [
      "Avoid apps that request contact access or storage permissions unnecessarily.",
      "Never comply with demands based on threats involving photo or data exposure.",
      "Use only RBI-approved or verified loan platforms."
    ],
    tags: ["LoanFraud", "Blackmail", "AppExtortion"],
    platform: ["Android App", "WhatsApp"],
    regions: ["Mumbai", "Pan-India"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/pune/former-loan-recovery-agent-arrested-for-extortion-blackmail-scam-via-apps-police-say-pan-india-racket-exposed/articleshow/122421887.cms"
    ],
    fraudScore: 90
  },
  {
    title: "BJP Official's Son Loses ₹45 Lakh to Loan App Scam",
    summary: "In Bengaluru, the son of a BJP functionary fell prey to a fraudulent loan app that offered a ₹6 lakh loan but extorted ₹45 lakh instead. After initial repayment, he faced relentless harassment—including morphed photo threats—despite clearing initial dues. The prolonged emotional stress led to hospitalization due to depression. Authorities registered a case under the IT Act, highlighting the psychological toll of such scams.",
    detectionTips: [
      "Never take loans through unverified apps promising unrealistic terms.",
      "Avoid apps that require power of attorney or access beyond minimal permissions.",
      "Report threatening behavior or photo-based blackmail immediately."
    ],
    tags: ["LoanFraud", "Blackmail", "AppScam"],
    platform: ["Android App", "SMS"],
    regions: ["Bengaluru"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/bengaluru/bjp-officials-son-loses-45-lakh-to-loan-app-crooks/articleshow/104929585.cms"
    ],
    fraudScore: 89
  },
  {
    title: "Young Man Loses ₹5.6 Lakh via Loan App Harassment",
    summary: "A 21‑year‑old from Rajkot lost ₹5.6 lakh in a series of extortive demands after taking a ₹2,100 loan via a loan app. Multiple fragmented payments were forced under duress, and the victim was threatened with exposure of morphed images. Authorities report that the app operators used skyrocketing interest rates and psychological pressure to collect much more than the loaned amount.",
    detectionTips: [
      "Small 'instant' disbursals may mask hidden charges.",
      "Avoid apps that require full phone permissions and access to your gallery.",
      "Seek help from cyber helplines if harassment escalates."
    ],
    tags: ["LoanFraud", "AppScam", "Harassment"],
    platform: ["Android App", "Mobile"],
    regions: ["Rajkot"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/rajkot/21-yr-old-loses-56l-in-loan-app-fraud/articleshow/108339719.cms"
    ],
    fraudScore: 85
  },
  {
    title: "Loan App Scam by Malaysian Nationals in Andhra Pradesh",
    summary: "AP police disguised themselves as loan agents to infiltrate a scam network run by Malaysian nationals. Victims were offered small loans, after which their personal data—including call logs, SMS and photos—were collected. They were blackmailed under threat of public exposure if they didn't send additional money. The operation led to at least one youth's suicide and arrests of foreign agents, exposing a cross-border scam infrastructure.",
    detectionTips: [
      "Avoid loans from agents operating outside official channels.",
      "Do not grant camera, call–log, or storage permissions to unknown apps.",
      "Report forced requests for additional payments immediately."
    ],
    tags: ["LoanFraud", "InternationalScam", "DataHarvest"],
    platform: ["App", "Social Media"],
    regions: ["Andhra Pradesh"],
    sourceUrls: [
      "https://www.livemint.com/news/india/loan-app-scam-case-andhra-pradesh-police-posed-as-loan-agents-to-nab-foreign-fraudsters-malaysian-nationalssuicide-11685075810274.html"
    ],
    fraudScore: 91
  },

  // 10️⃣ UPI Fraud Scams (5)
  {
    title: "Fake UPI Link Phishing Scam",
    summary: "Cybercriminals send phishing links disguised as legitimate merchants to users via WhatsApp, SMS, or email. Once clicked, these links launch malicious web apps that mimic UPI payment pages. Victims, believing they’re paying a merchant, unknowingly approve auto-debit permissions, causing unauthorized withdrawals. RBI data shows such cases surged dramatically, with UPI fraud via phishing and fake links being a major contributor in FY 2023‑24.",
    detectionTips: [
      "Never tap URLs received via WhatsApp/SMS unless verified.",
      "Check the link domain before approving any UPI transaction.",
      "Avoid approving unfamiliar collect or auto‑debit permissions."
    ],
    tags: ["UPIFraud", "Phishing", "AutoDebitPhish"],
    platform: ["WhatsApp", "SMS", "Email"],
    regions: ["Pan‑India"],
    sourceUrls: [
      "https://www.indiatoday.in/amp/business/story/5-common-upi-related-frauds-and-tips-to-prevent-them-2677463-2025-02-10",
      "https://economictimes.indiatimes.com/markets/stocks/news/sebi-to-launch-upi-ids-for-sebi-registered-entities-who-collect-funds/articleshow/121776354.cms"
    ],
    fraudScore: 88
  },
  {
    title: "Fake Refund UPI Scam",
    summary: "Scammers fake a mistake by sending a ‘refund’ to the victim’s UPI ID, prompting them to return the ‘overpaid’ amount. The initial credited sum never existed on the merchant’s side. When victims transfer money back, the transaction is real—and their money is gone. NPCI and RBI have flagged this as a frequent modus operandi, especially among victims unfamiliar with UPI’s push‑payment design.",
    detectionTips: [
      "Do not assume a transfer is real until confirmed in your official bank app.",
      "Never return money based on messages alone without verifying credit.",
      "Treat unexpected UPI transfers as suspicious until authenticated."
    ],
    tags: ["UPIFraud", "RefundScam", "ReversePayment"],
    platform: ["UPI"],
    regions: ["Pan‑India"],
    sourceUrls: [
      "https://www.indiatoday.in/amp/business/story/5-common-upi-related-frauds-and-tips-to-prevent-them-2677463-2025-02-10"
    ],
    fraudScore: 85
  },
  {
    title: "SIM Cloning & UPI PIN Theft Scam",
    summary: "Fraudsters clone the victim’s SIM card to intercept OTPs and UPI verification messages. With the cloned SIM, they set up UPI accounts and access PINs silently. Victims may not receive security alerts, while significant sums are drained. Home Ministry data shows over 13.4 lakh UPI fraud cases in FY2023‑24, many involving SIM compromise and PIN theft.",
    detectionTips: [
      "Enable device binding and two‑factor authentication on your UPI app.",
      "Report SIM issues immediately if you lose mobile network or notifications.",
      "Do not disclose OTPs or PINs—even to people claiming to help."
    ],
    tags: ["UPIFraud", "SIMCloning", "PINTheft"],
    platform: ["Mobile Network", "UPI"],
    regions: ["Pan‑India"],
    sourceUrls: [
      "https://www.indiatoday.in/amp/business/story/5-common-upi-related-frauds-and-tips-to-prevent-them-2677463-2025-02-10",
      "https://www.ndtv.com/india-news/digital-frauds-including-in-upi-has-doubled-home-ministry-to-parliament-8018240"
    ],
    fraudScore: 90
  },
  {
    title: "UPI Theft by Colleague – Delhi Case",
    summary: "An employee at the President’s Estate in Delhi was arrested for siphoning off ₹20+ lakh from a colleague through fraudulent UPI transactions. He accessed both personal and spouse’s accounts using insider knowledge. These unauthorized UPI transactions were routed to shell accounts in Kolkata. This case highlights internal trust abuse and unauthorized access risks tied to UPI misuse.",
    detectionTips: [
      "Review account statements regularly—don’t ignore theft by familiar people.",
      "Set tight UPI limits and avoid storing PIN in apps.",
      "Freeze your UPI account as soon as suspicious activity is detected."
    ],
    tags: ["UPIFraud", "InternalFraud", "AuthorizedUPIAbuse"],
    platform: ["UPI"],
    regions: ["Delhi"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/delhi/employee-arrested-for-defrauding-colleague-through-unauthorized-upi-transactions/articleshow/121915832.cms"
    ],
    fraudScore: 91
  },
  {
    title: "QR Code / Fake UPI App Scam",
    summary: "A viral incident in Patna exposed how a scammer used a fake PhonePe interface to trick a victim into handing over cash for an online payment. The victim scanned a QR code on the street, confirmed a ‘successful’ UPI transfer, and handed over cash—only to realize later that the payment was never processed. His QR-based mock confirmation and the scammer's disappearance reflect how realistic interface forgery and quick social engineering can succeed.",
    detectionTips: [
      "Always verify UPI transfer in the official banking or UPI app—not just on the scammer’s screen.",
      "Don’t give cash based solely on visual ‘payment confirmations.’",
      "Avoid making transactions with strangers via public QR codes."
    ],
    tags: ["UPIFraud", "QRCodedFraud", "FakeAppScam"],
    platform: ["PhonePe UI", "Public QR Scan"],
    regions: ["Delhi/Patna"],
    sourceUrls: [
      "https://www.reddit.com/r/IsThisAScamIndia/comments/1gt8qlq/i_got_scammed_today/"
    ],
    fraudScore: 87
  },

  // 11️⃣ Job Scam Entries (5)
  {
    title: "Fake Overseas Job Offers Scam – ₹78.5 Lakh Loss",
    summary: "In a recent Mumbai case (July 2025), a fraudster promised overseas jobs with permanent visas to victims in Gujarat for the USA and New Zealand. He used fake offer letters, flight tickets, and counterfeit visas. Five aspirants collectively lost ₹78.5 lakh before realizing the scheme was a hoax. Police traced the scam to an office in Mira Road and arrested one primary suspect, discovering forged documents and delayed travel promises as part of the strategy.",
    detectionTips: [
      "Verify offer details through genuine consular or HR portals.",
      "Never trust unpaid registrations or visa fee claims.",
      "Cross-check job paperwork via official overseas employment channels."
    ],
    tags: ["JobScam", "OfferLetterFraud", "OverseasEmploymentFraud"],
    platform: ["WhatsApp", "Email", "Agent Office"],
    regions: ["Mumbai", "Gujarat"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/mumbai/five-conned-of-78-5l-with-fake-overseas-job-offers-one-held/articleshow/122866432.cms"
    ],
    fraudScore: 95
  },
  {
    title: "WFH Data Entry Job Scam via 'Lokal Job' App – ₹2 Lakh Loss",
    summary: "Between December 2024 and June 2025, a Bengaluru man lost over ₹2 lakh to a fake WFH data entry job advertised through an app called 'Lokal Job.' The scammer, posing as 'Sunshine HR Solution,' demanded recurring payments via Google Pay/PhonePe for security deposits and corrections. Investigators seized cash, ATM cards, and mobile phones, freezing the victim’s funds as part of the crackdown.",
    detectionTips: [
      "Be suspicious of job apps charging recurring 'security' or 'correction' fees.",
      "Verify the recruiter or app through online review platforms.",
      "Never pay repeatedly for interview/job processing beyond single legitimate charges."
    ],
    tags: ["JobScam", "WorkFromHomeFraud", "AppScam"],
    platform: ["Mobile App", "WhatsApp"],
    regions: ["Bengaluru"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/mangaluru/suspect-held-in-wfh-job-scam-case/articleshow/122925793.cms"
    ],
    fraudScore: 88
  },
  {
    title: "WhatsApp Job Offer Scam Leads to ₹250 Crore GST Bill",
    summary: "In Muzaffarnagar, a man named Kumar accepted a WhatsApp job offer, submitted personal documents and ₹1,750 fee. He later discovered a fake company was formed with his details and was slapped with a ₹250 crore GST liability. Scam operators exploited his identity to set up bogus financial filings—highlighting how job-seeking documents can be weaponized by fraudsters.",
    detectionTips: [
      "Never share Aadhaar/PAN without verifying employer legitimacy.",
      "Confirm company credentials independently via official registry.",
      "Avoid unsolicited job offers demanding personal documents."
    ],
    tags: ["JobScam", "IdentityMisuse", "GSTFraud"],
    platform: ["WhatsApp", "Email"],
    regions: ["Muzaffarnagar, UP"],
    sourceUrls: [
      "https://www.news18.com/education-career/job-scam-alert-up-man-accepts-offer-letter-on-whatsapp-faces-rs-250-crore-gst-bill-now-9040261.html"
    ],
    fraudScore: 94
  },
  {
    title: "YouTube-Liking Microtask Job Scam – ₹4.3 Lakh Loss",
    summary: "A Noida woman was lured with a WhatsApp message offering ₹500/day for liking YouTube videos. She lost ₹4.3 lakh by paying into the scheme that claimed to send her small payouts for microtasks. This case typifies 'work-from-home' social media scams—initial small rewards arouse trust, leading to higher investments until the fraudsters disappear.",
    detectionTips: [
      "Unrealistic simple tasks offering monetary reward should raise red flags.",
      "Trust small payoffs only if verifiable through bank records.",
      "Research the recruiting company and avoid group-based tasks with hidden fees."
    ],
    tags: ["JobScam", "MicrotaskFraud", "SocialMediaScam"],
    platform: ["WhatsApp", "YouTube"],
    regions: ["Noida"],
    sourceUrls: [
      "https://www.indiatoday.in/technology/news/story/noida-woman-falls-for-whatsapp-part-time-job-offer-scam-loses-rs-43-lakh-by-liking-youtube-videos-2382417-2023-05-22.html"
    ],
    fraudScore: 82
  },
  {
    title: "Telegram/Instagram WFH Task Scam – ₹3.6 Lakh Loss",
    summary: "In Panchkula, two women were scammed after clicking on work-from-home ads on Instagram. They performed simple tasks like liking and sharing content, and received small initial payments (~₹200). Lured into upgrading to a 'VIP' Telegram group, they invested further and eventually lost ₹1.82 lakh to ₹1.8 lakh each. The scam used referral tactics and staged payouts to build trust before vanishing.",
    detectionTips: [
      "Beware of Instagram job ads requiring you to join Telegram groups.",
      "Initial small payouts are often bait to trap victims into larger investments.",
      "Avoid any scheme promising higher pay after joining VIP tiers."
    ],
    tags: ["JobScam", "VIPTaskFraud", "ReferralScam"],
    platform: ["Instagram", "Telegram"],
    regions: ["Panchkula"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/chandigarh/fake-job-offers-scam-two-women-in-panchkula/articleshow/112666270.cms"
    ],
    fraudScore: 86
  },

  // 12️⃣ CryptoTrap Scam Entries (5)
  {
    title: "CBI‑Busted ₹350 Crore Crypto Ponzi Scam",
    summary: "In January 2025, India’s CBI busted a nationwide crypto Ponzi network operating across seven states including Delhi, Punjab and Gujarat. The accused promised high returns on crypto investments, used social media and WhatsApp to recruit investors, and laundered proceeds through centralized exchanges. Authorities recovered digital assets worth over USD 38,000 and identified over 200 mule bank accounts used to funnel investor money into cryptocurrencies. Victims lost lakhs as the scheme collapsed under investigation.",
    detectionTips: [
      "Beware of groups promising guaranteed high crypto returns.",
      "Avoid schemes promoted via WhatsApp/social media with no clear audit trail.",
      "Check for regulatory compliance—legitimate investment platforms register with SEBI/NPCI."
    ],
    tags: ["CryptoTrap","PonziScheme","InvestmentFraud"],
    platform: ["WhatsApp","Social Media","Telegram"],
    regions: ["Delhi","Punjab","Madhya Pradesh","Gujarat","Tamil Nadu"],
    sourceUrls: [
      "https://www.ndtv.com/india-news/cbi-busts-rs-350-crore-crypto-ponzi-scam-promoted-through-social-media-7550421",
      "https://www.business-standard.com/india-news/cbi-busts-rs-350-crore-nationwide-crypto-ponzi-scam-raids-seven-locations-125012401204_1.html"
    ],
    fraudScore: 92
  },
  {
    title: "Chennai Pig‑Butchering Crypto Scam – ₹10 Lakh Loss",
    summary: "In Tamil Nadu, a businessman was lured into investing ₹10 lakh in a fake crypto coin called WPE through a website that mimicked real exchanges. A woman posing as an insider convinced him of upcoming gains through exclusive “pre-IPO invite-only” access. Initial returns were shown to build trust, after which access was blocked and accounts disappeared. Victims realized later—and only after long emailing—that the investment platform and currency were fabricated.",
    detectionTips: [
      "Avoid investment platforms that require exclusive codes or private access.",
      "Fake ‘exchange’ websites often look very polished—but lack real trading history.",
      "If withdrawal requests are blocked or ‘tax fees’ appear out of nowhere, raise suspicion."
    ],
    tags: ["PigButchering","CryptoTrap","FakeCoinScam"],
    platform: ["WhatsApp","Fake Crypto Site"],
    regions: ["Tamil Nadu"],
    sourceUrls: [
      "https://www.thenewsminute.com/tamil-nadu/chennai-man-loses-rs-10-lakh-pig-butchering-fake-crypto-scam-163617"
    ],
    fraudScore: 90
  },
  {
    title: "Delhi Engineer Loses ₹12 Lakh via Telegram Crypto Scam",
    summary: "A Telegram trading channel lured an engineer from Delhi with promises of fast returns on crypto investments. After small initial payouts, he was encouraged to invest ₹12 lakh in multiple transactions. When withdrawal was requested, all communication and blockchain access were cut off. The victim later filed an FIR at the local Cyber Police station under Section 420 of the IPC, reporting that the entire scheme was orchestrated via Telegram with staged payouts to build trust.",
    detectionTips: [
      "Never trust investment schemes promoted exclusively on Telegram.",
      "Look out for staged initial payouts designed to lure larger investments.",
      "Always verify the scheme via independent research or regulatory bodies."
    ],
    tags: ["CryptoTrap","TelegramScam","StagedPayoutFraud"],
    platform: ["Telegram"],
    regions: ["Delhi"],
    sourceUrls: [
      "https://www.news18.com/tech/big-crypto-investment-scam-delhi-man-loses-rs-12-lakh-to-telegram-fraudsters-8735680.html"
    ],
    fraudScore: 88
  },
  {
    title: "Thiruvananthapuram Doctor Loses ₹1 Crore Crypto Scam",
    summary: "A doctor based in Kerala was contacted on WhatsApp by a woman posing as a fellow medical practitioner who claimed huge gains through AI‑based crypto trading. Over 20 transactions totaling ₹1.01 crore were made under trust, with an apparent trading dashboard showing profits. Upon withdrawal requests, she was asked to pay 30% as 'US income tax'—a fabricated requirement. Realizing the deception, she lodged a complaint and the cyber cell initiated proceedings under the IT Act and Bharatiya Nyaya Sanhita.",
    detectionTips: [
      "Be cautious of self-proclaimed professionals offering crypto advice.",
      "Understand that tax-based withdrawal excuses are red flags—test with small withdrawal early.",
      "Use official exchange platforms and avoid using links shared via chat."
    ],
    tags: ["CryptoTrap","SocialEngineering","AITradingScam"],
    platform: ["WhatsApp","Fake Trading Dashboard"],
    regions: ["Kerala"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/thiruvananthapuram/doctor-loses-rs-1-crore-in-cryptocurrency-scam/articleshow/122925338.cms"
    ],
    fraudScore: 91
  },
  {
    title: "Surat Businessman Duped of ₹28.8 Lakh in USDT Crypto Scam",
    summary: "A crypto trader in Surat lost ₹28.8 lakh when coordinating a USDT transaction with international agents. The operation involved a Dubai-based contact coordinating the transfer and local intermediaries denying receipt, despite the victim sending funds. Despite repeated appeals, the victim received no credit or recourse. The Mahidharpura police are now investigating cross-border coordination involving USDT and unresponsive intermediaries.",
    detectionTips: [
      "Avoid peer-to-peer crypto deals arranged via unverified intermediaries.",
      "Cross-check wallet and transaction confirmations via official platform notifications.",
      "If the counterparty doesn't confirm receipt despite your transfer, it's likely a scam."
    ],
    tags: ["CryptoTrap","USDTScam","P2PScam"],
    platform: ["P2P Trading","WhatsApp"],
    regions: ["Gujarat"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/surat/surat-crypto-trader-duped-of-rs-28-8l-in-usdt-scam/articleshow/122800182.cms"
    ],
    fraudScore: 89
  },

  // 13️⃣ Banking Fraud Scam Entries (5)
  {
    title: "Fake Bank Website Scam – ₹1.18 Lakh Loss",
    summary: "Recently, Kolkata and Jamtara police arrested four individuals who created a **fake website and helpline** impersonating a private bank. They tricked a victim into sharing login credentials and transferred ₹1.18 lakh from his account. Police seized ₹2.5 lakh in cash, 39 phones, and electronic devices during the raid. This case highlights how cloned websites can lure victims into disclosing sensitive banking data.",
    detectionTips: [
      "Always verify bank URLs manually—fake sites often mimic banking pages.",
      "Never call numbers shared over messages; use official bank contacts.",
      "Report suspicious login requests or unauthorized OTP prompts immediately."
    ],
    tags: ["BankingFraud", "Phishing", "FakeBankSite"],
    platform: ["Website", "Phone"],
    regions: ["Kolkata", "Jharkhand"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/ranchi/four-held-for-cyber-fraud/articleshow/122939243.cms"
    ],
    fraudScore: 85
  },
  {
    title: "SBI Staffer Embezzles ₹4 Crore from FD Accounts",
    summary: "In Faridkot district (Punjab), a clerical staffer at SBI systematically drained nearly ₹4 crore from FD account holders across ~70 accounts. Unauthorized withdrawals from fixed deposits were detected when customers reported missing funds. The accused fled after an FIR was lodged. This incident exposes the risk posed by internal collusion in banking institutions.",
    detectionTips: [
      "Check statements regularly—even for trustable institutions.",
      "Withdrawals from fixed deposits should have proper documentation.",
      "Report discrepancies immediately to bank higher authorities."
    ],
    tags: ["BankingFraud", "InternalFraud", "FDWithdrawal"],
    platform: ["Bank Branch"],
    regions: ["Punjab"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/chandigarh/in-sadiq-fir-against-sbi-staffer-over-rs-4cr-fraud/articleshow/122844598.cms"
    ],
    fraudScore: 88
  },
  {
    title: "Mule Accounts Used to Funnel ₹7.3 Crore Scam",
    summary: "In Mumbai, Rahul Gawli was arrested for registering multiple **mule accounts** using his documents. Scammers used these accounts to ferry ₹7.3 crore from a WhatsApp-based bogus investment scheme. The victim was lured via staged payouts to invest higher sums; once withdrawals were blocked, police stepped in after complaints. This demonstrates the growing trend of identity misuse and channeling funds via recruited individuals.",
    detectionTips: [
      "Never rent your ID or address details for others to open accounts.",
      "Be skeptical of investment schemes promising staged payouts.",
      "Verify platforms—even tiny payouts may be bait for bigger losses."
    ],
    tags: ["BankingFraud", "MuleAccountFraud", "InvestmentScam"],
    platform: ["Bank Account", "WhatsApp"],
    regions: ["Mumbai"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/mumbai/7-3cr-fraud-man-who-gave-docus-to-open-mule-a/c-held/articleshow/122590377.cms"
    ],
    fraudScore: 90
  },
  {
    title: "Bank Manager Aided ₹4.65 Crore Scam via Forged Account",
    summary: "A relationship manager at a Gujarat private bank was arrested after helping fraudsters open a corporate account using **forged documents**. Over ₹4.65 crore was funneled through the fake account 'Shiv Corporation'. The manager bypassed verification in exchange for commission. The fraud was unearthed during CID raids and highlights internal exploitation of bank systems.",
    detectionTips: [
      "Check for unfamiliar staff at branch verification.",
      "Banks should verify credentials via KYC and field visits.",
      "Customers should track major FD or loan sanctions personally."
    ],
    tags: ["BankingFraud", "InternalCollusion", "ForgedAccount"],
    platform: ["Bank Internal"],
    regions: ["Gujarat"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/ahmedabad/banker-held-for-aiding-cyberfrauds-open-account-using-forged-papers/articleshow/122887818.cms"
    ],
    fraudScore: 89
  },
  {
    title: "Loan Fraud via Co‑operative Bank – ₹122 Crore Embezzlement",
    summary: "New India Co‑operative Bank in Mumbai faced a ₹122 crore fraud alleged against senior staff including its GM and ex-chairman. RBI identified missing funds from branch safes and imposed withdrawal restrictions. The bank’s board was superseded and a Blue Corner notice issued for the absconding accused. Deposit holders remain affected even after seizing assets worth ₹28 crore.",
    detectionTips: [
      "Deposits beyond insured limits in small banks carry risk.",
      "Monitor audit reports and RBI circulars for banking irregularities.",
      "Prefer regulated public/private bank for larger savings."
    ],
    tags: ["BankingFraud", "CooperativeBankScam", "Embezzlement"],
    platform: ["Bank Internal"],
    regions: ["Mumbai"],
    sourceUrls: [
      "https://en.wikipedia.org/wiki/New_India_Cooperative_Bank"
    ],
    fraudScore: 94
  },

  // 14️⃣ Romance Fraud / Crypto Trap Scam Entries (5)
  {
    title: "Ahmedabad Restaurant Owner Duped of ₹1.42 Crore via Matrimony Crypto Scam",
    summary: "In Ahmedabad, a restaurant owner befriended “Gurleen Agarwal” via a matrimonial app in mid‑2024. She posed as a jewellery trader and fashion designer, built an emotional bond, and persuaded him to invest in a fake USDT trading platform. Small payouts were initially shown to build trust, but later, withdrawal was blocked and demands for ‘profit taxes’ followed. Investigators found her profile photos were stolen from a real person named Reena Sharma. A case under cheating and IT Act sections was filed when the victim reported the fraud to cybercrime police.",
    detectionTips: [
      "Be suspicious of profiles claiming romance and investment in same conversation.",
      "Avoid sharing personal documents or investing via links provided by online contacts.",
      "Request withdrawal—even small amounts—early to test legitimacy before investing more."
    ],
    tags: ["RomanceFraud","CryptoTrap","MatrimonyScam"],
    platform: ["Matrimonial App","WhatsApp","Fake Trading Platform"],
    regions: ["Ahmedabad"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/ahmedabad/restaurant-owner-scammed-out-of-1-42cr/articleshow/122423158.cms"
    ],
    fraudScore: 92
  },
  {
    title: "Bengaluru Man Loses ₹38.85 Lakh via Crypto-Matrimony Scam",
    summary: "A Bengaluru pre‑owned bike dealer met “Lakshmi Priya” on a matrimonial site, progressed via family‑styled group video calls and crypto investment pitches. Beginning with ₹65,000, he was shown fake returns until he had invested nearly ₹25 lakh. When told to pay ₹21 lakh as “UK taxes” to withdraw, he borrowed heavily. Once the funds were transferred, she disappeared. The entire scheme, orchestrated through a platform called Bost Base, resulted in a reported loss of ₹38.85 lakh. The victim filed an FIR under IPC Section 420 for fraud.",
    detectionTips: [
      "Question ‘tax’ fees before withdrawal—legitimate platforms do not impose surprise charges.",
      "Avoid investment pitches via matrimonial chats or sudden family contacts.",
      "Be wary if withdrawals get blocked after initial rewards."
    ],
    tags: ["RomanceFraud","CryptoTrap","PigButchering"],
    platform: ["Matrimonial Site","WhatsApp","Bost Base (Fake Crypto Link)"],
    regions: ["Bengaluru"],
    sourceUrls: [
      "https://bangaloremirror.indiatimes.com/bangalore/crime/romance‑turns‑rogue‑bengaluru‑man‑duped‑in‑crypto‑matrimony‑scam/articleshow/121632436.cms"
    ],
    fraudScore: 90
  },
  {
    title: "Kozhikode Woman Dupes Thozhukal Teacher of ₹40 Lakh in Crypto Scam",
    summary: "A school teacher was introduced to a woman via Facebook who claimed to be a doctor-turned-trader. He initially invested small and was shown $120 profit; convinced, he escalated to ₹40 lakh. The woman fabricated an account statement claiming ₹80 crore earnings, and demanded ₹40 lakh in ‘tax’ to release funds. The victim recognized the deception after expert consultation and filed a complaint. Police registered cases under IT and criminal breach laws.",
    detectionTips: [
      "Very high earnings claims from unknown people should raise immediate red flags.",
      "Avoid large investments with people met online even if they show small gains.",
      "Verify sites independently before investing significant sums."
    ],
    tags: ["RomanceFraud","CryptoTrap","ITBreach"],
    platform: ["Facebook","WhatsApp","Online Crypto Platform"],
    regions: ["Thozhukal, Kerala"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/thiruvananthapuram/woman‑booked‑for‑cheating‑teacher‑of‑40l/articleshow/122843789.cms"
    ],
    fraudScore: 89
  },
  {
    title: "US-Based Indian Techie Loses ₹3.73 Crore to Hinge Deepfake Crypto Scam",
    summary: "Shreya Datta, a software professional in the US, met someone on the dating app Hinge who posed as a French wine trader. Over months, she engaged via WhatsApp and AI-generated video calls, then was asked to download a crypto trading app. Early withdrawals were allowed to build trust, and she invested nearly ₹3.73 crore. Withdrawal requests triggered fake tax demands. Post-realization, she suffered trauma and reported the fraud, but funds remained inaccessible. The account featured deepfake visuals and scripted persuasion that victims described as mentally overwhelming.",
    detectionTips: [
      "Be cautious of romantic conversations evolving quickly into financial investment.",
      "Never download crypto apps shared by strangers on dating platforms.",
      "Initial payouts may lure you—stop investing if withdrawal is delayed or blocked."
    ],
    tags: ["RomanceFraud","CryptoTrap","Deepfake"],
    platform: ["Dating App (Hinge)","WhatsApp","Fake Crypto App"],
    regions: ["US-based Indian victim"],
    sourceUrls: [
      "https://www.india today.in/world/indians‑abroad/story/indian‑woman‑in‑us‑loses‑her‑life‑savings‑to‑crypto‑scammer‑she‑met‑on‑dating‑app‑hinge‑2507133‑2024‑02‑26",
      "https://www.moneycontrol.com/news/trends/indian‑techie‑in‑us‑lost‑crores‑to‑deepfake‑using‑crypto‑scammer‑she‑met‑on‑hinge‑12352801.html"
    ],
    fraudScore: 95
  },
  {
    title: "Pune Lecturer Fakes Death After Australian Romance Crypto Scam (AU$‑640K Loss)",
    summary: "Abhishek Shukla, posing as Dr Rohit Oberoi, wooed a woman in Australia via matrimonial websites, then engaged in joint crypto investments. After building trust, he claimed terminal illness and later sent a fake death notice. The victim had transferred over AU$641,000. Pune cyber police later arrested him for impersonation and fraud. The scam demonstrates the level of psychological manipulation and cross-border coordination involved.",
    detectionTips: [
      "Romance profiles with academic or influencer credentials may still be fake—do your own verification.",
      "Avoid large joint investments proposed early in the relationship.",
      "If contact ceases after sensitive events (illness, death), stay alert—it might be manipulation."
    ],
    tags: ["RomanceFraud","CryptoTrap","Impersonation"],
    platform: ["Matrimony Website","WhatsApp","International Bank Transfers"],
    regions: ["Pune / Australia"],
    sourceUrls: [
      "https://www.couriermail.com.au/news/abhishek‑shukla‑arrested‑in‑india‑after‑allegedly‑scamming‑woman‑out‑of‑650k‑and‑faking‑death/news‑story/d6c46b3d3853180d9d858a95b81d7206"
    ],
    fraudScore: 93
  },

  // 15️⃣ Digital Arrest Scam Entries (5)
  {
    title: "Retired Civil Contractor Loses ₹88 Lakh in Digital Arrest Scam (Ballari)",
    summary: "A retired civil contractor in Ballari, Karnataka was defrauded of ₹88.2 lakh when scammers posed as CBI/ED officials via video calls. They claimed his ATM card was linked to a money laundering racket tied to Jet Airways and forced him to remain on call for days. The fraudsters sent fake legal documents, conducted virtual interrogations, and coerced him into repeated transfers to evade arrest. Ultimately, he transferred large sums over two weeks under duress before realizing the scam and filing an FIR.",
    detectionTips: [
      "No law enforcement agency arrests or prosecutes via video call.",
      "Fake identification documents can be forged—never assume authenticity.",
      "Be skeptical of ongoing demands and threats even if they seem urgent."
    ],
    tags: ["DigitalArrest","Impersonation","Extortion"],
    platform: ["WhatsApp","Video Call"],
    regions: ["Ballari, Karnataka"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/hubballi/retired-civil-contractor-loses-rs-88-lakh-in-digital-arrest-scam-in-ballari/articleshow/122937894.cms"
    ],
    fraudScore: 94
  },
  {
    title: "Noida Family Scammed Over ₹1.10 Crore During Five-Day 'Digital Arrest'",
    summary: "A family in Noida was coerced into transferring ₹1.10 crore over five days by fraudsters impersonating officials from agencies like TRAI and the Cyber Crime Branch. The scammers claimed the family's Aadhaar and mobile number were linked to criminal activity. Through consecutive video calls, they threatened arrest of family members unless the money was paid. Terrified, the victims complied until educational realization led them to approach police and lodge a complaint.",
    detectionTips: [
      "True investigations don’t involve prolonged video surveillance or ransom threats.",
      "Always check with official police channels if you’re told about legal accusations.",
      "Never transfer funds under pressure—even to seemingly professional-sounding 'officials.'"
    ],
    tags: ["DigitalArrest","VideoExtortion","Family"],
    platform: ["WhatsApp","Video Call"],
    regions: ["Noida, Uttar Pradesh"],
    sourceUrls: [
      "https://www.livemint.com/news/digital-arrest-scam-noida-family-loses-rs-1-10-crore-to-cyber-criminals-heres-what-happened-11739277596198.html",
      "https://www.indiatvnews.com/technology/news/noida-family-fooled-in-digital-arrest-scam-lost-rs-1-crore-fraudsters-posed-as-cops-2025-02-11-975720"
    ],
    fraudScore: 96
  },
  {
    title: "Elderly Surat Resident Loses ₹16.65 Lakh to Fake ‘Digital Arrest’",
    summary: "An 81‑year‑old man from Surat was defrauded of ₹16.65 lakh after scammers, posing as Delhi Police, accused him of money laundering. They conducted Skype video calls, displayed forged Supreme Court warrant, and fake identification docs to create credibility. The victim was told a bank account was opened in his name for criminal use and told to swiftly pay to avoid prosecution. Under psychological pressure, he complied before discovering it was a scam.",
    detectionTips: [
      "Do not panic when threatened online—law enforcement never arrests civilians via video calls.",
      "If in doubt, hang up and independently verify the claim via official police stations.",
      "Never trust unexpectedly appearing legal warrant or documents via WhatsApp or email."
    ],
    tags: ["DigitalArrest","ElderlyScam","ImpersonationFraud"],
    platform: ["Phone Call","Video Call"],
    regions: ["Surat, Gujarat"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/business/cybersecurity/digital-arrest-cyber-scam-elderly-surat-man-loses-rs-16-65-lakh-to-fraudsters-posing-as-police-officers/articleshow/121391732.cms"
    ],
    fraudScore: 90
  },
  {
    title: "Two Bengaluru Women Held Under Digital Arrest Video Call for Nine Hours",
    summary: "Fraudsters pretending to be Mumbai police coerced two Bengaluru women into staying on video call for nearly nine hours and conducting a fake ‘medical examination’ requiring them to strip to verify moles and tattoos. They claimed involvement in narcotics or money laundering and issued fake warrants. The video call was used to intimidate and extract ₹58,477 under threat of arrest, demonstrating an extreme form of psychological manipulation via video control.",
    detectionTips: [
      "Any demand to expose your body virtually is a major red flag—legitimate officials never do so.",
      "Investigation exams cannot be conducted over video calls or involve stripping.",
      "Immediately terminate any call making such demands and report to cybercrime helpline 1930."
    ],
    tags: ["DigitalArrest","VideoExtortion","PhysicalCoercion"],
    platform: ["WhatsApp Video Call"],
    regions: ["Bengaluru, Karnataka"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/bengaluru/cybercrooks-keep-two-bengaluru-women-under-digital-arrest-make-them-strip/articleshow/122843392.cms"
    ],
    fraudScore: 95
  },
  {
    title: "UP STF Busts Cyber Gang Behind ₹95 Lakh Digital Arrest Con",
    summary: "The UP Special Task Force arrested two individuals in Thane suspected of orchestrating a ₹95 lakh digital arrest scam targeting a senior academic from Lucknow. The gang used deepfake video visuals, fictional logistics companies, and official uniforms to intimidate victims. Investigations revealed the use of multiple phone numbers, fake identity documents, and technical infrastructure across states. Authorities seized phones, laptops, ATM cards, Aadhaar copies, and initiated a multi-state cyberfraud probe.",
    detectionTips: [
      "Deepfake videos and fabricated uniforms can fool victims—never take visual cues at face value.",
      "Report suspicious calls immediately and file FIRs without delay.",
      "Preserve all screenshots, call records, and payment receipts as evidence."
    ],
    tags: ["DigitalArrest","Deepfake","GangBust"],
    platform: ["Video Call","WhatsApp"],
    regions: ["Lucknow, Maharashtra"],
    sourceUrls: [
      "https://timesofindia.indiatimes.com/city/lucknow/up-stf-busts-gang-behind-digital-arrest-ofacademic-who-lost-rs95l-2-held-from-thane/articleshow/122940136.cms"
    ],
    fraudScore: 93
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scamdex', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await ScamReport.deleteMany({});
    console.log('🗑️  Cleared existing scam reports');

    // Insert seed data
    const insertedScams = await ScamReport.insertMany(seedScams);
    console.log(`✅ Inserted ${insertedScams.length} Ponzi scheme scam reports`);

    // Log statistics
    const stats = await ScamReport.aggregate([
      {
        $group: {
          _id: null,
          totalScams: { $sum: 1 },
          avgFraudScore: { $avg: '$fraudScore' },
          totalRegions: { $addToSet: '$regions' }
        }
      }
    ]);

    console.log('📊 Database Statistics:');
    console.log(`   Total Ponzi Scams: ${stats[0].totalScams}`);
    console.log(`   Average Fraud Score: ${stats[0].avgFraudScore.toFixed(1)}`);

    // Get tag statistics
    const tagStats = await ScamReport.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('🏷️  Tag Statistics:');
    tagStats.forEach(tag => {
      console.log(`   ${tag._id}: ${tag.count} scams`);
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('🚀 ScamDex 2.0 now has 45 comprehensive scam entries!');
    console.log('   📊 5 Major Ponzi Scheme Scams');
    console.log('   📧 5 Phishing Email Scams');
    console.log('   💰 5 Loan Fraud Scams');
    console.log('   💸 5 UPI Fraud Scams');
    console.log('   👔 5 Job Scam Entries');
    console.log('   🪙 5 CryptoTrap Scam Entries');
    console.log('   🏦 5 Banking Fraud Scam Entries');
    console.log('   💔 5 Romance Fraud Scam Entries');
    console.log('   🚨 5 Digital Arrest Scam Entries');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedScams, seedDatabase }; 