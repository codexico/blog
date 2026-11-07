/**
 * Modern UTF-8 & Unicode Extension Controller
 */

// Storage Keys
const STORAGE_FAVS = 'utf_favorites';
const STORAGE_RECENT = 'utf_recents';
const STORAGE_COPY_COUNT = 'utf_copy_count';
const STORAGE_LAST_CATEGORY = 'utf_last_category';

// State
let categoryCache = {}; // group -> array of character objects
let currentCategory = 'home';
let lastSelectedCategory = 'home';
let activeGlyph = null;
let favoriteGlyphs = [];
let recentGlyphs = [];
let copyCount = 0;
let toastTimeout = null;
let LOCALIZED_EMOJI_NAMES = {};

// High-frequency explicit Unicode Character Name Lookup
const UNICODE_EXACT_NAMES = {
  '0024': 'DOLLAR SIGN ($)',
  '00A2': 'CENT SIGN (¢)',
  '00A3': 'POUND SIGN (£)',
  '00A4': 'CURRENCY SIGN (¤)',
  '00A5': 'YEN SIGN (¥)',
  '20AC': 'EURO SIGN (€)',
  '20BF': 'BITCOIN SIGN (₿)',
  '2318': 'COMMAND KEY (⌘)',
  '2325': 'OPTION KEY (⌥)',
  '21E7': 'SHIFT KEY (⇧)',
  '232B': 'BACKSPACE KEY (⌫)',
  '221E': 'INFINITY (∞)'
};

/**
 * i18n Translation Helper
 */
function getMsg(key, fallback) {
  if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
    const msg = chrome.i18n.getMessage(key);
    if (msg) return msg;
  }
  return fallback;
}

function applyI18n() {
  if (typeof chrome === 'undefined' || !chrome.i18n || !chrome.i18n.getMessage) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.textContent = msg;
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.title = msg;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.placeholder = msg;
  });
}

/**
 * Load Localized Emoji and Symbol Names (pt / es) on demand
 */
async function loadLocalizedEmojiNames() {
  const uiLang = (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) 
    ? chrome.i18n.getUILanguage().toLowerCase() 
    : (navigator.language || 'en').toLowerCase();

  let langFile = null;
  if (uiLang.startsWith('pt')) langFile = 'emojis_pt.json';
  else if (uiLang.startsWith('es')) langFile = 'emojis_es.json';

  if (!langFile) return;

  try {
    const res = await fetch(`/data/${langFile}`);
    if (res.ok) {
      LOCALIZED_EMOJI_NAMES = await res.json();
    }
  } catch (e) {
    // Silently fallback to official unicode names
  }
}

/**
 * Dynamic Unicode Character Naming Engine
 */
