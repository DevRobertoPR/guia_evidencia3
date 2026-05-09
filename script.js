// ===========================
//  Guía Django — Evidencia 3
//  script.js
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initStepHighlight();
  initCopyButtons();
  initChecklistProgress();
  initFilterButtons();
  initScrollToTop();
});

// ---- 1. BARRA DE PROGRESO DE LECTURA ----
function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: var(--term); z-index: 999;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px var(--term);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) + '%' : '0%';
  });
}

// ---- 2. RESALTAR PASO AL HACER CLIC ----
function initStepHighlight() {
  document.querySelectorAll('.step').forEach(step => {
    step.style.cursor = 'pointer';
    step.addEventListener('click', () => {
      const isActive = step.classList.contains('step-active');
      document.querySelectorAll('.step').forEach(s => s.classList.remove('step-active'));
      if (!isActive) step.classList.add('step-active');
    });
  });

  // Inyectar estilo de step activo
  const style = document.createElement('style');
  style.textContent = `
    .step-active .step-body {
      border-color: var(--term);
      background: #0d1a16;
    }
    .step-active .num.term { box-shadow: 0 0 0 3px rgba(29,158,117,0.25); }
    .step-active .num.proj { box-shadow: 0 0 0 3px rgba(55,138,221,0.25); }
    .step-active .num.app  { box-shadow: 0 0 0 3px rgba(99,153,34,0.25); }
    .step-active .num.file { box-shadow: 0 0 0 3px rgba(239,159,39,0.25); }
  `;
  document.head.appendChild(style);
}

