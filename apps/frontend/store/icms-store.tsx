'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type ItemStatus = 'RECEIVED' | 'AI REVIEW' | 'PENDING REVIEW' | 'AUTO-ROUTED' | 'ASSIGNED' | 'ARCHIVED';

export type IncomingAttachment = {
  name: string;
  size: string;
  type: string;
};

export type IncomingItem = {
  id: string;
  subject: string;
  sender: string;
  body: string;
  status: ItemStatus;
  priority: PriorityLevel;
  source: 'Email' | 'Manual upload' | 'Portal' | 'Scanned';
  createdAt: string;
  attachments?: IncomingAttachment[];
  aiAnalysis?: {
    category: string;
    confidence: number;
    recommendedDepartment: string;
    summary: string;
    suggestedAction: string;
    policyFlags: string[];
    reasons: string[];
  };
};

export type WorkflowStageStatus = 'Completed' | 'In progress' | 'Pending' | 'Queued' | 'Blocked' | 'Recalled';

export type WorkflowStage = {
  id: string;
  name: string;
  department: string;
  owner: string;
  status: WorkflowStageStatus;
  slaDays: number;
  completedAt?: string;
  notes?: string;
  requiredAction?: string;
};

export type AssignmentComment = {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
};

export type Assignment = {
  id: string;
  correspondenceId: string;
  title: string;
  subject: string;
  sender: string;
  body: string;
  owner: string;
  ownerEmail: string;
  department: string;
  due: string;
  dueDateISO: string;
  risk: RiskLevel;
  priority: PriorityLevel;
  status: 'Open' | 'Pending' | 'In Review' | 'Completed' | 'Recalled';
  category: string;
  source: string;
  attachments: IncomingAttachment[];
  aiSummary: string;
  aiConfidence: number;
  policyFlags: string[];
  comments: AssignmentComment[];
  workflowStages: WorkflowStage[];
  currentStageIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type Department = {
  name: string;
  code: string;
  head: string;
  staff: number;
  cases: number;
  status: 'Stable' | 'Busy' | 'Monitoring' | 'Low';
  slaAdherence: number;
  description: string;
};

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string;
};

export type RoleRecord = {
  name: string;
  description: string;
  permissions: string[];
  users: number;
};

export type SystemNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  timestamp: string;
  priority: PriorityLevel;
  read: boolean;
  category: 'workflow' | 'assignment' | 'ai' | 'policy' | 'system';
  linkHref?: string;
};

export type ActivityEntry = {
  id: string;
  title: string;
  detail: string;
  time: string;
  timestamp: string;
  department?: string;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  bio: string;
  avatarUrl: string;
  signatureText: string;
  twoFactorEnabled: boolean;
  themePreference: 'system' | 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: 'immediate' | 'daily' | 'weekly';
};

export type SystemSettings = {
  institutionName: string;
  institutionMotto: string;
  portalSubtitle: string;
  academicYear: string;
  term: string;
  contactEmail: string;
  supportHotline: string;
  workingHours: string;
  logoUrl: string;
  aiThreshold: number; // default 95
  aiModel: string;
  emailIngestionEnabled: boolean;
  autoEscalateConfidential: boolean;
  slaRules: {
    procurementDays: number;
    governanceDays: number;
    studentCaseDays: number;
    generalDays: number;
    legalDays: number;
    escalationWarningHours: number;
  };
  userProfile: UserProfile;
};

