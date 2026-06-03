import { useState } from 'react';
import { aiTheoryChapters } from '../../data/aiTheoryData';
import { BrainCircuit, Image as ImageIcon, MessageSquare, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '../../components/UI/Card';

const iconMap = {
  BrainCircuit: BrainCircuit,
  Image: ImageIcon,
  MessageSquare: MessageSquare,
};

export const AITheory = () => {
  const [activeChapterId, setActiveChapterId] = useState(aiTheoryChapters[0].id);
  const [activeSectionId, setActiveSectionId] = useState(aiTheoryChapters[0].sections[0].id);

  const activeChapter = aiTheoryChapters.find((c) => c.id === activeChapterId) || aiTheoryChapters[0];

  // 스크롤 동기화를 위한 observer는 생략하고 단순 클릭 기반 네비게이션 적용
  const handleNavClick = (chapterId, sectionId) => {
    setActiveChapterId(chapterId);
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 items-start">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 lg:sticky lg:top-24 shrink-0">
        <Card className="p-4 overflow-y-auto custom-scrollbar max-h-[75vh]">
          <div className="flex items-center gap-2 mb-6 px-2 text-primary">
            <BookOpen size={20} />
            <h2 className="font-bold text-lg">AI 이론 백과 목차</h2>
          </div>
          
          <nav className="space-y-6">
            {aiTheoryChapters.map((chapter) => {
              const Icon = iconMap[chapter.icon] || BookOpen;
              const isChapterActive = activeChapterId === chapter.id;
              
              return (
                <div key={chapter.id} className="space-y-2">
                  <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md font-bold text-sm transition-colors ${isChapterActive ? 'text-fuchsia-400 bg-fuchsia-500/10' : 'text-text hover:text-fuchsia-300'}`}>
                    <Icon size={16} />
                    {chapter.title}
                  </div>
                  
                  <ul className="pl-6 space-y-1 relative before:absolute before:left-3.5 before:top-0 before:bottom-0 before:w-px before:bg-border">
                    {chapter.sections.map((section) => {
                      const isSectionActive = activeSectionId === section.id;
                      return (
                        <li key={section.id}>
                          <button
                            onClick={() => handleNavClick(chapter.id, section.id)}
                            className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-all relative ${
                              isSectionActive
                                ? 'text-text font-semibold bg-surface border border-border shadow-sm before:absolute before:-left-2.5 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-fuchsia-500'
                                : 'text-textMuted hover:text-text hover:bg-surface/50'
                            }`}
                          >
                            {section.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </Card>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 space-y-12">
        {activeChapter.sections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-28">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                <ChevronRight size={18} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-text">{section.title}</h2>
            </div>
            
            <Card className="p-6 lg:p-8 bg-surface/50 border-border/60 shadow-none hover:border-fuchsia-500/30 transition-colors">
              <div className="prose prose-invert max-w-none prose-p:text-textMuted prose-p:leading-relaxed prose-p:text-[15px] prose-li:text-textMuted prose-li:text-[15px] prose-headings:text-text prose-strong:text-text prose-strong:font-bold prose-code:text-fuchsia-300 prose-code:bg-fuchsia-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                {/* 텍스트를 마크다운처럼 렌더링하기 위한 간단한 파서 적용 */}
                {section.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                    const items = paragraph.split('\n');
                    const isOrdered = paragraph.startsWith('1. ');
                    const ListTag = isOrdered ? 'ol' : 'ul';
                    return (
                      <ListTag key={idx} className={`space-y-3 my-5 ${isOrdered ? 'list-decimal pl-5' : 'list-disc pl-5'}`}>
                        {items.map((item, i) => {
                          // 리스트 마커 제거 (- 또는 숫자.)
                          const text = item.replace(/^(-|\d+\.)\s/, '');
                          
                          // 볼드체 처리 (**텍스트**)
                          const parts = text.split(/(\*\*.*?\*\*)/g);
                          
                          return (
                            <li key={i} className="pl-1">
                              {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={j} className="text-fuchsia-100">{part.slice(2, -2)}</strong>;
                                }
                                return <span key={j}>{part}</span>;
                              })}
                            </li>
                          );
                        })}
                      </ListTag>
                    );
                  }
                  
                  return (
                    <p key={idx} className="mb-4">
                      {paragraph.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j} className="text-fuchsia-100">{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('`') && part.endsWith('`')) {
                          return <code key={j} className="text-fuchsia-300 bg-fuchsia-500/10 px-1.5 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </Card>
          </article>
        ))}
      </main>
    </div>
  );
};