function getUnicodeName(symbol, hex, section) {
  const upperHex = hex.toUpperCase();
  if (LOCALIZED_EMOJI_NAMES && LOCALIZED_EMOJI_NAMES[upperHex]) {
    return LOCALIZED_EMOJI_NAMES[upperHex];
  }
  if (typeof OFFICIAL_UNICODE_NAMES !== 'undefined' && OFFICIAL_UNICODE_NAMES[upperHex]) {
    return OFFICIAL_UNICODE_NAMES[upperHex];
  }
  if (UNICODE_EXACT_NAMES && UNICODE_EXACT_NAMES[upperHex]) {
    return UNICODE_EXACT_NAMES[upperHex];
  }

  const code = parseInt(hex, 16);

  // Braille Patterns (0x2800 - 0x28FF)
  if (code >= 0x2800 && code <= 0x28FF) {
    const offset = code - 0x2800;
    if (offset === 0) return 'BRAILLE PATTERN BLANK';
    let dots = [];
    if (offset & 0x01) dots.push('1');
    if (offset & 0x02) dots.push('2');
    if (offset & 0x04) dots.push('3');
    if (offset & 0x08) dots.push('4');
    if (offset & 0x10) dots.push('5');
    if (offset & 0x20) dots.push('6');
    if (offset & 0x40) dots.push('7');
    if (offset & 0x80) dots.push('8');
    return `BRAILLE PATTERN DOTS-${dots.join('')}`;
  }

  // Circled Digits (0x2460 - 0x2473)
  if (code >= 0x2460 && code <= 0x2473) {
    return `CIRCLED DIGIT ${code - 0x245F}`;
  }
  // Circled Latin Capital Letters (0x24B6 - 0x24CF)
  if (code >= 0x24B6 && code <= 0x24CF) {
    const char = String.fromCharCode(65 + (code - 0x24B6));
    return `CIRCLED LATIN CAPITAL LETTER ${char}`;
  }

  return `${section || 'Unicode'} Character U+${upperHex}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  applyI18n();
  await loadLocalizedEmojiNames();

  // Detect Side Panel mode via query param or window width
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'sidepanel' || window.innerWidth < 440) {
    document.body.classList.add('is-sidepanel');
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth < 440) {
      document.body.classList.add('is-sidepanel');
    } else if (urlParams.get('mode') !== 'sidepanel') {
      document.body.classList.remove('is-sidepanel');
    }
  });

  await initStorage();
  setupEventListeners();

  renderCategory(lastSelectedCategory || 'home');
});

/**
 * Initialize storage for favorites, recents, copy counter, and last category
 */
async function initStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const data = await chrome.storage.local.get([STORAGE_FAVS, STORAGE_RECENT, STORAGE_COPY_COUNT, STORAGE_LAST_CATEGORY]);
    favoriteGlyphs = data[STORAGE_FAVS] || [];
    recentGlyphs = data[STORAGE_RECENT] || [];
    copyCount = data[STORAGE_COPY_COUNT] || 0;
    lastSelectedCategory = data[STORAGE_LAST_CATEGORY] || 'home';
  } else {
    try {
      favoriteGlyphs = JSON.parse(localStorage.getItem(STORAGE_FAVS) || '[]');
      recentGlyphs = JSON.parse(localStorage.getItem(STORAGE_RECENT) || '[]');
      copyCount = parseInt(localStorage.getItem(STORAGE_COPY_COUNT) || '0', 10);
      lastSelectedCategory = localStorage.getItem(STORAGE_LAST_CATEGORY) || 'home';
    } catch (e) {
      favoriteGlyphs = [];
      recentGlyphs = [];
      copyCount = 0;
      lastSelectedCategory = 'home';
    }
  }
}

function saveLastCategory(cat) {
  lastSelectedCategory = cat;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ [STORAGE_LAST_CATEGORY]: cat });
  } else {
    try {
      localStorage.setItem(STORAGE_LAST_CATEGORY, cat);
    } catch (e) {}
  }
}

async function saveStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.set({
      [STORAGE_FAVS]: favoriteGlyphs,
      [STORAGE_RECENT]: recentGlyphs,
      [STORAGE_COPY_COUNT]: copyCount,
      [STORAGE_LAST_CATEGORY]: lastSelectedCategory
    });
  } else {
    localStorage.setItem(STORAGE_FAVS, JSON.stringify(favoriteGlyphs));
    localStorage.setItem(STORAGE_RECENT, JSON.stringify(recentGlyphs));
    localStorage.setItem(STORAGE_COPY_COUNT, copyCount.toString());
    localStorage.setItem(STORAGE_LAST_CATEGORY, lastSelectedCategory);
  }
}

function incrementCopyCount() {
  copyCount++;
  saveStorage();
  if (currentCategory === 'about') {
    const counterEl = id('copyCountNumber');
    if (counterEl) counterEl.textContent = copyCount;
  }
}

/**
 * Event Listener Setup
 */
function setupEventListeners() {
  // Category Pill Navigation Horizontal Scroll on Mouse Wheel
  const navScroll = id('navScroll');
  if (navScroll) {
    navScroll.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        navScroll.scrollLeft += e.deltaY * 1.2;
      }
    }, { passive: false });

    // Category Pill Clicks
    navScroll.addEventListener('click', (e) => {
      const pill = e.target.closest('.nav-pill');
      if (!pill) return;
      const cat = pill.dataset.category;
      if (cat) switchCategory(cat, pill);
    });
  }

  // Font Recommendation Modal Events
  const btnFontInfo = id('btnFontInfo');
  const fontsModal = id('fontsModal');
  const btnCloseModal = id('btnCloseModal');
  const btnDismissModal = id('btnDismissModal');

  if (btnFontInfo && fontsModal) {
    btnFontInfo.addEventListener('click', () => {
      fontsModal.classList.remove('hidden');
    });
  }

  if (btnCloseModal && fontsModal) {
    btnCloseModal.addEventListener('click', () => {
      fontsModal.classList.add('hidden');
    });
  }

  if (btnDismissModal && fontsModal) {
    btnDismissModal.addEventListener('click', () => {
      fontsModal.classList.add('hidden');
    });
  }

  if (fontsModal) {
    fontsModal.addEventListener('click', (e) => {
      if (e.target === fontsModal) {
        fontsModal.classList.add('hidden');
      }
    });
  }

  // Search Input Filter
  const searchInput = id('searchInput');
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    if (term.length > 0) {
      performSearch(term);
    } else {
      renderCategory(currentCategory);
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const isSearchFocused = (document.activeElement === searchInput);

    if (((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'f' || e.key.toLowerCase() === 'k')) ||
        (e.key === '/' && !isSearchFocused)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === 'Escape') {
      if (fontsModal && !fontsModal.classList.contains('hidden')) {
        fontsModal.classList.add('hidden');
      } else if (isSearchFocused) {
        searchInput.value = '';
        renderCategory(currentCategory);
        searchInput.blur();
      }
    } else if (!isSearchFocused && activeGlyph && (e.key.toLowerCase() === 'f')) {
      e.preventDefault();
      toggleFavorite(activeGlyph);
    } else if (!isSearchFocused && activeGlyph && (e.key.toLowerCase() === 'c') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      copyToClipboard(activeGlyph.symbol, `${getMsg('copiedMsg', 'Copiado: ')}${activeGlyph.symbol}`);
      addToRecent(activeGlyph);
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      handleGridArrowNavigation(e);
    }
  });

/**
 * 2D Grid Keyboard Arrow Navigation Handler
 */
function handleGridArrowNavigation(e) {
  const grid = id('glyphGrid');
  if (!grid || grid.classList.contains('utility-hidden')) return;

  const cards = Array.from(grid.querySelectorAll('.glyph-card'));
  if (cards.length === 0) return;

  const searchInput = id('searchInput');
  const isSearchFocused = (document.activeElement === searchInput);

  if (isSearchFocused) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cards[0].focus();
    }
    return;
  }

  let currentIndex = cards.findIndex(c => c === document.activeElement);
  if (currentIndex === -1) {
    currentIndex = cards.findIndex(c => c.classList.contains('selected'));
  }
  if (currentIndex === -1) currentIndex = 0;

  const computedStyle = window.getComputedStyle(grid);
  const gridTemplate = computedStyle.getPropertyValue('grid-template-columns');
  let cols = 9;
  if (gridTemplate) {
    const colList = gridTemplate.split(/\s+/).filter(Boolean);
    if (colList.length > 0) cols = colList.length;
  }

  let newIndex = currentIndex;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    newIndex = Math.min(cards.length - 1, currentIndex + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    newIndex = Math.max(0, currentIndex - 1);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    newIndex = Math.min(cards.length - 1, currentIndex + cols);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (currentIndex - cols < 0 && searchInput) {
      searchInput.focus();
      searchInput.select();
      return;
    }
    newIndex = Math.max(0, currentIndex - cols);
  }

  const targetCard = cards[newIndex];
  if (targetCard) {
    targetCard.focus();
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

  // Inspector Action Buttons
  id('btnCopyChar').addEventListener('click', () => {
    if (activeGlyph) copyToClipboard(activeGlyph.symbol, `${getMsg('copiedMsg', 'Copiado: ')}${activeGlyph.symbol}`);
  });

  id('btnFav').addEventListener('click', () => {
    if (activeGlyph) toggleFavorite(activeGlyph);
  });

  // Inspector Clickable Code Badges
  const inspectCodepoint = id('inspectCodepoint');
  if (inspectCodepoint) {
    inspectCodepoint.addEventListener('click', () => {
      if (activeGlyph) copyToClipboard(`U+${activeGlyph.hex}`, `${getMsg('copiedMsg', 'Copiado: ')}U+${activeGlyph.hex}`);
    });
  }

  const btnCopyHexVal = id('btnCopyHexVal');
  if (btnCopyHexVal) {
    btnCopyHexVal.addEventListener('click', () => {
      if (activeGlyph) copyToClipboard(activeGlyph.hex, `${getMsg('copiedMsg', 'Copiado: ')}${activeGlyph.hex}`);
    });
  }

  const btnCopyDecVal = id('btnCopyDecVal');
  if (btnCopyDecVal) {
    btnCopyDecVal.addEventListener('click', () => {
      if (activeGlyph) copyToClipboard(activeGlyph.dec, `${getMsg('copiedMsg', 'Copiado: ')}${activeGlyph.dec}`);
    });
  }

  const btnCopyEntityVal = id('btnCopyEntityVal');
  if (btnCopyEntityVal) {
    btnCopyEntityVal.addEventListener('click', () => {
      if (activeGlyph) copyToClipboard(`&#${activeGlyph.dec};`, `${getMsg('copiedMsg', 'Copiado: ')}&#${activeGlyph.dec};`);
    });
  }

  const inspectKaomojiDisplay = id('inspectKaomojiDisplay');
  if (inspectKaomojiDisplay) {
    inspectKaomojiDisplay.addEventListener('click', () => {
      if (activeGlyph) copyToClipboard(activeGlyph.symbol, `${getMsg('copiedMsg', 'Copiado: ')}${activeGlyph.symbol}`);
    });
  }

  // Side Panel / Sidebar Pin Button
  const btnSidePanel = id('btnSidePanel');
  if (btnSidePanel) {
    btnSidePanel.addEventListener('click', () => {
      openSidePanel();
    });
  }
}

