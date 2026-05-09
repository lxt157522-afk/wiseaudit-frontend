import React from 'react';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { RiskAlert, RiskLevel } from '../types';
import { cn } from '../lib/utils';

interface RiskAlertsProps {
  risks: RiskAlert[];
}

const levelConfig: Record<RiskLevel, { icon: any, color: string, bg: string, border: string }> = {
  high: { icon: AlertCircle, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { icon: Info, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }
};

export function RiskAlerts({ risks }: RiskAlertsProps) {
  if (risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <CheckCircle className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">未发现显著风险项</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {risks.map((risk) => {
        const config = levelConfig[risk.level];
        const Icon = config.icon;
        
        return (
          <div
            key={risk.id}
            className={cn(
              "flex items-start space-x-4 p-4 rounded-lg border transition-all",
              config.bg,
              config.border
            )}
          >
            <div className={cn("mt-1", config.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={cn("text-sm font-bold uppercase tracking-wider", config.color)}>
                  {risk.title}
                </h4>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border",
                  config.color,
                  config.border
                )}>
                  {risk.level}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                {risk.description}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">
                  类别: {risk.category}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
