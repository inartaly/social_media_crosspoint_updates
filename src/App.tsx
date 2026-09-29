import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_RELEASES } from './data/sampleReleases';
import { ReleaseData, ReleaseHighlight } from './types';
import {
  compileTweet,
  calculateStats,
  DEFAULT_BRAND_HASHTAGS,
} from './utils/tweetCompiler';
import {
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  CheckCircle2,
  AlertCircle,
  History,
  RotateCcw,
  Heart,
  Share2,
} from 'lucide-react';

export default function App() {
  // Always default to the latest release (index 0: v1.6.5)
  const [activeRelease, setActiveRelease] = useState<ReleaseData>(SAMPLE_RELEASES[0]);
  const [highlights, setHighlights] = useState<ReleaseHighlight[]>(SAMPLE_RELEASES[0].highlights);
  const releaseUrl = 'https://github.com/crosspoint-reader/crosspoint-reader/releases';
  const hashtags = DEFAULT_BRAND_HASHTAGS;

  // Direct editable tweet text
  const [editedTweet, setEditedTweet] = useState<string>('');
  const [isEditingManually, setIsEditingManually] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-compile tweet for active release with 3-4 highlights & all brand hashtags
  const autoCompiledTweet = useMemo(() => {
    return compileTweet(activeRelease.version, highlights, releaseUrl, 'balanced', hashtags);
  }, [activeRelease.version, highlights, releaseUrl, hashtags]);

  // Sync autoCompiledTweet to edited state when not manually editing
  useEffect(() => {
    if (!isEditingManually) {
      setEditedTweet(autoCompiledTweet);
    }
  }, [autoCompiledTweet, isEditingManually]);

  const currentTweetText = isEditingManually ? editedTweet : autoCompiledTweet;
  const stats = useMemo(() => calculateStats(currentTweetText, releaseUrl), [currentTweetText, releaseUrl]);

  // Switch to another release from history
  const handleSelectHistoryRelease = (rel: ReleaseData) => {
    setActiveRelease(rel);
    setHighlights(rel.highlights.map((h) => ({ ...h })));
    setIsEditingManually(false);
  };

  // Reset to latest release
  const handleResetToLatest = () => {
    setActiveRelease(SAMPLE_RELEASES[0]);
    setHighlights(SAMPLE_RELEASES[0].highlights.map((h) => ({ ...h })));
    setIsEditingManually(false);
  };

  // Copy with clear visual feedback
  const handleCopy = () => {
    navigator.clipboard.writeText(currentTweetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const xIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentTweetText)}`;
  const blueskyIntentUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(currentTweetText)}`;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-zinc-900 bg-black/95 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-tight">
                CrossPoint Reader Tweet & Bluesky Bot
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono">
                Latest Release: CrossPoint {SAMPLE_RELEASES[0].version}
              </p>
            </div>
          </div>

          <a
            href="https://github.com/crosspoint-reader/crosspoint-reader/releases"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </div>
      </header>

      {/* Main Single Stream: Ready Tweet + Heads-up History */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* User Non-Affiliation Disclaimer Banner */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-400 flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-zinc-200">Personal Fan Tool · Unaffiliated Notice</span>
            <p className="text-zinc-400 leading-relaxed">
              I am not affiliated with CrossPoint or hardware vendors in any way. Just an enthusiastic user sharing open-source e-reader firmware updates on my own personal accounts!
            </p>
          </div>
        </div>

        {/* PRIMARY CARD: Done-For-You Tweet (Ready to Post) */}
        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Post Draft: CrossPoint {activeRelease.version}
              </h2>
              {activeRelease.id !== SAMPLE_RELEASES[0].id && (
                <button
                  onClick={handleResetToLatest}
                  className="text-[11px] text-zinc-400 hover:text-white underline ml-1 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Back to Latest (1.6.5)</span>
                </button>
              )}
            </div>

            {/* Character & Compliance Status */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                stats.bodyLength <= 220
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-900 border-zinc-400 text-white font-bold'
              }`}
            >
              {stats.bodyLength <= 220 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>{stats.bodyLength}/220 body chars (Safe)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{stats.bodyLength - 220} chars over limit</span>
                </>
              )}
            </div>
          </div>

          {/* Included Highlights Recap */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              {highlights.filter((h) => h.selected).length} Included Highlights:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {highlights
                .filter((h) => h.selected)
                .map((h) => (
                  <span
                    key={h.id}
                    className="inline-flex items-center gap-1 text-[11px] bg-black border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md"
                  >
                    <span>{h.emoji}</span>
                    <span>{h.conciseText}</span>
                  </span>
                ))}
            </div>
          </div>

          {/* Authentic Post Card (Personal Community Post) */}
          <div className="bg-black border border-zinc-800 rounded-2xl p-4 shadow-md">
            {/* Header: Personal Profile / Fan Account */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm shadow">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">
                      E-Reader Community Fan
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
                      Personal Account
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Unofficial CrossPoint enthusiast</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditingManually(!isEditingManually)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-800 hover:bg-zinc-900 transition-colors"
                title="Tweak text directly"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingManually ? 'Done Editing' : 'Edit Text'}</span>
              </button>
            </div>

            {/* Direct Tweet Text or Editable Area */}
            {isEditingManually ? (
              <textarea
                value={editedTweet}
                onChange={(e) => setEditedTweet(e.target.value)}
                rows={7}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm font-sans text-white focus:outline-none focus:border-white leading-relaxed"
              />
            ) : (
              <div className="text-sm text-zinc-100 whitespace-pre-wrap leading-relaxed">
                {currentTweetText.split('\n').map((line, i) => {
                  if (line.includes('http')) {
                    return (
                      <p key={i} className="text-zinc-300 font-mono text-xs pt-1.5 break-all underline underline-offset-2">
                        {line}
                      </p>
                    );
                  }
                  if (line.startsWith('#')) {
                    return (
                      <p key={i} className="text-white font-mono text-xs pt-1 font-semibold">
                        {line}
                      </p>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>
            )}
          </div>

          {/* Action Buttons: Copy, Post on X, Post on Bluesky */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Primary Big Copy Button */}
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.99] ${
                copied
                  ? 'bg-zinc-800 text-white border border-zinc-600'
                  : 'bg-white hover:bg-zinc-200 text-black'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 stroke-[3] text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-black" />
                  <span>Copy Text for Social Post</span>
                </>
              )}
            </button>

            {/* Secondary Direct Intent Share Buttons (X and Bluesky) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={xIntentUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs transition-colors border border-zinc-800 shadow-sm"
              >
                <span>Post on X (Twitter)</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>

              <a
                href={blueskyIntentUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs transition-colors border border-zinc-800 shadow-sm"
              >
                {/* Bluesky Butterfly SVG */}
                <svg
                  viewBox="0 0 568 501"
                  className="w-4 h-4 fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M123.12 35.66C185.34 82.35 249.52 171.1 284 227.18c34.48-56.08 98.66-144.83 160.88-191.52C489.87 3.52 563.8-19.46 563.8 67.24c0 17.34-9.92 145.86-15.74 166.69-20.25 72.48-94.04 90.96-159.88 79.79 115.14 19.64 144.53 84.73 81.25 149.64-119.98 123.11-177.38-30.89-185.43-73.68-8.05 42.79-65.45 196.79-185.43 73.68-63.28-64.91-33.89-130 81.25-149.64-65.84 11.17-139.63-7.31-159.88-79.79C13.12 213.1 3.2 84.58 3.2 67.24c0-86.7 73.93-63.72 119.92-31.58z" />
                </svg>
                <span>Post on Bluesky</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>
          </div>
        </section>

        {/* HEADS-UP RELEASE HISTORY (Reference Archive) */}
        <section className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-zinc-500" />
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Recent Releases History (Heads-Up Reference)
            </h3>
          </div>

          <div className="flex flex-col divide-y divide-zinc-900">
            {SAMPLE_RELEASES.map((rel) => {
              const isCurrent = activeRelease.id === rel.id;
              return (
                <div
                  key={rel.id}
                  onClick={() => handleSelectHistoryRelease(rel)}
                  className={`py-3 flex items-center justify-between cursor-pointer transition-colors group ${
                    isCurrent ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white group-hover:underline">
                        CrossPoint {rel.version}
                      </span>
                      {rel.id === SAMPLE_RELEASES[0].id && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">
                          Latest
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                      {rel.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono shrink-0">
                    <span>{rel.date.split(' ')[0]}</span>
                    {isCurrent && <span className="text-white">●</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer with Unaffiliated Statement */}
      <footer className="border-t border-zinc-900 py-5 text-center text-xs text-zinc-500 flex flex-col gap-1 px-4">
        <span>Unofficial community fan tool · Not affiliated with or endorsed by CrossPoint Reader or hardware manufacturers.</span>
        <span className="text-zinc-600 font-mono text-[11px]">https://github.com/crosspoint-reader/crosspoint-reader/releases</span>
      </footer>
    </div>
  );
}
