export interface AuditDocument {
  id: string;
  name: string;
  type: 'annual_report' | 'ledger' | 'voucher';
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface ConsistencyResult {
  id: string;
  documentId: string;
  checkType: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
  timestamp: string;
}

export interface WorkingPaper {
  id: string;
  templateName: string;
  clientName: string;
  auditPeriod: string;
  date: string;
  status: 'draft' | 'reviewing' | 'completed' | 'archived';
  preparedBy: string;
  sections: Array<{
    title: string;
    rows: Array<Record<string, any>>;
  }>;
  conclusion: string;
  anomalies: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  reviewStatus?: 'reviewing' | 'completed' | 'qualified';
  auditComments?: Array<{
    id: string;
    user: string;
    text: string;
    time: string;
  }>;
  downloadUrl?: string;
  templateBase64?: string;
}

export interface PreliminaryRiskAssessment {
  clientName: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  keyRisks: string[];
  financialMetrics: Array<{
    name: string;
    value: number;
    benchmark: number;
    status: 'normal' | 'warning' | 'critical';
  }>;
  textRisks: Array<{
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  recommendedAccounts: string[];
}

export type View = 'dashboard' | 'risk-identification' | 'deep-audit' | 'working-paper-center' | 'knowledge-base';
