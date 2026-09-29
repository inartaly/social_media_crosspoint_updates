import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, CheckCircle2 } from 'lucide-react';

interface StrictBotOutputProps {
  tweetText: string;
  onCopy: () => void;
  copied: boolean;
}

export const StrictBotOutput: React.FC<StrictBotOutputProps> = ({
  tweetText,
  onCopy,
  copied,
}) => {
  const [viewMode, setViewMode] = useState<'raw' | 'curl' | 'github-action'>('raw');

  const githubActionSnippet = `name: Tweet CrossPoint Release
on:
  release:
    types: [published]
jobs:
  tweet:
    runs-on: ubuntu-latest
    steps:
      - name: Post to X
        uses: ethomson/send-tweet-action@v1
        with:
          status: |
${tweetText.split('\n').map((l) => `            ${l}`).join('\n')}
          consumer-key: \${{ secrets.TWITTER_CONSUMER_KEY }}
          consumer-secret: \${{ secrets.TWITTER_CONSUMER_SECRET }}
          access-token: \${{ secrets.TWITTER_ACCESS_TOKEN }}
          access-token-secret: \${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}`;

  const curlSnippet = `curl -X POST https://api.twitter.com/2/tweets \\
  -H "Authorization: Bearer \$TWITTER_BEARER_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"text": ${JSON.stringify(tweetText)}}'`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Strict Bot Output (Rule 1: Pure Text Only)
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md text-[11px]">
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2 py-0.5 rounded transition-colors ${
              viewMode === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Tweet
          </button>
          <button
            onClick={() => setViewMode('curl')}
            className={`px-2 py-0.5 rounded transition-colors ${
              viewMode === 'curl' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            cURL Payload
          </button>
          <button
            onClick={() => setViewMode('github-action')}
            className={`px-2 py-0.5 rounded transition-colors ${
              viewMode === 'github-action' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GitHub Action
          </button>
        </div>
      </div>

      {/* Code / Text Block */}
      <div className="relative group">
        <pre className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-lg text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto selection:bg-emerald-950 selection:text-emerald-200 leading-relaxed min-h-[110px]">
          {viewMode === 'raw'
            ? tweetText
            : viewMode === 'curl'
            ? curlSnippet
            : githubActionSnippet}
        </pre>

        <button
          onClick={() => {
            if (viewMode === 'raw') {
              onCopy();
            } else if (viewMode === 'curl') {
              navigator.clipboard.writeText(curlSnippet);
            } else {
              navigator.clipboard.writeText(githubActionSnippet);
            }
          }}
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded text-xs transition-colors shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Complies with strict rule: zero intros, notes, or quote wrapping.</span>
        </div>
        <span className="font-mono text-slate-400">RFC 8259 JSON Compatible</span>
      </div>
    </div>
  );
};
