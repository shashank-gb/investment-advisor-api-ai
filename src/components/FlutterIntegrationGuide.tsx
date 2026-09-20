import React, { useState } from "react";
import { 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  CheckCircle2,
  FileCode,
  AlertTriangle
} from "lucide-react";

export const FlutterIntegrationGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appConfigSnippet = `// lib/core/config/app_config.dart in investment_advisor_app
class AppConfig {
  AppConfig._();

  static const String appName = 'GrowWealth MF';

  /// Point this to your backend server:
  /// - Android Emulator: http://10.0.2.2:8080/api/v1
  /// - iOS Simulator / macOS: http://localhost:8080/api/v1
  /// - Physical Phone on WiFi: http://<YOUR_LAN_IP>:8080/api/v1
  /// - Live Cloud Gateway: ${window.location.origin}/api/v1
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080/api/v1',
  );

  /// CRITICAL: Switch to FALSE to route all requests to the live backend!
  static const bool useMockData = bool.fromEnvironment(
    'USE_MOCK_DATA',
    defaultValue: false,
  );
}`;

  const runCommandsSnippet = `# 1. Run on Android Emulator (points to host via 10.0.2.2)
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080/api/v1 --dart-define=USE_MOCK_DATA=false

# 2. Run on iOS Simulator or Web (points to localhost:8080)
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:8080/api/v1 --dart-define=USE_MOCK_DATA=false

# 3. Run against this Live Cloud Gateway directly:
flutter run --dart-define=API_BASE_URL=${window.location.origin}/api/v1 --dart-define=USE_MOCK_DATA=false`;

  const networkSecurityXml = `<?xml version="1.0" encoding="utf-8"?>
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>`;

  const manifestSnippet = `<!-- Inside android/app/src/main/AndroidManifest.xml -->
<application
    android:label="investment_advisor_app"
    android:name="\${applicationName}"
    android:icon="@mipmap/ic_launcher"
    android:networkSecurityConfig="@xml/network_security_config"
    android:usesCleartextTraffic="true">
    ...
</application>`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>Connecting the Flutter Mobile App</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md border border-indigo-200">
                Cross-Platform
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Target repository:{" "}
              <a
                href="https://github.com/shashank-gb/investment_advisor_app"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline inline-flex items-center font-medium"
              >
                shashank-gb/investment_advisor_app <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div className="text-xs">
            <span className="text-slate-500">Target Base URL: </span>
            <span className="font-mono text-indigo-600 font-bold">{window.location.origin}/api/v1</span>
          </div>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                1
              </span>
              <h3 className="text-sm font-semibold text-slate-900">
                Toggle <code className="text-indigo-700 font-mono bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">useMockData = false</code> in Flutter AppConfig
              </h3>
            </div>
            <button
              onClick={() => handleCopy("step1", appConfigSnippet)}
              className="flex items-center space-x-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs px-2.5 py-1 rounded cursor-pointer font-medium"
            >
              {copiedKey === "step1" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedKey === "step1" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Open <code className="text-slate-700 font-medium">lib/core/config/app_config.dart</code> in your Flutter project and enable live network routing:
          </p>
          <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {appConfigSnippet}
          </pre>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                2
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Run Flutter with Dart-Define Arguments</h3>
            </div>
            <button
              onClick={() => handleCopy("step2", runCommandsSnippet)}
              className="flex items-center space-x-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs px-2.5 py-1 rounded cursor-pointer font-medium"
            >
              {copiedKey === "step2" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedKey === "step2" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Pass the target backend address via command-line or configure them in your VS Code <code className="text-slate-700 font-mono">launch.json</code>:
          </p>
          <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
            {runCommandsSnippet}
          </pre>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                3
              </span>
              <h3 className="text-sm font-semibold text-slate-900">Android Local Cleartext Traffic (For Local Emulator Only)</h3>
            </div>
            <button
              onClick={() => handleCopy("step3", networkSecurityXml)}
              className="flex items-center space-x-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs px-2.5 py-1 rounded cursor-pointer font-medium"
            >
              {copiedKey === "step3" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedKey === "step3" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            If running Spring Boot locally over plain HTTP (<code className="text-slate-700 font-mono">http://10.0.2.2:8080</code>), configure Android to permit cleartext traffic:
          </p>
          <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {networkSecurityXml}
          </pre>
        </div>

        {/* Step 4: Architecture Contract Matching */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Full Contract Compatibility Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Flutter Repository</th>
                  <th className="py-2.5 px-3">Endpoints Called</th>
                  <th className="py-2.5 px-3">Spring Boot Controller</th>
                  <th className="py-2.5 px-3">PostgreSQL Tables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3 text-indigo-700 font-semibold">auth_repository_impl.dart</td>
                  <td className="py-2 px-3 text-slate-800">/auth/login, /signup, /refresh</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">AuthController.java</td>
                  <td className="py-2 px-3 text-slate-500">users, refresh_tokens</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3 text-indigo-700 font-semibold">funds_repository_impl.dart</td>
                  <td className="py-2 px-3 text-slate-800">/funds/categories, /top-performing, /detail</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">FundController.java</td>
                  <td className="py-2 px-3 text-slate-500">mutual_funds, fund_details, fund_holdings</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3 text-indigo-700 font-semibold">portfolio_repository_impl.dart</td>
                  <td className="py-2 px-3 text-slate-800">/portfolio/summary, /portfolio/holdings</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">PortfolioController.java</td>
                  <td className="py-2 px-3 text-slate-500">portfolio_holdings, mutual_funds</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3 text-indigo-700 font-semibold">watchlist_repository_impl.dart</td>
                  <td className="py-2 px-3 text-slate-800">/watchlist/groups, /watchlist/funds</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">WatchlistController.java</td>
                  <td className="py-2 px-3 text-slate-500">watchlist_groups, watchlist_funds</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3 text-indigo-700 font-semibold">goals_repository_impl.dart</td>
                  <td className="py-2 px-3 text-slate-800">/goals/list, /goals/funds</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">GoalController.java</td>
                  <td className="py-2 px-3 text-slate-500">investment_goals, goal_categories</td>
                </tr>
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-3 text-indigo-700 font-semibold">content_repository_impl.dart</td>
                  <td className="py-2 px-3 text-slate-800">/content/blogs, /ads, /market/indexes</td>
                  <td className="py-2 px-3 text-emerald-700 font-semibold">ContentController.java</td>
                  <td className="py-2 px-3 text-slate-500">content_items, market_indexes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
