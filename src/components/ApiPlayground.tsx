import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../data/endpoints";
import { EndpointSpec } from "../types";
import { 
  Play, 
  Copy, 
  Check, 
  Key, 
  Send, 
  Clock, 
  Database, 
  Search, 
  AlertCircle, 
  Sparkles,
  Lock,
  Globe
} from "lucide-react";

export const ApiPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointSpec>(API_ENDPOINTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Request state
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string>("");
  const [bearerToken, setBearerToken] = useState<string>(() => localStorage.getItem("gw_jwt_token") || "");
  
  // Response state
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Sync state when endpoint changes
  useEffect(() => {
    setQueryParams(selectedEndpoint.defaultQueryParams || {});
    setRequestBody(
      selectedEndpoint.defaultBody 
        ? JSON.stringify(selectedEndpoint.defaultBody, null, 2) 
        : ""
    );
    setResponseData(null);
    setResponseStatus(null);
    setResponseTime(null);
  }, [selectedEndpoint]);

  const categories = ["All", ...Array.from(new Set(API_ENDPOINTS.map((e) => e.category)))];

  const filteredEndpoints = API_ENDPOINTS.filter((e) => {
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    const matchesSearch = 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "POST":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PUT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const constructFullUrl = () => {
    let url = selectedEndpoint.path;
    const queryEntries = Object.entries(queryParams).filter(([_, v]) => String(v).trim() !== "");
    if (queryEntries.length > 0) {
      const searchParams = new URLSearchParams();
      queryEntries.forEach(([k, v]) => searchParams.append(k, String(v)));
      url += `?${searchParams.toString()}`;
    }
    return url;
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseData(null);
    setResponseStatus(null);
    const startTime = performance.now();

    try {
      const fullPath = constructFullUrl();
      const headers: Record<string, string> = {
        "Accept": "application/json",
      };

      if (selectedEndpoint.method !== "GET") {
        headers["Content-Type"] = "application/json";
      }

      if (bearerToken.trim()) {
        headers["Authorization"] = `Bearer ${bearerToken.trim()}`;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };

      if (selectedEndpoint.method !== "GET" && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(fullPath, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      const json = await res.json();
      setResponseData(json);

      // Auto-save JWT token if logging in or signing up
      if (json && json.access_token) {
        setBearerToken(json.access_token);
        localStorage.setItem("gw_jwt_token", json.access_token);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseData({ error: err.message || "Failed to execute request" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCurl = () => {
    const fullPath = window.location.origin + constructFullUrl();
    let curl = `curl -X ${selectedEndpoint.method} "${fullPath}" \\\n  -H "Accept: application/json"`;
    if (bearerToken.trim()) {
      curl += ` \\\n  -H "Authorization: Bearer ${bearerToken.trim()}"`;
    }
    if (selectedEndpoint.method !== "GET" && requestBody.trim()) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/'/g, "'\\''")}'`;
    }
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!responseData) return;
    navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleQuickLogin = async () => {
    const loginEndpoint = API_ENDPOINTS.find((e) => e.id === "auth-login");
    if (loginEndpoint) {
      setSelectedEndpoint(loginEndpoint);
      setRequestBody(JSON.stringify({ email: "demo@growwealth.in", password: "Password123" }, null, 2));
      setTimeout(() => {
        handleSendRequest();
      }, 100);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Quick Setup Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active JWT Bearer Token</div>
            <div className="text-xs text-slate-500">
              {bearerToken ? "Authenticated session active for authorized requests." : "No token set. Click Quick Login with demo investor to authenticate."}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={bearerToken}
            onChange={(e) => {
              setBearerToken(e.target.value);
              localStorage.setItem("gw_jwt_token", e.target.value);
            }}
            placeholder="Bearer token (auto-filled on login)"
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-1.5 rounded-lg w-64 md:w-80 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
          <button
            onClick={handleQuickLogin}
            className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            title="Automatically run /auth/login with demo credentials"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick Login</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Endpoints Catalog */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search API endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Categories filter */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Endpoints List */}
            <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
              {filteredEndpoints.map((ep) => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-semibold shadow-2xs"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getMethodBadgeClass(ep.method)}`}>
                        {ep.method}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-medium truncate text-slate-800">{ep.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{ep.path}</div>
                      </div>
                    </div>
                    {ep.requiresAuth && (
                      <Lock className="w-3 h-3 text-amber-500 flex-shrink-0 ml-1" title="Requires JWT Token" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Request & Response Inspector */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Request Header Banner */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getMethodBadgeClass(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-xs font-mono text-indigo-700 font-semibold">{constructFullUrl()}</span>
                  {selectedEndpoint.requiresAuth && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium flex items-center">
                      <Lock className="w-2.5 h-2.5 mr-1" /> Auth Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{selectedEndpoint.description}</p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handleCopyCurl}
                  className="flex items-center space-x-1 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border border-slate-200 shadow-2xs transition-colors"
                  title="Copy as cURL command"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedCurl ? "Copied" : "cURL"}</span>
                </button>

                <button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all"
                >
                  {isLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isLoading ? "Executing..." : "Send Request"}</span>
                </button>
              </div>
            </div>

            {/* Request Configuration Tabs/Editors */}
            <div className="p-4 space-y-4">
              {/* Query Parameters */}
              {selectedEndpoint.defaultQueryParams && (
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Query Parameters</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {Object.keys(selectedEndpoint.defaultQueryParams).map((param) => (
                      <div key={param} className="flex items-center space-x-2">
                        <label className="text-xs font-mono text-slate-600 w-24 truncate">{param}:</label>
                        <input
                          type="text"
                          value={queryParams[param] || ""}
                          onChange={(e) => setQueryParams({ ...queryParams, [param]: e.target.value })}
                          className="flex-1 bg-white border border-slate-200 text-xs text-slate-800 px-2 py-1 rounded font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body (For POST, PUT) */}
              {selectedEndpoint.method !== "GET" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Request Body (JSON)</div>
                    <button
                      onClick={() => {
                        try {
                          setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
                        } catch (e) {}
                      }}
                      className="text-[11px] text-indigo-600 hover:underline cursor-pointer font-medium"
                    >
                      Prettify JSON
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter JSON payload..."
                  />
                </div>
              )}

              {/* Response Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Response</span>
                    {responseStatus !== null && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          responseStatus >= 200 && responseStatus < 300
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {responseStatus} {responseStatus === 200 ? "OK" : responseStatus === 201 ? "Created" : "Response"}
                      </span>
                    )}
                    {responseTime !== null && (
                      <span className="text-[11px] text-slate-500 flex items-center font-medium">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" /> {responseTime} ms
                      </span>
                    )}
                  </div>

                  {responseData && (
                    <button
                      onClick={handleCopyResponse}
                      className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-xs cursor-pointer font-medium"
                    >
                      {copiedResponse ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      <span>{copiedResponse ? "Copied" : "Copy Response"}</span>
                    </button>
                  )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 min-h-[220px] max-h-[380px] overflow-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48 space-x-2 text-slate-400 text-xs">
                      <span className="w-4 h-4 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin" />
                      <span>Sending request to Spring Boot Gateway...</span>
                    </div>
                  ) : responseData ? (
                    <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(responseData, null, 2)}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
                      <Globe className="w-8 h-8 text-slate-500 mb-2 opacity-60" />
                      <p className="text-slate-300 font-medium">Click "Send Request" to test this endpoint live.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Both client simulator and Spring Boot REST API endpoints are active.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
