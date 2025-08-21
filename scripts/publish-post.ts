// SSL 인증서 검증은 시스템 기본값 사용

// MCP 서버에 포스트 발행 요청
async function publishPost(slug: string) {
  try {
    console.log(`📢 포스트 발행 시작: ${slug}`)
    
    const response = await fetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `publish-${slug}`,
        method: 'tools/call',
        params: {
          name: 'post_publish',
          arguments: {
            slug,
            publishedAt: new Date().toISOString()
          }
        }
      })
    })

    const result = await response.json()
    
    if (result.error) {
      console.error('❌ 발행 실패:', result.error)
      return false
    }

    console.log('✅ 포스트 발행 성공!')
    console.log('   결과:', JSON.stringify(result, null, 2))
    return true

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    return false
  }
}

// 스크립트 실행
if (require.main === module) {
  const slug = process.argv[2]
  
  if (!slug) {
    console.error('❌ 사용법: tsx scripts/publish-post.ts <slug>')
    process.exit(1)
  }

  publishPost(slug)
    .then(success => {
      if (success) {
        console.log('🎉 포스트 발행 완료!')
        process.exit(0)
      } else {
        console.log('💥 포스트 발행 실패!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 예상치 못한 오류:', error)
      process.exit(1)
    })
}

export { publishPost }