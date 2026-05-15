// ============================================
// SKILLCLAUDE.ID — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- SIDEBAR TOGGLE (mobile) ---
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const sidebarToggle = document.getElementById('sidebarToggle');

  const toggleSidebar = () => sidebar?.classList.toggle('open');

  menuBtn?.addEventListener('click', toggleSidebar);
  sidebarToggle?.addEventListener('click', toggleSidebar);

  // Close sidebar on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (
      sidebar?.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== menuBtn
    ) {
      sidebar.classList.remove('open');
    }
  });

  // --- SKILL FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- ACTIVE NAV ITEM ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href') === currentPath.split('/').pop()) {
      item.classList.add('active');
    }
  });

  // --- COPY SKILL.MD BUTTON ---
  document.querySelectorAll('.copy-skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const code = document.getElementById(target)?.textContent;
      if (!code) return;

      navigator.clipboard.writeText(code).then(() => {
        const original = btn.textContent;
        btn.textContent = '✓ Tersalin!';
        btn.style.background = '#1DB954';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
        }, 2000);
      });
    });
  });

});
