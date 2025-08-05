import crypto from 'crypto';

function generateSecureToken(): string {
  // 32바이트 랜덤 데이터 생성
  const randomBytes = crypto.randomBytes(32);
  
  // Base64로 인코딩하여 안전한 토큰 생성
  const token = randomBytes.toString('base64');
  
  // URL 안전한 형태로 변환
  return token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function main() {
  const token = generateSecureToken();
  
  console.log('🔐 MCP API Token Generated');
  console.log('=====================================');
  console.log(`Token: ${token}`);
  console.log('=====================================');
  console.log('');
  console.log('📝 Usage Instructions:');
  console.log('1. Copy this token to your .env file:');
  console.log(`   MCP_API_TOKEN=${token}`);
  console.log('');
  console.log('2. Add to GitHub Secrets:');
  console.log('   - Go to your repository settings');
  console.log('   - Navigate to Secrets and variables > Actions');
  console.log('   - Add new repository secret: MCP_API_TOKEN');
  console.log('   - Paste the token value');
  console.log('');
  console.log('3. Update Cursor settings with this token');
  console.log('');
  console.log('⚠️  Keep this token secure and don\'t share it publicly!');
}

main(); 