/**
 * Helper to open Side Panel / Sidebar
 */
function openSidePanel() {
  const c = typeof window !== 'undefined' ? window.chrome : null;
  const b = typeof window !== 'undefined' ? window.browser : null;

  // 1. Chrome SidePanel API
  if (c && c['sidePanel'] && typeof c['sidePanel']['open'] === 'function') {
    if (c.windows && typeof c.windows.getCurrent === 'function') {
      c.windows.getCurrent((win) => {
        if (win && win.id) {
          try {
            const res = c['sidePanel']['open']({ windowId: win.id }, () => {
              if (c.runtime && c.runtime.lastError) {
                console.error('Chrome sidepanel error:', c.runtime.lastError.message);
                showToast(getMsg('sidepanelOpenTip', 'Abra o Painel Lateral no menu de extensões'));
              } else {
                window.close();
              }
            });
            if (res && typeof res.then === 'function') {
              res.then(() => window.close()).catch(() => {});
            }
          } catch (err) {
            console.error('Chrome sidepanel exception:', err);
            showToast(getMsg('sidepanelOpenTip', 'Abra o Painel Lateral no menu de extensões'));
          }
        }
      });
      return;
    }
  }

  // 2. Firefox SidebarAction API
  if (b && b['sidebarAction'] && typeof b['sidebarAction']['open'] === 'function') {
    try {
      b['sidebarAction']['open']().then(() => {
        window.close();
      }).catch((err) => {
        console.error('Firefox sidebar error:', err);
        showToast(getMsg('sidepanelOpenTip', 'Abra o Painel Lateral no menu de extensões'));
      });
      return;
    } catch (err) {
      console.error('Firefox sidebar exception:', err);
    }
  }

  // 3. Fallback Toast
  showToast(getMsg('sidepanelOpenTip', 'Abra o Painel Lateral no menu de extensões'));
}

/**
 * Switch Category
 */
