-- V2__seed_mutual_funds.sql
-- Seed Categories, Mutual Funds, Fund Details, Holdings, NAV History, Goals, Content, and Demo User

-- 1. Fund Categories
INSERT INTO fund_categories (id, name, description, display_order) VALUES
('equity', 'Equity', 'Long-term wealth creation through equity asset allocation', 1),
('debt', 'Debt', 'Stable income and capital preservation through fixed income instruments', 2),
('hybrid', 'Hybrid', 'Balanced risk-adjusted returns combining equity and debt assets', 3),
('elss', 'ELSS', 'Tax-saving mutual funds under Section 80C with 3-year lock-in', 4),
('index', 'Index', 'Low-cost passive investing mirroring major benchmark indices', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. Mutual Funds
INSERT INTO mutual_funds (id, name, amc, category, nav, returns_1y, returns_3y, risk_level, min_investment) VALUES
('mf1', 'HDFC Top 100 Growth Fund', 'HDFC AMC', 'equity', 842.35, 22.40, 18.20, 'Very High', 500.00),
('mf2', 'Axis Midcap Opportunities Fund', 'Axis AMC', 'equity', 156.80, 28.10, 21.50, 'Very High', 500.00),
('mf3', 'ICICI Prudential Corporate Bond Fund', 'ICICI AMC', 'debt', 45.20, 8.20, 7.50, 'Moderate', 1000.00),
('mf4', 'SBI Short Duration Bond Fund', 'SBI AMC', 'debt', 32.15, 7.10, 6.80, 'Low to Moderate', 1000.00),
('mf5', 'Kotak Balanced Advantage Fund', 'Kotak AMC', 'hybrid', 78.90, 14.50, 12.30, 'Moderately High', 500.00),
('mf6', 'Mirae Asset ELSS Tax Saver Fund', 'Mirae AMC', 'elss', 112.45, 19.80, 16.20, 'Very High', 500.00),
('mf7', 'UTI Nifty 50 Index Fund', 'UTI AMC', 'index', 198.30, 20.10, 17.00, 'Very High', 500.00),
('mf8', 'Parag Parikh Flexi Cap Fund', 'Parag Parikh AMC', 'equity', 67.90, 24.30, 19.40, 'Very High', 500.00)
ON CONFLICT (id) DO NOTHING;

-- 3. Fund Details
INSERT INTO fund_details (fund_id, aum, expense_ratio, exit_load, min_sip) VALUES
('mf1', '28,450 Cr', '1.10%', '1.0% if redeemed within 365 days', '100'),
('mf2', '24,100 Cr', '1.25%', '1.0% if redeemed within 12 months', '500'),
('mf3', '18,320 Cr', '0.62%', 'Nil', '1000'),
('mf4', '14,900 Cr', '0.45%', 'Nil', '1000'),
('mf5', '16,750 Cr', '0.95%', '1.0% if redeemed before 90 days', '500'),
('mf6', '22,600 Cr', '0.85%', 'Nil (Statutory 3 years lock-in period)', '500'),
('mf7', '17,200 Cr', '0.20%', 'Nil', '500'),
('mf8', '56,800 Cr', '0.72%', '2.0% if redeemed within 365 days, 1.0% between 366-730 days', '1000')
ON CONFLICT (fund_id) DO NOTHING;

-- 4. Fund Holdings
INSERT INTO fund_holdings (fund_id, name, company_name, weightage) VALUES
('mf1', 'HDFC Bank Ltd', 'Financials', 9.50),
('mf1', 'ICICI Bank Ltd', 'Financials', 8.20),
('mf1', 'Reliance Industries Ltd', 'Energy & Petrochemicals', 7.10),
('mf1', 'Infosys Ltd', 'Information Technology', 5.40),
('mf1', 'Tata Consultancy Services', 'Information Technology', 4.80),
('mf1', 'Bharti Airtel Ltd', 'Telecommunication', 3.20),

('mf2', 'Trent Ltd', 'Consumer Discretionary', 6.80),
('mf2', 'The Indian Hotels Co Ltd', 'Hospitality', 5.40),
('mf2', 'Astral Ltd', 'Industrials & Building', 4.90),
('mf2', 'BSE Ltd', 'Financial Infrastructure', 4.30),
('mf2', 'Coforge Ltd', 'Information Technology', 3.90),

('mf6', 'HDFC Bank Ltd', 'Financials', 9.10),
('mf6', 'ICICI Bank Ltd', 'Financials', 7.80),
('mf6', 'Reliance Industries Ltd', 'Energy', 6.50),
('mf6', 'Larsen & Toubro Ltd', 'Capital Goods', 4.70),
('mf6', 'Axis Bank Ltd', 'Financials', 4.20);

-- 5. Fund NAV History (Past 30 days)
INSERT INTO fund_nav_history (fund_id, nav_date, nav_value)
SELECT 
    'mf1', 
    (CURRENT_DATE - (i || ' days')::interval)::date,
    ROUND((810.0 + (i * 1.08) + (CASE WHEN i % 3 = 0 THEN 2.5 ELSE -1.2 END))::numeric, 2)
FROM generate_series(0, 30) i
ON CONFLICT (fund_id, nav_date) DO NOTHING;

INSERT INTO fund_nav_history (fund_id, nav_date, nav_value)
SELECT 
    'mf2', 
    (CURRENT_DATE - (i || ' days')::interval)::date,
    ROUND((145.0 + (i * 0.38) + (CASE WHEN i % 2 = 0 THEN 0.8 ELSE -0.5 END))::numeric, 2)
FROM generate_series(0, 30) i
ON CONFLICT (fund_id, nav_date) DO NOTHING;

-- 6. Investment Goals
INSERT INTO investment_goals (id, title, description, icon_data, color_hex) VALUES
('house', 'HOUSE', 'Save for your dream home down payment and interior corpus.', 'home', '0xFF1A237E'),
('car', 'CAR', 'Plan for your next vehicle purchase without debt burden.', 'directions_car', '0xFF455A64'),
('retirement', 'RETIREMENT', 'Build a comfortable, inflation-protected post-retirement corpus.', 'person', '0xFF1B5E20'),
('wedding', 'WEDDING', 'Secure milestone funds for your dream marriage celebration.', 'favorite', '0xFFAD1457'),
('education', 'EDUCATION', 'Fund world-class higher education for yourself or your child.', 'school', '0xFF0D47A1'),
('vacation', 'VACATION', 'Save ahead for international and domestic leisure travel.', 'flight', '0xFF00796B'),
('startup', 'STARTUP', 'Build seed capital and runway for your entrepreneurial vision.', 'rocket_launch', '0xFFE65100'),
('emergency', 'EMERGENCY', 'Safe emergency liquid reserves for unexpected contingencies.', 'add_alert', '0xFFC62828'),
('others', 'OTHERS', 'Custom strategic investment plan for specialized goals.', 'more_horiz', '0xFF455A64')
ON CONFLICT (id) DO NOTHING;

-- 7. Goal Categories Mapping
INSERT INTO goal_categories (goal_id, category_id) VALUES
('house', 'equity'), ('house', 'hybrid'), ('house', 'debt'),
('car', 'hybrid'), ('car', 'debt'),
('retirement', 'equity'), ('retirement', 'hybrid'),
('wedding', 'hybrid'), ('wedding', 'debt'),
('education', 'equity'), ('education', 'elss'),
('vacation', 'debt'), ('vacation', 'hybrid'),
('startup', 'equity'), ('startup', 'index'),
('emergency', 'debt'),
('others', 'equity'), ('others', 'hybrid'), ('others', 'debt')
ON CONFLICT DO NOTHING;

-- 8. Content Items (Blogs & Ads)
INSERT INTO content_items (id, title, subtitle, image_url, action_url, type) VALUES
('b1', 'Understanding SIP: Your Path to Wealth', 'Learn how disciplined rupee-cost averaging and compounding build wealth.', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80', '/blogs/b1', 'blog'),
('b2', 'ELSS vs PPF: Which Tax Saver Wins?', 'Compare 3-year lock-in with market returns against traditional fixed instruments.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80', '/blogs/b2', 'blog'),
('b3', 'Navigating Market Volatility with Index Funds', 'Why passive indexing beats 75% of actively managed funds over a 10-year horizon.', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80', '/blogs/b3', 'blog'),
('a1', 'Start SIP from ₹500/month', 'Begin your systematic investment journey with zero advisory charges.', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80', '/funds/categories', 'ad'),
('g1', 'Not sure where to invest? Plan by Goal', 'Select your target milestone and receive customized risk-weighted fund baskets.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', '/goals', 'ad')
ON CONFLICT (id) DO NOTHING;

-- 9. Market Indexes
INSERT INTO market_indexes (index_name, last_value, previous_close, perc_change) VALUES
('NIFTY 50', 24150.70, 24025.40, 0.52),
('SENSEX', 79842.20, 79430.05, 0.52),
('NIFTY BANK', 51230.45, 51319.65, -0.17)
ON CONFLICT (index_name) DO UPDATE SET 
    last_value = EXCLUDED.last_value,
    previous_close = EXCLUDED.previous_close,
    perc_change = EXCLUDED.perc_change,
    updated_at = CURRENT_TIMESTAMP;

-- 10. Default Demo User (password is 'Password123' hashed with BCrypt)
INSERT INTO users (id, name, email, password_hash, phone, pan, kyc_status) VALUES
('user_001', 'Demo Investor', 'demo@growwealth.in', '$2a$10$7vNkWf7V4H9qV3b3mP5e4uJ5Lq.d8.x3S6m7n9/y6q1t.k2w8o7m6', '+91 98765 43210', 'ABCDE1234F', 'verified')
ON CONFLICT (id) DO NOTHING;

-- 11. Demo Portfolio Holdings for user_001
INSERT INTO portfolio_holdings (id, user_id, fund_id, units, invested_amount, folio_number) VALUES
('ph_001', 'user_001', 'mf1', 125.4320, 100000.00, '1234567890'),
('ph_002', 'user_001', 'mf6', 890.1200, 75000.00, '9876543210'),
('ph_003', 'user_001', 'mf3', 1650.0000, 75000.00, '5555666677')
ON CONFLICT (id) DO NOTHING;

-- 12. Demo Watchlist Groups & Funds
INSERT INTO watchlist_groups (id, user_id, name) VALUES
('wl1', 'user_001', 'My Picks'),
('wl2', 'user_001', 'Tax Saving'),
('wl3', 'user_001', 'Retirement')
ON CONFLICT (id) DO NOTHING;

INSERT INTO watchlist_funds (id, group_id, fund_id) VALUES
('wlf_1', 'wl1', 'mf1'),
('wlf_2', 'wl1', 'mf2'),
('wlf_3', 'wl1', 'mf7'),
('wlf_4', 'wl2', 'mf6'),
('wlf_5', 'wl2', 'mf7'),
('wlf_6', 'wl3', 'mf8')
ON CONFLICT (id) DO NOTHING;
