import { ReleaseData } from '../types';

export const SAMPLE_RELEASES: ReleaseData[] = [
  {
    id: 'v1.6.5',
    version: '1.6.5',
    title: 'TrueType Fonts, Library Browser & X4 Classic',
    date: 'Sep 27, 2026 (Latest)',
    releaseUrl: 'https://github.com/crosspoint-reader/crosspoint-reader/releases',
    highlights: [
      {
        id: 'h1-1',
        category: 'hardware',
        emoji: '📱',
        rawText: 'Official board support for the X4 Classic e-ink hardware target',
        conciseText: 'Added official X4 Classic support',
        selected: true,
      },
      {
        id: 'h1-2',
        category: 'performance',
        emoji: '⚡',
        rawText: 'Direct TrueType (.ttf/.otf) font loading from SD without conversion',
        conciseText: 'TrueType (.ttf) fonts from SD',
        selected: true,
      },
      {
        id: 'h1-3',
        category: 'feature',
        emoji: '📚',
        rawText: 'Full Library view with title/author search & visual Cover Grid theme',
        conciseText: 'New Library view & Cover Grid',
        selected: true,
      },
      {
        id: 'h1-4',
        category: 'performance',
        emoji: '👆',
        rawText: 'Enhanced customizable swipe & tap touch page turn gestures',
        conciseText: 'Touch swipe page turn gestures',
        selected: true,
      },
    ],
    markdown: `## CrossPoint 1.6.5 (September 27, 2026)

### Highlights
- 📱 **Official X4 Classic Support**: Native firmware targets for the new X4 Classic e-ink reader.
- ⚡ **TrueType Font Support**: Devices with PSRAM can now directly load \`.ttf\` and \`.otf\` fonts from the SD card without converting to \`.cpfont\`.
- 📚 **Full Library Browser**: Expanded Recent Books into a full Library view with Recent, Title, Author filtering and live search.
- 🖼 **Cover Grid Theme**: Visual cover art grid for browsing your book collection.
- 👆 **Custom Touch Controls**: Separate forward and backward gesture settings for taps and swipes.

### Release Page
https://github.com/crosspoint-reader/crosspoint-reader/releases`,
  },
  {
    id: 'v1.6.0',
    version: '1.6.0',
    title: 'Night Mode, New Locales & Performance',
    date: 'Sep 5, 2026',
    releaseUrl: 'https://github.com/crosspoint-reader/crosspoint-reader/releases',
    highlights: [
      {
        id: 'h2-1',
        category: 'feature',
        emoji: '⚡',
        rawText: 'Inverted e-ink Night Mode for low-light reading comfort',
        conciseText: 'Added inverted e-ink Night Mode',
        selected: true,
      },
      {
        id: 'h2-2',
        category: 'hardware',
        emoji: '📱',
        rawText: 'Broadened hardware support definitions and display timings',
        conciseText: 'Updated display timings & hardware targets',
        selected: true,
      },
      {
        id: 'h2-3',
        category: 'bugfix',
        emoji: '🐛',
        rawText: 'Fixed memory fragmentation and text alignment crashes in large EPUBs',
        conciseText: 'Fixed memory leaks in large EPUB files',
        selected: true,
      },
    ],
    markdown: `## CrossPoint 1.6.0 (September 5, 2026)

- ⚡ Inverted Night Mode for low-light reading.
- 📱 Refined hardware display timings across all supported e-ink panels.
- 🐛 Fixed EPUB memory fragmentation on large multi-chapter books.
- 🌐 Added new translations for community languages.

https://github.com/crosspoint-reader/crosspoint-reader/releases`,
  },
  {
    id: 'v1.5.0',
    version: '1.5.0',
    title: 'Seeed Sticky, X4 Pro & Frontlight Controls',
    date: 'Aug 7, 2026',
    releaseUrl: 'https://github.com/crosspoint-reader/crosspoint-reader/releases',
    highlights: [
      {
        id: 'h3-1',
        category: 'hardware',
        emoji: '📱',
        rawText: 'Official support for Seeed reTerminal Sticky, X4 Pro & M5Stack PaperMono',
        conciseText: 'Added Seeed Sticky, X4 Pro & PaperMono',
        selected: true,
      },
      {
        id: 'h3-2',
        category: 'feature',
        emoji: '⚡',
        rawText: 'Full frontlight control center with gesture adjustments & USB transfer',
        conciseText: 'Frontlight controls & direct USB transfer',
        selected: true,
      },
      {
        id: 'h3-3',
        category: 'bugfix',
        emoji: '🐛',
        rawText: 'Faster opening of heavy image-laden books with lazy page indexing',
        conciseText: 'Faster book opening with lazy indexing',
        selected: true,
      },
    ],
    markdown: `## CrossPoint 1.5.0 (August 7, 2026)

- 📱 Added support for Seeed reTerminal Sticky, X4 Pro, and M5Stack PaperMono.
- ⚡ Touch frontlight slider and direct USB drag-and-drop book loading.
- 🐛 Lazy chapter indexing to eliminate startup lag on large books.

https://github.com/crosspoint-reader/crosspoint-reader/releases`,
  },
];
