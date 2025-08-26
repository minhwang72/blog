// MCP 서버를 통해 오늘 생성된 포스트 삭제
async function safeFetch(url: string, options: RequestInit = {}) {
  // GitHub Actions나 개발 환경에서 SSL 문제 해결
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
  const isDev = process.env.NODE_ENV === 'development'
  const needsSSLWorkaround = url.includes('mcp.eungming.com') || url.includes('localhost')
  
  if ((isGitHubActions || isDev) && needsSSLWorkaround) {
    console.log('🔧 SSL 인증서 우회 설정 적용 (GitHub Actions/Dev 환경)')
    
    // Node.js 환경변수로 SSL 검증 비활성화
    const oldRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    
    try {
      const result = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'User-Agent': 'min-blog-automation/1.0',
        },
      })
      
      return result
    } finally {
      // 원래 설정 복원
      if (oldRejectUnauthorized !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = oldRejectUnauthorized
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
      }
    }
  }
  
  // 일반 환경에서는 표준 연결 사용
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'User-Agent': 'min-blog-automation/1.0',
    },
  })
}

async function deleteTodayPostsMCP() {
  console.log('🗑️ MCP 서버를 통해 오늘 생성된 포스트 삭제 시작...')

  try {
    // 1. 먼저 최근 포스트 목록 가져오기 (오늘 포스트 확인용)
    console.log('🔍 최근 포스트 목록 조회 중...')
    const recentResponse = await safeFetch('https://mcp.eungming.com/mcp', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `recent-posts-${Date.now()}`,
        method: 'tools/call',
        params: {
          name: 'post_list_recent',
          arguments: { limit: 20 }
        }
      })
    })

    if (!recentResponse.ok) {
      throw new Error(`HTTP ${recentResponse.status}`)
    }

    const recentResult = await recentResponse.json()
    
    if (recentResult.error) {
      throw new Error(`MCP 오류: ${recentResult.error.message}`)
    }

    const allPosts = recentResult.result?.data || []
    
    // 오늘 날짜 (한국 시간 기준)
    const today = new Date()
    const kstOffset = 9 * 60 * 60 * 1000 // 9시간을 밀리초로 변환
    const kstToday = new Date(today.getTime() + kstOffset)
    const todayStr = kstToday.toISOString().split('T')[0] // YYYY-MM-DD 형식

    console.log(`📅 삭제 대상 날짜: ${todayStr} (KST)`)

    // 오늘 생성된 포스트 필터링
    const todayPosts = allPosts.filter((post: any) => {
      const postDate = new Date(post.createdAt)
      const postDateKST = new Date(postDate.getTime() + kstOffset)
      const postDateStr = postDateKST.toISOString().split('T')[0]
      return postDateStr === todayStr
    })

    console.log(`📋 오늘 생성된 포스트 목록 (${todayPosts.length}개):`)
    todayPosts.forEach((post: any, index: number) => {
      const createdAtKST = new Date(new Date(post.createdAt).getTime() + kstOffset)
      console.log(`   ${index + 1}. ID ${post.id}: ${post.title}`)
      console.log(`      생성일시: ${createdAtKST.toLocaleString('ko-KR')}`)
      console.log(`      슬러그: ${post.slug}`)
      console.log()
    })

    if (todayPosts.length === 0) {
      console.log('✅ 오늘 생성된 포스트가 없습니다.')
      return
    }

    // 2. 각 포스트를 개별적으로 삭제
    console.log('🗑️ 포스트 삭제 시작...')
    let deletedCount = 0
    
    for (const post of todayPosts) {
      try {
        console.log(`   삭제 중: "${post.title}" (ID: ${post.id})`)
        
        const deleteResponse = await safeFetch('https://mcp.eungming.com/mcp', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: `delete-post-${post.id}-${Date.now()}`,
            method: 'tools/call',
            params: {
              name: 'post_delete',
              arguments: { 
                id: post.id.toString() 
              }
            }
          })
        })

        const deleteResult = await deleteResponse.json()
        
        if (deleteResult.error) {
          console.log(`   ❌ 삭제 실패: ${deleteResult.error.message}`)
        } else {
          console.log(`   ✅ 삭제 성공`)
          deletedCount++
        }
        
        // API 호출 간격 조절 (과도한 요청 방지)
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.log(`   ❌ 삭제 중 오류: ${error}`)
      }
    }

    console.log('\n🎉 삭제 작업 완료!')
    console.log(`   총 대상 포스트: ${todayPosts.length}개`)
    console.log(`   실제 삭제됨: ${deletedCount}개`)
    console.log(`   실패: ${todayPosts.length - deletedCount}개`)

  } catch (error) {
    console.error('❌ 포스트 삭제 중 오류 발생:', error)
  }
}

// 스크립트 실행
if (require.main === module) {
  console.log('🚀 오늘 생성된 포스트 삭제 스크립트 시작')
  console.log('⏰', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }))
  
  deleteTodayPostsMCP()
    .then(() => {
      console.log('\n✅ 스크립트 완료!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n💥 예상치 못한 오류 발생:', error)
      process.exit(1)
    })
}