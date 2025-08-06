import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryTabs from "@/components/CategoryTabs";
import MCPButton from "@/components/MCPButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      {/* MCP 버튼 - 상단 고정 */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <MCPButton />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
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