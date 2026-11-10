/**
 * Cancel Your SaaS — Frontend Controller (script.js)
 * Clean Vanilla JavaScript with zero external libraries.
 */

(function () {
  'use strict';

  let tools = [];
  let selectedToolNames = new Set(); // Starts with 0 selected
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

    // Listen to system changes if user hasn't explicitly set a preference
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

    setupCategoryChips();
    setupEventListeners();
    updateCalculator();
    renderCards();
  }

  // ==========================================
  // Category Chips Filter
  // ==========================================
  function setupCategoryChips() {
    const categories = Array.from(new Set(tools.map(t => t.category))).sort();

    // Clear dynamic chips (leave 'All Tools')
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
      // Ease-out cubic curve
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

