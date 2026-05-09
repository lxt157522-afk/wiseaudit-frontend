import React, { useState } from 'react';
import { Calculator, Building2, Calendar, FileSpreadsheet, Upload, X, Loader2, Search, Download, Cloud } from 'lucide-react';
import { runDeepAudit } from '../services/auditApi';
import { cn } from '../lib/utils';

export function DeepAuditModule({ onAuditComplete }: { onAuditComplete?: () => void }) {
  const [files, setFiles] = useState<Record<string, File | null>>({
    balance: null, arSupport: null, related: null, contractLiab: null, journal: null, template: null
  });
  const [clientName, setClientName] = useState('');
  const [auditPeriod, setAuditPeriod] = useState('2025年度');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fileLabels: Record<string, string> = {
    balance: '余额表', arSupport: '应收账款补充资料', related: '关联方清单',
    contractLiab: '合同负债补充资料', journal: '序时账', template: '标准底稿模板'
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleGenerate = async () => {
    if (!clientName || !files.balance || !files.arSupport || !files.related || !files.contractLiab || !files.journal || !files.template) {
      alert('请填写完整信息并上传所有文件');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await runDeepAudit({
        balanceFile: files.balance!,
        arSupportFile: files.arSupport!,
        relatedFile: files.related!,
        contractLiabFile: files.contractLiab!,
        journalFile: files.journal!,
        templateFile: files.template!
      });
      setResult(res);
      onAuditComplete?.();
    } catch (err: any) {
      alert('审计失败: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2.5 rounded-xl"><Calculator className="w-6 h-6 text-white" /></div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">应收账款审计执行系统</h3>
            <p className="text-sm text-gray-500">AI 自动执行数据分析，生成审计底稿</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="被审计单位名称" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl" />
          <input value={auditPeriod} onChange={e => setAuditPeriod(e.target.value)} placeholder="审计期间" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl" />

          {Object.entries(fileLabels).map(([key, label]) => (
            <div key={key} className="relative group">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{label}</label>
              <input type="file" accept=".xlsx,.xls" onChange={e => handleFileChange(key, e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between group-hover:border-blue-400">
                <span className="text-sm text-gray-600">{files[key]?.name || '点击选择文件'}</span>
                {files[key] && <X className="w-4 h-4 text-gray-400" onClick={() => handleFileChange(key, null)} />}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className={cn("mt-8 w-full py-4 rounded-xl font-bold text-white transition-all",
            isProcessing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-lg")}
        >
          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />正在执行全量数据审阅...</> : <><Search className="w-4 h-4 inline mr-2" />开始应收账款专项审计</>}
        </button>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">审计结果</h3>
            {result.download_full_url && (
              <a href={result.download_full_url} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center">
                <Download className="w-4 h-4 mr-2" />下载底稿
              </a>
            )}
          </div>
          {result.ai_conclusion && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
              <p className="text-sm text-blue-900 italic">{result.ai_conclusion}</p>
            </div>
          )}
          {result.summary && (
            <div className="grid grid-cols-4 gap-4">
              <div><p className="text-xs text-gray-400">应收账款余额</p><p className="font-bold">{result.summary.ar_total}</p></div>
              <div><p className="text-xs text-gray-400">坏账准备</p><p className="font-bold">{result.summary.bad_debt_total}</p></div>
              <div><p className="text-xs text-gray-400">账面价值</p><p className="font-bold">{result.summary.book_value}</p></div>
              <div><p className="text-xs text-gray-400">客户数</p><p className="font-bold">{result.summary.confirm_customer_count}</p></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