async function switchCategory(cat, pillElement) {
  currentCategory = cat;
  saveLastCategory(cat);

  document.querySelectorAll('.nav-pill').forEach(btn => btn.classList.remove('active'));
  if (pillElement) pillElement.classList.add('active');

  id('searchInput').value = '';

  if (cat === 'home') {
    renderHomeView();
  } else if (cat === 'favorites') {
    renderGlyphList(favoriteGlyphs, getMsg('emptyFavoritesMsg', 'Nenhum favorito salvo. Clique no ★ no painel inferior para salvar!'));
  } else if (cat === 'about') {
    renderAboutView();
  } else {
    await loadCategory(cat);
  }

  if (pillElement) {
    pillElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function renderCategory(cat) {
  const pill = document.querySelector(`.nav-pill[data-category="${cat}"]`);
  if (pill) switchCategory(cat, pill);
  else loadCategory(cat);
}

/**
 * Render ⚡ Início View
 */
function renderHomeView() {
  const grid = id('glyphGrid');
  const emptyState = id('emptyState');
  grid.innerHTML = '';
  grid.classList.remove('utility-hidden');
  emptyState.classList.add('hidden');

  const fragment = document.createDocumentFragment();

  // Section 1: Recentes
  const headerRecents = document.createElement('div');
  headerRecents.className = 'grid-section-header';
  const recentsTitle = getMsg('sectionRecents', 'Recentes');
  const spanRecents = document.createElement('span');
  spanRecents.textContent = `⏱ ${recentsTitle}`;
  headerRecents.appendChild(spanRecents);
  fragment.appendChild(headerRecents);

  if (recentGlyphs && recentGlyphs.length > 0) {
    recentGlyphs.forEach(g => {
      fragment.appendChild(createCardElement(g));
    });
  } else {
    const emptyNotice = document.createElement('div');
    emptyNotice.className = 'grid-section-header';
    emptyNotice.style.textTransform = 'none';
    emptyNotice.style.fontWeight = '400';
    emptyNotice.style.color = 'var(--text-muted)';
    emptyNotice.textContent = getMsg('emptyRecentsNotice', 'Os caracteres que você copiar aparecerão aqui!');
    fragment.appendChild(emptyNotice);
  }

  // Section 2: Populares & Essenciais
  const headerPopular = document.createElement('div');
  headerPopular.className = 'grid-section-header';
  headerPopular.style.marginTop = '12px';
  const popularTitle = getMsg('sectionPopular', 'Mais Populares');
  const spanPopular = document.createElement('span');
  spanPopular.textContent = `🔥 ${popularTitle}`;
  headerPopular.appendChild(spanPopular);
  fragment.appendChild(headerPopular);

  const popularList = (typeof POPULAR_GLYPHS !== 'undefined') ? POPULAR_GLYPHS : [];
  popularList.forEach(g => {
    fragment.appendChild(createCardElement(g));
  });

  grid.appendChild(fragment);

  const firstGlyph = (recentGlyphs && recentGlyphs.length > 0) ? recentGlyphs[0] : popularList[0];
  if (firstGlyph) selectGlyph(firstGlyph, grid.querySelector('.glyph-card'));
}

/**
 * Render ℹ️ Sobre View
 */
function renderAboutView() {
  const grid = id('glyphGrid');
  const emptyState = id('emptyState');
  grid.innerHTML = '';
  grid.classList.remove('utility-hidden');
  emptyState.classList.add('hidden');

  const container = document.createElement('div');
  container.className = 'about-container';

  // Obter versão dinâmica do manifest
  const manifestVersion = (typeof chrome !== 'undefined' && chrome.runtime?.getManifest?.()?.version)
    ? `v${chrome.runtime.getManifest().version}`
    : 'v4.3.0';

  const sinceTag = getMsg('aboutSinceTag', 'Desde 2010');
  const offlineTag = getMsg('aboutOfflineTag', '100% Offline');
  const desc = getMsg('aboutDesc', 'Repositório completo, rápido e prático de mais de 43.000 caracteres, símbolos e emojis Unicode com busca inteligente.');
  const tip = getMsg('aboutSidePanelTip', 'Dica: Clique no ícone de Painel Lateral no cabeçalho para manter esta extensão aberta ao lado enquanto você navega!');

  // 1. Hero Card
  const heroCard = document.createElement('div');
  heroCard.className = 'about-hero-card';

  const heroTop = document.createElement('div');
  heroTop.className = 'about-hero-top';

  const logoBadge = document.createElement('div');
  logoBadge.className = 'about-logo-badge';
  logoBadge.textContent = '⚡';

  const titleWrapper = document.createElement('div');
  const heroTitle = document.createElement('div');
  heroTitle.className = 'about-hero-title';

  const titleText = document.createElement('span');
  titleText.textContent = 'Unicode & UTF-8 Studio';

  const versionTag = document.createElement('span');
  versionTag.className = 'version-tag';
  versionTag.textContent = manifestVersion;

  const sinceBadge = document.createElement('span');
  sinceBadge.className = 'since-tag';
  sinceBadge.textContent = `🎉 ${sinceTag}`;

  const offlineBadge = document.createElement('span');
  offlineBadge.className = 'version-tag offline-tag';
  offlineBadge.textContent = `✨ ${offlineTag}`;

  heroTitle.append(titleText, versionTag, sinceBadge, offlineBadge);

  const heroDesc = document.createElement('div');
  heroDesc.className = 'about-hero-desc';
  heroDesc.textContent = desc;

  titleWrapper.append(heroTitle, heroDesc);
  heroTop.append(logoBadge, titleWrapper);
  heroCard.appendChild(heroTop);
  container.appendChild(heroCard);

  // 2. Personal Copy Counter Card (se copyCount > 0)
  if (copyCount > 0) {
    const counterCard = document.createElement('div');
    counterCard.className = 'copy-counter-card';

    const counterIcon = document.createElement('span');
    counterIcon.className = 'counter-icon';
    counterIcon.textContent = '📊';

    const textWrapper = document.createElement('div');
    textWrapper.className = 'counter-text-wrapper';

    const prefix = getMsg('aboutCopyCountPrefix', 'Você já copiou ');
    const suffix = getMsg('aboutCopyCountSuffix', ' caracteres usando a extensão!');

    const countSpan = document.createElement('span');
    countSpan.append(prefix);

    const countNum = document.createElement('strong');
    countNum.id = 'copyCountNumber';
    countNum.className = 'counter-count-number';
    countNum.textContent = String(copyCount);

    countSpan.append(countNum, suffix);
    textWrapper.appendChild(countSpan);
    counterCard.append(counterIcon, textWrapper);
    container.appendChild(counterCard);
  }

  // 3. Side Panel Tip Card (interativo)
  const tipCard = document.createElement('div');
  tipCard.className = 'sidepanel-tip-card';
  tipCard.title = getMsg('sidepanelOpenTip', 'Clique para abrir o Painel Lateral');

  const tipIcon = document.createElement('span');
  tipIcon.className = 'tip-card-icon';
  tipIcon.textContent = '💡';

  const tipText = document.createElement('div');
  tipText.textContent = tip;

  tipCard.append(tipIcon, tipText);
  tipCard.addEventListener('click', () => {
    openSidePanel();
  });
  container.appendChild(tipCard);

  // 4. Official Links Card (Grid 2x2 com os links Web, Chrome, Firefox, GitHub)
  const linksCard = document.createElement('div');
  linksCard.className = 'about-links-card';

  const linksTitle = document.createElement('h4');
  linksTitle.className = 'about-card-title';
  linksTitle.textContent = `🔗 ${getMsg('aboutLinksTitle', 'Links Oficiais')}`;
  linksCard.appendChild(linksTitle);

  const linksGrid = document.createElement('div');
  linksGrid.className = 'about-links-grid';

  const linksData = [
    {
      href: 'https://codexico.com.br/unicode/',
      label: getMsg('aboutWebVersionBtn', 'Versão Web Online'),
      icon: '🌐',
      isPrimary: true
    },
    {
      href: 'https://chromewebstore.google.com/detail/unicode-utf-8-character-s/fcemphgmjnjpmmdhcedhjiegickfbiia',
      label: getMsg('aboutChromeStoreBtn', 'Chrome Web Store'),
      icon: '🛒',
      isPrimary: false
    },
    {
      href: 'https://addons.mozilla.org/pt-BR/firefox/addon/unicode-utf-8-character-studio/',
      label: getMsg('aboutFirefoxAddonBtn', 'Firefox Add-ons'),
      icon: '🦊',
      isPrimary: false
    },
    {
      href: 'https://github.com/codexico/UTF-Browser-Extensions',
      label: getMsg('aboutGithubBtn', 'Repositório GitHub'),
      icon: '💻',
      isPrimary: false
    }
  ];

  linksData.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = `about-link-btn ${item.isPrimary ? 'btn-primary-accent' : ''}`;
    a.textContent = `${item.icon} ${item.label}`;
    linksGrid.appendChild(a);
  });

  linksCard.appendChild(linksGrid);
  container.appendChild(linksCard);

  // 5. Shortcuts Summary Card
  const shortcutsCard = document.createElement('div');
  shortcutsCard.className = 'about-shortcuts-card';

  const shortcutsTitle = document.createElement('h4');
  shortcutsTitle.className = 'about-card-title';
  shortcutsTitle.textContent = `⌨️ ${getMsg('aboutShortcutsTitle', 'Atalhos de Teclado')}`;
  shortcutsCard.appendChild(shortcutsTitle);

  const shortcutsList = document.createElement('div');
  shortcutsList.className = 'shortcuts-list';

  const shortcutsData = [
    { kbd: 'Ctrl+K /', desc: getMsg('shortcutSearchDesc', 'Focar na barra de busca') },
    { kbd: 'Enter / C', desc: getMsg('shortcutCopyDesc', 'Copiar caractere focado') },
    { kbd: '↑ ↓ ← →', desc: getMsg('shortcutNavDesc', 'Navegação 2D na grade') },
    { kbd: 'F', desc: getMsg('shortcutFontsDesc', 'Guia de Fontes') },
    { kbd: 'Esc', desc: getMsg('shortcutEscDesc', 'Limpar busca / fechar modal') }
  ];

  shortcutsData.forEach(s => {
    const row = document.createElement('div');
    row.className = 'shortcut-row';

    const descEl = document.createElement('span');
    descEl.textContent = s.desc;

    const kbdEl = document.createElement('kbd');
    kbdEl.textContent = s.kbd;

    row.append(descEl, kbdEl);
    shortcutsList.appendChild(row);
  });

  shortcutsCard.appendChild(shortcutsList);
  container.appendChild(shortcutsCard);

  // 6. Recommended Fonts Card
  const fontsCard = document.createElement('div');
  fontsCard.className = 'about-fonts-card';

  const fontsTitle = document.createElement('h4');
  fontsTitle.textContent = `🔤 ${getMsg('modalTitle', 'Fontes Recomendadas')}`;

  const fontsSubtitle = document.createElement('p');
  fontsSubtitle.style.fontSize = '11px';
  fontsSubtitle.style.color = 'var(--text-muted)';
  fontsSubtitle.style.marginBottom = '6px';
  fontsSubtitle.textContent = getMsg('modalSubtitle', 'Alguns caracteres Unicode raros (como CJK, Tibetano, Rúnico ou Braille) exigem fontes específicas para renderizar corretamente no seu sistema operacional.');

  const fontList = document.createElement('ul');
  fontList.className = 'font-list';
  fontList.style.margin = '4px 0';

  const fonts = [
    { href: 'https://fonts.google.com/noto', label: getMsg('modalFontGoogleNoto', 'Google Noto Fonts (Cobertura Universal)') },
    { href: 'https://www.babelstone.co.uk/Fonts/', label: getMsg('modalFontBabelStone', 'BabelStone Fonts (Símbolos & Escritas Raras)') },
    { href: 'http://www.quivira-font.com/', label: getMsg('modalFontQuivira', 'Quivira (Fonte Unicode Abrangente)') }
  ];

  fonts.forEach(f => {
    const li = document.createElement('li');
    li.className = 'font-item';
    const a = document.createElement('a');
    a.href = f.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = f.label;
    li.appendChild(a);
    fontList.appendChild(li);
  });

  fontsCard.append(fontsTitle, fontsSubtitle, fontList);
  container.appendChild(fontsCard);

  grid.appendChild(container);
}

