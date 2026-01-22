
export enum StageId {
  PREVENTIVE = 'preventive',
  PAYMENT_DAY = 'payment_day',
  POST_PAYMENT = 'post_payment',
  REFRAMING = 'reframing',
  ESCALATION = 'escalation',
}

export type ProviderType = 'Stripe' | 'Link' | 'External';

export interface TicketActivity {
  id: string;
  date: Date;
  type: 'email' | 'sms' | 'call' | 'payment' | 'note' | 'system';
  description: string;
  user?: string;
}

export interface Ticket {
  id: string;
  period: string; // e.g. "Enero 2025"
  dueDate: Date;
  paidDate: Date | null;
  status: 'paid' | 'open' | 'overdue' | 'cancelled';
  result: 'on_time' | 'late' | 'very_late' | 'pending';
  resolutionStage: StageId;
  daysDiff: number;
  activities: TicketActivity[];
}

export interface Customer {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  provider: ProviderType;
  campaign: string;
  status?: 'active' | 'paid';
  dueDate: Date;
  currentLag: number;
  stage: StageId;
  riskScore: number;
  history: { date: Date; action: string }[];
  tickets: Ticket[]; // Historical billing cycles
}

export interface PaymentRecord {
  id: string;
  customerName: string;
  avatarUrl: string;
  date: Date;
  provider: ProviderType;
}

export interface StageConfig {
  id: StageId;
  label: string;
  description: string;
  colorTheme: 'emerald' | 'blue' | 'amber' | 'orange' | 'rose';
  minLag: number;
  maxLag: number;
}

export interface FilterState {
  campaigns: string[];
  status: 'active' | 'paid' | 'all';
  stages: StageId[];
  search: string;
  month: Date;
}

// --- FRAMEWORK TYPES ---

export type ChannelType = 'whatsapp' | 'email' | 'sms' | 'call' | 'system';

// Specific Configuration Interfaces
export interface WhatsAppConfig {
  sender: string;
  templateId: string;
  language: string;
  variables: Record<string, string>;
  fallbackChannel?: ChannelType;
}

export interface EmailConfig {
  fromAddress: string;
  subject: string;
  templateId: string;
  includeInvoice: boolean;
}

export interface SMSConfig {
  senderId: string;
  messageContent: string;
}

export interface CallConfig {
  callerId: string;
  type: 'bot' | 'human' | 'ivr';
  scriptId?: string;
  objective: 'payment_reminder' | 'commitment' | 'renegotiation';
}

export type ActionConfig = WhatsAppConfig | EmailConfig | SMSConfig | CallConfig;

export interface FrameworkAction {
  id: string;
  order: number;
  channel: ChannelType;
  timing: number; // Offset relative to due date (e.g. -2, 0, +5)
  templateName: string; // Display name
  config?: ActionConfig; // Detailed configuration
  isValid?: boolean; // Form validation status
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  lane: StageId; // The Execution Lane Tag
  status: 'active' | 'paused' | 'deprecated';
  actions: FrameworkAction[];
  usage: {
    playbooks: number;
    campaigns: number;
  };
  updatedAt: Date;
}

// --- PLAYBOOK TYPES ---

export type RiskProfile = 'low' | 'medium' | 'high';
export type UseCase = 'subscription' | 'installments' | 'one_time' | 'custom';

export interface PlaybookStageConfig {
    stageId: StageId;
    frameworkIds: string[]; // Ordered list of Framework IDs
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'deprecated';
  riskProfile: RiskProfile;
  useCase: UseCase;
  version: number;
  stages: PlaybookStageConfig[]; // The composition
  campaigns: string[]; // Campaigns using this playbook
  updatedAt: Date;
  updatedBy: string;
}