// ---- 3. BOTÓN DE COPIAR EN BLOQUES DE CÓDIGO ----
function initCopyButtons() {
  // Aplica a .cmd y pre.code-block
  document.querySelectorAll('.cmd, pre.code-block').forEach(block => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative;';

    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    const btn = document.createElement('button');
    btn.textContent = 'copiar';
    btn.style.cssText = `
      position: absolute; top: 6px; right: 8px;
      font-family: var(--font-mono); font-size: 10px;
      color: var(--text-dim); background: transparent;
      border: 1px solid var(--border); border-radius: 4px;
      padding: 2px 8px; cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.color        = 'var(--term)';
      btn.style.borderColor  = 'var(--term)';
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.textContent !== '✓ copiado') {
        btn.style.color       = 'var(--text-dim)';
        btn.style.borderColor = 'var(--border)';
      }
    });
    btn.addEventListener('click', () => {
      const text = block.innerText || block.textContent;
      navigator.clipboard.writeText(text.trim()).then(() => {
        btn.textContent       = '✓ copiado';
        btn.style.color       = 'var(--term)';
        btn.style.borderColor = 'var(--term)';
        setTimeout(() => {
          btn.textContent       = 'copiar';
          btn.style.color       = 'var(--text-dim)';
          btn.style.borderColor = 'var(--border)';
        }, 2000);
      });
    });
    wrapper.appendChild(btn);
  });
}

// ---- 4. PROGRESO DEL CHECKLIST ----
function initChecklistProgress() {
  const checklist = document.querySelector('.checklist');
  if (!checklist) return;

  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');

  // Crear indicador de progreso
  const progressWrapper = document.createElement('div');
  progressWrapper.style.cssText = `
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 0.75rem;
  `;

  const progressTrack = document.createElement('div');
  progressTrack.style.cssText = `
    flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;
  `;

  const progressFill = document.createElement('div');
  progressFill.style.cssText = `
    height: 100%; width: 0%; background: var(--term);
    border-radius: 2px; transition: width 0.4s ease;
  `;
  progressTrack.appendChild(progressFill);

  const progressLabel = document.createElement('span');
  progressLabel.style.cssText = `
    font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);
    min-width: 40px; text-align: right;
  `;

  progressWrapper.appendChild(progressTrack);
  progressWrapper.appendChild(progressLabel);

  const title = checklist.querySelector('.check-title');
  title.after(progressWrapper);

  function updateProgress() {
    const total   = checkboxes.length;
    const checked = [...checkboxes].filter(cb => cb.checked).length;
    const pct     = Math.round(checked / total * 100);
    progressFill.style.width  = pct + '%';
    progressLabel.textContent = checked + '/' + total;

    if (checked === total) {
      progressFill.style.background = 'var(--app)';
      progressLabel.style.color     = 'var(--app)';
      showCompletionMessage(checklist);
    } else {
      progressFill.style.background = 'var(--term)';
      progressLabel.style.color     = 'var(--text-dim)';
      removeCompletionMessage(checklist);
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));
  updateProgress();
}

function showCompletionMessage(checklist) {
  if (checklist.querySelector('.completion-msg')) return;
  const msg = document.createElement('div');
  msg.className = 'completion-msg';
  msg.style.cssText = `
    margin-top: 0.75rem; padding: 0.6rem 0.9rem;
    background: var(--app-soft); border: 1px solid var(--app-bg);
    border-radius: var(--radius); font-size: 13px; color: var(--app);
    font-family: var(--font-mono); text-align: center;
    animation: fadeUp 0.3s ease;
  `;
  msg.textContent = '✓ todo listo — puedes levantar el servidor';
  checklist.appendChild(msg);
}

function removeCompletionMessage(checklist) {
  const msg = checklist.querySelector('.completion-msg');
  if (msg) msg.remove();
}

// ---- 5. FILTRO POR TIPO DE PASO ----
function initFilterButtons() {
  const main = document.querySelector('main');
  if (!main) return;

  const filterBar = document.createElement('div');
  filterBar.style.cssText = `
    display: flex; gap: 8px; flex-wrap: wrap;
    margin-bottom: 2rem; padding: 0.9rem 1rem;
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    align-items: center;
  `;

  const label = document.createElement('span');
  label.textContent = 'filtrar:';
  label.style.cssText = `
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em;
    margin-right: 4px;
  `;
  filterBar.appendChild(label);

  const filters = [
    { key: 'all',  label: 'todos',     color: 'var(--text-muted)' },
    { key: 'term', label: 'terminal',  color: 'var(--term)' },
    { key: 'proj', label: 'proyecto',  color: 'var(--proj)' },
    { key: 'app',  label: 'app',       color: 'var(--app)'  },
    { key: 'file', label: 'archivo',   color: 'var(--file)' },
  ];

  let active = 'all';

  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.textContent = f.label;
    btn.dataset.key = f.key;
    btn.style.cssText = `
      font-family: var(--font-mono); font-size: 11px; cursor: pointer;
      padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border);
      background: transparent; color: ${f.color}; transition: all 0.15s;
    `;

    btn.addEventListener('click', () => {
      active = f.key;

      // Actualizar estilo de botones
      filterBar.querySelectorAll('button').forEach(b => {
        const isActive = b.dataset.key === active;
        b.style.background   = isActive ? 'var(--bg3)' : 'transparent';
        b.style.borderColor  = isActive ? filters.find(x => x.key === b.dataset.key).color : 'var(--border)';
        b.style.fontWeight   = isActive ? '700' : '400';
      });

      // Mostrar/ocultar pasos
      document.querySelectorAll('.step').forEach(step => {
        if (active === 'all') {
          step.style.display = 'flex';
        } else {
          const hasNum = step.querySelector('.num.' + active);
          step.style.display = hasNum ? 'flex' : 'none';
        }
      });
    });

    filterBar.appendChild(btn);
  });

  // Activar "todos" por defecto
  filterBar.querySelectorAll('button')[0].click();

  main.insertBefore(filterBar, main.firstChild);
}

// ---- 6. BOTÓN VOLVER ARRIBA ----
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.textContent = '↑';
  btn.title = 'Volver arriba';
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 24px;
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--bg2); border: 1px solid var(--border);
    color: var(--text-muted); font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s, border-color 0.2s, color 0.2s;
    z-index: 100;
  `;

  btn.addEventListener('mouseenter', () => {
    btn.style.color       = 'var(--term)';
    btn.style.borderColor = 'var(--term)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.color       = 'var(--text-muted)';
    btn.style.borderColor = 'var(--border)';
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity       = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  });

  document.body.appendChild(btn);
}
