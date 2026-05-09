import React, { useState } from 'react';
import { FileSpreadsheet, CheckCircle2, Clock, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export function WorkingPaperCenter() {
  const [papers] = useState([
    { id: 'AR-001', name: '应收账款专项审计底稿', client: 'XX机械设备有限公司', status: 'completed', date: '2025-05-09' },
    { id: 'AR-002', name: '应收账款专项审计底稿', client: '某科技公司', status: 'reviewing', date: '2025-05-08' },
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase">底稿列表</h3>
        {papers.map(paper => (
          <div key={paper.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                paper.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              )}>{paper.status === 'completed' ? '已定稿' : '复核中'}</span>
            </div>
            <h4 className="text-sm font-bold">{paper.name}</h4>
            <p className="text-xs text-gray-500">{paper.client}</p>
          </div>
        ))}
      </div>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-8 min-h-[600px]">
        <h3 className="text-xl font-bold mb-4">底稿复核中心</h3>
        <p className="text-gray-500">从左侧选择底稿进行查看和复核</p>
      </div>
    </div>
  );
}