type ICMSContextType = {
  incomingItems: IncomingItem[];
  assignments: Assignment[];
  departments: Department[];
  users: UserRecord[];
  roles: RoleRecord[];
  notifications: SystemNotification[];
  activities: ActivityEntry[];
  settings: SystemSettings;
  selectedAssignment: Assignment | null;
  selectedIncomingItem: IncomingItem | null;
  setSelectedAssignment: (item: Assignment | null) => void;
  setSelectedIncomingItem: (item: IncomingItem | null) => void;
  // Actions
  addIncomingItem: (item: Omit<IncomingItem, 'id' | 'createdAt'>) => IncomingItem;
  updateIncomingItem: (id: string, updates: Partial<IncomingItem>) => void;
  deleteIncomingItem: (id: string) => void;
  // Assignment actions
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  advanceAssignmentWorkflow: (assignmentId: string, remarks?: string) => void;
  rejectAssignmentWorkflow: (assignmentId: string, reason: string) => void;
  reassignAssignment: (assignmentId: string, newOwner: string, newDepartment: string, notes?: string) => void;
  recallAssignment: (assignmentId: string, reason: string) => void;
  addAssignmentComment: (assignmentId: string, comment: string, author?: string) => void;
  // AI review actions
  approveAiRouting: (itemId: string) => void;
  overrideAiRouting: (itemId: string, department: string, category: string, reason?: string) => void;
  escalateAiItem: (itemId: string, reason: string) => void;
  // Organization actions
  addUser: (user: Omit<UserRecord, 'id' | 'createdAt'>) => void;
  toggleUserStatus: (id: number) => void;
  deleteUser: (id: number) => void;
  addRole: (role: Omit<RoleRecord, 'users'>) => void;
  addDepartment: (dept: Department) => void;
  updateDepartment: (name: string, updates: Partial<Department>) => void;
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  // Settings & simulation
  updateSettings: (updates: Partial<SystemSettings>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  simulateIncomingEmail: () => void;
  resetToDefaults: () => void;
};

const STORAGE_KEY = 'icms-enterprise-state-v1';

const initialDepartments: Department[] = [
  { name: 'Registry', code: 'REG', head: 'Dr. Ada Okafor', staff: 18, cases: 318, status: 'Stable', slaAdherence: 96, description: 'Academic records, official notices, student matriculation and registry affairs.' },
  { name: 'Finance', code: 'FIN', head: 'Musa Ibrahim', staff: 12, cases: 214, status: 'Busy', slaAdherence: 93, description: 'Budgeting, disbursements, tuition collections, and audit accounting.' },
  { name: 'Procurement', code: 'PROC', head: 'Ruth Adebayo', staff: 9, cases: 176, status: 'Monitoring', slaAdherence: 90, description: 'Vendor management, tenders, purchase orders, and logistics sourcing.' },
  { name: 'Academic Affairs', code: 'ACAD', head: 'Joel Nwachukwu', staff: 16, cases: 194, status: 'Stable', slaAdherence: 94, description: 'Curriculum oversight, faculty administration, and Senate coordination.' },
  { name: 'Vice Chancellor Office', code: 'VCO', head: 'Prof. Sarah Jenkins', staff: 6, cases: 48, status: 'Stable', slaAdherence: 98, description: 'Executive university leadership, council mandates, and high-level decisions.' },
  { name: 'Human Resources', code: 'HR', head: 'Chioma Bello', staff: 7, cases: 52, status: 'Low', slaAdherence: 95, description: 'Staff appointments, promotions, benefits, and workplace relations.' },
];

const initialUsers: UserRecord[] = [
  { id: 1, name: 'Dr. Ada Okafor', email: 'ada.okafor@university.edu', role: 'Registrar', department: 'Registry', status: 'Active', createdAt: '2026-01-10T08:00:00Z' },
  { id: 2, name: 'Musa Ibrahim', email: 'musa.ibrahim@university.edu', role: 'Finance Director', department: 'Finance', status: 'Active', createdAt: '2026-01-12T09:30:00Z' },
  { id: 3, name: 'Ruth Adebayo', email: 'ruth.adebayo@university.edu', role: 'Procurement Officer', department: 'Procurement', status: 'Active', createdAt: '2026-02-01T11:00:00Z' },
  { id: 4, name: 'Joel Nwachukwu', email: 'joel.nwachukwu@university.edu', role: 'Academic Dean', department: 'Academic Affairs', status: 'Active', createdAt: '2026-02-15T14:20:00Z' },
  { id: 5, name: 'Prof. Sarah Jenkins', email: 'vc@university.edu', role: 'Vice Chancellor', department: 'Vice Chancellor Office', status: 'Active', createdAt: '2026-01-05T07:00:00Z' },
  { id: 6, name: 'S. Nwosu', email: 's.nwosu@university.edu', role: 'Senior Procurement Specialist', department: 'Procurement', status: 'Active', createdAt: '2026-03-01T10:15:00Z' },
  { id: 7, name: 'M. Okafor', email: 'm.okafor@university.edu', role: 'Senior Accountant', department: 'Finance', status: 'Active', createdAt: '2026-03-05T08:45:00Z' },
  { id: 8, name: 'A. Joseph', email: 'a.joseph@university.edu', role: 'Registry Officer', department: 'Registry', status: 'Active', createdAt: '2026-03-10T12:00:00Z' },
];

const initialRoles: RoleRecord[] = [
  { name: 'System Administrator', description: 'Full system administrative control, AI configuration, and platform management.', permissions: ['system_admin', 'manage_users', 'manage_roles', 'manage_policies', 'audit_access'], users: 1 },
  { name: 'Vice Chancellor', description: 'Executive oversight, assignment recalls, priority escalations, and Council approvals.', permissions: ['executive_oversight', 'assign_any', 'recall_workflow', 'view_reports', 'approve_documents'], users: 1 },
  { name: 'Registrar', description: 'Owns intake governance, official record management, and student case approvals.', permissions: ['view_incoming', 'approve_documents', 'manage_departments', 'triage_cases'], users: 2 },
  { name: 'Finance Director', description: 'Approves financial routing, budget reviews, and expenditure-related correspondence.', permissions: ['view_reports', 'approval_queue', 'budget_review', 'reassign_stage'], users: 2 },
  { name: 'Procurement Officer', description: 'Handles sourcing, vendor contracts, tender evaluations, and purchase memos.', permissions: ['manage_procurement', 'approval_queue', 'view_incoming'], users: 3 },
  { name: 'Department Administrator', description: 'Operational unit lead for case follow-ups and officer coordination.', permissions: ['team_assignments', 'case_updates', 'notifications'], users: 8 },
];

const initialIncomingItems: IncomingItem[] = [
  {
    id: 'ICMS-2026-000143',
    subject: 'Procurement approval request - Laboratory Spectrometer Equipment',
    sender: 'labs-procure@university.edu',
    body: 'We request formal approval and budget release for the acquisition of 2 unit high-precision mass spectrometers for the Faculty of Science research lab. Tender documentation and 3 quotes are attached.',
    status: 'AI REVIEW',
    priority: 'High',
    source: 'Email',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    attachments: [
      { name: 'Tender_Specs_Spectrometer_2026.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Vendor_Price_Comparison.xlsx', size: '840 KB', type: 'Spreadsheet' },
    ],
    aiAnalysis: {
      category: 'PROCUREMENT',
      confidence: 98,
      recommendedDepartment: 'Finance',
      summary: 'Requisition for laboratory spectrometer procurement with 3 vendor quotes attached. Exceeds standard threshold; requires Finance Director budget sign-off prior to Procurement award.',
      suggestedAction: 'Route to Finance for budget allocation, then to Procurement for purchase order issuance.',
      policyFlags: [],
      reasons: ['Keywords matched capital expenditure patterns.', 'Budget threshold > $50,000 mandates multi-tier sequential approval.'],
    },
  },
  {
    id: 'ICMS-2026-000144',
    subject: 'Student grievance petition regarding transcript computation',
    sender: 'student.union@university.edu',
    body: 'Urgent petition submitted on behalf of 2025/2026 graduating cohort in Computer Science regarding inaccurate semester weighting in the final GPA calculation.',
    status: 'PENDING REVIEW',
    priority: 'Medium',
    source: 'Manual upload',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    attachments: [
      { name: 'Petition_Signed_Students.pdf', size: '1.1 MB', type: 'PDF' },
      { name: 'GPA_Audit_Sample.pdf', size: '450 KB', type: 'PDF' },
    ],
    aiAnalysis: {
      category: 'STUDENT_CASE',
      confidence: 94,
      recommendedDepartment: 'Registrar',
      summary: 'Student cohort grievance concerning final degree classification. Confidence is 94% (below 95% threshold), triggering mandatory human policy triage.',
      suggestedAction: 'Human Correspondence Officer must validate academic regulations before assigning to Senate Academic Board.',
      policyFlags: ['ACADEMIC_INTEGRITY_CHECK', 'BELOW_AUTO_ROUTE_THRESHOLD'],
      reasons: ['AI confidence 94% is below the 95% automated threshold.', 'Involves degree classification changes requiring Registrar sign-off.'],
    },
  },
  {
    id: 'ICMS-2026-000145',
    subject: 'Notice of 184th Statutory Senate Assembly & Agenda',
    sender: 'senate.secretariat@university.edu',
    body: 'Official notice convening the 184th Senate Meeting scheduled for Thursday next week in Senate Chambers. Items include curriculum revisions, honorary degree nominations, and faculty appointments.',
    status: 'AUTO-ROUTED',
    priority: 'High',
    source: 'Email',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    attachments: [
      { name: 'Senate_Agenda_184th.pdf', size: '3.8 MB', type: 'PDF' },
    ],
    aiAnalysis: {
      category: 'GOVERNANCE',
      confidence: 99,
      recommendedDepartment: 'Vice Chancellor Office',
      summary: 'Statutory Senate assembly notice containing governance agenda. High priority, routed directly to Vice Chancellor office with confidential handling flag.',
      suggestedAction: 'Delivered to Vice Chancellor desk and archived in Senate Register.',
      policyFlags: ['CONFIDENTIAL_REVIEW_REQUIRED', 'EXECUTIVE_ATTENTION'],
      reasons: ['Matched institutional governance dictionary.', 'Sender verified as Senate Secretariat.'],
    },
  },
  {
    id: 'ICMS-2026-000146',
    subject: 'Campus High-Speed WiFi Network Upgrade Proposal',
    sender: 'ict-director@university.edu',
    body: 'Proposal for Phase 2 campus fiber backbone and WiFi-6 deployment across student hostels and faculty complexes.',
    status: 'RECEIVED',
    priority: 'Medium',
    source: 'Portal',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    attachments: [
      { name: 'WiFi_Phase2_Design.pdf', size: '5.2 MB', type: 'PDF' },
    ],
    aiAnalysis: {
      category: 'PROCUREMENT',
      confidence: 96,
      recommendedDepartment: 'Procurement',
      summary: 'Infrastructure project proposal for campus connectivity expansion.',
      suggestedAction: 'Route to Procurement and Finance.',
      policyFlags: [],
      reasons: ['Standard infrastructure procurement.'],
    },
  },
];

const initialAssignments: Assignment[] = [
  {
    id: 'ASN-001',
    correspondenceId: 'ICMS-2026-000143',
    title: 'Approval request review: Laboratory Spectrometers',
    subject: 'Procurement approval request - Laboratory Spectrometer Equipment',
    sender: 'labs-procure@university.edu',
    body: 'We request formal approval and budget release for the acquisition of 2 unit high-precision mass spectrometers for the Faculty of Science research lab. Tender documentation and 3 quotes are attached.',
    owner: 'M. Okafor',
    ownerEmail: 'm.okafor@university.edu',
    department: 'Finance',
    due: 'Today',
    dueDateISO: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    risk: 'High',
    priority: 'High',
    status: 'Open',
    category: 'PROCUREMENT',
    source: 'Email',
    attachments: [
      { name: 'Tender_Specs_Spectrometer_2026.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Vendor_Price_Comparison.xlsx', size: '840 KB', type: 'Spreadsheet' },
    ],
    aiSummary: 'Capital procurement of mass spectrometers exceeding $50k. Requires sequential approval: Registry -> Finance -> Procurement -> Vice Chancellor.',
    aiConfidence: 98,
    policyFlags: ['CAPEX_BUDGET_THRESHOLD', 'HIGH_VALUE_AUDIT'],
    comments: [
      { id: 'c1', author: 'Dr. Ada Okafor', role: 'Registrar', text: 'Intake validated. Sent to Finance for fund verification.', timestamp: '08:10 AM' },
      { id: 'c2', author: 'M. Okafor', role: 'Senior Accountant', text: 'Reviewing budget lines under Research Grant Code RG-2026-Science.', timestamp: '08:45 AM' },
    ],
    workflowStages: [
      { id: 'ws-1', name: 'Registry Intake & Validation', department: 'Registry', owner: 'A. Joseph', status: 'Completed', slaDays: 1, completedAt: '08:10 AM', notes: 'Verified documentation completeness.' },
      { id: 'ws-2', name: 'Finance Budget Verification', department: 'Finance', owner: 'M. Okafor', status: 'In progress', slaDays: 2, requiredAction: 'Confirm grant budget sufficiency and sign vote code.' },
      { id: 'ws-3', name: 'Procurement Tenders & Compliance', department: 'Procurement', owner: 'Ruth Adebayo', status: 'Pending', slaDays: 3, requiredAction: 'Validate vendor tax clearance and issue purchase order.' },
      { id: 'ws-4', name: 'Vice Chancellor Executive Sign-off', department: 'Vice Chancellor Office', owner: 'Prof. Sarah Jenkins', status: 'Pending', slaDays: 2, requiredAction: 'Final executive authorization.' },
      { id: 'ws-5', name: 'Archival & Registry Filing', department: 'Registry', owner: 'Records Officer', status: 'Queued', slaDays: 1 },
    ],
    currentStageIndex: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'ASN-002',
    correspondenceId: 'ICMS-2026-000144',
    title: 'Student record correction & GPA grievance petition',
    subject: 'Student grievance petition regarding transcript computation',
    sender: 'student.union@university.edu',
    body: 'Urgent petition submitted on behalf of 2025/2026 graduating cohort in Computer Science regarding inaccurate semester weighting in the final GPA calculation.',
    owner: 'A. Joseph',
    ownerEmail: 'a.joseph@university.edu',
    department: 'Registry',
    due: 'Tomorrow',
    dueDateISO: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    risk: 'Medium',
    priority: 'Medium',
    status: 'In Review',
    category: 'STUDENT_CASE',
    source: 'Manual upload',
    attachments: [
      { name: 'Petition_Signed_Students.pdf', size: '1.1 MB', type: 'PDF' },
      { name: 'GPA_Audit_Sample.pdf', size: '450 KB', type: 'PDF' },
    ],
    aiSummary: 'Graduation cohort GPA computation dispute. Human policy check required due to academic regulation implications.',
    aiConfidence: 94,
    policyFlags: ['ACADEMIC_INTEGRITY_CHECK', 'BELOW_AUTO_ROUTE_THRESHOLD'],
    comments: [
      { id: 'c3', author: 'A. Joseph', role: 'Registry Officer', text: 'Comparing submitted transcripts with Examination Database backup.', timestamp: '09:20 AM' },
    ],
    workflowStages: [
      { id: 'ws-201', name: 'Registry Triage & Exam Audit', department: 'Registry', owner: 'A. Joseph', status: 'In progress', slaDays: 2, requiredAction: 'Audit semester results with Head of Department.' },
      { id: 'ws-202', name: 'Academic Affairs Senate Recommendation', department: 'Academic Affairs', owner: 'Joel Nwachukwu', status: 'Pending', slaDays: 3, requiredAction: 'Submit recommendation to Senate Business Committee.' },
      { id: 'ws-203', name: 'Registrar Final Directive', department: 'Registry', owner: 'Dr. Ada Okafor', status: 'Pending', slaDays: 1 },
      { id: 'ws-204', name: 'Official Archival', department: 'Registry', owner: 'Records Officer', status: 'Queued', slaDays: 1 },
    ],
    currentStageIndex: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ASN-003',
    correspondenceId: 'ICMS-2026-000146',
    title: 'Procurement case triage: Campus WiFi-6 Deployment',
    subject: 'Campus High-Speed WiFi Network Upgrade Proposal',
    sender: 'ict-director@university.edu',
    body: 'Proposal for Phase 2 campus fiber backbone and WiFi-6 deployment across student hostels and faculty complexes.',
    owner: 'S. Nwosu',
    ownerEmail: 's.nwosu@university.edu',
    department: 'Procurement',
    due: '2 days',
    dueDateISO: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    risk: 'High',
    priority: 'High',
    status: 'Open',
    category: 'PROCUREMENT',
    source: 'Portal',
    attachments: [
      { name: 'WiFi_Phase2_Design.pdf', size: '5.2 MB', type: 'PDF' },
    ],
    aiSummary: 'Campus WiFi-6 network backbone upgrade. Budget estimation requires technical evaluation.',
    aiConfidence: 96,
    policyFlags: ['INFRASTRUCTURE_REVIEW'],
    comments: [
      { id: 'c4', author: 'Ruth Adebayo', role: 'Procurement Officer', text: 'Assigned to Senior Specialist Nwosu for tender packaging.', timestamp: '10:00 AM' },
    ],
    workflowStages: [
      { id: 'ws-301', name: 'Procurement Specification Review', department: 'Procurement', owner: 'S. Nwosu', status: 'In progress', slaDays: 2, requiredAction: 'Review equipment BOM and warranty terms.' },
      { id: 'ws-302', name: 'Finance Expenditure Assessment', department: 'Finance', owner: 'Musa Ibrahim', status: 'Pending', slaDays: 3 },
      { id: 'ws-303', name: 'Vice Chancellor Approval', department: 'Vice Chancellor Office', owner: 'Prof. Sarah Jenkins', status: 'Pending', slaDays: 2 },
    ],
    currentStageIndex: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'ASN-004',
    correspondenceId: 'ICMS-2026-000145',
    title: 'Governance memo routing: 184th Statutory Senate Assembly',
    subject: 'Notice of 184th Statutory Senate Assembly & Agenda',
    sender: 'senate.secretariat@university.edu',
    body: 'Official notice convening the 184th Senate Meeting scheduled for Thursday next week in Senate Chambers.',
    owner: 'Prof. Sarah Jenkins',
    ownerEmail: 'vc@university.edu',
    department: 'Vice Chancellor Office',
    due: '4 days',
    dueDateISO: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    risk: 'Low',
    priority: 'High',
    status: 'Completed',
    category: 'GOVERNANCE',
    source: 'Email',
    attachments: [
      { name: 'Senate_Agenda_184th.pdf', size: '3.8 MB', type: 'PDF' },
    ],
    aiSummary: 'Statutory Senate convening notice. Auto-routed to VC Office with 99% confidence.',
    aiConfidence: 99,
    policyFlags: ['CONFIDENTIAL_REVIEW_REQUIRED'],
    comments: [
      { id: 'c5', author: 'Prof. Sarah Jenkins', role: 'Vice Chancellor', text: 'Agenda approved. Distributed to all faculty deans.', timestamp: '11:15 AM' },
    ],
    workflowStages: [
      { id: 'ws-401', name: 'Senate Secretariat Dispatch', department: 'Academic Affairs', owner: 'Joel Nwachukwu', status: 'Completed', slaDays: 1, completedAt: '07:30 AM' },
      { id: 'ws-402', name: 'Vice Chancellor Docket Review', department: 'Vice Chancellor Office', owner: 'Prof. Sarah Jenkins', status: 'Completed', slaDays: 1, completedAt: '11:15 AM', notes: 'Approved without amendments.' },
      { id: 'ws-403', name: 'Institutional Archive', department: 'Registry', owner: 'Dr. Ada Okafor', status: 'Completed', slaDays: 1, completedAt: '11:30 AM' },
    ],
    currentStageIndex: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const initialNotifications: SystemNotification[] = [
  { id: 'n1', title: 'Finance approval is pending', detail: 'Procurement request #ICMS-2026-000143 requires budget sign-off from Finance.', time: '2 minutes ago', timestamp: new Date(Date.now() - 1000 * 120).toISOString(), priority: 'High', read: false, category: 'workflow', linkHref: '/assignments' },
  { id: 'n2', title: 'AI policy review flagged', detail: 'Student complaint #ICMS-2026-000144 has 94% confidence (under 95% threshold); human triage required.', time: '18 minutes ago', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), priority: 'Medium', read: false, category: 'ai', linkHref: '/ai-review' },
  { id: 'n3', title: 'Workflow stage completed', detail: 'Senate assembly notice #ICMS-2026-000145 was reviewed and archived by VC Office.', time: '1 hour ago', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), priority: 'Low', read: true, category: 'workflow', linkHref: '/workflow' },
];

const initialActivities: ActivityEntry[] = [
  { id: 'act-1', title: 'Finance approval assigned', detail: 'Assigned to Senior Accountant M. Okafor by Registry', time: '08:40', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), department: 'Finance' },
  { id: 'act-2', title: 'Procurement case escalated', detail: 'By Registrar for policy threshold review', time: '08:15', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), department: 'Procurement' },
  { id: 'act-3', title: 'AI summary generated', detail: 'For incoming senate governance item #ICMS-2026-000145', time: '08:00', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), department: 'Academic Affairs' },
  { id: 'act-4', title: 'New intake received via university mailbox', detail: 'Subject: Annual laboratory spectrometer requisition', time: '07:30', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), department: 'Registry' },
];

