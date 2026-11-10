/**
 * Cancel Your SaaS — Frontend Controller (script.js)
 * Clean Vanilla JavaScript with zero external libraries.
 */

(function () {
  'use strict';

  let tools = [];
  let selectedToolNames = new Set(); // Starts with 0 selected unless URL params exist
  let currentCategory = 'all';
  let animatedSavingsCurrent = 0;
  let animationFrameId = null;

  const DIFFICULTY_CONFIG = {
    easy: { text: 'Easy', class: 'easy' },
    medium: { text: 'Medium', class: 'medium' },
    hard: { text: 'Hard', class: 'hard' }
  };

  const STARTUP_STACK_PRESET = new Set([
    "Slack", "Jira", "GitHub (Team)", "Postman", "Google Analytics",
    "Figma (Pro)", "1Password (Business)", "Zapier (Starter)",
    "Intercom", "Notion (Plus)"
  ]);

  const AGENCY_STACK_PRESET = new Set([
    "Slack", "Figma (Pro)", "Loom (Business)", "Miro (Starter)",
    "Airtable (Team)", "Typeform (Basic)", "DocuSign (Personal)",
    "Calendly", "Asana"
  ]);

  const INDIE_STACK_PRESET = new Set([
    "GitHub (Team)", "Postman", "Vercel (Pro)", "Firebase (Blaze Base)",
    "Google Analytics", "1Password (Business)", "Make (Core)", "Notion (Plus)"
  ]);

  const DOCKER_QUICK_RUN = {
    "Mattermost": "docker run -d -p 8065:8065 mattermost/mattermost-team-edition",
    "Vaultwarden": "docker run -d -p 8080:80 -v ./vw-data:/data vaultwarden/server:latest",
    "n8n": "docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n docker.n8n.io/n8nio/n8n",
    "NocoDB": "docker run -d -p 8080:8080 -v ./nocodb:/usr/app/data nocodb/nocodb:latest",
    "Appsmith": "docker run -d -p 80:80 -v ./appsmith-stacks:/appsmith-stacks appsmith/appsmith-ce",
    "Gitea": "docker run -d -p 3000:3000 -p 222:22 -v ./gitea:/data gitea/gitea:latest",
    "Activepieces": "docker run -d -p 8080:80 activepieces/activepieces:latest",
    "FreeScout": "docker run -d -p 80:80 tiredofit/freescout",
    "Chatwoot": "docker run -d -p 3000:3000 chatwoot/chatwoot:latest",
    "Plane": "docker run -d -p 80:80 makeplane/plane",
    "Cal.com": "docker run -d -p 3000:3000 calcom.docker.scarf.sh/calcom/cal.com",
    "Vikunja": "docker run -p 3456:3456 -v ./vikunja:/app/vikunja/files vikunja/vikunja",
    "WeKan": "docker run -d -p 8080:8080 wekanteam/wekan",
    "NetBird": "docker run -d -p 33073:33073 netbirdio/netbird",
    "OpenBao": "docker run -d -p 8200:8200 openbao/openbao server -dev",
    "Formbricks": "docker run -d -p 3000:3000 formbricks/formbricks",
    "HeyForm": "docker run -d -p 8000:8000 heyform/heyform",
    "BookStack": "docker run -d -p 6875:80 lscr.io/linuxserver/bookstack",
    "Wiki.js": "docker run -d -p 80:3000 requarks/wiki:2",
    "Documenso": "docker run -d -p 3000:3000 documenso/documenso",
    "Plausible Analytics": "docker run -d -p 8000:8000 plausible/analytics",
    "PostHog": "docker run -d -p 8000:8000 posthog/posthog:latest",
    "Matomo": "docker run -d -p 8080:80 matomo:latest",
    "Jitsu": "docker run -d -p 8000:8000 jitsucom/jitsu:latest",
    "Penpot": "docker run -d -p 9001:9001 penpotapp/frontend",
    "authentik": "docker run -d -p 9000:9000 beryju/authentik",
    "Cap": "docker run -d -p 3000:3000 capsoftware/cap",
    "GlitchTip": "docker run -d -p 8000:8000 glitchtip/glitchtip",
    "LimeSurvey": "docker run -d -p 8080:80 limesurvey/limesurvey",
    "OhMyForm": "docker run -d -p 5000:5000 ohmyform/ohmyform"
  };

  // DOM Elements
  const container = document.getElementById('tools-container');
  const searchInput = document.getElementById('search-input');
  const categoryChipsContainer = document.getElementById('category-chips');
  const teamSizeInput = document.getElementById('team-size-input');
  const countSelectedEl = document.getElementById('count-selected');
  const valMonthlyBillEl = document.getElementById('val-monthly-bill');
  const valYearlySavingsEl = document.getElementById('val-yearly-savings');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconEl = document.getElementById('theme-icon');

  // Share Modal & Toast Elements
  const btnShareSavings = document.getElementById('btn-share-savings');
  const shareModal = document.getElementById('share-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const sharePreviewTextEl = document.getElementById('share-preview-text');
  const btnCopyShare = document.getElementById('btn-copy-share');
  const btnShareX = document.getElementById('btn-share-x');
  const btnShareIn = document.getElementById('btn-share-in');
  const toastNotify = document.getElementById('toast-notify');

  // ==========================================
  // Theme Management
  // ==========================================
  function initTheme() {
    const saved = localStorage.getItem('cs_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(activeTheme, false);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('cs_theme')) {
        setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  function setTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      localStorage.setItem('cs_theme', theme);
    }
    if (theme === 'light') {
      themeIconEl.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      themeToggleBtn.setAttribute('title', 'Switch to dark theme');
    } else {
      themeIconEl.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
      themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      themeToggleBtn.setAttribute('title', 'Switch to light theme');
    }
  }

  // ==========================================
  // URL State Management (?seats=15&tools=Slack,Jira)
  // ==========================================
  function parseUrlState() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const seats = urlParams.get('seats');
      if (seats) {
        const parsedSeats = parseInt(seats, 10);
        if (!isNaN(parsedSeats) && parsedSeats > 0) {
          teamSizeInput.value = parsedSeats;
        }
      }

      const toolsParam = urlParams.get('tools');
      if (toolsParam) {
        const queryTools = toolsParam.split(',').map(s => s.trim().toLowerCase());
        tools.forEach(t => {
          if (queryTools.includes(t.saas_name.toLowerCase()) || queryTools.includes(t.alternative_name.toLowerCase())) {
            selectedToolNames.add(t.saas_name);
          }
        });
      }
    } catch (e) {
      console.warn('Could not parse URL state', e);
    }
  }

  function syncUrlState() {
    try {
      const url = new URL(window.location);
      let teamSize = parseInt(teamSizeInput.value, 10);
      if (isNaN(teamSize) || teamSize < 1) teamSize = 10;

      if (teamSize !== 10) {
        url.searchParams.set('seats', teamSize);
      } else {
        url.searchParams.delete('seats');
      }

      if (selectedToolNames.size > 0) {
        url.searchParams.set('tools', Array.from(selectedToolNames).join(','));
      } else {
        url.searchParams.delete('tools');
      }

      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn('Could not sync URL state', e);
    }
  }

  // ==========================================
  // Data Loading & Fallback
  // ==========================================
  async function loadData() {
    try {
      const response = await fetch('tools.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      tools = await response.json();
    } catch (fetchError) {
      console.warn('Direct fetch failed. Checking for inline fallback data...', fetchError);
      if (window.__TOOLS_DATA__ && Array.isArray(window.__TOOLS_DATA__)) {
        tools = window.__TOOLS_DATA__;
      } else {
        container.innerHTML = `
          <div class="error-banner-box">
            <h3>Failed to load tools data</h3>
            <p>If you are opening this HTML file directly from disk, your browser's security policy may block local file fetching.</p>
            <p style="margin-top: 8px;">Run this command inside the <strong>docs</strong> folder:</p>
            <code>python -m http.server</code>
            <p style="margin-top: 8px;">Then open: <a href="http://localhost:8000" target="_blank" style="color: var(--accent);">http://localhost:8000</a></p>
          </div>
        `;
        return;
      }
    }

    parseUrlState();
    setupCategoryChips();
    setupEventListeners();
    setupShareModal();
    updateCalculator();
    renderCards();
  }

  // ==========================================
  // Category Chips Filter
  // ==========================================
  function setupCategoryChips() {
    const categories = Array.from(new Set(tools.map(t => t.category))).sort();

    const allChip = categoryChipsContainer.querySelector('[data-category="all"]');
    categoryChipsContainer.innerHTML = '';
    
    allChip.textContent = `All Tools (${tools.length})`;
    categoryChipsContainer.appendChild(allChip);

    categories.forEach(cat => {
      const count = tools.filter(t => t.category === cat).length;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.dataset.category = cat;
      chip.textContent = `${cat} (${count})`;
      chip.setAttribute('aria-label', `Filter by ${cat}`);
      chip.addEventListener('click', () => {
        categoryChipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = cat;
        renderCards();
      });
      categoryChipsContainer.appendChild(chip);
    });

    allChip.addEventListener('click', () => {
      categoryChipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      allChip.classList.add('active');
      currentCategory = 'all';
      renderCards();
    });
  }

  // ==========================================
  // Event Listeners
  // ==========================================
  function setupEventListeners() {
    searchInput.addEventListener('input', () => {
      renderCards();
    });

    teamSizeInput.addEventListener('input', () => {
      updateCalculator();
    });

    // Preset Buttons
    document.getElementById('btn-select-all').addEventListener('click', () => {
      tools.forEach(t => selectedToolNames.add(t.saas_name));
      updateCardCheckboxes();
      updateCalculator();
    });

    document.getElementById('btn-startup-preset').addEventListener('click', () => {
      selectedToolNames.clear();
      tools.forEach(t => {
        if (STARTUP_STACK_PRESET.has(t.saas_name)) {
          selectedToolNames.add(t.saas_name);
        }
      });
      updateCardCheckboxes();
      updateCalculator();
    });

    document.getElementById('btn-agency-preset').addEventListener('click', () => {
      selectedToolNames.clear();
      tools.forEach(t => {
        if (AGENCY_STACK_PRESET.has(t.saas_name)) {
          selectedToolNames.add(t.saas_name);
        }
      });
      updateCardCheckboxes();
      updateCalculator();
    });

    document.getElementById('btn-indie-preset').addEventListener('click', () => {
      selectedToolNames.clear();
      tools.forEach(t => {
        if (INDIE_STACK_PRESET.has(t.saas_name)) {
          selectedToolNames.add(t.saas_name);
        }
      });
      updateCardCheckboxes();
      updateCalculator();
    });

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      exportToCsv();
    });

    document.getElementById('btn-clear-all').addEventListener('click', () => {
      selectedToolNames.clear();
      updateCardCheckboxes();
      updateCalculator();
    });
  }

  // ==========================================
  // Interactive Calculator Logic
  // ==========================================
  window.toggleToolSelection = function (saasName) {
    if (selectedToolNames.has(saasName)) {
      selectedToolNames.delete(saasName);
    } else {
      selectedToolNames.add(saasName);
    }
    updateCardState(saasName);
    updateCalculator();
  };

  window.toggleDockerSnippet = function (btn) {
    const box = btn.nextElementSibling;
    if (box) {
      box.classList.toggle('open');
      const isOpen = box.classList.contains('open');
      const chevron = btn.querySelector('.chevron');
      if (chevron) chevron.textContent = isOpen ? '▴' : '▾';
    }
  };

  window.copyDockerSnippet = async function (btn, code) {
    try {
      await navigator.clipboard.writeText(code);
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      showToast('📋 Copied Docker run command!');
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    } catch (e) {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      btn.textContent = 'Copied!';
      showToast('📋 Copied Docker run command!');
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 2000);
    }
  };

  function updateCardState(saasName) {
    const card = document.querySelector(`[data-tool-name="${CSS.escape(saasName)}"]`);
    if (card) {
      const isSelected = selectedToolNames.has(saasName);
      const checkbox = card.querySelector('.tool-card-checkbox');
      if (checkbox) checkbox.checked = isSelected;
      card.classList.toggle('selected', isSelected);
    }
  }

  function updateCardCheckboxes() {
    document.querySelectorAll('.tool-card').forEach(card => {
      const name = card.getAttribute('data-tool-name');
      const isSelected = selectedToolNames.has(name);
      const checkbox = card.querySelector('.tool-card-checkbox');
      if (checkbox) checkbox.checked = isSelected;
      card.classList.toggle('selected', isSelected);
    });
  }

  function animateSavingsNumber(targetValue) {
    const startValue = animatedSavingsCurrent;
    const duration = 450; // ms
    const startTime = performance.now();

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * ease;

      valYearlySavingsEl.textContent = `$${Math.round(current).toLocaleString('en-US')}`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        animatedSavingsCurrent = targetValue;
        valYearlySavingsEl.textContent = `$${Math.round(targetValue).toLocaleString('en-US')}`;
      }
    }

    animationFrameId = requestAnimationFrame(step);
  }

  function updateCalculator() {
    let teamSize = parseInt(teamSizeInput.value, 10);
    if (isNaN(teamSize) || teamSize < 1) teamSize = 1;

    const count = selectedToolNames.size;
    countSelectedEl.textContent = `${count} / ${tools.length}`;

    syncUrlState();

    if (count === 0) {
      valMonthlyBillEl.textContent = '$0.00';
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animatedSavingsCurrent = 0;
      valYearlySavingsEl.innerHTML = `<span class="savings-empty-hint">Tick the tools you pay for</span>`;
      return;
    }

    const selectedList = tools.filter(t => selectedToolNames.has(t.saas_name));
    const monthlyPerSeat = selectedList.reduce((acc, t) => acc + (t.saas_price_per_user_month || 0), 0);
    const monthlyTeamBill = monthlyPerSeat * teamSize;
    const yearlySavings = monthlyTeamBill * 12;

    valMonthlyBillEl.textContent = `$${monthlyTeamBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    animateSavingsNumber(yearlySavings);
  }

  // ==========================================
  // Share Savings Modal & Toast
  // ==========================================
  function showToast(message) {
    toastNotify.textContent = message;
    toastNotify.classList.add('show');
    setTimeout(() => {
      toastNotify.classList.remove('show');
    }, 2800);
  }

  function getSharePayload() {
    let teamSize = parseInt(teamSizeInput.value, 10);
    if (isNaN(teamSize) || teamSize < 1) teamSize = 10;

    const selectedList = tools.filter(t => selectedToolNames.has(t.saas_name));
    const monthlyPerSeat = selectedList.reduce((acc, t) => acc + (t.saas_price_per_user_month || 0), 0);
    const yearlySavings = Math.round(monthlyPerSeat * teamSize * 12);

    let toolsSnippet = '';
    if (selectedList.length <= 3) {
      toolsSnippet = selectedList.map(t => t.saas_name).join(', ');
    } else {
      const top3 = selectedList.slice(0, 3).map(t => t.saas_name).join(', ');
      toolsSnippet = `${top3} +${selectedList.length - 3} more`;
    }

    const shareUrl = window.location.href;
    const text = `Our ${teamSize}-person team could save $${yearlySavings.toLocaleString('en-US')}/year by replacing ${toolsSnippet} with open-source alternatives. Check your savings: ${shareUrl}`;

    return { text, shareUrl, yearlySavings, teamSize, toolsSnippet };
  }

  function setupShareModal() {
    btnShareSavings.addEventListener('click', () => {
      if (selectedToolNames.size === 0) {
        showToast('Tick at least 1 tool to calculate your shareable savings!');
        return;
      }

      const { text, shareUrl, yearlySavings, teamSize, toolsSnippet } = getSharePayload();
      sharePreviewTextEl.textContent = text;

      // Update social URLs
      const tweetText = `Our ${teamSize}-person team could save $${yearlySavings.toLocaleString('en-US')}/year by replacing ${toolsSnippet} with open-source alternatives 💸\n\nCalculate yours:`;
      btnShareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;

      btnShareIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

      shareModal.classList.add('active');
      shareModal.setAttribute('aria-hidden', 'false');
    });

    function closeModal() {
      shareModal.classList.remove('active');
      shareModal.setAttribute('aria-hidden', 'true');
    }

    modalCloseBtn.addEventListener('click', closeModal);

    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && shareModal.classList.contains('active')) {
        closeModal();
      }
    });

    btnCopyShare.addEventListener('click', async () => {
      const { text } = getSharePayload();
      try {
        await navigator.clipboard.writeText(text);
        showToast('📋 Link & message copied to clipboard!');
        closeModal();
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('📋 Link & message copied!');
        closeModal();
      }
    });
  }

  // ==========================================
  // CSV Export
  // ==========================================
  function exportToCsv() {
    let teamSize = parseInt(teamSizeInput.value, 10);
    if (isNaN(teamSize) || teamSize < 1) teamSize = 10;

    let targetTools = tools.filter(t => selectedToolNames.has(t.saas_name));
    let isSubset = true;
    if (targetTools.length === 0) {
      targetTools = tools;
      isSubset = false;
    }

    const headers = [
      "Category",
      "SaaS Name",
      "SaaS Price (USD/User/Mo)",
      "Alternative Name",
      "Alternative URL",
      "License",
      "Difficulty",
      "What You'll Miss"
    ];

    const escapeCsv = (str) => {
      if (str == null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = targetTools.map(t => [
      escapeCsv(t.category),
      escapeCsv(t.saas_name),
      t.saas_price_per_user_month,
      escapeCsv(t.alternative_name),
      escapeCsv(t.alternative_url),
      escapeCsv(t.license),
      escapeCsv(t.difficulty),
      escapeCsv(t.what_youll_miss)
    ].join(','));

    const monthlySeatSum = targetTools.reduce((acc, t) => acc + (t.saas_price_per_user_month || 0), 0);
    const yearlySavings = monthlySeatSum * teamSize * 12;

    const summaryRows = [
      `# Cancel Your SaaS - Cost & Alternative Savings Report`,
      `# Export Date: ${new Date().toISOString().split('T')[0]}`,
      `# Scope: ${isSubset ? `Selected Tools (${targetTools.length})` : `Full Catalog (${targetTools.length})`}`,
      `# Team Seats: ${teamSize}`,
      `# Estimated Yearly Savings: $${Math.round(yearlySavings).toLocaleString('en-US')}`,
      `# Directory: https://cancel-your-saas.pages.dev/`,
      `#`
    ];

    const csvContent = "\uFEFF" + [...summaryRows, headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cancel-your-saas-report-${teamSize}seats.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`📥 Exported ${targetTools.length} tools to CSV report!`);
  }

  // ==========================================
  // Render Cards
  // ==========================================
  function renderCards() {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = tools.filter(tool => {
      const matchCat = (currentCategory === 'all' || tool.category === currentCategory);
      if (!matchCat) return false;

      if (!query) return true;
      const haystack = [
        tool.saas_name,
        tool.alternative_name,
        tool.license,
        tool.what_youll_miss,
        tool.category
      ].join(' ').toLowerCase();

      return haystack.includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-results-box">
          <h3>No matching tools found</h3>
          <p>Try searching for a different keyword or reset the category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(tool => {
      const isSelected = selectedToolNames.has(tool.saas_name);
      const diffKey = String(tool.difficulty || 'medium').toLowerCase();
      const diffInfo = DIFFICULTY_CONFIG[diffKey] || { text: tool.difficulty, class: 'medium' };

      const saasPriceFormatted = tool.saas_price_per_user_month === 0
        ? 'Free'
        : `$${tool.saas_price_per_user_month.toFixed(2)}/mo`;

      const cloudPriceText = tool.cloud_price ? ` or ${tool.cloud_price}` : '';
      const cloudLinkHtml = tool.cloud_option_url
        ? `<a href="${tool.cloud_option_url}" target="_blank" rel="noopener">Cloud</a>`
        : '';

      const escapedSaasName = tool.saas_name.replace(/'/g, "\\'");
      const dockerCmd = DOCKER_QUICK_RUN[tool.alternative_name] || null;
      const dockerSnippetHtml = dockerCmd ? `
        <div class="card-docker-wrap">
          <button type="button" class="btn-docker-toggle" onclick="toggleDockerSnippet(this)" aria-label="Toggle Docker command for ${tool.alternative_name}">
            <span>📦 Quick Run (Docker)</span>
            <span class="chevron">▾</span>
          </button>
          <div class="card-docker-box">
            <code>${dockerCmd}</code>
            <button type="button" class="btn-copy-code" onclick="copyDockerSnippet(this, '${dockerCmd.replace(/'/g, "\\'")}')" aria-label="Copy Docker command">Copy</button>
          </div>
        </div>
      ` : '';

      return `
        <article class="tool-card ${isSelected ? 'selected' : ''}" data-tool-name="${tool.saas_name}">
          <div>
            <div class="card-header-row">
              <span class="card-category-label">${tool.category}</span>
              <span class="difficulty-badge ${diffInfo.class}">
                <span class="dot">●</span> ${diffInfo.text}
              </span>
            </div>

            <label class="card-checkbox-label">
              <input type="checkbox" class="tool-card-checkbox" ${isSelected ? 'checked' : ''} onchange="toggleToolSelection('${escapedSaasName}')" aria-label="Include ${tool.saas_name} in savings calculator">
              <span>I pay for this tool</span>
            </label>

            <div class="card-comparison-title">
              <span class="saas-dead-name">🪦 ${tool.saas_name}</span>
              <span>→</span>
              <span class="alt-live-name">✅ ${tool.alternative_name}</span>
            </div>

            <div class="card-price-strip">
              <div class="price-item saas">
                <span class="price-item-label">💸 You pay</span>
                <span class="price-item-val">${saasPriceFormatted}</span>
              </div>
              <div class="price-item alt">
                <span class="price-item-label">🆓 You could pay</span>
                <span class="price-item-val">$0 (Self-host)${cloudPriceText}</span>
              </div>
            </div>

            <div class="card-miss-box">
              <strong>⚠️ What you'll miss</strong>
              <p>${tool.what_youll_miss}</p>
            </div>

            ${dockerSnippetHtml}
          </div>

          <div class="card-footer-row">
            <span class="license-tag">${tool.license}</span>
            <div class="card-links-group">
              <a href="${tool.alternative_url}" target="_blank" rel="noopener">Visit ${tool.alternative_name}</a>
              ${cloudLinkHtml}
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Initialize
  initTheme();
  loadData();
})();
