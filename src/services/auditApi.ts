export interface AuditRunResponse {
  status: string;
  message?: string;
  summary?: {
    ar_total?: number;
    bad_debt_total?: number;
    book_value?: number;
    merge_customer_count?: number;
    nonmerge_customer_count?: number;
    nonrelated_customer_count?: number;
    confirm_customer_count?: number;
    revenue?: number;
    bad_debt_calc_total?: number;
    related_end_bal?: number;
  };
  download_url?: string;
  download_full_url?: string;
  output_file?: string;
  detail?: string;
  ai_conclusion?: string;
}

export interface AuditFilesPayload {
  balanceFile: File;
  arSupportFile: File;
  relatedFile: File;
  contractLiabFile: File;
  journalFile: File;
  templateFile: File;
}

// 硬编码API地址（可靠，不依赖环境变量）
const API_BASE = 'https://wiseaudit-node.onrender.com';

export async function runDeepAudit(files: AuditFilesPayload): Promise<AuditRunResponse> {
  const formData = new FormData();
  formData.append("balance_file", files.balanceFile);
  formData.append("ar_support_file", files.arSupportFile);
  formData.append("related_file", files.relatedFile);
  formData.append("contract_liab_file", files.contractLiabFile);
  formData.append("journal_file", files.journalFile);
  formData.append("template_file", files.templateFile);

  const endpoint = `${API_BASE}/api/run-audit`;

  console.log("[Cloud] 调用后端API:", endpoint);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      mode: "cors",
      credentials: "omit",
    });
  } catch (err: any) {
    throw new Error(
      `无法连接到审计后端服务。\n` +
      `请检查: 1) 后端服务是否启动 2) 网络连接 3) CORS配置\n` +
      `原始错误: ${err.message}`
    );
  }

  const rawText = await response.text();

  let data: any = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(`后端返回了非JSON内容：${rawText.slice(0, 200)}`);
  }

  if (!response.ok) {
    throw new Error(data?.message || JSON.stringify(data?.detail) || "审计接口调用失败");
  }

  return data;
}

export function getDownloadUrl(filename: string): string {
  return `${API_BASE}/api/download/${filename}`;
}
