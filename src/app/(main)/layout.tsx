import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* 메인 콘텐츠 - 전체 폭 사용 */}
        <main className="w-full">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
} 