/**
 * Helper to create a card element
 */
function createCardElement(g) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'glyph-card';
  card.dataset.hex = g.hex;

  const isKaomoji = (g.section === 'kaomoji' || g.section === 'text_emoticons' || currentCategory === 'kaomoji' || currentCategory === 'text_emoticons' || (g.name && (g.name.startsWith('KAOMOJI:') || g.name.startsWith('TEXT_EMOTICON:'))) || (g.symbol && g.symbol.length > 2));
  if (isKaomoji) {
    card.classList.add('is-kaomoji-card');
    if (g.symbol && g.symbol.length > 10) {
      card.classList.add('is-long-kaomoji');
    }
  }

  const labelText = isKaomoji ? (g.name || g.symbol) : `${g.name} (U+${g.hex})`;
  card.setAttribute('aria-label', isKaomoji ? g.symbol : `${g.name}, U+${g.hex}, ${g.symbol}`);
  card.title = labelText;

  const spanSym = document.createElement('span');
  spanSym.className = 'glyph-symbol';
  spanSym.textContent = g.symbol;

  card.appendChild(spanSym);

  if (!isKaomoji) {
    const spanCode = document.createElement('span');
    spanCode.className = 'glyph-code';
    spanCode.textContent = `U+${g.hex}`;
    card.appendChild(spanCode);
  }

  card.addEventListener('click', () => {
    selectGlyph(g, card);
    copyToClipboard(g.symbol, `${getMsg('copiedMsg', 'Copiado: ')}${g.symbol}`);
    addToRecent(g);
  });

  card.addEventListener('focus', () => {
    selectGlyph(g, card);
  });

  return card;
}

