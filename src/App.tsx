import React, { useState, useEffect } from "react";
import { ActiveTab } from "./types";
import { Header } from "./components/Header";
import { ApiPlayground } from "./components/ApiPlayground";
import { DatabaseSchemaViewer } from "./components/DatabaseSchemaViewer";
import { CodeExplorer } from "./components/CodeExplorer";
import { FlutterIntegrationGuide } from "./components/FlutterIntegrationGuide";
import { ArchitectureView } from "./components/ArchitectureView";
import { SupabaseSetupGuide } from "./components/SupabaseSetupGuide";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("supabase");
  const [serverStatus, setServerStatus] = useState<"UP" | "CONNECTING" | "DOWN">("CONNECTING");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setServerStatus("UP");
        } else {
          setServerStatus("DOWN");
        }
      } catch (e) {
        setServerStatus("DOWN");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        serverStatus={serverStatus} 
      />

      <main className="flex-1 pb-12">
        {activeTab === "supabase" && <SupabaseSetupGuide />}
        {activeTab === "tester" && <ApiPlayground />}
        {activeTab === "schema" && <DatabaseSchemaViewer />}
        {activeTab === "code" && <CodeExplorer />}
        {activeTab === "flutter" && <FlutterIntegrationGuide />}
        {activeTab === "architecture" && <ArchitectureView />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span>© GROWWEALTH INVESTMENT ADVISOR</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-slate-400">SPRING BOOT 3.3 • JAVA 17</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-[10px] font-bold text-emerald-700">
              SUPABASE POSTGRESQL 16
            </span>
            <span className="px-2.5 py-1 bg-indigo-600 rounded text-[10px] font-bold text-white shadow-xs">
              FLUTTER READY
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
