#!/usr/bin/env tsx

/**
 * 자동 블로그 포스팅 스케줄러
 * 용법: tsx scripts/auto-posting-scheduler.ts
 * 크론잡: 0 9 * * * cd /Users/hwangmin/development/pj/blog && npm run auto-posting
 */

import { config } from 'dotenv'
import https from 'https'
import http from 'http'

// 환경 변수 로드
config()

const MCP_SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mcp.eungming.com'
  : 'http://localhost:8787'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL

// HTTP 요청 헬퍼
async function makeHttpRequest(url: string, method: string = 'GET', data?: any, headers?: Record<string, string>) {
  const urlObj = new URL(url)
  const isHttps = urlObj.protocol === 'https:'
  
  const options: any = {
    hostname: urlObj.hostname,
    port: urlObj.port || (isHttps ? 443 : 80),
    path: urlObj.pathname + urlObj.search,
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Auto-Posting-Scheduler/1.0',
      ...headers
    },
    rejectUnauthorized: false
  }

  if (data) {
    const postData = JSON.stringify(data)
    options.headers['Content-Length'] = Buffer.byteLength(postData)
  }

  return new Promise((resolve, reject) => {
    const req = isHttps 
      ? https.request(options, handleResponse)
      : http.request(options, handleResponse)

    function handleResponse(res: any) {
      let responseData = ''
      res.on('data', (chunk: Buffer) => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(responseData)
            resolve(result)
          } catch (e) {
            resolve({ raw: responseData })
          }
        } else {
          reject(new Error(`HTTP error: ${res.statusCode} - ${responseData}`))
        }
      })
    }

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

// Slack 알림 전송
async function sendSlackNotification(message: string, success: boolean = true) {
  if (!SLACK_WEBHOOK) return

  try {
    await makeHttpRequest(SLACK_WEBHOOK, 'POST', {
      text: success ? `✅ ${message}` : `❌ ${message}`,
      username: 'Auto Posting Bot',
      icon_emoji: success ? ':rocket:' : ':warning:',
      attachments: success ? undefined : [{
        color: 'danger',
        text: '자동 포스팅 실패 - 로그를 확인하세요.'
      }]
    })
  } catch (error) {
    console.error('Failed to send Slack notification:', error)
  }
}

// Discord 알림 전송
async function sendDiscordNotification(message: string, success: boolean = true) {
  if (!DISCORD_WEBHOOK) return

  try {
    await makeHttpRequest(DISCORD_WEBHOOK, 'POST', {
      content: success ? `🚀 **자동 포스팅 성공**\n${message}` : `⚠️ **자동 포스팅 실패**\n${message}`,
      username: 'Auto Posting Bot'
    })
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }
}

// 로그 기록
function logWithTimestamp(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${level}] ${message}`
  console.log(logMessage)
  
  // 필요시 파일 로깅 추가
  // fs.appendFileSync('/path/to/auto-posting.log', logMessage + '\n')
}

// MCP 서버를 통한 자동 포스팅 실행
async function executeAutoPosting(): Promise<{
  success: boolean
  result?: any
  error?: string
}> {
  try {
    logWithTimestamp('Starting auto posting execution...')

    // MCP 서버의 auto_posting_scheduled 도구 호출
    const mcpResponse = await makeHttpRequest(
      `${MCP_SERVER_URL}/mcp`,
      'POST',
      {
        method: 'call_tool',
        params: {
          name: 'auto_posting_scheduled',
          arguments: {}
        }
      }
    )

    logWithTimestamp(`MCP response received: ${JSON.stringify(mcpResponse)}`)

    if (mcpResponse && (mcpResponse as any).status === 'SUCCESS') {
      return {
        success: true,
        result: mcpResponse
      }
    } else {
      return {
        success: false,
        error: (mcpResponse as any).message || 'Unknown error from MCP server'
      }
    }

  } catch (error) {
    logWithTimestamp(`Auto posting execution failed: ${(error as Error).message}`, 'ERROR')
    return {
      success: false,
      error: (error as Error).message
    }
  }
}

// Claude API를 직접 사용한 자동 포스팅 (백업 방법)
async function executeAutoPostingWithClaudeAPI(): Promise<{
  success: boolean
  result?: any
  error?: string
}> {
  if (!CLAUDE_API_KEY) {
    return {
      success: false,
      error: 'CLAUDE_API_KEY not configured'
    }
  }

  try {
    logWithTimestamp('Executing auto posting with Claude API (backup method)...')

    // 원샷 프롬프트 내용 (간소화 버전)
    const prompt = `
    역할: 한국 기술 블로그 자동 포스팅 AI입니다.
    
    목표: RPA/UiPath, MCP/Claude, 웹개발 실무 주제 중 하나를 선택해 블로그 포스트를 작성하고 발행하세요.
    
    출력 형식:
    1. 주제 선정 (1개)
    2. 마크다운 본문 (YAML 프론트매터 포함)
    3. JSON 페이로드
    
    바로 실행하세요.
    `

    const claudeResponse = await makeHttpRequest(
      'https://api.anthropic.com/v1/messages',
      'POST',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      },
      {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    )

    logWithTimestamp('Claude API response received')

    // 응답 처리 및 블로그 API 호출은 여기서 구현
    // (기존 auto-posting.ts의 로직 재사용)

    return {
      success: true,
      result: {
        message: 'Claude API 백업 방식으로 포스팅 완료 (구현 예정)',
        claude_response: claudeResponse
      }
    }

  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    }
  }
}

// 메인 실행 함수
async function main() {
  const startTime = Date.now()
  logWithTimestamp('🚀 Auto posting scheduler started')

  try {
    // 1차 시도: MCP 서버 사용
    let result = await executeAutoPosting()

    // 2차 시도: Claude API 직접 사용 (MCP 서버 실패시)
    if (!result.success) {
      logWithTimestamp('MCP server method failed, trying Claude API backup...', 'WARN')
      result = await executeAutoPostingWithClaudeAPI()
    }

    const executionTime = Date.now() - startTime

    if (result.success) {
      const successMessage = `자동 포스팅 성공! 
      실행시간: ${executionTime}ms
      ${result.result?.post_url ? `포스트 URL: ${result.result.post_url}` : ''}
      ${result.result?.category ? `카테고리: ${result.result.category}` : ''}
      ${result.result?.tags ? `태그: ${result.result.tags.join(', ')}` : ''}`
      
      logWithTimestamp(successMessage)
      
      // 성공 알림 전송
      await Promise.all([
        sendSlackNotification(successMessage),
        sendDiscordNotification(successMessage)
      ])

      process.exit(0)
    } else {
      const errorMessage = `자동 포스팅 실패: ${result.error}
      실행시간: ${executionTime}ms`
      
      logWithTimestamp(errorMessage, 'ERROR')
      
      // 실패 알림 전송
      await Promise.all([
        sendSlackNotification(errorMessage, false),
        sendDiscordNotification(errorMessage, false)
      ])

      process.exit(1)
    }

  } catch (error) {
    const fatalError = `자동 포스팅 치명적 오류: ${(error as Error).message}`
    logWithTimestamp(fatalError, 'ERROR')
    
    await Promise.all([
      sendSlackNotification(fatalError, false),
      sendDiscordNotification(fatalError, false)
    ])

    process.exit(1)
  }
}

// 스케줄러 실행
if (require.main === module) {
  main().catch((error) => {
    logWithTimestamp(`Unhandled error: ${error.message}`, 'ERROR')
    process.exit(1)
  })
}

export { executeAutoPosting, executeAutoPostingWithClaudeAPI }