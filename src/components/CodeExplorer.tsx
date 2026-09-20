import React, { useState, useEffect } from "react";
import { SourceTreeNode } from "../types";
import { 
  FileCode, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ExternalLink
} from "lucide-react";

export const CodeExplorer: React.FC = () => {
  const [tree, setTree] = useState<SourceTreeNode[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("src/main/java/com/growwealth/advisor/InvestmentAdvisorApplication.java");
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "src": true,
    "src/main": true,
    "src/main/java": true,
    "src/main/java/com": true,
    "src/main/java/com/growwealth": true,
    "src/main/java/com/growwealth/advisor": true,
    "src/main/java/com/growwealth/advisor/controller": true,
    "src/main/resources": true,
    "src/main/resources/db": true,
    "src/main/resources/db/migration": true,
  });

  useEffect(() => {
    fetchTree();
  }, []);

  useEffect(() => {
    if (selectedFilePath) {
      loadFile(selectedFilePath);
    }
  }, [selectedFilePath]);

  const fetchTree = async () => {
    try {
      const res = await fetch("/api/source-tree");
      if (res.ok) {
        const data = await res.json();
        setTree(data.tree || []);
      }
    } catch (e) {
      console.error("Failed to load source tree", e);
    }
  };

  const loadFile = async (path: string) => {
    setIsLoadingFile(true);
    try {
      const res = await fetch(`/api/source-file?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content || "");
      } else {
        setFileContent("// File not found or could not be loaded.");
      }
    } catch (e: any) {
      setFileContent(`// Error loading file: ${e.message}`);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const renderTree = (nodes: SourceTreeNode[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          const isDir = node.type === "directory";
          const isExpanded = !!expandedFolders[node.path];
          const isSelected = selectedFilePath === node.path;

          return (
            <div key={node.path}>
              <div
                onClick={() => {
                  if (isDir) {
                    toggleFolder(node.path);
                  } else {
                    setSelectedFilePath(node.path);
                  }
                }}
                style={{ paddingLeft: `${depth * 14 + 8}px` }}
                className={`flex items-center space-x-2 py-1.5 pr-2 rounded-md text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {isDir ? (
                  <>
                    <span className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-amber-500">
                      {isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3.5" />
                    <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  </>
                )}
                <span className="truncate font-mono">{node.name}</span>
              </div>

              {isDir && isExpanded && node.children && (
                <div>{renderTree(node.children, depth + 1)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>Spring Boot 3 Project Codebase</span>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
              /backend-spring-boot
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse all Java controllers, JPA entities, security configuration, Maven build definitions, and Docker deployment files.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/api/download-project"
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Entire ZIP</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Tree Navigation */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 overflow-hidden shadow-sm">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-2 py-2 border-b border-slate-200 mb-2">
            Project Files
          </div>
          <div className="max-h-[640px] overflow-y-auto pr-1">
            {tree.length > 0 ? renderTree(tree) : (
              <div className="p-4 text-xs text-slate-400">Loading codebase structure...</div>
            )}
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <FileCode className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-xs font-mono text-slate-800 font-semibold truncate">{selectedFilePath}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs px-2.5 py-1 rounded cursor-pointer transition-colors flex-shrink-0 font-medium"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedCode ? "Copied" : "Copy Code"}</span>
            </button>
          </div>

          <div className="bg-slate-900 p-4 flex-1 min-h-[500px] max-h-[640px] overflow-auto font-mono text-xs text-slate-200">
            {isLoadingFile ? (
              <div className="flex items-center justify-center h-48 space-x-2 text-slate-400">
                <span className="w-4 h-4 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin" />
                <span>Loading file...</span>
              </div>
            ) : (
              <pre className="whitespace-pre leading-relaxed text-slate-200">
                {fileContent}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
