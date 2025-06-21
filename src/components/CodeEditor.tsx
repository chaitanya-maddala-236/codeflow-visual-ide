
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
}

export const CodeEditor = ({ code, onChange, language }: CodeEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full bg-slate-900 relative">
      <div className="absolute inset-0 flex">
        {/* Line Numbers */}
        <div className="bg-slate-900 text-slate-500 text-sm font-mono p-4 pr-2 border-r border-slate-700 select-none">
          {code.split('\n').map((_, index) => (
            <div key={index} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-slate-900 text-slate-100 font-mono text-sm p-4 resize-none border-none outline-none leading-6"
            style={{
              tabSize: 2,
              fontFamily: 'JetBrains Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          
          {/* Syntax highlighting overlay would go here in a real implementation */}
          <div className="absolute top-4 right-4">
            <div className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs">
              {language}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
