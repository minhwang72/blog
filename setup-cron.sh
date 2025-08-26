#!/bin/bash

# 자동 블로그 포스팅 크론잡 설정 스크립트
# 사용법: chmod +x setup-cron.sh && ./setup-cron.sh

PROJECT_DIR="/Users/hwangmin/development/pj/blog"
LOG_DIR="$PROJECT_DIR/logs"
CRON_JOB="0 9 * * * cd $PROJECT_DIR && npm run auto-posting >> $LOG_DIR/auto-posting.log 2>&1"

echo "🔧 Setting up auto posting cron job..."

# 로그 디렉토리 생성
mkdir -p "$LOG_DIR"
echo "📁 Created log directory: $LOG_DIR"

# 기존 크론잡에서 자동 포스팅 관련 제거
crontab -l 2>/dev/null | grep -v "auto-posting" > /tmp/crontab_new

# 새 크론잡 추가
echo "$CRON_JOB" >> /tmp/crontab_new

# 크론탭 업데이트
crontab /tmp/crontab_new
rm /tmp/crontab_new

echo "✅ Cron job added successfully!"
echo "📅 Schedule: Every day at 9:00 AM (Asia/Seoul)"
echo "📝 Logs will be saved to: $LOG_DIR/auto-posting.log"
echo ""
echo "현재 크론탭 목록:"
crontab -l

echo ""
echo "테스트 실행:"
echo "npm run auto-posting:test"
echo ""
echo "크론잡 비활성화 (필요시):"
echo "crontab -e 에서 해당 라인 삭제"