(() => {
  const DATA_URL = 'data/tools.json';
  const grid = document.querySelector('#tool-grid');
  const searchInput = document.querySelector('#search-input');
  const categoryFilters = document.querySelector('#category-filters');
  const sortSelect = document.querySelector('#sort-select');
  const resultsCount = document.querySelector('#results-count');
  const toolCount = document.querySelector('#tool-count');
  const emptyState = document.querySelector('#empty-state');
  const resetFilters = document.querySelector('#reset-filters');

  let tools = [];
  let activeCategory = 'all';
  let searchTerm = '';
  let sortMode = 'name';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function matchesCategory(tool) {
    return activeCategory === 'all' || tool.categories.includes(activeCategory);
  }

  function matchesSearch(tool) {
    if (!searchTerm) return true;
    const haystack = [tool.name, tool.maker, tool.description, ...(tool.categoryLabels || [])].join(' ').toLocaleLowerCase('pl');
    return haystack.includes(searchTerm);
  }

  function getVisibleTools() {
    const visible = tools.filter((tool) => matchesCategory(tool) && matchesSearch(tool));
    return visible.sort((a, b) => {
      if (sortMode === 'type') return a.accessLabel.localeCompare(b.accessLabel, 'pl') || a.name.localeCompare(b.name, 'pl');
      return a.name.localeCompare(b.name, 'pl');
    });
  }

  function cardTemplate(tool) {
    const accessClass = tool.access === 'local' ? 'local' : tool.access === 'experiment' ? 'experiment' : '';
    const tags = (tool.categoryLabels || []).map((label) => `<span class="mini-tag">${escapeHtml(label)}</span>`).join('');
    return `
      <article class="tool-card">
        <div class="card-top">
          <div class="tool-identity">
            <div class="tool-logo" data-hue="${escapeHtml(tool.hue || '')}" aria-hidden="true">${escapeHtml(tool.monogram || tool.name.slice(0, 1))}</div>
            <div><h3>${escapeHtml(tool.name)}</h3><div class="tool-company">${escapeHtml(tool.maker)}</div></div>
          </div>
          <span class="access-tag ${accessClass}">${escapeHtml(tool.accessLabel)}</span>
        </div>
        <p class="tool-description">${escapeHtml(tool.description)}</p>
        <div class="tag-row">${tags}</div>
        <div class="card-bottom">
          <div class="limit-note"><span class="note-icon" aria-hidden="true">!</span><span>${escapeHtml(tool.limitNote)}</span></div>
          <a class="visit-link" href="${escapeHtml(tool.officialUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Otwórz oficjalną stronę ${escapeHtml(tool.name)}">Otwórz <span aria-hidden="true">↗</span></a>
        </div>
      </article>`;
  }

  function render() {
    const visible = getVisibleTools();
    grid.innerHTML = visible.map(cardTemplate).join('');
    grid.setAttribute('aria-busy', 'false');
    emptyState.hidden = visible.length !== 0;
    resultsCount.textContent = `Wyświetlono ${visible.length} z ${tools.length} narzędzi`;
    toolCount.textContent = String(tools.length).padStart(2, '0');
  }

  function resetAllFilters() {
    activeCategory = 'all';
    searchTerm = '';
    sortMode = 'name';
    searchInput.value = '';
    sortSelect.value = 'name';
    categoryFilters.querySelectorAll('[data-category]').forEach((button) => {
      const active = button.dataset.category === 'all';
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  }

  categoryFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    activeCategory = button.dataset.category;
    categoryFilters.querySelectorAll('[data-category]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLocaleLowerCase('pl');
    render();
  });

  sortSelect.addEventListener('change', () => {
    sortMode = sortSelect.value;
    render();
  });

  resetFilters.addEventListener('click', resetAllFilters);

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === 'Escape' && target === searchInput) {
      searchInput.value = '';
      searchTerm = '';
      render();
      searchInput.blur();
    }
  });

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`Nie udało się wczytać katalogu (${response.status}).`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error('Plik z danymi ma nieprawidłowy format.');
      tools = data;
      render();
    })
    .catch((error) => {
      grid.setAttribute('aria-busy', 'false');
      grid.innerHTML = `<div class="loading-card">Nie udało się wczytać katalogu. Uruchom stronę przez lokalny serwer (instrukcja w README.md).<br><small>${escapeHtml(error.message)}</small></div>`;
      resultsCount.textContent = 'Błąd wczytywania';
      toolCount.textContent = '—';
    });
})();