const initialSettings: SystemSettings = {
  institutionName: 'University of Excellence',
  institutionMotto: 'Knowledge, Integrity and Leadership in Research',
  portalSubtitle: 'Intelligent Correspondence & Governance Management Portal',
  academicYear: '2026 / 2027',
  term: 'Autumn Semester',
  contactEmail: 'registry@university.edu',
  supportHotline: '+1 (800) 555-ICMS',
  workingHours: '08:00 - 17:00 (Mon - Fri)',
  logoUrl: '',
  aiThreshold: 95,
  aiModel: 'Gemini 2.5 Pro (Institutional Sovereign Engine)',
  emailIngestionEnabled: true,
  autoEscalateConfidential: true,
  slaRules: {
    procurementDays: 7,
    governanceDays: 3,
    studentCaseDays: 5,
    generalDays: 4,
    legalDays: 2,
    escalationWarningHours: 24,
  },
  userProfile: {
    name: 'Dr. Ada Okafor',
    email: 'ada.okafor@university.edu',
    phone: '+234 803 123 4567',
    designation: 'Registrar & Chief Correspondence Officer',
    department: 'Registry',
    bio: 'Oversees university documentation, senate assembly records, and institutional academic governance.',
    avatarUrl: '',
    signatureText: 'Dr. Ada Okafor, PhD, FCIA\nRegistrar & Secretary to Senate\nUniversity of Excellence',
    twoFactorEnabled: true,
    themePreference: 'system',
    emailNotifications: true,
    pushNotifications: true,
    digestFrequency: 'daily',
  },
};

