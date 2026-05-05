// ============================================================
//  CelebHost — app.js
//  Login system + Firebase integration ready + WhatsApp
// ============================================================

// ---- SESSION STATE ----
let currentUser = null; // { name, email, role: 'model'|'admin' }
let currentStep = 1;
let uploadCount = 0;

// ---- LOGIN ----
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  event.target.classList.add('active');
  hideError();
}

function showError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.style.display = 'block';
}
function hideError() {
  document.getElementById('login-error').style.display = 'none';
}

function loginModel() {
  const email = document.getElementById('model-email').value.trim();
  const pass = document.getElementById('model-pass').value;
  if (!email || !pass) { showError('Please enter your email and password.'); return; }

  // ---- FIREBASE AUTH (uncomment when Firebase is set up) ----
   firebase.auth().signInWithEmailAndPassword(email, pass)
     .then(cred => { onLoginSuccess({ name: cred.user.displayName || email, email, role: 'model' }); })
  .catch(err => showError(err.message));
  
}

function loginAdmin() {
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value;
  if (user === 'admin' && pass === 'admin123') {
    onLoginSuccess({ name: 'Admin', email: 'admin@celebhost.in', role: 'admin' });
  } else {
    showError('Invalid admin credentials. Try: admin / admin123');
  }
}

function onLoginSuccess(user) {
  currentUser = user;
  closeLogin();
  document.getElementById('main-nav').style.display = 'flex';
  document.getElementById('wa-float').style.display = 'flex';
  document.getElementById('user-pill').textContent = '👤 ' + capitalize(user.name);

  if (user.role === 'admin') {
    document.getElementById('admin-nav-btn').style.display = 'inline-block';
    document.getElementById('register-nav-btn').style.display = 'none';
    document.getElementById('my-profile-btn').style.display = 'none';
    showPage('admin');
  } else {
    document.getElementById('admin-nav-btn').style.display = 'none';
    document.getElementById('my-profile-btn').style.display = 'inline-block';
    document.getElementById('profile-name-text').textContent = capitalize(user.name);
    showPage('home');
  }
  buildModelsGrid();
  buildAdminTable();
}

function closeLogin() {
  document.getElementById('login-overlay').classList.add('hidden');
}

function logout() {
  currentUser = null;
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('main-nav').style.display = 'none';
  document.getElementById('wa-float').style.display = 'none';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  document.getElementById('model-email').value = '';
  document.getElementById('model-pass').value = '';
  document.getElementById('admin-user').value = '';
  document.getElementById('admin-pass').value = '';
  hideError();
}

// ---- NAVIGATION ----
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const map = { home: 0, browse: 1 };
  const btns = document.querySelectorAll('.nav-btn');
  if (map[id] !== undefined) btns[map[id]].classList.add('active');
  window.scrollTo(0, 0);
}

// ---- REGISTRATION FORM ----
function nextStep(n) {
  document.getElementById('step-' + currentStep).classList.remove('active');
  const prevTab = document.getElementById('step-tab-' + currentStep);
  if (prevTab) { prevTab.classList.remove('active'); prevTab.classList.add('done'); }
  currentStep = n;
  if (n <= 4) {
    document.getElementById('step-' + n).classList.add('active');
    document.getElementById('step-tab-' + n).classList.add('active');
  }
  window.scrollTo(0, 0);
}

function submitForm() {
  // ---- FIREBASE FIRESTORE SAVE (uncomment when Firebase is set up) ----
   const data = {
     name: document.getElementById('fname').value,
     email: document.getElementById('reg-email').value,
     phone: document.getElementById('phone').value,
     city: document.getElementById('city').value,
     state: document.getElementById('state').value,
     bio: document.getElementById('bio').value,
     height: document.getElementById('height').value,
     status: 'pending',
     createdAt: firebase.firestore.FieldValue.serverTimestamp()
   };
   firebase.firestore().collection('models').add(data)
     .then(() => showSuccessStep())
     .catch(err => alert('Error saving: ' + err.message));

  
  showSuccessStep();
}

function showSuccessStep() {
  document.getElementById('step-4').classList.remove('active');
  document.getElementById('step-success').classList.add('active');
  document.querySelectorAll('.progress-step').forEach(s => {
    s.classList.remove('active'); s.classList.add('done');
  });
}

function simulateUpload(type) {
  if (uploadCount < 4) {
    const el = document.getElementById('ph' + uploadCount);
    if (el) { el.classList.add('filled'); el.textContent = 'Photo ' + (uploadCount + 1); uploadCount++; }
  }
}

// ---- BROWSE MODELS ----
const modelData = [
  { name: 'Priya Sharma', city: 'Mumbai', cats: ['Runway', 'Editorial'], color: '#C2185B', emoji: '🌸', badge: 'verified', height: '172 cm' },
  { name: 'Ananya Singh', city: 'Delhi', cats: ['Commercial', 'Bridal'], color: '#7B1FA2', emoji: '💫', badge: 'new', height: '168 cm' },
  { name: 'Zara Khan', city: 'Bangalore', cats: ['Fitness', 'Lifestyle'], color: '#0097A7', emoji: '✨', badge: 'verified', height: '175 cm' },
  { name: 'Riya Patel', city: 'Ahmedabad', cats: ['Bridal', 'Jewellery'], color: '#D84315', emoji: '🌺', badge: '', height: '165 cm' },
  { name: 'Meera Nair', city: 'Chennai', cats: ['Editorial', 'Hair'], color: '#1565C0', emoji: '🦋', badge: 'verified', height: '170 cm' },
  { name: 'Simran Kaur', city: 'Chandigarh', cats: ['Runway', 'Glamour'], color: '#2E7D32', emoji: '🌿', badge: 'new', height: '174 cm' },
  { name: 'Diya Reddy', city: 'Hyderabad', cats: ['Commercial', 'Brand Ambassador'], color: '#F57F17', emoji: '⭐', badge: '', height: '167 cm' },
  { name: 'Kavya Menon', city: 'Kochi', cats: ['Lifestyle', 'Bridal'], color: '#880E4F', emoji: '🌷', badge: 'verified', height: '163 cm' },
];

