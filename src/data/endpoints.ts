import { EndpointSpec } from "../types";

export const API_ENDPOINTS: EndpointSpec[] = [
  // Auth
  {
    id: "auth-login",
    category: "Auth",
    name: "User Login",
    method: "POST",
    path: "/api/v1/auth/login",
    description: "Authenticates investor with email & password, returns JWT tokens and user profile.",
    defaultBody: {
      email: "demo@growwealth.in",
      password: "Password123"
    }
  },
  {
    id: "auth-signup",
    category: "Auth",
    name: "User Registration",
    method: "POST",
    path: "/api/v1/auth/signup",
    description: "Registers a new investor account with PAN & KYC initialization.",
    defaultBody: {
      name: "Rohit Sharma",
      email: "rohit.sharma@example.com",
      password: "SecurePassword123",
      phone: "+91 98200 12345"
    }
  },
  {
    id: "auth-refresh",
    category: "Auth",
    name: "Refresh Token",
    method: "POST",
    path: "/api/v1/auth/refresh",
    description: "Rotates expired access token using valid refresh token.",
    defaultBody: {
      refresh_token: "jwt_ref_sample_token"
    }
  },
  {
    id: "auth-logout",
    category: "Auth",
    name: "User Logout",
    method: "POST",
    path: "/api/v1/auth/logout",
    description: "Revokes refresh tokens and terminates active mobile session.",
    requiresAuth: true
  },

  // User Profile
  {
    id: "user-profile",
    category: "User",
    name: "Get User Profile",
    method: "GET",
    path: "/api/v1/user/profile",
    description: "Fetches investor details, PAN verification status, and KYC level.",
    requiresAuth: true
  },
  {
    id: "user-update-profile",
    category: "User",
    name: "Update Profile",
    method: "PUT",
    path: "/api/v1/user/profile",
    description: "Updates contact phone, PAN number, or KYC status.",
    requiresAuth: true,
    defaultBody: {
      name: "Demo Investor",
      phone: "+91 98765 43210",
      pan: "ABCDE1234F",
      kyc_status: "verified"
    }
  },

  // Mutual Funds
  {
    id: "funds-categories",
    category: "Mutual Funds",
    name: "Get Categories",
    method: "GET",
    path: "/api/v1/funds/categories",
    description: "Retrieves fund categories: Equity, Debt, Hybrid, ELSS, and Index funds."
  },
  {
    id: "funds-top",
    category: "Mutual Funds",
    name: "Top Performing Funds",
    method: "GET",
    path: "/api/v1/funds/top-performing",
    description: "Returns top-performing mutual funds filtered by category and ranked by 1Y returns.",
    defaultQueryParams: {
      category: "equity",
      limit: "5"
    }
  },
  {
    id: "funds-detail",
    category: "Mutual Funds",
    name: "Fund Detail & Sheet",
    method: "GET",
    path: "/api/v1/funds/detail",
    description: "Returns complete fund metrics, AUM, expense ratio, exit load, top holdings, and NAV history.",
    defaultQueryParams: {
      id: "mf1"
    }
  },
  {
    id: "funds-search",
    category: "Mutual Funds",
    name: "Search Funds",
    method: "GET",
    path: "/api/v1/funds/search",
    description: "Searches mutual funds by scheme name, asset management company (AMC), or category.",
    defaultQueryParams: {
      q: "HDFC",
      limit: "10"
    }
  },

  // Goals
  {
    id: "goals-list",
    category: "Goals",
    name: "List Investment Goals",
    method: "GET",
    path: "/api/v1/goals/list",
    description: "Lists milestone goals: House, Car, Retirement, Education, Vacation, Startup, etc."
  },
  {
    id: "goals-funds",
    category: "Goals",
    name: "Goal Recommended Funds",
    method: "GET",
    path: "/api/v1/goals/funds",
    description: "Returns recommended fund baskets mapped to goal timeline and risk tolerance.",
    defaultQueryParams: {
      goal_id: "house",
      risk: "Moderate"
    }
  },

  // Portfolio
  {
    id: "portfolio-summary",
    category: "Portfolio",
    name: "Portfolio Summary",
    method: "GET",
    path: "/api/v1/portfolio/summary",
    description: "Calculates total invested, current valuation, total profit/loss, and portfolio XIRR.",
    requiresAuth: true
  },
  {
    id: "portfolio-holdings",
    category: "Portfolio",
    name: "Portfolio Holdings",
    method: "GET",
    path: "/api/v1/portfolio/holdings",
    description: "Lists active mutual fund holdings, folio numbers, units, invested amount, and returns.",
    requiresAuth: true
  },
  {
    id: "portfolio-invest",
    category: "Portfolio",
    name: "Execute Mutual Fund Order",
    method: "POST",
    path: "/api/v1/portfolio/invest",
    description: "Submits a buy/SIP order on the BSE Star MF gateway and credits units to portfolio.",
    requiresAuth: true,
    defaultBody: {
      fund_id: "mf1",
      amount: 5000,
      folio_number: "1234567890"
    }
  },

  // Watchlist
  {
    id: "watchlist-groups",
    category: "Watchlist",
    name: "Get Watchlist Groups",
    method: "GET",
    path: "/api/v1/watchlist/groups",
    description: "Retrieves user's custom watchlist collections with fund counts.",
    requiresAuth: true
  },
  {
    id: "watchlist-create-group",
    category: "Watchlist",
    name: "Create Watchlist Group",
    method: "POST",
    path: "/api/v1/watchlist/groups",
    description: "Creates a new custom watchlist group.",
    requiresAuth: true,
    defaultBody: {
      name: "Long Term Growth"
    }
  },
  {
    id: "watchlist-funds",
    category: "Watchlist",
    name: "Get Funds in Group",
    method: "GET",
    path: "/api/v1/watchlist/funds",
    description: "Fetches mutual funds contained in a specific watchlist folder.",
    requiresAuth: true,
    defaultQueryParams: {
      group_id: "wl1"
    }
  },
  {
    id: "watchlist-add-fund",
    category: "Watchlist",
    name: "Add Fund to Watchlist",
    method: "POST",
    path: "/api/v1/watchlist/funds",
    description: "Adds a mutual fund to a selected watchlist group.",
    requiresAuth: true,
    defaultBody: {
      group_id: "wl1",
      fund_id: "mf8"
    }
  },

  // Content & Config
  {
    id: "content-blogs",
    category: "Content & Config",
    name: "Educational Blogs",
    method: "GET",
    path: "/api/v1/content/blogs",
    description: "Returns wealth creation articles, SIP tutorials, and tax saving guides."
  },
  {
    id: "content-ads",
    category: "Content & Config",
    name: "Promotional Advisories",
    method: "GET",
    path: "/api/v1/content/ads",
    description: "Returns mobile app banners and goal planning advertisements."
  },
  {
    id: "market-indexes",
    category: "Content & Config",
    name: "Market Indexes",
    method: "GET",
    path: "/api/v1/market/indexes",
    description: "Live snapshot of benchmark indices: NIFTY 50, SENSEX, and NIFTY BANK."
  },
  {
    id: "config-design",
    category: "Content & Config",
    name: "Remote Design Config",
    method: "GET",
    path: "/api/v1/config/design",
    description: "Remote client theme palette and dynamic feature flags."
  }
];
