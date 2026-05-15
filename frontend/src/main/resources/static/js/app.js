// ===== SIDEBAR TOGGLE MÓVIL =====
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('show');
});

document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  if (sidebar?.classList.contains('show') &&
      !sidebar.contains(e.target) &&
      !toggle?.contains(e.target)) {
    sidebar.classList.remove('show');
  }
});

// ===== ALERTAS: auto-dismiss 5 segundos =====
setTimeout(() => {
  document.querySelectorAll('.alert').forEach(a => {
    try { new bootstrap.Alert(a).close(); } catch (_) {}
  });
}, 5000);

// ===== CONFIRMACIÓN ELIMINAR =====
// Uso: <button data-confirm="¿Seguro?" data-form="form-id">
document.querySelectorAll('[data-confirm]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm(btn.dataset.confirm)) {
      document.getElementById(btn.dataset.form)?.submit();
    }
  });
});

// ===== BÚSQUEDA CON DEBOUNCE (300ms) =====
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', debounce((e) => {
    const url = new URL(window.location);
    url.searchParams.set('q', e.target.value);
    window.location = url.toString();
  }, 400));
}

// ===== TOAST GLOBAL =====
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.setAttribute('role', 'alert');
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(el);
  new bootstrap.Toast(el, { delay: 3000 }).show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ===== KANBAN: drag-over highlight =====
document.querySelectorAll('.kanban-column').forEach(col => {
  col.addEventListener('dragover', () => col.classList.add('drag-over'));
  col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
  col.addEventListener('drop', () => col.classList.remove('drag-over'));
});
