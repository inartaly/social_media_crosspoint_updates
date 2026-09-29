import React, { useState } from 'react';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface TwitterCardPreviewProps {
  tweetText: string;
  onCopy: () => void;
  copied: boolean;
}

export const TwitterCardPreview: React.FC<TwitterCardPreviewProps> = ({
  tweetText,
  onCopy,
  copied,
}) => {
  const [theme, setTheme] = useState<'dark' | 'dim' | 'light'>('dark');
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Encode for direct intent URL
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  // Formatting tweet with links highlighted
  const renderFormattedTweet = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Check if line contains URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (urlRegex.test(line)) {
        const parts = line.split(urlRegex);
        return (
          <p key={i} className="min-h-[1.3em] leading-relaxed break-words">
            {parts.map((part, pIdx) =>
              urlRegex.test(part) ? (
                <a
                  key={pIdx}
                  href={part}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    theme === 'light'
                      ? 'text-sky-600 hover:underline'
                      : 'text-sky-400 hover:underline'
                  }
                >
                  {part}
                </a>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      return (
        <p key={i} className="min-h-[1.3em] leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          container: 'bg-white text-slate-900 border-slate-200 shadow-sm',
          subtext: 'text-slate-500',
          border: 'border-slate-100',
          actionHover: 'hover:bg-slate-100',
          actionColor: 'text-slate-500',
        };
      case 'dim':
        return {
          container: 'bg-[#15202b] text-slate-100 border-[#38444d] shadow-sm',
          subtext: 'text-slate-400',
          border: 'border-[#38444d]/60',
          actionHover: 'hover:bg-slate-800/60',
          actionColor: 'text-slate-400',
        };
      case 'dark':
      default:
        return {
          container: 'bg-black text-slate-100 border-slate-800 shadow-sm',
          subtext: 'text-slate-500',
          border: 'border-slate-800/80',
          actionHover: 'hover:bg-slate-900',
          actionColor: 'text-slate-400',
        };
    }
  };

  const style = getThemeClasses();

  return (
    <div className="flex flex-col gap-3">
      {/* Header with Theme switcher & Quick actions */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Live X (Twitter) Preview</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Authentic Feed Render</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setTheme('dark')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              theme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dark theme"
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('dim')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              theme === 'dim' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Dim theme"
          >
            Dim
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              theme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Light theme"
          >
            Light
          </button>
        </div>
      </div>

      {/* Tweet Card */}
      <div className={`rounded-xl border p-4 transition-colors ${style.container}`}>
        {/* Author row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* CrossPoint Logo Avatar */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[15px] hover:underline cursor-pointer tracking-tight">
                  CrossPoint Hardware
                </span>
                <span className="text-amber-500" title="Verified Organization">
                  <ShieldCheck className="w-4 h-4 fill-amber-500 text-black inline" />
                </span>
              </div>
              <div className="flex items-center gap-1 text-[13px] leading-tight">
                <span className={style.subtext}>@CrossPointHW</span>
                <span className={style.subtext}>·</span>
                <span className={style.subtext}>Just now</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 font-mono">
              Open Source
            </span>
          </div>
        </div>

        {/* Tweet content */}
        <div className="mt-3 text-[15px] font-normal leading-relaxed whitespace-pre-wrap select-text">
          {renderFormattedTweet(tweetText)}
        </div>

        {/* Divider */}
        <div className={`my-3 border-t ${style.border}`} />

        {/* Engagement stats & interactive simulated actions */}
        <div className="flex items-center justify-between text-[13px] px-1">
          <button
            onClick={() => {}}
            className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors group ${style.actionHover} ${style.actionColor} hover:text-sky-500`}
            title="Reply"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-mono text-xs tabular-nums">12</span>
          </button>

          <button
            onClick={() => setReposted(!reposted)}
            className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors group ${style.actionHover} ${
              reposted ? 'text-emerald-500' : `${style.actionColor} hover:text-emerald-500`
            }`}
            title="Repost"
          >
            <Repeat2 className="w-4 h-4" />
            <span className="font-mono text-xs tabular-nums">{reposted ? 49 : 48}</span>
          </button>

          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors group ${style.actionHover} ${
              liked ? 'text-rose-500' : `${style.actionColor} hover:text-rose-500`
            }`}
            title="Like"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="font-mono text-xs tabular-nums">{liked ? 241 : 240}</span>
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors group ${style.actionHover} ${
              bookmarked ? 'text-sky-500' : `${style.actionColor} hover:text-sky-500`
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-sky-500 text-sky-500' : ''}`} />
            <span className="font-mono text-xs tabular-nums">{bookmarked ? 35 : 34}</span>
          </button>

          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors group ${style.actionHover} ${style.actionColor} hover:text-cyan-400`}
            title="Copy Tweet"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Tweet Text</span>
            </>
          )}
        </button>

        <a
          href={intentUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <span>Post on X</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
