
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  X, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Trash2
} from 'lucide-react';

interface ConsoleMessage {
  type: 'info' | 'success' | 'warning' | 'error' | 'output' | 'system';
  message: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  output: ConsoleMessage[];
}

export const ConsolePanel = ({ output }: ConsolePanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'system':
        return <Terminal className="h-4 w-4 text-purple-400" />;
      default:
        return <ChevronRight className="h-4 w-4 text-slate-400" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-300';
      case 'warning':
        return 'text-amber-300';
      case 'error':
        return 'text-red-300';
      case 'info':
        return 'text-blue-300';
      case 'system':
        return 'text-purple-300';
      default:
        return 'text-slate-300';
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="h-full bg-slate-900 border-t border-slate-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Console
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-emerald-600 text-emerald-400">
              {output.filter(m => m.type === 'success').length} success
            </Badge>
            <Badge variant="outline" className="text-xs border-amber-600 text-amber-400">
              {output.filter(m => m.type === 'warning').length} warnings
            </Badge>
            <Badge variant="outline" className="text-xs border-red-600 text-red-400">
              {output.filter(m => m.type === 'error').length} errors
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Output Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-sm"
      >
        {output.map((msg, index) => (
          <div key={index} className="flex items-start gap-3 py-1 hover:bg-slate-800/50 rounded px-2 -mx-2">
            <div className="flex-shrink-0 mt-0.5">
              {getMessageIcon(msg.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`${getMessageColor(msg.type)} break-words`}>
                {msg.message}
              </div>
            </div>
            <div className="flex-shrink-0 text-xs text-slate-500">
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}
        
        {output.length === 0 && (
          <div className="text-slate-500 text-center py-8">
            Console output will appear here...
          </div>
        )}
      </div>

      {/* Command Input */}
      <div className="border-t border-slate-700 p-3">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-emerald-400" />
          <Input
            placeholder="Type a command..."
            className="flex-1 bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};