const ICMSContext = createContext<ICMSContextType | undefined>(undefined);

export function ICMSProvider({ children }: { children: React.ReactNode }) {
  const [incomingItems, setIncomingItems] = useState<IncomingItem[]>(initialIncomingItems);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [roles, setRoles] = useState<RoleRecord[]>(initialRoles);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [activities, setActivities] = useState<ActivityEntry[]>(initialActivities);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedIncomingItem, setSelectedIncomingItem] = useState<IncomingItem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.incomingItems) setIncomingItems(parsed.incomingItems);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.departments) setDepartments(parsed.departments);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.roles) setRoles(parsed.roles);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.settings) {
          setSettings({
            ...initialSettings,
            ...parsed.settings,
            userProfile: {
              ...initialSettings.userProfile,
              ...(parsed.settings.userProfile || {}),
            },
            slaRules: {
              ...initialSettings.slaRules,
              ...(parsed.settings.slaRules || {}),
            },
          });
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved ICMS state, using initial seeds.', err);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const payload = {
        incomingItems,
        assignments,
        departments,
        users,
        roles,
        notifications,
        activities,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save state to localStorage', err);
    }
  }, [incomingItems, assignments, departments, users, roles, notifications, activities, settings, isInitialized]);

  const logActivity = useCallback((title: string, detail: string, department?: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry: ActivityEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title,
      detail,
      time: timeStr,
      timestamp: now.toISOString(),
      department,
    };
    setActivities((prev) => [newEntry, ...prev.slice(0, 29)]);
  }, []);

  const addNotification = useCallback((
    title: string,
    detail: string,
    priority: PriorityLevel = 'Medium',
    category: SystemNotification['category'] = 'workflow',
    linkHref?: string
  ) => {
    const newNotif: SystemNotification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title,
      detail,
      time: 'Just now',
      timestamp: new Date().toISOString(),
      priority,
      read: false,
      category,
      linkHref,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const addIncomingItem = useCallback((itemData: Omit<IncomingItem, 'id' | 'createdAt'>) => {
    const id = `ICMS-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000)).substring(0, 6)}`;
    const now = new Date().toISOString();
    
    // Auto-analyze with rule heuristics
    const text = `${itemData.subject} ${itemData.body}`.toLowerCase();
    const isProcure = text.includes('procure') || text.includes('purchase') || text.includes('equipment') || text.includes('invoice') || text.includes('tender');
    const isStudent = text.includes('student') || text.includes('transcript') || text.includes('grade') || text.includes('exam') || text.includes('complaint') || text.includes('petition');
    const isGov = text.includes('senate') || text.includes('council') || text.includes('chancellor') || text.includes('statutory') || text.includes('policy');
    
    const category = isProcure ? 'PROCUREMENT' : isStudent ? 'STUDENT_CASE' : isGov ? 'GOVERNANCE' : 'GENERAL';
    const recommendedDepartment = isProcure ? 'Finance' : isStudent ? 'Registry' : isGov ? 'Vice Chancellor Office' : 'Academic Affairs';
    
    // High confidence if clear keywords
    const confidence = isGov ? 99 : isProcure ? 98 : isStudent ? 94 : 96;
    const policyFlags = isGov ? ['CONFIDENTIAL_REVIEW_REQUIRED'] : isStudent ? ['ACADEMIC_INTEGRITY_CHECK'] : [];
    
    const newItem: IncomingItem = {
      id,
      createdAt: now,
      ...itemData,
      aiAnalysis: itemData.aiAnalysis || {
        category,
        confidence,
        recommendedDepartment,
        summary: `AI analyzed correspondence from ${itemData.sender} and determined classification as ${category}.`,
        suggestedAction: `Assign to ${recommendedDepartment} for review according to institutional routing rules.`,
        policyFlags,
        reasons: ['Sender identity and subject pattern matched university taxonomies.'],
      },
    };

    setIncomingItems((prev) => [newItem, ...prev]);
    logActivity('New incoming correspondence captured', `Intake ${id}: ${newItem.subject}`, recommendedDepartment);
    addNotification(`New Intake: ${newItem.subject}`, `Received from ${newItem.sender}. AI categorized as ${category}.`, newItem.priority, 'ai', '/incoming-items');
    
    return newItem;
  }, [logActivity, addNotification]);

  const updateIncomingItem = useCallback((id: string, updates: Partial<IncomingItem>) => {
    setIncomingItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const deleteIncomingItem = useCallback((id: string) => {
    setIncomingItems((prev) => prev.filter((item) => item.id !== id));
    logActivity('Intake record removed', `Archived or dismissed intake #${id}`);
  }, [logActivity]);

  const updateAssignment = useCallback((id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) =>
      prev.map((asn) => {
        if (asn.id === id) {
          const updated = { ...asn, ...updates, updatedAt: new Date().toISOString() };
          if (selectedAssignment?.id === id) {
            setSelectedAssignment(updated);
          }
          return updated;
        }
        return asn;
      })
    );
  }, [selectedAssignment]);

  const advanceAssignmentWorkflow = useCallback((assignmentId: string, remarks?: string) => {
    setAssignments((prev) =>
      prev.map((asn) => {
        if (asn.id !== assignmentId) return asn;

        const stages = [...asn.workflowStages];
        const curIdx = asn.currentStageIndex;

        if (curIdx < stages.length) {
          stages[curIdx] = {
            ...stages[curIdx],
            status: 'Completed',
            completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            notes: remarks || stages[curIdx].notes || 'Stage requirements completed successfully.',
          };
        }

        const nextIdx = curIdx + 1;
        const isFinished = nextIdx >= stages.length;

        if (!isFinished) {
          stages[nextIdx] = {
            ...stages[nextIdx],
            status: 'In progress',
          };
        }

        const updated: Assignment = {
          ...asn,
          workflowStages: stages,
          currentStageIndex: nextIdx,
          status: isFinished ? 'Completed' : 'In Review',
          owner: !isFinished ? stages[nextIdx].owner : asn.owner,
          department: !isFinished ? stages[nextIdx].department : asn.department,
          updatedAt: new Date().toISOString(),
        };

        if (remarks) {
          updated.comments = [
            ...updated.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Current Reviewer',
              role: stages[curIdx]?.department || 'Reviewer',
              text: `[Stage Advanced: ${stages[curIdx]?.name}] ${remarks}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ];
        }

        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(updated);
        }

        logActivity(
          isFinished ? 'Workflow fully completed' : `Workflow stage advanced`,
          `${asn.title} moved to ${!isFinished ? stages[nextIdx].name : 'Final Archival'}`,
          !isFinished ? stages[nextIdx].department : 'Registry'
        );

        addNotification(
          isFinished ? 'Workflow Completed' : 'Workflow Advanced',
          `"${asn.title}" has moved to ${!isFinished ? stages[nextIdx].name : 'Archival'}.`,
          'Medium',
          'workflow',
          '/workflow'
        );

        return updated;
      })
    );
  }, [selectedAssignment, logActivity, addNotification]);

  const rejectAssignmentWorkflow = useCallback((assignmentId: string, reason: string) => {
    setAssignments((prev) =>
      prev.map((asn) => {
        if (asn.id !== assignmentId) return asn;

        const stages = [...asn.workflowStages];
        const curIdx = asn.currentStageIndex;

        stages[curIdx] = {
          ...stages[curIdx],
          status: 'Blocked',
          notes: `Sent back: ${reason}`,
        };

        const prevIdx = Math.max(0, curIdx - 1);
        if (prevIdx !== curIdx) {
          stages[prevIdx] = {
            ...stages[prevIdx],
            status: 'In progress',
            notes: `Reopened due to query: ${reason}`,
          };
        }

        const updated: Assignment = {
          ...asn,
          workflowStages: stages,
          currentStageIndex: prevIdx,
          status: 'Open',
          owner: stages[prevIdx].owner,
          department: stages[prevIdx].department,
          comments: [
            ...asn.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Reviewer',
              role: asn.department,
              text: `[Stage Reverted] ${reason}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(updated);
        }

        logActivity('Workflow stage reverted', `Returned "${asn.title}" to ${stages[prevIdx].name}: ${reason}`, stages[prevIdx].department);
        addNotification(`Workflow Reverted: ${asn.title}`, `Returned to ${stages[prevIdx].name} for clarification.`, 'High', 'workflow', '/workflow');

        return updated;
      })
    );
  }, [selectedAssignment, logActivity, addNotification]);

  const reassignAssignment = useCallback((assignmentId: string, newOwner: string, newDepartment: string, notes?: string) => {
    setAssignments((prev) =>
      prev.map((asn) => {
        if (asn.id !== assignmentId) return asn;

        const stages = [...asn.workflowStages];
        const curIdx = asn.currentStageIndex;
        if (curIdx < stages.length) {
          stages[curIdx] = {
            ...stages[curIdx],
            owner: newOwner,
            department: newDepartment,
            notes: notes ? `Reassigned: ${notes}` : stages[curIdx].notes,
          };
        }

        const updated: Assignment = {
          ...asn,
          owner: newOwner,
          department: newDepartment,
          workflowStages: stages,
          comments: [
            ...asn.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Administrator',
              role: 'Leadership',
              text: `Reassigned to ${newOwner} (${newDepartment}). ${notes ? `Note: ${notes}` : ''}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(updated);
        }

        logActivity('Assignment reassigned', `Reassigned "${asn.title}" to ${newOwner} (${newDepartment})`, newDepartment);
        addNotification(`Reassigned: ${asn.title}`, `Lead reassigned to ${newOwner} in ${newDepartment}.`, 'Medium', 'assignment', '/assignments');

        return updated;
      })
    );
  }, [selectedAssignment, logActivity, addNotification]);

  const recallAssignment = useCallback((assignmentId: string, reason: string) => {
    setAssignments((prev) =>
      prev.map((asn) => {
        if (asn.id !== assignmentId) return asn;

        const stages = asn.workflowStages.map((stg, i) =>
          i === asn.currentStageIndex ? { ...stg, status: 'Recalled' as WorkflowStageStatus, notes: `Recalled by Leadership: ${reason}` } : stg
        );

        const updated: Assignment = {
          ...asn,
          status: 'Recalled',
          workflowStages: stages,
          comments: [
            ...asn.comments,
            {
              id: `c-${Date.now()}`,
              author: 'Executive Office',
              role: 'Vice Chancellor / Registrar',
              text: `[EXECUTIVE RECALL] Workflow suspended: ${reason}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
          updatedAt: new Date().toISOString(),
        };

        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(updated);
        }

        logActivity('Executive recall executed', `Recalled "${asn.title}". Reason: ${reason}`, 'Vice Chancellor Office');
        addNotification(`Executive Recall: ${asn.title}`, `Correspondence recalled from active workflow.`, 'High', 'workflow', '/workflow');

        return updated;
      })
    );
  }, [selectedAssignment, logActivity, addNotification]);

  const addAssignmentComment = useCallback((assignmentId: string, comment: string, author = 'Current User') => {
    setAssignments((prev) =>
      prev.map((asn) => {
        if (asn.id !== assignmentId) return asn;
        const newComment: AssignmentComment = {
          id: `c-${Date.now()}`,
          author,
          role: 'Staff Member',
          text: comment,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updated = {
          ...asn,
          comments: [...asn.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(updated);
        }
        return updated;
      })
    );
  }, [selectedAssignment]);

  const approveAiRouting = useCallback((itemId: string) => {
    const item = incomingItems.find((i) => i.id === itemId);
    if (!item) return;

    const deptName = item.aiAnalysis?.recommendedDepartment || 'Registry';
    const dept = departments.find((d) => d.name === deptName) || departments[0];

    // Create assignment and workflow
    const newAsnId = `ASN-${String(Math.floor(100 + Math.random() * 900))}`;
    const newAssignment: Assignment = {
      id: newAsnId,
      correspondenceId: item.id,
      title: item.subject,
      subject: item.subject,
      sender: item.sender,
      body: item.body,
      owner: dept.head,
      ownerEmail: `${dept.code.toLowerCase()}@university.edu`,
      department: dept.name,
      due: '3 days',
      dueDateISO: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      risk: item.priority === 'High' ? 'High' : 'Medium',
      priority: item.priority,
      status: 'Open',
      category: item.aiAnalysis?.category || 'GENERAL',
      source: item.source,
      attachments: item.attachments || [],
      aiSummary: item.aiAnalysis?.summary || 'Automated classification approved.',
      aiConfidence: item.aiAnalysis?.confidence || 98,
      policyFlags: item.aiAnalysis?.policyFlags || [],
      comments: [
        {
          id: `c-${Date.now()}`,
          author: 'AI Routing Engine',
          role: 'System',
          text: `Auto-routed with ${item.aiAnalysis?.confidence || 98}% confidence to ${dept.name}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      workflowStages: [
        { id: `ws-${Date.now()}-1`, name: `${dept.name} Initial Review`, department: dept.name, owner: dept.head, status: 'In progress', slaDays: 2, requiredAction: 'Assess correspondence and assign required actions.' },
        { id: `ws-${Date.now()}-2`, name: 'Executive Oversight Sign-off', department: 'Vice Chancellor Office', owner: 'Prof. Sarah Jenkins', status: 'Pending', slaDays: 2 },
        { id: `ws-${Date.now()}-3`, name: 'Institutional Archive', department: 'Registry', owner: 'Dr. Ada Okafor', status: 'Queued', slaDays: 1 },
      ],
      currentStageIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setIncomingItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, status: 'AUTO-ROUTED' } : i)));

    logActivity('AI route approved', `Assigned ${item.id} to ${dept.name}`, dept.name);
    addNotification(`AI Route Approved: ${item.id}`, `Routed to ${dept.name} (${dept.head})`, 'Medium', 'ai', '/assignments');
  }, [incomingItems, departments, logActivity, addNotification]);

  const overrideAiRouting = useCallback((itemId: string, department: string, category: string, reason?: string) => {
    const item = incomingItems.find((i) => i.id === itemId);
    if (!item) return;

    const dept = departments.find((d) => d.name === department) || departments[0];
    const newAsnId = `ASN-${String(Math.floor(100 + Math.random() * 900))}`;

    const newAssignment: Assignment = {
      id: newAsnId,
      correspondenceId: item.id,
      title: item.subject,
      subject: item.subject,
      sender: item.sender,
      body: item.body,
      owner: dept.head,
      ownerEmail: `${dept.code.toLowerCase()}@university.edu`,
      department: dept.name,
      due: '2 days',
      dueDateISO: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      risk: item.priority === 'High' ? 'High' : 'Medium',
      priority: item.priority,
      status: 'Open',
      category,
      source: item.source,
      attachments: item.attachments || [],
      aiSummary: item.aiAnalysis?.summary || 'Human override applied to routing recommendation.',
      aiConfidence: item.aiAnalysis?.confidence || 90,
      policyFlags: ['HUMAN_OVERRIDE_APPLIED'],
      comments: [
        {
          id: `c-${Date.now()}`,
          author: 'Correspondence Officer',
          role: 'Registry',
          text: `Human routing override to ${department}. Category set to ${category}. ${reason ? `Reason: ${reason}` : ''}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      workflowStages: [
        { id: `ws-${Date.now()}-1`, name: `${dept.name} Action`, department: dept.name, owner: dept.head, status: 'In progress', slaDays: 2 },
        { id: `ws-${Date.now()}-2`, name: 'Registrar Approval', department: 'Registry', owner: 'Dr. Ada Okafor', status: 'Pending', slaDays: 1 },
        { id: `ws-${Date.now()}-3`, name: 'Archive Filing', department: 'Registry', owner: 'Records Officer', status: 'Queued', slaDays: 1 },
      ],
      currentStageIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setIncomingItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'ASSIGNED',
              aiAnalysis: i.aiAnalysis ? { ...i.aiAnalysis, recommendedDepartment: department, category } : undefined,
            }
          : i
      )
    );

    logActivity('Human routing override', `Overrode AI routing for ${item.id} -> ${department}`, department);
    addNotification(`Manual Routing Override: ${item.id}`, `Directed to ${department} by officer review.`, 'Medium', 'policy', '/assignments');
  }, [incomingItems, departments, logActivity, addNotification]);

  const escalateAiItem = useCallback((itemId: string, reason: string) => {
    setIncomingItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: 'PENDING REVIEW' } : i))
    );
    logActivity('AI item escalated', `Escalated intake ${itemId}: ${reason}`, 'Vice Chancellor Office');
    addNotification(`Escalation: Intake ${itemId}`, `Sent for leadership review: ${reason}`, 'High', 'ai', '/ai-review');
  }, [logActivity, addNotification]);

  const addUser = useCallback((userData: Omit<UserRecord, 'id' | 'createdAt'>) => {
    const newUser: UserRecord = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...userData,
    };
    setUsers((prev) => [newUser, ...prev]);
    logActivity('User account created', `Created profile for ${userData.name} (${userData.role}) in ${userData.department}`, userData.department);
  }, [logActivity]);

  const toggleUserStatus = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        logActivity('User status modified', `Switched ${u.name} status to ${nextStatus}`, u.department);
        return { ...u, status: nextStatus };
      })
    );
  }, [logActivity]);

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const addRole = useCallback((roleData: Omit<RoleRecord, 'users'>) => {
    setRoles((prev) => [{ ...roleData, users: 0 }, ...prev]);
    logActivity('New access role registered', `Added role ${roleData.name} with ${roleData.permissions.length} permissions`);
  }, [logActivity]);

  const addDepartment = useCallback((deptData: Department) => {
    setDepartments((prev) => [...prev, deptData]);
    logActivity('Department added', `Registered operational department ${deptData.name} (${deptData.code})`, deptData.name);
  }, [logActivity]);

  const updateDepartment = useCallback((name: string, updates: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.name === name ? { ...d, ...updates } : d)));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((updates: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    logActivity('System settings modified', 'Institutional configuration and AI thresholds updated.');
  }, [logActivity]);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setSettings((prev) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...updates,
      },
    }));
    logActivity('User profile updated', 'Officer profile, credentials, or avatar preferences updated.');
  }, [logActivity]);

  const simulateIncomingEmail = useCallback(() => {
    const simulationPool = [
      {
        subject: 'Urgent: Renewal of Campus Enterprise Research Licenses',
        sender: 'ict.licensing@university.edu',
        body: 'The annual MATLAB and SPSS campus site licenses expire at the end of next month. Quote attached for academic volume pricing $42,500.',
        priority: 'High' as PriorityLevel,
        attachments: [{ name: 'License_Renewal_Quote_2026.pdf', size: '1.2 MB', type: 'PDF' }],
      },
      {
        subject: 'Senate Academic Board: Revised Grading Schema for Postgraduate Studies',
        sender: 'postgraduate.school@university.edu',
        body: 'Submitting proposed adjustments to distinction grade boundaries for Master degree dissertations for Senate ratification.',
        priority: 'High' as PriorityLevel,
        attachments: [{ name: 'PG_Grading_Reform_Draft.pdf', size: '2.8 MB', type: 'PDF' }],
      },
      {
        subject: 'Student Appeal: Special Examination Request for Medical Absence',
        sender: 'med.records@university.edu',
        body: 'Student Registration #ENG/2023/044 has submitted certified hospital medical records requesting a deferred examination sitting.',
        priority: 'Medium' as PriorityLevel,
        attachments: [{ name: 'Medical_Certificate_Verified.pdf', size: '920 KB', type: 'PDF' }],
      },
    ];

    const pick = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    addIncomingItem({
      subject: pick.subject,
      sender: pick.sender,
      body: pick.body,
      priority: pick.priority,
      status: 'AI REVIEW',
      source: 'Email',
      attachments: pick.attachments,
    });
  }, [addIncomingItem]);

  const resetToDefaults = useCallback(() => {
    setIncomingItems(initialIncomingItems);
    setAssignments(initialAssignments);
    setDepartments(initialDepartments);
    setUsers(initialUsers);
    setRoles(initialRoles);
    setNotifications(initialNotifications);
    setActivities(initialActivities);
    setSettings(initialSettings);
    localStorage.removeItem(STORAGE_KEY);
    logActivity('System reset to initial seeds', 'All demo entities restored to factory defaults.');
  }, [logActivity]);

  const contextValue = useMemo<ICMSContextType>(
    () => ({
      incomingItems,
      assignments,
      departments,
      users,
      roles,
      notifications,
      activities,
      settings,
      selectedAssignment,
      selectedIncomingItem,
      setSelectedAssignment,
      setSelectedIncomingItem,
      addIncomingItem,
      updateIncomingItem,
      deleteIncomingItem,
      updateAssignment,
      advanceAssignmentWorkflow,
      rejectAssignmentWorkflow,
      reassignAssignment,
      recallAssignment,
      addAssignmentComment,
      approveAiRouting,
      overrideAiRouting,
      escalateAiItem,
      addUser,
      toggleUserStatus,
      deleteUser,
      addRole,
      addDepartment,
      updateDepartment,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateSettings,
      updateUserProfile,
      simulateIncomingEmail,
      resetToDefaults,
    }),
    [
      incomingItems,
      assignments,
      departments,
      users,
      roles,
      notifications,
      activities,
      settings,
      selectedAssignment,
      selectedIncomingItem,
      addIncomingItem,
      updateIncomingItem,
      deleteIncomingItem,
      updateAssignment,
      advanceAssignmentWorkflow,
      rejectAssignmentWorkflow,
      reassignAssignment,
      recallAssignment,
      addAssignmentComment,
      approveAiRouting,
      overrideAiRouting,
      escalateAiItem,
      addUser,
      toggleUserStatus,
      deleteUser,
      addRole,
      addDepartment,
      updateDepartment,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      updateSettings,
      updateUserProfile,
      simulateIncomingEmail,
      resetToDefaults,
    ]
  );

  return <ICMSContext.Provider value={contextValue}>{children}</ICMSContext.Provider>;
}

export function useICMS() {
  const context = useContext(ICMSContext);
  if (!context) {
    throw new Error('useICMS must be used within an ICMSProvider');
  }
  return context;
}
