import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryTabs from "@/components/CategoryTabs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 - 카테고리 탭 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <CategoryTabs />
            </div>
          </aside>
          
          {/* 메인 콘텐츠 */}
          <main className="lg:col-span-3">
            <div className="fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 