import React, { useState } from "react";
import { POSTGRES_TABLES } from "../data/schemaData";
import { SchemaTable } from "../types";
import { 
  Database, 
  Key, 
  Link2, 
  FileText, 
  Check, 
  Copy, 
  Layers, 
  Table as TableIcon,
  Search
} from "lucide-react";

export const DatabaseSchemaViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(POSTGRES_TABLES[3]); // mutual_funds
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [viewMode, setViewMode] = useState<"tables" | "sql_v1" | "supabase">("tables");
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseSql, setSupabaseSql] = useState<string>("");

  React.useEffect(() => {
    fetch("/api/supabase-sql")
      .then((res) => res.json())
      .then((data) => {
        if (data.sql) setSupabaseSql(data.sql);
      })
      .catch(() => {});
  }, []);

  const categories = ["All", ...Array.from(new Set(POSTGRES_TABLES.map((t) => t.category)))];

  const filteredTables = POSTGRES_TABLES.filter((t) => {
    const matchesCat = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch = 
      t.tableName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopySql = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const sampleV1Sql = `-- Flyway Schema Migration V1: Full Relational Setup for GrowWealth Advisor
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    pan VARCHAR(20) UNIQUE,
    kyc_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fund_id VARCHAR(64) NOT NULL REFERENCES mutual_funds(id),
    units NUMERIC(14, 4) NOT NULL,
    invested_amount NUMERIC(14, 2) NOT NULL,
    folio_number VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist_groups (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist_funds (
    id VARCHAR(64) PRIMARY KEY,
    group_id VARCHAR(64) NOT NULL REFERENCES watchlist_groups(id) ON DELETE CASCADE,
    fund_id VARCHAR(64) NOT NULL REFERENCES mutual_funds(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_group_fund UNIQUE (group_id, fund_id)
);`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">12</div>
              <div className="text-xs text-slate-500 font-medium">Relational Tables</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">9</div>
              <div className="text-xs text-slate-500 font-medium">Foreign Key Constraints</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">BSE Star MF</div>
              <div className="text-xs text-slate-500 font-medium">Exchange Schema Compliant</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">Flyway</div>
              <div className="text-xs text-slate-500 font-medium">Versioned Migrations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setViewMode("tables")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            viewMode === "tables"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          Interactive Table Inspector
        </button>
        <button
          onClick={() => setViewMode("sql_v1")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            viewMode === "sql_v1"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          Flyway V1__init_schema.sql
        </button>
        <button
          onClick={() => setViewMode("supabase")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
            viewMode === "supabase"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white border border-emerald-300 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50/50 shadow-2xs"
          }`}
        >
          <span>Supabase 1-Click Setup Script</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">New</span>
        </button>
      </div>

      {viewMode === "tables" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tables List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter tables..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] px-2 py-1 rounded font-medium cursor-pointer transition-colors ${
                      activeCategory === cat
                        ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                {filteredTables.map((t) => {
                  const isSelected = selectedTable.tableName === t.tableName;
                  return (
                    <button
                      key={t.tableName}
                      onClick={() => setSelectedTable(t)}
                      className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-semibold shadow-2xs"
                          : "hover:bg-slate-50 text-slate-700 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <TableIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-xs font-mono font-semibold">{t.tableName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{t.columns.length} cols</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table Details */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold font-mono text-slate-900">{selectedTable.tableName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                      {selectedTable.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{selectedTable.description}</p>
                </div>
                <div className="text-xs font-mono text-slate-400 font-medium">
                  {selectedTable.columns.length} columns defined
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Column</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Attributes</th>
                      <th className="py-3 px-4">References</th>
                      <th className="py-3 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-900 flex items-center space-x-1.5">
                          {col.isPrimary && (
                            <Key className="w-3 h-3 text-amber-500" title="Primary Key" />
                          )}
                          <span>{col.name}</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-indigo-600 font-semibold">
                          {col.type}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex space-x-1">
                            {col.isPrimary && (
                              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">
                                PK
                              </span>
                            )}
                            {col.isUnique && (
                              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-mono font-bold">
                                UNIQUE
                              </span>
                            )}
                            {col.isNullable === false && !col.isPrimary && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-medium">
                                NOT NULL
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-xs">
                          {col.references ? (
                            <span className="text-indigo-600 flex items-center space-x-1 font-medium">
                              <Link2 className="w-3 h-3 mr-1 text-indigo-500" />
                              <span>{col.references}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === "supabase" ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-emerald-50/60">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-emerald-900 font-bold">
                backend-spring-boot/src/main/resources/db/supabase_complete_setup.sql
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/api/download-supabase-sql"
                download="supabase_complete_setup.sql"
                className="text-xs text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 px-2.5 py-1 rounded shadow-2xs font-semibold"
              >
                Download .sql
              </a>
              <button
                onClick={() => handleCopySql(supabaseSql || sampleV1Sql)}
                className="flex items-center space-x-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded shadow-2xs font-bold cursor-pointer transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Copied SQL" : "Copy Supabase SQL"}</span>
              </button>
            </div>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 bg-slate-900 overflow-x-auto max-h-[600px] leading-relaxed">
            {supabaseSql || "-- Fetching Supabase script..."}
          </pre>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <span className="text-xs font-mono text-slate-700 font-semibold">
              backend-spring-boot/src/main/resources/db/migration/V1__init_schema.sql
            </span>
            <button
              onClick={() => handleCopySql(sampleV1Sql)}
              className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs font-medium"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedSql ? "Copied SQL" : "Copy SQL"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 bg-slate-900 overflow-x-auto max-h-[600px] leading-relaxed">
            {sampleV1Sql}
          </pre>
        </div>
      )}
    </div>
  );
};
