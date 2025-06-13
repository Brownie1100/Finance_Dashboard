flowchart TD
  classDef frontend fill:#cce5ff,stroke:#004085,color:#004085;
  classDef backend fill:#d4edda,stroke:#155724,color:#155724;
  classDef database fill:#fff3cd,stroke:#856404,color:#856404;

  subgraph "User & Browser"
    subgraph "Frontend UI"
      UIApp["Next.js App Router"]:::frontend
      subgraph "App Router Pages"
        PgDashboard["Dashboard Page"]:::frontend
        PgExpenses["Expenses Page"]:::frontend
        PgIncome["Income Page"]:::frontend
        PgGoals["Goals Page"]:::frontend
        PgSavings["Savings Page"]:::frontend
      end
      subgraph "Components & Hooks"
        Components["UI Components"]:::frontend
        Hooks["Custom Hooks & Lib"]:::frontend
      end
      subgraph "Config & Assets"
        LayoutRoot["Root Layout"]:::frontend
        LayoutDash["Dashboard Layout"]:::frontend
        GlobalCSS["Global CSS"]:::frontend
        TailwindCfg["Tailwind Config"]:::frontend
        NextCfg["Next.js Config"]:::frontend
      end
    end
  end

  subgraph "Server & Infrastructure"
    subgraph "Backend API"
      Controllers["Controllers"]:::backend
      Services["Service Layer"]:::backend
      Repos["Repository Layer"]:::backend
    end
    DB["Relational Database"]:::database
  end

  UIApp -->|HTTP/REST| Controllers
  PgDashboard -->|renders| UIApp
  PgExpenses -->|renders| UIApp
  PgIncome -->|renders| UIApp
  PgGoals -->|renders| UIApp
  PgSavings -->|renders| UIApp
  Controllers -->|invokes| Services
  Services -->|calls| Repos
  Repos -->|JPA/JDBC| DB

  click UIApp "https://github.com/brownie1100/finance_dashboard/tree/main/Dashboard-frontend/financedashboard/app"
  click PgDashboard "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/(dashboard)/dashboard/page.tsx"
  click PgExpenses "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/(dashboard)/expenses/page.tsx"
  click PgIncome "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/(dashboard)/income/page.tsx"
  click PgGoals "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/(dashboard)/goals/page.tsx"
  click PgSavings "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/(dashboard)/savings/page.tsx"
  click LayoutRoot "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/layout.tsx"
  click LayoutDash "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/(dashboard)/layout.tsx"
  click GlobalCSS "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/app/globals.css"
  click Components "https://github.com/brownie1100/finance_dashboard/tree/main/Dashboard-frontend/financedashboard/components"
  click Hooks "https://github.com/brownie1100/finance_dashboard/tree/main/Dashboard-frontend/financedashboard/hooks"
  click TailwindCfg "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/tailwind.config.ts"
  click NextCfg "https://github.com/brownie1100/finance_dashboard/blob/main/Dashboard-frontend/financedashboard/next.config.mjs"
  click Services "https://github.com/brownie1100/finance_dashboard/tree/main/Dashboard-backend/financedashboard/src/main/java/com/financedashboard/service"
  click Repos "https://github.com/brownie1100/finance_dashboard/tree/main/Dashboard-backend/financedashboard/src/main/java/com/financedashboard/DBBean"
  click Controllers "https://github.com/brownie1100/finance_dashboard/tree/main/Dashboard-backend/financedashboard/src/main/java/com/financedashboard/controller"
  click DB "https://github.com/brownie1100/finance_dashboard/blob/main/Database/Scripts.sql"