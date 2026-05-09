const STORAGE_KEY = 'wiseaudit_records';

export interface AuditRecord {
  id: string;
  clientName: string;
  auditPeriod: string;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
  summary?: any;
  paper?: {
    templateName: string;
    downloadUrl: string;
    conclusion: string;
  };
  reviewData?: {
    reviewStatus: string;
    auditComments: any[];
  };
}

export function getAuditRecords(): AuditRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addAuditRecord(record: AuditRecord): void {
  const records = getAuditRecords();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function updateAuditRecord(id: string, updates: Partial<AuditRecord>): void {
  const records = getAuditRecords();
  const index = records.findIndex(r => r.id === id);
  if (index >= 0) {
    records[index] = { ...records[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}
