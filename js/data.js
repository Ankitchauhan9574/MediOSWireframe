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

    // =========================================================================
    // PHASE 4: HOSPITAL / IPD, BEDS, NURSING & DISCHARGE SUITE (M13, M14, M15, IPD-01 to 07)
    // =========================================================================
    wards: [
        { id: "WARD-ICU", name: "Intensive Care Unit (ICU / CCU)", code: "ICU", floor: "3rd Floor, Critical Wing", totalBeds: 6, dailyRate: 6500, nurseRatio: "1:1", ventilatorSupport: true },
        { id: "WARD-GW-M", name: "Male Medical / Surgical Ward", code: "MSW", floor: "2nd Floor, East Wing", totalBeds: 8, dailyRate: 1800, nurseRatio: "1:4", ventilatorSupport: false },
        { id: "WARD-GW-F", name: "Female Medical / Ob-Gyn Ward", code: "FMW", floor: "2nd Floor, West Wing", totalBeds: 8, dailyRate: 1800, nurseRatio: "1:4", ventilatorSupport: false },
        { id: "WARD-SP", name: "Semi-Private Ward (Twin Sharing)", code: "SPW", floor: "4th Floor, South Wing", totalBeds: 6, dailyRate: 3500, nurseRatio: "1:2", ventilatorSupport: false },
        { id: "WARD-DLX", name: "Deluxe Executive Suite", code: "DLX", floor: "5th Floor, Suite Wing", totalBeds: 4, dailyRate: 7500, nurseRatio: "1:1", ventilatorSupport: false }
    ],

    beds: [
        // ICU Beds
        { id: "BED-ICU-01", wardId: "WARD-ICU", wardName: "ICU / CCU", bedNo: "ICU-01", type: "Motorized Critical Care Bed", status: "Occupied", patientId: "PAT-2026-0103", patientName: "Rameshwar Kulkarni", ipdNo: "IPD-2026-0082", admissionDate: "03 Oct 2026", doctor: "Dr. Ananya Nair", pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-ICU-02", wardId: "WARD-ICU", wardName: "ICU / CCU", bedNo: "ICU-02", type: "Motorized Critical Care Bed", status: "Occupied", patientId: "PAT-2026-0105", patientName: "Zoya Akhtar", ipdNo: "IPD-2026-0085", admissionDate: "04 Oct 2026", doctor: "Dr. Rajeshwar Sharma", pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-ICU-03", wardId: "WARD-ICU", wardName: "ICU / CCU", bedNo: "ICU-03", type: "Motorized Critical Care Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-ICU-04", wardId: "WARD-ICU", wardName: "ICU / CCU", bedNo: "ICU-04", type: "Motorized Critical Care Bed", status: "Cleaning", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-ICU-05", wardId: "WARD-ICU", wardName: "ICU / CCU", bedNo: "ICU-05", type: "Motorized Critical Care Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-ICU-06", wardId: "WARD-ICU", wardName: "ICU / CCU", bedNo: "ICU-06", type: "Motorized Critical Care Bed", status: "Blocked", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },

        // Semi-Private
        { id: "BED-SP-101", wardId: "WARD-SP", wardName: "Semi-Private Ward", bedNo: "SP-101A", type: "Semi-Fowler Bed", status: "Occupied", patientId: "PAT-2026-0101", patientName: "Vikramaditya Verma", ipdNo: "IPD-2026-0089", admissionDate: "05 Oct 2026", doctor: "Dr. Rajeshwar Sharma", pulseOximeter: false, oxygen: true, ivPump: false },
        { id: "BED-SP-102", wardId: "WARD-SP", wardName: "Semi-Private Ward", bedNo: "SP-101B", type: "Semi-Fowler Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-SP-103", wardId: "WARD-SP", wardName: "Semi-Private Ward", bedNo: "SP-102A", type: "Semi-Fowler Bed", status: "Occupied", patientId: "PAT-2026-0106", patientName: "Harishchandra Mehta", ipdNo: "IPD-2026-0087", admissionDate: "02 Oct 2026", doctor: "Dr. Rajeshwar Sharma", pulseOximeter: false, oxygen: false, ivPump: true },
        { id: "BED-SP-104", wardId: "WARD-SP", wardName: "Semi-Private Ward", bedNo: "SP-102B", type: "Semi-Fowler Bed", status: "Cleaning", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-SP-105", wardId: "WARD-SP", wardName: "Semi-Private Ward", bedNo: "SP-103A", type: "Semi-Fowler Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-SP-106", wardId: "WARD-SP", wardName: "Semi-Private Ward", bedNo: "SP-103B", type: "Semi-Fowler Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },

        // Deluxe Suite
        { id: "BED-DLX-501", wardId: "WARD-DLX", wardName: "Deluxe Suite", bedNo: "DLX-501", type: "Full Electric Luxury Hospital Bed", status: "Occupied", patientId: "PAT-2026-0104", patientName: "Ayesha Mansoori", ipdNo: "IPD-2026-0084", admissionDate: "04 Oct 2026", doctor: "Dr. Ananya Nair", pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-DLX-502", wardId: "WARD-DLX", wardName: "Deluxe Suite", bedNo: "DLX-502", type: "Full Electric Luxury Hospital Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-DLX-503", wardId: "WARD-DLX", wardName: "Deluxe Suite", bedNo: "DLX-503", type: "Full Electric Luxury Hospital Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },
        { id: "BED-DLX-504", wardId: "WARD-DLX", wardName: "Deluxe Suite", bedNo: "DLX-504", type: "Full Electric Luxury Hospital Bed", status: "Cleaning", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: true, oxygen: true, ivPump: true },

        // General Ward Male
        { id: "BED-MSW-201", wardId: "WARD-GW-M", wardName: "Male Medical/Surgical Ward", bedNo: "MSW-201", type: "Standard Ward Bed", status: "Occupied", patientId: "PAT-2026-0107", patientName: "Mohammed Farooq", ipdNo: "IPD-2026-0088", admissionDate: "01 Oct 2026", doctor: "Dr. Rajeshwar Sharma", pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-MSW-202", wardId: "WARD-GW-M", wardName: "Male Medical/Surgical Ward", bedNo: "MSW-202", type: "Standard Ward Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-MSW-203", wardId: "WARD-GW-M", wardName: "Male Medical/Surgical Ward", bedNo: "MSW-203", type: "Standard Ward Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-MSW-204", wardId: "WARD-GW-M", wardName: "Male Medical/Surgical Ward", bedNo: "MSW-204", type: "Standard Ward Bed", status: "Occupied", patientId: "PAT-2026-0108", patientName: "Sanjay Raut", ipdNo: "IPD-2026-0086", admissionDate: "03 Oct 2026", doctor: "Dr. Rajeshwar Sharma", pulseOximeter: false, oxygen: true, ivPump: true },

        // General Ward Female
        { id: "BED-FMW-205", wardId: "WARD-GW-F", wardName: "Female Medical Ward", bedNo: "FMW-205", type: "Standard Ward Bed", status: "Occupied", patientId: "PAT-2026-0102", patientName: "Sunita Deshpande", ipdNo: "IPD-2026-0083", admissionDate: "02 Oct 2026", doctor: "Dr. Rajeshwar Sharma", pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-FMW-206", wardId: "WARD-GW-F", wardName: "Female Medical Ward", bedNo: "FMW-206", type: "Standard Ward Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-FMW-207", wardId: "WARD-GW-F", wardName: "Female Medical Ward", bedNo: "FMW-207", type: "Standard Ward Bed", status: "Vacant", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false },
        { id: "BED-FMW-208", wardId: "WARD-GW-F", wardName: "Female Medical Ward", bedNo: "FMW-208", type: "Standard Ward Bed", status: "Cleaning", patientId: null, patientName: null, ipdNo: null, admissionDate: null, doctor: null, pulseOximeter: false, oxygen: false, ivPump: false }
    ],

    ipdAdmissions: [
        {
            ipdNo: "IPD-2026-0089",
            patientId: "PAT-2026-0101",
            patientName: "Vikramaditya Verma",
            age: 48,
            gender: "Male",
            bloodGroup: "B+",
            contact: "+91 98201 98765",
            mrn: "MRN-90142",
            admitDateTime: "05 Oct 2026, 09:30 AM",
            admitDays: 2,
            consultantDoctor: "Dr. Rajeshwar Sharma",
            department: "General Medicine & Diabetology",
            admissionReason: "Uncontrolled Hyperglycemia with Ketonuria & Severe Dehydration",
            diagnosisICD: "E11.65 (Type 2 DM with hyperglycemia & electrolyte imbalance)",
            wardId: "WARD-SP",
            wardName: "Semi-Private Ward",
            bedNo: "SP-101A",
            bedDailyTariff: 3500,
            nursingTariff: 1000,
            doctorVisitDailyTariff: 1200,
            payerType: "TPA Insurance (Star Health Gold Policy #SH-884129)",
            advanceDeposit: 25000,
            status: "Admitted", // Admitted, Planned Discharge, Discharged
            allergies: "Penicillin (Moderate - Skin rash)",
            diet: "Diabetic Salt-Restricted Diet (1600 kcal)",
            vitalsChart: [
                { time: "05 Oct, 10:00 AM", bp: "142/90", pulse: 88, temp: "99.1°F", spo2: "98%", sugar: "294 mg/dL", pain: "2/10", nurse: "Staff Nurse Sarita" },
                { time: "05 Oct, 02:00 PM", bp: "136/86", pulse: 82, temp: "98.6°F", spo2: "99%", sugar: "230 mg/dL", pain: "1/10", nurse: "Staff Nurse Sarita" },
                { time: "05 Oct, 08:00 PM", bp: "130/84", pulse: 78, temp: "98.4°F", spo2: "99%", sugar: "186 mg/dL", pain: "0/10", nurse: "Staff Nurse Pooja" },
                { time: "06 Oct, 08:00 AM", bp: "126/80", pulse: 74, temp: "98.4°F", spo2: "99%", sugar: "148 mg/dL", pain: "0/10", nurse: "Staff Nurse Pooja" }
            ],
            medicationSchedule: [
                { id: "MED-ADM-01", medicine: "Inj. Human Actrapid (Regular Insulin)", dose: "8 Units s/c", timing: "08:00 AM (Before Breakfast)", route: "Subcutaneous", status: "Given", administeredAt: "08:15 AM", administeredBy: "Staff Nurse Pooja" },
                { id: "MED-ADM-02", medicine: "IV Fluid Normal Saline 0.9% 500ml", dose: "75 ml/hr", timing: "Continuous Infusion", route: "Intravenous", status: "Given", administeredAt: "08:30 AM", administeredBy: "Staff Nurse Pooja" },
                { id: "MED-ADM-03", medicine: "Inj. Pantoprazole 40mg", dose: "1 Ampoule IV", timing: "09:00 AM", route: "Intravenous", status: "Given", administeredAt: "09:05 AM", administeredBy: "Staff Nurse Pooja" },
                { id: "MED-ADM-04", medicine: "Inj. Human Actrapid (Regular Insulin)", dose: "6 Units s/c", timing: "01:30 PM (Before Lunch)", route: "Subcutaneous", status: "Due", administeredAt: null, administeredBy: null },
                { id: "MED-ADM-05", medicine: "Tab. Glycomet GP 1/500", dose: "1 Tab", timing: "08:00 PM (Before Dinner)", route: "Oral", status: "Due", administeredAt: null, administeredBy: null }
            ],
            doctorRoundsNotes: [
                { date: "05 Oct, 11:30 AM", doctor: "Dr. Rajeshwar Sharma", notes: "Patient admitted with blood sugar 294 mg/dL. Rehydration started with NS. IV regular insulin sliding scale initiated. Urine ketones trace positive. Monitor sugar 4 hourly.", orders: "CBG Q4H, Soft diabetic diet, maintain strict fluid balance chart." },
                { date: "06 Oct, 09:30 AM", doctor: "Dr. Rajeshwar Sharma", notes: "Vitals stable. Ketones negative today. Morning sugar improved to 148 mg/dL. Patient feels refreshed and appetite normal. Switch from IV insulin to oral hypoglycemics planned tomorrow for discharge.", orders: "Continue Glycomet GP 1/500, encourage oral fluid intake 2.5L/day." }
            ],
            runningCharges: {
                roomCharges: 7000, // 2 days * 3500
                nursingCharges: 2000, // 2 days * 1000
                doctorConsultationCharges: 2400, // 2 rounds * 1200
                pharmacyCharges: 4680, // IV fluids, insulin, syringes, cannula
                labCharges: 2150, // Blood sugar series, Urine ketones, Electrolytes
                subtotal: 18230,
                taxGst: 0, // Healthcare services exempt
                totalEstimated: 18230,
                advancePaid: 25000,
                netBalance: -6770 // Refund/Surplus
            },
            dischargeSummary: {
                dischargeDate: "07 Oct 2026 (Planned)",
                conditionOnDischarge: "Hemodynamically Stable, Euglycemic, Ambulatory",
                summaryNotes: "Patient treated successfully for acute diabetic decompensation and dehydration with IV hydration and insulin protocol. Blood sugars stabilized. Discharged on revised oral anti-diabetic regimen.",
                dischargeMeds: [
                    { drug: "Tab. Glycomet GP 1/500", dose: "1 Tab", freq: "1-0-1 (Twice Daily)", timing: "Before Meals", days: "30 Days" },
                    { drug: "Tab. Telma 40", dose: "1 Tab", freq: "1-0-0 (Morning Once)", timing: "After Breakfast", days: "30 Days" },
                    { drug: "Tab. Pan-D", dose: "1 Cap", freq: "1-0-0 (Morning Once)", timing: "30 mins Before Breakfast", days: "7 Days" }
                ],
                followUpAdvice: "Review in OPD Room 102 after 10 days with Fasting & PP Blood Sugar chart.",
                emergencyWarning: "Report immediately to ER if persistent dizziness, sweating, tremors, vomiting or CBG < 70 mg/dL."
            }
        },
        {
            ipdNo: "IPD-2026-0082",
            patientId: "PAT-2026-0103",
            patientName: "Rameshwar Kulkarni",
            age: 64,
            gender: "Male",
            bloodGroup: "O+",
            contact: "+91 98330 44123",
            mrn: "MRN-88124",
            admitDateTime: "03 Oct 2026, 04:15 PM",
            admitDays: 3,
            consultantDoctor: "Dr. Ananya Nair",
            department: "Interventional Cardiology",
            admissionReason: "Unstable Angina with Acute Coronary Syndrome (ACS) Post-Angiography",
            diagnosisICD: "I20.0 (Unstable Angina) / Coronary Artery Disease",
            wardId: "WARD-ICU",
            wardName: "Intensive Care Unit (ICU / CCU)",
            bedNo: "ICU-01",
            bedDailyTariff: 6500,
            nursingTariff: 2000,
            doctorVisitDailyTariff: 2000,
            payerType: "HDFC Ergo Health Insurance (#HE-4910284)",
            advanceDeposit: 50000,
            status: "Admitted",
            allergies: "No known drug allergies",
            diet: "Cardiac Low-Sodium Diet (1500 kcal)",
            vitalsChart: [
                { time: "06 Oct, 06:00 AM", bp: "128/82", pulse: 72, temp: "98.2°F", spo2: "98%", sugar: "134 mg/dL", pain: "0/10", nurse: "Nurse Maria (ICU In-charge)" }
            ],
            medicationSchedule: [
                { id: "MED-ADM-11", medicine: "Tab. Brilinta 90mg (Ticagrelor)", dose: "1 Tab", timing: "08:00 AM", route: "Oral", status: "Given", administeredAt: "08:05 AM", administeredBy: "Nurse Maria" },
                { id: "MED-ADM-12", medicine: "Inj. Clexane 60mg (Enoxaparin)", dose: "0.6 ml s/c", timing: "09:00 AM", route: "Subcutaneous", status: "Given", administeredAt: "09:10 AM", administeredBy: "Nurse Maria" },
                { id: "MED-ADM-13", medicine: "Tab. Rosuvas 20mg", dose: "1 Tab", timing: "09:00 PM", route: "Oral", status: "Due", administeredAt: null, administeredBy: null }
            ],
            doctorRoundsNotes: [
                { date: "06 Oct, 09:00 AM", doctor: "Dr. Ananya Nair", notes: "Patient chest pain free for last 48 hours. ECG normal sinus rhythm. Troponin levels trending down. 2D Echo shows EF 55%. Planned step-down transfer to Semi-Private room by afternoon.", orders: "Transfer to Step-down / Semi-Private. Mobilize patient gently." }
            ],
            runningCharges: {
                roomCharges: 19500,
                nursingCharges: 6000,
                doctorConsultationCharges: 6000,
                pharmacyCharges: 14850,
                labCharges: 8400,
                subtotal: 54750,
                taxGst: 0,
                totalEstimated: 54750,
                advancePaid: 50000,
                netBalance: 4750
            },
            dischargeSummary: {
                dischargeDate: "08 Oct 2026 (Planned)",
                conditionOnDischarge: "Stable, asymptomatic",
                summaryNotes: "Managed conservatively with dual antiplatelet and anticoagulation.",
                dischargeMeds: [],
                followUpAdvice: "Cardiology follow up with ECG in 7 days.",
                emergencyWarning: "Immediate emergency visit in case of retrosternal heaviness or sweating."
            }
        },
        {
            ipdNo: "IPD-2026-0085",
            patientId: "PAT-2026-0105",
            patientName: "Zoya Akhtar",
            age: 29,
            gender: "Female",
            bloodGroup: "A+",
            contact: "+91 97120 33491",
            mrn: "MRN-91044",
            admitDateTime: "04 Oct 2026, 11:00 AM",
            admitDays: 2,
            consultantDoctor: "Dr. Rajeshwar Sharma",
            department: "Internal Medicine",
            admissionReason: "Severe Acute Bronchial Asthma with Exacerbation & Hypoxia",
            diagnosisICD: "J45.901 (Unspecified asthma with acute exacerbation)",
            wardId: "WARD-ICU",
            wardName: "Intensive Care Unit (ICU / CCU)",
            bedNo: "ICU-02",
            bedDailyTariff: 6500,
            nursingTariff: 2000,
            doctorVisitDailyTariff: 1500,
            payerType: "Self Pay (Cash / UPI)",
            advanceDeposit: 30000,
            status: "Admitted",
            allergies: "NSAIDs, Aspirin (Severe Bronchospasm)",
            diet: "High Protein, Warm fluids",
            vitalsChart: [
                { time: "06 Oct, 08:30 AM", bp: "118/76", pulse: 84, temp: "98.6°F", spo2: "97% on Room Air", sugar: "108 mg/dL", pain: "0/10", nurse: "Nurse Maria" }
            ],
            medicationSchedule: [
                { id: "MED-ADM-21", medicine: "Nebulization Duolin + Budecort", dose: "1 Respule", timing: "08:00 AM", route: "Inhalation", status: "Given", administeredAt: "08:10 AM", administeredBy: "Nurse Maria" },
                { id: "MED-ADM-22", medicine: "Inj. Hydrocortisone 100mg IV", dose: "1 Vial", timing: "10:00 AM", route: "Intravenous", status: "Due", administeredAt: null, administeredBy: null }
            ],
            doctorRoundsNotes: [
                { date: "06 Oct, 10:15 AM", doctor: "Dr. Rajeshwar Sharma", notes: "Bilateral rhonchi much reduced. SpO2 maintaining 97% on room air. Taper systemic steroids to inhaler.", orders: "Stop IV Hydrocortisone after today. Continue MDI Formoterol + Budesonide." }
            ],
            runningCharges: {
                roomCharges: 13000,
                nursingCharges: 4000,
                doctorConsultationCharges: 3000,
                pharmacyCharges: 5200,
                labCharges: 1800,
                subtotal: 27000,
                taxGst: 0,
                totalEstimated: 27000,
                advancePaid: 30000,
                netBalance: -3000
            },
            dischargeSummary: {
                dischargeDate: "07 Oct 2026 (Planned)",
                conditionOnDischarge: "Stable, wheeze subsided",
                summaryNotes: "Nebulized and treated with bronchodilators.",
                dischargeMeds: [],
                followUpAdvice: "Review with PFT in 2 weeks.",
                emergencyWarning: "Use SOS inhaler and visit ER if breathlessness recurs."
            }
        },
        {
            ipdNo: "IPD-2026-0083",
            patientId: "PAT-2026-0102",
            patientName: "Sunita Deshpande",
            age: 52,
            gender: "Female",
            bloodGroup: "O+",
            contact: "+91 98199 43210",
            mrn: "MRN-89230",
            admitDateTime: "02 Oct 2026, 02:00 PM",
            admitDays: 4,
            consultantDoctor: "Dr. Rajeshwar Sharma",
            department: "General Medicine",
            admissionReason: "Severe Urinary Tract Infection with Sepsis & Pyrexia of Unknown Origin",
            diagnosisICD: "N39.0 (Urinary Tract Infection) & R50.9 (Fever)",
            wardId: "WARD-GW-F",
            wardName: "Female Medical Ward",
            bedNo: "FMW-205",
            bedDailyTariff: 1800,
            nursingTariff: 800,
            doctorVisitDailyTariff: 800,
            payerType: "Ayushman Bharat PM-JAY (Scheme #PMJAY-MH-9941)",
            advanceDeposit: 10000,
            status: "Planned Discharge",
            allergies: "Sulphonamides (Severe)",
            diet: "Normal High Hydration Diet",
            vitalsChart: [
                { time: "06 Oct, 08:00 AM", bp: "122/78", pulse: 76, temp: "98.4°F", spo2: "99%", sugar: "112 mg/dL", pain: "0/10", nurse: "Staff Nurse Sarita" }
            ],
            medicationSchedule: [
                { id: "MED-ADM-31", medicine: "Inj. Cefoperazone + Sulbactam 1.5g", dose: "1 Vial IV", timing: "08:00 AM", route: "Intravenous", status: "Given", administeredAt: "08:20 AM", administeredBy: "Staff Nurse Sarita" }
            ],
            doctorRoundsNotes: [
                { date: "06 Oct, 09:45 AM", doctor: "Dr. Rajeshwar Sharma", notes: "Afebrile for 72 hours. Repeat urine culture sterile. TLC normal at 7,400. Approved for discharge today.", orders: "Prepare discharge summary and PM-JAY pre-closure audit." }
            ],
            runningCharges: {
                roomCharges: 7200,
                nursingCharges: 3200,
                doctorConsultationCharges: 3200,
                pharmacyCharges: 4200,
                labCharges: 2900,
                subtotal: 20500,
                taxGst: 0,
                totalEstimated: 20500,
                advancePaid: 10000,
                netBalance: 10500
            },
            dischargeSummary: {
                dischargeDate: "06 Oct 2026 (Today)",
                conditionOnDischarge: "Fully recovered, Afebrile, Clinically Stable",
                summaryNotes: "Treated with IV third-generation cephalosporins according to urine culture sensitivity. Urine culture repeat negative.",
                dischargeMeds: [
                    { drug: "Tab. Cefixime 200mg", dose: "1 Tab", freq: "1-0-1 (Twice Daily)", timing: "After Food", days: "5 Days" },
                    { drug: "Syp. Citralka 10ml", dose: "2 Tsp in 1 glass water", freq: "1-1-1 (Thrice Daily)", timing: "After Meals", days: "7 Days" }
                ],
                followUpAdvice: "OPD Review after 7 days with routine urine examination.",
                emergencyWarning: "Consult immediately if high fever, chills, flank pain or burning micturition recurs."
            }
        }
    ],

    nursingStaff: [
        { id: "NUR-01", name: "Sarita Rane", role: "Staff Nurse (Ward Shift)", shift: "Morning (08:00 - 14:00)", assignedWard: "WARD-SP & WARD-GW" },
        { id: "NUR-02", name: "Maria D'Souza", role: "Senior Critical Care Nurse", shift: "Morning (08:00 - 14:00)", assignedWard: "WARD-ICU" },
        { id: "NUR-03", name: "Pooja Hegde", role: "Staff Nurse", shift: "Evening (14:00 - 20:00)", assignedWard: "WARD-SP" }
    ],

    // =========================================================================
    // PHASE 5: ENTERPRISE OPERATIONS — OT, TPA CLAIMS, PROCUREMENT & MULTI-BRANCH (M16, M17, M18)
    // =========================================================================
    otTheatres: [
        { id: "OT-01", name: "Major OT 1 (General & Laparoscopic)", type: "Modular Laminar Flow", status: "In Surgery", currentSurgery: "Laparoscopic Cholecystectomy", surgeon: "Dr. Rajeshwar Sharma", floor: "3rd Floor, OT Complex" },
        { id: "OT-02", name: "Major OT 2 (Interventional Cath Lab)", type: "Cath Lab Suite (Philips Azurion)", status: "Ready / Scheduled", currentSurgery: "Coronary Angioplasty (PTCA)", surgeon: "Dr. Ananya Nair", floor: "3rd Floor, OT Complex" },
        { id: "OT-03", name: "Major OT 3 (Orthopedics & Joint Replacement)", type: "HEPA Filter Cleanroom", status: "Sanitizing", currentSurgery: null, surgeon: null, floor: "3rd Floor, OT Complex" },
        { id: "OT-04", name: "Daycare & Minor Procedure OT", type: "Minor Procedure Room", status: "Available", currentSurgery: null, surgeon: null, floor: "2nd Floor, Daycare" }
    ],

    otSurgeries: [
        {
            id: "SURG-2026-0041",
            otId: "OT-01",
            otName: "Major OT 1 (General & Lap)",
            patientId: "PAT-2026-0101",
            patientName: "Vikramaditya Verma",
            ipdNo: "IPD-2026-0089",
            bedNo: "SP-101A",
            procedureName: "Laparoscopic Cholecystectomy with Mesh Repair",
            indication: "Symptomatic Cholelithiasis with Chronic Cholecystitis",
            chiefSurgeon: "Dr. Rajeshwar Sharma",
            assistantSurgeon: "Dr. Siddharth Sen",
            anesthetist: "Dr. Vivek Chawla (MD Anesthesia)",
            scrubNurse: "Staff Nurse Sarita Rane",
            anesthesiaType: "General Anesthesia (GA + Endotracheal)",
            scheduleDate: "06 Oct 2026",
            timeSlot: "11:00 AM - 01:00 PM",
            status: "In Surgery", // Scheduled, Pre-Op Sign-In, In Surgery, Post-Op Recovery, Completed
            whoChecklist: {
                signIn: { completed: true, verifiedBy: "Nurse Sarita", time: "10:45 AM", patientIdentified: true, siteMarked: true, anesthesiaChecked: true, pulseOxOn: true, allergyChecked: true, bloodLossRiskAssessed: true },
                timeOut: { completed: true, verifiedBy: "Dr. Rajeshwar Sharma", time: "11:10 AM", teamIntroduced: true, procedureConfirmed: true, antibioticGiven: true, imagingDisplayed: true, criticalStepsReviewed: true },
                signOut: { completed: false, verifiedBy: null, time: null, countComplete: false, specimenLabeled: false, recoveryPlanFormulated: false }
            },
            implantsConsumables: [
                { item: "Titanium Laparoscopic Clips (Medium-Large)", qty: 4, cost: 2400 },
                { item: "Endo Catch Specimen Bag 10mm", qty: 1, cost: 1800 },
                { item: "Vicryl 2-0 Suture Pack", qty: 2, cost: 950 },
                { item: "Surgical Drape Kit & Gown Set", qty: 1, cost: 1200 }
            ],
            packageAmount: 65000,
            surgeonFee: 25000,
            anesthesiaFee: 8000,
            otCharges: 14000,
            consumablesTotal: 6350
        },
        {
            id: "SURG-2026-0042",
            otId: "OT-02",
            otName: "Major OT 2 (Cath Lab)",
            patientId: "PAT-2026-0103",
            patientName: "Rameshwar Kulkarni",
            ipdNo: "IPD-2026-0082",
            bedNo: "ICU-01",
            procedureName: "Percutaneous Transluminal Coronary Angioplasty (PTCA) with Drug-Eluting Stent (DES)",
            indication: "Triple Vessel Disease / 90% LAD Stenosis",
            chiefSurgeon: "Dr. Ananya Nair",
            assistantSurgeon: "Dr. Rajeshwar Sharma",
            anesthetist: "Dr. Vivek Chawla",
            scrubNurse: "Nurse Maria D'Souza",
            anesthesiaType: "Local Anesthesia + Mild Sedation",
            scheduleDate: "06 Oct 2026",
            timeSlot: "02:30 PM - 04:30 PM",
            status: "Scheduled",
            whoChecklist: {
                signIn: { completed: true, verifiedBy: "Nurse Maria", time: "01:45 PM", patientIdentified: true, siteMarked: true, anesthesiaChecked: true, pulseOxOn: true, allergyChecked: true, bloodLossRiskAssessed: true },
                timeOut: { completed: false, verifiedBy: null, time: null, teamIntroduced: false, procedureConfirmed: false, antibioticGiven: false, imagingDisplayed: false, criticalStepsReviewed: false },
                signOut: { completed: false, verifiedBy: null, time: null, countComplete: false, specimenLabeled: false, recoveryPlanFormulated: false }
            },
            implantsConsumables: [
                { item: "Resolute Onyx Drug-Eluting Coronary Stent 3.0 x 28mm", qty: 1, cost: 32000 },
                { item: "Coronary Guide Catheter (EBU 3.5 6F)", qty: 1, cost: 4500 },
                { item: "PTCA Guidewire (BMW Universal 0.014\")", qty: 1, cost: 3800 },
                { item: "Non-Ionic Contrast Media (Omnipaque 350mg/ml 100ml)", qty: 2, cost: 2400 }
            ],
            packageAmount: 145000,
            surgeonFee: 45000,
            anesthesiaFee: 12000,
            otCharges: 35000,
            consumablesTotal: 42700
        },
        {
            id: "SURG-2026-0039",
            otId: "OT-03",
            otName: "Major OT 3 (Ortho)",
            patientId: "PAT-2026-0104",
            patientName: "Ayesha Mansoori",
            ipdNo: "IPD-2026-0084",
            bedNo: "DLX-501",
            procedureName: "Diagnostic Knee Arthroscopy & Partial Meniscectomy",
            indication: "Right Medial Meniscus Tear (Sports Injury)",
            chiefSurgeon: "Dr. Rajeshwar Sharma",
            assistantSurgeon: "Dr. Siddharth Sen",
            anesthetist: "Dr. Vivek Chawla",
            scrubNurse: "Staff Nurse Sarita",
            anesthesiaType: "Spinal Anesthesia",
            scheduleDate: "05 Oct 2026",
            timeSlot: "09:00 AM - 11:30 AM",
            status: "Completed",
            whoChecklist: {
                signIn: { completed: true, verifiedBy: "Nurse Sarita", time: "08:40 AM" },
                timeOut: { completed: true, verifiedBy: "Dr. Rajeshwar", time: "09:05 AM" },
                signOut: { completed: true, verifiedBy: "Nurse Sarita", time: "11:20 AM", countComplete: true, specimenLabeled: true, recoveryPlanFormulated: true }
            },
            implantsConsumables: [
                { item: "Arthroscopic Shaver Blade 4.0mm", qty: 1, cost: 3500 },
                { item: "Normal Saline Irrigation 3L Bags", qty: 4, cost: 1200 }
            ],
            packageAmount: 52000,
            surgeonFee: 22000,
            anesthesiaFee: 7000,
            otCharges: 12000,
            consumablesTotal: 4700
        }
    ],

    insurancePayers: [
        { id: "TPA-01", name: "Star Health & Allied Insurance Co.", code: "STAR-HLTH", contact: "1800-425-2255", email: "cashless@starhealth.in", cashlessPortal: "https://portal.starhealth.in", tatHours: 2, claimSuccessRate: "94%" },
        { id: "TPA-02", name: "HDFC ERGO General Insurance", code: "HDFC-ERGO", contact: "1800-2666-400", email: "preauth@hdfcergo.com", cashlessPortal: "https://hdfcergo.claims.in", tatHours: 3, claimSuccessRate: "92%" },
        { id: "TPA-03", name: "Paramount Health Services & Insurance TPA", code: "PARAMOUNT", contact: "022-6662-0808", email: "claimdesk@paramounttpa.com", cashlessPortal: "https://paramounttpa.com", tatHours: 4, claimSuccessRate: "89%" },
        { id: "TPA-04", name: "Ayushman Bharat PM-JAY (State Health Agency)", code: "PM-JAY", contact: "14555", email: "claims@pmjay.gov.in", cashlessPortal: "https://pmjay.gov.in/tms", tatHours: 6, claimSuccessRate: "98%" },
        { id: "TPA-05", name: "ICICI Lombard General Insurance", code: "ICICI-LOMB", contact: "1800-2666", email: "i-hospital@icicilombard.com", cashlessPortal: "https://ilclaims.in", tatHours: 2.5, claimSuccessRate: "91%" }
    ],

    tpaClaims: [
        {
            id: "CLM-2026-081",
            ipdNo: "IPD-2026-0089",
            patientName: "Vikramaditya Verma",
            patientId: "PAT-2026-0101",
            policyNo: "SH-884129/2026",
            payerName: "Star Health & Allied Insurance",
            tpaCode: "STAR-HLTH",
            admissionDate: "05 Oct 2026",
            provisionalDiagnosis: "Uncontrolled DM with Ketonuria & Lap Cholecystectomy",
            requestedAmount: 85000,
            initialApprovedAmount: 60000,
            enhancementRequested: 25000,
            finalSettledAmount: 0,
            coPayPercent: 10, // 10% co-pay
            nonPayableDeductions: 3500, // Gloves, Diet, Sanitizer
            status: "Initial Approval Granted", // Submitted, Query Raised, Initial Approval Granted, Enhancement Approved, Dispatched for Settlement, Settled
            preauthQuery: null,
            claimPacketFiles: ["Govt_Aadhaar_Card.pdf", "Star_Health_E-Card.pdf", "Doctor_First_Prescription.pdf", "USG_Abdomen_Report.pdf"],
            lastUpdated: "Today, 10:45 AM"
        },
        {
            id: "CLM-2026-078",
            ipdNo: "IPD-2026-0082",
            patientName: "Rameshwar Kulkarni",
            patientId: "PAT-2026-0103",
            policyNo: "HE-4910284/2025",
            payerName: "HDFC ERGO General Insurance",
            tpaCode: "HDFC-ERGO",
            admissionDate: "03 Oct 2026",
            provisionalDiagnosis: "Acute Coronary Syndrome (ACS) with PTCA Stenting",
            requestedAmount: 180000,
            initialApprovedAmount: 140000,
            enhancementRequested: 40000,
            finalSettledAmount: 0,
            coPayPercent: 0,
            nonPayableDeductions: 5000,
            status: "Enhancement Pending",
            preauthQuery: "Please provide previous Angiography CD report and Troponin-I serial values.",
            claimPacketFiles: ["HDFC_Policy_Card.pdf", "ECG_Serial_Tracings.pdf", "Cath_Lab_Angio_Summary.pdf"],
            lastUpdated: "Today, 09:15 AM"
        },
        {
            id: "CLM-2026-074",
            ipdNo: "IPD-2026-0083",
            patientName: "Sunita Deshpande",
            patientId: "PAT-2026-0102",
            policyNo: "PMJAY-MH-9941-8812",
            payerName: "Ayushman Bharat PM-JAY",
            tpaCode: "PM-JAY",
            admissionDate: "02 Oct 2026",
            provisionalDiagnosis: "Severe UTI Sepsis (Scheme Package: MG004A)",
            requestedAmount: 22000,
            initialApprovedAmount: 22000,
            enhancementRequested: 0,
            finalSettledAmount: 22000,
            coPayPercent: 0,
            nonPayableDeductions: 0,
            status: "Claim Settled (100% Cashless)",
            preauthQuery: null,
            claimPacketFiles: ["PMJAY_Golden_Card.pdf", "Biometric_Aadhaar_Slip.pdf", "Urine_Culture_Report.pdf", "Discharge_Summary.pdf"],
            lastUpdated: "06 Oct 2026, 11:30 AM"
        }
    ],

    hospitalInventory: [
        { id: "INV-001", name: "Surgical Sterile Gloves (Size 7.5)", category: "Surgical Consumables", unit: "Box of 50 Pairs", currentStock: 48, reorderLevel: 20, unitCost: 850, location: "Central Store Shelf A1", supplier: "MedSupply India Pvt Ltd" },
        { id: "INV-002", name: "IV Cannula 20G with Injection Port (Pink)", category: "Disposables", unit: "Box of 100 Pcs", currentStock: 12, reorderLevel: 25, unitCost: 1400, location: "Central Store Shelf B2", supplier: "Dispotech Healthcare" },
        { id: "INV-003", name: "Syringe with Needle 5ml Luer Lock", category: "Disposables", unit: "Box of 100 Pcs", currentStock: 85, reorderLevel: 30, unitCost: 380, location: "Central Store Shelf B3", supplier: "Dispotech Healthcare" },
        { id: "INV-004", name: "N95 Particulate Respirator Masks (NIOSH)", category: "PPE & Safety", unit: "Box of 20 Pcs", currentStock: 64, reorderLevel: 20, unitCost: 650, location: "Central Store Shelf C1", supplier: "SafetyFirst Healthcare" },
        { id: "INV-005", name: "Normal Saline 0.9% IV Infusion 500ml", category: "IV Fluids & Infusions", unit: "Carton of 24 Bottles", currentStock: 8, reorderLevel: 15, unitCost: 720, location: "Pharmacy Store Shelf D1", supplier: "Baxter Medicals" },
        { id: "INV-006", name: "Disposable Surgical Gown & Drape Kit", category: "OT Sterile Linen", unit: "Pack of 10 Sets", currentStock: 18, reorderLevel: 10, unitCost: 2200, location: "OT Supply Room", supplier: "MedSupply India Pvt Ltd" },
        { id: "INV-007", name: "Endotracheal Tube Cuffed 7.5mm", category: "Anesthesia Consumables", unit: "Box of 10 Pcs", currentStock: 5, reorderLevel: 8, unitCost: 1100, location: "ICU / OT Station", supplier: "Rusch Anesthesia" }
    ],

    purchaseOrders: [
        {
            id: "PO-2026-0044",
            supplier: "Dispotech Healthcare Ltd",
            date: "04 Oct 2026",
            items: [
                { name: "IV Cannula 20G (Box of 100)", qty: 30, rate: 1400, total: 42000 },
                { name: "Syringe 5ml (Box of 100)", qty: 50, rate: 380, total: 19000 }
            ],
            totalAmount: 61000,
            status: "Approved & Sent to Vendor", // Draft, Approved & Sent, GRN Received, Invoiced
            expectedDelivery: "08 Oct 2026",
            raisedBy: "Purchase Mgr. R. Sharma"
        },
        {
            id: "PO-2026-0041",
            supplier: "Baxter Medicals India",
            date: "28 Sep 2026",
            items: [
                { name: "Normal Saline 500ml (Carton 24)", qty: 40, rate: 720, total: 28800 },
                { name: "Ringer Lactate 500ml (Carton 24)", qty: 30, rate: 750, total: 22500 }
            ],
            totalAmount: 51300,
            status: "GRN Received & Stock Updated",
            expectedDelivery: "02 Oct 2026",
            raisedBy: "Purchase Mgr. R. Sharma"
        }
    ],

    multiBranchStats: [
        { id: "BR-01", name: "Main Campus (Bandra West)", type: "Hub, OPD, IPD & Cath Lab", beds: 24, doctors: 12, todayFootfall: 42, monthRevenue: "₹ 18,45,000", bedOccupancy: "75%", status: "Active Primary Hub" },
        { id: "BR-02", name: "South Wing (Worli)", type: "Polyclinic & Daycare Centre", beds: 8, doctors: 6, todayFootfall: 26, monthRevenue: "₹ 7,80,000", bedOccupancy: "50%", status: "Active Polyclinic" },
        { id: "BR-03", name: "Suburban Annex (Andheri East)", type: "Diagnostic Center & Spec Lab", beds: 4, doctors: 4, todayFootfall: 31, monthRevenue: "₹ 9,20,000", bedOccupancy: "25%", status: "Active Diagnostic Lab" }
    ],

    auditLogs: [
        { id: "AUD-993", time: "10:45:12 AM", actor: "Dr. Rajeshwar Sharma (Surgeon)", action: "WHO_SURGICAL_TIMEOUT_VERIFIED", entity: "Surgery #SURG-2026-0041", tenant: "TEN-MUM-001", details: "Verified WHO Time-Out checklist for Lap Cholecystectomy on Vikramaditya Verma. Antibiotic prophylaxis confirmed.", ip: "192.168.1.108" },
        { id: "AUD-992", time: "09:30:14 AM", actor: "Dr. Rajeshwar Sharma (DOC-01)", action: "IPD_PATIENT_ADMISSION", entity: "Admission #IPD-2026-0089", tenant: "TEN-MUM-001", details: "Admitted Vikramaditya Verma to Semi-Private Bed SP-101A. Initial deposit ₹25,000 received.", ip: "192.168.1.104" },
        { id: "AUD-991", time: "08:15:32 AM", actor: "Staff Nurse Pooja (NUR-03)", action: "MAR_MEDICATION_ADMINISTERED", entity: "MAR #MED-ADM-01", tenant: "TEN-MUM-001", details: "Administered Inj. Regular Insulin 8 Units s/c to PAT-2026-0101.", ip: "192.168.1.122" },
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
        totalHospitalBeds: 24,
        occupiedBeds: 6,
        vacantBeds: 14,
        cleaningBeds: 3,
        blockedBeds: 1,
        ipdOccupancyRate: "75%",
        activeAdmissionsCount: 6,
        plannedDischargesToday: 2,
        activeSurgeriesToday: 2,
        pendingTpaPreauths: 2,
        lowStockItemsCount: 3
    }
};

window.MediData = MediData;


