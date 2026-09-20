-- V1__init_schema.sql
-- GrowWealth Investment Advisor PostgreSQL Schema Migration

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    pan VARCHAR(20),
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS fund_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mutual_funds (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amc VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL REFERENCES fund_categories(id),
    nav NUMERIC(12, 2) NOT NULL,
    returns_1y NUMERIC(6, 2) NOT NULL,
    returns_3y NUMERIC(6, 2),
    risk_level VARCHAR(50) NOT NULL,
    min_investment NUMERIC(10, 2) NOT NULL DEFAULT 500.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_funds_category ON mutual_funds(category);
CREATE INDEX IF NOT EXISTS idx_funds_returns1y ON mutual_funds(returns_1y DESC);
CREATE INDEX IF NOT EXISTS idx_funds_name ON mutual_funds(name);

CREATE TABLE IF NOT EXISTS fund_details (
    fund_id VARCHAR(64) PRIMARY KEY REFERENCES mutual_funds(id) ON DELETE CASCADE,
    aum VARCHAR(50) NOT NULL,
    expense_ratio VARCHAR(20) NOT NULL,
    exit_load TEXT NOT NULL,
    min_sip VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS fund_holdings (
    id BIGSERIAL PRIMARY KEY,
    fund_id VARCHAR(64) NOT NULL REFERENCES mutual_funds(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    weightage NUMERIC(5, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fund_holdings_fund ON fund_holdings(fund_id);

CREATE TABLE IF NOT EXISTS fund_nav_history (
    id BIGSERIAL PRIMARY KEY,
    fund_id VARCHAR(64) NOT NULL REFERENCES mutual_funds(id) ON DELETE CASCADE,
    nav_date DATE NOT NULL,
    nav_value NUMERIC(10, 2) NOT NULL,
    UNIQUE(fund_id, nav_date)
);

CREATE INDEX IF NOT EXISTS idx_nav_history_fund_date ON fund_nav_history(fund_id, nav_date DESC);

CREATE TABLE IF NOT EXISTS investment_goals (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_data VARCHAR(100) NOT NULL,
    color_hex VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS goal_categories (
    goal_id VARCHAR(50) NOT NULL REFERENCES investment_goals(id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL REFERENCES fund_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (goal_id, category_id)
);

CREATE TABLE IF NOT EXISTS watchlist_groups (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist_groups(user_id);

CREATE TABLE IF NOT EXISTS watchlist_funds (
    id VARCHAR(64) PRIMARY KEY,
    group_id VARCHAR(64) NOT NULL REFERENCES watchlist_groups(id) ON DELETE CASCADE,
    fund_id VARCHAR(64) NOT NULL REFERENCES mutual_funds(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, fund_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_funds_group ON watchlist_funds(group_id);

CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fund_id VARCHAR(64) NOT NULL REFERENCES mutual_funds(id) ON DELETE CASCADE,
    units NUMERIC(14, 4) NOT NULL,
    invested_amount NUMERIC(14, 2) NOT NULL,
    folio_number VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio_holdings(user_id);

CREATE TABLE IF NOT EXISTS content_items (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NOT NULL,
    image_url VARCHAR(512),
    action_url VARCHAR(512),
    type VARCHAR(20) NOT NULL CHECK (type IN ('blog', 'ad')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS market_indexes (
    index_name VARCHAR(100) PRIMARY KEY,
    last_value NUMERIC(12, 2) NOT NULL,
    previous_close NUMERIC(12, 2) NOT NULL,
    perc_change NUMERIC(6, 2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
