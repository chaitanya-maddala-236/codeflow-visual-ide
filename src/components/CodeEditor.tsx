
import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
}

export const CodeEditor = ({ code, onChange, language }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Define custom theme
    monaco.editor.defineTheme('codestudio-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#cbd5e1',
        'editor.selectionBackground': '#334155',
        'editor.inactiveSelectionBackground': '#1e293b',
        'editorCursor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#1e293b',
      }
    });

    monaco.editor.defineTheme('codestudio-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1e293b',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#475569',
        'editor.selectionBackground': '#e2e8f0',
        'editor.inactiveSelectionBackground': '#f1f5f9',
        'editorCursor.foreground': '#0f172a',
        'editor.lineHighlightBackground': '#f8fafc',
      }
    });

    // Set the custom theme
    monaco.editor.setTheme('codestudio-dark');

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Trigger save functionality
      console.log('Save shortcut pressed');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      // Trigger compile functionality
      console.log('Compile shortcut pressed');
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  // Map common language names to Monaco language identifiers
  const getMonacoLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'xml': 'xml',
      'markdown': 'markdown',
      'sql': 'sql',
      'php': 'php',
      'go': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'kotlin': 'kotlin',
    };
    return languageMap[lang.toLowerCase()] || 'javascript';
  };

  return (
    <div className="h-full bg-slate-900 relative">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          theme: 'codestudio-dark',
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          minimap: { enabled: true },
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          lineHeight: 22,
          letterSpacing: 0.5,
          cursorBlinking: 'blink',
          cursorStyle: 'line',
          cursorWidth: 2,
          renderLineHighlight: 'line',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'mouseover',
          matchBrackets: 'always',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoIndent: 'advanced',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          snippetSuggestions: 'top',
          wordBasedSuggestions: true,
          parameterHints: { enabled: true },
          hover: { enabled: true },
          links: true,
          colorDecorators: true,
          contextmenu: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          selectionHighlight: true,
          occurrencesHighlight: true,
          codeLens: true,
          glyphMargin: true,
          renderWhitespace: 'selection',
          renderControlCharacters: false,
          renderIndentGuides: true,
          highlightActiveIndentGuide: true,
          bracketPairColorization: { enabled: true },
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-slate-900 text-slate-400">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p>Loading Editor...</p>
            </div>
          </div>
        }
      />
      
      {/* Language indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-md text-xs font-medium border border-slate-700">
          {language.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
