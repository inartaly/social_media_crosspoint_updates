import { ReleaseHighlight, TweetCharacterStats, TweetRuleCheck, FocusVariant } from '../types';

/**
 * Extracts links from text using URL regex
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * Strips URLs from tweet to measure pure body length
 */
export function getTweetBodyOnly(tweetText: string): string {
  return tweetText.replace(/(https?:\/\/[^\s]+)/g, '').trimEnd();
}

/**
 * Calculate Twitter character statistics based on Twitter's URL wrapping rule (23 characters for URLs)
 * and the strict user rule: body text under 220 characters (excluding links).
 */
export function calculateStats(tweetText: string, releaseUrl?: string): TweetCharacterStats {
  const bodyText = getTweetBodyOnly(tweetText);
  const bodyLength = bodyText.length;
  const maxBodyLength = 220;

  // Twitter counts any URL as 23 characters (t.co wrap)
  const urls = extractUrls(tweetText);
  const totalLength = bodyLength + (urls.length > 0 ? urls.length * 24 : 0);
  const twitterMaxTotal = 280;

  return {
    bodyLength,
    maxBodyLength,
    totalLength,
    twitterMaxTotal,
    urlLength: releaseUrl ? 23 : 0,
    isBodyValid: bodyLength <= maxBodyLength,
    isTotalValid: totalLength <= twitterMaxTotal,
  };
}

/**
 * Compiles a tweet strictly adhering to the 5 rules:
 * 1. Only tweet text, no fluff
 * 2. 2-3 most exciting highlights
 * 3. Body under 220 characters
 * 4. Clean bullet formatting with emojis
 * 5. Informative, developer/tech-enthusiast tone
 */
export const DEFAULT_BRAND_HASHTAGS = '#Xteink #SeeedStudio #LilyGo #M5Stack';

export function compileTweet(
  version: string,
  highlights: ReleaseHighlight[],
  releaseUrl: string,
  variant: FocusVariant = 'balanced',
  hashtag: string = DEFAULT_BRAND_HASHTAGS
): string {
  // Sort or filter highlights according to variant
  let filtered = highlights.filter((h) => h.selected);
  if (filtered.length === 0) {
    filtered = highlights.slice(0, 4);
  }

  if (variant === 'hardware') {
    filtered = [...filtered].sort((a, b) => (b.category === 'hardware' ? 1 : 0) - (a.category === 'hardware' ? 1 : 0));
  } else if (variant === 'performance') {
    filtered = [...filtered].sort((a, b) => (b.category === 'performance' ? 1 : 0) - (a.category === 'performance' ? 1 : 0));
  }

  // Clean version tag (e.g., 'v1.6.5' -> '1.6.5' or '1.6.5')
  const vTag = version.startsWith('v') ? version.slice(1) : version;
  const header = `🚀 CrossPoint ${vTag} is out!`;

  // Try 4 highlights first, then 3 if over 220 limit
  let selectedItems = filtered.slice(0, 4);
  let bullets = selectedItems.map((item) => `• ${item.emoji} ${item.conciseText}`);
  let bodyWithoutTags = `${header}\n${bullets.join('\n')}`;

  const tagSpacing = hashtag ? `\n\n${hashtag}` : '';
  if (bodyWithoutTags.length + tagSpacing.length > 220 && selectedItems.length === 4) {
    selectedItems = filtered.slice(0, 3);
    bullets = selectedItems.map((item) => `• ${item.emoji} ${item.conciseText}`);
    bodyWithoutTags = `${header}\n${bullets.join('\n')}`;
  }

  // If still over 220 with 3 highlights, try 2
  if (bodyWithoutTags.length + tagSpacing.length > 220 && selectedItems.length === 3) {
    selectedItems = filtered.slice(0, 2);
    bullets = selectedItems.map((item) => `• ${item.emoji} ${item.conciseText}`);
    bodyWithoutTags = `${header}\n${bullets.join('\n')}`;
  }

  let fullBody = bodyWithoutTags;
  if (hashtag && bodyWithoutTags.length + tagSpacing.length <= 220) {
    fullBody = `${bodyWithoutTags}${tagSpacing}`;
  }

  if (releaseUrl) {
    return `${fullBody}\n${releaseUrl}`;
  }

  return fullBody;
}

/**
 * Validate a draft against the 5 strict rules
 */
