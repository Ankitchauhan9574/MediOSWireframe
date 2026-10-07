/**
 * MediOS Pro - Enterprise Healthcare OS (Phase 1, 2 & Phase 3 Pharmacy + Lab)
 * Core Application Engine & Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
        currentView: 'dashboard',
        currentPatientId: 'PAT-2026-0101',
        rxLanguage: 'en',
        selectedOnlineSlot: '10:30 AM',
        audioMuted: false,
        activeEncounter: {
            patientId: 'PAT-2026-0101',
            complaints: 'Patient presents with elevated morning fasting blood glucose (164 mg/dL) and mild headache since 4 days. No chest pain or dyspnea.',
            diagnosis: 'E11.9 - Type 2 Diabetes Mellitus with Essential Hypertension (I10)',
            vitals: { bp: '138/88', pulse: 78, spo2: 98, temp: 98.6, weight: 79, height: 176, bmi: 25.5 },
            labOrders: ['LAB-01', 'LAB-02'],
            rxItems: [
                { medId: 'MED-001', brand: 'Tab. Glycomet GP 1/500', dose: '1 Tab', freq: '1-0-1 (Twice Daily)', duration: '30 Days', timing: 'Before Breakfast & Dinner', qty: 60 },
                { medId: 'MED-002', brand: 'Tab. Telma 40', dose: '1 Tab', freq: '1-0-0 (Morning Once)', duration: '30 Days', timing: 'After Breakfast', qty: 30 },
                { medId: 'MED-007', brand: 'Tab. Rosuvas 10', dose: '1 Tab', freq: '0-0-1 (Night Once)', duration: '30 Days', timing: 'After Dinner', qty: 30 }
            ],
            advice: 'Follow strict low-glycemic, low-salt diet. 30 mins brisk morning walk. Maintain self-blood glucose log.'
        },
        billingItems: [
            { item: 'Specialist Consultation Fee (General Medicine)', code: 'SRV-CONS-01', qty: 1, rate: 800, amount: 800 },
            { item: 'HbA1c & Fasting Glucose Screening', code: 'LAB-01', qty: 1, rate: 450, amount: 450 },
            { item: 'Prescription Dispense (Pharmacy Tally)', code: 'PHA-DISP-01', qty: 1, rate: 980, amount: 980 }
        ],
        selectedPaymentMode: 'UPI',
        currentRole: sessionStorage.getItem('medios_user_role') || 'Doctor'
    };

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const viewSections = document.querySelectorAll('.view-section');
    const headerTitle = document.getElementById('headerPageTitle');
    const headerSection = document.getElementById('headerSectionName');
    const liveTimeClock = document.getElementById('liveTimeClock');
    const toastContainer = document.getElementById('toastContainer');
    const audioToggleBtn = document.getElementById('globalAudioToggleBtn');
    const audioToggleIcon = document.getElementById('audioToggleIcon');

    // --------------------------------------------------------------------------
    // 1. Role-Based Access Control (RBAC) Workspace Configurations
    // --------------------------------------------------------------------------
    const RoleConfigurations = {
        'Pharmacist': {
            role: 'Pharmacist',
            name: 'Suresh Nair (Head Pharm)',
            title: 'Chief Pharmacist',
            branch: 'Apex MediStore & Chemist (Pharmacy Counter)',
            brandTag: 'MEDICAL STORE',
            avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['pharmacy', 'procurement', 'audit'],
            defaultView: 'pharmacy',
            tagClass: 'badge-blue'
        },
        'Pathologist': {
            role: 'Pathologist',
            name: 'Dr. Sunita Rao (Path MD)',
            title: 'Consultant Pathologist',
            branch: 'Apex NABL Diagnostic Pathology Labs',
            brandTag: 'DIAGNOSTIC LAB',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['lab', 'radiology', 'audit'],
            defaultView: 'lab',
            tagClass: 'badge-purple'
        },
        'Radiologist': {
            role: 'Radiologist',
            name: 'Dr. Vikramaditya (Radio MD)',
            title: 'Consultant Radiologist',
            branch: 'Apex Diagnostic Imaging & Digital X-Ray',
            brandTag: 'RADIOLOGY SUITE',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['radiology', 'lab', 'audit'],
            defaultView: 'radiology',
            tagClass: 'badge-blue'
        },
        'Doctor': {
            role: 'Doctor',
            name: 'Dr. Rajeshwar S. (MD Med)',
            title: 'Consultant Physician & Cardiologist',
            branch: 'Apex Specialist OPD Clinic',
            brandTag: 'DOCTOR CLINIC',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['emr', 'queue', 'appointments', 'patients', 'payouts', 'leaves-waitlist'],
            defaultView: 'emr',
            tagClass: 'badge-emerald'
        },
        'Hospital Admin': {
            role: 'Hospital Admin',
            name: 'Dr. Anand Mehra (Medical Supt)',
            title: 'Hospital Administrator',
            branch: 'Apex Hospital (Wards, IPD & OT)',
            brandTag: 'HOSPITAL IPD',
            avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['ipd-bed-map', 'ipd-admissions', 'ipd-nursing', 'ipd-rounds', 'ipd-discharge', 'ot-management', 'tpa-desk', 'procurement', 'multi-branch', 'dashboard', 'analytics'],
            defaultView: 'ipd-bed-map',
            tagClass: 'badge-rose'
        },
        'Staff Nurse': {
            role: 'Staff Nurse',
            name: 'Sarita Sharma (Head Nurse)',
            title: 'Ward Nursing In-Charge',
            branch: 'Apex In-Patient Wards & Nursing Station',
            brandTag: 'NURSING STATION',
            avatar: 'https://images.unsplash.com/photo-1594824813580-49605511b8b6?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['ipd-nursing', 'ipd-bed-map', 'ipd-admissions', 'ipd-rounds'],
            defaultView: 'ipd-nursing',
            tagClass: 'badge-emerald'
        },
        'Chief Surgeon': {
            role: 'Chief Surgeon',
            name: 'Dr. Sameer Kapoor (MS Ortho)',
            title: 'Chief of Surgery / OT Director',
            branch: 'Apex Surgical & OT Suites',
            brandTag: 'SURGERY SUITE',
            avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['ot-management', 'ipd-bed-map', 'ipd-admissions', 'ipd-rounds'],
            defaultView: 'ot-management',
            tagClass: 'badge-rose'
        },
        'Reception Desk': {
            role: 'Reception Desk',
            name: 'Pooja K. (Front Desk)',
            title: 'Senior Receptionist',
            branch: 'Apex Reception & Token Desk',
            brandTag: 'FRONT DESK',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['queue', 'appointments', 'patients', 'billing', 'online-booking', 'portal'],
            defaultView: 'queue',
            tagClass: 'badge-blue'
        },
        'Billing Executive': {
            role: 'Billing Executive',
            name: 'Anil Mehta (Billing Desk)',
            title: 'Accounts & Billing Cashier',
            branch: 'Apex Cash & Billing Desk',
            brandTag: 'BILLING DESK',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            allowedViews: ['billing', 'tpa-desk', 'payouts', 'analytics'],
            defaultView: 'billing',
            tagClass: 'badge-blue'
        },
        'Super Admin': {
            role: 'Super Admin',
            name: 'Apex Group Administrator',
            title: 'Master Administrator',
            branch: 'Apex Healthcare Enterprise Group',
            brandTag: 'MASTER ERP',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            allowedViews: 'all',
            defaultView: 'dashboard',
            tagClass: 'badge-purple'
        }
    };

    function normalizeRole(role) {
        if (!role) return 'Doctor';
        const r = role.toLowerCase();
        if (r.includes('pharm') || r.includes('chemist') || r.includes('medic')) return 'Pharmacist';
        if (r.includes('patho') || r.includes('lab')) return 'Pathologist';
        if (r.includes('radio') || r.includes('xray') || r.includes('x-ray')) return 'Radiologist';
        if (r.includes('doc')) return 'Doctor';
        if (r.includes('nurse')) return 'Staff Nurse';
        if (r.includes('surg') || r.includes('ot')) return 'Chief Surgeon';
        if (r.includes('reception') || r.includes('front')) return 'Reception Desk';
        if (r.includes('bill') || r.includes('cash')) return 'Billing Executive';
        if (r.includes('hosp') || r.includes('ipd')) return 'Hospital Admin';
        if (r.includes('admin')) return 'Super Admin';
        return RoleConfigurations[role] ? role : 'Doctor';
    }

    // --------------------------------------------------------------------------
    // Initial Setup & View Switching
    // --------------------------------------------------------------------------
    function init() {
        startLiveClock();
        setupNavigation();
        setupAudioController();
        setupButtonRipples();
        renderDashboard();
        renderPatientsTable();
        renderAppointmentsTable();
        renderQueueTable();
        renderDoctorEMR();
        renderBillingPOS();
        renderPharmacyBatches();
        renderPharmacyRxQueueTable();
        renderLabWorklist();
        renderRadiologyWorklist();
        renderDoctorPayouts();
        renderIpdBedMap();
        renderIpdAdmissionsTable();
        renderNursingStation();
        renderDoctorRounds();
        renderDischargeDesk();
        renderOtManagement();
        renderTpaClaimsDesk();
        renderHospitalProcurement();
        renderMultiBranchHub();
        renderDoctorLeaves();
        renderWaitlist();
        renderFeedbackTable();
        renderSaasPlans();
        renderAuditLogs();
        renderPublicBookingEngine();
        setupModals();
        setupGlobalShortcuts();

        // Restore persona from session if present
        const savedRole = sessionStorage.getItem('medios_user_role') || state.currentRole || 'Doctor';
        window.switchAppRole(savedRole, false);

        // Support direct view navigation via hash or query param (e.g., #view=online-booking)
        const hashMatch = window.location.hash.match(/view=([a-zA-Z0-9_-]+)/);
        const urlParams = new URLSearchParams(window.location.search);
        const targetView = (hashMatch && hashMatch[1]) || urlParams.get('view');
        if (targetView) {
            switchView(targetView);
        }
    }

    function switchView(viewName) {
        // Enforce RBAC access permissions
        const activeRoleKey = normalizeRole(state.currentRole);
        const roleConf = RoleConfigurations[activeRoleKey] || RoleConfigurations['Super Admin'];
        if (roleConf && roleConf.allowedViews !== 'all' && !roleConf.allowedViews.includes(viewName)) {
            showToast(`Access Restricted: Module '${viewName}' is not part of ${roleConf.brandTag}.`, 'warning', 'RBAC Security');
            viewName = roleConf.defaultView;
        }

        state.currentView = viewName;
        playAudioFx('click');
        
        navItems.forEach(item => {
            if (item.dataset.view === viewName) item.classList.add('active');
            else item.classList.remove('active');
        });

        viewSections.forEach(section => {
            if (section.id === `view-${viewName}`) {
                section.classList.add('active');
                section.classList.add('stagger-in');
            } else {
                section.classList.remove('active');
                section.classList.remove('stagger-in');
            }
        });

        const titleMap = {
            'dashboard': { title: 'Clinical & Operations Dashboard', section: 'Operations Hub' },
            'patients': { title: 'Patient Longitudinal Directory', section: 'Patient Registry' },
            'appointments': { title: 'Doctor Appointments & Schedule', section: 'Clinical Rostering' },
            'queue': { title: 'Live OPD Token & Queue Board', section: 'Patient Flow' },
            'emr': { title: 'Doctor Consultation Workspace (EMR)', section: 'Clinical Cockpit' },
            'billing': { title: 'Smart Billing & Cash Desk (POS)', section: 'Revenue & Accounts' },
            'pharmacy': { title: 'Pharmacy Inventory & FEFO Batch Ledger', section: 'Pharmacy Suite (Phase 3)' },
            'lab': { title: 'Pathology & Diagnostic Lab Worklist', section: 'Laboratory Suite (Phase 3)' },
            'radiology': { title: 'Radiology, Digital X-Ray & DICOM Imaging Suite', section: 'Diagnostic Imaging (Phase 3)' },
            'payouts': { title: 'Doctor Revenue Share & Payout Statements', section: 'Doctor Operations (OPS-01)' },
            'ipd-bed-map': { title: 'Interactive Ward & Bed Occupancy Map', section: 'Hospital Core (Phase 4)' },
            'ipd-admissions': { title: 'In-Patient (IPD) Admissions Directory', section: 'Hospital Core (Phase 4)' },
            'ipd-nursing': { title: 'Nursing Station & Medication Administration Record (MAR)', section: 'Hospital Core (Phase 4)' },
            'ipd-rounds': { title: 'IPD Consultant Doctor Daily Rounds', section: 'Hospital Core (Phase 4)' },
            'ipd-discharge': { title: 'Discharge Planning & Final Folio Settlement', section: 'Hospital Core (Phase 4)' },
            'ot-management': { title: 'Operation Theatre (OT) & Procedure Suite', section: 'Enterprise Operations (Phase 5)' },
            'tpa-desk': { title: 'Insurance & TPA Claims Pre-Authorization Desk', section: 'Enterprise Operations (Phase 5)' },
            'procurement': { title: 'Hospital Procurement, PO & Central Stores', section: 'Enterprise Operations (Phase 5)' },
            'multi-branch': { title: 'Multi-Branch Group Operations & HQ Analytics', section: 'Enterprise Group (Phase 5)' },
            'portal': { title: 'Patient Self-Service Portal & Dependents', section: 'Patient Experience (PEX-03)' },
            'online-booking': { title: 'Public Online Appointment Booking Flow', section: 'Patient Onboarding (PEX-01)' },
            'analytics': { title: 'Clinic Revenue, No-Show & NPS Analytics', section: 'Executive Intelligence' },
            'leaves-waitlist': { title: 'Doctor Leave Planner & Smart Waitlist', section: 'Roster Management' },
            'feedback': { title: 'Patient NPS & Post-Visit Feedback Stream', section: 'Quality of Care' },
            'subscriptions': { title: 'SaaS Editions & Feature Entitlements', section: 'SaaS Platform' },
            'audit': { title: 'System Security & Compliance Audit Trail', section: 'Governance' },
            'settings': { title: 'Tenant & Clinic Configuration', section: 'Administration' }
        };

        if (titleMap[viewName]) {
            headerTitle.innerHTML = titleMap[viewName].title;
            headerSection.innerText = titleMap[viewName].section;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                if (view) switchView(view);
            });
        });

        document.querySelectorAll('[data-switch-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.dataset.switchView;
                if (view) switchView(view);
            });
        });
    }

    function startLiveClock() {
        function update() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            if (liveTimeClock) liveTimeClock.innerText = `${timeStr} | ${dateStr}`;
            
            const tvClock = document.getElementById('tvTimeDisplay');
            if (tvClock) tvClock.innerText = timeStr;
        }
        update();
        setInterval(update, 1000);
    }

    // --------------------------------------------------------------------------
    // 2. High-Fidelity Audio Synth & Sound Controller
    // --------------------------------------------------------------------------
    function playAudioFx(type = 'click') {
        if (state.audioMuted) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(750, ctx.currentTime);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.06);
            } else if (type === 'chime') {
                // 3-tone OPD Queue Chime (D5 - A5 - D6)
                const notes = [587.33, 880.00, 1174.66];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
                    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.18);
                    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + idx * 0.18 + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 0.75);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.18);
                    osc.stop(ctx.currentTime + idx * 0.18 + 0.8);
                });
            } else if (type === 'success') {
                // Triad Major Arpeggio Celebration (C5 - E5 - G5 - C6)
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
                    gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.1);
                    osc.stop(ctx.currentTime + idx * 0.1 + 0.55);
                });
            } else if (type === 'alert') {
                // Medical Warning Beep
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.22);
            }
        } catch(e) {}
    }

    function setupAudioController() {
        if (audioToggleBtn && audioToggleIcon) {
            audioToggleBtn.addEventListener('click', () => {
                state.audioMuted = !state.audioMuted;
                if (state.audioMuted) {
                    audioToggleBtn.classList.remove('active-sound');
                    audioToggleIcon.className = 'bi bi-volume-mute-fill';
                    showToast('Audio FX Muted', 'warning', 'Sound Settings');
                } else {
                    audioToggleBtn.classList.add('active-sound');
                    audioToggleIcon.className = 'bi bi-volume-up-fill';
                    playAudioFx('success');
                    showToast('Audio FX Active (Tactile Sounds & Queue Chimes)', 'success', 'Sound Settings');
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // 3. Dynamic Confetti Celebration Particle Engine
    // --------------------------------------------------------------------------
    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#0ea5e9', '#38bdf8', '#10b981', '#34d399', '#f59e0b', '#ec4899', '#8b5cf6'];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width * 0.5 + (Math.random() * 200 - 100),
                y: canvas.height * 0.35 + (Math.random() * 100 - 50),
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.7) * 16,
                size: Math.random() * 7 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                opacity: 1
            });
        }

        let animationFrame;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.45; // Gravity
                p.rotation += p.rotSpeed;
                p.opacity -= 0.012;

                if (p.opacity > 0) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    ctx.restore();
                }
            });

            if (active) {
                animationFrame = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        }
        render();
    }

    // --------------------------------------------------------------------------
    // 4. Tactile Ripple Button Animation
    // --------------------------------------------------------------------------
    function setupButtonRipples() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn, .nav-item, .card');
            if (!btn) return;
            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${e.clientX - rect.left - size / 2}px`;
            circle.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    }

    // --------------------------------------------------------------------------
    // 5. Rich Toast Notification Engine with Auto-Dismiss Bar & Sound
    // --------------------------------------------------------------------------
    function showToast(message, type = 'success', title = '') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const iconClass = type === 'error' ? 'bi-exclamation-triangle-fill' :
                          type === 'warning' ? 'bi-shield-exclamation' :
                          'bi-check-circle-fill';
        
        const autoTitle = title || (type === 'error' ? 'Clinical Safety Alert' :
                                   type === 'warning' ? 'Warning / Notice' :
                                   'Action Completed');

        toast.innerHTML = `
            <i class="bi ${iconClass} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${autoTitle}</div>
                <div class="toast-msg">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>
            <div class="toast-progress"></div>
        `;

        if (type === 'error') playAudioFx('alert');
        else if (type === 'success') playAudioFx('click');

        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px) scale(0.95)';
                toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 3500);
    }

    // --------------------------------------------------------------------------
    // 2. Dashboard
    // --------------------------------------------------------------------------
    function renderDashboard() {
        const doctorGrid = document.getElementById('dashDoctorStatusGrid');
        if (!doctorGrid) return;

        doctorGrid.innerHTML = MediData.doctors.map(doc => `
            <div class="doctor-live-card">
                <img src="${doc.avatar}" class="doctor-live-avatar" alt="${doc.name}">
                <div class="doctor-live-meta">
                    <div class="doc-name">${doc.name}</div>
                    <div class="doc-spec">${doc.specialty}</div>
                    <div class="doc-room"><i class="bi bi-door-open"></i> ${doc.room}</div>
                </div>
                <div style="text-align: right;">
                    <span class="badge ${doc.status === 'In Consultation' ? 'badge-blue' : doc.status === 'Available' ? 'badge-green' : 'badge-amber'}">${doc.status}</span>
                    <div style="font-size: 11px; margin-top: 6px; color: var(--text-muted);">
                        Queue: <b>${doc.waiting}</b> waiting
                    </div>
                </div>
            </div>
        `).join('');

        const actList = document.getElementById('dashRecentActivityList');
        if (actList) {
            actList.innerHTML = MediData.auditLogs.slice(0, 4).map(log => `
                <div style="padding: 10px 0; border-bottom: 1px solid var(--border-subtle); display: flex; gap: 12px; align-items: flex-start;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: #0284c7; margin-top: 6px;"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 13px;">${log.action.replace(/_/g, ' ')}</div>
                        <div style="font-size: 11.5px; color: var(--text-secondary);">${log.details}</div>
                        <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 2px;"><i class="bi bi-clock"></i> ${log.time} • ${log.actor}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
    // 3. PHASE 3: Pharmacy Batches & FEFO Stock Ledger (PHA-01 - 07)
    // --------------------------------------------------------------------------
    function renderPharmacyBatches() {
        const tbody = document.getElementById('pharmacyBatchesTableBody');
        if (!tbody) return;

        tbody.innerHTML = MediData.pharmacyBatches.map(b => `
            <tr>
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${b.brand}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${b.generic}</div>
                </td>
                <td><span class="batch-chip">${b.batchNo}</span></td>
                <td>
                    <div style="font-weight: 700; font-size: 12.5px;">${b.expiryDate}</div>
                    <span class="expiry-alert-tag ${b.daysToExpiry < 30 ? 'exp-near' : b.stockQty < 100 ? 'exp-low' : 'exp-safe'}">
                        ${b.status}
                    </span>
                </td>
                <td>
                    <div style="font-weight: 800; font-size: 14px; color: ${b.stockQty < 100 ? '#e11d48' : 'var(--text-primary)'};">
                        ${b.stockQty} ${b.unit}
                    </div>
                </td>
                <td>
                    <div>₹${b.mrpRate.toFixed(2)} <span style="font-size: 10.5px; color: var(--text-muted);">(Buy: ₹${b.purchaseRate.toFixed(2)})</span></div>
                </td>
                <td><span class="badge badge-gray">${b.rackLocation}</span></td>
                <td>
                    <span class="badge ${b.schedule.includes('H1') ? 'badge-red' : b.schedule.includes('H') ? 'badge-amber' : 'badge-green'}">
                        ${b.schedule}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="quickDispenseBatch('${b.id}')" title="Dispense Batch">
                        <i class="bi bi-cart-plus"></i> Dispense
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // --------------------------------------------------------------------------
    // Live Doctor-to-Medical Store Connected e-Prescriptions Queue (PHA-08)
    // --------------------------------------------------------------------------
    function renderPharmacyRxQueueTable(filteredStoreId = 'all') {
        const tbody = document.getElementById('pharmacyRxOrdersTableBody');
        if (!tbody || !MediData.pharmacyRxQueue) return;

        let list = MediData.pharmacyRxQueue;
        if (filteredStoreId && filteredStoreId !== 'all') {
            list = list.filter(o => o.targetPharmacyId === filteredStoreId);
        }

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">
                        <i class="bi bi-inbox" style="font-size: 24px;"></i>
                        <div style="margin-top: 6px; font-weight: 600;">No pending e-Prescriptions in this medical store queue.</div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(o => {
            const isDispensed = o.status.includes('Dispensed');
            return `
                <tr style="${isDispensed ? 'opacity: 0.75;' : 'background: rgba(13, 148, 136, 0.02);'}">
                    <td>
                        <div style="font-weight: 800; font-family: var(--font-mono); color: var(--primary-600);">${o.serialNo}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${o.rxNo} • ${o.prescribedAt.split(',')[1] || o.prescribedAt}</div>
                    </td>
                    <td>
                        <div class="rx-claim-key-pill" title="Unique Patient Claim Key" style="background: rgba(13, 148, 136, 0.12); color: var(--teal-600); font-weight: 900; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-family: var(--font-mono); border: 1px solid rgba(13, 148, 136, 0.3); display: inline-flex; align-items: center; gap: 4px;">
                            <i class="bi bi-key-fill" style="font-size: 11px;"></i> ${o.claimKey}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${o.patientName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);"><i class="bi bi-telephone"></i> ${o.patientPhone}</div>
                    </td>
                    <td>
                        <div style="font-weight: 600; font-size: 12.5px;">${o.doctorName}</div>
                        <div style="font-size: 10.5px; color: var(--text-muted);">Attending Consultant</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; font-size: 12px; color: var(--teal-700);">${o.targetPharmacyName}</div>
                        <div style="font-size: 10.5px; color: var(--text-muted);"><i class="bi bi-geo-alt"></i> ${o.pickupMode}</div>
                    </td>
                    <td>
                        <span class="badge badge-blue" style="font-weight: 700;">${o.items.length} Medicines</span>
                        <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 2px;">
                            ${o.items.map(i => i.brand.split(' ')[1] || i.brand).join(', ')}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 900; font-size: 13.5px; color: var(--text-primary);">₹ ${o.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td>
                        <span class="badge ${isDispensed ? 'badge-green' : 'badge-amber'}">
                            ${isDispensed ? '<i class="bi bi-check2-all"></i> Dispensed' : '<i class="bi bi-clock-history"></i> Ready for Pickup'}
                        </span>
                    </td>
                    <td>
                        ${isDispensed ? `
                            <button class="btn btn-sm btn-outline" onclick="openPharmacyDispenseModal('${o.rxNo}')">
                                <i class="bi bi-receipt"></i> View Bill
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-teal" onclick="openPharmacyDispenseModal('${o.rxNo}')" style="font-weight: 700;">
                                <i class="bi bi-bag-check"></i> Dispense & Claim
                            </button>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterPharmacyOrdersByStore = function(storeId) {
        renderPharmacyRxQueueTable(storeId);
    };

    window.verifyAndClaimPrescriptionByKey = function(inputKey = null) {
        const rawKey = inputKey || (document.getElementById('rxClaimKeySearchInput') ? document.getElementById('rxClaimKeySearchInput').value : '');
        const cleanKey = (rawKey || '').replace(/[\s-]/g, '').toLowerCase().trim();

        if (!cleanKey) {
            showToast('Please enter a Claim Key, Serial Number, or Phone Number.', 'warning', 'Claim Key Required');
            return;
        }

        const foundOrder = MediData.pharmacyRxQueue.find(o => {
            const k = (o.claimKey || '').replace(/[\s-]/g, '').toLowerCase();
            const s = (o.serialNo || '').replace(/[\s-]/g, '').toLowerCase();
            const r = (o.rxNo || '').replace(/[\s-]/g, '').toLowerCase();
            const p = (o.patientPhone || '').replace(/[\s-]/g, '').toLowerCase();
            return k === cleanKey || s.includes(cleanKey) || r.includes(cleanKey) || p.includes(cleanKey);
        });

        if (foundOrder) {
            playAudioFx('chime');
            showToast(`Claim Key Verified! Loading prescription for ${foundOrder.patientName}...`, 'success', 'Claim Key Validated');
            openPharmacyDispenseModal(foundOrder.rxNo);
        } else {
            playAudioFx('alert');
            showToast(`No prescription found matching "${rawKey}". Please check the 6-digit claim key on patient's WhatsApp message.`, 'error', 'Invalid Claim Key');
        }
    };

    window.openPharmacyDispenseModal = function(rxNo = 'RX-2026-0914') {
        const order = MediData.pharmacyRxQueue.find(o => o.rxNo === rxNo) || MediData.pharmacyRxQueue[0];
        state.currentDispensingRxNo = order ? order.rxNo : rxNo;

        const body = document.getElementById('pharmacyDispenseModalBody');
        const confirmBtn = document.getElementById('confirmDispenseActionBtn');

        if (body && order) {
            const isDispensed = order.status.includes('Dispensed');
            if (confirmBtn) {
                confirmBtn.style.display = isDispensed ? 'none' : 'inline-flex';
            }

            body.innerHTML = `
                <div style="background: var(--bg-main); padding: 14px 18px; border-radius: var(--radius-md); border: 1.5px solid var(--border-subtle); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-weight: 800; font-size: 15px; color: var(--text-primary);">${order.patientName}</span>
                            <span style="font-size: 12px; color: var(--text-muted);">(${order.patientAge || 48} Yrs / ${order.patientGender || 'Male'})</span>
                        </div>
                        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                            Phone: <b>${order.patientPhone}</b> • Prescribed by: <b>${order.doctorName}</b>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Rx Claim Token</div>
                        <div style="font-family: var(--font-mono); font-weight: 900; font-size: 18px; color: var(--teal-600); background: rgba(13, 148, 136, 0.1); padding: 2px 10px; border-radius: 6px; border: 1px solid rgba(13, 148, 136, 0.3);">
                            <i class="bi bi-key-fill"></i> ${order.claimKey}
                        </div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Serial: <b>${order.serialNo}</b></div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="modern-table">
                        <thead>
                            <tr>
                                <th>Prescribed Medicine</th>
                                <th>Dose & Frequency</th>
                                <th>Allocated FEFO Batch</th>
                                <th>Expiry</th>
                                <th>Quantity</th>
                                <th>Unit MRP / Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => {
                                const matchingBatch = MediData.pharmacyBatches.find(b => b.medId === item.medId) || { batchNo: item.batchNo || 'BAT-26A', expiryDate: '03/2028', mrpRate: item.unitPrice || 12.00 };
                                const itemTotal = (item.qty || 30) * (item.unitPrice || matchingBatch.mrpRate);
                                return `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 700; color: var(--text-primary);">${item.brand}</div>
                                            <div style="font-size: 11px; color: var(--text-muted);">${item.timing || 'As Directed'}</div>
                                        </td>
                                        <td><span class="badge badge-blue">${item.dose || '1 Tab'} (${item.freq || '1-0-1'})</span></td>
                                        <td><span class="batch-chip">${matchingBatch.batchNo}</span></td>
                                        <td><span style="font-weight: 700; font-size: 12px; color: var(--emerald-600);">${matchingBatch.expiryDate}</span></td>
                                        <td><b>${item.qty} Tabs</b></td>
                                        <td><b>₹ ${itemTotal.toFixed(2)}</b></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 14px; border-top: 2px solid var(--border-subtle); flex-wrap: wrap; gap: 12px;">
                    <div>
                        <div style="font-size: 11px; color: var(--text-muted);">Fulfilling Medical Store & Pharmacist:</div>
                        <div style="font-weight: 700; font-size: 13px; color: var(--teal-700);">
                            ${order.targetPharmacyName} • Naveen P. (Reg #MH-PH-8891)
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; color: var(--text-muted);">Total Pharmacy Bill (incl. GST):</div>
                        <div style="font-size: 24px; font-weight: 900; color: var(--teal-600);">₹ ${order.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            `;
        }

        document.getElementById('pharmacyDispenseModal').classList.add('active');
    };

    window.completePharmacyDispense = function() {
        const rxNo = state.currentDispensingRxNo || 'RX-2026-0914';
        const order = MediData.pharmacyRxQueue.find(o => o.rxNo === rxNo);

        if (order) {
            order.status = 'Dispensed & Claimed';
            order.dispensedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            order.dispensedBy = 'Pharmacist Naveen P.';

            // Deduct batch stock
            order.items.forEach(item => {
                const b = MediData.pharmacyBatches.find(bat => bat.medId === item.medId);
                if (b) {
                    b.stockQty = Math.max(0, b.stockQty - (item.qty || 30));
                }
            });
        }

        document.getElementById('pharmacyDispenseModal').classList.remove('active');
        renderPharmacyBatches();
        renderPharmacyRxQueueTable();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `Pharmacist Naveen P. (Dispensing Counter)`,
            action: 'PRESCRIPTION_CLAIM_DISPENSED',
            entity: `Claim #${order ? order.claimKey : '749-102'} (${order ? order.patientName : 'Patient'})`,
            tenant: MediData.tenant.id,
            details: `Validated Unique Claim Key #${order ? order.claimKey : '749-102'} (Serial ${order ? order.serialNo : 'SRL-8849'}). Dispensed all medicines from FEFO ledger. Bill ₹${order ? order.totalBill : 1476}`,
            ip: '192.168.1.112'
        });
        renderAuditLogs();

        playAudioFx('chime');
        triggerConfetti();
        showToast(`Prescription #${rxNo} Dispensed successfully! Stock deducted & pickup confirmation SMS sent to ${order ? order.patientPhone : 'patient'}.`, 'success', 'e-Prescription Claimed');
    };

    // --------------------------------------------------------------------------
    // Doctor Lock, Sign & Medical Store Router (PHA-08)
    // --------------------------------------------------------------------------
    window.lockSignAndRoutePrescription = function() {
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const doc = MediData.currentUser;
        const targetPharmacyId = document.getElementById('emrTargetPharmacySelect') ? document.getElementById('emrTargetPharmacySelect').value : 'PHARM-01';
        const targetPharmacy = MediData.partnerPharmacies.find(ph => ph.id === targetPharmacyId) || MediData.partnerPharmacies[0];
        
        const pickupRadio = document.querySelector('input[name="emrPickupMode"]:checked');
        const pickupMode = pickupRadio ? pickupRadio.value : 'Counter Claim with Rx Key';

        const rxCount = MediData.pharmacyRxQueue.length + 1;
        const newRxNo = `RX-2026-0${Math.floor(920 + Math.random() * 80)}`;
        const newSerialNo = `SRL-8849-0${rxCount}`;
        
        // Generate a 6-digit claim key (e.g. 749-102)
        const randKey1 = Math.floor(100 + Math.random() * 900);
        const randKey2 = Math.floor(100 + Math.random() * 900);
        const newClaimKey = `${randKey1}-${randKey2}`;

        // Compute total bill
        let totalBill = 0;
        const items = state.activeEncounter.rxItems.map(item => {
            const batch = MediData.pharmacyBatches.find(b => b.medId === item.medId) || { mrpRate: 14.50, batchNo: 'GLY-26B' };
            const unitPrice = batch.mrpRate;
            totalBill += (item.qty || 30) * unitPrice;
            return {
                ...item,
                batchNo: batch.batchNo,
                unitPrice: unitPrice
            };
        });

        const newRxOrder = {
            rxNo: newRxNo,
            serialNo: newSerialNo,
            claimKey: newClaimKey,
            patientId: p.id,
            patientName: p.name,
            patientAge: p.age,
            patientGender: p.gender,
            patientPhone: p.phone,
            doctorId: doc.id,
            doctorName: doc.name,
            targetPharmacyId: targetPharmacy.id,
            targetPharmacyName: targetPharmacy.name,
            prescribedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today',
            status: "Ready for Pickup",
            pickupMode: pickupMode,
            items: items,
            totalBill: Math.round(totalBill),
            dispensedAt: null,
            dispensedBy: null
        };

        MediData.pharmacyRxQueue.unshift(newRxOrder);
        state.lastDispatchedRx = newRxOrder;

        // Render modal body
        const modalBody = document.getElementById('prescriptionDispatchModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <!-- Digital Doctor Prescription Certificate -->
                <div class="printable-document" style="border: 1px solid var(--border-subtle); border-radius: 12px; padding: 20px; background: #ffffff; color: #0f172a; margin-bottom: 20px;">
                    <div class="doc-hospital-header" style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 16px; font-weight: 800; color: #0284c7;">${MediData.tenant.name}</div>
                            <div style="font-size: 11px; color: #64748b;">${MediData.tenant.address} • Phone: ${MediData.tenant.phone}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 800; color: #0f172a;">${doc.name}</div>
                            <div style="font-size: 11px; color: #64748b;">${doc.qualification} • Reg: <b>${doc.regNo}</b></div>
                        </div>
                    </div>

                    <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; font-size: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
                        <div><b>Patient:</b> ${p.name} (${p.age} Yrs / ${p.gender})</div>
                        <div><b>MRN:</b> ${p.mrn} • ABHA: ${p.abhaId}</div>
                        <div><b>Prescription No:</b> ${newRxNo}</div>
                        <div><b>Serial Number:</b> <span style="font-family: var(--font-mono); font-weight: 800; color: #0284c7;">${newSerialNo}</span></div>
                    </div>

                    <!-- Unique Claim Key Highlight Box -->
                    <div style="background: linear-gradient(135deg, #0d9488, #0284c7); color: #ffffff; padding: 14px 18px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div>
                            <div style="font-size: 10.5px; text-transform: uppercase; font-weight: 800; opacity: 0.9;">PATIENT COUNTER CLAIM KEY (OTP)</div>
                            <div style="font-size: 26px; font-weight: 900; font-family: var(--font-mono); letter-spacing: 0.05em; margin-top: 2px;">
                                <i class="bi bi-key-fill"></i> ${newClaimKey}
                            </div>
                            <div style="font-size: 11px; opacity: 0.85;">Show this 6-digit key or serial number at the medical store to claim medicines instantly.</div>
                        </div>
                        <div style="background: #ffffff; padding: 6px; border-radius: 6px;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=MEDIOS-RX-${newClaimKey}" alt="QR" style="width: 60px; height: 60px;">
                        </div>
                    </div>

                    <!-- Destination Medical Store -->
                    <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">
                                <i class="bi bi-geo-alt-fill"></i> Routed to Medical Store:
                            </div>
                            <div style="font-weight: 800; font-size: 13.5px; color: #14532d; margin-top: 2px;">
                                ${targetPharmacy.name}
                            </div>
                            <div style="font-size: 11px; color: #15803d;">${targetPharmacy.address} • Ph: ${targetPharmacy.phone}</div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; color: #166534; background: #dcfce7; padding: 4px 8px; border-radius: 6px;">
                            ${pickupMode}
                        </span>
                    </div>

                    <table class="modern-table" style="font-size: 12px; margin-bottom: 12px;">
                        <thead>
                            <tr style="background: #f1f5f9;">
                                <th>Medicine</th>
                                <th>Dose</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Timing</th>
                                <th>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td><b>${item.brand}</b></td>
                                    <td>${item.dose}</td>
                                    <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${item.freq}</span></td>
                                    <td>${item.duration}</td>
                                    <td>${item.timing}</td>
                                    <td><b>${item.qty}</b></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Simulated WhatsApp SMS Notification Card -->
                <div style="background: #075e54; color: #ffffff; border-radius: 12px; padding: 14px 18px; box-shadow: 0 4px 14px rgba(7, 94, 84, 0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: 800; font-size: 12.5px; display: flex; align-items: center; gap: 6px;">
                            <i class="bi bi-whatsapp" style="color: #25d366; font-size: 17px;"></i> Automated WhatsApp Notification Sent to Patient
                        </div>
                        <span style="font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">Delivered to ${p.phone}</span>
                    </div>
                    <div style="background: #ffffff; color: #0f172a; padding: 12px 14px; border-radius: 8px; font-size: 12px; line-height: 1.5; position: relative;">
                        <div style="font-weight: 800; color: #075e54; margin-bottom: 4px;">Apex Healthcare • Digital e-Prescription</div>
                        <div>Dear <b>${p.name}</b>, your prescription from <b>${doc.name}</b> has been sent to <b>${targetPharmacy.name}</b>.</div>
                        <div style="margin: 8px 0; padding: 8px; background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 6px;">
                            <div>🔑 <b>Unique Claim Key:</b> <span style="font-size: 16px; font-weight: 900; color: #166534; font-family: var(--font-mono);">${newClaimKey}</span></div>
                            <div>🔖 <b>Serial Number:</b> <b>${newSerialNo}</b></div>
                            <div>📍 <b>Pickup Store:</b> ${targetPharmacy.name} (${targetPharmacy.address})</div>
                        </div>
                        <div style="font-size: 11px; color: #64748b;">Show this Key or QR code at the chemist counter to collect your medicines. Total Bill: ₹${Math.round(totalBill)}</div>
                    </div>
                </div>
            `;
        }

        document.getElementById('prescriptionDispatchModal').classList.add('active');

        // Audit Log
        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${doc.name} (EMR Cockpit)`,
            action: 'PRESCRIPTION_LOCKED_AND_ROUTED',
            entity: `Rx #${newRxNo} • Claim Key ${newClaimKey}`,
            tenant: MediData.tenant.id,
            details: `Doctor prescribed ${items.length} medicines to ${p.name}. Auto-routed to ${targetPharmacy.name} with Claim Key #${newClaimKey}. WhatsApp alert sent to ${p.phone}.`,
            ip: '192.168.1.104'
        });
        renderAuditLogs();
        renderPharmacyRxQueueTable();

        playAudioFx('chime');
        triggerConfetti();
        showToast(`Prescription Locked & Routed to ${targetPharmacy.name}! Claim Key: ${newClaimKey}`, 'success', 'e-Prescription Dispatched');
    };

    window.simulateWhatsAppRxSend = function() {
        const order = state.lastDispatchedRx || MediData.pharmacyRxQueue[0];
        playAudioFx('chime');
        showToast(`WhatsApp message with Claim Key #${order ? order.claimKey : '749-102'} re-sent to ${order ? order.patientPhone : '+91 98210 44521'}!`, 'success', 'WhatsApp Delivery');
    };

    window.openPharmacyQrScannerModal = function() {
        document.getElementById('pharmacyQrScannerModal').classList.add('active');
    };

    window.submitSimulatedQrScan = function() {
        const scannedKey = document.getElementById('simulatedScanKeyInput').value || '749-102';
        document.getElementById('pharmacyQrScannerModal').classList.remove('active');
        verifyAndClaimPrescriptionByKey(scannedKey);
    };

    window.quickDispenseBatch = function(batchId) {
        const batch = MediData.pharmacyBatches.find(b => b.id === batchId);
        if (batch) {
            batch.stockQty = Math.max(0, batch.stockQty - 10);
            renderPharmacyBatches();
            showToast(`Dispensed 10 units of ${batch.brand} (Batch ${batch.batchNo})`);
        }
    };


    window.openNewGrnModal = function() {
        document.getElementById('newGrnModal').classList.add('active');
    };

    window.submitNewGrn = function() {
        document.getElementById('newGrnModal').classList.remove('active');
        
        // Add fresh batch to stock ledger
        MediData.pharmacyBatches.unshift({
            id: `BAT-${Math.floor(10 + Math.random() * 90)}`,
            medId: "MED-005",
            brand: "Tab. Dolo 650",
            generic: "Paracetamol 650mg",
            batchNo: "DOL-26F01",
            mfgDate: "10/2026",
            expiryDate: "09/2029",
            daysToExpiry: 1080,
            stockQty: 500,
            unit: "Tablets",
            rackLocation: "Rack D-02",
            purchaseRate: 1.90,
            mrpRate: 3.20,
            supplier: "Cipla Healthcare Distribution",
            schedule: "OTC",
            status: "In Stock"
        });
        renderPharmacyBatches();
        showToast('GRN Purchase Verified! Added 500 units to stock ledger.');
    };

    // --------------------------------------------------------------------------
    // 4. PHASE 3: Pathology & Lab Active Worklist & Claim Desk (LAB-01 - 07)
    // --------------------------------------------------------------------------
    function renderLabWorklist(filteredLabId = 'all') {
        const tbody = document.getElementById('labWorklistTableBody');
        if (!tbody || !MediData.activeLabWorklist) return;

        let list = MediData.activeLabWorklist;
        if (filteredLabId && filteredLabId !== 'all') {
            list = list.filter(w => w.targetLabId === filteredLabId);
        }

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">
                        <i class="bi bi-inbox" style="font-size: 24px;"></i>
                        <div style="margin-top: 6px; font-weight: 600;">No pending diagnostic orders for this laboratory.</div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(w => {
            const isReleased = w.sampleStatus === 'Released';
            const isCollected = w.sampleStatus === 'Sample Collected' || w.sampleStatus === 'Processing';
            const tubeClass = (w.testCode === 'LAB-01' || w.testCode === 'LAB-03') ? 'tube-purple' : 'tube-red';

            return `
                <tr style="${isReleased ? 'opacity: 0.85;' : 'background: rgba(79, 70, 229, 0.02);'}">
                    <td>
                        <span style="font-family: var(--font-mono); font-weight: 800; color: var(--primary-600);">${w.serialNo || w.orderId}</span>
                        <div style="font-size: 11px; color: var(--text-muted);"><i class="bi bi-upc"></i> ${w.sampleBarcode || 'BAR-GEN'}</div>
                    </td>
                    <td>
                        <div class="rx-claim-key-pill" title="Unique Patient Claim Key" style="background: rgba(79, 70, 229, 0.12); color: var(--primary-600); font-weight: 900; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-family: var(--font-mono); border: 1px solid rgba(79, 70, 229, 0.3); display: inline-flex; align-items: center; gap: 4px;">
                            <i class="bi bi-key-fill" style="font-size: 11px;"></i> ${w.claimKey || '894-210'}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${w.patientName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${w.ageSex} • ${w.patientPhone || '+91 98210 44521'}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-heading);">${w.testName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Ordered by: ${w.orderedBy}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; font-size: 12px; color: var(--indigo-700);">${w.targetLabName || 'Apex Central Pathology Lab'}</div>
                        <div style="font-size: 10.5px; color: var(--text-muted);"><i class="bi bi-clock"></i> ${w.orderTime || 'Today'}</div>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="sample-tube-indicator ${tubeClass}"></span>
                            <span style="font-weight: 600; font-size: 12px;">${w.category}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${isReleased ? 'badge-green' : isCollected ? 'badge-blue' : 'badge-amber'}">
                            ${w.sampleStatus}
                        </span>
                        <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 2px;">${w.collectedBy || 'Pending phlebotomist'}</div>
                    </td>
                    <td>
                        <div style="font-size: 11.5px; font-weight: 600; color: ${w.verificationStatus && w.verificationStatus.includes('Verified') ? 'var(--emerald-600)' : 'var(--text-primary)'};">
                            ${w.verificationStatus || 'Awaiting Analyzer'}
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            ${isReleased ? `
                                <button class="btn btn-sm btn-primary" onclick="openOfficialLabReportModal('${w.orderId}')">
                                    <i class="bi bi-file-earmark-pdf"></i> Report PDF
                                </button>
                            ` : w.sampleStatus === 'Sample Collection Pending' || w.sampleStatus === 'Ordered' ? `
                                <button class="btn btn-sm btn-primary" onclick="openLabPhlebotomyModal('${w.orderId}')" style="font-weight: 700;">
                                    <i class="bi bi-eyedropper"></i> Collect Sample
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-teal" onclick="openLabResultEntryModal('${w.orderId}')">
                                    <i class="bi bi-pencil-square"></i> Review & Sign
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterLabOrdersByCenter = function(centerId) {
        renderLabWorklist(centerId);
    };

    window.verifyAndClaimLabOrderByKey = function(inputKey = null) {
        const rawKey = inputKey || (document.getElementById('labClaimKeySearchInput') ? document.getElementById('labClaimKeySearchInput').value : '');
        const cleanKey = (rawKey || '').replace(/[\s-]/g, '').toLowerCase().trim();

        if (!cleanKey) {
            showToast('Please enter a Claim Key, Barcode, or Phone Number.', 'warning', 'Lab Claim Key Required');
            return;
        }

        const foundOrder = MediData.activeLabWorklist.find(o => {
            const k = (o.claimKey || '').replace(/[\s-]/g, '').toLowerCase();
            const s = (o.serialNo || '').replace(/[\s-]/g, '').toLowerCase();
            const b = (o.sampleBarcode || '').replace(/[\s-]/g, '').toLowerCase();
            const r = (o.orderId || '').replace(/[\s-]/g, '').toLowerCase();
            const p = (o.patientPhone || '').replace(/[\s-]/g, '').toLowerCase();
            return k === cleanKey || s.includes(cleanKey) || b.includes(cleanKey) || r.includes(cleanKey) || p.includes(cleanKey);
        });

        if (foundOrder) {
            playAudioFx('chime');
            showToast(`Lab Claim Key Verified! Order found for ${foundOrder.patientName} (${foundOrder.testName})`, 'success', 'Lab Order Validated');
            if (foundOrder.sampleStatus === 'Released') {
                openOfficialLabReportModal(foundOrder.orderId);
            } else if (foundOrder.sampleStatus === 'Sample Collection Pending' || foundOrder.sampleStatus === 'Ordered') {
                openLabPhlebotomyModal(foundOrder.orderId);
            } else {
                openLabResultEntryModal(foundOrder.orderId);
            }
        } else {
            playAudioFx('alert');
            showToast(`No diagnostic lab order found matching "${rawKey}". Please check the 6-digit claim key on patient's WhatsApp message.`, 'error', 'Invalid Lab Key');
        }
    };

    window.openLabPhlebotomyModal = function(orderId = 'LAB-ORD-9941') {
        const order = MediData.activeLabWorklist.find(o => o.orderId === orderId) || MediData.activeLabWorklist[0];
        state.currentPhlebotomyOrderId = order ? order.orderId : orderId;

        const body = document.getElementById('labPhlebotomyModalBody');
        if (body && order) {
            body.innerHTML = `
                <div style="background: var(--bg-main); padding: 14px 18px; border-radius: var(--radius-md); border: 1.5px solid var(--border-subtle); margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-weight: 800; font-size: 15px; color: var(--text-primary);">${order.patientName} (${order.ageSex || '48Y/M'})</span>
                        <span class="rx-claim-key-pill" style="background: rgba(79,70,229,0.1); color: var(--primary-600); font-weight: 900; padding: 3px 8px; border-radius: 6px; font-family: var(--font-mono);">
                            <i class="bi bi-key-fill"></i> ${order.claimKey || '894-210'}
                        </span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary);">
                        MRN: <b>${order.mrn}</b> • Phone: <b>${order.patientPhone || '+91 98210 44521'}</b> • Ref Dr: <b>${order.orderedBy}</b>
                    </div>
                </div>

                <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; margin-bottom: 14px;">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">Investigation Ordered:</div>
                    <div style="font-weight: 800; font-size: 14px; color: var(--primary-600);">${order.testName}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Category: <b>${order.category}</b> • Target Lab: <b>${order.targetLabName}</b></div>
                </div>

                <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
                    <span class="sample-tube-indicator ${order.testCode === 'LAB-01' || order.testCode === 'LAB-03' ? 'tube-purple' : 'tube-red'}" style="width: 24px; height: 24px;"></span>
                    <div>
                        <div style="font-weight: 800; font-size: 13px; color: #831843;">Required Vacuum Specimen Tube:</div>
                        <div style="font-size: 12px; color: #9d174d;">${order.testCode === 'LAB-01' || order.testCode === 'LAB-03' ? 'EDTA K2 Vacuum Tube (Purple Cap • 3ml Whole Blood)' : 'Plain Serum Vacuum Tube (Red / Gold Gel Top • 4ml)'}</div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Phlebotomist Staff Name *</label>
                    <input type="text" id="phlebotomistNameInput" class="form-control" value="Phlebotomist Ramesh K. (DMLT)">
                </div>

                <div class="form-group">
                    <label class="form-label">Assign New Barcode Label Number</label>
                    <input type="text" id="phlebotomyBarcodeGenerated" class="form-control" value="${order.sampleBarcode || 'SAM-' + Math.floor(8800000 + Math.random()*99999)}" readonly style="font-family: var(--font-mono); font-weight: 800; color: var(--primary-600); background: var(--bg-main);">
                </div>
            `;
        }

        document.getElementById('labPhlebotomyModal').classList.add('active');
    };

    window.confirmSampleCollectionAction = function() {
        const orderId = state.currentPhlebotomyOrderId || 'LAB-ORD-9941';
        const order = MediData.activeLabWorklist.find(o => o.orderId === orderId);
        const phlebName = document.getElementById('phlebotomistNameInput') ? document.getElementById('phlebotomistNameInput').value : 'Phlebotomist Ramesh K.';
        const barcode = document.getElementById('phlebotomyBarcodeGenerated') ? document.getElementById('phlebotomyBarcodeGenerated').value : 'SAM-8849102';

        if (order) {
            order.sampleStatus = 'Processing';
            order.sampleBarcode = barcode;
            order.collectedBy = phlebName;
            order.sampleTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            order.verificationStatus = 'Sample In Analyzer (Sysmex XN-350)';
        }

        document.getElementById('labPhlebotomyModal').classList.remove('active');
        renderLabWorklist();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: phlebName,
            action: 'SAMPLE_COLLECTED_AND_BARCODED',
            entity: `Lab Order #${order ? order.orderId : 'LAB-ORD-9941'} • Claim #${order ? order.claimKey : '894-210'}`,
            tenant: MediData.tenant.id,
            details: `Validated claim key #${order ? order.claimKey : '894-210'}. Collected specimen from ${order ? order.patientName : 'patient'}. Generated barcode #${barcode} & queued to analyzer.`,
            ip: '192.168.1.118'
        });
        renderAuditLogs();

        playAudioFx('chime');
        triggerConfetti();
        showToast(`Sample Collected & Barcoded (${barcode}) for ${order ? order.patientName : 'patient'}!`, 'success', 'Phlebotomy Verified');
    };

    window.openLabQrScannerModal = function() {
        document.getElementById('labQrScannerModal').classList.add('active');
    };

    window.submitSimulatedLabQrScan = function() {
        const scannedKey = document.getElementById('simulatedLabScanKeyInput').value || '894-210';
        document.getElementById('labQrScannerModal').classList.remove('active');
        verifyAndClaimLabOrderByKey(scannedKey);
    };

    // --------------------------------------------------------------------------
    // Doctor Lock, Sign & Diagnostic Lab Router (M11)
    // --------------------------------------------------------------------------
    window.lockSignAndRouteLabOrder = function() {
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const doc = MediData.currentUser;
        const targetLabId = document.getElementById('emrTargetLabSelect') ? document.getElementById('emrTargetLabSelect').value : 'LAB-CTR-01';
        const targetLab = MediData.partnerPathologyLabs.find(l => l.id === targetLabId) || MediData.partnerPathologyLabs[0];

        const selectedTestCodes = state.activeEncounter.labOrders && state.activeEncounter.labOrders.length > 0 ? state.activeEncounter.labOrders : ['LAB-01', 'LAB-02'];
        const selectedTests = MediData.labTestsCatalogDetailed.filter(t => selectedTestCodes.includes(t.code));
        const testNamesStr = selectedTests.map(t => t.name).join(' + ') || 'HbA1c & Fasting Glucose Profile';

        const newOrderId = `LAB-ORD-${Math.floor(9945 + Math.random() * 50)}`;
        const newSerialNo = `LAB-SRL-8849-0${MediData.activeLabWorklist.length + 1}`;
        const rand1 = Math.floor(100 + Math.random() * 900);
        const rand2 = Math.floor(100 + Math.random() * 900);
        const newClaimKey = `${rand1}-${rand2}`;
        const newBarcode = `SAM-88${Math.floor(49100 + Math.random() * 800)}`;

        const newLabOrder = {
            orderId: newOrderId,
            serialNo: newSerialNo,
            claimKey: newClaimKey,
            sampleBarcode: newBarcode,
            patientId: p.id,
            patientName: p.name,
            patientPhone: p.phone,
            mrn: p.mrn,
            ageSex: `${p.age} Y / ${p.gender.charAt(0)}`,
            testCode: selectedTests[0] ? selectedTests[0].code : 'LAB-01',
            testName: testNamesStr,
            category: selectedTests[0] ? selectedTests[0].category : 'Biochemistry',
            orderedBy: doc.name,
            targetLabId: targetLab.id,
            targetLabName: targetLab.name,
            orderTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today',
            sampleStatus: "Sample Collection Pending",
            collectedBy: null,
            sampleTime: null,
            criticalAlert: false,
            resultEntered: false,
            verificationStatus: "Awaiting Phlebotomy Collection"
        };

        MediData.activeLabWorklist.unshift(newLabOrder);
        state.lastDispatchedLabOrder = newLabOrder;

        // Render Modal Body
        const modalBody = document.getElementById('labOrderDispatchModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <!-- Digital Lab Requisition Certificate -->
                <div class="printable-document" style="border: 1px solid var(--border-subtle); border-radius: 12px; padding: 20px; background: #ffffff; color: #0f172a; margin-bottom: 20px;">
                    <div class="doc-hospital-header" style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 16px; font-weight: 800; color: #4338ca;">${MediData.tenant.name} — Laboratory Requisition</div>
                            <div style="font-size: 11px; color: #64748b;">${MediData.tenant.address} • Phone: ${MediData.tenant.phone}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 800; color: #0f172a;">${doc.name}</div>
                            <div style="font-size: 11px; color: #64748b;">${doc.qualification} • Reg: <b>${doc.regNo}</b></div>
                        </div>
                    </div>

                    <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; font-size: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
                        <div><b>Patient:</b> ${p.name} (${p.age} Yrs / ${p.gender})</div>
                        <div><b>MRN:</b> ${p.mrn} • ABHA: ${p.abhaId}</div>
                        <div><b>Lab Order ID:</b> ${newOrderId}</div>
                        <div><b>Serial Number:</b> <span style="font-family: var(--font-mono); font-weight: 800; color: #4338ca;">${newSerialNo}</span></div>
                    </div>

                    <!-- Unique Claim Key Highlight Box -->
                    <div style="background: linear-gradient(135deg, #4338ca, #3b82f6); color: #ffffff; padding: 14px 18px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div>
                            <div style="font-size: 10.5px; text-transform: uppercase; font-weight: 800; opacity: 0.9;">PATIENT LAB CLAIM KEY (OTP)</div>
                            <div style="font-size: 26px; font-weight: 900; font-family: var(--font-mono); letter-spacing: 0.05em; margin-top: 2px;">
                                <i class="bi bi-key-fill"></i> ${newClaimKey}
                            </div>
                            <div style="font-size: 11px; opacity: 0.85;">Show this 6-digit key or serial number at the diagnostic lab for instant sample collection.</div>
                        </div>
                        <div style="background: #ffffff; padding: 6px; border-radius: 6px;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=MEDIOS-LAB-${newClaimKey}" alt="QR" style="width: 60px; height: 60px;">
                        </div>
                    </div>

                    <!-- Destination Diagnostic Lab -->
                    <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase;">
                                <i class="bi bi-geo-alt-fill"></i> Routed to Diagnostic Lab:
                            </div>
                            <div style="font-weight: 800; font-size: 13.5px; color: #1e3a8a; margin-top: 2px;">
                                ${targetLab.name}
                            </div>
                            <div style="font-size: 11px; color: #2563eb;">${targetLab.address} • Ph: ${targetLab.phone}</div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; color: #1e40af; background: #dbeafe; padding: 4px 8px; border-radius: 6px;">
                            ${targetLab.nablCert || 'NABL Accredited'}
                        </span>
                    </div>

                    <table class="modern-table" style="font-size: 12px; margin-bottom: 12px;">
                        <thead>
                            <tr style="background: #f1f5f9;">
                                <th>Test Code</th>
                                <th>Investigation Name</th>
                                <th>Department</th>
                                <th>Specimen Type</th>
                                <th>Price (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selectedTests.map(t => `
                                <tr>
                                    <td><span style="font-family: var(--font-mono); font-weight: 700; color: #4338ca;">${t.code}</span></td>
                                    <td><b>${t.name}</b></td>
                                    <td>${t.category}</td>
                                    <td>${t.sampleType}</td>
                                    <td><b>₹ ${t.price}</b></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Simulated WhatsApp SMS Notification Card -->
                <div style="background: #075e54; color: #ffffff; border-radius: 12px; padding: 14px 18px; box-shadow: 0 4px 14px rgba(7, 94, 84, 0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: 800; font-size: 12.5px; display: flex; align-items: center; gap: 6px;">
                            <i class="bi bi-whatsapp" style="color: #25d366; font-size: 17px;"></i> Automated WhatsApp Notification Sent to Patient
                        </div>
                        <span style="font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">Delivered to ${p.phone}</span>
                    </div>
                    <div style="background: #ffffff; color: #0f172a; padding: 12px 14px; border-radius: 8px; font-size: 12px; line-height: 1.5; position: relative;">
                        <div style="font-weight: 800; color: #075e54; margin-bottom: 4px;">Apex Healthcare • Diagnostic Lab Test Order</div>
                        <div>Dear <b>${p.name}</b>, your diagnostic test order (<b>${testNamesStr}</b>) from <b>${doc.name}</b> has been registered.</div>
                        <div style="margin: 8px 0; padding: 8px; background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 6px;">
                            <div>🔑 <b>Unique Claim Key:</b> <span style="font-size: 16px; font-weight: 900; color: #166534; font-family: var(--font-mono);">${newClaimKey}</span></div>
                            <div>🔖 <b>Serial Number:</b> <b>${newSerialNo}</b></div>
                            <div>📍 <b>Collection Center:</b> ${targetLab.name} (${targetLab.address})</div>
                            <div>⚠️ <b>Preparation Note:</b> 8-10 Hours overnight fasting required for fasting glucose/lipid tests.</div>
                        </div>
                        <div style="font-size: 11px; color: #64748b;">Show this Key or QR code to the phlebotomist at the lab counter to provide your blood sample.</div>
                    </div>
                </div>
            `;
        }

        document.getElementById('labOrderDispatchModal').classList.add('active');

        // Audit Log
        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${doc.name} (EMR Cockpit)`,
            action: 'LAB_ORDER_LOCKED_AND_ROUTED',
            entity: `Lab #${newOrderId} • Claim Key ${newClaimKey}`,
            tenant: MediData.tenant.id,
            details: `Doctor ordered ${selectedTests.length} tests (${testNamesStr}) for ${p.name}. Routed to ${targetLab.name} with Claim Key #${newClaimKey}. WhatsApp alert dispatched.`,
            ip: '192.168.1.104'
        });
        renderAuditLogs();
        renderLabWorklist();

        playAudioFx('chime');
        triggerConfetti();
        showToast(`Lab Order Locked & Routed to ${targetLab.name}! Claim Key: ${newClaimKey}`, 'success', 'Lab Order Dispatched');
    };

    window.simulateWhatsAppLabSend = function() {
        const order = state.lastDispatchedLabOrder || MediData.activeLabWorklist[0];
        playAudioFx('chime');
        showToast(`WhatsApp message with Lab Claim Key #${order ? order.claimKey : '894-210'} re-sent to ${order ? order.patientPhone : '+91 98210 44521'}!`, 'success', 'WhatsApp Delivery');
    };

    // --------------------------------------------------------------------------
    // 5. PHASE 3: Radiology & X-Ray Imaging Suite (M12, RAD-01 - 06)
    // --------------------------------------------------------------------------
    function renderRadiologyWorklist(filteredCenterId = 'all') {
        const tbody = document.getElementById('radiologyWorklistTableBody');
        if (!tbody || !MediData.radiologyWorklist) return;

        let list = MediData.radiologyWorklist;
        if (filteredCenterId && filteredCenterId !== 'all') {
            list = list.filter(r => r.targetCenterId === filteredCenterId);
        }

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">
                        <i class="bi bi-inbox" style="font-size: 24px;"></i>
                        <div style="margin-top: 6px; font-weight: 600;">No pending radiology scan orders for this imaging centre.</div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(r => {
            const isReleased = r.scanStatus && r.scanStatus.includes('Released');
            const isCompleted = r.scanStatus && r.scanStatus.includes('Completed');

            return `
                <tr style="${isReleased ? 'opacity: 0.85;' : 'background: rgba(2, 132, 199, 0.02);'}">
                    <td>
                        <span style="font-family: var(--font-mono); font-weight: 800; color: #0284c7;">${r.serialNo || r.orderId}</span>
                        <div style="font-size: 11px; color: var(--text-muted);">${r.orderId} • ${r.orderTime || 'Today'}</div>
                    </td>
                    <td>
                        <div class="rx-claim-key-pill" title="Unique Patient Claim Key" style="background: rgba(2, 132, 199, 0.12); color: #0284c7; font-weight: 900; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-family: var(--font-mono); border: 1px solid rgba(2, 132, 199, 0.3); display: inline-flex; align-items: center; gap: 4px;">
                            <i class="bi bi-key-fill" style="font-size: 11px;"></i> ${r.claimKey || '412-880'}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${r.patientName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${r.ageSex} • ${r.patientPhone || '+91 98210 44521'}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-heading);">${r.scanName}</div>
                        <span class="badge badge-purple" style="font-size: 10px;">${r.modality} (${r.bodyPart})</span>
                    </td>
                    <td>
                        <div style="font-weight: 700; font-size: 12px; color: #0369a1;">${r.targetCenterName || 'Apex Central Digital X-Ray Suite'}</div>
                        <div style="font-size: 10.5px; color: var(--text-muted);"><i class="bi bi-person-badge"></i> ${r.radiologistName}</div>
                    </td>
                    <td>
                        <div style="font-size: 11.5px; color: var(--text-secondary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${r.clinicalIndication}">
                            ${r.clinicalIndication || 'Clinical investigation'}
                        </div>
                    </td>
                    <td>
                        <span class="badge ${isReleased ? 'badge-green' : isCompleted ? 'badge-blue' : 'badge-amber'}">
                            ${r.scanStatus}
                        </span>
                    </td>
                    <td>
                        <div style="font-weight: 900; font-size: 13px; color: var(--text-primary);">₹ ${(r.price || 600).toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-sm btn-primary" style="background: #0284c7; border-color: #0284c7; font-weight: 700;" onclick="openRadiologyViewerModal('${r.orderId}')">
                                <i class="bi bi-film"></i> ${isReleased ? 'View Film & Report' : 'Open DICOM & Sign'}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterRadiologyOrdersByCenter = function(centerId) {
        renderRadiologyWorklist(centerId);
    };

    window.verifyAndClaimRadiologyOrderByKey = function(inputKey = null) {
        const rawKey = inputKey || (document.getElementById('radiologyClaimKeySearchInput') ? document.getElementById('radiologyClaimKeySearchInput').value : '');
        const cleanKey = (rawKey || '').replace(/[\s-]/g, '').toLowerCase().trim();

        if (!cleanKey) {
            showToast('Please enter a Claim Key, Serial Number, or Phone Number.', 'warning', 'Radiology Key Required');
            return;
        }

        const foundOrder = MediData.radiologyWorklist.find(o => {
            const k = (o.claimKey || '').replace(/[\s-]/g, '').toLowerCase();
            const s = (o.serialNo || '').replace(/[\s-]/g, '').toLowerCase();
            const r = (o.orderId || '').replace(/[\s-]/g, '').toLowerCase();
            const p = (o.patientPhone || '').replace(/[\s-]/g, '').toLowerCase();
            return k === cleanKey || s.includes(cleanKey) || r.includes(cleanKey) || p.includes(cleanKey);
        });

        if (foundOrder) {
            playAudioFx('chime');
            showToast(`Radiology Claim Key Verified! Opening DICOM film for ${foundOrder.patientName}...`, 'success', 'Radiology Order Validated');
            openRadiologyViewerModal(foundOrder.orderId);
        } else {
            playAudioFx('alert');
            showToast(`No radiology imaging order found matching "${rawKey}". Please check the 6-digit claim key on patient's WhatsApp message.`, 'error', 'Invalid Radiology Key');
        }
    };

    window.openRadiologyViewerModal = function(orderId = 'RAD-ORD-8812') {
        const order = MediData.radiologyWorklist.find(r => r.orderId === orderId) || MediData.radiologyWorklist[0];
        state.currentViewingRadiologyOrderId = order ? order.orderId : orderId;

        const modal = document.getElementById('radiologyViewerModal');
        const body = document.getElementById('radiologyViewerModalBody');
        const title = document.getElementById('dicomViewerModalTitle');
        const releaseBtn = document.getElementById('releaseRadiologyReportActionBtn');

        if (title && order) {
            title.innerHTML = `DICOM 3.0 Film Review — ${order.scanName} (${order.patientName})`;
        }

        if (releaseBtn && order) {
            const isReleased = order.scanStatus && order.scanStatus.includes('Released');
            releaseBtn.innerHTML = isReleased 
                ? `<i class="bi bi-printer-fill"></i> Print AERB Report PDF`
                : `<i class="bi bi-file-earmark-check-fill"></i> Sign & Release Official Report`;
            releaseBtn.onclick = isReleased ? () => window.print() : () => verifyAndReleaseRadiologyReport(order.orderId);
        }

        if (body && order) {
            body.innerHTML = `
                <!-- Top DICOM Metadata Bar -->
                <div style="background: #0f172a; padding: 12px 16px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 12px;">
                    <div>
                        <div style="font-weight: 800; font-size: 14px; color: #38bdf8;">${order.patientName} <span style="color: #94a3b8; font-size: 12px;">(${order.ageSex})</span></div>
                        <div style="color: #94a3b8; margin-top: 2px;">MRN: <b>${order.mrn}</b> • Modality: <b>${order.modality}</b> • Region: <b>${order.bodyPart}</b></div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-family: var(--font-mono); color: #38bdf8; font-weight: 900; font-size: 15px;">
                            <i class="bi bi-key-fill"></i> ${order.claimKey}
                        </div>
                        <div style="color: #94a3b8; font-size: 11px;">Serial: <b>${order.serialNo}</b> • Ordered by: <b>${order.orderedBy}</b></div>
                    </div>
                </div>

                <div class="grid-2-col" style="grid-template-columns: 1.1fr 1fr; gap: 20px;">
                    <!-- Left: High-Contrast Realistic DICOM Film Viewer -->
                    <div style="background: #000000; border: 2px solid #1e293b; border-radius: 10px; padding: 14px; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 100%; display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; color: #38bdf8; margin-bottom: 8px;">
                            <span>Apex Digital X-Ray Hub</span>
                            <span>kVp: 70 | mA: 200 | Exp: 0.08s</span>
                            <span>PA VIEW (L)</span>
                        </div>

                        <!-- Film Image Container with Zoom / Invert Simulation -->
                        <div id="dicomImageWrapper" style="position: relative; width: 100%; height: 380px; display: flex; justify-content: center; align-items: center; background: #000000; overflow: hidden; border-radius: 6px;">
                            <img id="dicomActiveFilmImg" src="${order.scanImageUrl}" alt="DICOM Film" style="max-height: 100%; max-width: 100%; object-fit: contain; filter: grayscale(100%) contrast(150%) brightness(95%); transition: all 0.3s ease;">
                            
                            <!-- Film Scale Markings -->
                            <div style="position: absolute; right: 8px; top: 10px; bottom: 10px; width: 6px; border-right: 2px dashed rgba(255,255,255,0.3);"></div>
                            <div style="position: absolute; left: 10px; bottom: 10px; color: #ffffff; font-size: 18px; font-weight: 900; font-family: var(--font-mono); opacity: 0.7;">R</div>
                        </div>

                        <!-- DICOM Toolbar Simulation -->
                        <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; width: 100%; justify-content: center;">
                            <button class="btn btn-xs btn-outline" style="border-color: #334155; color: #94a3b8;" onclick="document.getElementById('dicomActiveFilmImg').style.filter = 'grayscale(100%) invert(100%) contrast(150%)'; showToast('Inverted Film Contrast (Bone Window)');">
                                <i class="bi bi-circle-half"></i> Invert Film
                            </button>
                            <button class="btn btn-xs btn-outline" style="border-color: #334155; color: #94a3b8;" onclick="document.getElementById('dicomActiveFilmImg').style.filter = 'grayscale(100%) contrast(150%) brightness(95%)'; showToast('Reset Standard Film Window');">
                                <i class="bi bi-arrow-counterclockwise"></i> Reset View
                            </button>
                            <button class="btn btn-xs btn-outline" style="border-color: #334155; color: #94a3b8;" onclick="showToast('Zoom & Pan Calibration: 1.0x (Optimal Scale)')">
                                <i class="bi bi-zoom-in"></i> 100% Zoom
                            </button>
                            <button class="btn btn-xs btn-outline" style="border-color: #334155; color: #94a3b8;" onclick="showToast('Measuring Caliper: Cardiothoracic Ratio = 0.44 (Normal < 0.50)')">
                                <i class="bi bi-rulers"></i> Measure CTR
                            </button>
                        </div>
                    </div>

                    <!-- Right: Radiologist Clinical Findings & Impression Report Editor -->
                    <div style="display: flex; flex-direction: column; gap: 12px; background: #0b1329; padding: 16px; border-radius: 10px; border: 1px solid #1e293b;">
                        <div>
                            <label class="form-label" style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 700;">Clinical Indication & History:</label>
                            <div style="color: #e2e8f0; font-size: 12.5px; font-weight: 600; background: #0f172a; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e293b;">
                                ${order.clinicalIndication || 'Persistent cough, rule out lower respiratory pathology.'}
                            </div>
                        </div>

                        <div>
                            <label class="form-label" style="color: #38bdf8; font-size: 11px; text-transform: uppercase; font-weight: 700;">Radiological Findings / Description:</label>
                            <textarea id="radiologyFindingsInput" class="form-control" rows="4" style="background: #020617; color: #f8fafc; border-color: #334155; font-size: 12px; line-height: 1.5;">${order.findings}</textarea>
                        </div>

                        <div>
                            <label class="form-label" style="color: #10b981; font-size: 11px; text-transform: uppercase; font-weight: 700;">Radiologist Impression / Conclusion:</label>
                            <textarea id="radiologyImpressionInput" class="form-control" rows="2" style="background: #020617; color: #f8fafc; border-color: #334155; font-size: 12.5px; font-weight: 700;">${order.impression}</textarea>
                        </div>

                        <div style="background: #0f172a; padding: 12px; border-radius: 6px; border: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                            <div>
                                <div style="font-weight: 800; font-size: 13px; color: #38bdf8;">${order.radiologistName}</div>
                                <div style="font-size: 10.5px; color: #94a3b8;">MD Radiology • AERB Reg #9912</div>
                            </div>
                            <span class="badge ${order.scanStatus && order.scanStatus.includes('Released') ? 'badge-green' : 'badge-amber'}" style="font-size: 11px;">
                                ${order.scanStatus && order.scanStatus.includes('Released') ? '<i class="bi bi-shield-check"></i> Verified & Released' : '<i class="bi bi-clock-history"></i> Ready for Sign-Off'}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        modal.classList.add('active');
    };

    window.verifyAndReleaseRadiologyReport = function(orderId = null) {
        const activeId = orderId || state.currentViewingRadiologyOrderId || 'RAD-ORD-8812';
        const order = MediData.radiologyWorklist.find(r => r.orderId === activeId);

        if (order) {
            const findingsInput = document.getElementById('radiologyFindingsInput');
            const impressionInput = document.getElementById('radiologyImpressionInput');
            if (findingsInput) order.findings = findingsInput.value;
            if (impressionInput) order.impression = impressionInput.value;

            order.scanStatus = 'Verified & Released by Dr. Hemant Joshi';
        }

        document.getElementById('radiologyViewerModal').classList.remove('active');
        renderRadiologyWorklist();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `Dr. Hemant Joshi (Chief Radiologist)`,
            action: 'RADIOLOGY_REPORT_AUTHORIZED_RELEASED',
            entity: `Scan #${order ? order.orderId : 'RAD-ORD-8812'} • Claim #${order ? order.claimKey : '412-880'}`,
            tenant: MediData.tenant.id,
            details: `Digitally reviewed DICOM film and authorized AERB diagnostic imaging report for ${order ? order.patientName : 'patient'} (${order ? order.scanName : 'X-Ray'}). Report pushed to patient portal.`,
            ip: '192.168.1.110'
        });
        renderAuditLogs();

        playAudioFx('success');
        triggerConfetti();
        showToast(`Radiology Report #${activeId} Authorized & Released by Chief Radiologist!`, 'success', 'AERB Imaging Report Released');
    };

    // --------------------------------------------------------------------------
    // Doctor Lock, Sign & Radiology Centre Router (M12)
    // --------------------------------------------------------------------------
    window.lockSignAndRouteRadiologyOrder = function() {
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const doc = MediData.currentUser;
        const targetRadId = document.getElementById('emrTargetRadiologySelect') ? document.getElementById('emrTargetRadiologySelect').value : 'RAD-CTR-01';
        const targetRadCenter = MediData.partnerRadiologyCenters.find(r => r.id === targetRadId) || MediData.partnerRadiologyCenters[0];

        const selectedRadCodes = state.activeEncounter.radiologyOrders && state.activeEncounter.radiologyOrders.length > 0 ? state.activeEncounter.radiologyOrders : ['RAD-01'];
        const selectedScan = MediData.radiologyCatalogDetailed.find(r => r.code === selectedRadCodes[0]) || MediData.radiologyCatalogDetailed[0];

        const newOrderId = `RAD-ORD-${Math.floor(8820 + Math.random() * 50)}`;
        const newSerialNo = `RAD-SRL-2026-0${MediData.radiologyWorklist.length + 1}`;
        const rand1 = Math.floor(100 + Math.random() * 900);
        const rand2 = Math.floor(100 + Math.random() * 900);
        const newClaimKey = `${rand1}-${rand2}`;

        const newRadiologyOrder = {
            orderId: newOrderId,
            serialNo: newSerialNo,
            claimKey: newClaimKey,
            patientId: p.id,
            patientName: p.name,
            patientPhone: p.phone,
            mrn: p.mrn,
            ageSex: `${p.age} Y / ${p.gender.charAt(0)}`,
            modality: selectedScan.modality,
            scanCode: selectedScan.code,
            scanName: selectedScan.name,
            bodyPart: selectedScan.bodyPart,
            clinicalIndication: "Doctor Consultation: Clinical evaluation & diagnostic imaging protocol.",
            orderedBy: doc.name,
            targetCenterId: targetRadCenter.id,
            targetCenterName: targetRadCenter.name,
            orderTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today',
            scanStatus: "Scheduled / Ready for Scan",
            radiologistName: targetRadCenter.radiologist,
            scanImageUrl: selectedScan.sampleImageUrl,
            findings: "Bilateral lung fields clear. Normal bronchovascular markings. Normal cardiac contour.",
            impression: "NORMAL RADIOLOGICAL STUDY. No focal acute lesions identified.",
            price: selectedScan.price
        };

        MediData.radiologyWorklist.unshift(newRadiologyOrder);
        state.lastDispatchedRadiologyOrder = newRadiologyOrder;

        // Render Modal Body
        const modalBody = document.getElementById('radiologyDispatchModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <!-- Digital Radiology Requisition Certificate -->
                <div class="printable-document" style="border: 1px solid var(--border-subtle); border-radius: 12px; padding: 20px; background: #ffffff; color: #0f172a; margin-bottom: 20px;">
                    <div class="doc-hospital-header" style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 16px; font-weight: 800; color: #0284c7;">${MediData.tenant.name} — Radiology & Imaging Requisition</div>
                            <div style="font-size: 11px; color: #64748b;">${MediData.tenant.address} • Phone: ${MediData.tenant.phone}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 800; color: #0f172a;">${doc.name}</div>
                            <div style="font-size: 11px; color: #64748b;">${doc.qualification} • Reg: <b>${doc.regNo}</b></div>
                        </div>
                    </div>

                    <div style="background: #f8fafc; padding: 10px 14px; border-radius: 6px; font-size: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
                        <div><b>Patient:</b> ${p.name} (${p.age} Yrs / ${p.gender})</div>
                        <div><b>MRN:</b> ${p.mrn} • ABHA: ${p.abhaId}</div>
                        <div><b>Scan Order ID:</b> ${newOrderId}</div>
                        <div><b>Serial Number:</b> <span style="font-family: var(--font-mono); font-weight: 800; color: #0284c7;">${newSerialNo}</span></div>
                    </div>

                    <!-- Unique Claim Key Highlight Box -->
                    <div style="background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; padding: 14px 18px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div>
                            <div style="font-size: 10.5px; text-transform: uppercase; font-weight: 800; opacity: 0.9;">PATIENT RADIOLOGY CLAIM KEY (OTP)</div>
                            <div style="font-size: 26px; font-weight: 900; font-family: var(--font-mono); letter-spacing: 0.05em; margin-top: 2px;">
                                <i class="bi bi-key-fill"></i> ${newClaimKey}
                            </div>
                            <div style="font-size: 11px; opacity: 0.85;">Show this 6-digit key or serial number at the scan counter to undergo your imaging test instantly.</div>
                        </div>
                        <div style="background: #ffffff; padding: 6px; border-radius: 6px;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=MEDIOS-RAD-${newClaimKey}" alt="QR" style="width: 60px; height: 60px;">
                        </div>
                    </div>

                    <!-- Destination Imaging Centre -->
                    <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #0369a1; text-transform: uppercase;">
                                <i class="bi bi-geo-alt-fill"></i> Routed to Imaging Scan Centre:
                            </div>
                            <div style="font-weight: 800; font-size: 13.5px; color: #0c4a6e; margin-top: 2px;">
                                ${targetRadCenter.name}
                            </div>
                            <div style="font-size: 11px; color: #0284c7;">${targetRadCenter.address} • Ph: ${targetRadCenter.phone}</div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; color: #0369a1; background: #e0f2fe; padding: 4px 8px; border-radius: 6px;">
                            ${targetRadCenter.aerbCert || 'AERB Certified'}
                        </span>
                    </div>

                    <table class="modern-table" style="font-size: 12px; margin-bottom: 12px;">
                        <thead>
                            <tr style="background: #f1f5f9;">
                                <th>Modality</th>
                                <th>Scan Description</th>
                                <th>Body Region</th>
                                <th>Scan Prep Instructions</th>
                                <th>Price (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="badge badge-purple" style="font-weight: 700;">${selectedScan.modality}</span></td>
                                <td><b>${selectedScan.name}</b></td>
                                <td>${selectedScan.bodyPart}</td>
                                <td style="color: #475569; font-size: 11.5px;">${selectedScan.prepInstructions || 'Remove metal ornaments.'}</td>
                                <td><b>₹ ${selectedScan.price}</b></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Simulated WhatsApp SMS Notification Card -->
                <div style="background: #075e54; color: #ffffff; border-radius: 12px; padding: 14px 18px; box-shadow: 0 4px 14px rgba(7, 94, 84, 0.25);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: 800; font-size: 12.5px; display: flex; align-items: center; gap: 6px;">
                            <i class="bi bi-whatsapp" style="color: #25d366; font-size: 17px;"></i> Automated WhatsApp Notification Sent to Patient
                        </div>
                        <span style="font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">Delivered to ${p.phone}</span>
                    </div>
                    <div style="background: #ffffff; color: #0f172a; padding: 12px 14px; border-radius: 8px; font-size: 12px; line-height: 1.5; position: relative;">
                        <div style="font-weight: 800; color: #075e54; margin-bottom: 4px;">Apex Healthcare • Radiology & Imaging Order</div>
                        <div>Dear <b>${p.name}</b>, your scan appointment for <b>${selectedScan.name}</b> has been booked by <b>${doc.name}</b>.</div>
                        <div style="margin: 8px 0; padding: 8px; background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 6px;">
                            <div>🔑 <b>Unique Claim Key:</b> <span style="font-size: 16px; font-weight: 900; color: #166534; font-family: var(--font-mono);">${newClaimKey}</span></div>
                            <div>🔖 <b>Serial Number:</b> <b>${newSerialNo}</b></div>
                            <div>📍 <b>Scan Center:</b> ${targetRadCenter.name} (${targetRadCenter.address})</div>
                            <div>⚠️ <b>Scan Preparation:</b> ${selectedScan.prepInstructions || 'Please arrive 15 minutes before slot with previous reports.'}</div>
                        </div>
                        <div style="font-size: 11px; color: #64748b;">Show this Key or QR code at the radiology reception desk to claim your scan slot immediately. Total Charge: ₹${selectedScan.price}</div>
                    </div>
                </div>
            `;
        }

        document.getElementById('radiologyDispatchModal').classList.add('active');

        // Audit Log
        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${doc.name} (EMR Cockpit)`,
            action: 'RADIOLOGY_ORDER_LOCKED_AND_ROUTED',
            entity: `Scan #${newOrderId} • Claim Key ${newClaimKey}`,
            tenant: MediData.tenant.id,
            details: `Doctor prescribed ${selectedScan.name} to ${p.name}. Auto-routed to ${targetRadCenter.name} with Claim Key #${newClaimKey}. WhatsApp alert dispatched to ${p.phone}.`,
            ip: '192.168.1.104'
        });
        renderAuditLogs();
        renderRadiologyWorklist();

        playAudioFx('chime');
        triggerConfetti();
        showToast(`Radiology Order Locked & Routed to ${targetRadCenter.name}! Claim Key: ${newClaimKey}`, 'success', 'Radiology Order Dispatched');
    };

    window.simulateWhatsAppRadiologySend = function() {
        const order = state.lastDispatchedRadiologyOrder || MediData.radiologyWorklist[0];
        playAudioFx('chime');
        showToast(`WhatsApp message with Radiology Claim Key #${order ? order.claimKey : '412-880'} re-sent to ${order ? order.patientPhone : '+91 98210 44521'}!`, 'success', 'WhatsApp Delivery');
    };

    window.openRadiologyQrScannerModal = function() {
        document.getElementById('radiologyQrScannerModal').classList.add('active');
    };

    window.submitSimulatedRadiologyQrScan = function() {
        const scannedKey = document.getElementById('simulatedRadiologyScanKeyInput').value || '412-880';
        document.getElementById('radiologyQrScannerModal').classList.remove('active');
        verifyAndClaimRadiologyOrderByKey(scannedKey);
    };

    window.openLabResultEntryModal = function(orderId) {
        document.getElementById('labResultEntryModal').classList.add('active');
    };

    window.verifyAndReleaseLabReport = function(orderId) {
        const order = MediData.activeLabWorklist.find(o => o.orderId === orderId);
        if (order) {
            order.sampleStatus = 'Released';
            order.verificationStatus = `Verified & Released by ${MediData.pathologist.name}`;
            renderLabWorklist();
            document.getElementById('labResultEntryModal').classList.remove('active');

            MediData.auditLogs.unshift({
                id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                actor: `${MediData.pathologist.name} (Chief Pathologist)`,
                action: 'LAB_REPORT_VERIFIED_RELEASED',
                entity: `Lab Order #${order.orderId}`,
                tenant: MediData.tenant.id,
                details: `Digitally authorized NABL lab report for ${order.patientName} (${order.testName}). Critical flag verified.`,
                ip: '192.168.1.109'
            });
            renderAuditLogs();

            playAudioFx('success');
            triggerConfetti();
            showToast(`Lab Report ${order.orderId} Authorized & Released by Pathologist!`, 'success', 'NABL Lab Report Released');
        }
    };

    window.openOfficialLabReportModal = function(orderId) {
        const modal = document.getElementById('officialLabReportModal');
        const content = document.getElementById('printableLabReportContent');
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        if (modal && content) {
            content.innerHTML = `
                <div class="lab-report-document">
                    <div class="lab-nabl-header">
                        <div>
                            <div style="font-size: 20px; font-weight: 800; color: #0284c7;">${MediData.tenant.name} — Pathology Labs</div>
                            <div style="font-size: 11.5px; color: #475569;">NABL Accredited Medical Diagnostic Laboratory • ISO 15189:2022 Certified</div>
                            <div style="font-size: 11.5px; color: #475569;">${MediData.tenant.address} • Phone: ${MediData.tenant.phone}</div>
                        </div>
                        <div class="lab-nabl-badge">
                            <div style="font-weight: 800; color: #0284c7; font-size: 13px;"><i class="bi bi-patch-check-fill"></i> NABL ACCREDITED</div>
                            <div style="font-size: 10px; color: #64748b;">Cert No: MC-4912</div>
                        </div>
                    </div>

                    <div class="doc-patient-bar">
                        <div><b>Patient:</b> ${p.name}</div>
                        <div><b>Age/Sex:</b> ${p.age} Y / ${p.gender}</div>
                        <div><b>MRN:</b> ${p.mrn}</div>
                        <div><b>Sample Barcode:</b> <span style="font-family: var(--font-mono);">SAM-8849102</span></div>
                        <div><b>Ref Doctor:</b> ${MediData.currentUser.name}</div>
                        <div><b>Sample Collected:</b> ${dateStr} 09:55 AM</div>
                        <div><b>Report Released:</b> ${dateStr} 10:45 AM</div>
                        <div><b>ABHA ID:</b> ${p.abhaId}</div>
                    </div>

                    <h3 style="font-size: 15px; font-weight: 800; color: #0284c7; margin-bottom: 12px; border-bottom: 2px solid #0284c7; padding-bottom: 4px;">
                        DEPARTMENT OF BIOCHEMISTRY & CLINICAL PATHOLOGY
                    </h3>

                    <table class="modern-table" style="margin-bottom: 24px;">
                        <thead>
                            <tr style="background: #f1f5f9;">
                                <th>Test Parameter</th>
                                <th>Observed Value</th>
                                <th>Units</th>
                                <th>Biological Reference Interval</th>
                                <th>Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>HbA1c (Glycosylated Hemoglobin)</b></td>
                                <td><b style="color: #e11d48; font-size: 14px;">7.8 *</b> <span class="result-flag-high">HIGH</span></td>
                                <td>%</td>
                                <td>4.0 - 5.6 (Normal)<br>5.7 - 6.4 (Prediabetes)<br>&gt;= 6.5 (Diabetes Mellitus)</td>
                                <td>HPLC (Bio-Rad D-10)</td>
                            </tr>
                            <tr>
                                <td><b>Estimated Average Glucose (eAG)</b></td>
                                <td><b style="color: #e11d48; font-size: 14px;">177 *</b> <span class="result-flag-high">HIGH</span></td>
                                <td>mg/dL</td>
                                <td>70 - 115</td>
                                <td>Calculated</td>
                            </tr>
                            <tr>
                                <td><b>Fasting Plasma Glucose (FBS)</b></td>
                                <td><b style="color: #e11d48; font-size: 14px;">148 *</b> <span class="result-flag-high">HIGH</span></td>
                                <td>mg/dL</td>
                                <td>70 - 99 (Normal)<br>100 - 125 (Impaired)<br>&gt;= 126 (Diabetic)</td>
                                <td>GOD-POD</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; margin-bottom: 24px;">
                        <b>Pathologist Clinical Interpretation:</b>
                        <div style="color: #1e293b; margin-top: 4px;">HbA1c of 7.8% is suggestive of uncontrolled Diabetes Mellitus. Correlate clinically with lipid profile and microalbuminuria screening.</div>
                    </div>

                    <div class="doc-signature-block">
                        <div>
                            <div style="font-size: 11px; font-weight: 700;">Ramesh K. (DMLT)</div>
                            <div style="font-size: 10px; color: #64748b;">Medical Lab Technologist</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #059669; font-weight: 700; font-size: 11.5px; margin-bottom: 4px;"><i class="bi bi-shield-check"></i> DIGITALLY SIGNED & VERIFIED</div>
                            <div class="doc-signature-line">
                                <b>${MediData.pathologist.name}</b><br>
                                <span style="font-size: 10px; font-weight: normal; color: #64748b;">${MediData.pathologist.qualification} • ${MediData.pathologist.regNo}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            modal.classList.add('active');
        }
    };

    // --------------------------------------------------------------------------
    // 6. PHASE 3: Doctor Revenue Share Statements (OPS-01)
    // --------------------------------------------------------------------------
    function renderDoctorPayouts() {
        const tbody = document.getElementById('doctorPayoutsTableBody');
        if (!tbody) return;

        tbody.innerHTML = MediData.doctors.map(d => {
            const gross = d.monthConsultCount * d.consultFee;
            const doctorShare = (gross * d.revenueSharePercent) / 100;
            const hospitalShare = gross - doctorShare;

            return `
                <tr>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${d.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${d.specialty} • Fee: ₹${d.consultFee}</div>
                    </td>
                    <td><b>${d.monthConsultCount}</b> Patients</td>
                    <td><b>₹${gross.toLocaleString('en-IN')}</b></td>
                    <td><span class="badge badge-purple">${d.revenueSharePercent}% Share</span></td>
                    <td style="font-weight: 800; color: var(--primary-600); font-size: 14px;">₹${doctorShare.toLocaleString('en-IN')}</td>
                    <td style="font-weight: 700; color: var(--emerald-600);">₹${hospitalShare.toLocaleString('en-IN')}</td>
                    <td><span class="badge badge-green">Ready for Payout</span></td>
                </tr>
            `;
        }).join('');
    }

    // --------------------------------------------------------------------------
    // 6. Clinical Drug Interaction Alert Override (CLN-01)
    // --------------------------------------------------------------------------
    window.overrideClinicalSafetyAlert = function() {
        const banner = document.getElementById('emrDrugSafetyBanner');
        if (banner) banner.style.display = 'none';

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${MediData.currentUser.name} (DOC-01)`,
            action: 'CLINICAL_SAFETY_OVERRIDE',
            entity: 'Patient PAT-2026-0101',
            tenant: MediData.tenant.id,
            details: 'Clinician reviewed drug-allergy alert and approved continuation with antihistamine co-prescription.',
            ip: '192.168.1.104'
        });
        renderAuditLogs();

        showToast('Clinical Safety Override Recorded in Compliance Audit Trail.');
    };

    // ==========================================================================
    // PHASE 4: HOSPITAL / IPD, WARD & BED MAP, MAR & DISCHARGE LOGIC (M13 - M15)
    // ==========================================================================

    let activeNursingIpdNo = "IPD-2026-0089";
    let activeDoctorRoundIpdNo = "IPD-2026-0089";
    let activeDischargeIpdNo = "IPD-2026-0083";
    let currentBedMapWardFilter = "all";

    // 1. Interactive Ward & Bed Matrix (IPD-02, M15)
    function renderIpdBedMap(wardFilter = currentBedMapWardFilter) {
        currentBedMapWardFilter = wardFilter;
        const container = document.getElementById('interactiveBedMatrixContainer');
        if (!container) return;

        // Recalculate Occupancy KPIs
        const total = MediData.beds.length;
        const occupied = MediData.beds.filter(b => b.status === 'Occupied').length;
        const vacant = MediData.beds.filter(b => b.status === 'Vacant').length;
        const cleaning = MediData.beds.filter(b => b.status === 'Cleaning').length;
        const blocked = MediData.beds.filter(b => b.status === 'Blocked').length;
        const rate = Math.round((occupied / (total - blocked)) * 100);

        const totalElem = document.getElementById('kpiTotalBeds');
        const occElem = document.getElementById('kpiOccupiedBeds');
        const vacElem = document.getElementById('kpiVacantBeds');
        const cleanElem = document.getElementById('kpiCleaningBeds');
        const rateElem = document.getElementById('kpiOccupancyRate');

        if (totalElem) totalElem.innerText = total;
        if (occElem) occElem.innerText = occupied;
        if (vacElem) vacElem.innerText = vacant;
        if (cleanElem) cleanElem.innerText = cleaning;
        if (rateElem) rateElem.innerText = `${rate}%`;

        // Filter Wards
        const wardsToRender = wardFilter === 'all' 
            ? MediData.wards 
            : MediData.wards.filter(w => w.id === wardFilter);

        container.innerHTML = wardsToRender.map(ward => {
            const wardBeds = MediData.beds.filter(b => b.wardId === ward.id);
            const wardOccupied = wardBeds.filter(b => b.status === 'Occupied').length;

            return `
                <div class="ward-section-card">
                    <div class="ward-header-banner">
                        <div class="ward-title-area">
                            <i class="bi bi-hospital" style="color: var(--primary-600); font-size: 18px;"></i>
                            <h4>${ward.name}</h4>
                            <span class="ward-badge-pill">${ward.floor}</span>
                            <span class="badge badge-outline">Daily Tariff: ₹${ward.dailyRate.toLocaleString('en-IN')}</span>
                            ${ward.ventilatorSupport ? '<span class="badge badge-purple"><i class="bi bi-cpu"></i> Ventilator Ready</span>' : ''}
                        </div>
                        <div style="font-size: 12px; font-weight: 700;">
                            Occupancy: <span style="color: ${wardOccupied === wardBeds.length ? 'var(--rose-500)' : 'var(--emerald-600)'};">${wardOccupied} / ${wardBeds.length} Beds</span> (${Math.round((wardOccupied/wardBeds.length)*100)}%)
                        </div>
                    </div>

                    <div class="ward-bed-grid">
                        ${wardBeds.map(bed => renderSingleBedCard(bed)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderSingleBedCard(bed) {
        let statusBadge = '';
        let cardClass = `bed-card status-${bed.status.toLowerCase()}`;
        let actionFooter = '';

        if (bed.status === 'Occupied') {
            statusBadge = '<span class="badge badge-rose" style="font-size: 10px;"><i class="bi bi-person-fill-lock"></i> Occupied</span>';
            actionFooter = `
                <div style="display: flex; gap: 6px; width: 100%;">
                    <button class="btn btn-outline btn-xs" style="flex: 1;" onclick="viewInpatientNursing('${bed.ipdNo}')" title="Open Nursing Station & MAR">
                        <i class="bi bi-bandaid-fill"></i> MAR
                    </button>
                    <button class="btn btn-outline btn-xs" style="flex: 1;" onclick="openTransferBedModal('${bed.id}', '${bed.ipdNo}')" title="Transfer Bed">
                        <i class="bi bi-arrow-left-right"></i> Transfer
                    </button>
                    <button class="btn btn-primary btn-xs" onclick="viewInpatientDischarge('${bed.ipdNo}')" title="Discharge Planning">
                        <i class="bi bi-box-arrow-right"></i> Bill
                    </button>
                </div>
            `;
        } else if (bed.status === 'Vacant') {
            statusBadge = '<span class="badge badge-emerald" style="font-size: 10px;"><i class="bi bi-check-circle-fill"></i> Vacant</span>';
            actionFooter = `
                <button class="btn btn-emerald btn-xs" style="width: 100%;" onclick="openAdmitPatientModal('${bed.id}')">
                    <i class="bi bi-plus-circle"></i> Admit Inpatient Here
                </button>
            `;
        } else if (bed.status === 'Cleaning') {
            statusBadge = '<span class="badge badge-amber" style="font-size: 10px;"><i class="bi bi-stars"></i> Sanitizing</span>';
            actionFooter = `
                <button class="btn btn-outline btn-xs" style="width: 100%; color: var(--amber-600); border-color: rgba(245, 158, 11, 0.4);" onclick="markBedSanitized('${bed.id}')">
                    <i class="bi bi-check2-all"></i> Mark Sanitized & Ready
                </button>
            `;
        } else {
            statusBadge = '<span class="badge badge-slate" style="font-size: 10px;">Maintenance</span>';
            actionFooter = `
                <button class="btn btn-outline btn-xs" style="width: 100%;" onclick="toggleBedBlockedState('${bed.id}')">
                    <i class="bi bi-unlock"></i> Unblock Bed
                </button>
            `;
        }

        return `
            <div class="${cardClass}">
                <div class="bed-card-header">
                    <span class="bed-no-badge"><i class="bi bi-hdd-rack"></i> ${bed.bedNo}</span>
                    ${statusBadge}
                </div>

                <div class="bed-patient-body">
                    ${bed.status === 'Occupied' ? `
                        <div class="bed-patient-name">${bed.patientName}</div>
                        <div class="bed-patient-meta">
                            <div><i class="bi bi-file-medical"></i> IPD: <b>${bed.ipdNo}</b></div>
                            <div><i class="bi bi-person-badge"></i> ${bed.doctor}</div>
                            <div><i class="bi bi-calendar3"></i> Admitted: ${bed.admissionDate}</div>
                        </div>
                    ` : bed.status === 'Vacant' ? `
                        <div style="color: var(--emerald-600); font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                            <i class="bi bi-sparkles"></i> Cleaned & Sanitized
                        </div>
                        <div class="bed-patient-meta" style="margin-top: 4px;">Ready for immediate patient allocation.</div>
                    ` : bed.status === 'Cleaning' ? `
                        <div style="color: var(--amber-600); font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                            <i class="bi bi-droplet-half"></i> Terminal Disinfection
                        </div>
                        <div class="bed-patient-meta" style="margin-top: 4px;">Housekeeping in progress post-discharge.</div>
                    ` : `
                        <div style="color: var(--text-muted); font-size: 13px; font-weight: 700;">Under Maintenance</div>
                        <div class="bed-patient-meta" style="margin-top: 4px;">Biomedical calibration scheduled.</div>
                    `}

                    <div class="bed-amenity-tags">
                        ${bed.oxygen ? '<span class="bed-amenity-tag" style="color: var(--primary-600);"><i class="bi bi-wind"></i> O2 Central</span>' : ''}
                        ${bed.pulseOximeter ? '<span class="bed-amenity-tag" style="color: var(--rose-500);"><i class="bi bi-activity"></i> Monitor</span>' : ''}
                        ${bed.ivPump ? '<span class="bed-amenity-tag" style="color: var(--indigo-600);"><i class="bi bi-droplet"></i> IV Pump</span>' : ''}
                    </div>
                </div>

                <div class="bed-card-footer">
                    ${actionFooter}
                </div>
            </div>
        `;
    }

    window.filterBedMapWard = function(wardId) {
        currentBedMapWardFilter = wardId;
        const pills = document.querySelectorAll('#wardFilterPills .pill-btn');
        pills.forEach(p => {
            if (p.dataset.ward === wardId) p.classList.add('active');
            else p.classList.remove('active');
        });
        renderIpdBedMap(wardId);
    };

    window.markBedSanitized = function(bedId) {
        const bed = MediData.beds.find(b => b.id === bedId);
        if (bed) {
            bed.status = 'Vacant';
            playAudioFx('chime');
            showToast(`Bed ${bed.bedNo} marked sanitized and ready for admission!`, 'success', 'Housekeeping Desk');
            renderIpdBedMap();
        }
    };

    window.toggleBedBlockedState = function(bedId) {
        const bed = MediData.beds.find(b => b.id === bedId);
        if (bed) {
            bed.status = bed.status === 'Blocked' ? 'Vacant' : 'Blocked';
            playAudioFx('click');
            showToast(`Bed ${bed.bedNo} status updated to: ${bed.status}`, 'info', 'Bed Manager');
            renderIpdBedMap();
        }
    };

    // 2. In-Patient Admissions Register (IPD-01)
    function renderIpdAdmissionsTable(filterText = '', statusFilter = 'all') {
        const tbody = document.getElementById('ipdAdmissionsTableBody');
        if (!tbody) return;

        let filtered = MediData.ipdAdmissions;
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === statusFilter);
        }
        if (filterText) {
            filtered = filtered.filter(a => {
                const searchStr = `${a.ipdNo} ${a.patientName} ${a.consultantDoctor} ${a.wardName} ${a.bedNo} ${a.diagnosisICD}`.toLowerCase();
                return searchStr.includes(filterText.toLowerCase());
            });
        }

        const sidebarCount = document.getElementById('sidebarIpdAdmissionsCount');
        if (sidebarCount) sidebarCount.innerText = `${MediData.ipdAdmissions.filter(a => a.status === 'Admitted').length} Admitted`;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No matching IPD admission records found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(adm => {
            const isDue = adm.runningCharges.netBalance > 0;
            const balanceLabel = isDue 
                ? `<span style="color: var(--rose-500); font-weight: 800;">₹${adm.runningCharges.netBalance.toLocaleString('en-IN')} Due</span>`
                : `<span style="color: var(--emerald-600); font-weight: 800;">Surplus ₹${Math.abs(adm.runningCharges.netBalance).toLocaleString('en-IN')}</span>`;

            return `
                <tr>
                    <td>
                        <div style="font-weight: 800; color: var(--primary-600); font-family: 'JetBrains Mono', monospace;">${adm.ipdNo}</div>
                        <div style="font-weight: 700; color: var(--text-primary); font-size: 13px;">${adm.patientName} (${adm.age}y, ${adm.gender})</div>
                        <div style="font-size: 11px; color: var(--text-muted);"><i class="bi bi-droplet-fill text-danger"></i> ${adm.bloodGroup} • MRN: ${adm.mrn}</div>
                    </td>
                    <td>
                        <div style="font-weight: 800; color: var(--text-heading);"><i class="bi bi-hdd-rack"></i> ${adm.bedNo}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${adm.wardName}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${adm.consultantDoctor}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${adm.department}</div>
                    </td>
                    <td>
                        <div style="font-size: 12px; font-weight: 600; color: var(--text-primary); max-width: 220px;">${adm.admissionReason}</div>
                        <div style="font-size: 10.5px; color: var(--primary-600); font-family: 'JetBrains Mono', monospace;">${adm.diagnosisICD}</div>
                    </td>
                    <td>
                        <span class="badge ${adm.payerType.includes('PM-JAY') ? 'badge-purple' : adm.payerType.includes('Insurance') ? 'badge-emerald' : 'badge-outline'}" style="font-size: 11px;">
                            ${adm.payerType.split('(')[0]}
                        </span>
                    </td>
                    <td>
                        <div style="font-weight: 700;">${adm.admitDays} Days</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${adm.admitDateTime.split(',')[0]}</div>
                    </td>
                    <td>
                        <div style="font-size: 12px;">Bill: <b>₹${adm.runningCharges.totalEstimated.toLocaleString('en-IN')}</b></div>
                        <div style="font-size: 11px; color: var(--text-muted);">Deposit: ₹${adm.advanceDeposit.toLocaleString('en-IN')}</div>
                        <div>${balanceLabel}</div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 5px;">
                            <button class="btn btn-outline btn-xs" onclick="viewInpatientNursing('${adm.ipdNo}')" title="Nursing Station & MAR">
                                <i class="bi bi-bandaid"></i> MAR
                            </button>
                            <button class="btn btn-outline btn-xs" onclick="viewInpatientRounds('${adm.ipdNo}')" title="Doctor Daily Rounds">
                                <i class="bi bi-journal-medical"></i> Round
                            </button>
                            <button class="btn btn-primary btn-xs" onclick="viewInpatientDischarge('${adm.ipdNo}')" title="Discharge & Final Bill">
                                <i class="bi bi-box-arrow-right"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterIpdAdmissionsTable = function() {
        const input = document.getElementById('ipdAdmissionsSearchInput');
        const filterText = input ? input.value : '';
        renderIpdAdmissionsTable(filterText);
    };

    window.filterIpdStatus = function(status) {
        const pills = document.querySelectorAll('#ipdStatusFilterPills .pill-btn');
        pills.forEach(p => {
            if ((status === 'all' && p.innerText.includes('All')) || p.innerText.includes(status)) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
        renderIpdAdmissionsTable('', status);
    };

    // 3. Nursing Station & Electronic Medication Administration Record (MAR) (M14)
    function renderNursingStation(selectedIpdNo = activeNursingIpdNo) {
        activeNursingIpdNo = selectedIpdNo;
        const listContainer = document.getElementById('nursingInpatientSelectorList');
        const cardContainer = document.getElementById('nursingActivePatientCard');
        if (!listContainer || !cardContainer) return;

        const admissions = MediData.ipdAdmissions;
        const currentPatient = admissions.find(a => a.ipdNo === selectedIpdNo) || admissions[0];
        if (!currentPatient) return;

        // Render Inpatient Selection Sidebar
        listContainer.innerHTML = admissions.map(adm => {
            const isActive = adm.ipdNo === currentPatient.ipdNo;
            return `
                <div class="inpatient-selector-item ${isActive ? 'active' : ''}" onclick="renderNursingStation('${adm.ipdNo}')">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 800; font-size: 13px; color: var(--text-heading);">${adm.patientName}</span>
                        <span class="badge ${isActive ? 'badge-emerald' : 'badge-outline'}" style="font-size: 10px;">${adm.bedNo}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted);">${adm.wardName} • ${adm.ipdNo}</div>
                </div>
            `;
        }).join('');

        // Render Active Inpatient MAR & Care Card
        cardContainer.innerHTML = `
            <!-- Patient Header & Vitals Bar -->
            <div style="padding: 16px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h3 style="margin: 0; font-size: 18px; font-weight: 800;">${currentPatient.patientName}</h3>
                        <span class="badge badge-purple">${currentPatient.age} Yrs / ${currentPatient.gender}</span>
                        <span class="badge badge-rose"><i class="bi bi-droplet-fill"></i> ${currentPatient.bloodGroup}</span>
                        <span class="badge badge-emerald"><i class="bi bi-hdd-rack"></i> Bed: ${currentPatient.bedNo} (${currentPatient.wardName})</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                        <b>IPD No:</b> ${currentPatient.ipdNo} | <b>Consultant:</b> ${currentPatient.consultantDoctor} | <b>Admit Date:</b> ${currentPatient.admitDateTime}
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="openRecordNursingVitalsModal('${currentPatient.ipdNo}')">
                        <i class="bi bi-heart-pulse-fill text-danger"></i> + Record Vitals
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="openTransferBedModal('${currentPatient.wardId}', '${currentPatient.ipdNo}')">
                        <i class="bi bi-arrow-left-right"></i> Transfer Bed
                    </button>
                </div>
            </div>

            <!-- Clinical Alerts Ribbon -->
            <div style="padding: 12px 16px; background: rgba(244, 63, 94, 0.06); border-bottom: 1px solid rgba(244, 63, 94, 0.15); display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 12.5px; color: var(--rose-600); font-weight: 700; display: flex; align-items: center; gap: 8px;">
                    <i class="bi bi-exclamation-octagon-fill"></i> Allergy Warning: ${currentPatient.allergies}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">
                    <i class="bi bi-egg-fried"></i> Diet: <b>${currentPatient.diet}</b>
                </div>
            </div>

            <!-- Electronic MAR (Medication Administration Record) -->
            <div style="padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: var(--text-heading); display: flex; align-items: center; gap: 8px;">
                        <i class="bi bi-capsule-pill" style="color: var(--primary-600);"></i> Scheduled Medication Administration Record (MAR)
                    </h4>
                    <span class="badge badge-outline"><i class="bi bi-clock-history"></i> Today's Schedule</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${currentPatient.medicationSchedule.map(med => {
                        const isGiven = med.status === 'Given';
                        return `
                            <div class="mar-schedule-card ${isGiven ? 'given' : 'due'}">
                                <div>
                                    <div style="font-weight: 800; font-size: 14px; color: var(--text-primary);">${med.medicine}</div>
                                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                                        Dose: <b>${med.dose}</b> • Route: <b>${med.route}</b> • Timing: <b>${med.timing}</b>
                                    </div>
                                    ${isGiven ? `
                                        <div style="font-size: 11px; color: var(--emerald-600); margin-top: 4px; font-weight: 600;">
                                            <i class="bi bi-check-circle-fill"></i> Administered at ${med.administeredAt} by ${med.administeredBy}
                                        </div>
                                    ` : ''}
                                </div>
                                <div>
                                    ${isGiven ? `
                                        <span class="badge badge-emerald" style="padding: 6px 12px;"><i class="bi bi-check2"></i> Dose Given</span>
                                    ` : `
                                        <button class="btn btn-emerald btn-sm" onclick="administerMedicationDose('${currentPatient.ipdNo}', '${med.id}')">
                                            <i class="bi bi-check2-circle"></i> Administer Now
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Nursing Vitals Flowsheet -->
                <div style="margin-top: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: var(--text-heading); display: flex; align-items: center; gap: 8px;">
                            <i class="bi bi-activity" style="color: var(--rose-500);"></i> Shift Vitals Flowsheet
                        </h4>
                    </div>

                    <div class="table-responsive">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>BP (mmHg)</th>
                                    <th>Pulse (bpm)</th>
                                    <th>Temp (°F)</th>
                                    <th>SpO2</th>
                                    <th>CBG Sugar</th>
                                    <th>Pain Score</th>
                                    <th>Recorded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${currentPatient.vitalsChart.map(v => `
                                    <tr>
                                        <td><b>${v.time}</b></td>
                                        <td><span class="badge badge-outline">${v.bp}</span></td>
                                        <td><b>${v.pulse}</b></td>
                                        <td>${v.temp}</td>
                                        <td><span class="badge badge-emerald">${v.spo2}</span></td>
                                        <td><b>${v.sugar}</b></td>
                                        <td>${v.pain}</td>
                                        <td><span style="font-size: 11px; color: var(--text-muted);">${v.nurse}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    window.viewInpatientNursing = function(ipdNo) {
        switchView('ipd-nursing');
        renderNursingStation(ipdNo);
    };

    window.administerMedicationDose = function(ipdNo, medScheduleId) {
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (!admission) return;

        const med = admission.medicationSchedule.find(m => m.id === medScheduleId);
        if (med) {
            med.status = 'Given';
            med.administeredAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            med.administeredBy = 'Staff Nurse Sarita';

            playAudioFx('chime');
            triggerConfetti();

            MediData.auditLogs.unshift({
                id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                actor: 'Staff Nurse Sarita (NUR-01)',
                action: 'MAR_MEDICATION_ADMINISTERED',
                entity: `MAR #${med.id}`,
                tenant: MediData.tenant.id,
                details: `Administered ${med.medicine} (${med.dose}) to ${admission.patientName} (${admission.ipdNo}). Signed electronically.`,
                ip: '192.168.1.122'
            });
            renderAuditLogs();

            showToast(`Administered ${med.medicine} to ${admission.patientName}`, 'success', 'Electronic MAR');
            renderNursingStation(ipdNo);
        }
    };

    window.openRecordNursingVitalsModal = function(ipdNo = activeNursingIpdNo) {
        const select = document.getElementById('nurseVitalIpdSelect');
        if (select) {
            select.innerHTML = MediData.ipdAdmissions.map(a => `<option value="${a.ipdNo}" ${a.ipdNo === ipdNo ? 'selected' : ''}>${a.patientName} (${a.bedNo} - ${a.ipdNo})</option>`).join('');
        }
        document.getElementById('recordNursingVitalsModal').classList.add('active');
    };

    window.submitNursingVitals = function() {
        const ipdNo = document.getElementById('nurseVitalIpdSelect').value;
        const bp = document.getElementById('nurseVitalBp').value;
        const pulse = parseInt(document.getElementById('nurseVitalPulse').value) || 76;
        const temp = document.getElementById('nurseVitalTemp').value;
        const spo2 = document.getElementById('nurseVitalSpo2').value;
        const sugar = document.getElementById('nurseVitalSugar').value;
        const pain = document.getElementById('nurseVitalPain').value;

        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (admission) {
            const timeStr = `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            admission.vitalsChart.unshift({
                time: timeStr,
                bp, pulse, temp, spo2, sugar, pain,
                nurse: 'Staff Nurse Sarita'
            });

            playAudioFx('success');
            document.getElementById('recordNursingVitalsModal').classList.remove('active');
            showToast(`Vitals recorded for ${admission.patientName}`, 'success', 'Nursing Flowsheet');
            renderNursingStation(ipdNo);
        }
    };

    // 4. IPD Doctor Daily Clinical Rounds (IPD-03)
    function renderDoctorRounds(selectedIpdNo = activeDoctorRoundIpdNo) {
        activeDoctorRoundIpdNo = selectedIpdNo;
        const listContainer = document.getElementById('doctorRoundsInpatientList');
        const detailContainer = document.getElementById('doctorRoundsDetailContainer');
        if (!listContainer || !detailContainer) return;

        const admissions = MediData.ipdAdmissions;
        const currentPatient = admissions.find(a => a.ipdNo === selectedIpdNo) || admissions[0];
        if (!currentPatient) return;

        listContainer.innerHTML = admissions.map(adm => {
            const isActive = adm.ipdNo === currentPatient.ipdNo;
            return `
                <div class="inpatient-selector-item ${isActive ? 'active' : ''}" onclick="renderDoctorRounds('${adm.ipdNo}')">
                    <div style="font-weight: 800; font-size: 13px;">${adm.patientName}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${adm.wardName} • Bed: ${adm.bedNo}</div>
                    <div style="font-size: 11px; color: var(--primary-600); margin-top: 3px;">${adm.consultantDoctor}</div>
                </div>
            `;
        }).join('');

        detailContainer.innerHTML = `
            <div style="padding: 16px; background: var(--bg-main); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div>
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800;">${currentPatient.patientName} <span style="font-size: 13px; font-weight: 500; color: var(--text-muted);">(Bed ${currentPatient.bedNo})</span></h3>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                            Diagnosis: <b>${currentPatient.diagnosisICD}</b> • Day ${currentPatient.admitDays} of Admission
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openDoctorRoundModal('${currentPatient.ipdNo}')">
                        <i class="bi bi-pencil-square"></i> + Add Today's Round Note
                    </button>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${currentPatient.doctorRoundsNotes.map((round, idx) => `
                    <div class="card" style="padding: 16px; border-left: 4px solid var(--primary-600);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div style="font-weight: 800; font-size: 13.5px; color: var(--text-heading);">
                                <i class="bi bi-person-badge-fill" style="color: var(--primary-600);"></i> ${round.doctor}
                            </div>
                            <span class="badge badge-outline"><i class="bi bi-calendar3"></i> ${round.date}</span>
                        </div>
                        <div style="font-size: 13px; color: var(--text-primary); line-height: 1.5; margin-bottom: 10px;">
                            <b>Clinical Assessment (SOAP):</b> ${round.notes}
                        </div>
                        <div style="padding: 10px; background: rgba(14, 165, 233, 0.05); border-radius: 6px; border: 1px dashed rgba(14, 165, 233, 0.3); font-size: 12px; color: var(--primary-700);">
                            <i class="bi bi-check2-circle"></i> <b>Doctor Orders & Instructions:</b> ${round.orders}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    window.viewInpatientRounds = function(ipdNo) {
        switchView('ipd-rounds');
        renderDoctorRounds(ipdNo);
    };

    window.openDoctorRoundModal = function(ipdNo = activeDoctorRoundIpdNo) {
        const patSelect = document.getElementById('roundIpdPatientSelect');
        const docSelect = document.getElementById('roundDoctorSelect');
        if (patSelect) {
            patSelect.innerHTML = MediData.ipdAdmissions.map(a => `<option value="${a.ipdNo}" ${a.ipdNo === ipdNo ? 'selected' : ''}>${a.patientName} (${a.bedNo})</option>`).join('');
        }
        if (docSelect) {
            docSelect.innerHTML = MediData.doctors.map(d => `<option value="${d.name}">${d.name} (${d.specialty})</option>`).join('');
        }
        document.getElementById('recordDoctorRoundModal').classList.add('active');
    };

    window.submitDoctorRoundNote = function() {
        const ipdNo = document.getElementById('roundIpdPatientSelect').value;
        const doctor = document.getElementById('roundDoctorSelect').value;
        const notes = document.getElementById('roundClinicalNotesInput').value || 'Patient reviewed during morning rounds. Vitals stable.';
        const orders = document.getElementById('roundOrdersInput').value || 'Continue current line of treatment.';

        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (admission) {
            const timeStr = `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
            admission.doctorRoundsNotes.unshift({
                date: timeStr,
                doctor: doctor,
                notes: notes,
                orders: orders
            });

            // Automatically accumulate Doctor Consultation Charge (IPD-04)
            admission.runningCharges.doctorConsultationCharges += admission.doctorVisitDailyTariff;
            admission.runningCharges.subtotal += admission.doctorVisitDailyTariff;
            admission.runningCharges.totalEstimated += admission.doctorVisitDailyTariff;
            admission.runningCharges.netBalance += admission.doctorVisitDailyTariff;

            playAudioFx('success');
            document.getElementById('recordDoctorRoundModal').classList.remove('active');
            showToast(`Doctor Round recorded & ₹${admission.doctorVisitDailyTariff} visit fee added to folio.`, 'success', 'Clinical Rounds');
            renderDoctorRounds(ipdNo);
        }
    };

    // 5. Discharge Planning & Final IPD Bill Settlement (IPD-06, FIN-04)
    function renderDischargeDesk(selectedIpdNo = activeDischargeIpdNo) {
        activeDischargeIpdNo = selectedIpdNo;
        const listContainer = document.getElementById('dischargeInpatientList');
        const workspaceContainer = document.getElementById('dischargeDetailWorkspace');
        if (!listContainer || !workspaceContainer) return;

        const admissions = MediData.ipdAdmissions;
        const currentPatient = admissions.find(a => a.ipdNo === selectedIpdNo) || admissions[0];
        if (!currentPatient) return;

        listContainer.innerHTML = admissions.map(adm => {
            const isActive = adm.ipdNo === currentPatient.ipdNo;
            const isReady = adm.status === 'Planned Discharge';
            return `
                <div class="inpatient-selector-item ${isActive ? 'active' : ''}" onclick="renderDischargeDesk('${adm.ipdNo}')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 800; font-size: 13px;">${adm.patientName}</span>
                        ${isReady ? '<span class="badge badge-emerald" style="font-size: 9px;">Ready</span>' : '<span class="badge badge-outline" style="font-size: 9px;">Inpatient</span>'}
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted);">${adm.wardName} • Bed: ${adm.bedNo}</div>
                </div>
            `;
        }).join('');

        const charges = currentPatient.runningCharges;
        const isRefund = charges.netBalance < 0;

        workspaceContainer.innerHTML = `
            <div style="padding: 18px; border-radius: var(--radius-md); background: var(--bg-main); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: 800;">${currentPatient.patientName}</h3>
                            <span class="badge badge-purple">${currentPatient.ipdNo}</span>
                            <span class="badge badge-emerald">Bed: ${currentPatient.bedNo}</span>
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                            Consultant: <b>${currentPatient.consultantDoctor}</b> • Stay: <b>${currentPatient.admitDays} Days</b> (${currentPatient.admitDateTime.split(',')[0]} to Today)
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-outline btn-sm" onclick="openPrintableDischargeSummary('${currentPatient.ipdNo}')">
                            <i class="bi bi-file-earmark-medical"></i> Discharge Summary PDF
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="openPrintableIpdBill('${currentPatient.ipdNo}')">
                            <i class="bi bi-printer-fill"></i> IPD Tax Invoice
                        </button>
                    </div>
                </div>
            </div>

            <!-- Itemized Final Folio Charges Breakdown -->
            <div class="card" style="margin-bottom: 20px;">
                <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 12px; color: var(--text-heading);">
                    <i class="bi bi-calculator" style="color: var(--primary-600);"></i> Itemized IPD Folio Charges Accumulator
                </h4>

                <div class="table-responsive">
                    <table class="modern-table">
                        <thead>
                            <tr>
                                <th>Charge Head / Department</th>
                                <th>Billing Rate & Units</th>
                                <th>Total Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Room & Bed Charges</b> (${currentPatient.wardName})</td>
                                <td>₹${currentPatient.bedDailyTariff} / day × ${currentPatient.admitDays} days</td>
                                <td><b>₹${charges.roomCharges.toLocaleString('en-IN')}</b></td>
                            </tr>
                            <tr>
                                <td><b>Nursing & Ward Care Charges</b></td>
                                <td>₹${currentPatient.nursingTariff} / day × ${currentPatient.admitDays} days</td>
                                <td><b>₹${charges.nursingCharges.toLocaleString('en-IN')}</b></td>
                            </tr>
                            <tr>
                                <td><b>Doctor Inpatient Daily Visit Fees</b></td>
                                <td>Specialist Clinical Rounds × ${currentPatient.admitDays} rounds</td>
                                <td><b>₹${charges.doctorConsultationCharges.toLocaleString('en-IN')}</b></td>
                            </tr>
                            <tr>
                                <td><b>Pharmacy & Consumables Ledger</b></td>
                                <td>IV fluids, Injections, Cannulas, Disposables</td>
                                <td><b>₹${charges.pharmacyCharges.toLocaleString('en-IN')}</b></td>
                            </tr>
                            <tr>
                                <td><b>Pathology Lab & Investigations</b></td>
                                <td>Diagnostic blood/urine investigations</td>
                                <td><b>₹${charges.labCharges.toLocaleString('en-IN')}</b></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
                    <div style="min-width: 300px; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                            <span>Gross Bill Total:</span>
                            <b>₹${charges.totalEstimated.toLocaleString('en-IN')}</b>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: var(--emerald-600);">
                            <span>Initial Advance Deposit:</span>
                            <b>- ₹${charges.advancePaid.toLocaleString('en-IN')}</b>
                        </div>
                        <div style="border-top: 1px solid var(--border-subtle); padding-top: 8px; display: flex; justify-content: space-between; font-size: 15px; font-weight: 800;">
                            <span>${isRefund ? 'Refund to Patient:' : 'Net Payable at Counter:'}</span>
                            <span style="color: ${isRefund ? 'var(--emerald-600)' : 'var(--rose-600)'};">
                                ₹${Math.abs(charges.netBalance).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settlement & Bed Release Action -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(16, 185, 129, 0.08); border-radius: var(--radius-md); border: 1px solid rgba(16, 185, 129, 0.2);">
                <div>
                    <div style="font-weight: 800; font-size: 14px; color: var(--emerald-700);">Complete Hospital Discharge & Clear Bed</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Reconciles accounts, frees bed for terminal disinfection and generates discharge certificate.</div>
                </div>
                <button class="btn btn-emerald" onclick="finalizeIpdDischarge('${currentPatient.ipdNo}')">
                    <i class="bi bi-check2-circle"></i> Finalize Settlement & Discharge
                </button>
            </div>
        `;
    }

    window.viewInpatientDischarge = function(ipdNo) {
        switchView('ipd-discharge');
        renderDischargeDesk(ipdNo);
    };

    window.finalizeIpdDischarge = function(ipdNo) {
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (!admission) return;

        // Update Bed State to Cleaning
        const bed = MediData.beds.find(b => b.id === admission.wardId || b.bedNo === admission.bedNo);
        if (bed) {
            bed.status = 'Cleaning';
            bed.patientId = null;
            bed.patientName = null;
            bed.ipdNo = null;
        }

        admission.status = 'Discharged';
        playAudioFx('success');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'Kiran R. (Billing & IPD Desk)',
            action: 'IPD_PATIENT_DISCHARGE_SETTLED',
            entity: `Admission #${admission.ipdNo}`,
            tenant: MediData.tenant.id,
            details: `Settled final bill ₹${admission.runningCharges.totalEstimated} for ${admission.patientName}. Bed ${admission.bedNo} routed to Housekeeping.`,
            ip: '192.168.1.110'
        });
        renderAuditLogs();

        showToast(`Patient ${admission.patientName} discharged successfully! Bed marked for sanitization.`, 'success', 'Discharge Clearance');
        renderIpdBedMap();
        renderIpdAdmissionsTable();
        renderDischargeDesk();
    };

    // Admission Form Handlers (IPD-01)
    window.openAdmitPatientModal = function(presetBedId = null) {
        const patSelect = document.getElementById('admitPatientSelect');
        const docSelect = document.getElementById('admitDoctorSelect');
        const wardSelect = document.getElementById('admitWardSelect');

        if (patSelect) {
            patSelect.innerHTML = MediData.patients.map(p => `<option value="${p.id}">${p.name} (${p.mrn} • ${p.phone})</option>`).join('');
        }
        if (docSelect) {
            docSelect.innerHTML = MediData.doctors.map(d => `<option value="${d.name}">${d.name} (${d.specialty})</option>`).join('');
        }
        if (wardSelect) {
            wardSelect.innerHTML = MediData.wards.map(w => `<option value="${w.id}">${w.name} (₹${w.dailyRate}/day)</option>`).join('');
        }

        updateAdmitBedDropdown(presetBedId);
        document.getElementById('admitPatientModal').classList.add('active');
    };

    window.updateAdmitBedDropdown = function(presetBedId = null) {
        const wardId = document.getElementById('admitWardSelect').value;
        const bedSelect = document.getElementById('admitBedSelect');
        if (!bedSelect) return;

        const vacantBeds = MediData.beds.filter(b => b.wardId === wardId && (b.status === 'Vacant' || b.id === presetBedId));
        if (vacantBeds.length === 0) {
            bedSelect.innerHTML = `<option value="">No vacant beds available in this ward</option>`;
        } else {
            bedSelect.innerHTML = vacantBeds.map(b => `<option value="${b.id}" ${b.id === presetBedId ? 'selected' : ''}>${b.bedNo} (${b.type})</option>`).join('');
        }
    };

    window.submitAdmitPatient = function() {
        const patientId = document.getElementById('admitPatientSelect').value;
        const patient = MediData.patients.find(p => p.id === patientId) || MediData.patients[0];
        const doctor = document.getElementById('admitDoctorSelect').value;
        const wardId = document.getElementById('admitWardSelect').value;
        const ward = MediData.wards.find(w => w.id === wardId);
        const bedId = document.getElementById('admitBedSelect').value;
        const bed = MediData.beds.find(b => b.id === bedId);
        const payer = document.getElementById('admitPayerTypeSelect').value;
        const reason = document.getElementById('admitReasonInput').value || 'Acute clinical admission';
        const icd = document.getElementById('admitIcdInput').value || 'R69 (Illness unspecified)';
        const deposit = parseInt(document.getElementById('admitAdvanceDepositInput').value) || 15000;
        const diet = document.getElementById('admitDietSelect').value;

        if (!bed) {
            showToast('Please select an available bed for admission', 'error');
            return;
        }

        const newIpdNo = `IPD-2026-00${Math.floor(90 + Math.random() * 10)}`;

        // Update Bed Object
        bed.status = 'Occupied';
        bed.patientId = patient.id;
        bed.patientName = patient.name;
        bed.ipdNo = newIpdNo;
        bed.admissionDate = 'Today';
        bed.doctor = doctor;

        // Create Admission Record
        const newAdmission = {
            ipdNo: newIpdNo,
            patientId: patient.id,
            patientName: patient.name,
            age: patient.age || 45,
            gender: patient.gender || 'Male',
            bloodGroup: patient.bloodGroup || 'B+',
            contact: patient.phone,
            mrn: patient.mrn,
            admitDateTime: `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            admitDays: 1,
            consultantDoctor: doctor,
            department: "Internal Medicine",
            admissionReason: reason,
            diagnosisICD: icd,
            wardId: ward.id,
            wardName: ward.name,
            bedNo: bed.bedNo,
            bedDailyTariff: ward.dailyRate,
            nursingTariff: 1000,
            doctorVisitDailyTariff: 1200,
            payerType: payer,
            advanceDeposit: deposit,
            status: "Admitted",
            allergies: patient.allergies || "No known drug allergies",
            diet: diet,
            vitalsChart: [
                { time: "On Admission", bp: "124/82", pulse: 78, temp: "98.6°F", spo2: "99%", sugar: "120 mg/dL", pain: "0/10", nurse: "Staff Nurse Sarita" }
            ],
            medicationSchedule: [
                { id: `MED-ADM-${Math.floor(10 + Math.random()*90)}`, medicine: "IV Fluid Normal Saline 500ml", dose: "75 ml/hr", timing: "Continuous Infusion", route: "Intravenous", status: "Due", administeredAt: null, administeredBy: null }
            ],
            doctorRoundsNotes: [
                { date: "On Admission", doctor: doctor, notes: `Patient admitted with ${reason}. Initial workup ordered.`, orders: "Monitor vitals 4-hourly, standard nursing protocol." }
            ],
            runningCharges: {
                roomCharges: ward.dailyRate,
                nursingCharges: 1000,
                doctorConsultationCharges: 1200,
                pharmacyCharges: 1500,
                labCharges: 800,
                subtotal: ward.dailyRate + 4500,
                taxGst: 0,
                totalEstimated: ward.dailyRate + 4500,
                advancePaid: deposit,
                netBalance: (ward.dailyRate + 4500) - deposit
            },
            dischargeSummary: {
                dischargeDate: "Pending",
                conditionOnDischarge: "Under Treatment",
                summaryNotes: "Under active in-patient care.",
                dischargeMeds: [],
                followUpAdvice: "Pending discharge",
                emergencyWarning: "Report immediately if any acute distress."
            }
        };

        MediData.ipdAdmissions.unshift(newAdmission);

        playAudioFx('chime');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${MediData.currentUser.name}`,
            action: 'IPD_PATIENT_ADMISSION',
            entity: `Admission #${newIpdNo}`,
            tenant: MediData.tenant.id,
            details: `Admitted ${patient.name} to ${ward.name} Bed ${bed.bedNo}. Initial advance deposit ₹${deposit.toLocaleString('en-IN')} received.`,
            ip: '192.168.1.104'
        });
        renderAuditLogs();

        document.getElementById('admitPatientModal').classList.remove('active');
        showToast(`Patient ${patient.name} admitted to Bed ${bed.bedNo}!`, 'success', 'Inpatient Admission');
        renderIpdBedMap();
        renderIpdAdmissionsTable();
    };

    // Bed Transfer Handlers (IPD-05)
    window.openTransferBedModal = function(sourceBedId, ipdNo) {
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (!admission) return;

        document.getElementById('transferSourceBedId').value = sourceBedId;
        document.getElementById('transferIpdNo').value = ipdNo;
        document.getElementById('transferPatientNameLabel').innerText = `Transferring Patient: ${admission.patientName} (${admission.ipdNo})`;
        document.getElementById('transferCurrentBedLabel').innerText = `Current Bed: ${admission.bedNo} (${admission.wardName})`;

        const wardSelect = document.getElementById('transferTargetWardSelect');
        if (wardSelect) {
            wardSelect.innerHTML = MediData.wards.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
        }
        updateTransferBedDropdown();
        document.getElementById('transferBedModal').classList.add('active');
    };

    window.updateTransferBedDropdown = function() {
        const wardId = document.getElementById('transferTargetWardSelect').value;
        const bedSelect = document.getElementById('transferTargetBedSelect');
        if (!bedSelect) return;

        const vacantBeds = MediData.beds.filter(b => b.wardId === wardId && b.status === 'Vacant');
        if (vacantBeds.length === 0) {
            bedSelect.innerHTML = `<option value="">No vacant beds in this ward</option>`;
        } else {
            bedSelect.innerHTML = vacantBeds.map(b => `<option value="${b.id}">${b.bedNo} (${b.type})</option>`).join('');
        }
    };

    window.submitBedTransfer = function() {
        const ipdNo = document.getElementById('transferIpdNo').value;
        const targetBedId = document.getElementById('transferTargetBedSelect').value;
        const reason = document.getElementById('transferReasonSelect').value;

        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        const targetBed = MediData.beds.find(b => b.id === targetBedId);
        const sourceBed = MediData.beds.find(b => b.bedNo === admission.bedNo);

        if (!targetBed) {
            showToast('Please select a valid vacant bed', 'error');
            return;
        }

        const oldBedNo = admission.bedNo;

        // Free old bed -> send to Cleaning
        if (sourceBed) {
            sourceBed.status = 'Cleaning';
            sourceBed.patientId = null;
            sourceBed.patientName = null;
            sourceBed.ipdNo = null;
        }

        // Occupy target bed
        targetBed.status = 'Occupied';
        targetBed.patientId = admission.patientId;
        targetBed.patientName = admission.patientName;
        targetBed.ipdNo = admission.ipdNo;
        targetBed.doctor = admission.consultantDoctor;

        // Update admission record
        admission.wardId = targetBed.wardId;
        admission.wardName = targetBed.wardName;
        admission.bedNo = targetBed.bedNo;

        playAudioFx('chime');

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'Staff Nurse Sarita (Ward In-charge)',
            action: 'IPD_BED_TRANSFER',
            entity: `Admission #${admission.ipdNo}`,
            tenant: MediData.tenant.id,
            details: `Transferred ${admission.patientName} from ${oldBedNo} to ${targetBed.bedNo}. Reason: ${reason}. Old bed sent for terminal cleaning.`,
            ip: '192.168.1.122'
        });
        renderAuditLogs();

        document.getElementById('transferBedModal').classList.remove('active');
        showToast(`Patient transferred from ${oldBedNo} to ${targetBed.bedNo}`, 'success', 'Bed Transfer');
        renderIpdBedMap();
        renderIpdAdmissionsTable();
    };

    // Printable Document Generators
    window.openPrintableDischargeSummary = function(ipdNo = activeDischargeIpdNo) {
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (!admission) return;

        const summary = admission.dischargeSummary;
        const container = document.getElementById('printableDischargeContent');

        container.innerHTML = `
            <div class="discharge-sheet-container">
                <div class="discharge-header-box">
                    <div>
                        <h2 style="margin: 0; color: #0284c7; font-size: 20px; font-weight: 800;">${MediData.tenant.name}</h2>
                        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${MediData.tenant.address} • Ph: ${MediData.tenant.phone}</div>
                        <div style="font-size: 11px; color: #64748b;">Reg No: ${MediData.tenant.regNo} | Drug Lic: ${MediData.tenant.dlNo}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Official Discharge Summary</div>
                        <div style="font-size: 11px; font-weight: 700; color: #0284c7; font-family: 'JetBrains Mono', monospace;">${admission.ipdNo}</div>
                    </div>
                </div>

                <div class="discharge-grid-meta">
                    <div><b>Patient Name:</b> ${admission.patientName}</div>
                    <div><b>Age / Gender:</b> ${admission.age} Yrs / ${admission.gender} (Blood: ${admission.bloodGroup})</div>
                    <div><b>MRN / UHID:</b> ${admission.mrn}</div>
                    <div><b>Contact No:</b> ${admission.contact}</div>
                    <div><b>Admission Date & Time:</b> ${admission.admitDateTime}</div>
                    <div><b>Discharge Date:</b> ${summary.dischargeDate}</div>
                    <div><b>Ward & Bed No:</b> ${admission.wardName} (Bed: ${admission.bedNo})</div>
                    <div><b>Consultant In-Charge:</b> ${admission.consultantDoctor}</div>
                </div>

                <div class="discharge-section-title">Final Clinical Diagnosis (ICD-10)</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                    ${admission.diagnosisICD}
                </div>

                <div class="discharge-section-title">Reason for Admission & Clinical Presentation</div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.5; margin-bottom: 8px;">
                    ${admission.admissionReason}
                </div>

                <div class="discharge-section-title">Hospital Course & Treatment Summary</div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.5; margin-bottom: 8px;">
                    ${summary.summaryNotes}
                </div>

                <div class="discharge-section-title">Condition at Discharge</div>
                <div style="font-size: 12.5px; font-weight: 700; color: #10b981; margin-bottom: 8px;">
                    <i class="bi bi-check-circle-fill"></i> ${summary.conditionOnDischarge}
                </div>

                <div class="discharge-section-title">Discharge Medication Regimen</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px;">
                    <thead>
                        <tr style="background: #f1f5f9; text-align: left;">
                            <th style="padding: 6px; border: 1px solid #cbd5e1;">Medicine Name</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1;">Dosage</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1;">Frequency</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1;">Timing</th>
                            <th style="padding: 6px; border: 1px solid #cbd5e1;">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${summary.dischargeMeds.map(m => `
                            <tr>
                                <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: 700;">${m.drug}</td>
                                <td style="padding: 6px; border: 1px solid #cbd5e1;">${m.dose}</td>
                                <td style="padding: 6px; border: 1px solid #cbd5e1;">${m.freq}</td>
                                <td style="padding: 6px; border: 1px solid #cbd5e1;">${m.timing}</td>
                                <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: 700;">${m.days}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="discharge-section-title">Follow-up Advice & Instructions</div>
                <div style="font-size: 12.5px; color: #334155; line-height: 1.5; margin-bottom: 8px;">
                    ${summary.followUpAdvice}
                </div>

                <div style="background: #fff1f2; border: 1px solid #fecdd3; padding: 10px; border-radius: 6px; margin-top: 10px;">
                    <div style="font-size: 12px; font-weight: 800; color: #e11d48;"><i class="bi bi-shield-exclamation"></i> Emergency Warning Signs:</div>
                    <div style="font-size: 11.5px; color: #9f1239;">${summary.emergencyWarning}</div>
                </div>

                <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 14px;">
                    <div style="text-align: center;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://apexhealth.medios.live/verify/ipd/${admission.ipdNo}" alt="QR" style="border: 1px solid #cbd5e1; border-radius: 4px;">
                        <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Scan to Verify Summary</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; color: #0f172a; font-size: 13px;">${admission.consultantDoctor}</div>
                        <div style="font-size: 11px; color: #64748b;">${admission.department}</div>
                        <div style="font-size: 10px; color: #0284c7; font-weight: 700; margin-top: 4px;">[ Digitally Authorized & Signed ]</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('printableDischargeSummaryModal').classList.add('active');
    };

    window.openPrintableIpdBill = function(ipdNo = activeDischargeIpdNo) {
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo);
        if (!admission) return;

        const charges = admission.runningCharges;
        const container = document.getElementById('printableIpdBillContent');

        container.innerHTML = `
            <div class="discharge-sheet-container">
                <div class="discharge-header-box">
                    <div>
                        <h2 style="margin: 0; color: #0284c7; font-size: 20px; font-weight: 800;">${MediData.tenant.name}</h2>
                        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${MediData.tenant.address} • GSTIN: ${MediData.tenant.gstin}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; font-weight: 800; color: #0f172a;">FINAL HOSPITAL TAX INVOICE</div>
                        <div style="font-size: 11px; font-weight: 700; color: #0284c7;">Bill No: INV-IPD-${admission.ipdNo.replace('IPD-', '')}</div>
                    </div>
                </div>

                <div class="discharge-grid-meta">
                    <div><b>Patient:</b> ${admission.patientName} (${admission.gender}, ${admission.age}y)</div>
                    <div><b>IPD Number:</b> ${admission.ipdNo}</div>
                    <div><b>Admitted Date:</b> ${admission.admitDateTime}</div>
                    <div><b>Discharge Date:</b> Today</div>
                    <div><b>Room / Ward:</b> ${admission.wardName} (${admission.bedNo})</div>
                    <div><b>Payer / Scheme:</b> ${admission.payerType}</div>
                </div>

                <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 16px;">
                    <thead>
                        <tr style="background: #f1f5f9; text-align: left;">
                            <th style="padding: 8px; border: 1px solid #cbd5e1;">Service / Item Particulars</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1;">Rate (₹)</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1;">Qty / Days</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Room & Bed Rent (${admission.wardName})</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">₹${admission.bedDailyTariff}</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">${admission.admitDays} Days</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${charges.roomCharges.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Nursing Care & Monitoring</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">₹${admission.nursingTariff}</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">${admission.admitDays} Days</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${charges.nursingCharges.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Doctor Daily Clinical Visits</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">₹${admission.doctorVisitDailyTariff}</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">${admission.admitDays} Rounds</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${charges.doctorConsultationCharges.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Pharmacy Medicines & Surgical Consumables</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">-</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Ledger Total</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${charges.pharmacyCharges.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Laboratory Investigations & Diagnostic Tests</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">-</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Ledger Total</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${charges.labCharges.toLocaleString('en-IN')}</td>
                        </tr>
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 280px; font-size: 13px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>Subtotal:</span>
                            <b>₹${charges.totalEstimated.toLocaleString('en-IN')}</b>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #10b981;">
                            <span>Less: Advance Paid:</span>
                            <b>- ₹${charges.advancePaid.toLocaleString('en-IN')}</b>
                        </div>
                        <div style="border-top: 2px solid #0f172a; padding-top: 6px; display: flex; justify-content: space-between; font-size: 15px; font-weight: 800;">
                            <span>${charges.netBalance < 0 ? 'Refundable:' : 'Net Payable:'}</span>
                            <span style="color: ${charges.netBalance < 0 ? '#10b981' : '#e11d48'};">₹${Math.abs(charges.netBalance).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 24px; padding: 10px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; font-size: 11px; color: #64748b;">
                    * Healthcare clinical services are exempt from GST under Notification No. 12/2017-Central Tax (Rate).
                    This is an electronically generated official Hospital Tax Clearance Slip.
                </div>
            </div>
        `;

        document.getElementById('printableIpdBillModal').classList.add('active');
    };

    // ==========================================================================
    // PHASE 5: ENTERPRISE OPERATIONS — OT, TPA CLAIMS & PROCUREMENT LOGIC (M16 - M18)
    // ==========================================================================

    let currentTpaPayerFilter = "all";

    // 1. OT / Surgery Suite & WHO Safety Checklist (M16)
    function renderOtManagement() {
        const otGrid = document.getElementById('otTheatresStatusGrid');
        const surgTbody = document.getElementById('otSurgeriesTableBody');
        if (!otGrid || !surgTbody) return;

        // Render OT Theatres Matrix
        otGrid.innerHTML = MediData.otTheatres.map(ot => {
            let statusBadge = '';
            let borderStyle = '';
            if (ot.status === 'In Surgery') {
                statusBadge = '<span class="badge badge-rose pulse-red"><i class="bi bi-circle-fill" style="font-size: 8px;"></i> In Surgery</span>';
                borderStyle = 'border-color: rgba(244, 63, 94, 0.4); background: linear-gradient(180deg, rgba(244, 63, 94, 0.05), var(--bg-surface));';
            } else if (ot.status === 'Ready / Scheduled') {
                statusBadge = '<span class="badge badge-indigo"><i class="bi bi-clock-fill"></i> Scheduled</span>';
                borderStyle = 'border-color: rgba(99, 102, 241, 0.4); background: linear-gradient(180deg, rgba(99, 102, 241, 0.05), var(--bg-surface));';
            } else if (ot.status === 'Sanitizing') {
                statusBadge = '<span class="badge badge-amber"><i class="bi bi-stars"></i> Sanitizing</span>';
                borderStyle = 'border-color: rgba(245, 158, 11, 0.4);';
            } else {
                statusBadge = '<span class="badge badge-emerald"><i class="bi bi-check-circle-fill"></i> Available</span>';
                borderStyle = 'border-color: rgba(16, 185, 129, 0.4);';
            }

            return `
                <div class="card" style="padding: 16px; ${borderStyle}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div>
                            <div style="font-weight: 800; font-size: 14.5px; color: var(--text-heading);">${ot.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted);">${ot.type} • ${ot.floor}</div>
                        </div>
                        ${statusBadge}
                    </div>
                    ${ot.currentSurgery ? `
                        <div style="background: var(--bg-main); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-top: 6px;">
                            <div style="font-weight: 700; font-size: 12.5px; color: var(--primary-600);"><i class="bi bi-activity"></i> ${ot.currentSurgery}</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Chief Surgeon: <b>${ot.surgeon}</b></div>
                        </div>
                    ` : `
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 14px;">No active procedure. Cleaned & ready for emergency or planned intake.</div>
                    `}
                </div>
            `;
        }).join('');

        // Render Scheduled Surgeries Worklist
        surgTbody.innerHTML = MediData.otSurgeries.map(surg => {
            const who = surg.whoChecklist;
            const signInDone = who.signIn?.completed;
            const timeOutDone = who.timeOut?.completed;
            const signOutDone = who.signOut?.completed;

            return `
                <tr>
                    <td>
                        <div style="font-weight: 800; color: var(--primary-600); font-family: 'JetBrains Mono', monospace;">${surg.id}</div>
                        <div style="font-size: 11.5px; font-weight: 700; color: var(--text-heading);"><i class="bi bi-hospital"></i> ${surg.otName}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${surg.patientName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">IPD: ${surg.ipdNo} • Bed: ${surg.bedNo}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; font-size: 13px; color: var(--text-heading);">${surg.procedureName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Indication: ${surg.indication}</div>
                    </td>
                    <td>
                        <div style="font-size: 12px;">Surgeon: <b>${surg.chiefSurgeon}</b></div>
                        <div style="font-size: 11px; color: var(--text-muted);">Anesth: ${surg.anesthetist} • Scrub: ${surg.scrubNurse}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; font-size: 12px;">${surg.timeSlot}</div>
                        <div style="font-size: 10.5px; color: var(--primary-600);">${surg.anesthesiaType}</div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 4px; align-items: center;">
                            <span class="badge ${signInDone ? 'badge-emerald' : 'badge-outline'}" style="font-size: 9.5px;" title="Sign-In (Before Anesthesia)">
                                <i class="bi ${signInDone ? 'bi-check-lg' : 'bi-dash'}"></i> Sign-In
                            </span>
                            <span class="badge ${timeOutDone ? 'badge-emerald' : 'badge-outline'}" style="font-size: 9.5px;" title="Time-Out (Before Incision)">
                                <i class="bi ${timeOutDone ? 'bi-check-lg' : 'bi-dash'}"></i> Time-Out
                            </span>
                            <span class="badge ${signOutDone ? 'badge-emerald' : 'badge-outline'}" style="font-size: 9.5px;" title="Sign-Out (Before Leaving OT)">
                                <i class="bi ${signOutDone ? 'bi-check-lg' : 'bi-dash'}"></i> Sign-Out
                            </span>
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 800; font-size: 13px;">₹${surg.packageAmount.toLocaleString('en-IN')}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Consumables: ₹${surg.consumablesTotal.toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                        <button class="btn btn-outline btn-xs" onclick="openWhoChecklistModal('${surg.id}')" title="Open Surgical Safety Checklist">
                            <i class="bi bi-shield-check"></i> Checklist
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.openBookSurgeryModal = function() {
        const patSelect = document.getElementById('surgPatientSelect');
        const otSelect = document.getElementById('surgOtSelect');
        const surgeonSelect = document.getElementById('surgChiefSurgeonSelect');

        if (patSelect) {
            patSelect.innerHTML = MediData.ipdAdmissions.map(a => `<option value="${a.ipdNo}">${a.patientName} (${a.bedNo} • ${a.ipdNo})</option>`).join('');
        }
        if (otSelect) {
            otSelect.innerHTML = MediData.otTheatres.map(o => `<option value="${o.id}">${o.name} (${o.status})</option>`).join('');
        }
        if (surgeonSelect) {
            surgeonSelect.innerHTML = MediData.doctors.map(d => `<option value="${d.name}">${d.name} (${d.specialty})</option>`).join('');
        }

        document.getElementById('bookSurgeryModal').classList.add('active');
    };

    window.submitBookSurgery = function() {
        const ipdNo = document.getElementById('surgPatientSelect').value;
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo) || MediData.ipdAdmissions[0];
        const otId = document.getElementById('surgOtSelect').value;
        const ot = MediData.otTheatres.find(o => o.id === otId) || MediData.otTheatres[0];
        const procedure = document.getElementById('surgProcedureInput').value || 'Elective Surgical Procedure';
        const indication = document.getElementById('surgIndicationInput').value || 'Clinical surgical indication';
        const surgeon = document.getElementById('surgChiefSurgeonSelect').value;
        const anesthetist = document.getElementById('surgAnesthetistSelect').value;
        const anesthType = document.getElementById('surgAnesthesiaTypeSelect').value;
        const date = document.getElementById('surgDateInput').value;
        const slot = document.getElementById('surgSlotSelect').value;
        const packageAmt = parseInt(document.getElementById('surgPackageAmountInput').value) || 50000;

        const newSurgId = `SURG-2026-00${Math.floor(45 + Math.random() * 10)}`;

        const newSurgery = {
            id: newSurgId,
            otId: ot.id,
            otName: ot.name,
            patientId: admission.patientId,
            patientName: admission.patientName,
            ipdNo: admission.ipdNo,
            bedNo: admission.bedNo,
            procedureName: procedure,
            indication: indication,
            chiefSurgeon: surgeon,
            assistantSurgeon: "Dr. Siddharth Sen",
            anesthetist: anesthetist,
            scrubNurse: "Staff Nurse Sarita",
            anesthesiaType: anesthType,
            scheduleDate: date,
            timeSlot: slot,
            status: "Scheduled",
            whoChecklist: {
                signIn: { completed: false, verifiedBy: null, time: null },
                timeOut: { completed: false, verifiedBy: null, time: null },
                signOut: { completed: false, verifiedBy: null, time: null }
            },
            implantsConsumables: [
                { item: "Surgical Drape Kit & Suture Pack", qty: 1, cost: 3500 }
            ],
            packageAmount: packageAmt,
            surgeonFee: Math.round(packageAmt * 0.4),
            anesthesiaFee: Math.round(packageAmt * 0.15),
            otCharges: Math.round(packageAmt * 0.3),
            consumablesTotal: 3500
        };

        MediData.otSurgeries.unshift(newSurgery);
        ot.status = 'Ready / Scheduled';
        ot.currentSurgery = procedure;
        ot.surgeon = surgeon;

        playAudioFx('chime');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${surgeon}`,
            action: 'OT_SURGERY_BOOKED',
            entity: `Surgery #${newSurgId}`,
            tenant: MediData.tenant.id,
            details: `Booked ${procedure} in ${ot.name} for ${admission.patientName}. Slot: ${slot}.`,
            ip: '192.168.1.108'
        });
        renderAuditLogs();

        document.getElementById('bookSurgeryModal').classList.remove('active');
        showToast(`Surgery ${procedure} booked in ${ot.name}!`, 'success', 'OT Management');
        renderOtManagement();
    };

    window.openWhoChecklistModal = function(surgId) {
        const surgery = MediData.otSurgeries.find(s => s.id === surgId);
        if (!surgery) return;

        const who = surgery.whoChecklist;
        const container = document.getElementById('whoChecklistModalBody');

        container.innerHTML = `
            <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-main); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 800; font-size: 15px; color: var(--text-heading);">${surgery.procedureName}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">Patient: <b>${surgery.patientName}</b> (${surgery.ipdNo}) • Surgeon: <b>${surgery.chiefSurgeon}</b></div>
                </div>
                <span class="badge badge-purple">${surgery.id}</span>
            </div>

            <!-- Stage 1: SIGN-IN (Before induction of anesthesia) -->
            <div class="card" style="margin-bottom: 14px; border-left: 4px solid ${who.signIn?.completed ? 'var(--emerald-500)' : 'var(--amber-500)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--text-heading);">1. SIGN IN (Before Induction of Anesthesia)</h4>
                        <div style="font-size: 11px; color: var(--text-muted);">With nurse and anesthesia professional</div>
                    </div>
                    ${who.signIn?.completed ? `
                        <span class="badge badge-emerald"><i class="bi bi-check-circle-fill"></i> Verified at ${who.signIn.time} (${who.signIn.verifiedBy})</span>
                    ` : `
                        <button class="btn btn-emerald btn-xs" onclick="signWhoChecklistStage('${surgery.id}', 'signIn')">
                            <i class="bi bi-check2"></i> Verify & Sign-In
                        </button>
                    `}
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 12px; color: var(--text-secondary);">
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Patient identity, site & consent confirmed</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Surgical site marked by surgeon</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Anesthesia machine & medication check complete</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Pulse oximeter on patient and functioning</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Known allergy checked: <b>Penicillin (Moderate)</b></div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Difficult airway / aspiration risk evaluated</div>
                </div>
            </div>

            <!-- Stage 2: TIME-OUT (Before skin incision) -->
            <div class="card" style="margin-bottom: 14px; border-left: 4px solid ${who.timeOut?.completed ? 'var(--emerald-500)' : 'var(--amber-500)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--text-heading);">2. TIME OUT (Before Skin Incision)</h4>
                        <div style="font-size: 11px; color: var(--text-muted);">Entire team actively participates</div>
                    </div>
                    ${who.timeOut?.completed ? `
                        <span class="badge badge-emerald"><i class="bi bi-check-circle-fill"></i> Verified at ${who.timeOut.time} (${who.timeOut.verifiedBy})</span>
                    ` : `
                        <button class="btn btn-emerald btn-xs" onclick="signWhoChecklistStage('${surgery.id}', 'timeOut')">
                            <i class="bi bi-check2"></i> Verify & Time-Out
                        </button>
                    `}
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 12px; color: var(--text-secondary);">
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Team members introduce name and role</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Surgeon, Anesthetist & Nurse confirm patient & site</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Anticipated critical steps & blood loss reviewed</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Antibiotic prophylaxis given within past 60 min</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Essential diagnostic imaging displayed</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Sterility indicators verified by scrub nurse</div>
                </div>
            </div>

            <!-- Stage 3: SIGN-OUT (Before patient leaves operating room) -->
            <div class="card" style="border-left: 4px solid ${who.signOut?.completed ? 'var(--emerald-500)' : 'var(--amber-500)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--text-heading);">3. SIGN OUT (Before Patient Leaves OT)</h4>
                        <div style="font-size: 11px; color: var(--text-muted);">With nurse, anesthesia and surgeon</div>
                    </div>
                    ${who.signOut?.completed ? `
                        <span class="badge badge-emerald"><i class="bi bi-check-circle-fill"></i> Verified at ${who.signOut.time} (${who.signOut.verifiedBy})</span>
                    ` : `
                        <button class="btn btn-emerald btn-xs" onclick="signWhoChecklistStage('${surgery.id}', 'signOut')">
                            <i class="bi bi-check2"></i> Verify & Sign-Out
                        </button>
                    `}
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 12px; color: var(--text-secondary);">
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Name of procedure recorded accurately</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Instrument, sponge and needle counts 100% correct</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Specimen labeled correctly with patient name</div>
                    <div><i class="bi bi-check-square-fill text-emerald"></i> Key concerns for post-op recovery & PACU handover discussed</div>
                </div>
            </div>
        `;

        document.getElementById('whoChecklistModal').classList.add('active');
    };

    window.signWhoChecklistStage = function(surgId, stage) {
        const surgery = MediData.otSurgeries.find(s => s.id === surgId);
        if (!surgery) return;

        surgery.whoChecklist[stage] = {
            completed: true,
            verifiedBy: MediData.currentUser.name,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        playAudioFx('success');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `${MediData.currentUser.name}`,
            action: `WHO_CHECKLIST_${stage.toUpperCase()}_SIGNED`,
            entity: `Surgery #${surgId}`,
            tenant: MediData.tenant.id,
            details: `WHO Surgical Checklist stage ${stage} completed for ${surgery.patientName} (${surgery.procedureName}).`,
            ip: '192.168.1.108'
        });
        renderAuditLogs();

        showToast(`WHO Checklist ${stage} verified & recorded!`, 'success', 'Surgical Safety');
        openWhoChecklistModal(surgId);
        renderOtManagement();
    };

    // 2. Insurance & TPA Claims Management Desk (M17, INS-01 to 05)
    function renderTpaClaimsDesk(filterText = '', payerFilter = currentTpaPayerFilter) {
        currentTpaPayerFilter = payerFilter;
        const tbody = document.getElementById('tpaClaimsTableBody');
        if (!tbody) return;

        let filtered = MediData.tpaClaims;
        if (payerFilter !== 'all') {
            filtered = filtered.filter(c => c.tpaCode === payerFilter);
        }
        if (filterText) {
            filtered = filtered.filter(c => {
                const text = `${c.id} ${c.patientName} ${c.policyNo} ${c.payerName} ${c.status}`.toLowerCase();
                return text.includes(filterText.toLowerCase());
            });
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No matching TPA claim records found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(claim => {
            let statusBadge = '';
            if (claim.status.includes('Settled')) {
                statusBadge = `<span class="badge badge-emerald"><i class="bi bi-check2-all"></i> ${claim.status}</span>`;
            } else if (claim.status.includes('Granted') || claim.status.includes('Approved')) {
                statusBadge = `<span class="badge badge-purple"><i class="bi bi-shield-check"></i> ${claim.status}</span>`;
            } else if (claim.status.includes('Pending') || claim.status.includes('Query')) {
                statusBadge = `<span class="badge badge-amber"><i class="bi bi-exclamation-circle-fill"></i> ${claim.status}</span>`;
            } else {
                statusBadge = `<span class="badge badge-outline">${claim.status}</span>`;
            }

            return `
                <tr>
                    <td>
                        <div style="font-weight: 800; color: var(--primary-600); font-family: 'JetBrains Mono', monospace;">${claim.id}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Policy: <b>${claim.policyNo}</b></div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-primary);">${claim.patientName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">IPD: <b>${claim.ipdNo}</b></div>
                    </td>
                    <td>
                        <div style="font-weight: 700; font-size: 12.5px; color: var(--text-heading);">${claim.payerName}</div>
                        <span class="badge badge-outline" style="font-size: 10px;">${claim.tpaCode}</span>
                    </td>
                    <td>
                        <div style="font-size: 12px; font-weight: 600; color: var(--text-primary); max-width: 220px;">${claim.provisionalDiagnosis}</div>
                        ${claim.preauthQuery ? `<div style="font-size: 10.5px; color: var(--rose-500); font-weight: 700; margin-top: 2px;"><i class="bi bi-chat-left-dots-fill"></i> Query: ${claim.preauthQuery}</div>` : ''}
                    </td>
                    <td>
                        <div style="font-size: 12px;">Req: <b>₹${claim.requestedAmount.toLocaleString('en-IN')}</b></div>
                        <div style="font-size: 12px; color: var(--emerald-600); font-weight: 800;">Appr: ₹${claim.initialApprovedAmount.toLocaleString('en-IN')}</div>
                    </td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                            ${claim.claimPacketFiles.map(f => `<span class="badge badge-outline" style="font-size: 9.5px;"><i class="bi bi-paperclip"></i> ${f.split('_')[0]}</span>`).join('')}
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-outline btn-xs" onclick="openPrintablePreauthLetter('${claim.id}')" title="Print Pre-Auth Packet">
                                <i class="bi bi-printer"></i> Letter
                            </button>
                            <button class="btn btn-primary btn-xs" onclick="showToast('Pre-Auth Enhancement Request Dispatched to TPA Desk!')" title="Request Enhancement">
                                <i class="bi bi-arrow-up-right-circle"></i> +Enhance
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.filterTpaClaimsTable = function() {
        const input = document.getElementById('tpaSearchInput');
        const text = input ? input.value : '';
        renderTpaClaimsDesk(text);
    };

    window.filterTpaByPayer = function(payerCode) {
        currentTpaPayerFilter = payerCode;
        const pills = document.querySelectorAll('#tpaPayerFilterPills .pill-btn');
        pills.forEach(p => {
            if ((payerCode === 'all' && p.innerText.includes('All')) || p.innerText.includes(payerCode) || (payerCode === 'STAR-HLTH' && p.innerText.includes('Star')) || (payerCode === 'HDFC-ERGO' && p.innerText.includes('HDFC')) || (payerCode === 'PM-JAY' && p.innerText.includes('PM-JAY'))) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
        renderTpaClaimsDesk('', payerCode);
    };

    window.openNewPreauthClaimModal = function() {
        const patSelect = document.getElementById('tpaPatientSelect');
        const payerSelect = document.getElementById('tpaPayerSelect');

        if (patSelect) {
            patSelect.innerHTML = MediData.ipdAdmissions.map(a => `<option value="${a.ipdNo}">${a.patientName} (${a.bedNo} • ${a.ipdNo})</option>`).join('');
        }
        if (payerSelect) {
            payerSelect.innerHTML = MediData.insurancePayers.map(p => `<option value="${p.code}">${p.name} (${p.code})</option>`).join('');
        }

        document.getElementById('newPreauthClaimModal').classList.add('active');
    };

    window.submitNewTpaClaim = function() {
        const ipdNo = document.getElementById('tpaPatientSelect').value;
        const admission = MediData.ipdAdmissions.find(a => a.ipdNo === ipdNo) || MediData.ipdAdmissions[0];
        const payerCode = document.getElementById('tpaPayerSelect').value;
        const payer = MediData.insurancePayers.find(p => p.code === payerCode) || MediData.insurancePayers[0];
        const policyNo = document.getElementById('tpaPolicyNoInput').value || 'POL-2026-9941';
        const reqAmt = parseInt(document.getElementById('tpaRequestedAmountInput').value) || 60000;
        const diag = document.getElementById('tpaDiagnosisInput').value || admission.admissionReason;

        const newClaimId = `CLM-2026-0${Math.floor(82 + Math.random() * 10)}`;

        const newClaim = {
            id: newClaimId,
            ipdNo: admission.ipdNo,
            patientName: admission.patientName,
            patientId: admission.patientId,
            policyNo: policyNo,
            payerName: payer.name,
            tpaCode: payer.code,
            admissionDate: admission.admitDateTime.split(',')[0],
            provisionalDiagnosis: diag,
            requestedAmount: reqAmt,
            initialApprovedAmount: Math.round(reqAmt * 0.8), // 80% instant approval guarantee
            enhancementRequested: 0,
            finalSettledAmount: 0,
            coPayPercent: 10,
            nonPayableDeductions: 2500,
            status: "Initial Approval Granted",
            preauthQuery: null,
            claimPacketFiles: ["Govt_ID_Proof.pdf", "TPA_Insurance_Card.pdf", "Doctor_First_Prescription.pdf", "Diagnostic_Workup_Reports.pdf"],
            lastUpdated: "Just Now"
        };

        MediData.tpaClaims.unshift(newClaim);

        playAudioFx('chime');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'TPA Desk Executive',
            action: 'TPA_PREAUTH_SUBMITTED',
            entity: `Claim #${newClaimId}`,
            tenant: MediData.tenant.id,
            details: `Submitted Cashless Pre-Auth packet of ₹${reqAmt.toLocaleString('en-IN')} to ${payer.name} for ${admission.patientName}.`,
            ip: '192.168.1.115'
        });
        renderAuditLogs();

        document.getElementById('newPreauthClaimModal').classList.remove('active');
        showToast(`Pre-Auth of ₹${reqAmt.toLocaleString('en-IN')} submitted to ${payer.code}!`, 'success', 'TPA Cashless Desk');
        renderTpaClaimsDesk();
    };

    window.openPrintablePreauthLetter = function(claimId) {
        const claim = MediData.tpaClaims.find(c => c.id === claimId) || MediData.tpaClaims[0];
        const container = document.getElementById('printablePreauthContent');

        container.innerHTML = `
            <div class="discharge-sheet-container">
                <div class="discharge-header-box">
                    <div>
                        <h2 style="margin: 0; color: #0284c7; font-size: 20px; font-weight: 800;">${MediData.tenant.name}</h2>
                        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${MediData.tenant.address} • ROHINI Code: 89004128</div>
                        <div style="font-size: 11px; color: #64748b;">Hospital TPA Desk: ${MediData.tenant.phone} • Email: cashless@apexhealth.in</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; font-weight: 800; color: #0f172a;">CASHLESS PRE-AUTHORIZATION REQUEST</div>
                        <div style="font-size: 11px; font-weight: 700; color: #0284c7;">Claim ID: ${claim.id}</div>
                    </div>
                </div>

                <div class="discharge-grid-meta">
                    <div><b>Patient Name:</b> ${claim.patientName}</div>
                    <div><b>IPD Number:</b> ${claim.ipdNo}</div>
                    <div><b>Insurance / TPA:</b> ${claim.payerName} (${claim.tpaCode})</div>
                    <div><b>Policy / Card ID:</b> ${claim.policyNo}</div>
                    <div><b>Admission Date:</b> ${claim.admissionDate}</div>
                    <div><b>Pre-Auth Status:</b> <span style="color: #10b981; font-weight: 800;">${claim.status}</span></div>
                </div>

                <div class="discharge-section-title">Clinical Diagnosis & Planned Treatment</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                    ${claim.provisionalDiagnosis}
                </div>

                <div class="discharge-section-title">Financial Pre-Authorization Breakdown</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 16px;">
                    <thead>
                        <tr style="background: #f1f5f9; text-align: left;">
                            <th style="padding: 8px; border: 1px solid #cbd5e1;">Particulars</th>
                            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Estimated Hospitalization Package Total</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700;">₹${claim.requestedAmount.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; color: #10b981;"><b>Initial Cashless Guarantee Approved by TPA</b></td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 800; color: #10b981;">₹${claim.initialApprovedAmount.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #cbd5e1;">Co-Payment (${claim.coPayPercent}%) & Non-Payable Disallowance Estimate</td>
                            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700; color: #e11d48;">₹${claim.nonPayableDeductions.toLocaleString('en-IN')}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="discharge-section-title">Mandatory Attached Document Checklist</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 11.5px; color: #334155; margin-bottom: 20px;">
                    ${claim.claimPacketFiles.map(f => `<div><i class="bi bi-check-circle-fill" style="color: #10b981;"></i> ${f} [E-Signed & Attached]</div>`).join('')}
                </div>

                <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 14px; border-top: 1px solid #cbd5e1;">
                    <div>
                        <div style="font-size: 11px; color: #64748b;">Hospital TPA Desk Official Stamp:</div>
                        <div style="font-weight: 800; color: #0284c7; font-size: 13px; margin-top: 2px;">Apex Healthcare Cashless Operations</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; color: #0f172a; font-size: 13px;">Authorized TPA Signatory</div>
                        <div style="font-size: 10px; color: #0284c7; font-weight: 700; margin-top: 4px;">[ Digitally Generated Certificate ]</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('printablePreauthLetterModal').classList.add('active');
    };

    // 3. Hospital Procurement & Central Stores (M18)
    function renderHospitalProcurement() {
        const invTbody = document.getElementById('hospitalInventoryTableBody');
        const poTbody = document.getElementById('purchaseOrdersTableBody');
        if (!invTbody || !poTbody) return;

        // Render Inventory Master
        invTbody.innerHTML = MediData.hospitalInventory.map(item => {
            const isLow = item.currentStock <= item.reorderLevel;
            return `
                <tr>
                    <td>
                        <div style="font-weight: 800; color: var(--primary-600); font-family: 'JetBrains Mono', monospace;">${item.id}</div>
                        <div style="font-weight: 700; color: var(--text-heading);">${item.name}</div>
                    </td>
                    <td><span class="badge badge-purple">${item.category}</span></td>
                    <td>
                        <div>${item.unit}</div>
                        <div style="font-size: 11px; color: var(--text-muted);"><i class="bi bi-geo-alt-fill"></i> ${item.location}</div>
                    </td>
                    <td>
                        <div style="font-weight: 800; font-size: 14px; color: ${isLow ? 'var(--rose-500)' : 'var(--emerald-600)'};">${item.currentStock} Units</div>
                    </td>
                    <td><b>${item.reorderLevel}</b> Units</td>
                    <td><b>₹${item.unitCost}</b></td>
                    <td style="font-size: 12px; color: var(--text-muted);">${item.supplier}</td>
                    <td>
                        ${isLow ? `
                            <span class="badge badge-rose"><i class="bi bi-exclamation-triangle-fill"></i> Low Stock</span>
                        ` : `
                            <span class="badge badge-emerald"><i class="bi bi-check2"></i> Optimal</span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');

        // Render Purchase Orders
        poTbody.innerHTML = MediData.purchaseOrders.map(po => {
            const isReceived = po.status.includes('GRN Received');
            return `
                <tr>
                    <td>
                        <div style="font-weight: 800; color: var(--primary-600); font-family: 'JetBrains Mono', monospace;">${po.id}</div>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: var(--text-heading);">${po.supplier}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${po.raisedBy}</div>
                    </td>
                    <td>${po.date}</td>
                    <td>
                        <div style="font-size: 12px;">
                            ${po.items.map(i => `<div>• ${i.name} (Qty: <b>${i.qty}</b>)</div>`).join('')}
                        </div>
                    </td>
                    <td style="font-weight: 800; font-size: 13.5px; color: var(--text-primary);">₹${po.totalAmount.toLocaleString('en-IN')}</td>
                    <td>${po.expectedDelivery}</td>
                    <td>
                        <span class="badge ${isReceived ? 'badge-emerald' : 'badge-amber'}">${po.status}</span>
                    </td>
                    <td>
                        ${isReceived ? `
                            <span class="badge badge-outline" style="font-size: 10px;"><i class="bi bi-check-all"></i> Stock Updated</span>
                        ` : `
                            <button class="btn btn-emerald btn-xs" onclick="receiveGrnForPo('${po.id}')">
                                <i class="bi bi-box-arrow-in-down"></i> Receive GRN
                            </button>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.openNewPurchaseOrderModal = function() {
        const itemSelect = document.getElementById('poItemSelect');
        if (itemSelect) {
            itemSelect.innerHTML = MediData.hospitalInventory.map(i => `<option value="${i.id}">${i.name} (${i.unit} • ₹${i.unitCost})</option>`).join('');
        }
        document.getElementById('newPurchaseOrderModal').classList.add('active');
    };

    window.submitNewPurchaseOrder = function() {
        const supplier = document.getElementById('poSupplierSelect').value;
        const itemId = document.getElementById('poItemSelect').value;
        const item = MediData.hospitalInventory.find(i => i.id === itemId) || MediData.hospitalInventory[0];
        const qty = parseInt(document.getElementById('poQtyInput').value) || 20;
        const deliveryDate = document.getElementById('poDeliveryDate').value;

        const total = qty * item.unitCost;
        const newPoId = `PO-2026-00${Math.floor(46 + Math.random() * 10)}`;

        const newPo = {
            id: newPoId,
            supplier: supplier,
            date: "Today",
            items: [
                { name: item.name, qty: qty, rate: item.unitCost, total: total }
            ],
            totalAmount: total,
            status: "Approved & Sent to Vendor",
            expectedDelivery: deliveryDate,
            raisedBy: "Purchase Mgr. R. Sharma"
        };

        MediData.purchaseOrders.unshift(newPo);

        playAudioFx('chime');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'Purchase Manager (INV-04)',
            action: 'PURCHASE_ORDER_GENERATED',
            entity: `PO #${newPoId}`,
            tenant: MediData.tenant.id,
            details: `Created Purchase Order of ₹${total.toLocaleString('en-IN')} for ${qty} × ${item.name} from ${supplier}.`,
            ip: '192.168.1.118'
        });
        renderAuditLogs();

        document.getElementById('newPurchaseOrderModal').classList.remove('active');
        showToast(`Purchase Order ${newPoId} created for ₹${total.toLocaleString('en-IN')}!`, 'success', 'Hospital Procurement');
        renderHospitalProcurement();
    };

    window.receiveGrnForPo = function(poId) {
        const po = MediData.purchaseOrders.find(p => p.id === poId);
        if (!po) return;

        po.status = "GRN Received & Stock Updated";

        // Increment inventory
        po.items.forEach(poItem => {
            const match = MediData.hospitalInventory.find(i => poItem.name.includes(i.name.split(' ')[0]) || i.name.includes(poItem.name.split(' ')[0]));
            if (match) {
                match.currentStock += poItem.qty;
            }
        });

        playAudioFx('success');
        triggerConfetti();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'Central Store In-Charge (INV-05)',
            action: 'GRN_RECEIVED_STOCK_UPDATED',
            entity: `GRN for PO #${poId}`,
            tenant: MediData.tenant.id,
            details: `Goods received and verified for PO ${poId}. Stock balances automatically reconciled in central store ledger.`,
            ip: '192.168.1.118'
        });
        renderAuditLogs();

        showToast(`GRN received for ${poId}! Central store stock updated.`, 'success', 'Goods Receipt Note');
        renderHospitalProcurement();
    };

    window.openIssueStockModal = function() {
        const itemSelect = document.getElementById('issueItemSelect');
        if (itemSelect) {
            itemSelect.innerHTML = MediData.hospitalInventory.map(i => `<option value="${i.id}">${i.name} (Avail: ${i.currentStock} Units)</option>`).join('');
        }
        document.getElementById('issueStockModal').classList.add('active');
    };

    window.submitIssueStock = function() {
        const itemId = document.getElementById('issueItemSelect').value;
        const dept = document.getElementById('issueDepartmentSelect').value;
        const qty = parseInt(document.getElementById('issueQtyInput').value) || 5;

        const item = MediData.hospitalInventory.find(i => i.id === itemId);
        if (!item) return;

        if (item.currentStock < qty) {
            showToast(`Insufficient stock! Available: ${item.currentStock}`, 'error');
            return;
        }

        item.currentStock -= qty;

        playAudioFx('click');

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'Central Storekeeper (INV-06)',
            action: 'STOCK_ISSUED_TO_DEPARTMENT',
            entity: `Item #${item.id}`,
            tenant: MediData.tenant.id,
            details: `Issued ${qty} × ${item.name} to ${dept}. Remaining balance: ${item.currentStock}.`,
            ip: '192.168.1.118'
        });
        renderAuditLogs();

        document.getElementById('issueStockModal').classList.remove('active');
        showToast(`Issued ${qty} units of ${item.name} to ${dept}`, 'success', 'Stock Transfer');
        renderHospitalProcurement();
    };

    // 4. Multi-Branch Enterprise Central Hub (M01, TEN-02)
    function renderMultiBranchHub() {
        const grid = document.getElementById('multiBranchCardsGrid');
        if (!grid) return;

        grid.innerHTML = MediData.multiBranchStats.map(branch => {
            return `
                <div class="card" style="padding: 20px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div>
                            <span class="badge badge-purple" style="margin-bottom: 6px;">${branch.id}</span>
                            <h4 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--text-heading);">${branch.name}</h4>
                            <div style="font-size: 11.5px; color: var(--text-muted);">${branch.type}</div>
                        </div>
                        <span class="badge badge-emerald"><i class="bi bi-circle-fill" style="font-size: 8px;"></i> ${branch.status}</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 16px 0; background: var(--bg-main); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">Total Beds</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--text-primary);"><i class="bi bi-hospital"></i> ${branch.beds} Beds</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">Doctors On Roster</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--text-primary);"><i class="bi bi-person-badge"></i> ${branch.doctors} Doctors</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">Today's Footfall</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--primary-600);"><i class="bi bi-people-fill"></i> ${branch.todayFootfall} Patients</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">Bed Occupancy</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--emerald-600);"><i class="bi bi-pie-chart-fill"></i> ${branch.bedOccupancy}</div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px dashed var(--border-subtle);">
                        <div style="font-size: 12.5px;">Monthly Revenue: <b style="color: var(--text-heading);">${branch.monthRevenue}</b></div>
                        <button class="btn btn-outline btn-xs" onclick="showToast('Switched operational context to ${branch.name}')">
                            <i class="bi bi-box-arrow-in-right"></i> Manage Branch
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --------------------------------------------------------------------------
    // 7. Preserved Phase 1 & 2 Functions (EMR, Billing, Portal, Booking, etc.)
    // --------------------------------------------------------------------------
    function renderPatientsTable(filterText = '') {
        const tbody = document.getElementById('patientsTableBody');
        if (!tbody) return;

        const filtered = MediData.patients.filter(p => {
            const text = `${p.name} ${p.mrn} ${p.phone} ${p.bloodGroup}`.toLowerCase();
            return text.includes(filterText.toLowerCase());
        });

        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${p.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" alt="">
                        <div>
                            <div style="font-weight: 700; color: var(--text-primary); cursor: pointer;" onclick="openPatientHistory('${p.id}')">${p.name}</div>
                            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--primary-600);">${p.mrn}</div>
                        </div>
                    </div>
                </td>
                <td><b>${p.age} yrs</b> / ${p.gender}</td>
                <td><div>${p.phone}</div><div style="font-size: 11px; color: var(--text-muted);">${p.email}</div></td>
                <td><span class="badge badge-purple">${p.bloodGroup}</span></td>
                <td><div class="patient-badge-allergies">${p.allergies.map(a => `<span class="allergy-chip">${a}</span>`).join('')}</div></td>
                <td><div style="font-size: 12px; font-weight: 600;">${p.lastVisit}</div></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="quickStartConsultation('${p.id}')"><i class="bi bi-stethoscope"></i> Consult</button>
                </td>
            </tr>
        `).join('');

        const searchInput = document.getElementById('patientDirectorySearch');
        if (searchInput && !searchInput.hasListener) {
            searchInput.hasListener = true;
            searchInput.addEventListener('input', (e) => renderPatientsTable(e.target.value));
        }
    }

    function renderAppointmentsTable() {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = MediData.appointments.map(apt => `
            <tr>
                <td><span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary-600);">${apt.id}</span></td>
                <td><div style="font-weight: 700;">${apt.patientName}</div></td>
                <td><div style="font-weight: 600;">${apt.doctor}</div><div style="font-size: 11px; color: var(--text-secondary);">${apt.dept}</div></td>
                <td><div style="font-weight: 700;"><i class="bi bi-clock"></i> ${apt.slot}</div></td>
                <td><span class="badge badge-gray">${apt.type}</span></td>
                <td><span class="badge badge-green">${apt.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="generateQueueTokenForApt('${apt.id}')"><i class="bi bi-ticket-perforated"></i> Token</button>
                </td>
            </tr>
        `).join('');
    }

    function renderQueueTable() {
        const tbody = document.getElementById('queueTableBody');
        if (!tbody) return;

        tbody.innerHTML = MediData.queueTokens.map(token => `
            <tr style="${token.status === 'Called' ? 'background-color: #f0fdf4;' : ''}">
                <td><span class="token-badge-lg">${token.tokenNo}</span></td>
                <td><div style="font-weight: 700; font-size: 14px;">${token.patientName}</div><div style="font-size: 11.5px; color: var(--text-muted);">${token.phone}</div></td>
                <td><div style="font-weight: 600;">${token.doctorName}</div><div style="font-size: 11px; color: var(--primary-600); font-weight: 700;">${token.room}</div></td>
                <td><div style="font-weight: 600;">${token.time}</div></td>
                <td><span class="token-status-chip ${token.status === 'Called' ? 'status-called' : 'status-waiting'}">${token.status}</span></td>
                <td><span class="badge badge-green">${token.vitalStatus}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="callPatientToken('${token.tokenId}')"><i class="bi bi-volume-up-fill"></i> Call</button>
                    <button class="btn btn-sm btn-teal" onclick="quickStartConsultation('${token.patientId}')"><i class="bi bi-box-arrow-in-right"></i> EMR</button>
                </td>
            </tr>
        `).join('');

        renderTVWaitingBoard();
    }

    function renderTVWaitingBoard() {
        const tvGrid = document.getElementById('tvBoardGrid');
        if (!tvGrid) return;

        tvGrid.innerHTML = MediData.queueTokens.map(token => `
            <div class="tv-token-card ${token.status === 'Called' ? 'now-serving' : ''}">
                <div>
                    <div class="tv-token-badge">${token.tokenNo}</div>
                    <div class="tv-patient-name">${token.patientName}</div>
                </div>
                <div class="tv-doctor-box">
                    <div class="doc-title">${token.doctorName}</div>
                    <div class="tv-room-pill">${token.room}</div>
                </div>
            </div>
        `).join('');
    }

    function renderDoctorEMR() {
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const emrAvatar = document.getElementById('emrPatientAvatar');
        const emrName = document.getElementById('emrPatientName');
        const emrMrn = document.getElementById('emrPatientMrn');

        if (emrAvatar) emrAvatar.src = p.avatar;
        if (emrName) emrName.innerText = p.name;
        if (emrMrn) emrMrn.innerText = `${p.mrn} • ABHA: ${p.abhaId}`;

        const labGrid = document.getElementById('emrLabOrdersGrid');
        if (labGrid && MediData.labTestsCatalogDetailed) {
            labGrid.innerHTML = MediData.labTestsCatalogDetailed.map(lab => {
                const isChecked = (state.activeEncounter.labOrders || []).includes(lab.code);
                return `
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; padding: 6px 10px; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); cursor: pointer; flex: 1; min-width: 220px;">
                        <input type="checkbox" value="${lab.code}" ${isChecked ? 'checked' : ''} onchange="toggleLabOrder('${lab.code}')">
                        <span style="font-weight: 600;">${lab.name}</span>
                        <span style="margin-left: auto; color: var(--primary-600); font-size: 11px; font-weight: 700;">₹${lab.price}</span>
                    </label>
                `;
            }).join('');
        }

        const radGrid = document.getElementById('emrRadiologyOrdersGrid');
        if (radGrid && MediData.radiologyCatalogDetailed) {
            if (!state.activeEncounter.radiologyOrders) state.activeEncounter.radiologyOrders = ['RAD-01'];
            radGrid.innerHTML = MediData.radiologyCatalogDetailed.map(rad => {
                const isChecked = state.activeEncounter.radiologyOrders.includes(rad.code);
                return `
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; padding: 6px 10px; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); cursor: pointer; flex: 1; min-width: 220px;">
                        <input type="checkbox" value="${rad.code}" ${isChecked ? 'checked' : ''} onchange="toggleRadiologyOrder('${rad.code}')">
                        <div>
                            <div style="font-weight: 600; font-size: 12px;">${rad.name}</div>
                            <div style="font-size: 10.5px; color: var(--text-muted);">${rad.modality} • ${rad.bodyPart}</div>
                        </div>
                        <span style="margin-left: auto; color: #0284c7; font-size: 11px; font-weight: 700;">₹${rad.price}</span>
                    </label>
                `;
            }).join('');
        }

        renderPrescriptionItems();
    }

    window.toggleRadiologyOrder = function(code) {
        if (!state.activeEncounter.radiologyOrders) state.activeEncounter.radiologyOrders = [];
        const idx = state.activeEncounter.radiologyOrders.indexOf(code);
        if (idx > -1) state.activeEncounter.radiologyOrders.splice(idx, 1);
        else state.activeEncounter.radiologyOrders.push(code);
        showToast('Updated Radiology & Imaging Orders');
    };

    function renderPrescriptionItems() {
        const rxList = document.getElementById('emrRxItemsList');
        if (!rxList) return;

        rxList.innerHTML = state.activeEncounter.rxItems.map((item, idx) => `
            <div class="rx-item-card">
                <button class="remove-rx-btn" onclick="removePrescriptionItem(${idx})"><i class="bi bi-trash"></i></button>
                <div class="brand-title">${item.brand}</div>
                <div class="dose-spec">${item.dose} • ${item.freq} • for ${item.duration}</div>
                <div class="inst-text"><i class="bi bi-info-circle"></i> Timing: ${item.timing}</div>
            </div>
        `).join('');
    }

    function renderBillingPOS() {
        const itemsTable = document.getElementById('billingLineItemsTable');
        if (!itemsTable) return;

        let subtotal = 0;
        itemsTable.innerHTML = state.billingItems.map((item, idx) => {
            subtotal += item.amount;
            return `
                <tr>
                    <td><b>${item.item}</b></td>
                    <td>${item.qty}</td>
                    <td>₹${item.rate}</td>
                    <td><b>₹${item.amount}</b></td>
                    <td><button class="btn btn-sm btn-outline" onclick="removeBillingItem(${idx})"><i class="bi bi-x"></i></button></td>
                </tr>
            `;
        }).join('');

        const subtotalEl = document.getElementById('billSubtotalDisplay');
        const bigTotalEl = document.getElementById('billBigTotalDisplay');
        if (subtotalEl) subtotalEl.innerText = `₹ ${subtotal.toLocaleString('en-IN')}`;
        if (bigTotalEl) bigTotalEl.innerText = `₹ ${subtotal.toLocaleString('en-IN')}`;
    }

    function renderDoctorLeaves() {
        const tbody = document.getElementById('doctorLeavesTableBody');
        if (tbody) {
            tbody.innerHTML = MediData.doctorLeaves.map(l => `
                <tr><td><b>${l.doctorName}</b></td><td>${l.fromDate} to ${l.toDate}</td><td>${l.reason}</td><td><span class="badge badge-amber">${l.status}</span></td></tr>
            `).join('');
        }
    }

    function renderWaitlist() {
        const container = document.getElementById('waitlistCardsContainer');
        if (container) {
            container.innerHTML = MediData.waitlist.map(w => `
                <div style="background: var(--bg-main); padding: 10px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <div><b>${w.patientName}</b><div style="font-size: 11px; color: var(--text-muted);">${w.doctor} (${w.requestedSlot})</div></div>
                    <button class="btn btn-sm btn-emerald" onclick="showToast('Allocated slot to ${w.patientName}')">Allocate</button>
                </div>
            `).join('');
        }
    }

    function renderFeedbackTable() {
        const tbody = document.getElementById('feedbackReviewsTableBody');
        if (tbody) {
            tbody.innerHTML = MediData.feedbackReviews.map(r => `
                <tr><td><b>${r.patientName}</b></td><td>${r.doctor}</td><td>⭐⭐⭐⭐⭐</td><td><span class="badge badge-green">NPS ${r.npsScore}/10</span></td><td><span class="badge badge-gray">Care</span></td><td>"${r.comment}"</td><td>${r.date}</td></tr>
            `).join('');
        }
    }

    function renderSaasPlans() {
        const grid = document.getElementById('saasPlansGrid');
        if (grid) {
            grid.innerHTML = MediData.subscriptionPlans.map(plan => `
                <div class="card" style="padding: 16px; border: ${plan.badge ? '2px solid #0284c7' : '1px solid var(--border-subtle)'};">
                    ${plan.badge ? `<span class="badge badge-blue" style="margin-bottom: 6px;">${plan.badge}</span>` : ''}
                    <h3 style="font-size: 16px; font-weight: 800;">${plan.name}</h3>
                    <div style="font-size: 18px; font-weight: 900; color: var(--primary-600); margin: 6px 0;">${plan.price}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">${plan.target}</div>
                    <button class="btn ${plan.badge ? 'btn-teal' : 'btn-outline'} btn-sm" style="width: 100%;" onclick="showToast('Active tier: ${plan.name}')">Select Tier</button>
                </div>
            `).join('');
        }
    }

    function renderAuditLogs(filterAction = 'ALL') {
        const tbody = document.getElementById('auditLogsTableBody');
        if (!tbody) return;

        const filtered = filterAction === 'ALL' ? MediData.auditLogs : MediData.auditLogs.filter(l => l.action.includes(filterAction));
        tbody.innerHTML = filtered.map(log => `
            <tr>
                <td><span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--primary-600);">${log.id}</span></td>
                <td><span style="font-size: 11.5px;"><i class="bi bi-clock"></i> ${log.time}</span></td>
                <td><b>${log.actor}</b></td>
                <td><span class="badge badge-blue">${log.action}</span></td>
                <td><b>${log.entity}</b></td>
                <td style="font-size: 12px; color: var(--text-secondary);">${log.details}</td>
            </tr>
        `).join('');
    }

    window.callPatientToken = function(tokenId) {
        const token = MediData.queueTokens.find(t => t.tokenId === tokenId);
        if (token) {
            token.status = 'Called';
            playAudioFx('chime');
            renderQueueTable();
            showToast(`Calling Token ${token.tokenNo}: ${token.patientName} to Room 2`, 'success', 'Live OPD Queue Broadcast');
        }
    };

    window.quickStartConsultation = function(patientId) {
        state.currentPatientId = patientId;
        switchView('emr');
        renderDoctorEMR();
    };

    window.openPatientHistory = function(patientId) {
        const modal = document.getElementById('patient360Modal');
        const body = document.getElementById('patient360Body');
        const p = MediData.patients.find(x => x.id === patientId) || MediData.patients[0];
        if (modal && body) {
            body.innerHTML = `
                <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 14px;">
                    <img src="${p.avatar}" style="width: 50px; height: 50px; border-radius: 50%;" alt="">
                    <div><h3>${p.name}</h3><p style="font-size: 12px; color: var(--text-muted);">${p.mrn} • ABHA: ${p.abhaId}</p></div>
                </div>
            `;
            modal.classList.add('active');
        }
    };

    window.lockAndSignPrescription = function() {
        const modal = document.getElementById('prescriptionPreviewModal');
        const content = document.getElementById('printableRxContent');
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const doc = MediData.currentUser;
        const rxNo = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        if (modal && content) {
            content.innerHTML = `
                <div class="printable-document">
                    <div class="doc-hospital-header">
                        <div>
                            <div class="hosp-name">${MediData.tenant.name}</div>
                            <div class="hosp-meta">${MediData.tenant.address} • Phone: ${MediData.tenant.phone}</div>
                            <div class="hosp-meta">Reg No: <b>${MediData.tenant.regNo}</b> | Drug License: ${MediData.tenant.dlNo}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 800; color: #0284c7;">${doc.name}</div>
                            <div style="font-size: 11.5px;">NMC Reg: <b>${doc.regNo}</b></div>
                        </div>
                    </div>
                    <div class="doc-patient-bar">
                        <div><b>Patient:</b> ${p.name}</div>
                        <div><b>Age/Sex:</b> ${p.age} Y / ${p.gender}</div>
                        <div><b>MRN:</b> ${p.mrn}</div>
                        <div><b>Rx Ref:</b> ${rxNo}</div>
                    </div>
                    <div class="doc-rx-symbol">℞</div>
                    <table class="modern-table" style="margin-bottom: 16px;">
                        <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead>
                        <tbody>
                            ${state.activeEncounter.rxItems.map(item => `
                                <tr><td><b>${item.brand}</b></td><td>${item.dose}</td><td><span class="badge badge-blue">${item.freq}</span></td><td>${item.duration}</td><td>${item.timing}</td></tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="doc-signature-block">
                        <div style="font-size: 10px; color: #94a3b8;">* Digitally signed under Section 65B of Evidence Act & NMC Guidelines.</div>
                        <div class="doc-signature-line">${doc.name}<br><span style="font-size: 10px;">${doc.regNo}</span></div>
                    </div>
                </div>
            `;
            modal.classList.add('active');
            playAudioFx('success');
            triggerConfetti();
            showToast(`Prescription ${rxNo} Digitally Signed & Synced with Pharmacy!`, 'success', 'Prescription Locked');
        }
    };

    window.processPaymentAndReceipt = function() {
        const modal = document.getElementById('invoiceReceiptModal');
        const content = document.getElementById('printableInvoiceContent');
        const p = MediData.patients.find(x => x.id === state.currentPatientId) || MediData.patients[0];
        const invNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        if (modal && content) {
            content.innerHTML = `
                <div class="printable-document">
                    <div class="doc-hospital-header">
                        <div><div class="hosp-name">${MediData.tenant.name}</div><div class="hosp-meta">GSTIN: ${MediData.tenant.gstin}</div></div>
                        <div style="text-align: right;"><span class="badge badge-green">TAX INVOICE</span><div style="font-family: var(--font-mono); font-weight: 700; color: #0284c7;">${invNo}</div></div>
                    </div>
                    <div class="doc-patient-bar"><div><b>Patient:</b> ${p.name} (${p.mrn})</div><div><b>Mode:</b> ${state.selectedPaymentMode}</div><div><b>Status:</b> PAID</div></div>
                    <div style="text-align: right; margin-top: 20px;"><div style="font-size: 20px; font-weight: 900; color: #0284c7;">Total Paid: ₹2,230</div></div>
                </div>
            `;
            modal.classList.add('active');
            playAudioFx('success');
            triggerConfetti();
            showToast(`Invoice ${invNo} Settled via ${state.selectedPaymentMode}!`, 'success', 'Payment Confirmed');
        }
    };

    window.setPaymentMode = function(mode) {
        state.selectedPaymentMode = mode;
        document.querySelectorAll('.pay-mode-btn').forEach(b => {
            if (b.dataset.mode === mode) b.classList.add('active');
            else b.classList.remove('active');
        });
    };

    window.toggleLabOrder = function(code) {
        const idx = state.activeEncounter.labOrders.indexOf(code);
        if (idx > -1) state.activeEncounter.labOrders.splice(idx, 1);
        else state.activeEncounter.labOrders.push(code);
        showToast('Updated Diagnostic Orders');
    };

    window.addComplaintTag = function(tag) {
        const el = document.getElementById('emrChiefComplaints');
        if (el) {
            el.value = el.value ? `${el.value}, ${tag}` : tag;
            showToast(`Added symptom: ${tag}`);
        }
    };

    window.applyRxTemplate = function(idx) {
        const tpl = MediData.prescriptionTemplates[idx];
        if (tpl) {
            state.activeEncounter.rxItems = JSON.parse(JSON.stringify(tpl.items));
            state.activeEncounter.diagnosis = tpl.diagnosis;
            renderDoctorEMR();
            showToast(`Applied clinical template: ${tpl.name}`);
        }
    };

    window.removePrescriptionItem = function(idx) {
        state.activeEncounter.rxItems.splice(idx, 1);
        renderPrescriptionItems();
    };

    window.openAddMedicineModal = function() {
        const modal = document.getElementById('addMedicineModal');
        const select = document.getElementById('medCatalogSelect');
        if (modal && select) {
            select.innerHTML = MediData.medicineMaster.map(m => `<option value="${m.id}">${m.brand} (${m.generic})</option>`).join('');
            modal.classList.add('active');
        }
    };

    window.submitAddMedicine = function() {
        const medId = document.getElementById('medCatalogSelect').value;
        const master = MediData.medicineMaster.find(m => m.id === medId);
        if (master) {
            // Check for drug allergy conflict (e.g. Augmentin for Penicillin allergic patient)
            if (master.generic.includes('Amoxicillin')) {
                const banner = document.getElementById('emrDrugSafetyBanner');
                if (banner) banner.style.display = 'flex';
                showToast('CLINICAL SAFETY ALERT: Patient has Penicillin allergy!', 'error');
            }

            state.activeEncounter.rxItems.push({
                medId: master.id,
                brand: master.brand,
                dose: "1 Tab",
                freq: "1-0-1",
                duration: "5 Days",
                timing: "After Food",
                qty: 10
            });
            renderPrescriptionItems();
            document.getElementById('addMedicineModal').classList.remove('active');
        }
    };

    window.removeBillingItem = function(idx) {
        state.billingItems.splice(idx, 1);
        renderBillingPOS();
    };

    window.openNewPatientModal = function() { document.getElementById('newPatientModal').classList.add('active'); };
    window.openBookAppointmentModal = function() { document.getElementById('bookAppointmentModal').classList.add('active'); };
    window.openQrCheckInModal = function() { document.getElementById('qrCheckInModal').classList.add('active'); };
    window.openDoctorLeaveModal = function() { document.getElementById('doctorLeaveModal').classList.add('active'); };
    window.openFeedbackSubmissionModal = function() { document.getElementById('feedbackSubmissionModal').classList.add('active'); };

    window.submitNewPatient = function() {
        const name = document.getElementById('newPatientName').value || 'New Patient';
        const phone = document.getElementById('newPatientPhone').value || '+91 98200 12345';
        const newId = `PAT-2026-0${100 + MediData.patients.length + 1}`;
        const newMrn = `MRN-${90140 + MediData.patients.length + 1}`;

        MediData.patients.unshift({
            id: newId, mrn: newMrn, name: name, age: 35, gender: "Male", phone: phone, email: "patient@example.com",
            bloodGroup: "B+", abhaId: "91-8842-1209-7712", allergies: ["None known"], chronicConditions: ["None"],
            emergencyContact: { name: "Family", relation: "Spouse", phone: phone }, address: "Mumbai", registeredOn: "Today",
            lastVisit: "Today", totalVisits: 1, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
            vitals: { bp: "120/80", pulse: 74, spo2: 99, temp: 98.4, weight: 70, height: 172, bmi: 23.6 }, familyMembers: [], portalPrescriptions: [], portalLabReports: []
        });

        renderPatientsTable();
        document.getElementById('newPatientModal').classList.remove('active');
        playAudioFx('success');
        triggerConfetti();
        showToast(`Registered ${name} (${newMrn}) with ABHA ID!`, 'success', 'Patient Registration');
    };

    window.submitBookAppointment = function() {
        document.getElementById('bookAppointmentModal').classList.remove('active');
        playAudioFx('success');
        showToast('Appointment booked successfully! Slot reserved.', 'success', 'Appointment Scheduled');
    };

    window.submitQrKioskCheckIn = function() {
        document.getElementById('qrCheckInModal').classList.remove('active');
        playAudioFx('chime');
        showToast('QR Self Check-in Verified! Token added to Live OPD Queue.', 'success', 'Self Check-in Kiosk');
    };

    window.submitDoctorLeave = function() {
        document.getElementById('doctorLeaveModal').classList.remove('active');
        playAudioFx('click');
        showToast('Doctor leave recorded & slots blocked!', 'warning', 'Roster Update');
    };

    window.submitPatientFeedback = function() {
        document.getElementById('feedbackSubmissionModal').classList.remove('active');
        playAudioFx('success');
        showToast('Thank you! Patient feedback recorded in NPS stream.', 'success', 'Feedback Submitted');
    };

    // ==========================================================================
    // PATIENT SELF-SERVICE APPOINTMENT & SLOT BOOKING CONTROLLER (PEX-01, APT-01)
    // ==========================================================================

    const bookingWizardState = {
        currentStep: 1,
        selectedCategory: 'all',
        searchQuery: '',
        selectedDisease: null,
        selectedDoctorId: 'DOC-01',
        selectedDate: 'Today, 05 Oct 2026',
        selectedSlot: '10:30 AM',
        consultMode: 'In-Person Clinic Visit',
        paymentMode: 'Counter',
        lastBookingReceipt: null
    };

    function renderPublicBookingEngine() {
        if (!bookingWizardState.selectedDisease && MediData.diseaseSpecialtyDirectory && MediData.diseaseSpecialtyDirectory.length > 0) {
            bookingWizardState.selectedDisease = MediData.diseaseSpecialtyDirectory[0].diseases[0];
            bookingWizardState.selectedDoctorId = MediData.diseaseSpecialtyDirectory[0].recommendedDoctorId;
        }
        renderDiseaseCards();
        renderDoctorSpotlightAndSlots();
        updateBookingSummarySidebar();
    }

    function renderDiseaseCards() {
        const container = document.getElementById('diseaseCardsContainer');
        if (!container || !MediData.diseaseSpecialtyDirectory) return;

        const query = (bookingWizardState.searchQuery || '').toLowerCase().trim();
        const activeCat = bookingWizardState.selectedCategory;

        let matchingItems = [];

        MediData.diseaseSpecialtyDirectory.forEach(group => {
            if (activeCat !== 'all' && group.categoryId !== activeCat) return;

            group.diseases.forEach(d => {
                const textToMatch = `${d.name} ${d.desc} ${(d.keywords || []).join(' ')} ${group.category} ${group.specialtyName}`.toLowerCase();
                if (!query || textToMatch.includes(query)) {
                    matchingItems.push({
                        ...d,
                        categoryId: group.categoryId,
                        categoryName: group.category,
                        categoryColor: group.color,
                        categoryIcon: group.icon,
                        specialtyName: group.specialtyName,
                        recommendedDoctorId: group.recommendedDoctorId
                    });
                }
            });
        });

        if (matchingItems.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: var(--bg-main); border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
                    <i class="bi bi-search" style="font-size: 32px; color: var(--text-muted);"></i>
                    <h4 style="margin: 10px 0 4px; font-weight: 700;">No direct match found for "${bookingWizardState.searchQuery}"</h4>
                    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Try searching for broad terms like "fever", "chest pain", "sugar", "knee", "skin", or choose a department above.</p>
                    <button class="btn btn-outline btn-sm" onclick="clearDiseaseSearch()">Reset Search Filter</button>
                </div>
            `;
            return;
        }

        container.innerHTML = matchingItems.map(item => {
            const doc = MediData.doctors.find(dr => dr.id === item.recommendedDoctorId) || MediData.doctors[0];
            const isSelected = bookingWizardState.selectedDisease && bookingWizardState.selectedDisease.id === item.id;

            return `
                <div class="disease-card ${isSelected ? 'selected' : ''}" style="--category-color: ${item.categoryColor};">
                    <div>
                        <div class="disease-card-header">
                            <span class="disease-category-tag" style="background: ${item.categoryColor}15; color: ${item.categoryColor};">
                                <i class="bi ${item.categoryIcon}"></i> ${item.categoryName}
                            </span>
                            <span style="font-size: 11px; font-weight: 700; color: var(--emerald-600);"><i class="bi bi-check-circle-fill"></i> Slots Open</span>
                        </div>
                        <h4 class="disease-card-title">${item.name}</h4>
                        <p class="disease-card-desc">${item.desc}</p>
                        
                        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px;">
                            ${(item.keywords || []).slice(0, 3).map(kw => `
                                <span style="font-size: 10.5px; background: var(--bg-main); border: 1px solid var(--border-subtle); padding: 2px 6px; border-radius: 4px; color: var(--text-muted);">#${kw}</span>
                            `).join('')}
                        </div>

                        <!-- Matched Doctor Preview -->
                        <div class="matched-doctor-preview-box">
                            <img src="${doc.avatar}" class="matched-doctor-avatar" alt="${doc.name}">
                            <div class="matched-doctor-info">
                                <div class="matched-doctor-name">${doc.name}</div>
                                <div class="matched-doctor-sub">${doc.specialty} • <b>₹${doc.consultFee}</b></div>
                            </div>
                        </div>
                    </div>

                    <button class="book-disease-btn" onclick="selectDiseaseAndProceed('${item.id}', '${doc.id}')">
                        <span>Select & View Vacant Slots</span> <i class="bi bi-arrow-right"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    window.filterDiseaseCategory = function(catId) {
        bookingWizardState.selectedCategory = catId;
        const pills = document.querySelectorAll('#diseaseCategoryPills .category-pill');
        pills.forEach(p => {
            if ((catId === 'all' && p.innerText.includes('All')) || p.getAttribute('onclick').includes(catId)) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
        renderDiseaseCards();
    };

    window.filterDiseasesDirectory = function() {
        const input = document.getElementById('diseaseSearchInput');
        bookingWizardState.searchQuery = input ? input.value : '';
        renderDiseaseCards();
    };

    window.clearDiseaseSearch = function() {
        const input = document.getElementById('diseaseSearchInput');
        if (input) input.value = '';
        bookingWizardState.searchQuery = '';
        bookingWizardState.selectedCategory = 'all';
        window.filterDiseaseCategory('all');
        renderDiseaseCards();
    };

    window.quickSearchDisease = function(term) {
        const input = document.getElementById('diseaseSearchInput');
        if (input) input.value = term;
        bookingWizardState.searchQuery = term;
        renderDiseaseCards();
    };

    window.selectDiseaseAndProceed = function(diseaseId, docId) {
        let foundDisease = null;
        for (const cat of MediData.diseaseSpecialtyDirectory) {
            const d = cat.diseases.find(item => item.id === diseaseId);
            if (d) {
                foundDisease = { ...d, categoryName: cat.category, specialtyName: cat.specialtyName };
                break;
            }
        }

        if (foundDisease) {
            bookingWizardState.selectedDisease = foundDisease;
        }
        bookingWizardState.selectedDoctorId = docId;

        playAudioFx('click');
        jumpToBookingStep(2);
    };

    window.jumpToBookingStep = function(stepNum) {
        if (stepNum === 2 && !bookingWizardState.selectedDisease) {
            showToast('Please select a health concern or disease first', 'warning', 'Step Prerequisite');
            return;
        }
        if (stepNum === 3 && !bookingWizardState.selectedSlot) {
            showToast('Please pick an available vacant time slot', 'warning', 'Step Prerequisite');
            return;
        }

        bookingWizardState.currentStep = stepNum;

        // Update stepper indicator
        for (let i = 1; i <= 4; i++) {
            const node = document.getElementById(`wizardStepNode${i}`);
            const line = document.getElementById(`wizardStepLine${i}`);
            const panel = document.getElementById(`bookingStepContent${i}`);

            if (node) {
                if (i === stepNum) {
                    node.className = 'wizard-step-node active';
                } else if (i < stepNum) {
                    node.className = 'wizard-step-node completed';
                } else {
                    node.className = 'wizard-step-node';
                }
            }
            if (line) {
                if (i < stepNum) line.classList.add('active');
                else line.classList.remove('active');
            }
            if (panel) {
                if (i === stepNum) panel.classList.add('active');
                else panel.classList.remove('active');
            }
        }

        if (stepNum === 2) {
            renderDoctorSpotlightAndSlots();
            const badge = document.getElementById('selectedConcernDisplayBadge');
            if (badge && bookingWizardState.selectedDisease) {
                badge.innerText = `Selected Concern: ${bookingWizardState.selectedDisease.name}`;
            }
        } else if (stepNum === 3) {
            const doc = MediData.doctors.find(dr => dr.id === bookingWizardState.selectedDoctorId) || MediData.doctors[0];
            const badge = document.getElementById('step3SlotSummaryBadge');
            if (badge) {
                badge.innerHTML = `<i class="bi bi-clock-fill"></i> ${bookingWizardState.selectedSlot} on ${bookingWizardState.selectedDate} with <b>${doc.name}</b>`;
            }
            updateBookingSummarySidebar();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    function renderDoctorSpotlightAndSlots() {
        const spotlightContainer = document.getElementById('doctorSpotlightCard');
        const slotsContainer = document.getElementById('doctorSlotsMatrixContainer');
        const doc = MediData.doctors.find(dr => dr.id === bookingWizardState.selectedDoctorId) || MediData.doctors[0];

        if (spotlightContainer) {
            spotlightContainer.innerHTML = `
                <div class="doctor-spotlight-inner">
                    <img src="${doc.avatar}" class="doctor-spotlight-avatar" alt="${doc.name}">
                    <div class="doctor-spotlight-details">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                            <div>
                                <div class="doctor-spotlight-name">
                                    ${doc.name} <i class="bi bi-patch-check-fill" style="color: var(--primary-600); font-size: 17px;" title="Verified Specialist"></i>
                                </div>
                                <div class="doctor-spotlight-spec">${doc.specialty} • ${doc.qualification}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Consultation Fee</div>
                                <div style="font-size: 22px; font-weight: 900; color: var(--teal-600);">₹${doc.consultFee}</div>
                            </div>
                        </div>

                        <div class="doctor-spotlight-meta-chips">
                            <span class="doc-meta-chip"><i class="bi bi-geo-alt-fill" style="color: var(--rose-500);"></i> ${doc.room}</span>
                            <span class="doc-meta-chip"><i class="bi bi-award-fill" style="color: #f59e0b;"></i> ${doc.experience} Experience</span>
                            <span class="doc-meta-chip"><i class="bi bi-star-fill" style="color: #f59e0b;"></i> ${doc.rating} (${doc.reviewsCount} Reviews)</span>
                            <span class="doc-meta-chip" style="color: var(--emerald-600); font-weight: 700;"><i class="bi bi-shield-check"></i> Reg: ${doc.regNo}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div style="font-size: 12px; color: var(--text-muted);">
                        <i class="bi bi-info-circle-fill" style="color: var(--primary-600);"></i> Matched for: <b>${bookingWizardState.selectedDisease ? bookingWizardState.selectedDisease.name : 'Clinical Consultation'}</b>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 11.5px; color: var(--text-muted);">Want another doctor?</span>
                        <select class="form-control" style="width: auto; padding: 4px 10px; font-size: 12px;" onchange="switchPublicBookingDoctor(this.value)">
                            ${MediData.doctors.map(dr => `<option value="${dr.id}" ${dr.id === doc.id ? 'selected' : ''}>${dr.name} (${dr.dept} - ₹${dr.consultFee})</option>`).join('')}
                        </select>
                    </div>
                </div>
            `;
        }

        if (slotsContainer) {
            const schedule = doc.slotSchedule || {
                morning: [{ time: "10:00 AM", isBooked: false }, { time: "10:30 AM", isBooked: false }, { time: "11:00 AM", isBooked: false }, { time: "11:30 AM", isBooked: false }],
                afternoon: [{ time: "02:00 PM", isBooked: false }, { time: "02:30 PM", isBooked: false }, { time: "03:00 PM", isBooked: false }],
                evening: [{ time: "05:00 PM", isBooked: false }, { time: "05:30 PM", isBooked: false }, { time: "06:00 PM", isBooked: false }]
            };

            let vacantCount = 0;
            const countVacant = (arr) => (arr || []).filter(s => !s.isBooked).length;
            vacantCount = countVacant(schedule.morning) + countVacant(schedule.afternoon) + countVacant(schedule.evening);

            slotsContainer.innerHTML = `
                <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; font-weight: 800; color: var(--text-primary);">Available Appointment Slots for ${bookingWizardState.selectedDate}</span>
                    <span class="badge badge-green"><i class="bi bi-lightning-charge-fill"></i> ${vacantCount} Vacant Slots Available</span>
                </div>

                <!-- Morning Slots -->
                <div class="slot-period-group">
                    <div class="slot-period-title"><i class="bi bi-sunrise-fill" style="color: #f59e0b;"></i> Morning Slots (09:00 AM - 01:00 PM)</div>
                    <div class="slots-grid">
                        ${(schedule.morning || []).map(s => `
                            <button type="button" class="slot-btn ${s.isBooked ? 'booked' : 'vacant'} ${bookingWizardState.selectedSlot === s.time && !s.isBooked ? 'selected' : ''}" 
                                onclick="selectDoctorSlot('${s.time}', ${s.isBooked})" ${s.isBooked ? 'disabled' : ''}>
                                <span>${s.time}</span>
                                <span class="slot-sub-status">${s.isBooked ? 'Booked' : 'Available'}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Afternoon Slots -->
                <div class="slot-period-group">
                    <div class="slot-period-title"><i class="bi bi-sun-fill" style="color: #f97316;"></i> Afternoon Slots (02:00 PM - 04:30 PM)</div>
                    <div class="slots-grid">
                        ${(schedule.afternoon || []).map(s => `
                            <button type="button" class="slot-btn ${s.isBooked ? 'booked' : 'vacant'} ${bookingWizardState.selectedSlot === s.time && !s.isBooked ? 'selected' : ''}" 
                                onclick="selectDoctorSlot('${s.time}', ${s.isBooked})" ${s.isBooked ? 'disabled' : ''}>
                                <span>${s.time}</span>
                                <span class="slot-sub-status">${s.isBooked ? 'Booked' : 'Available'}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Evening Slots -->
                <div class="slot-period-group">
                    <div class="slot-period-title"><i class="bi bi-moon-stars-fill" style="color: #6366f1;"></i> Evening Slots (05:00 PM - 08:30 PM)</div>
                    <div class="slots-grid">
                        ${(schedule.evening || []).map(s => `
                            <button type="button" class="slot-btn ${s.isBooked ? 'booked' : 'vacant'} ${bookingWizardState.selectedSlot === s.time && !s.isBooked ? 'selected' : ''}" 
                                onclick="selectDoctorSlot('${s.time}', ${s.isBooked})" ${s.isBooked ? 'disabled' : ''}>
                                <span>${s.time}</span>
                                <span class="slot-sub-status">${s.isBooked ? 'Booked' : 'Available'}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            const summaryText = document.getElementById('selectedSlotSummaryText');
            const proceedBtn = document.getElementById('proceedToPatientDetailsBtn');

            if (bookingWizardState.selectedSlot) {
                if (summaryText) summaryText.innerText = `${bookingWizardState.selectedDate} at ${bookingWizardState.selectedSlot} (${bookingWizardState.consultMode})`;
                if (proceedBtn) proceedBtn.disabled = false;
            } else {
                if (summaryText) summaryText.innerText = 'Please click an available slot above';
                if (proceedBtn) proceedBtn.disabled = true;
            }
        }
    }

    window.switchPublicBookingDoctor = function(docId) {
        bookingWizardState.selectedDoctorId = docId;
        bookingWizardState.selectedSlot = null;
        renderDoctorSpotlightAndSlots();
        playAudioFx('click');
    };

    window.selectBookingDate = function(dateStr) {
        bookingWizardState.selectedDate = dateStr;
        const pills = document.querySelectorAll('#bookingDateSelectorRow .date-pick-pill');
        pills.forEach(p => {
            if (p.getAttribute('onclick').includes(dateStr.split(',')[0])) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
        renderDoctorSpotlightAndSlots();
        playAudioFx('click');
    };

    window.setConsultationMode = function(modeStr) {
        bookingWizardState.consultMode = modeStr;
        const inPersonCard = document.getElementById('modeInPersonCard');
        const teleCard = document.getElementById('modeTeleCard');

        if (modeStr.includes('In-Person')) {
            if (inPersonCard) inPersonCard.classList.add('active');
            if (teleCard) teleCard.classList.remove('active');
        } else {
            if (teleCard) teleCard.classList.add('active');
            if (inPersonCard) inPersonCard.classList.remove('active');
        }
        renderDoctorSpotlightAndSlots();
        playAudioFx('click');
    };

    window.selectDoctorSlot = function(time, isBooked) {
        if (isBooked) {
            showToast('This slot is already booked. Please choose an available green slot.', 'warning', 'Slot Reserved');
            return;
        }
        bookingWizardState.selectedSlot = time;
        renderDoctorSpotlightAndSlots();
        playAudioFx('click');
    };

    window.setBookingPaymentMode = function(mode) {
        bookingWizardState.paymentMode = mode;
        const counterChip = document.getElementById('payCounterChip');
        const upiChip = document.getElementById('payUpiChip');

        if (mode === 'Counter') {
            if (counterChip) counterChip.classList.add('active');
            if (upiChip) upiChip.classList.remove('active');
        } else {
            if (upiChip) upiChip.classList.add('active');
            if (counterChip) counterChip.classList.remove('active');
        }
        updateBookingSummarySidebar();
    };

    function updateBookingSummarySidebar() {
        const container = document.getElementById('bookingSummarySidebarContent');
        if (!container) return;

        const doc = MediData.doctors.find(dr => dr.id === bookingWizardState.selectedDoctorId) || MediData.doctors[0];
        const fee = doc.consultFee || 800;
        const regFee = 50;
        const total = fee + regFee;

        container.innerHTML = `
            <div style="background: var(--bg-main); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 14px;">
                <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Doctor Chamber</div>
                <div style="font-weight: 800; font-size: 14px; color: var(--text-primary); margin-top: 2px;">${doc.name}</div>
                <div style="font-size: 11.5px; color: var(--primary-600); font-weight: 600;">${doc.specialty}</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;"><i class="bi bi-geo-alt-fill"></i> ${doc.room}</div>
            </div>

            <div style="font-size: 12.5px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);"><i class="bi bi-calendar3"></i> Date:</span>
                    <b>${bookingWizardState.selectedDate}</b>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);"><i class="bi bi-clock"></i> Time Slot:</span>
                    <b style="color: var(--teal-600);">${bookingWizardState.selectedSlot || '10:30 AM'}</b>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);"><i class="bi bi-clipboard2-pulse"></i> Concern:</span>
                    <b>${bookingWizardState.selectedDisease ? bookingWizardState.selectedDisease.name : 'General Consultation'}</b>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);"><i class="bi bi-hospital"></i> Mode:</span>
                    <b>${bookingWizardState.consultMode}</b>
                </div>
            </div>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 6px;">
                    <span>Consultation Charges:</span>
                    <span>₹${fee.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 6px;">
                    <span>Digital OPD Token & ABHA:</span>
                    <span>₹${regFee.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 900; color: var(--text-primary); border-top: 2px dashed var(--border-subtle); padding-top: 8px; margin-top: 8px;">
                    <span>Total Amount:</span>
                    <span style="color: var(--teal-600);">₹${total.toFixed(2)}</span>
                </div>
                <div style="font-size: 11px; color: var(--emerald-600); margin-top: 6px; font-weight: 700;">
                    <i class="bi bi-shield-check"></i> ${bookingWizardState.paymentMode === 'UPI' ? 'Pay Online via UPI' : 'Pay at Reception upon Arrival'}
                </div>
            </div>
        `;
    }

    window.submitOnlinePublicBooking = function() {
        const patName = document.getElementById('patientBookingFullName').value || 'Sunita Verma';
        const phone = document.getElementById('patientBookingMobile').value || '+91 98210 44522';
        const age = parseInt(document.getElementById('patientBookingAge').value) || 44;
        const gender = document.getElementById('patientBookingGender').value || 'Female';
        const email = document.getElementById('patientBookingEmail').value || 'sunita.v@example.com';
        const city = document.getElementById('patientBookingCity').value || 'Bandra West, Mumbai';
        const abha = document.getElementById('patientBookingAbha').value || '91-4821-0042-9902';
        const notes = document.getElementById('patientBookingNotes').value || 'Patient self-booked appointment';

        const doc = MediData.doctors.find(dr => dr.id === bookingWizardState.selectedDoctorId) || MediData.doctors[0];
        
        const nextTokenNum = `T-${String((MediData.queueTokens.length + 1)).padStart(2, '0')}`;
        const newAptId = `APT-2026-0${Math.floor(100 + Math.random() * 900)}`;
        const newPatId = `PAT-2026-0${Math.floor(120 + Math.random() * 800)}`;
        const newMrn = `MRN-${Math.floor(90150 + Math.random() * 800)}`;

        // 1. Create or link patient
        let existingPatient = MediData.patients.find(p => p.phone === phone || p.name.toLowerCase() === patName.toLowerCase());
        if (!existingPatient) {
            existingPatient = {
                id: newPatId,
                mrn: newMrn,
                name: patName,
                age: age,
                gender: gender,
                phone: phone,
                email: email,
                bloodGroup: "B+",
                abhaId: abha,
                allergies: ["None known"],
                chronicConditions: [bookingWizardState.selectedDisease ? bookingWizardState.selectedDisease.name : 'General Care'],
                emergencyContact: { name: patName + ' Family', relation: "Family", phone: phone },
                address: city,
                registeredOn: "2026-10-05",
                lastVisit: "Today (Self-Booked)",
                totalVisits: 1,
                avatar: gender === 'Female' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                vitals: { bp: "120/80", pulse: 74, spo2: 99, temp: 98.6, weight: 64, height: 165, bmi: 23.5, bloodSugarR: "110 mg/dL" },
                familyMembers: [],
                portalPrescriptions: [],
                portalLabReports: []
            };
            MediData.patients.unshift(existingPatient);
        }

        // 2. Create appointment record
        const newAppointment = {
            id: newAptId,
            tokenNo: nextTokenNum,
            patientId: existingPatient.id,
            patientName: patName,
            age: age,
            gender: gender,
            phone: phone,
            doctorId: doc.id,
            doctorName: doc.name,
            specialty: doc.specialty,
            room: doc.room,
            date: bookingWizardState.selectedDate,
            time: bookingWizardState.selectedSlot || '10:30 AM',
            type: bookingWizardState.consultMode,
            status: "Confirmed",
            paymentStatus: bookingWizardState.paymentMode === 'UPI' ? 'Paid (UPI)' : 'Pay at Reception',
            consultFee: doc.consultFee,
            chiefComplaint: notes,
            source: "Self-Service Portal"
        };
        MediData.appointments.unshift(newAppointment);

        // 3. Add to live OPD queue tokens
        const newQueueItem = {
            tokenId: `Q-${Math.floor(110 + Math.random() * 890)}`,
            tokenNo: nextTokenNum,
            patientId: existingPatient.id,
            patientName: patName,
            age: age,
            gender: gender.charAt(0).toUpperCase(),
            phone: phone,
            doctorId: doc.id,
            doctorName: doc.name,
            room: doc.room,
            time: bookingWizardState.selectedSlot || '10:30 AM',
            status: "Waiting",
            priority: "Normal",
            calledAt: null,
            waitingMins: 0,
            source: "Online Booking"
        };
        MediData.queueTokens.push(newQueueItem);

        // 4. Mark slot as booked in doc schedule
        if (doc.slotSchedule) {
            ['morning', 'afternoon', 'evening'].forEach(period => {
                if (doc.slotSchedule[period]) {
                    const slotObj = doc.slotSchedule[period].find(s => s.time === bookingWizardState.selectedSlot);
                    if (slotObj) {
                        slotObj.isBooked = true;
                        slotObj.bookedBy = patName;
                    }
                }
            });
        }

        // 5. Audit Log
        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: 'Patient (Self-Service)',
            action: 'ONLINE_SLOT_BOOKED',
            entity: `Apt #${newAptId} • Token ${nextTokenNum}`,
            tenant: MediData.tenant.id,
            details: `Booked ${bookingWizardState.selectedSlot} on ${bookingWizardState.selectedDate} with ${doc.name} for ${patName}.`,
            ip: '49.36.112.44'
        });

        // Store receipt details for Step 4
        bookingWizardState.lastBookingReceipt = {
            aptId: newAptId,
            tokenNo: nextTokenNum,
            patientName: patName,
            age: age,
            gender: gender,
            phone: phone,
            email: email,
            city: city,
            abha: abha,
            docName: doc.name,
            specialty: doc.specialty,
            room: doc.room,
            date: bookingWizardState.selectedDate,
            time: bookingWizardState.selectedSlot,
            mode: bookingWizardState.consultMode,
            disease: bookingWizardState.selectedDisease ? bookingWizardState.selectedDisease.name : 'Clinical Care',
            fee: doc.consultFee,
            paymentStatus: bookingWizardState.paymentMode === 'UPI' ? 'Paid via UPI QR' : 'Pay at Counter'
        };

        // Render Step 4
        renderDigitalAppointmentPass();
        jumpToBookingStep(4);

        playAudioFx('chime');
        triggerConfetti();
        showToast(`Token #${nextTokenNum} Issued for ${patName}! Added to OPD Queue.`, 'success', 'Appointment Confirmed');

        // Re-render core views
        renderAppointmentsTable();
        renderQueueTable();
        renderPatientsTable();
        renderAuditLogs();
    };

    function renderDigitalAppointmentPass() {
        const container = document.getElementById('printableAppointmentSlipArea');
        const r = bookingWizardState.lastBookingReceipt;
        if (!container || !r) return;

        container.innerHTML = `
            <div class="pass-header">
                <div>
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; opacity: 0.9;">${MediData.tenant.name}</div>
                    <div style="font-size: 17px; font-weight: 800; margin-top: 2px;">OPD CONSULTATION TOKEN PASS</div>
                    <div style="font-size: 11px; opacity: 0.85;">${MediData.tenant.address} • Ph: ${MediData.tenant.phone}</div>
                </div>
                <div class="pass-token-badge">
                    <div style="font-size: 10px; text-transform: uppercase; color: var(--teal-600); font-weight: 800;">OPD TOKEN NO</div>
                    <div style="font-size: 24px; font-weight: 900; color: #0f172a;">${r.tokenNo}</div>
                </div>
            </div>

            <div class="pass-body">
                <div class="pass-grid-row">
                    <div>
                        <div class="pass-meta-label">Patient Name</div>
                        <div class="pass-meta-val">${r.patientName} (${r.age} Yrs / ${r.gender})</div>
                        <div style="font-size: 11px; color: #64748b;">Phone: ${r.phone}</div>
                    </div>
                    <div>
                        <div class="pass-meta-label">Consulting Specialist</div>
                        <div class="pass-meta-val" style="color: #0284c7;">${r.docName}</div>
                        <div style="font-size: 11px; color: #64748b;">${r.specialty} • <b>${r.room}</b></div>
                    </div>
                </div>

                <div class="pass-grid-row">
                    <div>
                        <div class="pass-meta-label">Appointment Date & Slot</div>
                        <div class="pass-meta-val" style="color: #0d9488;">${r.date} • ${r.time}</div>
                        <div style="font-size: 11px; color: #64748b;">Mode: ${r.mode}</div>
                    </div>
                    <div>
                        <div class="pass-meta-label">Health Concern / Disease</div>
                        <div class="pass-meta-val">${r.disease}</div>
                        <div style="font-size: 11px; color: #64748b;">Ref ID: <b>${r.aptId}</b></div>
                    </div>
                </div>

                <div class="pass-grid-row" style="border-bottom: none; margin-bottom: 8px;">
                    <div>
                        <div class="pass-meta-label">Consultation Fee</div>
                        <div class="pass-meta-val">₹${r.fee.toFixed(2)}</div>
                    </div>
                    <div>
                        <div class="pass-meta-label">Payment Status</div>
                        <div class="pass-meta-val" style="color: #10b981;"><i class="bi bi-check-circle-fill"></i> ${r.paymentStatus}</div>
                    </div>
                </div>

                <div class="pass-qr-strip">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=MEDIOS-TOKEN-${r.tokenNo}-${r.aptId}" alt="QR" style="width: 70px; height: 70px; border-radius: 6px; background: white; padding: 4px; border: 1px solid #cbd5e1;">
                        <div>
                            <div style="font-weight: 800; font-size: 12.5px; color: #0f172a;">Express Self Check-in Kiosk Barcode</div>
                            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Scan this QR code at the clinic reception scanner to verify your arrival automatically.</div>
                            <div style="font-size: 10.5px; color: #0284c7; font-weight: 700; margin-top: 4px;">ABHA Linked: ${r.abha || 'Available'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    window.printPatientAppointmentSlip = function() {
        playAudioFx('click');
        window.print();
    };

    window.simulateWhatsAppSlipSend = function() {
        const r = bookingWizardState.lastBookingReceipt;
        playAudioFx('chime');
        showToast(`Token #${r ? r.tokenNo : 'T-01'} & Google Map directions sent to WhatsApp (${r ? r.phone : '+91 98210 44522'})!`, 'success', 'WhatsApp Automated Dispatch');
    };

    window.resetPatientBookingWizard = function() {
        bookingWizardState.searchQuery = '';
        bookingWizardState.selectedCategory = 'all';
        bookingWizardState.selectedSlot = '10:30 AM';
        bookingWizardState.lastBookingReceipt = null;
        window.clearDiseaseSearch();
        jumpToBookingStep(1);
        playAudioFx('click');
    };


    window.generateQueueTokenForApt = function(id) {
        playAudioFx('chime');
        showToast(`Issued Queue Token for appointment ${id}`, 'success', 'Queue Board');
    };

    window.applyRoleNavigationFilter = function(role) {
        const activeRoleKey = normalizeRole(role);
        const config = RoleConfigurations[activeRoleKey] || RoleConfigurations['Super Admin'];

        // 1. Filter Nav Items in sidebar
        const allNavItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
        allNavItems.forEach(item => {
            const view = item.dataset.view;
            if (config.allowedViews === 'all' || config.allowedViews.includes(view)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // 2. Hide Nav Group Titles that have all hidden children
        const navContainer = document.querySelector('.sidebar-nav');
        if (navContainer) {
            const children = Array.from(navContainer.children);
            let currentGroup = null;
            let groupHasVisibleItems = false;

            children.forEach(el => {
                if (el.classList.contains('nav-group-title')) {
                    if (currentGroup) {
                        currentGroup.style.display = groupHasVisibleItems ? 'block' : 'none';
                    }
                    currentGroup = el;
                    groupHasVisibleItems = false;
                } else if (el.classList.contains('nav-item')) {
                    if (el.style.display !== 'none') {
                        groupHasVisibleItems = true;
                    }
                }
            });
            if (currentGroup) {
                currentGroup.style.display = groupHasVisibleItems ? 'block' : 'none';
            }
        }

        // 3. Update User Profile Card in Sidebar Footer
        const userCard = document.querySelector('.user-profile-card');
        if (userCard) {
            const img = userCard.querySelector('img');
            const nameEl = userCard.querySelector('.user-name');
            const roleBadge = document.getElementById('currentRoleBadge');
            if (img && config.avatar) img.src = config.avatar;
            if (nameEl) nameEl.innerText = config.name;
            if (roleBadge) roleBadge.innerText = config.title;
        }

        // 4. Update Branch Badge in Sidebar Top
        const branchNameEl = document.querySelector('.tenant-meta .branch-name');
        const branchLabelEl = document.querySelector('.tenant-meta .label');
        if (branchNameEl) {
            branchNameEl.innerHTML = `<i class="bi bi-geo-alt-fill" style="color: #38bdf8; font-size: 11px;"></i> ${config.branch}`;
        }
        if (branchLabelEl) {
            branchLabelEl.innerText = config.brandTag;
        }

        // 5. Update Header Role Tag
        const headerRole = document.getElementById('headerUserRoleTag');
        if (headerRole) {
            headerRole.innerHTML = `<i class="bi bi-shield-lock-fill"></i> ${config.role} Mode`;
        }

        // 6. Header Buttons Contextual Visibility
        const newPatBtn = document.querySelector('[onclick="openNewPatientModal()"]');
        const tvBtn = document.getElementById('toggleTvBoardBtn');
        const qrBtn = document.querySelector('[onclick="openQrCheckInModal()"]');

        if (activeRoleKey === 'Pharmacist' || activeRoleKey === 'Pathologist' || activeRoleKey === 'Radiologist') {
            if (newPatBtn) newPatBtn.style.display = 'none';
            if (tvBtn) tvBtn.style.display = 'none';
            if (qrBtn) qrBtn.style.display = 'none';
        } else {
            if (newPatBtn) newPatBtn.style.display = 'inline-flex';
            if (tvBtn) tvBtn.style.display = 'flex';
            if (qrBtn) qrBtn.style.display = 'flex';
        }
    };

    window.switchAppRole = function(role, notify = true) {
        const activeRoleKey = normalizeRole(role);
        const config = RoleConfigurations[activeRoleKey];
        state.currentRole = config.role;
        MediData.currentUser.role = config.role;
        MediData.currentUser.name = config.name;
        sessionStorage.setItem('medios_user_role', config.role);
        sessionStorage.setItem('medios_user_name', config.name);

        applyRoleNavigationFilter(config.role);

        // Switch to the role's default view
        if (config.allowedViews !== 'all' && !config.allowedViews.includes(state.currentView)) {
            switchView(config.defaultView);
        } else if (notify) {
            switchView(config.defaultView);
        }

        const roleModal = document.getElementById('roleSwitcherModal');
        if (roleModal) roleModal.classList.remove('active');

        if (notify) {
            playAudioFx('chime');
            showToast(`Active Workspace: ${config.title} (${config.brandTag})`, 'info', 'Role Switched');
        }
    };

    function setupModals() {
        document.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
            });
        });

        const tvBtn = document.getElementById('toggleTvBoardBtn');
        const tvOverlay = document.getElementById('tvWaitingBoardOverlay');
        const tvClose = document.getElementById('closeTvBoardBtn');

        if (tvBtn && tvOverlay) {
            tvBtn.addEventListener('click', () => {
                tvOverlay.classList.add('active');
                renderTVWaitingBoard();
            });
        }
        if (tvClose && tvOverlay) {
            tvClose.addEventListener('click', () => tvOverlay.classList.remove('active'));
        }

        const roleBtn = document.getElementById('roleSwitcherTrigger');
        const roleModal = document.getElementById('roleSwitcherModal');
        if (roleBtn && roleModal) {
            roleBtn.addEventListener('click', () => roleModal.classList.add('active'));
        }

        document.querySelectorAll('[data-print-target]').forEach(btn => {
            btn.addEventListener('click', () => window.print());
        });
    }

    function setupGlobalShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const search = document.getElementById('globalSearchInput');
                if (search) search.focus();
            }
        });
    }

    init();
});
