import React, { useState } from 'react';
import { ReleaseData } from '../types';
import { SAMPLE_RELEASES } from '../data/sampleReleases';
import { GitBranch, FileText, Sparkles, Tag, Link2, RefreshCw } from 'lucide-react';

interface ReleaseSelectorProps {
  currentReleaseId: string;
  onSelectRelease: (release: ReleaseData) => void;
  customMarkdown: string;
  onCustomMarkdownChange: (md: string) => void;
  version: string;
  onVersionChange: (v: string) => void;
  releaseUrl: string;
  onReleaseUrlChange: (url: string) => void;
  onParseMarkdown: () => void;
  isAiGenerating: boolean;
  onTriggerAiDraft: () => void;
}

export const ReleaseSelector: React.FC<ReleaseSelectorProps> = ({
  currentReleaseId,
  onSelectRelease,
  customMarkdown,
  onCustomMarkdownChange,
  version,
  onVersionChange,
  releaseUrl,
  onReleaseUrlChange,
  onParseMarkdown,
  isAiGenerating,
  onTriggerAiDraft,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Top Bar with Tab switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Source GitHub Release
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'presets'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Official Releases
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'custom'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Custom Markdown
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      {activeTab === 'presets' ? (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_RELEASES.map((rel) => {
              const isSelected = currentReleaseId === rel.id;
              return (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelease(rel)}
                  className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 text-slate-100 shadow-sm ring-1 ring-cyan-500/20'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      {rel.version}
                    </span>
                    <span className="text-[11px] text-slate-500">{rel.date}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300 line-clamp-1">
                    {rel.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Release metadata inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-[10px] text-slate-500 font-mono">Tag Version</span>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => onVersionChange(e.target.value)}
                  className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
                  placeholder="v2.4.0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-1.5">
              <Link2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-slate-500 font-mono">Release URL</span>
                <input
                  type="text"
                  value={releaseUrl}
                  onChange={(e) => onReleaseUrlChange(e.target.value)}
                  className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none truncate"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Custom Markdown Paste */
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Paste Technical Changelog / Markdown</span>
              <button
                onClick={() => {
                  onCustomMarkdownChange(SAMPLE_RELEASES[0].markdown);
                  onParseMarkdown();
                }}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Load Sample v2.4 Notes
              </button>
            </div>
            <textarea
              value={customMarkdown}
              onChange={(e) => onCustomMarkdownChange(e.target.value)}
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80 resize-y"
              placeholder="## CrossPoint Firmware Release v2.5.0&#10;&#10;### Highlights&#10;- ⚡ 2x faster SPI flash read & boot times&#10;- 📱 Added support for ESP32-S3 & RP2040&#10;- 🐛 Fixed intermittent I2C sensor lockups..."
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={onParseMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Compile & Extract Highlights</span>
            </button>

            <button
              onClick={onTriggerAiDraft}
              disabled={isAiGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiGenerating ? 'Drafting via Gemini...' : 'Generate with Gemini AI'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
