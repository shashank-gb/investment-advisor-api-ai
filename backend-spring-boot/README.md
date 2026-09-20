# GrowWealth Investment Advisor - Backend Server

> Production-grade **Java Spring Boot 3** and **PostgreSQL** REST API backend designed for the [GrowWealth Flutter Mobile Application](https://github.com/shashank-gb/investment_advisor_app).

---

## 🏛️ Architecture & Tech Stack

- **Core Framework**: Java 17+ with Spring Boot 3.3.x
- **Database**: PostgreSQL 16 with Flyway versioned schema migrations
- **ORM / Persistence**: Spring Data JPA / Hibernate 6
- **Security**: Stateless Spring Security 6 with JWT (JJWT 0.12.5) Bearer Authentication & BCrypt password hashing
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Containerization**: Multi-stage `Dockerfile` & `docker-compose.yml` (App + PostgreSQL + pgAdmin)
- **Client Compatibility**: 100% compliant with the Flutter Riverpod + Dio data layer

---

## 🚀 Quick Start with Docker Compose

Run both the PostgreSQL database and the Spring Boot application with a single command:

```bash
cd backend-spring-boot
docker-compose up --build -d
```

Services will be accessible at:
- **Spring Boot REST API**: `http://localhost:8080`
- **Interactive Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI 3 Spec**: `http://localhost:8080/v3/api-docs`
- **PostgreSQL Database**: `localhost:5432` (User: `postgres`, Password: `postgrespassword`, DB: `growwealth_db`)
- **pgAdmin 4 Web Console**: `http://localhost:5050` (Email: `admin@growwealth.in`, Pass: `adminpassword`)

To check logs:
```bash
docker-compose logs -f backend
```

---

## ⚡ Connecting to Supabase (Cloud PostgreSQL)

Instead of hosting a local PostgreSQL instance, you can connect this backend directly to **Supabase** (free cloud PostgreSQL).

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and log in.
2. Click **New Project** and name it `growwealth-db`.
3. Set a strong database password (remember this password!).
4. Choose the region closest to your users (e.g. `ap-south-1 Mumbai`).
5. Click **Create new project** and wait ~1-2 minutes for provisioning.

### Step 2: Run Database Setup & Seed Tables
1. In your Supabase Dashboard, click on **SQL Editor** in the left navigation.
2. Click **New query**.
3. Open `src/main/resources/db/supabase_complete_setup.sql` (or copy from the web app's Supabase tab).
4. Paste the SQL script into the editor and click **Run**.
5. All 12 tables, indexes, relationships, and initial mutual fund seed data are created instantly!

### Step 3: Configure Spring Boot for Supabase
Set the environment variables or launch with the `supabase` Spring profile:

#### For Windows PowerShell:
```powershell
# Method A: Set environment variables (Recommended for PowerShell)
$env:SPRING_PROFILES_ACTIVE="supabase"
$env:SUPABASE_DB_URL="jdbc:postgresql://db.YOUR_REF.supabase.co:5432/postgres?sslmode=require"
$env:SUPABASE_DB_PASSWORD="YOUR_PASSWORD"
mvn spring-boot:run

# Method B: One-liner with quotes around each -D argument
mvn spring-boot:run "-Dspring-boot.run.profiles=supabase" "-Dspring.datasource.url=jdbc:postgresql://db.YOUR_REF.supabase.co:5432/postgres?sslmode=require" "-Dspring.datasource.username=postgres" "-Dspring.datasource.password=YOUR_PASSWORD"
```
*(Note: In PowerShell, wrapping each `"-Dkey=value"` in double quotes is required to prevent PowerShell from splitting on colons or treating flags as Maven plugins).*

#### For Linux / macOS / Git Bash:
```bash
export SUPABASE_PROJECT_REF="your-project-ref"
export SUPABASE_DB_PASSWORD="your-database-password"
export SUPABASE_DB_URL="jdbc:postgresql://db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require"
export SPRING_PROFILES_ACTIVE="supabase"

mvn spring-boot:run
```

### Connection Pooler vs Direct Connection:
- **Direct Connection (Port 5432)**:
  `jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require`
- **Session / Transaction Pooler (Port 6543 or 5432)** (Recommended for IPv4 networks and Cloud Run / Heroku / AWS):
  `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require`
  Username: `postgres.<project-ref>`
  Password: `<your-db-password>`

---

### 1. Prerequisites
- **Java Development Kit (JDK)**: 17 or higher (`java -version`)
- **Apache Maven**: 3.9+ (`mvn -version`)
- **PostgreSQL**: Running locally on port `5432`

### 2. Create the Database
```sql
CREATE DATABASE growwealth_db;
```

### 3. Configure Database Credentials
Edit `src/main/resources/application.yml` or set environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/growwealth_db
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=yourpassword
export JWT_SECRET=your-32-byte-secret-key-goes-here
```

### 4. Build and Run
```bash
mvn clean package
mvn spring-boot:run
```

Flyway will automatically apply migrations (`V1__init_schema.sql` and `V2__seed_mutual_funds.sql`) on startup.

---

## 📱 Connecting the Flutter Mobile App

The Flutter mobile app repo ([investment_advisor_app](https://github.com/shashank-gb/investment_advisor_app)) is pre-wired to talk to this backend.

### 1. Update `lib/core/config/app_config.dart`
In your Flutter repository, open `lib/core/config/app_config.dart`:

```dart
class AppConfig {
  AppConfig._();

  static const String appName = 'GrowWealth MF';

  // For Android Emulator use 10.0.2.2; for iOS simulator use 127.0.0.1; or your cloud domain
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8080/api/v1',
  );

  /// Set to false to use this live Spring Boot REST API!
  static const bool useMockData = bool.fromEnvironment(
    'USE_MOCK_DATA',
    defaultValue: false,
  );
}
```

### 2. Run Flutter with Environment Flags
```bash
# For Android Emulator:
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080/api/v1 --dart-define=USE_MOCK_DATA=false

# For iOS Simulator / Web:
flutter run --dart-define=API_BASE_URL=http://localhost:8080/api/v1 --dart-define=USE_MOCK_DATA=false

# For Physical Device (replace with your local machine's LAN IP):
flutter run --dart-define=API_BASE_URL=http://192.168.1.100:8080/api/v1 --dart-define=USE_MOCK_DATA=false
```

---

## 🔑 Default Test Credentials

| Role | Email | Password | KYC Status |
|------|-------|----------|------------|
| **Demo Investor** | `demo@growwealth.in` | `Password123` | `verified` |

---

## 📊 Database Schema Summary

| Table | Purpose |
|-------|---------|
| `users` | Investor accounts, contact information, PAN card, and KYC verification status |
| `refresh_tokens` | Secure token rotation for long-lived mobile sessions |
| `fund_categories` | Equity, Debt, Hybrid, ELSS, Index categories |
| `mutual_funds` | Real-world Indian mutual fund catalog (NAV, 1Y/3Y returns, risk level, AMC) |
| `fund_details` | In-depth fund sheet (AUM, Expense Ratio, Exit Load, Minimum SIP) |
| `fund_holdings` | Portfolio constituent weights (e.g. HDFC Bank, ICICI Bank, Infosys) |
| `fund_nav_history` | 30-day historical NAV price points for charting |
| `investment_goals` | House, Car, Retirement, Education, Wedding milestone planning |
| `portfolio_holdings` | Sourced BSE Star MF client holdings, folio numbers, units & current valuation |
| `watchlist_groups` | User personalized watchlists (e.g. "My Picks", "Tax Saving") |
| `watchlist_funds` | Tracked mutual funds inside watchlist groups |
| `content_items` | Educational blogs and promotional advisories |
| `market_indexes` | Benchmark index cache (NIFTY 50, SENSEX, NIFTY BANK) |

---

## 🧪 Testing the API via cURL

### 1. Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@growwealth.in","password":"Password123"}'
```

### 2. Fetch Top Mutual Funds
```bash
curl -X GET "http://localhost:8080/api/v1/funds/top-performing?category=equity&limit=5"
```

### 3. Fetch Portfolio Summary (Requires Bearer Token)
```bash
curl -X GET http://localhost:8080/api/v1/portfolio/summary \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```
