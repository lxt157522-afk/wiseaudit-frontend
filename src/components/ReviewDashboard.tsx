import React from 'react';
import { AuditDocument, ConsistencyResult } from '../types';
import { cn } from '../lib/utils';
import { Check, X, FileText, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReviewDashboardProps {
  documents: AuditDocument[];
  consistencyResults: ConsistencyResult[];
}

export function ReviewDashboard({ documents, consistencyResults }: ReviewDashboardProps) {
  const completedDocs = documents.filter(d => d.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-serif">已处理证据</p>
          <p className="text-4xl font-mono font-bold text-gray-900">{completedDocs.length} / {documents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-serif">识别风险点</p>
          <p className="text-4xl font-mono font-bold text-red-600">
            {completedDocs.reduce((acc, d) => acc + (d.result?.risks?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-serif">一致性冲突</p>
          <p className="text-4xl font-mono font-bold text-amber-600">
            {consistencyResults.filter(r => !r.isMatch).length}
          </p>
        </div>
      </div>

      {/* Consistency Check Section */}
      {consistencyResults.length > 0 && (
        <section>
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
            跨文档一致性核查 (Consistency Check)
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-5 bg-gray-50 border-bottom border-gray-200 p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="col-span-1">核查字段</div>
              <div className="col-span-1">来源 A</div>
              <div className="col-span-1">来源 B</div>
              <div className="col-span-1 text-center">状态</div>
              <div className="col-span-1">备注</div>
            </div>
            <div className="divide-y divide-gray-100">
              {consistencyResults.map((res, idx) => (
                <div key={idx} className="grid grid-cols-5 p-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-1 font-mono text-sm font-bold text-gray-900">{res.field}</div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 truncate">{res.sourceA}</p>
                    <p className="text-sm font-mono">{res.valueA}</p>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 truncate">{res.sourceB}</p>
                    <p className="text-sm font-mono">{res.valueB}</p>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {res.isMatch ? (
                      <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4 text-green-600" /></div>
                    ) : (
                      <div className="bg-red-100 p-1 rounded-full"><X className="w-4 h-4 text-red-600" /></div>
                    )}
                  </div>
                  <div className="col-span-1 text-xs text-gray-500">
                    {res.isMatch ? "数据一致" : "发现数据冲突，请人工核实"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Document Details */}
      <section>
        <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">证据审阅详情 (Evidence Details)</h3>
        <div className="space-y-6">
          {completedDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-900">{doc.name}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    {doc.type}
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-serif">审阅摘要</h4>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown>{doc.result?.summary || ""}</ReactMarkdown>
                  </div>
                  
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-3 font-serif">关键数据提取</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(doc.result?.keyData || {}).map(([key, val]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{key}</p>
                        <p className="text-sm font-mono font-bold text-gray-900">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-serif">风险提示</h4>
                   <div className="space-y-3">
                     {(doc.result?.risks || []).map((risk) => (
                       <div key={risk.id} className={cn(
                         "p-3 rounded-lg border text-sm",
                         risk.level === 'high' ? "bg-red-50 border-red-100 text-red-800" :
                         risk.level === 'medium' ? "bg-amber-50 border-amber-100 text-amber-800" :
                         "bg-blue-50 border-blue-100 text-blue-800"
                       )}>
                         <div className="flex items-center justify-between mb-1">
                           <span className="font-bold uppercase text-[10px] tracking-widest">{risk.title}</span>
                           <span className="text-[9px] font-bold opacity-70 uppercase">{risk.level}</span>
                         </div>
                         <p className="text-xs leading-relaxed opacity-90">{risk.description}</p>
                       </div>
                     ))}
                     {(!doc.result?.risks || doc.result.risks.length === 0) && (
                       <p className="text-sm text-gray-400">未发现显著风险</p>
                     )}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
