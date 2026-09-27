const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Mobile navigation
$('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(link => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));

// Project case study modal
const projectModal = $('#projectModal');
const projectNames = {
  'Gulshan Residence': 'Gulshan Residence',
  'Northline House': 'Northline House',
  'Monument Lounge': 'Monument Lounge'
};
$$('.project-view').forEach(button => {
  button.addEventListener('click', () => {
    $('#modalTitle').textContent = projectNames[button.dataset.project] || button.dataset.project;
    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  });
});

// Preliminary construction calculator
const calculatorForm = $('#calculatorForm');
function formatCrore(value) {
  const crore = value / 10000000;
  return `৳ ${crore.toFixed(2)} Cr`;
}
function calculateEstimate() {
  const location = Number($('#location').value);
  const area = Number($('#floorArea').value || 0);
  const floors = Number($('#floors').value || 1);
  const quality = Number($('#quality').value);
  const interior = Number($('#interior').value);
  const totalArea = area * floors;
  // Demo base rate. Replace this formula with your real QS / BOQ pricing model.
  const baseRate = 4800;
  const base = totalArea * baseRate * location * quality;
  const low = base * (1 + interior * 0.65);
  const high = base * (1 + interior * 1.05);
  $('#estimateValue').textContent = `${formatCrore(low)} — ${formatCrore(high)}`;
  $('#estimateStatus').textContent = `${totalArea.toLocaleString()} SQ FT / PRELIMINARY`;
}
$$('#calculatorForm input, #calculatorForm select').forEach(input => input.addEventListener('input', calculateEstimate));
calculatorForm.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#consultation').scrollIntoView({ behavior: 'smooth' });
});
calculateEstimate();

// Materials filtering
$$('.filter').forEach(button => {
  button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    $$('.material-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.category === filter ? 'flex' : 'none';
    });
  });
});

// Material project list
const materialList = [];
function updateMaterialDrawer() {
  const count = materialList.length;
  const total = materialList.reduce((sum, item) => sum + item.price, 0);
  $('#materialCount').textContent = `${count} item${count === 1 ? '' : 's'}`;
  $('#materialTotal').textContent = `৳ ${total.toLocaleString()}`;
  $('#selectedTotal').textContent = `৳ ${total.toLocaleString()}`;
  const container = $('#selectedMaterials');
  if (!count) {
    container.innerHTML = '<p class="muted">No materials added yet.</p>';
    return;
  }
  container.innerHTML = materialList.map((item, index) => `
    <div class="selected-row"><span>${item.name}</span><span>৳ ${item.price.toLocaleString()} <button class="remove-material" data-index="${index}" aria-label="Remove ${item.name}">×</button></span></div>
  `).join('');
  $$('.remove-material', container).forEach(button => button.addEventListener('click', () => {
    materialList.splice(Number(button.dataset.index), 1);
    updateMaterialDrawer();
  }));
}
$$('.add-material').forEach(button => {
  button.addEventListener('click', () => {
    materialList.push({ name: button.dataset.name, price: Number(button.dataset.price) });
    updateMaterialDrawer();
    button.textContent = '✓ Added';
    setTimeout(() => button.textContent = '+ Add to Project', 900);
  });
});

const materialsModal = $('#materialsModal');
$('#openMaterialList').addEventListener('click', () => {
  updateMaterialDrawer();
  materialsModal.classList.add('open');
  materialsModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
});

// Close all modals
$$('[data-close], .modal-backdrop').forEach(element => element.addEventListener('click', () => {
  $$('.modal').forEach(modal => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('no-scroll');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    $$('.modal').forEach(modal => modal.classList.remove('open'));
    document.body.classList.remove('no-scroll');
  }
});

// Consultation form demo state
$('#consultationForm').addEventListener('submit', event => {
  event.preventDefault();
  $('#formNote').textContent = 'Request received in demo mode. Connect this form to your backend or CRM to make it live.';
  $('#formNote').style.color = '#c5a66d';
});

// Small scroll reveal effect
const revealTargets = $$('.service-card, .decision-card, .project-card, .team-grid article, .material-card');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealTargets.forEach(el => observer.observe(el));
