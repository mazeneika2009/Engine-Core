import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './service/api';

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
      userName: "User Name",
      adminUser: "Admin User",
      adminEmail: "user@example.com",
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
      apiSubtitle: "",
      billingTitle: "Billing Summary",
      billingSubtitle: "",
      nextBill: "",
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
        dataSync: "Cloud Data Sync",
        userOnboarding: "User Onboarding Flow",
        billingCalc: "Billing Calculator",
        inventoryMonitor: "Inventory Monitor",
        slackRelay: "Slack Relay Engine"
      },
      envs: {
        production: "Production",
        staging: "Staging"
      },
      sources: {
        webhook: "Webhook",
        schedule: "Schedule"
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
        reexecute: "Re-execute",
        viewBuilder: "View in Builder"
      }
    },
    projects: {
      title: "Workspace Projects",
      subtitle: "Manage your automated ecosystems, collaborative nodes, and mission-critical deployment pipelines.",
      createBtn: "Create New Project",
      searchPlaceholder: "Search projects or tags...",
      defaultTag: "Active",
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
        active: "Active",
        usEastCluster: "US-East Cluster",
        euWestCluster: "EU-West Cluster",
        globalCdn: "Global CDN"
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
      tags: { high: "High Priority" },
      alerts: { failedLogs: "Failed Logs Detected" },
      badges: { syncing: "Syncing" },
      terminalLogs: {
        collabOk: "Collaboration nodes operational."
      },
      health: {
          title: "System Health"
        },
      templatesPanel: {
        standard: "Standard",
        desc: "Ready to deploy automation sequence."
      },
      neural: {
        title: "Neural Feed",
        desc: "Real-time engine activity monitoring and node performance analytics.",
        load: "System Load"
      },
      createCard: { title: "New Project", subtitle: "" },
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
      usEast: "US-East",
      euCentral: "EU-Central",
      apSoutheast: "AP-Southeast",
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
      nodeDistDesc: "Distribute compute resources across multiple geographic regions to ensure high availability and low latency.",
      activeSessions: "Active Sessions",
      adminBadge: "ADMIN",
      memberBadge: "MEMBER",
      languageValues: "English, Arabic",
      timezoneValue: "UTC -05:00 (EST)"
    },
    builder: {
      defaultName: "New Flow",
      deploy: "Deploy",
      customerEmail: "customer_email",
      orderId: "order_id",
      invoiceAmount: "invoice_amount",
      customerEmail: "Customer Email",
      orderId: "Order ID",
      invoiceAmount: "Invoice Amount",
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
      nodeFields: {
        url: "Webhook URL",
        method: "HTTP Method",
        headers: "Headers",
        body: "Request Body",
        cron: "Schedule (Cron)",
        code: "Script Editor",
        retries: "Retry Count",
        timeout: "Timeout (ms)",
        placeholder: "Enter value..."
      },
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
        webhook: "Webhook",
        schedule: "Schedule",
        javascript: "JavaScript / Code",
        conditional: "Conditional (If/Else)",
        email: "Send Email",
        whatsapp: "WhatsApp Message",
        ai_agent: "AI Agent",
        slackMessage: "Slack Message",
        database: "Database Operation",
        jsonTransform: "JSON Transform",
        cloudStorage: "Cloud Storage",
        httpRequest: "HTTP Request",
        ai: "AI / Bot Assistant",
        notification: "System Notification",
        filter: "Data Filter",
        wait: "Wait / Delay",
        googleDrive: "Google Drive",
        chatgpt: "OpenAI ChatGPT",
        discord: "Discord Message",
        telegram: "Telegram Bot",
        paymentFailed: "Payment Failed Event",
        configureStep: "Configure step..."
      },
      properties: "Properties",
      test: "Test",
      save: "Save",
      configActive: "Configuration Active",
      requiresSetup: "Requires Setup"
    },
    notifications: {
      title: "Notifications",
      systemUpdate: "System Update",
        executionAlert: "Execution Alert",
        latencyDetected: "High latency detected in Alpha cluster.",
        apiKeyGenerated: "New API key generated.",
        timeRecent: "Just now",
      deployed: "Engine v2.4.0 deployed successfully.",
      time2h: "2 hours ago",
      builder: "Builder",
      newNodes: "New node types added to library.",
      executionError: "Execution Error",
      failedMsg: "Customer Data Sync failed.",
      markRead: "Mark all as read",
    },
    support: {
      title: "Support Center",
        community: "Community",
      quickLinks: "Quick Links",
      apiReference: "API Reference",
      contactUs: "Contact Us",
      needHelp: "Need help?",
      supportAvailability: "Our support team is available 24/7.",
      chatBtn: "Chat with Support",
      systemStatus: "System Status",
      nominal: "All Systems Nominal"
    }
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
      userName: "اسم المستخدم",
      adminUser: "مستخدم مسؤول",
      adminEmail: "user@example.com",
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
      apiSubtitle: "",
      billingTitle: "ملخص الفواتير",
      billingSubtitle: "",
      nextBill: "",
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
      downloadPdf: "تحميل PDF"
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
        dataSync: "مزامنة البيانات السحابية",
        userOnboarding: "تدفق تهيئة المستخدم",
        billingCalc: "حاسبة الفواتير",
        inventoryMonitor: "مراقب المخزون",
        slackRelay: "محرك ترحيل Slack"
      },
      envs: {
        production: "الإنتاج",
        staging: "بيئة الاختبار"
      },
      sources: {
        webhook: "خطاف الويب",
        schedule: "جدولة"
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
        reexecute: "إعادة تنفيذ",
        viewBuilder: "عرض في المنشئ"
      }
    },
    projects: {
      title: "مشاريع مساحة العمل",
      subtitle: "إدارة الأنظمة البيئية المؤتمتة والعقد التعاونية وخطوط النشر الحساسة.",
      createBtn: "إنشاء مشروع جديد",
      searchPlaceholder: "البحث عن مشاريع أو علامات...",
      defaultTag: "نشط",
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
        active: "نشط",
        usEastCluster: "مجموعة شرق الولايات المتحدة",
        euWestCluster: "مجموعة غرب الاتحاد الأوروبي",
        globalCdn: "شبكة توصيل المحتوى العالمية"
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
      tags: { high: "أولوية عالية" },
      alerts: { failedLogs: "تم اكتشاف سجلات فاشلة" },
      badges: { syncing: "جاري المزامنة" },
      terminalLogs: {
        collabOk: "عقد التعاون تعمل."
      },
      health: {
          title: "صحة النظام"
        },
      templatesPanel: {
        standard: "قياسي",
        desc: "تسلسل أتمتة جاهز للنشر."
      },
      neural: {
        title: "تغذية عصبية",
        desc: "مراقبة نشاط المحرك في الوقت الفعلي وتحليلات أداء العقد.",
        load: "تحميل النظام"
      },
      createCard: { title: "مشروع جديد", subtitle: "" },
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
      usEast: "شرق الولايات المتحدة",
      euCentral: "وسط أوروبا",
      apSoutheast: "جنوب شرق آسيا",
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
      adminBadge: "مسؤول",
      memberBadge: "عضو",
      languageValues: "الإنجليزية، العربية",
      timezoneValue: "UTC -05:00 (EST)"
    },
    builder: {
      defaultName: "سير أتمتة جديد",
      deploy: "نشر",
      customerEmail: "بريد_العميل",
      orderId: "معرف_الطلب",
      invoiceAmount: "مبلغ_الفاتورة",
      customerEmail: "بريد العميل",
      orderId: "معرف الطلب",
      invoiceAmount: "مبلغ الفاتورة",
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
      nodeFields: {
        url: "رابط الويب هوك",
        method: "طريقة HTTP",
        headers: "الترويسات",
        body: "جسم الطلب",
        cron: "الجدولة (Cron)",
        code: "محرر النصوص البرمجية",
        retries: "عدد المحاولات",
        timeout: "المهلة (ملي ثانية)",
        placeholder: "أدخل القيمة..."
      },
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
        webhookTrigger: "مشغل الويب هوك",
        webhook: "الويب هوك",
        schedule: "الجدولة",
        javascript: "جافا سكريبت / كود",
        conditional: "شرطي (إذا/إلا)",
        email: "إرسال بريد إلكتروني",
        whatsapp: "رسالة واتساب",
        ai_agent: "وكيل الذكاء الاصطناعي",
        slackMessage: "رسالة Slack",
        database: "عملية قاعدة البيانات",
        jsonTransform: "تحويل JSON",
        cloudStorage: "تخزين سحابي",
        httpRequest: "طلب HTTP",
        ai: "الذكاء الاصطناعي / مساعد بوت",
        notification: "إشعار النظام",
        filter: "تصفية البيانات",
        wait: "انتظار / تأخير",
      },
      properties: "الخصائص",
      test: "اختبار",
      save: "حفظ",
      configActive: "التكوين نشط",
      requiresSetup: "يتطلب إعداداً"
    },
    notifications: {
      title: "الإشعارات",
      systemUpdate: "تحديث النظام",
        executionAlert: "تنبيه تنفيذ",
        latencyDetected: "تم اكتشاف زمن استجابة عالٍ في عنقود ألفا.",
        apiKeyGenerated: "تم إنشاء مفتاح واجهة برمجة تطبيقات جديد.",
        timeRecent: "منذ قليل",
      deployed: "تم نشر المحرك v2.4.0 بنجاح.",
      time2h: "منذ ساعتين",
      builder: "المصمم",
      newNodes: "تم إضافة أنواع عقد جديدة للمكتبة.",
      executionError: "خطأ في التنفيذ",
      failedMsg: "فشل مزامنة ��يانات العملاء.",
      markRead: "تحديد الكل كمقروء",
    },
    support: {
      title: "مركز الدعم",
        community: "منتدى المجتمع",
      quickLinks: "روابط سريعة",
      apiReference: "مرجع واجهة البرمجيات",
      contactUs: "اتصل بنا",
      needHelp: "هل تحتاج للمساعدة؟",
      supportAvailability: "فريق الدعم متاح 24/7.",
      chatBtn: "تحدث مع الدعم",
      systemStatus: "حالة النظام",
      nominal: "جميع الأنظمة تعمل بشكل طبيعي",
    },
  },
};

