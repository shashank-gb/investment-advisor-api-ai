import React, { useState, useEffect } from "react";
import {
  Database,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Settings,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Table,
  Zap,
  Lock,
  Cpu
} from "lucide-react";

export const SupabaseSetupGuide: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"walkthrough" | "sql" | "generator" | "spring">("walkthrough");
  const [projectRef, setProjectRef] = useState<string>("your-project-ref");
  const [dbPassword, setDbPassword] = useState<string>("YourPassword123!");
  const [region, setRegion] = useState<string>("ap-south-1");
  const [connectionMode, setConnectionMode] = useState<"direct" | "pooler_session" | "pooler_transaction">("direct");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sqlContent, setSqlContent] = useState<string>("");
  const [isLoadingSql, setIsLoadingSql] = useState<boolean>(false);
  const [cliTab, setCliTab] = useState<"powershell" | "env" | "bash">("powershell");

  useEffect(() => {
    const fetchSql = async () => {
      setIsLoadingSql(true);
      try {
        const res = await fetch("/api/supabase-sql");
        if (res.ok) {
          const data = await res.json();
          setSqlContent(data.sql || "");
        }
      } catch (err) {
        console.error("Failed to load Supabase SQL", err);
      } finally {
        setIsLoadingSql(false);
      }
    };
    fetchSql();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  // Calculated URLs
  const cleanRef = projectRef.trim() || "your-project-ref";
  const cleanPass = dbPassword.trim() || "[YOUR_PASSWORD]";

  const directJdbcUrl = `jdbc:postgresql://db.${cleanRef}.supabase.co:5432/postgres?sslmode=require`;
  const poolerSessionJdbcUrl = `jdbc:postgresql://aws-0-${region}.pooler.supabase.com:5432/postgres?sslmode=require`;
  const poolerTransactionJdbcUrl = `jdbc:postgresql://aws-0-${region}.pooler.supabase.com:6543/postgres?sslmode=require`;

  const activeJdbcUrl = 
    connectionMode === "direct" 
      ? directJdbcUrl 
      : connectionMode === "pooler_session" 
        ? poolerSessionJdbcUrl 
        : poolerTransactionJdbcUrl;

  const activeUsername = connectionMode === "direct" ? "postgres" : `postgres.${cleanRef}`;

  const envSnippet = `# Supabase Cloud Database Credentials for Spring Boot
SPRING_PROFILES_ACTIVE=supabase
SUPABASE_PROJECT_REF=${cleanRef}
SUPABASE_DB_USER=${activeUsername}
SUPABASE_DB_PASSWORD=${cleanPass}
SUPABASE_DB_URL=${activeJdbcUrl}`;

  const ymlSnippet = `spring:
  datasource:
    url: ${activeJdbcUrl}
    username: ${activeUsername}
    password: \${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 5
      minimum-idle: 1
      connection-test-query: SELECT 1
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
    baseline-on-migrate: true`;

  const powershellCmd = `mvn spring-boot:run "-Dspring-boot.run.profiles=supabase" "-Dspring.datasource.url=${activeJdbcUrl}" "-Dspring.datasource.username=${activeUsername}" "-Dspring.datasource.password=${cleanPass}"`;

  const envVarCmd = `$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="${activeJdbcUrl}"
$env:SUPABASE_DB_PASSWORD="${cleanPass}"
mvn spring-boot:run`;

  const bashCmd = `mvn spring-boot:run \\
  -Dspring-boot.run.profiles=supabase \\
  -Dspring.datasource.url="${activeJdbcUrl}" \\
  -Dspring.datasource.username="${activeUsername}" \\
  -Dspring.datasource.password="${cleanPass}"`;

  const mavenRunCmd = cliTab === "powershell" ? powershellCmd : cliTab === "env" ? envVarCmd : bashCmd;

  const tablesList = [
    { name: "users", description: "Investor profiles with BCrypt password hash, PAN, KYC status (pending/verified)", rows: 1 },
    { name: "refresh_tokens", description: "JWT refresh token store with expiry timestamps and revocation state", rows: 0 },
    { name: "fund_categories", description: "Equity, Debt, Hybrid, ELSS Tax Saver, Index classifications", rows: 5 },
    { name: "mutual_funds", description: "Top performing funds (HDFC, Axis, ICICI, SBI, Kotak, Mirae, UTI, Parag Parikh)", rows: 8 },
    { name: "fund_details", description: "AUM, Expense ratios, Exit load policies, Minimum SIP amounts", rows: 8 },
    { name: "fund_holdings", description: "Company stock and instrument breakdowns (HDFC Bank, Reliance, Infosys, etc.)", rows: 17 },
    { name: "fund_nav_history", description: "Past 30-day daily Net Asset Value historical time-series for chart generation", rows: 62 },
    { name: "investment_goals", description: "Goal targets: House, Car, Retirement, Wedding, Education, Vacation, Startup", rows: 9 },
    { name: "goal_categories", description: "Relational mapping between milestone goals and recommended asset categories", rows: 18 },
    { name: "watchlist_groups", description: "Custom user-created watchlist collections ('My Picks', 'Tax Saving', 'Retirement')", rows: 3 },
    { name: "watchlist_funds", description: "Fund members linked to user watchlist collections", rows: 6 },
    { name: "portfolio_holdings", description: "User active investments, units, invested capital, and AMC folio numbers", rows: 3 },
    { name: "content_items", description: "Educational blogs and investment banner advertisements", rows: 5 },
    { name: "market_indexes", description: "Real-time benchmark indices (NIFTY 50, SENSEX, NIFTY BANK)", rows: 3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Supabase Cloud PostgreSQL
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                100% Free Tier Compatible
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Spring Boot 3.3 + JPA + Flyway
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Supabase Database & Tables Setup Guide
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Supabase gives you a production-grade, hosted PostgreSQL 15/16 database in the cloud with zero server management. Follow these simple steps to spin up your project, create all 14 investment tables, seed mutual fund data, and connect your Spring Boot backend.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/api/download-supabase-sql"
              download="supabase_complete_setup.sql"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download setup.sql</span>
            </a>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab("walkthrough")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "walkthrough"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Step-by-Step Walkthrough</span>
          </button>

          <button
            onClick={() => setActiveSubTab("sql")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "sql"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>2. Complete SQL Script & Tables ({tablesList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("generator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "generator"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>3. Connection String Configurator</span>
          </button>

          <button
            onClick={() => setActiveSubTab("spring")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "spring"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>4. Spring Boot Configuration Files</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STEP-BY-STEP WALKTHROUGH */}
      {activeSubTab === "walkthrough" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center mb-2">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900">Create Project</h3>
              <p className="text-xs text-slate-500 mt-1">
                Create a free project on Supabase dashboard and save your database password.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center mb-2">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">Run SQL Script</h3>
              <p className="text-xs text-slate-500 mt-1">
                Paste the 1-click SQL script into Supabase SQL Editor to generate all tables and seed data.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center mb-2">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900">Get JDBC URL</h3>
              <p className="text-xs text-slate-500 mt-1">
                Copy your Project Reference and build the Spring Boot JDBC connection string with SSL mode.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
              <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center mb-2">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-900">Run Spring Boot</h3>
              <p className="text-xs text-slate-500 mt-1">
                Start the backend using <code className="text-indigo-600 font-mono">-Dspring-boot.run.profiles=supabase</code>.
              </p>
            </div>
          </div>

          {/* Detailed Step Cards */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Create Your Free Supabase Project
                    </h2>
                    <p className="text-xs text-slate-500">Takes less than 2 minutes</p>
                  </div>
                </div>
                <a
                  href="https://supabase.com/dashboard/projects"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                <p className="font-semibold text-slate-800">Fill in the project creation form with these recommended values:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Organization:</strong> Select your personal organization (or create one for free).</li>
                  <li><strong>Project Name:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-indigo-600">growwealth-db</code></li>
                  <li><strong>Database Password:</strong> Choose a strong password and write it down. You will need it for the JDBC connection string.</li>
                  <li><strong>Region:</strong> Select the geographic region closest to you or your target users (e.g. <em>ap-south-1 (Mumbai)</em>, <em>ap-southeast-1 (Singapore)</em>, or <em>us-east-1 (N. Virginia)</em>).</li>
                  <li><strong>Pricing Plan:</strong> Free tier ($0/month includes 500MB database, 50,000 monthly active users).</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Run the 1-Click Database Setup Script in SQL Editor
                    </h2>
                    <p className="text-xs text-slate-500">Creates all 14 tables, relations, and initial mutual fund seed data</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab("sql")}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>View SQL Script</span>
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Supabase comes with a built-in browser SQL query tool. You do NOT need any command-line Postgres tools installed!
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
                  <li>In your Supabase project dashboard, click the <strong>SQL Editor</strong> icon (looks like <Terminal className="w-3.5 h-3.5 inline text-indigo-600" />) on the left sidebar.</li>
                  <li>Click <strong>+ New query</strong> at the top.</li>
                  <li>Click the button below to copy the complete setup script to your clipboard:</li>
                </ol>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      if (sqlContent) {
                        copyToClipboard(sqlContent, "sql-hero");
                      } else {
                        fetch("/api/supabase-sql")
                          .then((r) => r.json())
                          .then((d) => copyToClipboard(d.sql, "sql-hero"));
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedKey === "sql-hero" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Complete Supabase SQL Script (14 Tables + Seed Data)</span>
                      </>
                    )}
                  </button>

                  <a
                    href="/api/download-supabase-sql"
                    download="supabase_complete_setup.sql"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Download .sql File</span>
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">4. Paste and Run:</span> Paste the code into the SQL editor window, then click the green <strong>RUN</strong> button (or press <kbd className="px-1 py-0.5 bg-white border rounded font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-white border rounded font-mono text-[10px]">Enter</kbd>). You will see a success message: <em>"Success. No rows returned."</em>.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Find Your Connection String in Supabase
                    </h2>
                    <p className="text-xs text-slate-500">Project Settings → Database</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab("generator")}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Use Generator</span>
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  In the Supabase dashboard, navigate to <strong>Project Settings (gear icon at the bottom left)</strong> → <strong>Database</strong>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Direct Connection (Port 5432)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">Standard</span>
                    </div>
                    <p className="text-slate-500">
                      Best for local Spring Boot development and environments with direct IPv6 / IPv4 connectivity.
                    </p>
                    <code className="block p-2 bg-white rounded border font-mono text-[11px] text-indigo-600 select-all">
                      jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
                    </code>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Connection Pooler (Port 6543 / 5432)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">Cloud / IPv4</span>
                    </div>
                    <p className="text-slate-500">
                      Recommended for serverless runtimes, Docker containers, Cloud Run, Heroku, or AWS.
                    </p>
                    <code className="block p-2 bg-white rounded border font-mono text-[11px] text-emerald-700 select-all">
                      jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
                    </code>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Important about SSL mode:</span> Supabase requires SSL encryption for all PostgreSQL database connections. Make sure <code className="font-mono text-amber-900 bg-amber-100/70 px-1 py-0.5 rounded">?sslmode=require</code> is appended to the JDBC URL. Our backend configuration automatically handles this!
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    4
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Run Spring Boot with Supabase
                    </h2>
                    <p className="text-xs text-slate-500">Activate the pre-configured supabase profile</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                  application-supabase.yml
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  We have added <code className="font-mono text-indigo-600 bg-slate-100 px-1.5 py-0.5 rounded">application-supabase.yml</code> directly into the Spring Boot project. Select your terminal to copy the exact compatible command:
                </p>

                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setCliTab("powershell")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                      cliTab === "powershell"
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Windows PowerShell (Quoted)
                  </button>
                  <button
                    onClick={() => setCliTab("env")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                      cliTab === "env"
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Windows PowerShell ($env variables)
                  </button>
                  <button
                    onClick={() => setCliTab("bash")}
                    className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                      cliTab === "bash"
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    macOS / Linux / Git Bash
                  </button>
                </div>

                <div className="relative bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() => copyToClipboard(mavenRunCmd, "run-cmd")}
                    className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "run-cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "run-cmd" ? "Copied" : "Copy"}</span>
                  </button>
                  <pre className="text-emerald-400 whitespace-pre-wrap">{mavenRunCmd}</pre>
                </div>

                {cliTab === "powershell" && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-800">
                    <strong>PowerShell Tip:</strong> PowerShell splits strings containing colons (like <code>jdbc:postgresql:</code>) unless each <code>"-Dkey=value"</code> argument is wrapped in quotes. The command above is pre-quoted for PowerShell.
                  </div>
                )}

                <p className="text-slate-500 text-[11px]">
                  Or if using Docker, set <code className="font-mono text-indigo-600">SUPABASE_DB_URL</code> and <code className="font-mono text-indigo-600">SUPABASE_DB_PASSWORD</code> in your <code className="font-mono">.env</code> file and run <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">docker-compose up backend</code>.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    5
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Verify in Supabase Table Editor
                    </h2>
                    <p className="text-xs text-slate-500">Visual confirmation of tables & live data</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Flutter Client
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-3">
                <p>
                  Click <strong>Table Editor</strong> (grid icon) in the Supabase sidebar. You will see all 14 tables populated:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {tablesList.slice(0, 8).map((tbl) => (
                    <div key={tbl.name} className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                      <div className="font-mono font-bold text-indigo-600 text-[11px] truncate">{tbl.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tbl.rows > 0 ? `${tbl.rows} seed records` : "Ready for data"}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                  <strong>🎉 That's it!</strong> Your database is 100% online in the cloud. You can now point your Flutter application to your backend REST API, and all registrations, mutual fund searches, goal plans, and portfolio investments will persist permanently in Supabase!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE SQL SCRIPT & TABLES */}
      {activeSubTab === "sql" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Complete Supabase PostgreSQL Script (<code className="font-mono text-indigo-600 text-xs">supabase_complete_setup.sql</code>)
                </h2>
                <p className="text-xs text-slate-500">
                  Executes idempotently (<code className="font-mono">CREATE TABLE IF NOT EXISTS</code> & <code className="font-mono">ON CONFLICT DO NOTHING</code>)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (sqlContent) {
                      copyToClipboard(sqlContent, "sql-tab");
                    } else {
                      fetch("/api/supabase-sql")
                        .then((r) => r.json())
                        .then((d) => copyToClipboard(d.sql, "sql-tab"));
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {copiedKey === "sql-tab" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All SQL</span>
                    </>
                  )}
                </button>

                <a
                  href="/api/download-supabase-sql"
                  download="supabase_complete_setup.sql"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Download .sql</span>
                </a>
              </div>
            </div>

            {/* SQL Script Viewer */}
            <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 max-h-[500px] overflow-y-auto">
              {isLoadingSql ? (
                <div className="py-12 text-center text-slate-400">Loading SQL script...</div>
              ) : (
                <pre className="leading-relaxed whitespace-pre-wrap selection:bg-indigo-900 selection:text-white">
                  {sqlContent || "-- Loading setup script..."}
                </pre>
              )}
            </div>
          </div>

          {/* Table Directory */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Tables Created in Supabase ({tablesList.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tablesList.map((tbl) => (
                <div key={tbl.name} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <div className="w-7 h-7 rounded bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Table className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{tbl.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                        {tbl.rows} rows seeded
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{tbl.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE CONNECTION STRING CONFIGURATOR */}
      {activeSubTab === "generator" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Interactive Supabase Connection String Generator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Type in your Supabase project parameters to instantly generate ready-to-copy JDBC connection strings, environment files, and Spring configuration snippets.
              </p>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Project Reference ID</span>
                </label>
                <input
                  type="text"
                  value={projectRef}
                  onChange={(e) => setProjectRef(e.target.value)}
                  placeholder="e.g. abcdefghijklmnopqrst"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">Found in Project Settings → General</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Database Password</span>
                </label>
                <input
                  type="password"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  placeholder="Your database password"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">Password entered during project creation</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Cloud Region</span>
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ap-south-1">ap-south-1 (Mumbai, India)</option>
                  <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                  <option value="us-east-1">us-east-1 (N. Virginia, US)</option>
                  <option value="us-west-1">us-west-1 (N. California, US)</option>
                  <option value="eu-central-1">eu-central-1 (Frankfurt, Germany)</option>
                  <option value="eu-west-1">eu-west-1 (Ireland)</option>
                </select>
                <span className="text-[10px] text-slate-400 block">Only used for Connection Pooler</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Connection Mode</span>
                </label>
                <select
                  value={connectionMode}
                  onChange={(e) => setConnectionMode(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="direct">Direct Connection (Port 5432)</option>
                  <option value="pooler_session">Session Pooler (Port 5432)</option>
                  <option value="pooler_transaction">Transaction Pooler (Port 6543)</option>
                </select>
                <span className="text-[10px] text-slate-400 block">
                  {connectionMode === "direct" ? "Standard for local development" : "Recommended for Cloud / IPv4"}
                </span>
              </div>
            </div>

            {/* Live Generated Snippets */}
            <div className="space-y-4">
              {/* Active JDBC URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Calculated Spring Boot JDBC URL
                  </span>
                  <button
                    onClick={() => copyToClipboard(activeJdbcUrl, "jdbc-url")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "jdbc-url" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "jdbc-url" ? "Copied!" : "Copy JDBC URL"}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-xs rounded-lg select-all overflow-x-auto border border-slate-800">
                  {activeJdbcUrl}
                </div>
              </div>

              {/* Environment File Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    .env / Export Format
                  </span>
                  <button
                    onClick={() => copyToClipboard(envSnippet, "env-snippet")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "env-snippet" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "env-snippet" ? "Copied!" : "Copy .env Variables"}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
                  {envSnippet}
                </pre>
              </div>

              {/* application.yml Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    application.yml Datasource Block
                  </span>
                  <button
                    onClick={() => copyToClipboard(ymlSnippet, "yml-snippet")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "yml-snippet" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "yml-snippet" ? "Copied!" : "Copy YAML"}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
                  {ymlSnippet}
                </pre>
              </div>

              {/* Maven Command */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Single-Line Maven Launch Command
                  </span>
                  <button
                    onClick={() => copyToClipboard(mavenRunCmd, "mvn-cmd-live")}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "mvn-cmd-live" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "mvn-cmd-live" ? "Copied!" : "Copy Command"}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-amber-300 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
                  {mavenRunCmd}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPRING BOOT CONFIGURATION FILES */}
      {activeSubTab === "spring" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  1. <code className="font-mono text-indigo-600 text-sm">application-supabase.yml</code>
                </h2>
                <p className="text-xs text-slate-500">
                  Dedicated Spring Boot profile for Supabase with optimized connection pooling
                </p>
              </div>
              <button
                onClick={() => {
                  const content = `# Spring Boot Configuration for Supabase Managed PostgreSQL
spring:
  config:
    activate:
      on-profile: supabase

  datasource:
    url: \${SUPABASE_DB_URL:jdbc:postgresql://db.\${SUPABASE_PROJECT_REF:your-project-ref}.supabase.co:5432/postgres?sslmode=require}
    username: \${SUPABASE_DB_USER:postgres}
    password: \${SUPABASE_DB_PASSWORD:}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: \${HIKARI_MAX_POOL_SIZE:5}
      minimum-idle: 1
      idle-timeout: 30000
      pool-name: SupabaseHikariPool
      max-lifetime: 1800000
      connection-timeout: 20000
      connection-test-query: SELECT 1

  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate
    show-sql: false

  flyway:
    enabled: \${FLYWAY_ENABLED:true}
    baseline-on-migrate: true
    locations: classpath:db/migration`;
                  copyToClipboard(content, "app-supabase-yml");
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "app-supabase-yml" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "app-supabase-yml" ? "Copied!" : "Copy YAML"}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800 leading-relaxed">
{`# Spring Boot Configuration for Supabase Managed PostgreSQL
spring:
  config:
    activate:
      on-profile: supabase

  datasource:
    url: \${SUPABASE_DB_URL:jdbc:postgresql://db.\${SUPABASE_PROJECT_REF:your-project-ref}.supabase.co:5432/postgres?sslmode=require}
    username: \${SUPABASE_DB_USER:postgres}
    password: \${SUPABASE_DB_PASSWORD:}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: \${HIKARI_MAX_POOL_SIZE:5}
      minimum-idle: 1
      idle-timeout: 30000
      pool-name: SupabaseHikariPool
      max-lifetime: 1800000
      connection-timeout: 20000
      connection-test-query: SELECT 1

  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate
    show-sql: false

  flyway:
    enabled: \${FLYWAY_ENABLED:true}
    baseline-on-migrate: true
    locations: classpath:db/migration`}
            </pre>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              2. How Spring Boot Connects to Supabase Behind the Scenes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  SSL Handshake
                </span>
                <p>
                  The <code className="font-mono text-indigo-600">?sslmode=require</code> parameter instructs the official PostgreSQL JDBC driver to negotiate TLS 1.3 encryption directly with Supabase edge servers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  HikariCP Pooling
                </span>
                <p>
                  Pool size is capped at 5 connections to stay comfortably under Supabase free-tier connection limits (60 max pool connections) while ensuring sub-millisecond response latency.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-blue-600" />
                  Flyway Migrations
                </span>
                <p>
                  Flyway automatically validates existing tables or runs any new versioned migrations on boot, ensuring zero divergence between Java entity models and database tables.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
