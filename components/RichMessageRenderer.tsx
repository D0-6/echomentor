"use client"

import * as React from "react"

/**
 * RichMessageRenderer
 * 
 * Parses AI responses and renders:
 * - [YOUTUBE: query] tags as clickable YouTube search cards
 * - Regular URLs as clickable links
 * - Everything else as normal text
 */

interface RichMessageRendererProps {
  content: string
  className?: string
}

export function RichMessageRenderer({ content, className }: RichMessageRendererProps) {
  const parts = React.useMemo(() => parseContent(content), [content])

  return (
    <div className={className}>
      {parts.map((part, i) => {
        if (part.type === "youtube") {
          return <YouTubeCard key={i} query={part.value} />
        }
        if (part.type === "url") {
          return (
            <a
              key={i}
              href={part.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 font-bold hover:opacity-80 transition-opacity break-all"
            >
              {part.value}
            </a>
          )
        }
        // Regular text — preserve whitespace/newlines
        return <span key={i}>{part.value}</span>
      })}
    </div>
  )
}

// ─── YouTube Card Component ────────────────────────────────────────
function YouTubeCard({ query }: { query: string }) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  // Use YouTube's oembed thumbnail pattern for a nice preview
  const thumbnailUrl = `https://img.youtube.com/vi/default/0.jpg`

  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-[clamp(0.75rem,2vw,1.25rem)] my-4 p-[clamp(0.75rem,2vw,1.25rem)] bg-[#FF0000]/5 hover:bg-[#FF0000]/10 border-2 border-[#FF0000]/15 hover:border-[#FF0000]/30 rounded-[clamp(1rem,2vw,1.5rem)] transition-all duration-300 no-underline active:scale-[0.98] shadow-sm hover:shadow-md"
    >
      {/* YouTube Play Icon */}
      <div className="flex-shrink-0 w-[clamp(3.5rem,8vw,5rem)] h-[clamp(3.5rem,8vw,5rem)] bg-[#FF0000] rounded-[clamp(0.75rem,1.5vw,1.25rem)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <svg viewBox="0 0 24 24" fill="white" className="w-[60%] h-[60%] ml-[4%]">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[clamp(0.65rem,1.2vw,0.8rem)] font-black text-[#FF0000] uppercase tracking-[0.15em] mb-1 opacity-80">
          YouTube Tutorial
        </p>
        <p className="text-[clamp(1rem,1.8vw,1.2rem)] font-bold text-on-surface leading-snug truncate group-hover:text-[#FF0000] transition-colors">
          {query}
        </p>
        <p className="text-[clamp(0.75rem,1.2vw,0.9rem)] text-on-surface-variant mt-1 opacity-60">
          Tap to watch on YouTube →
        </p>
      </div>

      {/* External Link Icon */}
      <span className="material-symbols-outlined text-[#FF0000]/40 group-hover:text-[#FF0000] transition-colors icon-sm flex-shrink-0">
        open_in_new
      </span>
    </a>
  )
}

// ─── Parser ────────────────────────────────────────────────────────
interface ContentPart {
  type: "text" | "youtube" | "url"
  value: string
}

function parseContent(content: string): ContentPart[] {
  if (!content) return []

  const parts: ContentPart[] = []
  
  // Pattern to find [YOUTUBE: ...] tags
  const youtubePattern = /\[YOUTUBE:\s*(.+?)\]/gi
  // Pattern to find raw URLs 
  const urlPattern = /(https?:\/\/[^\s\])<]+)/gi

  let lastIndex = 0
  // First pass: extract YouTube tags
  const combined = content.replace(youtubePattern, (match, query, offset) => {
    return `\x00YOUTUBE:${query.trim()}\x00`
  })

  // Second pass: split and process
  const segments = combined.split('\x00')
  
  for (const segment of segments) {
    if (segment.startsWith('YOUTUBE:')) {
      const query = segment.replace('YOUTUBE:', '').trim()
      if (query) {
        parts.push({ type: "youtube", value: query })
      }
    } else if (segment.trim()) {
      // Check for URLs within text segments
      let textLastIndex = 0
      let urlMatch: RegExpExecArray | null
      const localUrlPattern = new RegExp(urlPattern.source, 'gi')
      
      while ((urlMatch = localUrlPattern.exec(segment)) !== null) {
        // Add text before URL
        if (urlMatch.index > textLastIndex) {
          parts.push({ type: "text", value: segment.slice(textLastIndex, urlMatch.index) })
        }
        parts.push({ type: "url", value: urlMatch[0] })
        textLastIndex = urlMatch.index + urlMatch[0].length
      }
      
      // Add remaining text
      if (textLastIndex < segment.length) {
        parts.push({ type: "text", value: segment.slice(textLastIndex) })
      }
    }
  }

  return parts.length > 0 ? parts : [{ type: "text", value: content }]
}
