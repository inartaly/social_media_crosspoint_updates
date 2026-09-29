import React from 'react';
import { TweetCharacterStats, TweetRuleCheck } from '../types';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface CharacterMeterProps {
  stats: TweetCharacterStats;
  rules: TweetRuleCheck[];
}

export const CharacterMeter: React.FC<CharacterMeterProps> = ({ stats, rules }) => {
  const bodyPercent = Math.min(100, Math.round((stats.bodyLength / stats.maxBodyLength) * 100));
  const totalPercent = Math.min(100, Math.round((stats.totalLength / stats.twitterMaxTotal) * 100));

  const allRulesPassed = rules.every((r) => r.passed);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Compliance & Character Meter
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {allRulesPassed ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All 5 Rules Verified</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Reviewing Constraints</span>
            </span>
          )}
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strict Body Constraint (< 220 chars) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Tweet Body (excl. link)</span>
            <span className="font-mono text-xs tabular-nums text-slate-200">
              <strong className={stats.bodyLength > 220 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                {stats.bodyLength}
              </strong>{' '}
              / 220 chars
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                stats.bodyLength > 220
                  ? 'bg-rose-500'
                  : stats.bodyLength > 190
                  ? 'bg-amber-400'
                  : 'bg-cyan-400'
              }`}
              style={{ width: `${bodyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
            <span>Rule: &lt; 220 chars</span>
            <span>{stats.maxBodyLength - stats.bodyLength >= 0 ? `${stats.maxBodyLength - stats.bodyLength} left` : `${stats.bodyLength - stats.maxBodyLength} over`}</span>
          </div>
        </div>

        {/* Twitter Total (280 chars) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Total Tweet Length</span>
            <span className="font-mono text-xs tabular-nums text-slate-200">
              <strong className={stats.totalLength > 280 ? 'text-rose-400 font-bold' : 'text-slate-100'}>
                {stats.totalLength}
              </strong>{' '}
              / 280 chars
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                stats.totalLength > 280 ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${totalPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
            <span>Standard X limit</span>
            <span>{stats.twitterMaxTotal - stats.totalLength >= 0 ? `${stats.twitterMaxTotal - stats.totalLength} left` : 'Over limit'}</span>
          </div>
        </div>
      </div>

      {/* Rules Validation Checklist */}
      <div className="border-t border-slate-800/80 pt-3">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Strict Rule Compliance
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`flex items-start gap-2 p-2 rounded-lg text-xs border ${
                rule.passed
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
              }`}
            >
              {rule.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-slate-200">{rule.label}</span>
                <span className="text-[11px] opacity-80">{rule.details}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
