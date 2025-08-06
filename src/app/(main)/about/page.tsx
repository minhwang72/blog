import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 - min.log',
  description: '황민의 개발 블로그 소개 페이지입니다.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          소개
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            안녕하세요, 황민입니다.
          </h2>
          <p className="text-gray-600 mb-6">
            이 블로그는 개발과 일상을 기록하는 공간입니다. 주로 웹 개발, 프로그래밍,
            그리고 일상의 소소한 이야기들을 담고 있습니다.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            블로그의 목적
          </h3>
          <p className="text-gray-600 mb-6">
            이 블로그는 제가 배우고 경험한 것들을 기록하고 공유하기 위해 만들어졌습니다.
            개발 관련 지식과 경험을 정리하고, 다른 개발자들과 소통하는 공간이 되었으면 합니다.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            주요 카테고리
          </h3>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>개발 - 웹 개발, 프로그래밍 관련 글</li>
            <li>일상 - 일상의 소소한 이야기</li>
            <li>리뷰 - 제품, 서비스 리뷰</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            연락처
          </h3>
          <p className="text-gray-600">
            이메일: zxcyui6181@naver.com
          </p>
        </div>
      </div>
    </main>
  );
} 