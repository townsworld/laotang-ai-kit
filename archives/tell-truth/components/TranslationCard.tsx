import React from 'react';
import { Copy } from 'lucide-react';

interface TranslationCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  colorClass: string;
  bgClass: string;
  delay: number;
}

const TranslationCard: React.FC<TranslationCardProps> = ({ title, icon, content, colorClass, bgClass, delay }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    // Remove markdown bold markers for copying
    const cleanText = content.replace(/\*\*/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse bold text
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className={`font-bold ${colorClass} bg-opacity-20 bg-white px-1 rounded mx-0.5`}>
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border border-slate-700 ${bgClass} p-6 shadow-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-900/50 ${colorClass}`}>
            {icon}
          </div>
          <h3 className={`text-xl font-bold ${colorClass}`}>{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-700/50"
          title="复制内容"
        >
          {copied ? <span className="text-green-400 text-xs font-bold">已复制</span> : <Copy size={18} />}
        </button>
      </div>
      
      <div className="text-slate-200 leading-relaxed text-lg tracking-wide whitespace-pre-wrap">
        {renderContent(content)}
      </div>

      {/* Decorative gradient blob */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${colorClass.replace('text-', 'bg-')}`}></div>
    </div>
  );
};

export default TranslationCard;