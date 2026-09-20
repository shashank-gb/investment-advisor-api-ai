import React, { useState } from "react";
import { 
  Layers, 
  Smartphone, 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Copy, 
  Check, 
  Container,
  Zap,
  ArrowRight
} from "lucide-react";

export const ArchitectureView: React.FC = () => {
  const [copiedCompose, setCopiedCompose] = useState(false);

  const dockerComposeSnippet = `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: growwealth-postgres
    environment:
      POSTGRES_DB: growwealth_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d growwealth_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: growwealth-spring-boot
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/growwealth_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgrespassword
      SPRING_FLYWAY_ENABLED: 'true'
      JWT_SECRET: growwealth-investment-advisor-secret-key-super-secure-256bits
    ports:
      - "8080:8080"

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: growwealth-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@growwealth.in
      PGADMIN_DEFAULT_PASSWORD: adminpassword
    ports:
      - "5050:80"

volumes:
  pgdata:`;

  const handleCopyCompose = () => {
    navigator.clipboard.writeText(dockerComposeSnippet);
    setCopiedCompose(true);
    setTimeout(() => setCopiedCompose(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Visual Topology Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>Full-Stack Architecture & Data Flow</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          End-to-end request lifecycle from Flutter Riverpod state management to Spring Boot services and PostgreSQL storage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Layer 1: Client */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-sky-700 mb-2">
                <Smartphone className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Mobile Client</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Flutter 3.x App</h3>
              <p className="text-[11px] text-slate-500 mt-1">Cross-platform iOS & Android</p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 font-mono">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                  <span>Riverpod 2.x State</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                  <span>Dio HTTP + Interceptor</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                  <span>Flutter Secure Storage</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
              Port: HTTPS Client
            </div>
          </div>

          {/* Layer 2: Security & Gateway */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-amber-700 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Security Tier</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Spring Security 6</h3>
              <p className="text-[11px] text-slate-500 mt-1">Stateless token authentication</p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 font-mono">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span>JWT JJWT 0.12.5</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span>BCrypt (strength 10)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span>CORS & Rate Limiting</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
              Filter: OncePerRequest
            </div>
          </div>

          {/* Layer 3: Application Server */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                <Server className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">App Server</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Spring Boot 3.3.0</h3>
              <p className="text-[11px] text-slate-500 mt-1">Java 17 LTS / Embedded Tomcat</p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 font-mono">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  <span>7 REST Controllers</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  <span>6 Domain Services</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  <span>OpenAPI 3 / Swagger</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
              Port: 8080 (Cloud: 3000)
            </div>
          </div>

          {/* Layer 4: Persistence */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-emerald-700 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cloud Database</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Supabase (PostgreSQL 16)</h3>
              <p className="text-[11px] text-slate-500 mt-1">Managed Cloud DB / Zero Ops</p>
              <ul className="mt-3 space-y-1 text-[11px] text-slate-700 font-mono">
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span>14 Relational Tables</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span>Flyway / SQL Editor Seed</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span>SSL Mode Required</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
              Port: 5432 (Direct) / 6543 (Pooler)
            </div>
          </div>
        </div>
      </div>

      {/* Docker Compose Quick Deployment */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
              <Container className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Docker Compose Deployment</h3>
              <p className="text-xs text-slate-500">One-command setup with PostgreSQL, Spring Boot, and pgAdmin web console</p>
            </div>
          </div>

          <button
            onClick={handleCopyCompose}
            className="flex items-center space-x-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs px-3 py-1.5 rounded-lg cursor-pointer font-medium"
          >
            {copiedCompose ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedCompose ? "Copied" : "Copy Compose"}</span>
          </button>
        </div>

        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[380px] leading-relaxed">
          {dockerComposeSnippet}
        </pre>
      </div>
    </div>
  );
};
