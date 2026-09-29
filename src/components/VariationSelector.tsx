import React from 'react';
import { FocusVariant } from '../types';
import { Sliders, Cpu, Zap, Minimize2, Layers } from 'lucide-react';

interface VariationSelectorProps {
  currentVariant: FocusVariant;
  onSelectVariant: (v: FocusVariant) => void;
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({
  currentVariant,
  onSelectVariant,
}) => {
  const variants: { id: FocusVariant; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'balanced',
      label: 'Balanced',
      icon: <Layers className="w-3.5 h-3.5" />,
      desc: 'Top 3: Feature + Target + Bugfix',
    },
    {
      id: 'hardware',
      label: 'Hardware Target',
      icon: <Cpu className="w-3.5 h-3.5" />,
      desc: 'Prioritizes board support & MCUs',
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <Zap className="w-3.5 h-3.5" />,
      desc: 'Prioritizes SPI speed & power draw',
    },
    {
      id: 'compact',
      label: 'Ultra-Compact',
      icon: <Minimize2 className="w-3.5 h-3.5" />,
      desc: 'Concise 2 bullets (< 160 chars)',
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-medium">Preset Angle:</span>
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg flex-wrap">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelectVariant(v.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              currentVariant === v.id
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={v.desc}
          >
            {v.icon}
            <span>{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