// Generic values for account settings
translations.en.account.languageValues = "English, Arabic";
translations.ar.account.languageValues = "الإنجليزية، العربية";

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en');
  const [translationCache, setTranslationCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('appLang', lang);
    
    // Smooth transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.2s ease-in-out';
    
    setTimeout(() => {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      document.body.style.opacity = '1';
    }, 200);
  }, [lang]);

  const t = (path, params = {}) => {
    if (!path) return "";
    
    let translation = path.split('.').reduce((obj, key) => obj?.[key], translations[lang]);
    
    if (translation === undefined) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Missing translation for key: ${path} in language: ${lang}`);
      }
      return path; // Fallback to the key itself
    }

    if (typeof translation === 'string') {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.split(`{{${key}}}`).join(value);
      });
    }
    return translation;
  };

  // Translates dynamic text using Google Translate API (via the api service)
  const translateText = useCallback(async (text, sourceLang = 'en') => {
    if (!text || lang === sourceLang) return text;
    
    const cacheKey = `${lang}:${text}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    setIsLoading(true);
    try {
      const result = await api.translate(text, lang, sourceLang);
      const translated = result.translatedText;
      
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translated
      }));
      
      return translated;
    } catch (error) {
      console.error('Dynamic translation failed:', error);
      return text;
    } finally {
      setIsLoading(false);
    }
  }, [lang, translationCache]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translateText, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Reusable component for "Auto-Translation" of any dynamic string
export const AutoTranslate = ({ children }) => {
  const { lang, translateText } = useTranslation();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (typeof children === 'string' && children.trim().length > 0) {
      translateText(children).then(setTranslated);
    } else {
      setTranslated(children);
    }
  }, [children, lang, translateText]);

  return <>{translated}</>;
};

// Hook for translating dynamic values in forms (e.g., placeholders, options)
export const useAutoTranslate = () => {
  const { lang, translateText } = useTranslation();
  return useCallback(async (text) => {
    if (!text || lang === 'en') return text;
    return await translateText(text);
  }, [lang, translateText]);
};

export const useTranslation = () => useContext(LanguageContext);