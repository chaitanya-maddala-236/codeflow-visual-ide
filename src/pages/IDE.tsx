
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { 
  Code, 
  Play, 
  Square, 
  Eye, 
  FileText, 
  Folder, 
  FolderOpen, 
  GitBranch, 
  Settings, 
  Terminal,
  Maximize2,
  Minimize2,
  X,
  Save,
  Upload,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '@/components/CodeEditor';
import { FileExplorer } from '@/components/FileExplorer';
import { VisualizationPanel } from '@/components/VisualizationPanel';
import { ConsolePanel } from '@/components/ConsolePanel';

const IDE = () => {
  const navigate = useNavigate();
  const [activeFile, setActiveFile] = useState('main.js');
  const [isRunning, setIsRunning] = useState(false);
  const [showVisualization, setShowVisualization] = useState(true);
  const [code, setCode] = useState(`function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function main() {
    const result = fibonacci(10);
    console.log("Fibonacci(10) =", result);
    
    // Array processing example
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map(x => x * 2);
    console.log("Doubled:", doubled);
    
    return result;
}

main();`);

  const [openFiles, setOpenFiles] = useState([
    { name: 'main.js', path: '/src/main.js', modified: true },
    { name: 'utils.js', path: '/src/utils.js', modified: false },
  ]);

  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'info', message: 'CodeStudio IDE initialized', timestamp: new Date() },
    { type: 'system', message: 'Ready to compile and visualize your code', timestamp: new Date() },
  ]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, 
      { type: 'info', message: 'Compiling code...', timestamp: new Date() }
    ]);

    // Simulate compilation
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, 
        { type: 'success', message: 'Compilation successful', timestamp: new Date() },
        { type: 'output', message: 'Fibonacci(10) = 55', timestamp: new Date() },
        { type: 'output', message: 'Doubled: [2, 4, 6, 8, 10]', timestamp: new Date() },
        { type: 'info', message: 'Execution completed in 0.12s', timestamp: new Date() },
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const handleStopCode = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [...prev, 
      { type: 'warning', message: 'Execution stopped by user', timestamp: new Date() }
    ]);
  };

  const closeFile = (fileName: string) => {
    setOpenFiles(prev => prev.filter(file => file.name !== fileName));
    if (activeFile === fileName && openFiles.length > 1) {
      const remainingFiles = openFiles.filter(file => file.name !== fileName);
      setActiveFile(remainingFiles[0].name);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Code className="h-4 w-4 mr-2" />
              CodeStudio
            </Button>
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleRunCode}
                disabled={isRunning}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
              {isRunning && (
                <Button 
                  onClick={handleStopCode}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowVisualization(!showVisualization)}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showVisualization ? 'Hide' : 'Show'} Visualization
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main IDE Layout */}
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer />
          </ResizablePanel>
          
          <ResizableHandle className="bg-slate-700 hover:bg-slate-600" />
          
          {/* Editor Area */}
          <ResizablePanel defaultSize={showVisualization ? 50 : 80}>
            <div className="h-full flex flex-col">
              {/* File Tabs */}
              <div className="bg-slate-800 border-b border-slate-700 px-2 py-1">
                <div className="flex items-center gap-1">
                  {openFiles.map((file) => (
                    <div 
                      key={file.name}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                        activeFile === file.name 
                          ? 'bg-slate-700 text-white' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setActiveFile(file.name)}
                    >
                      <FileText className="h-3 w-3" />
                      {file.name}
                      {file.modified && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-slate-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFile(file.name);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1">
                <CodeEditor 
                  code={code}
                  onChange={setCode}
                  language="javascript"
                />
              </div>
            </div>
          </ResizablePanel>

          {showVisualization && (
            <>
              <ResizableHandle className="bg-slate-700 hover:bg-slate-600" />
              
              {/* Visualization Panel */}
              <ResizablePanel defaultSize={30} minSize={25}>
                <VisualizationPanel code={code} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Bottom Console */}
      <div className="h-48 border-t border-slate-700">
        <ConsolePanel output={consoleOutput} />
      </div>
    </div>
  );
};

export default IDE;
