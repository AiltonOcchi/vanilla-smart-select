/**
 * Vanilla Smart Select Documentation
 * JavaScript functionality for docs site
 */

(function() {
  'use strict';

  // Mobile menu toggle
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.docs-sidebar');
    const main = document.querySelector('.docs-main');

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar when clicking outside on mobile
    main?.addEventListener('click', function() {
      if (sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // Active navigation link
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed header
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Copy code to clipboard
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code to clipboard');

      pre.style.position = 'relative';
      button.style.position = 'absolute';
      button.style.top = '8px';
      button.style.right = '8px';
      button.style.padding = '4px 12px';
      button.style.fontSize = '0.75rem';
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      button.style.color = 'white';
      button.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.transition = 'all 150ms';

      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });

      button.addEventListener('click', async () => {
        const code = codeBlock.textContent;

        try {
          await navigator.clipboard.writeText(code);
          button.textContent = 'Copied!';
          button.style.backgroundColor = '#10b981';
          button.style.borderColor = '#10b981';

          setTimeout(() => {
            button.textContent = 'Copy';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
          button.textContent = 'Failed';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        }
      });

      pre.appendChild(button);
    });
  }

  // Table of contents for current page
  function initTableOfContents() {
    const toc = document.querySelector('.page-toc');
    if (!toc) return;

    const headings = document.querySelectorAll('.docs-content h2, .docs-content h3');
    if (headings.length === 0) return;

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const li = document.createElement('li');
      li.className = heading.tagName === 'H2' ? 'toc-item' : 'toc-item toc-item-sub';

      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.className = 'toc-link';

      li.appendChild(a);
      tocList.appendChild(li);
    });

    toc.appendChild(tocList);
  }

  // Highlight current section in TOC while scrolling
  function initTOCHighlight() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              tocLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll('.docs-content h2, .docs-content h3').forEach(heading => {
      observer.observe(heading);
    });
  }

  // Add scroll-to-top button
  function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.display = 'none';
    scrollBtn.style.position = 'fixed';
    scrollBtn.style.bottom = '2rem';
    scrollBtn.style.right = '2rem';
    scrollBtn.style.width = '48px';
    scrollBtn.style.height = '48px';
    scrollBtn.style.borderRadius = '50%';
    scrollBtn.style.backgroundColor = '#2563eb';
    scrollBtn.style.color = 'white';
    scrollBtn.style.border = 'none';
    scrollBtn.style.fontSize = '1.5rem';
    scrollBtn.style.cursor = 'pointer';
    scrollBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    scrollBtn.style.transition = 'all 200ms';
    scrollBtn.style.zIndex = '1000';

    scrollBtn.addEventListener('mouseenter', () => {
      scrollBtn.style.backgroundColor = '#1e40af';
      scrollBtn.style.transform = 'translateY(-2px)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
      scrollBtn.style.backgroundColor = '#2563eb';
      scrollBtn.style.transform = 'translateY(0)';
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.style.display = 'block';
      } else {
        scrollBtn.style.display = 'none';
      }
    });
  }

  // External links open in new tab
  function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // Search functionality (basic client-side search)
  function initSearch() {
    const searchInput = document.querySelector('.docs-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const content = document.querySelector('.docs-content');

      if (!query) {
        // Clear highlighting
        content.innerHTML = content.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/gi, '$1');
        return;
      }

      // Simple highlighting (this is basic, you might want a more sophisticated solution)
      // For production, consider using a library like mark.js
    });
  }

  // Initialize all functionality when DOM is ready
  function init() {
    initMobileMenu();
    setActiveNavLink();
    initSmoothScroll();
    initCodeCopy();
    initTableOfContents();
    initTOCHighlight();
    initScrollToTop();
    initExternalLinks();
    initSearch();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
