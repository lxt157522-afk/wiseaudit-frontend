import React from 'react';
import { LayoutDashboard, ArrowRight, TrendingUp, FileSpreadsheet, Search, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function AuditWorkbench({ onNavigate }: { onNavigate: (view: string) => void }) {
  const stats = [
    { label: '在审项目', value: '8', icon: LayoutDashboard },
    { label: '识别风险', value: '124', icon: Shield },
    { label: '底稿完成率', value: '78%', icon: FileSpreadsheet },
    { label: '待办复核', value: '12', icon: TrendingUp },
  ];

  const modules = [
    { id: 'risk-identification', title: '前期风险识别', desc: '全局风险扫描，定位高风险科目', icon: Search, color: 'bg-purple-50 text-purple-600' },
    { id: 'deep-audit', title: '科目深度审计', desc: '应收账款专项审计，双引擎分析', icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { id: 'working-paper-center', title: '底稿生成复核', desc: '自动化底稿生成，多级复核流程', icon: FileSpreadsheet, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-400 font-bold">实时更新</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Modules */}
      <div className="grid grid-cols-3 gap-6">
        {modules.map((mod) => (
          <motion.button
            key={mod.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(mod.id)}
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-left hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${mod.color} flex items-center justify-center mb-4`}>
              <mod.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{mod.title}</h3>
            <p className="text-sm text-gray-500">{mod.desc}</p>
            <div className="flex items-center mt-4 text-sm font-bold text-blue-600">
              进入模块 <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Cloud Badge */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-2xl border border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">☁</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">云部署版本</h4>
            <p className="text-sm text-gray-500">当前使用 Vercel + Render 分离部署架构，支持全球访问</p>
          </div>
        </div>
      </div>
    </div>
  );
}
