import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    sidebar: {
      core: "ENGINE CORE",
      dashboard: "Dashboard",
      workflows: "Workflows",
      builder: "Builder",
      logs: "Logs",
      projects: "Projects",
      settings: "Settings",
      account: "Account",
      newWorkflow: "New Workflow",
      support: "Support",
      status: "System Status"
    },
    header: {
      search: "Search executions, workflows...",
      deploy: "Deploy Workflow",
      docs: "Docs",
      templates: "Templates",
      marketplace: "Marketplace",
      deployWorkflow: "Deploy Workflow",
      notifications: "Notifications",
      markRead: "Mark all as read"
    },
    common: {
      save: "Save Changes",
      cancel: "Cancel",
      active: "Active",
      idle: "Idle",
      name: "Name",
      id: "ID",
      duration: "Duration",
      revoked: "Revoked",
      success: "Success",
      failed: "Failed",
      processing: "Processing...",
      search: "Search...",
      viewAll: "View All",
      adminAccess: "Admin Access",
      userName: "Alex Rivero",
      adminUser: "Admin User",
      adminEmail: "admin@precision.io",
      of: "of",
      results: "results",
      step: "Step",
      retrying: "Retrying...",
      systemConfig: "System / Configuration",
      editProfile: "Edit Profile",
      comingSoon: "Coming Soon",
      learnMore: "Learn More",
      yesterday: "Yesterday",
      privacy: "Privacy",
      disabled: "Disabled",
      betaFeature: "Beta Feature",
      days: "Days",
      nominal: "Nominal",
      engineName: "Precision Engine",
      footerText: "Precision Engine © 2024 Axiom Logic Systems Ltd.",
      lastConfigured: "Last configured {{time}}",
      status: "Status"
    },
    time: "Time",
    settings: {
      title: "Platform Settings",
      subtitle: "Configure behavioral parameters, security keys, and manage resource allocation.",
      nav: {
        general: "General",
        docs: "Documentation",
        templates: "Templates",
        marketplace: "Marketplace"
      },
      localization: "Localization",
      regional: "Regional Environment",
      regionalDesc: "Define the primary operational language and timezone for your deployment logs and automated triggers.",
      langLabel: "System Language",
      timeLabel: "Preferred Time",
      saveBtn: "Save Regional Changes",
      interface: "Interface",
      visualEngine: "Visual Engine",
      themeDesc: "Switch between Light, Dark, or System Adaptive UI themes.",
      timePlaceholder: "5:00",
      deployingMsg: "Applying configuration and deploying...",
      privacy: "Privacy",
      apiTitle: "API Credentials",
      apiSubtitle: "Manage secure keys for third-party integrations.",
      billingTitle: "Billing Summary",
      billingSubtitle: "Professional Plus Tier • Next bill on Oct 12, 2024",
      nextBill: "Next bill on Oct 12, 2024",
      upgradePlan: "Upgrade Plan",
      security: "Security",
      dataScrubbing: "Data Scrubbing",
      dataScrubbingDesc: "Auto-purge logs older than 30 days to maintain high security.",
      dynamicScaling: "Dynamic Node Scaling",
      dynamicScalingDesc: "Automatically increase compute resources for complex workflows during peak traffic hours.",
      enableBeta: "Enable Beta",
      createNewKey: "Create New Key",
      identityName: "Identity Name",
      secretKey: "Secret Key",
      lastInvocation: "Last Invocation",
      apiData: {
        prodEngine: "Main Production Engine",
        stagingEngine: "Staging Development Environment",
        discordBot: "Discord Webhook Bot"
      },
      systemSynced: "System Synced",
      workflowExecutions: "Workflow Executions",
      dataStorage: "Data Storage",
      updatePayment: "Update Payment",
      transactionHistory: "Transaction History",
      downloadPdf: "Download PDF"
    },
    dashboard: {
      title: "Engine Dashboard",
      subtitle: "System performance and workflow orchestration overview.",
      uptime: "99.9% System Uptime",
      integrity: "Engine Integrity",
      latency: "Latency",
      cpu: "CPU Usage",
      recentExecutions: "Recent Executions",
      viewLogs: "View Full Logs",
      nodesOptimal: "All nodes performing within optimal parameters",
      noRecent: "No recent executions found.",
      successRateTitle: "Success Rate (Last 7 Days)",
      data: {
        slackBridge: "Slack Notification Bridge",
        dataSync: "Customer Data Sync",
        billingAuto: "Monthly Billing Auto-Gen",
        stripeWebhook: "Stripe Webhook Handler"
      },
      stats: {
        workflows: "TOTAL WORKFLOWS",
        executions: "TOTAL EXECUTIONS",
        errors: "ACTIVE ERRORS"
      },
      trends: {
        workflows: "+4 this week",
        executions: "12% growth",
        errors: "-2 from yesterday"
      },
      chartFilters: {
        week: "1W",
        month: "1M",
        all: "All"
      },
      days: {
        mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun"
      },
      table: {
        identity: "Workflow Identity",
        timestamp: "Timestamp",
        status: "Status",
        duration: "Duration"
      }
    },
    logs: {
      title: "Execution Logs",
      subtitle: "Real-time monitoring and historical execution data for your automation engines.",
      stats: {
        rate: "Success Rate",
        total: "Total Executions",
        duration: "Avg Duration"
      },
      table: {
        id: "Execution ID",
        name: "Workflow Name",
        start: "Start Time",
        showing: "Showing {{count}} {{unit}}",
        searchPlaceholder: "Search logs, engines or environments...",
        noResults: "No results found for"
      },
      data: {
        dataSync: "Data Sync Engine",
        userOnboarding: "User Onboarding Flow",
        billingCalc: "Billing Calculator",
        inventoryMonitor: "Inventory Monitor",
        slackRelay: "Slack Notification Relay"
      },
      details: {
        title: "Execution Details",
        failed: "Execution Failed",
        rerun: "Re-run",
        env: "Environment",
        version: "Node Version",
        source: "Trigger Source",
        retries: "Retries",
        payload: "Input Payload",
        copyJson: "Copy JSON",
        errorMsg: "Error Message",
        steps: "Execution Steps",
        reexecute: "Re-execute"
      }
    },
    projects: {
      title: "Workspace Projects",
      subtitle: "Manage your automated ecosystems, collaborative nodes, and mission-critical deployment pipelines.",
      createBtn: "Create New Project",
      searchPlaceholder: "Search projects or tags...",
      defaultTag: "Active",
      neural: {
        title: "Neural Feed Pulse",
        desc: "Automated sentiment analysis pipeline for global market signals.",
        load: "System Load",
        api: "API Response",
        vectors: "Vector Sync"
      },
      health: {
        title: "Engine Health Status",
        cluster: "Main Alpha Cluster",
        bus: "Event Message Bus",
        db: "Persistent DB Layer"
      },
      terminal: {
        title: "System Log Terminal"
      },
      stats: {
        nodes: "Active Nodes",
        activeFlows: "Active Flows",
        latency: "Avg Latency",
        efficiency: "Efficiency"
      },
      trends: { cycle: "vs last cycle" },
      status: {
        operational: "Operational",
        optimized: "Optimized",
        lastSync: "Last synced {{time}} ago",
        active: "Active"
      },
      details: {
        workflows: "Active Workflows",
        teamAssets: "Team Assets",
        heatmap: "Execution Heatmap"
      },
      actions: {
        viewArch: "View Architecture",
        settings: "Settings",
        openDash: "Open Dashboard"
      },
      data: {
        logistics: "Global Logistics",
        logisticsDesc: "Supply chain management and route optimization.",
        cyber: "Cyber Threat Intel",
        cyberDesc: "Automated threat detection and IP blocking protocols.",
        cloud: "Multi-Cloud Relay",
        cloudDesc: "Real-time sync across AWS and Azure instances.",
        routeOptimizer: "Route Optimizer",
        invoiceGen: "Invoice Generator",
        compliance: "Compliance Checker"
      },
      tags: { high: "High Priority" },
      alerts: { failedLogs: "Failed Logs Detected" },
      badges: { syncing: "Syncing" },
      createCard: { title: "New Project", subtitle: "Initialize empty node workspace" },
      terminalLogs: {
        nodeOk: "All nodes performing optimally.",
        sslOk: "SSL certificates verified.",
        collabOk: "New handshake successful.",
        checkOk: "Health check passed."
      },
      modal: { title: "Create Project", name: "Project Name", namePlace: "e.g. Global Logistics", desc: "Description", descPlace: "Goals...", tag: "Initial Tag", tagPlace: "e.g. Production", submit: "Create Project" }
    },
    workflows: {
      title: "Workflow Engine",
      subtitle: "Manage and monitor 24 active automation sequences.",
      searchPlaceholder: "Search workflows...",
      all: "All",
      active: "Active",
      errors: "Errors",
      stats: {
        totalExecutions: "Total Executions",
        successRate: "Success Rate",
        performance: "Performance",
        activeNodes: "Active Nodes",
        failedRuns: "Failed Runs",
        attention: "Needs Attention"
      },
      newWorkflow: "New Workflow",
      filter: "Filter",
      noWorkflows: "No workflows found.",
      pagination: {
        showing: "Showing 1-4 of 24"
      },
      table: {
        name: "Workflow Name",
        lastRun: "Last Run",
        successRate: "Success Rate",
        status: "Status",
        actions: "Actions"
      },
      tips: {
        title: "Engine Tip",
        desc: "Workflows with success rates below 95% are automatically flagged. See"
      },
      upcoming: {
        badge: "Coming Soon",
        title: "Multi-Cloud Compute Engine v3.0"
      },
      modal: {
        createTitle: "Create New Workflow",
        nameLabel: "Workflow Name",
        namePlaceholder: "e.g. Customer Data Sync",
        descLabel: "Description",
        descPlaceholder: "High-level workflow goals...",
        submit: "Start Builder"
      },
      tipTitle: "Engine Tip",
      tipDesc: "Workflows with success rates below 95% are automatically flagged."
    },
    account: {
      title: "Account Settings",
      verified: "Verified Account",
      securityScore: "Security Score",
      teamTitle: "Team Management",
      workspaceEnv: "Workspace Environment",
      nodeDist: "Node Distribution",
      dataRetention: "Data Retention",
      dangerZone: "Danger Zone",
      terminate: "Terminate Account",
      role: "Platform Architect",
      fullName: "Full Name",
      emailAddress: "Email Address",
      language: "System Languages",
      timezone: "Operating Timezone",
      securityDesc: "Overall environment protection level.",
      securityShortcuts: "Security Shortcuts",
      rotateApiKeys: "Rotate API Keys",
      auditLogs: "Access Audit Logs",
      managingTeam: "You are managing 4 active engineers.",
      securityAccessTitle: "Security & Access",
      twoFactorAuth: "Two-Factor Auth",
      password: "Account Password",
      passwordChanged: "Changed 12 days ago",
      workspaceEnvDesc: "Configure operational parameters for your engine cluster.",
      archiveWorkspace: "Archive Workspace",
      saveChanges: "Save Changes",
      autoScaleThreshold: "Auto-Scale Threshold",
      autoScaleThresholdDesc: "Define compute limit before dynamic node scaling.",
      precision: "Precision",
      throughput: "Throughput",
      dataRetentionDesc: "Automatic deletion of system logs.",
      docsDesc: "Deep dives into architecture and node behaviors.",
      openDocs: "Open Documentation Hub",
      templatesTitle: "Workflow Templates",
      templatesDesc: "Browse pre-configured logic nodes.",
      exploreTemplates: "Explore Templates",
      marketplaceTitle: "Engine Marketplace",
      marketplaceDesc: "Discover community nodes and logic blocks.",
      getNotified: "Get Notified",
      dangerZoneDesc: "Permanently delete workspace and all nodes.",
      nodeDistDesc: "Distribute compute resources across multiple geographic regions for high availability and low latency.",
      activeSessions: "Active Sessions",
      sessionBrowser: "Chrome on MacOS — London, UK",
      sarahName: "Sarah Chen",
      sarahRole: "Senior Frontend Engineer",
      marcusName: "Marcus Thorne",
      marcusRole: "Backend Developer",
      adminBadge: "ADMIN",
      memberBadge: "MEMBER",
      usEast: "us-east-1",
      euCentral: "eu-central-1",
      apSoutheast: "ap-southeast-1",
      languageValues: "English, Arabic",
      timezoneValue: "GMT+02:00 (Cairo)"
    },
    builder: {
      defaultName: "New Automation Flow",
      deploy: "Deploy",
      customerEmail: "customer_email",
      orderId: "order_id",
      invoiceAmount: "invoice_amount",
      active: "Active",
      nodes: "Nodes",
      variables: "Variables",
      addData: "+ Add Data",
      saveConfig: "Save Configuration",
      deleteNode: "Delete Node",
      nodeId: "Node ID",
      label: "Label",
      advanced: "Advanced",
      if: "IF",
      is: "IS",
      greaterThan: "Greater Than",
      val: "VAL",
      logicConfig: "Logic Configuration",
      library: "Node Library",
      triggers: "Triggers",
      logic: "Logic",
      actions: "Actions",
      data: "Data",
      type: {
        trigger: "trigger",
        logic: "logic",
        action: "action",
        data: "data"
      },
      nodesList: {
        webhookTrigger: "Webhook Trigger",
        paymentFailed: "payment.failed",
        configureStep: "Configure step...",
        webhook: "Webhook",
        schedule: "Schedule",
        javascript: "JavaScript",
        conditional: "Conditional",
        sendEmail: "Send Email",
        slackMessage: "Slack Message",
        database: "Database",
        jsonTransform: "JSON Transform"
      },
      properties: "Properties",
      test: "Test",
      save: "Save"
    },
    notifications: {
      title: "Notifications",
      systemUpdate: "System Update",
      deployed: "Engine v2.4.0 deployed successfully.",
      time2h: "2 hours ago",
      builder: "Builder",
      newNodes: "New node types added to library.",
      executionError: "Execution Error",
      failedMsg: "Customer Data Sync failed.",
      markRead: "Mark all as read",
      apiKeyGenerated: "New API key generated.",
      timeRecent: "Just now",
      executionAlert: "Execution Alert",
      latencyDetected: "High latency detected in Alpha cluster."
    },
    support: {
      title: "Support Center",
      quickLinks: "Quick Links",
      apiReference: "API Reference",
      contactUs: "Contact Us",
      needHelp: "Need help?",
      supportAvailability: "Our support team is available 24/7.",
      chatBtn: "Chat with Support",
      systemStatus: "System Status",
      nominal: "All Systems Nominal",
      community: "Community"
    }
    // Workflow Data Translations
    , "Slack Notification Bridge": "Slack Notification Bridge",
    "Customer Data Sync": "Customer Data Sync",
    "Monthly Billing Auto-Gen": "Monthly Billing Auto-Gen",
    "Stripe Webhook Handler": "Stripe Webhook Handler",
    "Customer Onboarding Sync": "Customer Onboarding Sync",
    "Stripe Transaction Webhook": "Stripe Transaction Webhook",
    "Data Warehouse Export": "Data Warehouse Export",
    "Slack Alerting Router": "Slack Alerting Router",
    "Today, 14:22:04": "Today, 14:22:04",
    "Today, 14:18:55": "Today, 14:18:55",
    "Today, 13:45:12": "Today, 13:45:12",
    "Today, 13:12:00": "Today, 13:12:00",
    "2 mins ago": "2 mins ago",
    "14 mins ago": "14 mins ago",
    "Failed 2h ago": "Failed 2h ago",
    "Just now": "Just now",
    "1.2s": "1.2s",
    "458ms": "458ms",
    "8.4s": "8.4s",
    "210ms": "210ms",
    "1.4s": "1.4s",
    "0.8s": "0.8s",
    "42s": "42s",
    "0.2s": "0.2s",
    "2h ago": "2h ago"
  },
  ar: {
    sidebar: {
      core: "نواة المحرك",
      dashboard: "لوحة التحكم",
      workflows: "سير العمل",
      builder: "المنشئ",
      logs: "السجلات",
      projects: "المشاريع",
      settings: "الإعدادات",
      account: "الحساب",
      newWorkflow: "سير عمل جديد",
      support: "الدعم الفني",
      status: "حالة النظام"
    },
    header: {
      search: "بحث في السجلات، سير العمل...",
      deploy: "نشر سير العمل",
      docs: "الوثائق",
      templates: "القوالب",
      marketplace: "المتجر",
      deployWorkflow: "نشر سير العمل",
      notifications: "الإشعارات",
      markRead: "تحديد الكل كمقروء"
    },
    common: {
      save: "حفظ التغييرات",
      cancel: "إلغاء",
      active: "نشط",
      idle: "خامل",
      name: "الاسم",
      id: "المعرف",
      duration: "المدة",
      revoked: "ملغي",
      success: "ناجح",
      failed: "فاشل",
      processing: "جاري المعالجة...",
      search: "بحث...",
      viewAll: "عرض الكل",
      adminAccess: "وصول المسؤول",
      userName: "أليكس ريفيرو",
      adminUser: "مستخدم مسؤول",
      adminEmail: "admin@precision.io",
      of: "من",
      results: "نتائج",
      step: "خطوة",
      retrying: "إعادة المحاولة...",
      systemConfig: "النظام / التكوين",
      editProfile: "تعديل الملف الشخصي",
      comingSoon: "قريباً",
      learnMore: "اعرف المزيد",
      yesterday: "أمس",
      privacy: "الخصوصية",
      disabled: "معطل",
      betaFeature: "ميزة تجريبية",
      days: "أيام",
      nominal: "طبيعي",
      engineName: "محرك الدقة",
      footerText: "محرك الدقة © 2024 Axiom Logic Systems Ltd.",
      status: "الحالة",
      lastConfigured: "آخر تكوين: {{time}}"
    },
    time: "الوقت",
    settings: {
      title: "إعدادات المنصة",
      subtitle: "تكوين معلمات السلوك ومفاتيح الأمان وإدارة تخصيص الموارد.",
      nav: {
        general: "عام",
        docs: "الوثائق",
        templates: "القوالب",
        marketplace: "المتجر"
      },
      localization: "التوطين",
      regional: "البيئة الإقليمية",
      regionalDesc: "حدد لغة التشغيل الأساسية والمنطقة الزمنية لسجلات النشر والمحفزات الآلية.",
      langLabel: "لغة النظام",
      timeLabel: "الوقت المفضل",
      saveBtn: "حفظ التغييرات الإقليمية",
      interface: "الواجهة",
      visualEngine: "المحرك البصري",
      themeDesc: "التبديل بين مظاهر واجهة المستخدم الفاتحة أو الداكنة أو المتكيفة مع النظام.",
      timePlaceholder: "5:00",
      deployingMsg: "جاري تطبيق التكوين والنشر...",
      privacy: "الخصوصية",
      apiTitle: "بيانات اعتماد واجهة البرمجيات",
      apiSubtitle: "إدارة المفاتيح الآمنة لعمليات التكامل الخارجية.",
      billingTitle: "ملخص الفواتير",
      billingSubtitle: "فئة Professional Plus • الفاتورة القادمة في 12 أكتوبر 2024",
      nextBill: "الفاتورة القادمة في 12 أكتوبر 2024",
      upgradePlan: "ترقية الخطة",
      security: "الأمان",
      dataScrubbing: "تنظيف البيانات",
      dataScrubbingDesc: "الحذف التلقائي للسجلات الأقدم من 30 يومًا للحفاظ على أمان عالٍ.",
      dynamicScaling: "توسيع العقد الديناميكي",
      dynamicScalingDesc: "زيادة موارد الحوسبة تلقائيًا لسير العمل المعقد خلال ساعات الذروة.",
      enableBeta: "تمكين الميزة التجريبية",
      createNewKey: "إنشاء مفتاح جديد",
      identityName: "اسم الهوية",
      secretKey: "المفتاح السري",
      lastInvocation: "آخر استدعاء",
      systemSynced: "تم مزامنة النظام",
      workflowExecutions: "عمليات تنفيذ سير العمل",
      dataStorage: "تخزين البيانات",
      updatePayment: "تحديث الدفع",
      transactionHistory: "سجل المعاملات",
      downloadPdf: "تحميل PDF",
      apiData: {
        prodEngine: "محرك الإنتاج الرئيسي",
        stagingEngine: "بيئة التطوير التجريبية",
        discordBot: "بوت Discord Webhook"
      }
    },
    dashboard: {
      title: "لوحة تحكم المحرك",
      subtitle: "نظرة عامة على أداء النظام وتنسيق سير العمل.",
      uptime: "99.9% وقت تشغيل النظام",
      integrity: "سلامة المحرك",
      latency: "زمن الاستجابة",
      cpu: "استخدام المعالج",
      recentExecutions: "عمليات التنفيذ الأخيرة",
      viewLogs: "عرض السجلات الكاملة",
      nodesOptimal: "جميع العقد تعمل ضمن المعايير المثالية",
      noRecent: "لم يتم العثور على عمليات تنفيذ حديثة.",
      successRateTitle: "معدل النجاح (آخر 7 أيام)",
      data: {
        slackBridge: "جسر إشعارات Slack",
        dataSync: "مزامنة بيانات العملاء",
        billingAuto: "إنشاء تلقائي للفواتير الشهرية",
        stripeWebhook: "معالج خطاف ويب Stripe"
      },
      stats: {
        workflows: "إجمالي سير العمل",
        executions: "إجمالي عمليات التنفيذ",
        errors: "الأخطاء النشطة"
      },
      trends: {
        workflows: "+4 هذا الأسبوع",
        executions: "نمو بنسبة 12%",
        errors: "-2 منذ أمس"
      },
      chartFilters: {
        week: "أسبوع",
        month: "شهر",
        all: "الكل"
      },
      days: {
        mon: "إثنين", tue: "ثلاثاء", wed: "أربعاء", thu: "خميس", fri: "جمعة", sat: "سبت", sun: "أحد"
      },
      table: {
        identity: "هوية سير العمل",
        timestamp: "الطابع الزمني",
        status: "الحالة",
        duration: "المدة"
      }
    },
    logs: {
      title: "سجلات التنفيذ",
      subtitle: "مراقبة فورية وبيانات التنفيذ التاريخية لمحركات الأتمتة الخاصة بك.",
      stats: {
        rate: "معدل النجاح",
        total: "إجمالي العمليات",
        duration: "متوسط المدة"
      },
      table: {
        id: "هوية التنفيذ",
        name: "اسم سير العمل",
        start: "وقت البدء",
        showing: "عرض {{count}} {{unit}}",
        searchPlaceholder: "بحث في السجلات أو المحركات أو البيئات...",
        noResults: "لم يتم العثور على نتائج لـ"
      },
      data: {
        dataSync: "محرك مزامنة البيانات",
        userOnboarding: "سير تهيئة المستخدم",
        billingCalc: "حاسبة الفواتير",
        inventoryMonitor: "مراقب المخزون",
        slackRelay: "مرحل إشعارات Slack"
      },
      details: {
        title: "تفاصيل التنفيذ",
        failed: "فشل التنفيذ",
        rerun: "إعادة تشغيل",
        env: "البيئة",
        version: "إصدار العقدة",
        source: "مصدر المحفز",
        retries: "المحاولات",
        payload: "بيانات الإدخال",
        copyJson: "نسخ JSON",
        errorMsg: "رسالة الخطأ",
        steps: "خطوات التنفيذ",
        reexecute: "إعادة تنفيذ"
      }
    },
    projects: {
      title: "مشاريع مساحة العمل",
      subtitle: "إدارة الأنظمة البيئية المؤتمتة والعقد التعاونية وخطوط النشر الحساسة.",
      createBtn: "إنشاء مشروع جديد",
      searchPlaceholder: "البحث عن مشاريع أو علامات...",
      defaultTag: "نشط",
      neural: {
        title: "نبض التغذية العصبية",
        desc: "خط تحليل المشاعر الآلي لإشارات السوق العالمية.",
        load: "حمل النظام",
        api: "استجابة API",
        vectors: "مزامنة المتجهات"
      },
      health: {
        title: "حالة سلامة المحرك",
        cluster: "عنقود ألفا الرئيسي",
        bus: "ناقل رسائل الأحداث",
        db: "طبقة قاعدة البيانات الدائمة"
      },
      terminal: {
        title: "محطة سجل النظام"
      },
      stats: {
        nodes: "العقد النشطة",
        activeFlows: "التدفقات النشطة",
        latency: "متوسط زمن الاستجابة",
        efficiency: "الكفاءة"
      },
      trends: { cycle: "مقابل الدورة السابقة" },
      status: {
        operational: "قيد التشغيل",
        optimized: "محسّن",
        lastSync: "آخر مزامنة منذ {{time}}",
        active: "نشط"
      },
      details: {
        workflows: "سير العمل النشط",
        teamAssets: "أصول الفريق",
        heatmap: "الخريطة الحرارية للتنفيذ"
      },
      actions: {
        viewArch: "عرض الهندسة المعمارية",
        settings: "الإعدادات",
        openDash: "فتح لوحة التحكم"
      },
      data: {
        logistics: "الخدمات اللوجستية العالمية",
        logisticsDesc: "إدارة سلسلة التوريد وتحسين المسار.",
        cyber: "معلومات تهديدات الإنترنت",
        cyberDesc: "بروتوكولات الكشف التلقائي عن التهديدات وحظر بروتوكول الإنترنت.",
        cloud: "مرحل السحاب المتعدد",
        cloudDesc: "بروتوكولات الكشف التلقائي عن التهديدات وحظر بروتوكول الإنترنت.",
        routeOptimizer: "محسن المسار",
        invoiceGen: "منشئ الفواتير",
        compliance: "مدقق الامتثال"
      },
      tags: { high: "أولوية عالية" },
      alerts: { failedLogs: "تم اكتشاف سجلات فاشلة" },
      badges: { syncing: "جاري المزامنة" },
      createCard: { title: "مشروع جديد", subtitle: "تهيئة مساحة عمل عقدة فارغة" },
      terminalLogs: {
        nodeOk: "جميع العقد تعمل بشكل مثالي.",
        sslOk: "تم التحقق من شهادات SSL.",
        collabOk: "مصافحة جديدة ناجحة.",
        checkOk: "اجتاز فحص السلامة."
      },
      modal: {
        title: "إنشاء مشروع",
        name: "اسم المشروع",
        namePlace: "مثال: اللوجستيات العالمية",
        desc: "الوصف",
        descPlace: "الأهداف...",
        tag: "العلامة الأولية",
        tagPlace: "مثال: الإنتاج",
        submit: "إنشاء المشروع"
      }
    },
    workflows: {
      title: "محرك سير العمل",
      subtitle: "إدارة ومراقبة 24 تسلسل أتمتة نشط.",
      newWorkflow: "سير عمل جديد",
      searchPlaceholder: "البحث في سير العمل...",
      all: "الكل",
      active: "نشط",
      errors: "أخطاء",
      stats: {
        totalExecutions: "إجمالي العمليات",
        successRate: "معدل النجاح",
        performance: "الأداء",
        activeNodes: "العقد النشطة",
        failedRuns: "عمليات فاشلة",
        attention: "تحتاج اهتمام"
      },
      filter: "تصفية",
      noWorkflows: "لم يتم العثور على سير عمل.",
      pagination: {
        showing: "عرض 1-4 من أصل 24"
      },
      table: {
        name: "اسم سير العمل",
        lastRun: "آخر تشغيل",
        successRate: "معدل النجاح",
        status: "الحالة",
        actions: "إجراءات"
      },
      tips: {
        title: "نصيحة المحرك",
        desc: "يتم تمييز سير العمل الذي يقل معدل نجاحه عن 95٪ تلقائيًا. راجع"
      },
      upcoming: {
        badge: "قريبًا",
        title: "محرك الحوسبة السحابية المتعددة v3.0"
      },
      modal: {
        createTitle: "إنشاء سير عمل جديد",
        nameLabel: "اسم سير العمل",
        namePlaceholder: "مثال: مزامنة بيانات العملاء",
        descLabel: "الوصف",
        descPlaceholder: "أهداف سير العمل عالية المستوى...",
        submit: "بدء المنشئ"
      },
      tipTitle: "نصيحة المحرك",
      tipDesc: "يتم تمييز سير العمل الذي يقل معدل نجاحه عن 95٪ تلقائيًا."
    },
    account: {
      title: "إعدادات الحساب",
      verified: "حساب موثق",
      securityScore: "درجة الأمان",
      teamTitle: "إدارة الفريق",
      workspaceEnv: "بيئة مساحة العمل",
      nodeDist: "توزيع العقد",
      dataRetention: "احتفاظ البيانات",
      dangerZone: "منطقة الخطر", // Already exists
      terminate: "إنهاء الحساب", // Already exists
      role: "مهندس المنصة",
      fullName: "الاسم الكامل",
      emailAddress: "عنوان البريد الإلكتروني",
      language: "لغات النظام",
      timezone: "المنطقة الزمنية للتشغيل",
      securityDesc: "مستوى حماية البيئة العام.",
      securityShortcuts: "اختصارات الأمان",
      rotateApiKeys: "تدوير مفاتيح API",
      auditLogs: "سجلات تدقيق الوصول",
      managingTeam: "أنت تدير 4 مهندسين نشطين.",
      securityAccessTitle: "الأمان والوصول",
      twoFactorAuth: "المصادقة الثنائية",
      password: "كلمة مرور الحساب",
      passwordChanged: "تم التغيير منذ 12 يومًا",
      workspaceEnvDesc: "تكوين معلمات التشغيل لعنقود المحرك الخاص بك.",
      archiveWorkspace: "أرشفة مساحة العمل",
      saveChanges: "حفظ التغييرات",
      nodeDistDesc: "توزيع موارد الحوسبة عبر مناطق جغرافية متعددة لضمان التوفر العالي وتقليل زمن الاستجابة.",
      autoScaleThreshold: "عتبة التوسيع التلقائي",
      autoScaleThresholdDesc: "تحديد حد الحوسبة قبل توسيع العقد الديناميكي.",
      precision: "دقة",
      throughput: "الإنتاجية",
      dataRetentionDesc: "الحذف التلقائي لسجلات النظام.",
      dangerZoneDesc: "حذف مساحة العمل وجميع العقد بشكل دائم.",
      activeSessions: "الجلسات النشطة",
      sessionBrowser: "متصفح Chrome على MacOS — لندن، المملكة المتحدة",
      docsDesc: "نظرة عميقة في بنية المحرك وسلوك العقد.",
      openDocs: "فتح مركز الوثائق",
      templatesTitle: "قوالب سير العمل",
      templatesDesc: "تصفح العقد المنطقية المعدة مسبقًا.",
      exploreTemplates: "استكشاف القوالب",
      marketplaceTitle: "سوق المحرك",
      marketplaceDesc: "اكتشف العقد المجتمعية وكتل المنطق.",
      getNotified: "احصل على إشعارات",
      sarahName: "سارة تشن",
      sarahRole: "كبير مهندسي الواجهة الأمامية",
      marcusName: "ماركوس ثورن",
      marcusRole: "مطور خلفية",
      adminBadge: "مسؤول",
      memberBadge: "عضو",
      usEast: "us-east-1",
      euCentral: "eu-central-1",
      apSoutheast: "ap-southeast-1",
      languageValues: "الإنجليزية، العربية",
      timezoneValue: "جرينتش+02:00 (القاهرة)"
    },
    builder: {
      defaultName: "سير أتمتة جديد",
      deploy: "نشر",
      customerEmail: "بريد_العميل",
      orderId: "معرف_الطلب",
      invoiceAmount: "مبلغ_الفاتورة",
      active: "نشط",
      nodes: "العقد",
      variables: "المتغيرات",
      addData: "+ إضافة بيانات",
      saveConfig: "حفظ التكوين",
      deleteNode: "حذف العقدة",
      nodeId: "معرف العقدة",
      label: "التسمية",
      advanced: "متقدم",
      if: "إذا",
      is: "يكون",
      greaterThan: "أكبر من",
      val: "قيمة",
      logicConfig: "تكوين المنطق",
      library: "مكتبة العقد",
      triggers: "المشغلات",
      logic: "المنطق",
      actions: "الإجراءات",
      data: "البيانات",
      type: {
        trigger: "مشغل",
        logic: "منطق",
        action: "إجراء",
        data: "بيانات"
      },
      nodesList: {
        webhookTrigger: "مشغل Webhook",
        paymentFailed: "payment.failed",
        configureStep: "تكوين الخطوة...",
        webhook: "Webhook",
        schedule: "جدولة",
        javascript: "JavaScript",
        conditional: "شرطي",
        sendEmail: "إرسال بريد إلكتروني",
        slackMessage: "رسالة Slack",
        database: "قاعدة بيانات",
        jsonTransform: "تحويل JSON"
      },
      properties: "الخصائص",
      test: "اختبار",
      save: "حفظ"
    },
    notifications: {
      title: "الإشعارات",
      systemUpdate: "تحديث النظام",
      deployed: "تم نشر المحرك v2.4.0 بنجاح.",
      time2h: "منذ ساعتين",
      builder: "المصمم",
      newNodes: "تم إضافة أنواع عقد جديدة للمكتبة.",
      executionError: "خطأ في التنفيذ",
      failedMsg: "فشل مزامنة ��يانات العملاء.",
      markRead: "تحديد الكل كمقروء",
      apiKeyGenerated: "تم إنشاء مفتاح واجهة برمجة تطبيقات جديد.",
      timeRecent: "منذ قليل",
      executionAlert: "تنبيه تنفيذ",
      latencyDetected: "تم اكتشاف زمن استجابة عالٍ في عنقود ألفا."
    },
    support: {
      title: "مركز الدعم",
      quickLinks: "روابط سريعة",
      apiReference: "مرجع واجهة البرمجيات",
      contactUs: "اتصل بنا",
      needHelp: "هل تحتاج للمساعدة؟",
      supportAvailability: "فريق الدعم متاح 24/7.",
      chatBtn: "تحدث مع الدعم",
      systemStatus: "حالة النظام",
      nominal: "جميع الأنظمة تعمل بشكل طبيعي",
      community: "منتدى المجتمع"
    },
    // Workflow Data Translations
    "Slack Notification Bridge": "جسر إشعارات Slack",
    "Customer Data Sync": "مزامنة بيانات العملاء",
    "Monthly Billing Auto-Gen": "إنشاء تلقائي للفواتير الشهرية",
    "Stripe Webhook Handler": "معالج خطاف ويب Stripe",
    "Customer Onboarding Sync": "مزامنة تهيئة العملاء",
    "Stripe Transaction Webhook": "خطاف معاملات Stripe",
    "Data Warehouse Export": "تصدير مستودع البيانات",
    "Slack Alerting Router": "راوتر تنبيهات Slack",
    "Today, 14:22:04": "اليوم، 14:22:04",
    "Today, 14:18:55": "اليوم، 14:18:55",
    "Today, 13:45:12": "اليوم، 13:45:12",
    "Today, 13:12:00": "اليوم، 13:12:00",
    "2 mins ago": "منذ دقيقتين",
    "14 mins ago": "منذ 14 دقيقة",
    "Failed 2h ago": "فشل منذ ساعتين",
    "Just now": "الآن",
    "1.2s": "1.2 ثانية",
    "458ms": "458 مللي ثانية",
    "8.4s": "8.4 ثانية",
    "210ms": "210 مللي ثانية",
    "1.4s": "1.4 ثانية",
    "0.8s": "0.8 ثانية",
    "42s": "42 ثانية",
    "0.2s": "0.2 ثانية",
    "2h ago": "منذ ساعتين"
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (path, params = {}) => {
    let translation = path.split('.').reduce((obj, key) => obj?.[key], translations[lang]) || path;
    if (typeof translation === 'string') {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.split(`{{${key}}}`).join(value);
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);