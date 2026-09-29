import React from 'react';
import { ReleaseHighlight } from '../types';
import { Check, Plus, Trash2, Cpu, Zap, Bug, Sparkles } from 'lucide-react';

interface HighlightPickerProps {
  highlights: ReleaseHighlight[];
  onToggleHighlight: (id: string) => void;
  onAddCustomHighlight: (highlight: Omit<ReleaseHighlight, 'id' | 'selected'>) => void;
  onRemoveHighlight: (id: string) => void;
}

export const HighlightPicker: React.FC<HighlightPickerProps> = ({
  highlights,
  onToggleHighlight,
  onAddCustomHighlight,
  onRemoveHighlight,
}) => {
  const selectedCount = highlights.filter((h) => h.selected).length;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'hardware':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400">
            <Cpu className="w-3 h-3" /> Hardware Target
          </span>
        );
      case 'bugfix':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
            <Bug className="w-3 h-3" /> Bug Fix
          </span>
        );
      case 'performance':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400">
            <Zap className="w-3 h-3" /> Performance
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Feature & Target Highlights
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">
            Select 2–3 items for tweet
          </span>
        </div>

        <div className="text-xs font-mono">
          <span
            className={
              selectedCount >= 2 && selectedCount <= 3
                ? 'text-emerald-400 font-semibold'
                : 'text-amber-400 font-semibold'
            }
          >
            {selectedCount} selected
          </span>{' '}
          <span className="text-slate-500">(Target: 2-3)</span>
        </div>
      </div>

      {/* List of highlights */}
      <div className="flex flex-col gap-2">
        {highlights.map((h) => {
          return (
            <div
              key={h.id}
              onClick={() => onToggleHighlight(h.id)}
              className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                h.selected
                  ? 'bg-slate-800/90 border-cyan-500/50 text-slate-100 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border text-xs ${
                    h.selected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm">{h.emoji}</span>
                    <span className="font-medium text-xs text-slate-200">
                      {h.conciseText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    {getCategoryBadge(h.category)}
                    <span>·</span>
                    <span className="truncate">{h.rawText}</span>
                  </div>
                </div>
              </div>

              {highlights.length > 3 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHighlight(h.id);
                  }}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors ml-2"
                  title="Remove highlight"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