/**
 * Fetch and Parse Category JSON dataset
 */
async function fetchAndParseCategory(group) {
  if (categoryCache[group]) return categoryCache[group];

  const res = await fetch(`/data/${group}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading dataset for ${group}`);
  const jsonData = await res.json();
  const glyphs = parseGroupJSON(jsonData, group);
  categoryCache[group] = glyphs;
  return glyphs;
}

/**
 * Fetch and Parse Category JSON and render
 */
async function loadCategory(group) {
  if (categoryCache[group]) {
    renderGlyphList(categoryCache[group]);
    return;
  }

  try {
    const parsedGlyphs = await fetchAndParseCategory(group);
    renderGlyphList(parsedGlyphs);
  } catch (err) {
    console.error('Error loading category:', err);
    renderGlyphList([], `Erro ao carregar o grupo "${group}"`);
  }
}

/**
 * Parse Group JSON content (supports structured items for emoticons/kaomoji and chars strings for unicode glyphs)
 */
function parseGroupJSON(jsonData, groupName) {
  const glyphs = [];
  const prefix = groupName === 'text_emoticons' ? 'TEXT_EMOTICON' : 'KAOMOJI';

  jsonData.forEach(sec => {
    const sectionName = (sec.sectionKey ? getMsg(sec.sectionKey, sec.section) : sec.section) || groupName;

    // Structured items (text_emoticons and kaomoji)
    if (sec.items && Array.isArray(sec.items)) {
      sec.items.forEach(item => {
        const symbol = item.symbol;
        if (!symbol) return;
        const firstCp = symbol.codePointAt(0) || 0;
        const hex = firstCp.toString(16).toUpperCase().padStart(4, '0');
        const translatedName = item.key ? getMsg(item.key, item.name) : item.name;
        const displayName = translatedName || sectionName;
        glyphs.push({
          symbol: symbol,
          hex: hex,
          dec: firstCp.toString(),
          section: sectionName,
          name: `${prefix}: ${displayName}`,
          isKaomoji: true
        });
      });
      return;
    }

    // Direct Unicode characters string
    if (sec.chars) {
      const chars = Array.from(sec.chars);
      chars.forEach(ch => {
        if (!ch) return;
        const codePoint = ch.codePointAt(0);
        const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');
        const name = getUnicodeName(ch, hex, sectionName);

        glyphs.push({
          symbol: ch,
          hex: hex,
          dec: codePoint.toString(),
          section: sectionName,
          name: name
        });
      });
    }
  });

  return glyphs;
}

/**
 * Try parsing search term as Hex, Dec, or HTML Entity
 */
