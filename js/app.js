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
    // 1. Initial Setup & View Switching
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
        renderLabWorklist();
        renderDoctorPayouts();
        renderDoctorLeaves();
        renderWaitlist();
        renderFeedbackTable();
        renderSaasPlans();
        renderAuditLogs();
        setupModals();
        setupGlobalShortcuts();

        // Restore persona from session if present
        if (state.currentRole) {
            window.switchAppRole(state.currentRole, false);
        }
    }

    function switchView(viewName) {
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
            'payouts': { title: 'Doctor Revenue Share & Payout Statements', section: 'Doctor Operations (OPS-01)' },
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

    window.openPharmacyDispenseModal = function() {
        document.getElementById('pharmacyDispenseModal').classList.add('active');
    };

    window.completePharmacyDispense = function() {
        document.getElementById('pharmacyDispenseModal').classList.remove('active');
        
        // Deduct batch stock simulation
        MediData.pharmacyBatches[0].stockQty -= 60;
        MediData.pharmacyBatches[1].stockQty -= 30;
        renderPharmacyBatches();

        MediData.auditLogs.unshift({
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actor: `Pharmacist Naveen P. (PHA-01)`,
            action: 'PHARMACY_PRESCRIPTION_DISPENSED',
            entity: `Rx #RX-2026-0914 (Vikramaditya Verma)`,
            tenant: MediData.tenant.id,
            details: `Dispensed Glycomet GP (Batch GLY-26B04), Telma 40 (Batch TEL-26D12). Deducted FEFO stock. Total: ₹1,476`,
            ip: '192.168.1.112'
        });
        renderAuditLogs();

        showToast('Prescription Dispensed! Stock ledger updated & billing entry synced.');
    };

    window.quickDispenseBatch = function(batchId) {
        const batch = MediData.pharmacyBatches.find(b => b.id === batchId);
        if (batch) {
            batch.stockQty -= 10;
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
    // 4. PHASE 3: Pathology & Lab Active Worklist (LAB-01 - 07)
    // --------------------------------------------------------------------------
    function renderLabWorklist() {
        const tbody = document.getElementById('labWorklistTableBody');
        if (!tbody) return;

        tbody.innerHTML = MediData.activeLabWorklist.map(w => `
            <tr>
                <td>
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary-600);">${w.sampleBarcode}</span>
                    <div style="font-size: 11px; color: var(--text-muted);">${w.orderId}</div>
                </td>
                <td>
                    <div style="font-weight: 700;">${w.patientName}</div>
                    <div style="font-size: 11.5px; color: var(--text-secondary);">${w.ageSex} • ${w.mrn}</div>
                </td>
                <td>
                    <div style="font-weight: 700;">${w.testName}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">Ordered by: ${w.orderedBy}</div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="sample-tube-indicator ${w.testCode === 'LAB-01' || w.testCode === 'LAB-03' ? 'tube-purple' : 'tube-red'}"></span>
                        <span style="font-weight: 600; font-size: 12px;">${w.category}</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${w.sampleStatus === 'Released' ? 'badge-green' : w.sampleStatus === 'Sample Collected' ? 'badge-blue' : 'badge-amber'}">
                        ${w.sampleStatus}
                    </span>
                </td>
                <td>
                    <div style="font-size: 11.5px; font-weight: 600; color: ${w.verificationStatus.includes('Verified') ? 'var(--emerald-600)' : 'var(--text-primary)'};">
                        ${w.verificationStatus}
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        ${w.sampleStatus === 'Released' ? `
                            <button class="btn btn-sm btn-primary" onclick="openOfficialLabReportModal('${w.orderId}')">
                                <i class="bi bi-file-earmark-pdf"></i> Report PDF
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-teal" onclick="openLabResultEntryModal('${w.orderId}')">
                                <i class="bi bi-pencil-square"></i> Review & Sign
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }

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
    // 5. PHASE 3: Doctor Revenue Share Statements (OPS-01)
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
        if (labGrid) {
            labGrid.innerHTML = MediData.labOrdersCatalog.map(lab => {
                const isChecked = state.activeEncounter.labOrders.includes(lab.code);
                return `
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; padding: 6px 10px; background: var(--bg-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); cursor: pointer;">
                        <input type="checkbox" value="${lab.code}" ${isChecked ? 'checked' : ''} onchange="toggleLabOrder('${lab.code}')">
                        <span style="font-weight: 600;">${lab.name}</span>
                        <span style="margin-left: auto; color: var(--primary-600); font-size: 11px; font-weight: 700;">₹${lab.price}</span>
                    </label>
                `;
            }).join('');
        }

        renderPrescriptionItems();
    }

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

    window.submitOnlinePublicBooking = function() {
        playAudioFx('success');
        triggerConfetti();
        showToast('Online Appointment Confirmed! SMS/WhatsApp link sent.', 'success', 'Public Booking Flow');
        switchView('appointments');
    };

    window.generateQueueTokenForApt = function(id) {
        playAudioFx('chime');
        showToast(`Issued Queue Token for appointment ${id}`, 'success', 'Queue Board');
    };

    window.switchAppRole = function(role, notify = true) {
        state.currentRole = role;
        MediData.currentUser.role = role;
        const badge = document.getElementById('currentRoleBadge');
        const headerRole = document.getElementById('headerUserRoleTag');
        if (badge) badge.innerText = role;
        if (headerRole) headerRole.innerHTML = `<i class="bi bi-shield-lock-fill"></i> ${role} Mode`;
        document.getElementById('roleSwitcherModal').classList.remove('active');
        if (notify) {
            playAudioFx('click');
            showToast(`Switched active workspace role to: ${role}`, 'info', 'RBAC Workspace Mode');
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
