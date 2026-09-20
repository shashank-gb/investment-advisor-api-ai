import React from "react";
import { ActiveTab } from "../types";
import { 
  Server, 
  Database, 
  Terminal, 
  FileCode, 
  Smartphone, 
  Download, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  serverStatus: "UP" | "CONNECTING" | "DOWN";
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, serverStatus }) => {
  const handleDownloadZip = () => {
    window.location.href = "/api/download-project";
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">GrowWealth Backend Server</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                Spring Boot 3.3.0
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center">
                <Database className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Supabase Cloud PostgreSQL
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              REST API service for Flutter client (<a href="https://github.com/shashank-gb/investment_advisor_app" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">investment_advisor_app</a>) • cluster-v1-prod
            </p>
          </div>
        </div>

        {/* Server status & Telemetry & Download CTA */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className={`w-2.5 h-2.5 rounded-full ${serverStatus === "UP" ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="text-xs font-medium text-slate-600 italic">
              {serverStatus === "UP" ? "Service Healthy" : "Connecting"}
            </span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-slate-200" />

          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gateway Port</p>
            <p className="text-xs font-bold font-mono text-indigo-600">:3000</p>
          </div>

          <button
            onClick={handleDownloadZip}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Download complete Java Spring Boot project as a ZIP archive"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Java Backend (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => setActiveTab("supabase")}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                activeTab === "supabase"
                  ? "bg-white text-emerald-700 font-bold border border-emerald-300 shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-emerald-50/50 font-medium"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Cloud Setup</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">1-Click</span>
            </button>

            <button
              onClick={() => setActiveTab("tester")}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                activeTab === "tester"
                  ? "bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>REST API Tester</span>
            </button>

            <button
              onClick={() => setActiveTab("schema")}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                activeTab === "schema"
                  ? "bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>PostgreSQL Schema & ERD</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Spring Boot Code Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab("flutter")}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                activeTab === "flutter"
                  ? "bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              <span>Flutter App Integration</span>
            </button>

            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>System Architecture</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
