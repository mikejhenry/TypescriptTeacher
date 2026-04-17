document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.lesson-section');
    const contentArea = document.querySelector('.content-area');

    /**
     * 1. Persistence & Initial Load
     */
    function loadState() {
        const lastSection = localStorage.getItem('lastActiveSection');
        const scrollPos = localStorage.getItem('lastScrollPos');
        const currentPath = window.location.pathname.split('/').pop();

        if (lastSection && window.location.hash === '') {
            const target = document.getElementById(lastSection);
            if (target) {
                target.scrollIntoView();
            }
        }
    }

    /**
     * 2. Advanced Scrollspy (IntersectionObserver)
     */
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update Sidebar
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });

                // Persist State
                localStorage.setItem('lastActiveSection', id);
                
                // Update URL without jump
                history.replaceState(null, null, `#${id}`);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    /**
     * 3. Reading Progress Indicator
     */
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-container';
    progressBar.innerHTML = '<div class="progress-bar" id="reading-progress"></div>';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('reading-progress').style.width = scrolled + "%";
        
        // Persist scroll position periodically
        localStorage.setItem('lastScrollPos', winScroll);
    });

    /**
     * 4. Global In-Module Search
     */
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            const results = [];
            sections.forEach(section => {
                const title = section.querySelector('h2').innerText;
                const text = section.innerText.toLowerCase();
                
                if (title.toLowerCase().includes(query) || text.includes(query)) {
                    const snippet = text.substring(text.indexOf(query), text.indexOf(query) + 100);
                    results.push({
                        id: section.id,
                        title: title,
                        snippet: `...${snippet}...`
                    });
                }
            });

            renderSearchResults(results);
        });
    }

    function renderSearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No matches found in this module.</div>';
        } else {
            searchResults.innerHTML = results.map(res => `
                <a href="#${res.id}" class="search-result-item">
                    <span class="result-title">${res.title}</span>
                    <span class="result-snippet">${res.snippet}</span>
                </a>
            `).join('');
        }
        searchResults.style.display = 'block';
    }

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (searchResults && !searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });

    /**
     * 5. Scholarly Glossary Tooltips
     */
    const glossary = {
        'idempotency': 'An operation is idempotent if it has no additional effect if it is called more than once with the same input parameters.',
        'reconciliation': 'The process through which React updates the DOM by comparing a new Virtual DOM tree with the previous one.',
        'statelessness': 'The property of a service where it does not store any client context between requests.',
        'acid': 'Atomicity, Consistency, Isolation, Durability - a set of properties that guarantee database transactions are processed reliably.'
    };

    function initGlossary() {
        const content = document.querySelector('.content-area');
        if (!content) return;

        // Simple text replacement for demo; in production, this would be a more surgical regex
        Object.keys(glossary).forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            // This is a naive implementation; for scholarly rigor, we avoid re-tagging existing tags
        });
    }

    /**
     * Top Nav Logic
     */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const topNavLinks = document.querySelectorAll('.top-nav a');
    topNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    loadState();
});