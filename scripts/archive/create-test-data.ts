import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function createTestData() {
  const dbConfig = {
    host: 'monsilserver.iptime.org',
    port: 3306,
    user: 'min',
    password: 'f8tgw3lshms!',
    database: 'blog_db',
  };

  try {
    console.log('🔗 원격 DB 연결 중...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ 연결 성공!\n');

    // 1. 테스트 포스트 생성
    console.log('📝 테스트 포스트 생성...');
    
    const testPostData = {
      title: '댓글 시스템 테스트 포스트',
      slug: '댓글-시스템-테스트-포스트',
      content: `# 댓글 시스템 테스트 포스트

이 포스트는 새로 구현된 **댓글 시스템**을 테스트하기 위해 작성되었습니다.

## 🎯 테스트 목표

1. **댓글 작성** - 이름, 비밀번호, 내용으로 댓글 등록
2. **대댓글 작성** - 기존 댓글에 답글 달기
3. **댓글 수정** - 비밀번호로 본인 댓글 수정
4. **댓글 삭제** - 비밀번호로 본인 댓글 삭제

## 💬 댓글 기능

새로운 댓글 시스템은 다음과 같은 특징을 가집니다:

- **비밀번호 기반**: 로그인 없이도 댓글 작성 가능
- **중첩 댓글**: 댓글에 대한 답글 무제한 지원
- **실시간 업데이트**: 댓글 작성/수정/삭제 즉시 반영
- **보안**: bcrypt로 비밀번호 해싱

## 🚀 사용법

아래 댓글란에서 테스트해보세요!

1. 이름과 비밀번호, 댓글 내용을 입력
2. "댓글 작성" 버튼 클릭
3. 작성된 댓글에 "답글" 버튼으로 대댓글 작성
4. "수정" 또는 "삭제" 버튼으로 본인 댓글 관리

**참고**: 비밀번호는 안전하게 암호화되어 저장됩니다.`,
      excerpt: '새로 구현된 댓글 시스템을 테스트해보세요! 비밀번호 기반의 안전한 댓글 시스템입니다.',
      authorId: 1,
      categoryId: 1,
      published: true,
      viewCount: 0
    };

    const [postResult] = await connection.execute(`
      INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, published, view_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      testPostData.title,
      testPostData.slug,
      testPostData.content,
      testPostData.excerpt,
      testPostData.authorId,
      testPostData.categoryId,
      testPostData.published,
      testPostData.viewCount
    ]);

    const postId = (postResult as any).insertId;
    console.log(`✅ 테스트 포스트 생성 완료! ID: ${postId}`);

    // 2. 태그 추가
    console.log('\n🏷️ 태그 추가...');
    
    const tags = ['테스트', '댓글시스템', '기능'];
    
    for (const tagName of tags) {
      // 태그가 이미 존재하는지 확인
      const [existingTag] = await connection.execute(
        'SELECT id FROM tags WHERE name = ?',
        [tagName]
      );

      let tagId;
      if ((existingTag as any[]).length > 0) {
        tagId = (existingTag as any[])[0].id;
        console.log(`⚠️ 태그 "${tagName}" 이미 존재 (ID: ${tagId})`);
      } else {
        // 새 태그 생성
        const [tagResult] = await connection.execute(`
          INSERT INTO tags (name, slug)
          VALUES (?, ?)
        `, [tagName, tagName.toLowerCase()]);
        
        tagId = (tagResult as any).insertId;
        console.log(`✅ 태그 "${tagName}" 생성 완료! ID: ${tagId}`);
      }

      // 포스트-태그 연결
      await connection.execute(`
        INSERT INTO posts_to_tags (post_id, tag_id)
        VALUES (?, ?)
      `, [postId, tagId]);
    }

    console.log('✅ 포스트-태그 연결 완료!');

    // 3. 테스트 댓글 생성
    console.log('\n💬 테스트 댓글 생성...');
    
    // 댓글 1 (최상위)
    const password1 = await bcrypt.hash('test123', 10);
    const [comment1Result] = await connection.execute(`
      INSERT INTO comments (content, name, password, post_id, parent_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '첫 번째 댓글입니다! 댓글 시스템이 잘 작동하는지 테스트해보겠습니다. 👍',
      '테스터1',
      password1,
      postId,
      null
    ]);
    
    const comment1Id = (comment1Result as any).insertId;
    console.log(`✅ 댓글 1 생성 완료! ID: ${comment1Id}`);

    // 댓글 2 (최상위)
    const password2 = await bcrypt.hash('hello456', 10);
    const [comment2Result] = await connection.execute(`
      INSERT INTO comments (content, name, password, post_id, parent_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '두 번째 댓글이에요! 이 댓글 시스템 정말 좋네요. 비밀번호로 보호되니까 안전하고! 🔒',
      '사용자A',
      password2,
      postId,
      null
    ]);
    
    const comment2Id = (comment2Result as any).insertId;
    console.log(`✅ 댓글 2 생성 완료! ID: ${comment2Id}`);

    // 대댓글 1 (댓글 1에 대한 답글)
    const password3 = await bcrypt.hash('reply789', 10);
    await connection.execute(`
      INSERT INTO comments (content, name, password, post_id, parent_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '첫 번째 댓글에 대한 답글입니다! 대댓글 기능도 잘 작동하네요! 😊',
      '답글러',
      password3,
      postId,
      comment1Id
    ]);
    
    console.log(`✅ 대댓글 1 생성 완료! (댓글 ${comment1Id}에 대한 답글)`);

    // 대댓글 2 (댓글 1에 대한 또 다른 답글)
    const password4 = await bcrypt.hash('nested123', 10);
    await connection.execute(`
      INSERT INTO comments (content, name, password, post_id, parent_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '저도 첫 번째 댓글에 답글 달아봅니다! 중첩 댓글이 잘 보이는지 확인해주세요~ 🎈',
      '중첩댓글러',
      password4,
      postId,
      comment1Id
    ]);
    
    console.log(`✅ 대댓글 2 생성 완료! (댓글 ${comment1Id}에 대한 답글)`);

    // 대댓글 3 (댓글 2에 대한 답글)
    const password5 = await bcrypt.hash('test999', 10);
    await connection.execute(`
      INSERT INTO comments (content, name, password, post_id, parent_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
      '두 번째 댓글에도 답글 남겨봅니다! UI가 깔끔하게 나오길 바라요! ✨',
      'UI테스터',
      password5,
      postId,
      comment2Id
    ]);
    
    console.log(`✅ 대댓글 3 생성 완료! (댓글 ${comment2Id}에 대한 답글)`);

    // 4. 생성된 데이터 확인
    console.log('\n📊 생성된 테스트 데이터 확인...');
    
    // 포스트 확인
    const [posts] = await connection.execute(`
      SELECT p.id, p.title, p.slug, p.view_count, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [postId]);
    
    console.log('\n📝 생성된 포스트:');
    console.table(posts);

    // 댓글 확인
    const [comments] = await connection.execute(`
      SELECT 
        id, 
        content, 
        name, 
        post_id, 
        parent_id,
        created_at
      FROM comments 
      WHERE post_id = ?
      ORDER BY created_at ASC
    `, [postId]);
    
    console.log('\n💬 생성된 댓글:');
    console.table(comments);

    // 태그 연결 확인
    const [postTags] = await connection.execute(`
      SELECT t.name 
      FROM tags t
      JOIN posts_to_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `, [postId]);
    
    console.log('\n🏷️ 연결된 태그:');
    console.table(postTags);

    await connection.end();
    console.log('\n🎉 테스트 데이터 생성 완료!');
    console.log(`\n🔗 포스트 URL: http://localhost:3001/blog/${encodeURIComponent(testPostData.slug)}`);
    console.log('💡 테스트 비밀번호들:');
    console.log('   - 테스터1: test123');
    console.log('   - 사용자A: hello456');
    console.log('   - 답글러: reply789');
    console.log('   - 중첩댓글러: nested123');
    console.log('   - UI테스터: test999');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

createTestData();