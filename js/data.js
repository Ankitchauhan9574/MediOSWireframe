// MediOS Pro - Datasets for Phase 1 + Phase 2 + Phase 3 (Pharmacy & Laboratory Suite)
const MediData = {
    tenant: {
        id: "TEN-MUM-001",
        name: "Apex Healthcare & Multispeciality Clinic",
        tagline: "Centre for Excellence in Clinical Care & Diagnostics",
        regNo: "HOSP/MH/2024/99812",
        gstin: "27AABCA1234F1Z8",
        dlNo: "MH-MZ4-2024-88412", // Drug License Number for Pharmacy
        phone: "+91 (022) 2847-9000 / +91 98200 12345",
        email: "care@apexhealth.in",
        website: "https://apexhealth.medios.live",
        address: "Plot 42, Medical Enclave, S.V. Road, Bandra West, Mumbai 400050",
        activePlan: "Polyclinic & Lab Suite",
        branches: [
            { id: "BR-01", name: "Main Campus (Bandra)", type: "Hub & OPD", active: true },
            { id: "BR-02", name: "South Wing (Worli)", type: "Polyclinic & Daycare", active: true },
            { id: "BR-03", name: "Suburban Annex (Andheri)", type: "Diagnostic & Lab", active: true }
        ],
        departments: ["General Medicine", "Cardiology", "Pediatrics", "Orthopedics", "Gynecology & Obs", "Dermatology", "Pathology / Lab", "Radiology", "Pharmacy Desk"]
    },

    currentUser: {
        id: "USR-004",
        name: "Dr. Rajeshwar Sharma",
        role: "Doctor", // Doctor, Pharmacist, Lab Technician, Pathologist, Receptionist, Billing, Admin
        qualification: "MBBS, MD (Internal Medicine)",
        regNo: "MCI-MH-2012-04891",
        dept: "General Medicine",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },

    pathologist: {
        name: "Dr. Meera Kulkarni",
        qualification: "MBBS, MD (Pathology)",
        regNo: "MMC-2010-09412",
        designation: "Chief Consultant Pathologist & Lab Director"
    },

    doctors: [
        {
            id: "DOC-01",
            name: "Dr. Rajeshwar Sharma",
            specialty: "General Medicine & Diabetology",
            qualification: "MBBS, MD (Medicine)",
            regNo: "MCI-MH-2012-04891",
            dept: "General Medicine",
            room: "OPD Room 102",
            experience: "14 Years",
            consultFee: 800,
            revenueSharePercent: 70, // 70% to doctor, 30% to hospital
            monthConsultCount: 142,
            monthEarnings: 79520,
            rating: 4.9,
            reviewsCount: 142,
            status: "In Consultation",
            todayAppointments: 18,
            completed: 11,
            waiting: 5,
            schedule: "09:00 AM - 02:00 PM | 05:00 PM - 09:00 PM",
            availableSlots: ["10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "05:30 PM", "06:00 PM"],
            avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
        },
        {
            id: "DOC-02",
            name: "Dr. Ananya Nair",
            specialty: "Interventional Cardiology",
            qualification: "MBBS, MD, DM (Cardiology)",
            regNo: "MCI-DL-2015-08124",
            dept: "Cardiology",
            room: "OPD Room 204",
            experience: "11 Years",
            consultFee: 1200,
            revenueSharePercent: 75,
            monthConsultCount: 98,
            monthEarnings: 88200,
            rating: 4.8,
            reviewsCount: 98,
            status: "Available",
            todayAppointments: 14,
            completed: 8,
            waiting: 3,
            schedule: "10:00 AM - 04:00 PM",
            availableSlots: ["11:00 AM", "11:45 AM", "02:30 PM", "03:15 PM"],
            avatar: "https://images.unsplash.com/photo-1594824813580-49605511b8b6?w=150&auto=format&fit=crop&q=80"
        },
        {
            id: "DOC-03",
            name: "Dr. Siddharth Sen",
            specialty: "Consultant Pediatrician",
            qualification: "MBBS, DCH, DNB (Pediatrics)",
            regNo: "MCI-WB-2017-09433",
            dept: "Pediatrics",
            room: "OPD Room 105",
            experience: "9 Years",
            consultFee: 700,
            revenueSharePercent: 70,
            monthConsultCount: 184,
            monthEarnings: 90160,
            rating: 4.9,
            reviewsCount: 184,
            status: "Available",
            todayAppointments: 22,
            completed: 16,
            waiting: 4,
            schedule: "09:30 AM - 01:30 PM | 04:30 PM - 08:30 PM",
            availableSlots: ["11:30 AM", "12:15 PM", "05:00 PM", "06:00 PM"],
            avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
        }
    ],

    patients: [
        {
            id: "PAT-2026-0101",
            mrn: "MRN-90142",
            name: "Vikramaditya Verma",
            age: 48,
            gender: "Male",
            phone: "+91 98210 44521",
            email: "vikram.verma@example.com",
            bloodGroup: "O+",
            abhaId: "91-4821-0042-9901",
            allergies: ["Penicillin", "Sulfa drugs"],
            chronicConditions: ["Type 2 Diabetes Mellitus", "Stage-1 Hypertension"],
            emergencyContact: { name: "Sunita Verma", relation: "Spouse", phone: "+91 98210 44522" },
            address: "Flat 402, Sea Green Apts, Pali Hill, Bandra West, Mumbai",
            registeredOn: "2024-01-15",
            lastVisit: "2026-10-02",
            totalVisits: 6,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
            vitals: { bp: "138/88", pulse: 78, spo2: 98, temp: 98.6, weight: 79, height: 176, bmi: 25.5, bloodSugarR: "164 mg/dL" },
            familyMembers: [
                { id: "FAM-01", name: "Sunita Verma", relation: "Spouse", age: 44, blood: "B+", gender: "Female" },
                { id: "FAM-02", name: "Rohan Verma", relation: "Son", age: 14, blood: "O+", gender: "Male" }
            ],
            portalPrescriptions: [
                { rxNo: "RX-2026-0914", date: "05 Oct 2026", doctor: "Dr. Rajeshwar Sharma", diagnosis: "Type 2 DM & Hypertension", itemsCount: 3, status: "Ready for Dispensing" }
            ],
            portalLabReports: [
                { reportId: "LAB-REP-8812", test: "HbA1c & Fasting Blood Sugar", date: "05 Oct 2026", status: "Verified & Ready", fileUrl: "#" }
            ]
        },
        {
            id: "PAT-2026-0102",
            mrn: "MRN-90143",
            name: "Sunita Deshpande",
            age: 34,
            gender: "Female",
            phone: "+91 97690 12890",
            email: "sunita.d@example.com",
            bloodGroup: "B+",
            abhaId: "91-8842-1209-7712",
            allergies: ["None known"],
            chronicConditions: ["Hypothyroidism"],
            emergencyContact: { name: "Makarand Deshpande", relation: "Husband", phone: "+91 97690 12899" },
            address: "B-12, Green Acres, Vile Parle East, Mumbai",
            registeredOn: "2024-08-20",
            lastVisit: "2026-09-18",
            totalVisits: 3,
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
            vitals: { bp: "118/76", pulse: 72, spo2: 99, temp: 98.2, weight: 62, height: 161, bmi: 23.9, bloodSugarR: "98 mg/dL" },
            familyMembers: [],
            portalPrescriptions: [],
            portalLabReports: []
        },
        {
            id: "PAT-2026-0105",
            mrn: "MRN-90146",
            name: "Kabir Khan",
            age: 29,
            gender: "Male",
            phone: "+91 98700 33211",
            email: "kabir.k@example.com",
            bloodGroup: "O-",
            abhaId: "91-7712-4439-0128",
            allergies: ["None known"],
            chronicConditions: ["None"],
            emergencyContact: { name: "Farah Khan", relation: "Sister", phone: "+91 98700 33219" },
            address: "Flat 12, Gulmohar Enclave, Juhu, Mumbai",
            registeredOn: "2026-10-05",
            lastVisit: "Today (First visit)",
            totalVisits: 1,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
            vitals: { bp: "122/80", pulse: 74, spo2: 99, temp: 99.1, weight: 74, height: 180, bmi: 22.8, bloodSugarR: "102 mg/dL" },
            familyMembers: [],
            portalPrescriptions: [],
            portalLabReports: []
        }
    ],

    queueTokens: [
        {
            tokenId: "Q-101",
            tokenNo: "T-01",
            patientId: "PAT-2026-0101",
            patientName: "Vikramaditya Verma",
            age: 48,
            gender: "M",
            phone: "+91 98210 44521",
            doctorId: "DOC-01",
            doctorName: "Dr. Rajeshwar Sharma",
            dept: "General Medicine",
            room: "OPD-102",
            visitType: "Scheduled Consultation",
            time: "09:30 AM",
            status: "In Consultation",
            priority: "Normal",
            vitalStatus: "Vitals Recorded",
            calledAt: "09:42 AM",
            waitTimeMin: "12 min"
        },
        {
            tokenId: "Q-102",
            tokenNo: "T-02",
            patientId: "PAT-2026-0102",
            patientName: "Sunita Deshpande",
            age: 34,
            gender: "F",
            phone: "+91 97690 12890",
            doctorId: "DOC-01",
            doctorName: "Dr. Rajeshwar Sharma",
            dept: "General Medicine",
            room: "OPD-102",
            visitType: "Follow-up",
            time: "10:00 AM",
            status: "Called",
            priority: "Normal",
            vitalStatus: "Vitals Recorded",
            calledAt: "10:02 AM",
            waitTimeMin: "15 min"
        }
    ],

    appointments: [
        {
            id: "APT-8821",
            patientId: "PAT-2026-0101",
            patientName: "Vikramaditya Verma",
            doctor: "Dr. Rajeshwar Sharma",
            dept: "General Medicine",
            date: "Today, 05 Oct 2026",
            slot: "09:30 AM - 09:45 AM",
            type: "Regular Consult",
            status: "Completed",
            mode: "In-Clinic",
            channel: "Reception Desk"
        }
    ],

    // =========================================================================
    // PHASE 3: PHARMACY INVENTORY, BATCHES & GRN LEDGER (M10, PHA-01 - PHA-07)
    // =========================================================================
    pharmacyBatches: [
        {
            id: "BAT-01",
            medId: "MED-001",
            brand: "Tab. Glycomet GP 1/500",
            generic: "Glimepiride 1mg + Metformin 500mg SR",
            batchNo: "GLY-26B04",
            mfgDate: "03/2026",
            expiryDate: "02/2028",
            daysToExpiry: 480,
            stockQty: 840,
            unit: "Tablets",
            rackLocation: "Rack B-04",
            purchaseRate: 7.20,
            mrpRate: 11.50,
            supplier: "Cipla Healthcare Distribution",
            schedule: "Schedule H",
            status: "In Stock"
        },
        {
            id: "BAT-02",
            medId: "MED-002",
            brand: "Tab. Telma 40",
            generic: "Telmisartan 40mg",
            batchNo: "TEL-26D12",
            mfgDate: "04/2026",
            expiryDate: "03/2028",
            daysToExpiry: 510,
            stockQty: 1200,
            unit: "Tablets",
            rackLocation: "Rack A-02",
            purchaseRate: 5.80,
            mrpRate: 9.80,
            supplier: "Glenmark Pharma Depot",
            schedule: "Schedule H",
            status: "In Stock"
        },
        {
            id: "BAT-03",
            medId: "MED-003",
            brand: "Tab. Augmentin 625 Duo",
            generic: "Amoxicillin 500mg + Clavulanic Acid 125mg",
            batchNo: "AUG-25K09",
            mfgDate: "11/2025",
            expiryDate: "10/2026",
            daysToExpiry: 24, // Near Expiry Flag!
            stockQty: 320,
            unit: "Tablets",
            rackLocation: "Rack C-01",
            purchaseRate: 16.50,
            mrpRate: 24.50,
            supplier: "GSK India Distributor",
            schedule: "Schedule H1 (Prescription Required)",
            status: "Near Expiry (24 Days)"
        },
        {
            id: "BAT-04",
            medId: "MED-004",
            brand: "Tab. Pan-D",
            generic: "Pantoprazole 40mg + Domperidone 30mg SR",
            batchNo: "PAN-26A01",
            mfgDate: "01/2026",
            expiryDate: "12/2027",
            daysToExpiry: 420,
            stockQty: 650,
            unit: "Capsules",
            rackLocation: "Rack A-08",
            purchaseRate: 9.50,
            mrpRate: 15.00,
            supplier: "Alkem Laboratories",
            schedule: "Schedule H",
            status: "In Stock"
        },
        {
            id: "BAT-05",
            medId: "MED-005",
            brand: "Tab. Dolo 650",
            generic: "Paracetamol 650mg",
            batchNo: "DOL-26E22",
            mfgDate: "05/2026",
            expiryDate: "04/2029",
            daysToExpiry: 920,
            stockQty: 45, // Low Stock Flag! (threshold < 100)
            unit: "Tablets",
            rackLocation: "Rack D-02",
            purchaseRate: 1.90,
            mrpRate: 3.20,
            supplier: "Micro Labs Ltd",
            schedule: "OTC",
            status: "Low Stock Alert"
        },
        {
            id: "BAT-06",
            medId: "MED-007",
            brand: "Tab. Rosuvas 10",
            generic: "Rosuvastatin 10mg",
            batchNo: "ROS-26C18",
            mfgDate: "03/2026",
            expiryDate: "02/2028",
            daysToExpiry: 480,
            stockQty: 510,
            unit: "Tablets",
            rackLocation: "Rack B-01",
            purchaseRate: 10.20,
            mrpRate: 16.40,
            supplier: "Sun Pharma Depot",
            schedule: "Schedule H",
            status: "In Stock"
        }
    ],

    pharmacySuppliers: [
        { id: "SUP-01", name: "Cipla Healthcare Distribution", contact: "Rajesh Jain", phone: "+91 98201 11223", gstin: "27AAAC1234F1Z1", paymentTerms: "30 Days Credit" },
        { id: "SUP-02", name: "Sun Pharma Depot Mumbai", contact: "Pradeep Mehta", phone: "+91 98202 33445", gstin: "27AAAS9876G1Z4", paymentTerms: "45 Days Credit" },
        { id: "SUP-03", name: "GSK Healthcare Logistics", contact: "Amitabh Sen", phone: "+91 98203 55667", gstin: "27AAAG4567H1Z8", paymentTerms: "15 Days Credit" }
    ],

    recentGrnOrders: [
        { grnNo: "GRN-2026-0082", supplier: "Cipla Healthcare Distribution", invoiceNo: "INV/CIP/9412", date: "02 Oct 2026", itemsCount: 4, totalAmount: 48600, status: "Verified & Stock Added" },
        { grnNo: "GRN-2026-0081", supplier: "Sun Pharma Depot Mumbai", invoiceNo: "INV/SUN/8812", date: "28 Sep 2026", itemsCount: 6, totalAmount: 72400, status: "Verified & Stock Added" }
    ],

    // Clinical Safety Drug Interaction Matrix (CLN-01)
    drugInteractions: [
        { drugA: "Telmisartan", drugB: "Potassium Supplements / Spironolactone", severity: "High", alert: "Risk of severe Hyperkalemia and cardiac arrhythmias." },
        { drugA: "Amoxicillin / Augmentin", drugB: "Penicillin Allergy", severity: "Critical Safety Conflict", alert: "Patient has documented Penicillin allergy. Risk of Anaphylaxis!" },
        { drugA: "Glimepiride", drugB: "Ciprofloxacin / NSAIDs", severity: "Moderate", alert: "Enhanced hypoglycemic response. Monitor blood glucose closely." }
    ],

    // =========================================================================
    // PHASE 3: LABORATORY TEST MASTER & ORDERS WORKLIST (M11, LAB-01 - LAB-07)
    // =========================================================================
    labTestsCatalogDetailed: [
        {
            code: "LAB-01",
            name: "HbA1c (Glycosylated Hemoglobin)",
            category: "Biochemistry / Diabetology",
            sampleType: "Whole Blood (EDTA - Purple Top)",
            price: 450,
            tat: "4 Hours",
            parameters: [
                { name: "HbA1c (Glycosylated Hb)", unit: "%", refRange: "4.0 - 5.6 (Normal), 5.7 - 6.4 (Prediabetes), >= 6.5 (Diabetes)", defaultVal: "7.8", flag: "High" },
                { name: "Estimated Average Glucose (eAG)", unit: "mg/dL", refRange: "70 - 115", defaultVal: "177", flag: "High" }
            ]
        },
        {
            code: "LAB-02",
            name: "Fasting & Post-Prandial Glucose (FBS / PPBS)",
            category: "Biochemistry",
            sampleType: "Fluoride Plasma (Grey Top)",
            price: 200,
            tat: "2 Hours",
            parameters: [
                { name: "Fasting Blood Sugar (FBS)", unit: "mg/dL", refRange: "70 - 99", defaultVal: "148", flag: "High" },
                { name: "Post-Prandial Blood Sugar (PPBS)", unit: "mg/dL", refRange: "< 140", defaultVal: "210", flag: "High" }
            ]
        },
        {
            code: "LAB-03",
            name: "Complete Blood Count (CBC) with ESR",
            category: "Hematology",
            sampleType: "Whole Blood (EDTA - Purple Top)",
            price: 350,
            tat: "3 Hours",
            parameters: [
                { name: "Hemoglobin (Hb)", unit: "g/dL", refRange: "13.0 - 17.0 (Male)", defaultVal: "14.2", flag: "Normal" },
                { name: "Total WBC Count", unit: "/cumm", refRange: "4,000 - 11,000", defaultVal: "7,800", flag: "Normal" },
                { name: "Platelet Count", unit: "lakhs/cumm", refRange: "1.50 - 4.50", defaultVal: "2.80", flag: "Normal" },
                { name: "ESR (Westergren)", unit: "mm/hr", refRange: "0 - 15", defaultVal: "12", flag: "Normal" }
            ]
        },
        {
            code: "LAB-04",
            name: "Lipid Profile Comprehensive",
            category: "Biochemistry / Cardiology",
            sampleType: "Serum (Plain - Red / Gel Top)",
            price: 750,
            tat: "6 Hours",
            parameters: [
                { name: "Total Cholesterol", unit: "mg/dL", refRange: "< 200", defaultVal: "218", flag: "Borderline High" },
                { name: "Triglycerides", unit: "mg/dL", refRange: "< 150", defaultVal: "185", flag: "High" },
                { name: "HDL Cholesterol (Good)", unit: "mg/dL", refRange: "> 40", defaultVal: "42", flag: "Normal" },
                { name: "LDL Cholesterol (Calculated)", unit: "mg/dL", refRange: "< 100", defaultVal: "139", flag: "High" }
            ]
        },
        {
            code: "LAB-06",
            name: "Thyroid Profile Total (T3, T4, TSH)",
            category: "Endocrinology",
            sampleType: "Serum (Plain - Red Top)",
            price: 600,
            tat: "6 Hours",
            parameters: [
                { name: "Total T3", unit: "ng/dL", refRange: "60 - 200", defaultVal: "110", flag: "Normal" },
                { name: "Total T4", unit: "ug/dL", refRange: "4.5 - 12.0", defaultVal: "7.8", flag: "Normal" },
                { name: "TSH (Ultrasensitive)", unit: "uIU/mL", refRange: "0.35 - 4.94", defaultVal: "2.45", flag: "Normal" }
            ]
        }
    ],

    activeLabWorklist: [
        {
            orderId: "LAB-ORD-9941",
            sampleBarcode: "SAM-8849102",
            patientId: "PAT-2026-0101",
            patientName: "Vikramaditya Verma",
            mrn: "MRN-90142",
            ageSex: "48 Y / M",
            testCode: "LAB-01",
            testName: "HbA1c & Fasting Glucose Screening",
            category: "Biochemistry",
            orderedBy: "Dr. Rajeshwar Sharma",
            orderTime: "Today, 09:40 AM",
            sampleStatus: "Sample Collected", // Ordered, Sample Collected, Processing, Pending Verification, Released
            collectedBy: "Phlebotomist Ramesh K.",
            sampleTime: "09:55 AM",
            criticalAlert: false,
            resultEntered: true,
            verificationStatus: "Ready for Pathologist Review"
        },
        {
            orderId: "LAB-ORD-9942",
            sampleBarcode: "SAM-8849103",
            patientId: "PAT-2026-0102",
            patientName: "Sunita Deshpande",
            mrn: "MRN-90143",
            ageSex: "34 Y / F",
            testCode: "LAB-06",
            testName: "Thyroid Profile Total (T3, T4, TSH)",
            category: "Endocrinology",
            orderedBy: "Dr. Rajeshwar Sharma",
            orderTime: "Today, 10:05 AM",
            sampleStatus: "Released",
            collectedBy: "Phlebotomist Ramesh K.",
            sampleTime: "10:12 AM",
            criticalAlert: false,
            resultEntered: true,
            verificationStatus: "Verified & Released by Dr. Meera Kulkarni"
        },
        {
            orderId: "LAB-ORD-9943",
            sampleBarcode: "SAM-8849104",
            patientId: "PAT-2026-0105",
            patientName: "Kabir Khan",
            mrn: "MRN-90146",
            ageSex: "29 Y / M",
            testCode: "LAB-03",
            testName: "Complete Blood Count (CBC) with ESR",
            category: "Hematology",
            orderedBy: "Dr. Rajeshwar Sharma",
            orderTime: "Today, 10:20 AM",
            sampleStatus: "Processing",
            collectedBy: "Phlebotomist Anita S.",
            sampleTime: "10:25 AM",
            criticalAlert: false,
            resultEntered: false,
            verificationStatus: "Under Analysis (Sysmex XN-350)"
        }
    ],

    // Phase 2 Datasets preserved
    feedbackReviews: [
        { id: "FB-101", patientName: "Vikramaditya Verma", doctor: "Dr. Rajeshwar Sharma", rating: 5, npsScore: 10, tags: ["Detailed Consultation", "Friendly Staff", "Accurate Diagnosis"], comment: "Excellent care and advice. The digital prescription and instant WhatsApp link are super convenient.", date: "Today, 10:20 AM" },
        { id: "FB-102", patientName: "Sunita Deshpande", doctor: "Dr. Rajeshwar Sharma", rating: 5, npsScore: 9, tags: ["Short Wait Time", "Clean Clinic"], comment: "Very smooth check-in process and doctor explained thyroid reports very clearly.", date: "18 Sep 2026" }
    ],

    doctorLeaves: [
        { id: "LV-01", doctorId: "DOC-01", doctorName: "Dr. Rajeshwar Sharma", fromDate: "2026-10-12", toDate: "2026-10-14", reason: "Annual Medical Conference (APICON)", status: "Approved & Schedule Blocked" }
    ],

    waitlist: [
        { id: "WL-01", patientName: "Harish Iyer", phone: "+91 98201 55901", doctor: "Dr. Rajeshwar Sharma", requestedSlot: "Morning (09:00 - 11:00 AM)", priority: "Urgent", status: "Active Waitlist" }
    ],

    analytics: {
        revenueByMonth: [
            { month: "May", opd: 380000, lab: 120000, pharmacy: 95000, total: 595000 },
            { month: "Jun", opd: 420000, lab: 145000, pharmacy: 110000, total: 675000 },
            { month: "Jul", opd: 460000, lab: 160000, pharmacy: 125000, total: 745000 },
            { month: "Aug", opd: 510000, lab: 180000, pharmacy: 140000, total: 830000 },
            { month: "Sep", opd: 580000, lab: 210000, pharmacy: 165000, total: 955000 },
            { month: "Oct (Proj)", opd: 640000, lab: 235000, pharmacy: 190000, total: 1065000 }
        ],
        appointmentStats: { totalBooked: 480, completed: 432, noShows: 28, cancelled: 20, completionRate: "90%", noShowRate: "5.8%" },
        npsScore: 78,
        avgRating: 4.85
    },

    subscriptionPlans: [
        { id: "starter", name: "Starter Clinic", price: "₹ 1,999 / mo", target: "Single Doctor Practice", features: ["1 Doctor & 2 Staff Logins", "Patient Registration & EMR", "Appointment & Queue Tokens", "Digital Prescription PDF", "Basic Billing & Receipts", "Standard Audit Trail"] },
        { id: "pro", name: "Clinic Pro", price: "₹ 4,999 / mo", target: "2-5 Doctor Polyclinics", features: ["Up to 5 Doctors & 10 Staff", "Interactive Patient Portal (OTP)", "Public Online Booking Page", "WhatsApp & SMS Reminders", "UPI Payment Links & Reconciliation", "Doctor Leave & Smart Waitlist", "NPS & Patient Feedback System"] },
        { id: "polyclinic", name: "Polyclinic & Lab Suite", badge: "CURRENT ACTIVE PLAN", price: "₹ 8,999 / mo", target: "Diagnostic & Polyclinic Chains", features: ["Unlimited Doctors & Staff", "Integrated Pharmacy & Batch FEFO", "Pathology Lab Orders & Verification", "Digital Lab Report Builder with Signatures", "Clinical Drug Interaction Alerts", "Doctor Revenue Share Payouts", "Custom Domain & White-Label"] },
        { id: "hospital", name: "Hospital Core (IPD)", price: "₹ 19,999 / mo", target: "Nursing Homes & 50-200 Bed Hospitals", features: ["Full OPD + IPD Admission System", "Interactive Real-Time Bed Map", "Nursing Station & Care Plans", "Discharge Summary & Interim Bills", "Insurance / TPA Claims Desk", "Biomedical & CSSD Tracking"] }
    ],

    medicineMaster: [
        { id: "MED-001", brand: "Tab. Glycomet GP 1/500", generic: "Glimepiride 1mg + Metformin 500mg SR", category: "Antidiabetic", form: "Tablet", strength: "1mg/500mg", defaultDose: "1 Tab", defaultFreq: "1-0-1 (Twice Daily)", defaultTiming: "Before Breakfast & Dinner", defaultDuration: "30 Days", stock: 840, price: 11.50 },
        { id: "MED-002", brand: "Tab. Telma 40", generic: "Telmisartan 40mg", category: "Antihypertensive", form: "Tablet", strength: "40mg", defaultDose: "1 Tab", defaultFreq: "1-0-0 (Morning Once)", defaultTiming: "After Breakfast", defaultDuration: "30 Days", stock: 1200, price: 9.80 },
        { id: "MED-003", brand: "Tab. Augmentin 625 Duo", generic: "Amoxicillin 500mg + Clavulanic Acid 125mg", category: "Antibiotic", form: "Tablet", strength: "625mg", defaultDose: "1 Tab", defaultFreq: "1-0-1 (Twice Daily)", defaultTiming: "After Food", defaultDuration: "5 Days", stock: 320, price: 24.50 },
        { id: "MED-004", brand: "Tab. Pan-D", generic: "Pantoprazole 40mg + Domperidone 30mg SR", category: "Antacid / GI", form: "Capsule", strength: "40mg/30mg", defaultDose: "1 Cap", defaultFreq: "1-0-0 (Morning Once)", defaultTiming: "Empty Stomach (30 min before food)", defaultDuration: "14 Days", stock: 650, price: 15.00 },
        { id: "MED-005", brand: "Tab. Dolo 650", generic: "Paracetamol 650mg", category: "Analgesic / Antipyretic", form: "Tablet", strength: "650mg", defaultDose: "1 Tab", defaultFreq: "1-1-1 (SOS / 8 Hourly)", defaultTiming: "After Food (when fever >100°F)", defaultDuration: "3 Days", stock: 2400, price: 3.20 },
        { id: "MED-006", brand: "Tab. Montair-LC", generic: "Montelukast 10mg + Levocetirizine 5mg", category: "Antiallergic / Respiratory", form: "Tablet", strength: "10mg/5mg", defaultDose: "1 Tab", defaultFreq: "0-0-1 (Night Once)", defaultTiming: "At Bedtime", defaultDuration: "7 Days", stock: 450, price: 18.20 },
        { id: "MED-007", brand: "Tab. Rosuvas 10", generic: "Rosuvastatin 10mg", category: "Lipid Lowering / Statin", form: "Tablet", strength: "10mg", defaultDose: "1 Tab", defaultFreq: "0-0-1 (Night Once)", defaultTiming: "After Dinner", defaultDuration: "30 Days", stock: 510, price: 16.40 }
    ],

    prescriptionTemplates: [
        {
            name: "Type-2 Diabetes & Hypertension Review",
            diagnosis: "E11.9 (Type 2 DM) & I10 (Essential Hypertension)",
            items: [
                { medId: "MED-001", brand: "Tab. Glycomet GP 1/500", dose: "1 Tab", freq: "1-0-1", duration: "30 Days", timing: "Before Meals", qty: 60 },
                { medId: "MED-002", brand: "Tab. Telma 40", dose: "1 Tab", freq: "1-0-0", duration: "30 Days", timing: "After Breakfast", qty: 30 },
                { medId: "MED-007", brand: "Tab. Rosuvas 10", dose: "1 Tab", freq: "0-0-1", duration: "30 Days", timing: "After Dinner", qty: 30 }
            ],
            advice: "Low salt, diabetic diet. Fasting & PP blood sugar chart weekly. Morning brisk walk 30 mins."
        },
        {
            name: "Acute Upper Respiratory Infection (URTI) / Flu",
            diagnosis: "J06.9 (Acute Upper Respiratory Infection)",
            items: [
                { medId: "MED-003", brand: "Tab. Augmentin 625 Duo", dose: "1 Tab", freq: "1-0-1", duration: "5 Days", timing: "After Food", qty: 10 },
                { medId: "MED-005", brand: "Tab. Dolo 650", dose: "1 Tab", freq: "1-1-1 SOS", duration: "3 Days", timing: "After Food (for fever/bodyache)", qty: 9 },
                { medId: "MED-006", brand: "Tab. Montair-LC", dose: "1 Tab", freq: "0-0-1", duration: "7 Days", timing: "At Bedtime", qty: 7 },
                { medId: "MED-004", brand: "Tab. Pan-D", dose: "1 Cap", freq: "1-0-0", duration: "5 Days", timing: "Empty Stomach", qty: 5 }
            ],
            advice: "Steam inhalation 2-3 times daily, warm saline gargles, adequate hydration. Review if fever persists > 48h."
        }
    ],

    labOrdersCatalog: [
        { code: "LAB-01", name: "HbA1c (Glycosylated Hemoglobin)", category: "Biochemistry", price: 450, tat: "4 Hours", fasting: "Not required" },
        { code: "LAB-02", name: "Fasting & Post-Prandial Blood Sugar (FBS/PPBS)", category: "Biochemistry", price: 200, tat: "2 Hours", fasting: "8-10 Hrs Fasting" },
        { code: "LAB-03", name: "Complete Blood Count (CBC) with ESR", category: "Hematology", price: 350, tat: "3 Hours", fasting: "Not required" },
        { code: "LAB-04", name: "Lipid Profile Comprehensive", category: "Biochemistry", price: 750, tat: "6 Hours", fasting: "12 Hrs Overnight Fasting" },
        { code: "LAB-06", name: "Thyroid Profile Total (T3, T4, TSH)", category: "Endocrinology", price: 600, tat: "6 Hours", fasting: "Morning fasting preferred" }
    ],

    recentInvoices: [
        {
            invoiceNo: "INV-2026-00491",
            receiptNo: "REC-9412",
            date: "Today, 10:14 AM",
            patientId: "PAT-2026-0101",
            patientName: "Vikramaditya Verma",
            mrn: "MRN-90142",
            doctor: "Dr. Rajeshwar Sharma",
            services: [
                { item: "Specialist Consultation Fee (General Medicine)", code: "SRV-CONS-01", qty: 1, rate: 800, amount: 800 },
                { item: "HbA1c & Fasting Glucose Screening", code: "LAB-01", qty: 1, rate: 450, amount: 450 },
                { item: "Prescription Dispense (Pharmacy Tally)", code: "PHA-DISP-01", qty: 1, rate: 980, amount: 980 }
            ],
            subtotal: 2230,
            discount: 0,
            total: 2230,
            paidAmount: 2230,
            balanceDue: 0,
            paymentMode: "UPI / QR (PhonePe)",
            transactionRef: "UPI/394829104829/APEX",
            status: "Paid & Receipt Generated",
            billedBy: "Kiran R. (Billing Desk 1)"
        }
    ],

    auditLogs: [
        { id: "AUD-991", time: "10:15:32 AM", actor: "Dr. Rajeshwar Sharma (DOC-01)", action: "PRESCRIPTION_FINALIZED", entity: "Prescription #RX-2026-0914", tenant: "TEN-MUM-001", details: "Finalized & digitally signed 3 items for PAT-2026-0101 (Vikramaditya Verma). QR generated.", ip: "192.168.1.104" },
        { id: "AUD-990", time: "10:14:18 AM", actor: "Kiran R. (Billing Desk)", action: "INVOICE_PAID_RECEIPT", entity: "Invoice #INV-2026-00491", tenant: "TEN-MUM-001", details: "Collected ₹2,230 via UPI ref: UPI/394829104829/APEX. Zero balance.", ip: "192.168.1.110" }
    ],

    kpis: {
        totalPatientsToday: 42,
        activeQueue: 14,
        consultationsCompleted: 28,
        totalRevenueToday: "₹ 54,830",
        pharmacySalesToday: "₹ 24,190",
        labOrdersToday: 32,
        cashInHand: "₹ 16,400",
        upiOnline: "₹ 38,430",
        avgWaitTimeMin: 14,
        occupancyRate: "88%"
    }
};

window.MediData = MediData;
