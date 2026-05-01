export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  newPatients: boolean;
  approvalRequired: boolean;
  telehealth: boolean;
}

export interface ClinicConfig {
  // Step 0
  clinicName: string;
  phone: string;
  practiceTypes: string[];
  size: 'small' | 'mid' | 'large';
  bookingSystem: string;
  // Step 1
  hours: DayHours[];
  afterHoursNumber: string;
  publicHolidays: 'closed' | 'manual';
  // Step 2
  doctors: Doctor[];
  // Step 3
  routingNotes: string;
  // Step 4
  tone: 'warm' | 'professional' | 'calm';
  aiDisclosure: 'upfront' | 'on-request';
  neverSay: string;
  // Step 5
  vipRouting: boolean;
  fallback: 'transfer' | 'message' | 'callback';
  alwaysHuman: string;
  edgeCaseNotes: string;
}

export const DEFAULT_CONFIG: ClinicConfig = {
  clinicName: 'Northside Family Clinic',
  phone: '(03) 9412 5500',
  practiceTypes: ['gp', 'mixed'],
  size: 'mid',
  bookingSystem: 'Best Practice',
  hours: [
    { open: '08:00', close: '18:00', closed: false },
    { open: '08:00', close: '18:00', closed: false },
    { open: '08:00', close: '18:00', closed: false },
    { open: '08:00', close: '18:00', closed: false },
    { open: '08:00', close: '17:00', closed: false },
    { open: '08:00', close: '13:00', closed: false },
    { open: '', close: '', closed: true },
  ],
  afterHoursNumber: '',
  publicHolidays: 'closed',
  doctors: [
    { id: 'd1', name: 'Dr Sarah Mitchell', role: 'GP · Principal', newPatients: true, approvalRequired: false, telehealth: true },
    { id: 'd2', name: 'Dr Raj Patel', role: 'GP', newPatients: true, approvalRequired: true, telehealth: true },
    { id: 'd3', name: 'Dr Lisa Chen', role: 'GP', newPatients: true, approvalRequired: true, telehealth: false },
    { id: 'd4', name: 'Dr James Okafor', role: 'GP (full books)', newPatients: false, approvalRequired: false, telehealth: true },
    { id: 'd5', name: 'Dr Amy Torres', role: 'GP', newPatients: true, approvalRequired: false, telehealth: true },
    { id: 'd6', name: 'Dr Ben Walsh', role: 'GP', newPatients: true, approvalRequired: false, telehealth: true },
    { id: 'd7', name: 'Dr Priya Sharma', role: 'GP', newPatients: false, approvalRequired: false, telehealth: true },
  ],
  routingNotes: '',
  tone: 'professional',
  aiDisclosure: 'upfront',
  neverSay: '',
  vipRouting: true,
  fallback: 'transfer',
  alwaysHuman: '',
  edgeCaseNotes: '',
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const PRACTICE_TYPES = [
  { value: 'gp', label: 'General Practice' },
  { value: 'bulk', label: 'Bulk billing' },
  { value: 'mixed', label: 'Mixed billing' },
  { value: 'specialist', label: 'Specialist referrals' },
  { value: 'mental', label: 'Mental health' },
  { value: 'paeds', label: 'Paediatrics' },
  { value: 'womens', label: "Women's health" },
];

export const BOOKING_SYSTEMS = [
  'Best Practice', 'Medical Director', 'Zedmed', 'HotDoc',
  'HealthEngine', 'Cliniko', 'Paper / phone only', 'Other',
];

export const SCENARIOS = [
  {
    title: 'New patient wants to register',
    tag: 'auto' as const,
    label: 'Auto-handle',
    logic: [
      { type: 'if', text: 'Caller is new — no existing record' },
      { type: 'then', text: 'Collect: name, DOB, Medicare number, reason, preferred GP' },
      { type: 'then', text: 'IF doctor has open books → offer next available slot' },
      { type: 'then', text: 'IF doctor requires approval → take details, promise callback within 1 business day' },
      { type: 'then', text: 'IF all slots full → add to waitlist, send SMS confirmation' },
    ],
  },
  {
    title: 'Existing patient wants an appointment',
    tag: 'auto' as const,
    label: 'Auto-handle',
    logic: [
      { type: 'if', text: 'Caller name matches existing record' },
      { type: 'then', text: 'Offer next 3 available slots for their usual GP' },
      { type: 'then', text: 'IF usual GP unavailable → offer alternative or waitlist' },
      { type: 'then', text: 'Confirm booking and send SMS reminder' },
    ],
  },
  {
    title: 'Caller asks about test results',
    tag: 'followup' as const,
    label: 'Message + callback',
    logic: [
      { type: 'if', text: 'Caller asks about results from a test or procedure' },
      { type: 'then', text: 'Heidi NEVER provides results over the phone (clinical safety default)' },
      { type: 'then', text: 'Take name, DOB, and contact number' },
      { type: 'then', text: 'Flag for doctor — callback within 1 business day' },
    ],
  },
  {
    title: 'Caller wants to cancel or reschedule',
    tag: 'auto' as const,
    label: 'Auto-handle',
    logic: [
      { type: 'if', text: 'Caller has existing appointment and wants to change it' },
      { type: 'then', text: 'Find appointment by name and approximate date' },
      { type: 'then', text: 'Cancel and offer to rebook in same call' },
      { type: 'then', text: 'Send confirmation SMS' },
    ],
  },
  {
    title: 'Caller sounds distressed or in crisis',
    tag: 'escalate' as const,
    label: 'Escalate immediately',
    logic: [
      { type: 'always', text: 'Stop current task immediately' },
      { type: 'then', text: 'Self-harm / suicide keywords → Lifeline 13 11 14 + offer transfer' },
      { type: 'then', text: 'Medical emergency keywords → "Please call 000 immediately"' },
      { type: 'then', text: 'General distress → offer transfer to front desk with handoff summary' },
    ],
  },
  {
    title: "Enquiry Heidi can't resolve",
    tag: 'escalate' as const,
    label: 'Transfer to desk',
    logic: [
      { type: 'if', text: 'After 2 failed attempts to understand or resolve' },
      { type: 'then', text: "Say: \"I'll connect you to our front desk who can help\"" },
      { type: 'then', text: 'Provide brief handoff summary to staff' },
      { type: 'then', text: 'IF desk unavailable → take callback details' },
    ],
  },
];