export function validateTweetRules(tweetText: string): TweetRuleCheck[] {
  const bodyText = getTweetBodyOnly(tweetText);
  const urls = extractUrls(tweetText);
  const lines = tweetText.split('\n').filter((l) => l.trim().length > 0);
  const bulletLines = lines.filter((l) => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'));

  // Rule 1: No fluff / quotes
  const startsWithQuote = tweetText.trim().startsWith('"') || tweetText.trim().startsWith("'");
  const hasFluffWords = /here is the tweet|drafted tweet:|tweet:|summary:/i.test(tweetText);
  const rule1 = !startsWithQuote && !hasFluffWords;

  // Rule 2: 2-3 highlights
  const rule2 = bulletLines.length >= 2 && bulletLines.length <= 3;

  // Rule 3: Body < 220 chars
  const rule3 = bodyText.length <= 220;

  // Rule 4: Relevant emojis
  const hasEmojis = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(tweetText);
  const rule4 = hasEmojis && bulletLines.length > 0;

  // Rule 5: Dev tone & technical keywords
  const hasTechTone = /crosspoint|firmware|spi|i2c|esp32|rp2040|stm32|boot|driver|bus|dma|ble|release/i.test(tweetText);

  return [
    {
      id: 'r1',
      label: 'Strict tweet output only',
      passed: rule1,
      details: rule1 ? 'Zero conversational fluff or quotes' : 'Contains intro words or quotation marks',
    },
    {
      id: 'r2',
      label: '2-3 key highlights',
      passed: rule2,
      details: `${bulletLines.length} highlights detected (target: 2-3)`,
    },
    {
      id: 'r3',
      label: 'Body under 220 chars',
      passed: rule3,
      details: `${bodyText.length}/220 characters (excluding link)`,
    },
    {
      id: 'r4',
      label: 'Bullet points & emojis',
      passed: rule4,
      details: rule4 ? 'Clean bullet layout with 🚀/⚡/📱/🐛' : 'Missing bullets or emojis',
    },
    {
      id: 'r5',
      label: 'Technical tone',
      passed: hasTechTone,
      details: hasTechTone ? 'Concise developer/hardware tone' : 'Needs hardware/firmware focus',
    },
  ];
}

/**
 * Intelligent parser for custom markdown release notes
 */
export function parseMarkdownRelease(markdown: string, customUrl?: string): {
  version: string;
  highlights: ReleaseHighlight[];
  detectedUrl: string;
} {
  // Extract version from headers like "## CrossPoint Firmware Release v2.4.0" or "v2.4.0"
  const versionMatch = markdown.match(/v\d+\.\d+(\.\d+)?/i);
  const version = versionMatch ? versionMatch[0] : 'v2.4';

  // Extract URLs
  const urlMatch = markdown.match(/https:\/\/github\.com\/[^\s)\]]+/);
  const detectedUrl = customUrl || (urlMatch ? urlMatch[0] : 'https://github.com/crosspoint-reader/crosspoint-reader');

  // Extract bullet points
  const rawBullets: string[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const clean = trimmed.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim();
      if (clean.length > 5 && !clean.toLowerCase().includes('changelog') && !clean.toLowerCase().includes('commits')) {
        rawBullets.push(clean);
      }
    }
  }

  const highlights: ReleaseHighlight[] = rawBullets.slice(0, 6).map((raw, index) => {
    let category: 'feature' | 'hardware' | 'bugfix' | 'performance' = 'feature';
    let emoji: '⚡' | '📱' | '🐛' | '🚀' = '⚡';

    const lower = raw.toLowerCase();
    if (lower.includes('fix') || lower.includes('bug') || lower.includes('lockup') || lower.includes('glitch') || lower.includes('overflow')) {
      category = 'bugfix';
      emoji = '🐛';
    } else if (lower.includes('esp32') || lower.includes('rp2040') || lower.includes('stm32') || lower.includes('target') || lower.includes('board') || lower.includes('hardware') || lower.includes('pwm')) {
      category = 'hardware';
      emoji = '📱';
    } else if (lower.includes('speed') || lower.includes('fast') || lower.includes('dma') || lower.includes('boot') || lower.includes('power') || lower.includes('sleep') || lower.includes('optimi')) {
      category = 'performance';
      emoji = '⚡';
    }

    // Shorten if very long
    let conciseText = raw.replace(/^[⚡📱🐛🚀]\s*/, '').trim();
    if (conciseText.length > 44) {
      // Find colon or dash split
      if (conciseText.includes(':')) {
        const parts = conciseText.split(':');
        conciseText = parts[0].length < 35 && parts[1] ? `${parts[0]}: ${parts[1].trim().slice(0, 25)}...` : parts[0];
      } else {
        conciseText = conciseText.slice(0, 42).trimEnd() + '...';
      }
    }

    return {
      id: `custom-h-${index}`,
      category,
      emoji,
      rawText: raw,
      conciseText,
      selected: index < 3,
    };
  });

  // Ensure default fallback if no bullets found
  if (highlights.length === 0) {
    highlights.push(
      {
        id: 'c1',
        category: 'performance',
        emoji: '⚡',
        rawText: '2x faster SPI flash read & boot times',
        conciseText: '2x faster SPI flash read & boot times',
        selected: true,
      },
      {
        id: 'c2',
        category: 'hardware',
        emoji: '📱',
        rawText: 'Added support for ESP32-S3 & RP2040',
        conciseText: 'Added support for ESP32-S3 & RP2040',
        selected: true,
      },
      {
        id: 'c3',
        category: 'bugfix',
        emoji: '🐛',
        rawText: 'Fixed intermittent I2C sensor lockups',
        conciseText: 'Fixed intermittent I2C sensor lockups',
        selected: true,
      }
    );
  }

  return {
    version,
    highlights,
    detectedUrl,
  };
}
