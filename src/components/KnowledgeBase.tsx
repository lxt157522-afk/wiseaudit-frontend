import React from 'react';
import { Construction } from 'lucide-react';

export function KnowledgeBase() {
  return (
    <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
      <Construction className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">审计知识库</h3>
      <p className="text-sm text-gray-500">准则检索与最佳实践</p>
      <p className="text-xs text-gray-400 mt-4">请从原项目复制完整组件代码到此文件</p>
    </div>
  );
}
