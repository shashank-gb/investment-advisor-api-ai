import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import JSZip from "jszip";

// In-memory Database State initialized with seed data matching PostgreSQL V2 migration
interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  pan?: string;
  kyc_status: string;
  created_at: string;
}

interface MutualFundRecord {
  id: string;
  name: string;
  amc: string;
  category: string;
  nav: number;
  returns1Y: number;
  returns3Y?: number;
  riskLevel: string;
  minInvestment: number;
}

interface FundDetailRecord {
  fundId: string;
  aum: string;
  expenseRatio: string;
  exitLoad: string;
  minSip: string;
  holdings: Array<{ name: string; companyName: string; weightage: number }>;
  performanceChart: Array<{ date: string; value: number }>;
}

interface PortfolioHoldingRecord {
  id: string;
  userId: string;
  fundId: string;
  units: number;
  investedAmount: number;
  folioNumber: string;
  createdAt: string;
}

interface WatchlistGroupRecord {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

interface WatchlistFundRecord {
  id: string;
  groupId: string;
  fundId: string;
  createdAt: string;
}

// Initial Database Data
const db = {
  users: [
    {
      id: "user_001",
      name: "Demo Investor",
      email: "demo@growwealth.in",
      password: "Password123",
      phone: "+91 98765 43210",
      pan: "ABCDE1234F",
      kyc_status: "verified",
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ] as UserRecord[],

  categories: [
    { id: "equity", name: "Equity", description: "Long-term wealth creation through equity asset allocation" },
    { id: "debt", name: "Debt", description: "Stable income and capital preservation through fixed income instruments" },
    { id: "hybrid", name: "Hybrid", description: "Balanced risk-adjusted returns combining equity and debt assets" },
    { id: "elss", name: "ELSS", description: "Tax-saving mutual funds under Section 80C with 3-year lock-in" },
    { id: "index", name: "Index", description: "Low-cost passive investing mirroring major benchmark indices" },
  ],

  funds: [
    {
      id: "mf1",
      name: "HDFC Top 100 Growth Fund",
      amc: "HDFC AMC",
      category: "equity",
      nav: 842.35,
      returns1Y: 22.4,
      returns3Y: 18.2,
      riskLevel: "Very High",
      minInvestment: 500,
    },
    {
      id: "mf2",
      name: "Axis Midcap Opportunities Fund",
      amc: "Axis AMC",
      category: "equity",
      nav: 156.8,
      returns1Y: 28.1,
      returns3Y: 21.5,
      riskLevel: "Very High",
      minInvestment: 500,
    },
    {
      id: "mf3",
      name: "ICICI Prudential Corporate Bond Fund",
      amc: "ICICI AMC",
      category: "debt",
      nav: 45.2,
      returns1Y: 8.2,
      returns3Y: 7.5,
      riskLevel: "Moderate",
      minInvestment: 1000,
    },
    {
      id: "mf4",
      name: "SBI Short Duration Bond Fund",
      amc: "SBI AMC",
      category: "debt",
      nav: 32.15,
      returns1Y: 7.1,
      returns3Y: 6.8,
      riskLevel: "Low to Moderate",
      minInvestment: 1000,
    },
    {
      id: "mf5",
      name: "Kotak Balanced Advantage Fund",
      amc: "Kotak AMC",
      category: "hybrid",
      nav: 78.9,
      returns1Y: 14.5,
      returns3Y: 12.3,
      riskLevel: "Moderately High",
      minInvestment: 500,
    },
    {
      id: "mf6",
      name: "Mirae Asset ELSS Tax Saver Fund",
      amc: "Mirae AMC",
      category: "elss",
      nav: 112.45,
      returns1Y: 19.8,
      returns3Y: 16.2,
      riskLevel: "Very High",
      minInvestment: 500,
    },
    {
      id: "mf7",
      name: "UTI Nifty 50 Index Fund",
      amc: "UTI AMC",
      category: "index",
      nav: 198.3,
      returns1Y: 20.1,
      returns3Y: 17.0,
      riskLevel: "Very High",
      minInvestment: 500,
    },
    {
      id: "mf8",
      name: "Parag Parikh Flexi Cap Fund",
      amc: "Parag Parikh AMC",
      category: "equity",
      nav: 67.9,
      returns1Y: 24.3,
      returns3Y: 19.4,
      riskLevel: "Very High",
      minInvestment: 500,
    },
  ] as MutualFundRecord[],

  fundDetails: {
    mf1: {
      fundId: "mf1",
      aum: "28,450 Cr",
      expenseRatio: "1.10%",
      exitLoad: "1.0% if redeemed within 365 days",
      minSip: "100",
      holdings: [
        { name: "HDFC Bank Ltd", companyName: "Financials", weightage: 9.5 },
        { name: "ICICI Bank Ltd", companyName: "Financials", weightage: 8.2 },
        { name: "Reliance Industries Ltd", companyName: "Energy & Petrochemicals", weightage: 7.1 },
        { name: "Infosys Ltd", companyName: "Information Technology", weightage: 5.4 },
        { name: "Tata Consultancy Services", companyName: "Information Technology", weightage: 4.8 },
        { name: "Bharti Airtel Ltd", companyName: "Telecommunication", weightage: 3.2 },
      ],
      performanceChart: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
        value: Number((810.0 + i * 1.1 + (i % 3 === 0 ? 2.5 : -1.0)).toFixed(2)),
      })),
    },
    mf2: {
      fundId: "mf2",
      aum: "24,100 Cr",
      expenseRatio: "1.25%",
      exitLoad: "1.0% if redeemed within 12 months",
      minSip: "500",
      holdings: [
        { name: "Trent Ltd", companyName: "Consumer Discretionary", weightage: 6.8 },
        { name: "The Indian Hotels Co Ltd", companyName: "Hospitality", weightage: 5.4 },
        { name: "Astral Ltd", companyName: "Industrials & Building", weightage: 4.9 },
        { name: "BSE Ltd", companyName: "Financial Infrastructure", weightage: 4.3 },
        { name: "Coforge Ltd", companyName: "Information Technology", weightage: 3.9 },
      ],
      performanceChart: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
        value: Number((142.0 + i * 0.5 + (i % 2 === 0 ? 1.2 : -0.7)).toFixed(2)),
      })),
    },
  } as Record<string, FundDetailRecord>,

  goals: [
    {
      id: "house",
      title: "HOUSE",
      description: "Save for your dream home down payment and interior corpus.",
      icon_data: "home",
      color_hex: "0xFF1A237E",
      category_ids: ["equity", "hybrid", "debt"],
    },
    {
      id: "car",
      title: "CAR",
      description: "Plan for your next vehicle purchase without debt burden.",
      icon_data: "directions_car",
      color_hex: "0xFF455A64",
      category_ids: ["hybrid", "debt"],
    },
    {
      id: "retirement",
      title: "RETIREMENT",
      description: "Build a comfortable, inflation-protected post-retirement corpus.",
      icon_data: "person",
      color_hex: "0xFF1B5E20",
      category_ids: ["equity", "hybrid"],
    },
    {
      id: "wedding",
      title: "WEDDING",
      description: "Secure milestone funds for your dream marriage celebration.",
      icon_data: "favorite",
      color_hex: "0xFFAD1457",
      category_ids: ["hybrid", "debt"],
    },
    {
      id: "education",
      title: "EDUCATION",
      description: "Fund world-class higher education for yourself or your child.",
      icon_data: "school",
      color_hex: "0xFF0D47A1",
      category_ids: ["equity", "elss"],
    },
    {
      id: "vacation",
      title: "VACATION",
      description: "Save ahead for international and domestic leisure travel.",
      icon_data: "flight",
      color_hex: "0xFF00796B",
      category_ids: ["debt", "hybrid"],
    },
    {
      id: "startup",
      title: "STARTUP",
      description: "Build seed capital and runway for your entrepreneurial vision.",
      icon_data: "rocket_launch",
      color_hex: "0xFFE65100",
      category_ids: ["equity", "index"],
    },
    {
      id: "emergency",
      title: "EMERGENCY",
      description: "Safe emergency liquid reserves for unexpected contingencies.",
      icon_data: "add_alert",
      color_hex: "0xFFC62828",
      category_ids: ["debt"],
    },
    {
      id: "others",
      title: "OTHERS",
      description: "Custom strategic investment plan for specialized goals.",
      icon_data: "more_horiz",
      color_hex: "0xFF455A64",
      category_ids: ["equity", "hybrid", "debt"],
    },
  ],

  portfolioHoldings: [
    {
      id: "ph_001",
      userId: "user_001",
      fundId: "mf1",
      units: 125.432,
      investedAmount: 100000,
      folioNumber: "1234567890",
      createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    },
    {
      id: "ph_002",
      userId: "user_001",
      fundId: "mf6",
      units: 890.12,
      investedAmount: 75000,
      folioNumber: "9876543210",
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
    {
      id: "ph_003",
      userId: "user_001",
      fundId: "mf3",
      units: 1650.0,
      investedAmount: 75000,
      folioNumber: "5555666677",
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ] as PortfolioHoldingRecord[],

  watchlistGroups: [
    { id: "wl1", userId: "user_001", name: "My Picks", createdAt: new Date().toISOString() },
    { id: "wl2", userId: "user_001", name: "Tax Saving", createdAt: new Date().toISOString() },
    { id: "wl3", userId: "user_001", name: "Retirement", createdAt: new Date().toISOString() },
  ] as WatchlistGroupRecord[],

  watchlistFunds: [
    { id: "wlf_1", groupId: "wl1", fundId: "mf1", createdAt: new Date().toISOString() },
    { id: "wlf_2", groupId: "wl1", fundId: "mf2", createdAt: new Date().toISOString() },
    { id: "wlf_3", groupId: "wl1", fundId: "mf7", createdAt: new Date().toISOString() },
    { id: "wlf_4", groupId: "wl2", fundId: "mf6", createdAt: new Date().toISOString() },
    { id: "wlf_5", groupId: "wl2", fundId: "mf7", createdAt: new Date().toISOString() },
    { id: "wlf_6", groupId: "wl3", fundId: "mf8", createdAt: new Date().toISOString() },
  ] as WatchlistFundRecord[],

  blogs: [
    {
      id: "b1",
      title: "Understanding SIP: Your Path to Wealth",
      subtitle: "Learn how disciplined rupee-cost averaging and compounding build wealth.",
      image_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
      action_url: "/blogs/b1",
      type: "blog",
    },
    {
      id: "b2",
      title: "ELSS vs PPF: Which Tax Saver Wins?",
      subtitle: "Compare 3-year lock-in with market returns against traditional fixed instruments.",
      image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      action_url: "/blogs/b2",
      type: "blog",
    },
    {
      id: "b3",
      title: "Navigating Market Volatility with Index Funds",
      subtitle: "Why passive indexing beats 75% of actively managed funds over a 10-year horizon.",
      image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      action_url: "/blogs/b3",
      type: "blog",
    },
  ],

  ads: [
    {
      id: "a1",
      title: "Start SIP from ₹500/month",
      subtitle: "Begin your systematic investment journey with zero advisory charges.",
      image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
      action_url: "/funds/categories",
      type: "ad",
    },
    {
      id: "g1",
      title: "Not sure where to invest? Plan by Goal",
      subtitle: "Select your target milestone and receive customized risk-weighted fund baskets.",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      action_url: "/goals",
      type: "ad",
    },
  ],

  marketIndexes: [
    { indexName: "NIFTY 50", last: 24150.7, previousClose: 24025.4, percChange: 0.52 },
    { indexName: "SENSEX", last: 79842.2, previousClose: 79430.05, percChange: 0.52 },
    { indexName: "NIFTY BANK", last: 51230.45, previousClose: 51319.65, percChange: -0.17 },
  ],
};

function formatFundDetail(fundId: string): FundDetailRecord {
  if (db.fundDetails[fundId]) {
    return db.fundDetails[fundId];
  }
  const fund = db.funds.find((f) => f.id === fundId) || db.funds[0];
  return {
    fundId: fund.id,
    aum: "18,500 Cr",
    expenseRatio: "0.85%",
    exitLoad: "1.0% if redeemed within 365 days",
    minSip: `${fund.minInvestment}`,
    holdings: [
      { name: "HDFC Bank Ltd", companyName: "Financials", weightage: 9.2 },
      { name: "ICICI Bank Ltd", companyName: "Financials", weightage: 7.9 },
      { name: "Reliance Industries", companyName: "Energy", weightage: 6.8 },
      { name: "Infosys Ltd", companyName: "Technology", weightage: 5.1 },
      { name: "TCS", companyName: "Technology", weightage: 4.5 },
    ],
    performanceChart: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
      value: Number((fund.nav * 0.95 + i * 0.2 + (i % 3 === 0 ? 0.8 : -0.4)).toFixed(2)),
    })),
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware allowing Flutter app and local testing
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get(["/api/health", "/api/v1/health", "/health"], (req, res) => {
    res.json({
      status: "UP",
      service: "growwealth-investment-advisor-backend",
      framework: "Java Spring Boot 3 & PostgreSQL (Live Gateway Simulator)",
      database: "PostgreSQL 16 (Connected)",
      active_users: db.users.length,
      mutual_funds: db.funds.length,
      timestamp: new Date().toISOString(),
    });
  });

  // Helper router for both /api/v1/* and /*
  const apiRouter = express.Router();

  // 1. AUTH ENDPOINTS
  apiRouter.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", statusCode: 400, code: "MISSING_CREDENTIALS" });
    }
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password", statusCode: 401, code: "INVALID_CREDENTIALS" });
    }

    const accessToken = `jwt_acc_${user.id}_${Date.now()}`;
    const refreshToken = `jwt_ref_${user.id}_${Date.now()}`;

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        pan: user.pan,
        kyc_status: user.kyc_status,
        created_at: user.created_at,
      },
    });
  });

  apiRouter.post("/auth/signup", (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required", statusCode: 400, code: "MISSING_FIELDS" });
    }
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists", statusCode: 409, code: "EMAIL_ALREADY_EXISTS" });
    }

    const newUser: UserRecord = {
      id: `usr_${Date.now().toString().slice(-8)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      phone: phone || "+91 90000 11111",
      pan: "ABCDE1234F",
      kyc_status: "pending",
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);

    const accessToken = `jwt_acc_${newUser.id}_${Date.now()}`;
    const refreshToken = `jwt_ref_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        pan: newUser.pan,
        kyc_status: newUser.kyc_status,
        created_at: newUser.created_at,
      },
    });
  });

  apiRouter.post("/auth/refresh", (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ message: "Refresh token is required", statusCode: 400, code: "MISSING_TOKEN" });
    }
    res.json({
      access_token: `jwt_acc_refreshed_${Date.now()}`,
      refresh_token: `jwt_ref_refreshed_${Date.now()}`,
    });
  });

  apiRouter.post("/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // 2. USER PROFILE ENDPOINTS
  apiRouter.get("/user/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    let user = db.users[0];
    if (authHeader && authHeader.includes("usr_")) {
      const match = authHeader.match(/usr_\d+/);
      if (match) {
        const found = db.users.find((u) => u.id === match[0]);
        if (found) user = found;
      }
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      pan: user.pan,
      kyc_status: user.kyc_status,
      created_at: user.created_at,
    });
  });

  apiRouter.put("/user/profile", (req, res) => {
    const user = db.users[0];
    const { name, phone, pan, kyc_status } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (pan) user.pan = pan.toUpperCase();
    if (kyc_status) user.kyc_status = kyc_status;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      pan: user.pan,
      kyc_status: user.kyc_status,
      created_at: user.created_at,
    });
  });

  // 3. MUTUAL FUNDS ENDPOINTS
  apiRouter.get("/funds/categories", (req, res) => {
    res.json({ data: db.categories });
  });

  apiRouter.get("/funds/top-performing", (req, res) => {
    const category = req.query.category as string;
    const limit = parseInt(req.query.limit as string) || 10;

    let list = [...db.funds];
    if (category && category.toLowerCase() !== "all") {
      list = list.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    list.sort((a, b) => b.returns1Y - a.returns1Y);
    res.json({ data: list.slice(0, limit) });
  });

  apiRouter.get("/funds/detail", (req, res) => {
    const fundId = (req.query.id as string) || "mf1";
    const fund = db.funds.find((f) => f.id === fundId) || db.funds[0];
    const detail = formatFundDetail(fund.id);

    res.json({
      data: {
        fund,
        aum: detail.aum,
        expenseRatio: detail.expenseRatio,
        exitLoad: detail.exitLoad,
        minSip: detail.minSip,
        holdings: detail.holdings,
        performanceChart: detail.performanceChart,
      },
    });
  });

  apiRouter.get("/funds/search", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase().trim();
    if (query.length < 2) {
      return res.json({ data: [] });
    }
    const limit = parseInt(req.query.limit as string) || 20;
    const results = db.funds.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.amc.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query)
    );
    res.json({ data: results.slice(0, limit) });
  });

  // 4. GOALS ENDPOINTS
  apiRouter.get("/goals/list", (req, res) => {
    res.json({ data: db.goals });
  });

  apiRouter.get(["/goals/funds", "/funds/goal-funds"], (req, res) => {
    const goalId = (req.query.goal_id as string) || "house";
    const risk = (req.query.risk as string || "").toLowerCase();

    const goal = db.goals.find((g) => g.id === goalId);
    let matched = goal
      ? db.funds.filter((f) => goal.category_ids.includes(f.category))
      : [...db.funds];

    if (risk.includes("low")) {
      matched = matched.filter((f) => f.riskLevel.toLowerCase().includes("low") || f.category === "debt");
    } else if (risk.includes("mod")) {
      matched = matched.filter((f) => f.riskLevel.toLowerCase().includes("moderate") || f.category === "hybrid");
    } else if (risk.includes("high")) {
      matched = matched.filter((f) => f.riskLevel.toLowerCase().includes("high") || f.category === "equity");
    }

    if (matched.length === 0) {
      matched = db.funds.slice(0, 3);
    }
    res.json({ data: matched });
  });

  // 5. PORTFOLIO ENDPOINTS (BSE Star MF Interface)
  apiRouter.get("/portfolio/summary", (req, res) => {
    const holdings = db.portfolioHoldings;
    let totalInvested = 0;
    let currentValue = 0;

    for (const h of holdings) {
      const fund = db.funds.find((f) => f.id === h.fundId) || db.funds[0];
      totalInvested += h.investedAmount;
      currentValue += h.units * fund.nav;
    }

    const totalReturns = currentValue - totalInvested;
    const returnsPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
    const xirr = returnsPercent > 0 ? Number((12.5 + returnsPercent * 0.25).toFixed(2)) : 0;

    res.json({
      total_invested: Number(totalInvested.toFixed(2)),
      current_value: Number(currentValue.toFixed(2)),
      total_returns: Number(totalReturns.toFixed(2)),
      returns_percent: Number(returnsPercent.toFixed(2)),
      xirr,
    });
  });

  apiRouter.get(["/portfolio/holdings", "/portfolio"], (req, res) => {
    const list = db.portfolioHoldings.map((h) => {
      const fund = db.funds.find((f) => f.id === h.fundId) || db.funds[0];
      const currentVal = h.units * fund.nav;
      const returns = currentVal - h.investedAmount;
      const returnsPercent = (returns / h.investedAmount) * 100;

      return {
        fund_id: fund.id,
        fund_name: fund.name,
        amc: fund.amc,
        units: Number(h.units.toFixed(4)),
        invested_amount: Number(h.investedAmount.toFixed(2)),
        current_value: Number(currentVal.toFixed(2)),
        returns: Number(returns.toFixed(2)),
        returns_percent: Number(returnsPercent.toFixed(2)),
        folio_number: h.folioNumber,
      };
    });

    res.json({ data: list });
  });

  apiRouter.post("/portfolio/invest", (req, res) => {
    const { fund_id, amount, folio_number } = req.body;
    if (!fund_id || !amount) {
      return res.status(400).json({ message: "fund_id and amount are required", statusCode: 400, code: "MISSING_PARAM" });
    }
    const fund = db.funds.find((f) => f.id === fund_id);
    if (!fund) {
      return res.status(404).json({ message: "Fund not found", statusCode: 404, code: "FUND_NOT_FOUND" });
    }

    const units = Number((amount / fund.nav).toFixed(4));
    const folio = folio_number || `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newHolding: PortfolioHoldingRecord = {
      id: `ph_${Date.now()}`,
      userId: "user_001",
      fundId: fund.id,
      units,
      investedAmount: Number(amount),
      folioNumber: folio,
      createdAt: new Date().toISOString(),
    };
    db.portfolioHoldings.unshift(newHolding);

    res.json({
      data: {
        fund_id: fund.id,
        fund_name: fund.name,
        amc: fund.amc,
        units,
        invested_amount: Number(amount),
        current_value: Number(amount),
        returns: 0.0,
        returns_percent: 0.0,
        folio_number: folio,
      },
      message: "Mutual fund order executed on BSE Star MF gateway",
    });
  });

  // 6. WATCHLIST ENDPOINTS
  apiRouter.get("/watchlist/groups", (req, res) => {
    const list = db.watchlistGroups.map((g) => ({
      id: g.id,
      name: g.name,
      fund_count: db.watchlistFunds.filter((wf) => wf.groupId === g.id).length,
    }));
    res.json({ data: list });
  });

  apiRouter.post("/watchlist/groups", (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Watchlist group name is required", statusCode: 400, code: "INVALID_NAME" });
    }
    const newGroup: WatchlistGroupRecord = {
      id: `wl_${Date.now()}`,
      userId: "user_001",
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    db.watchlistGroups.push(newGroup);
    res.status(201).json({ data: { id: newGroup.id, name: newGroup.name, fund_count: 0 } });
  });

  apiRouter.get("/watchlist/funds", (req, res) => {
    const groupId = (req.query.group_id as string) || "wl1";
    const fundsInGroup = db.watchlistFunds
      .filter((wf) => wf.groupId === groupId)
      .map((wf) => {
        const fund = db.funds.find((f) => f.id === wf.fundId) || db.funds[0];
        return {
          group_id: groupId,
          fund,
        };
      });
    res.json({ data: fundsInGroup });
  });

  apiRouter.post("/watchlist/funds", (req, res) => {
    const { group_id, fund_id } = req.body;
    if (!group_id || !fund_id) {
      return res.status(400).json({ message: "group_id and fund_id are required", statusCode: 400, code: "MISSING_PARAM" });
    }
    const exists = db.watchlistFunds.some((wf) => wf.groupId === group_id && wf.fundId === fund_id);
    if (!exists) {
      db.watchlistFunds.push({
        id: `wlf_${Date.now()}`,
        groupId: group_id,
        fundId: fund_id,
        createdAt: new Date().toISOString(),
      });
    }
    const fund = db.funds.find((f) => f.id === fund_id) || db.funds[0];
    res.json({ data: { group_id, fund } });
  });

  apiRouter.delete("/watchlist/funds", (req, res) => {
    const groupId = req.query.group_id as string;
    const fundId = req.query.fund_id as string;
    const index = db.watchlistFunds.findIndex((wf) => wf.groupId === groupId && wf.fundId === fundId);
    if (index !== -1) {
      db.watchlistFunds.splice(index, 1);
    }
    res.json({ message: "Fund removed from watchlist successfully" });
  });

  // 7. CONTENT & CONFIG ENDPOINTS
  apiRouter.get("/content/blogs", (req, res) => {
    res.json({ data: db.blogs });
  });

  apiRouter.get("/content/ads", (req, res) => {
    res.json({ data: db.ads });
  });

  apiRouter.get(["/market/indexes", "/market"], (req, res) => {
    res.json({ data: db.marketIndexes });
  });

  apiRouter.get("/config/design", (req, res) => {
    res.json({
      primaryColor: "#1A237E",
      secondaryColor: "#0D47A1",
      themeMode: "system",
      featureFlags: {
        enableKycUpload: true,
        enableGoalPlanning: true,
        enableSipCalculator: true,
        enableDirectAmcLinks: true,
      },
    });
  });

  // Mount API router to /api/v1 AND directly for maximum compatibility
  app.use("/api/v1", apiRouter);
  app.use("/", apiRouter);

  // 8. ZIP DOWNLOAD & CODE VIEWER API
  app.get("/api/download-project", async (req, res) => {
    try {
      const zip = new JSZip();
      const baseDir = path.join(process.cwd(), "backend-spring-boot");

      function addDirectoryToZip(dirPath: string, zipFolder: JSZip) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          const fullPath = path.join(dirPath, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            const subFolder = zipFolder.folder(file);
            if (subFolder) addDirectoryToZip(fullPath, subFolder);
          } else {
            const content = fs.readFileSync(fullPath);
            zipFolder.file(file, content);
          }
        }
      }

      if (fs.existsSync(baseDir)) {
        addDirectoryToZip(baseDir, zip);
      }

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=growwealth-spring-boot-backend.zip");
      res.send(zipBuffer);
    } catch (err: any) {
      console.error("Failed to generate zip", err);
      res.status(500).json({ error: "Failed to create project ZIP: " + err.message });
    }
  });

  // Supabase SQL Script Endpoints (Raw content & File download)
  app.get("/api/supabase-sql", (req, res) => {
    try {
      const sqlPath = path.join(process.cwd(), "backend-spring-boot/src/main/resources/db/supabase_complete_setup.sql");
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, "utf-8");
        res.json({ sql, filename: "supabase_complete_setup.sql" });
      } else {
        res.status(404).json({ error: "Supabase SQL script not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/download-supabase-sql", (req, res) => {
    try {
      const sqlPath = path.join(process.cwd(), "backend-spring-boot/src/main/resources/db/supabase_complete_setup.sql");
      if (fs.existsSync(sqlPath)) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=supabase_complete_setup.sql");
        const fileStream = fs.createReadStream(sqlPath);
        fileStream.pipe(res);
      } else {
        res.status(404).send("Supabase SQL file not found");
      }
    } catch (err: any) {
      res.status(500).send("Error reading SQL file: " + err.message);
    }
  });

  // Endpoint to fetch project files list and file content for web code viewer
  app.get("/api/source-tree", (req, res) => {
    try {
      const baseDir = path.join(process.cwd(), "backend-spring-boot");
      interface FileNode {
        name: string;
        path: string;
        type: "file" | "directory";
        children?: FileNode[];
        size?: number;
      }

      function buildTree(dir: string, relativePath = ""): FileNode[] {
        if (!fs.existsSync(dir)) return [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const nodes: FileNode[] = [];

        for (const entry of entries) {
          const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            nodes.push({
              name: entry.name,
              path: rel,
              type: "directory",
              children: buildTree(full, rel),
            });
          } else {
            nodes.push({
              name: entry.name,
              path: rel,
              type: "file",
              size: fs.statSync(full).size,
            });
          }
        }
        return nodes;
      }

      const tree = buildTree(baseDir);
      res.json({ tree });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/source-file", (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) {
      return res.status(400).json({ error: "Path parameter is required" });
    }
    // Prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(process.cwd(), "backend-spring-boot", safePath);

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({ error: "File not found" });
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    res.json({ path: safePath, content });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GrowWealth Backend Server & Live API Gateway running on port ${PORT}`);
  });
}

startServer();
