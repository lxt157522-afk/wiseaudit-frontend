/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileSearch, 
  AlertTriangle, 
  Settings,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Search,
  TrendingUp,
  FileSpreadsheet,
  Database,
  Cloud,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuditWorkbench } from './components/AuditWorkbench';
import { RiskIdentification } from './components/RiskIdentification';
import { DeepAuditModule } from './components/DeepAuditModule';
import { WorkingPaperCenter } from './components/WorkingPaperCenter';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AuditChatAssistant } from './components/AuditChatAssistant';
import { AuditDocument, ConsistencyResult, View, PreliminaryRiskAssessment } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [consistencyResults, setConsistencyResults] = useState<ConsistencyResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const [currentRiskAssessment, setCurrentRiskAssessment] = useState<PreliminaryRiskAssessment | null>(null);
  const [savedRiskAssessments, setSavedRiskAssessments] = useState<(PreliminaryRiskAssessment & { id: string; date: string; clientName: string })[]>([]);

  // 检查后端连接状态
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_BASE = (window as any).__API_BASE__ || '';
        const res = await fetch(`${API_BASE}/api/health`, { 
          method: 'GET',
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
        setBackendStatus(res.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000); // 每30秒检查
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('savedRiskAssessments');
    if (saved) {
      try {
        setSavedRiskAssessments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved assessments", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRiskAssessments', JSON.stringify(savedRiskAssessments));
  }, [savedRiskAssessments]);

  const handleSaveAssessment = (assessment: PreliminaryRiskAssessment, clientName: string) => {
    const newEntry = {
      ...assessment,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      clientName: clientName || '未命名客户'
    };
    setSavedRiskAssessments(prev => [newEntry, ...prev]);
  };

  const navItems = [
    { id: 'dashboard' as View, label: '审计工作台', icon: LayoutDashboard },
    { id: 'risk-identification' as View, label: '前期风险识别', icon: Search },
    { id: 'deep-audit' as View, label: '科目深度审计', icon: TrendingUp },
    { id: 'working-paper-center' as View, label: '底稿生成复核', icon: FileSpreadsheet },
    { id: 'knowledge-base' as View, label: '知识库与管理', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#141414] font-sans selection:bg-blue-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center -ml-4 space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-sans font-bold tracking-tight text-gray-900">WiseAudit</h1>
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-tight">INTELLIGENT AUDIT PLATFORM</p>
            </div>
          </div>
        </div>

        {/* 后端状态指示器 */}
        <div className="px-4 py-2 mx-4 mt-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center space-x-2">
            {backendStatus === 'checking' && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
            {backendStatus === 'online' && <Cloud className="w-3 h-3 text-green-500" />}
            {backendStatus === 'offline' && <Server className="w-3 h-3 text-red-500" />}
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              {backendStatus === 'checking' && '检测后端...'}
              {backendStatus === 'online' && '后端在线'}
              {backendStatus === 'offline' && '后端离线'}
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group",
                view === item.id 
                  ? "bg-gray-100 text-blue-600 font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn("w-5 h-5", view === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                <span className="text-sm">{item.label}</span>
              </div>
              {view === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button 
            onClick={() => setView('knowledge-base')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">系统设置</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest font-serif">
              {navItems.find(n => n.id === view)?.label}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>AI 智能体在线</span>
            </div>
            {/* 云部署标识 */}
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-100">
              <Cloud className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-600">云部署版</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && (
                <AuditWorkbench onNavigate={setView} />
              )}

              {view === 'risk-identification' && (
                <RiskIdentification 
                  onSelectAccount={(acc) => setView('deep-audit')} 
                  initialResult={currentRiskAssessment}
                  onResultChange={setCurrentRiskAssessment}
                  onSaveResult={handleSaveAssessment}
                  savedResults={savedRiskAssessments}
                />
              )}

              {view === 'deep-audit' && (
                <DeepAuditModule onAuditComplete={() => setView('working-paper-center')} />
              )}

              {view === 'working-paper-center' && (
                <WorkingPaperCenter />
              )}

              {view === 'knowledge-base' && (
                <KnowledgeBase />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <AuditChatAssistant />
    </div>
  );
}
