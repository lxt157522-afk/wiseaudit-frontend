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

// 云部署：动态获取API基础地址
const getApiBase = (): string => {
  // 生产环境使用全局变量或相对路径
  if (typeof __API_BASE__ !== 'undefined') {
    return __API_BASE__;
  }
  // Vercel环境变量
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  // 默认使用相对路径（同域部署时）
  return '';
};

export async function runDeepAudit(files: AuditFilesPayload): Promise<AuditRunResponse> {
  const formData = new FormData();
  formData.append("balance_file", files.balanceFile);
  formData.append("ar_support_file", files.arSupportFile);
  formData.append("related_file", files.relatedFile);
  formData.append("contract_liab_file", files.contractLiabFile);
  formData.append("journal_file", files.journalFile);
  formData.append("template_file", files.templateFile);

  const API_BASE = getApiBase();
  const endpoint = `${API_BASE}/api/run-audit`;

  console.log("[Cloud] 调用后端API:", endpoint);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      // 云部署需要显式处理CORS
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

// 下载文件辅助函数
export function getDownloadUrl(filename: string): string {
  const API_BASE = getApiBase();
  return `${API_BASE}/api/download/${filename}`;
}
