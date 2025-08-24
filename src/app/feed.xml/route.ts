import { NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { getEnv } from '@/lib/env'

const SITE_URL = getEnv('NEXT_PUBLIC_SITE_URL') || 'https://www.eungming.com'
const SITE_NAME = 'min.log'
const SITE_DESCRIPTION = '개발자를 위한 기술 블로그 min.log - React, Next.js, TypeScript, AI 자동화, MCP 등 최신 개발 기술과 경험을 공유합니다.'

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export async function GET() {
  try {
    const postsResponse = await blogService.getPosts('all', 1, 50) // 최신 50개 포스트
    const posts = postsResponse.posts

    const rssItems = posts.map(post => {
      const title = escapeXml(post.title)
      const description = escapeXml(stripHtml(post.excerpt || post.content.substring(0, 200) + '...'))
      const content = escapeXml(post.content)
      const link = `${SITE_URL}/blog/${post.id}`
      const pubDate = new Date(post.createdAt).toUTCString()
      const author = escapeXml(post.authorName || '황민')
      const category = post.categoryName ? escapeXml(post.categoryName) : ''

      return `
    <item>
      <title>${title}</title>
      <description>${description}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@eungming.com (${author})</author>
      ${category ? `<category>${category}</category>` : ''}
      ${post.featuredImage ? `<enclosure url="${post.featuredImage}" type="image/jpeg" />` : ''}
    </item>`
    }).join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>ko-KR</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>min.log RSS Generator</generator>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1시간 캐시
      },
    })
  } catch (error) {
    console.error('RSS generation error:', error)
    return new NextResponse('RSS Feed generation failed', { status: 500 })
  }
}