function tryParseCodepointOrEntity(term) {
  let cleaned = term.trim();
  if (!cleaned) return [];

  const matches = [];
  const seenHex = new Set();

  function addMatch(hexVal, decVal, sectionLabel) {
    if (decVal !== null && !isNaN(decVal) && decVal >= 0 && decVal <= 0x10FFFF) {
      const hexPadded = hexVal.toUpperCase().padStart(4, '0');
      if (!seenHex.has(hexPadded)) {
        seenHex.add(hexPadded);
        try {
          const sym = String.fromCodePoint(decVal);
          const name = getUnicodeName(sym, hexPadded, sectionLabel);
          matches.push({
            symbol: sym,
            hex: hexPadded,
            dec: decVal.toString(),
            section: sectionLabel,
            name: name
          });
        } catch (e) {}
      }
    }
  }

  const lowerClean = cleaned.toLowerCase();
  const HTML_ENTITIES = {
    '&copy;': '00A9', '&reg;': '00AE', '&trade;': '2122', '&euro;': '20AC', '&pound;': '00A3',
    '&yen;': '00A5', '&cent;': '00A2', '&deg;': '00B0', '&micro;': '00B5', '&para;': '00B6',
    '&sect;': '00A7', '&plusmn;': '00B1', '&times;': '00D7', '&divide;': '00F7', '&ne;': '2260',
    '&le;': '2264', '&ge;': '2265', '&infin;': '221E', '&radic;': '221A', '&sum;': '2211',
    '&prod;': '220F', '&int;': '222B', '&approx;': '2248', '&equiv;': '2261', '&alpha;': '03B1',
    '&beta;': '03B2', '&gamma;': '03B3', '&delta;': '03B4', '&theta;': '03B8', '&lambda;': '03BB',
    '&pi;': '03C0', '&sigma;': '03C3', '&omega;': '03C9', '&check;': '2713', '&cross;': '2717',
    '&star;': '2605', '&spades;': '2660', '&clubs;': '2663', '&hearts;': '2665', '&diams;': '2666',
    '&larr;': '2190', '&uarr;': '2191', '&rarr;': '2192', '&darr;': '2193', '&harr;': '2194',
    '&lt;': '003C', '&gt;': '003E', '&amp;': '0026'
  };

  const entityKey = lowerClean.startsWith('&') ? (lowerClean.endsWith(';') ? lowerClean : `${lowerClean};`) : `&${lowerClean};`;
  if (HTML_ENTITIES[entityKey]) {
    const hex = HTML_ENTITIES[entityKey];
    addMatch(hex, parseInt(hex, 16), 'HTML Entity');
  }

  let str = cleaned.replace(/;$/, '');

  if (/^(?:&#x|0x|u\+|#|\\u)/i.test(str)) {
    const m = str.match(/^(?:&#x|0x|u\+|#|\\u)?([0-9a-f]{2,6})$/i);
    if (m) {
      const hex = m[1];
      addMatch(hex, parseInt(hex, 16), 'Hex');
    }
  }

  if (/^&#\d+$/i.test(str)) {
    const m = str.match(/^&#(\d+)$/);
    if (m) {
      const dec = parseInt(m[1], 10);
      addMatch(dec.toString(16), dec, 'Dec Entity');
    }
  }

  if (/^[0-9a-f]{4,6}$/i.test(str)) {
    const dec = parseInt(str, 16);
    addMatch(str, dec, 'Hex');
  }

  if (/^\d{1,7}$/.test(str)) {
    const dec = parseInt(str, 10);
    addMatch(dec.toString(16), dec, 'Dec');
  }

  return matches;
}

/**
 * Perform Fuzzy Token-Based Search with Synonym Expansion & Relevance Sorting
 */
async function performSearch(term) {
  let searchPool = [];

  Object.values(categoryCache).forEach(arr => {
    searchPool = searchPool.concat(arr);
  });

  const allGroups = [
    'emoticons', 'text_emoticons', 'kaomoji', 'miscellaneous_symbols_and_pictographs', 'transport_and_map_symbols', 'miscellaneous_symbols',
    'dingbats', 'currency_symbols', 'mathematical_operators', 'arrows', 'miscellaneous_technical', 'enclosed_alphanumerics',
    'box_drawing', 'block_elements', 'geometric_shapes', 'general_punctuation', 'superscripts_and_subscripts',
    'letterlike_symbols', 'number_forms', 'games', 'latin', 'greek', 'hebrew', 'arabic', 'devanagari', 'thai',
    'tibetan', 'runic', 'ethiopic', 'cherokee', 'khmer', 'mongolian', 'hiragana', 'katakana', 'braile', 'cjk', 'yi'
  ];

  for (const group of allGroups) {
    if (!categoryCache[group]) {
      try {
        const glyphs = await fetchAndParseCategory(group);
        searchPool = searchPool.concat(glyphs);
      } catch (e) {}
    }
  }

  const seen = new Set();
  const uniquePool = searchPool.filter(g => {
    const key = (g.isKaomoji || g.section === 'kaomoji' || (g.symbol && g.symbol.length > 2)) ? g.symbol : g.hex;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const cleanTerm = term.toLowerCase().trim();
  const tokens = cleanTerm.split(/\s+/).filter(Boolean);
  const synonymsDict = (typeof SYNONYMS !== 'undefined') ? SYNONYMS : {};

  const directMatches = tryParseCodepointOrEntity(term);
  const directHexes = new Set(directMatches.map(m => m.hex));

  const results = uniquePool.filter(g => {
    const textToSearch = `${g.symbol} u+${g.hex} 0x${g.hex} #${g.hex} ${g.hex} ${g.dec} &#${g.dec}; &#x${g.hex}; ${g.section} ${g.name || ''}`.toLowerCase();
    
    return tokens.every(token => {
      const cleanToken = token.replace(/^(?:u\+|0x|#|&#x|&#)/i, '').replace(/;$/, '');
      if (textToSearch.includes(token) || (cleanToken && textToSearch.includes(cleanToken))) return true;
      if (synonymsDict[token]) {
        return synonymsDict[token].some(syn => textToSearch.includes(syn));
      }
      for (const [key, list] of Object.entries(synonymsDict)) {
        if (list.includes(token)) {
          if (textToSearch.includes(key) || list.some(syn => textToSearch.includes(syn))) return true;
        }
      }
      return false;
    });
  });

  if (directMatches.length > 0) {
    directMatches.reverse().forEach(m => {
      const existingIdx = results.findIndex(g => g.hex === m.hex);
      if (existingIdx !== -1) {
        results.splice(existingIdx, 1);
      }
      results.unshift(m);
    });
  }

  results.sort((a, b) => {
    if (directHexes.has(a.hex) && !directHexes.has(b.hex)) return -1;
    if (directHexes.has(b.hex) && !directHexes.has(a.hex)) return 1;

    if (a.symbol === cleanTerm) return -1;
    if (b.symbol === cleanTerm) return 1;

    const hexTerm = cleanTerm.replace(/^(?:u\+|0x|#|&#x|&#)/i, '').replace(/;$/, '').toUpperCase();
    if (a.hex === hexTerm) return -1;
    if (b.hex === hexTerm) return 1;

    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    if (aName.startsWith(cleanTerm) && !bName.startsWith(cleanTerm)) return -1;
    if (bName.startsWith(cleanTerm) && !aName.startsWith(cleanTerm)) return 1;

    return 0;
  });

  renderGlyphList(results, 'Nenhum resultado encontrado para a busca');
}

/**
 * Render Glyph Cards as Keyboard-Accessible Buttons
 */
function renderGlyphList(glyphs, emptyMsg = 'Nenhum caractere nesta categoria') {
  const grid = id('glyphGrid');
  const emptyState = id('emptyState');
  grid.innerHTML = '';

  if (currentCategory === 'kaomoji' || currentCategory === 'text_emoticons') {
    grid.classList.add('kaomoji-grid');
  } else {
    grid.classList.remove('kaomoji-grid');
  }

  if (!glyphs || glyphs.length === 0) {
    grid.classList.add('utility-hidden');
    emptyState.classList.remove('hidden');
    emptyState.querySelector('.empty-sub').textContent = emptyMsg;
    return;
  }

  grid.classList.remove('utility-hidden');
  emptyState.classList.add('hidden');

  const fragment = document.createDocumentFragment();

  glyphs.forEach((g, index) => {
    const card = createCardElement(g);
    fragment.appendChild(card);
    if (index === 0) selectGlyph(g, card);
  });

  grid.appendChild(fragment);
}

/**
 * Select Active Glyph Card
 */
function selectGlyph(glyph, cardElement) {
  activeGlyph = glyph;
  document.querySelectorAll('.glyph-card').forEach(c => c.classList.remove('selected'));
  if (cardElement) cardElement.classList.add('selected');
  updateInspector(glyph);
}

/**
 * Update Inspector Footer Info
 */
function updateInspector(glyph) {
  if (!glyph) return;
  const isKaomoji = (glyph.section === 'kaomoji' || glyph.section === 'text_emoticons' || currentCategory === 'kaomoji' || currentCategory === 'text_emoticons' || (glyph.name && (glyph.name.startsWith('KAOMOJI:') || glyph.name.startsWith('TEXT_EMOTICON:'))) || (glyph.symbol && glyph.symbol.length > 2));

  const inspectGlyphEl = id('inspectGlyph');
  const inspectKaomojiDisplay = id('inspectKaomojiDisplay');
  const subgroupEl = id('inspectSubgroup');
  const inspectorEl = document.querySelector('.inspector');

  inspectGlyphEl.textContent = glyph.symbol;

  if (isKaomoji) {
    inspectGlyphEl.classList.add('is-kaomoji-inspect');

    if (subgroupEl) {
      const isCustomName = glyph.name && (glyph.name.startsWith('KAOMOJI: ') || glyph.name.startsWith('TEXT_EMOTICON: ')) && glyph.name !== `KAOMOJI: ${glyph.symbol}` && glyph.name !== `TEXT_EMOTICON: ${glyph.symbol}`;
      const prefix = glyph.section === 'text_emoticons' || (glyph.name && glyph.name.startsWith('TEXT_EMOTICON')) ? 'Emoticon' : 'Kaomoji';
      const nameText = isCustomName ? glyph.name.replace(/^(KAOMOJI|TEXT_EMOTICON): /, '') : (glyph.section && glyph.section !== 'kaomoji' && glyph.section !== 'text_emoticons' ? glyph.section : 'Expressões');
      subgroupEl.textContent = `${prefix} • ${nameText}`;
      subgroupEl.title = glyph.symbol;
    }

    if (inspectKaomojiDisplay) {
      inspectKaomojiDisplay.classList.remove('hidden');
      inspectKaomojiDisplay.textContent = glyph.symbol;
      inspectKaomojiDisplay.title = glyph.symbol;
    }

    if (inspectorEl) inspectorEl.classList.add('is-kaomoji-mode');
  } else {
    inspectGlyphEl.classList.remove('is-kaomoji-inspect');

    const fullName = glyph.name || `${glyph.section} Character`;
    if (subgroupEl) {
      subgroupEl.textContent = fullName;
      subgroupEl.title = `${fullName} (U+${glyph.hex})`;
    }

    if (inspectKaomojiDisplay) {
      inspectKaomojiDisplay.classList.add('hidden');
      inspectKaomojiDisplay.textContent = '';
    }

    if (inspectorEl) inspectorEl.classList.remove('is-kaomoji-mode');
  }

  const cpEl = id('inspectCodepoint');
  if (cpEl) cpEl.textContent = `U+${glyph.hex}`;
  const hexEl = id('inspectHex');
  if (hexEl) hexEl.textContent = glyph.hex;
  const decEl = id('inspectDec');
  if (decEl) decEl.textContent = glyph.dec;
  const entEl = id('inspectEntity');
  if (entEl) entEl.textContent = `&#${glyph.dec};`;

  const isFav = favoriteGlyphs.some(f => f.symbol === glyph.symbol || (f.hex === glyph.hex && !isKaomoji));
  const btnFav = id('btnFav');
  if (isFav) {
    btnFav.classList.add('is-fav');
  } else {
    btnFav.classList.remove('is-fav');
  }
}

/**
 * Toggle Favorite Glyph
 */
async function toggleFavorite(glyph) {
  const index = favoriteGlyphs.findIndex(f => f.hex === glyph.hex);
  if (index >= 0) {
    favoriteGlyphs.splice(index, 1);
    showToast(`${getMsg('removedFavMsg', 'Removido dos favoritos: ')}${glyph.symbol}`);
  } else {
    favoriteGlyphs.unshift(glyph);
    showToast(`${getMsg('addedFavMsg', 'Adicionado aos favoritos! ')}${glyph.symbol}`);
  }
  await saveStorage();
  updateInspector(glyph);

  if (currentCategory === 'favorites') {
    renderGlyphList(favoriteGlyphs, getMsg('emptyFavoritesMsg', 'Nenhum favorito salvo. Clique no ★ no painel inferior para salvar!'));
  }
}

/**
 * Add Glyph to Recent history
 */
async function addToRecent(glyph) {
  const existingIdx = recentGlyphs.findIndex(r => r.hex === glyph.hex);
  if (existingIdx >= 0) {
    recentGlyphs.splice(existingIdx, 1);
  }
  recentGlyphs.unshift(glyph);
  if (recentGlyphs.length > 50) recentGlyphs.pop();
  await saveStorage();

  if (currentCategory === 'home') {
    renderHomeView();
  }
}

/**
 * Clipboard Copy Helper with Feedback
 */
function copyToClipboard(text, message) {
  incrementCopyCount();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => fallbackCopy(text, message));
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast(message);
}

/**
 * Toast Notification Popup
 */
function showToast(message) {
  const toast = id('toast');
  const toastMsg = id('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  toast.classList.remove('hidden');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 1800);
}

// Utility Helper
function id(elementId) {
  return document.getElementById(elementId);
}