function buildModelsGrid() {
  const grid = document.getElementById('models-grid');
  if (!grid) return;
  grid.innerHTML = '';
  modelData.forEach(m => {
    const card = document.createElement('div');
    card.className = 'model-card';
    const badgeHTML = m.badge ? `<div class="model-badge ${m.badge}">${m.badge === 'verified' ? '✓ Verified' : 'New'}</div>` : '';
    const wa = `https://wa.me/919876543210?text=Hi%20CelebHost%2C%20I%27m%20interested%20in%20booking%20${encodeURIComponent(m.name)}`;
    card.innerHTML = `
      <div class="model-photo" style="background:linear-gradient(135deg,${m.color}44,${m.color}88)">
        <span style="font-size:3.5rem">${m.emoji}</span>${badgeHTML}
      </div>
      <div class="model-info">
        <h4>${m.name}</h4>
        <p>📍 ${m.city} &nbsp;|&nbsp; ${m.height}</p>
        <div class="model-tags">${m.cats.map(c => `<span class="tag">${c}</span>`).join('')}</div>
        <a href="${wa}" target="_blank" style="display:inline-flex;align-items:center;gap:5px;margin-top:0.75rem;font-size:0.78rem;color:#25D366;text-decoration:none;font-weight:500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Contact on WhatsApp
        </a>
      </div>`;
    grid.appendChild(card);
  });
}

function filterModels(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('models-grid');
  grid.innerHTML = '';
  const filtered = cat === 'All' ? modelData : modelData.filter(m => m.cats.some(c => c.includes(cat)));
  filtered.forEach(m => {
    const card = document.createElement('div');
    card.className = 'model-card';
    const badgeHTML = m.badge ? `<div class="model-badge ${m.badge}">${m.badge === 'verified' ? '✓ Verified' : 'New'}</div>` : '';
    card.innerHTML = `
      <div class="model-photo" style="background:linear-gradient(135deg,${m.color}44,${m.color}88)">
        <span style="font-size:3.5rem">${m.emoji}</span>${badgeHTML}
      </div>
      <div class="model-info">
        <h4>${m.name}</h4>
        <p>📍 ${m.city} &nbsp;|&nbsp; ${m.height}</p>
        <div class="model-tags">${m.cats.map(c => `<span class="tag">${c}</span>`).join('')}</div>
      </div>`;
    grid.appendChild(card);
  });
}

// ---- ADMIN TABLE ----
const adminRows = [
  { name: 'Priya Sharma', city: 'Mumbai', cat: 'Runway, Editorial', date: '2 hrs ago', status: 'pending' },
  { name: 'Ananya Singh', city: 'Delhi', cat: 'Commercial', date: '5 hrs ago', status: 'review' },
  { name: 'Zara Khan', city: 'Bangalore', cat: 'Fitness', date: '1 day ago', status: 'approved' },
  { name: 'Meera Nair', city: 'Chennai', cat: 'Editorial', date: '1 day ago', status: 'approved' },
  { name: 'Simran Kaur', city: 'Chandigarh', cat: 'Runway', date: '2 days ago', status: 'pending' },
  { name: 'Diya Reddy', city: 'Hyderabad', cat: 'Commercial', date: '2 days ago', status: 'review' },
];
const colors = ['#E91E8C','#7B1FA2','#0097A7','#1565C0','#D84315','#2E7D32'];
const statusMap = { pending: 'status-pending', approved: 'status-approved', review: 'status-review' };
const statusLabel = { pending: 'Pending', approved: 'Approved', review: 'In Review' };

function buildAdminTable(rows) {
  const tbody = document.getElementById('admin-table');
  if (!tbody) return;
  tbody.innerHTML = '';
  (rows || adminRows).forEach((r, i) => {
    const tr = document.createElement('tr');
    const initials = r.name.split(' ').map(w => w[0]).join('');
    tr.innerHTML = `
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="avatar-circle" style="width:34px;height:34px;min-width:34px;background:${colors[i % colors.length]}22;color:${colors[i % colors.length]};font-size:0.72rem">${initials}</div>
        <span style="font-weight:500">${r.name}</span>
      </div></td>
      <td style="color:var(--text2)">${r.city}</td>
      <td style="color:var(--text2)">${r.cat}</td>
      <td style="color:var(--text2)">${r.date}</td>
      <td><span class="status-badge ${statusMap[r.status]}">${statusLabel[r.status]}</span></td>
      <td>
        <button class="action-btn view-btn">View</button>
        ${r.status !== 'approved' ? '<button class="action-btn approve-btn" onclick="approveRow(this)">Approve</button>' : ''}
        ${r.status === 'pending' ? '<button class="action-btn reject-btn" onclick="rejectRow(this)">Reject</button>' : ''}
      </td>`;
    tbody.appendChild(tr);
  });
}

function approveRow(btn) {
  const td = btn.closest('td');
  const statusCell = td.previousElementSibling;
  statusCell.innerHTML = '<span class="status-badge status-approved">Approved</span>';
  btn.remove();
  td.querySelector('.reject-btn')?.remove();
}
function rejectRow(btn) {
  btn.closest('tr').style.opacity = '0.4';
  btn.closest('tr').style.pointerEvents = 'none';
}

function filterTable(query) {
  const q = query.toLowerCase();
  const filtered = adminRows.filter(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q));
  buildAdminTable(filtered);
}

// ---- UTILS ----
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
