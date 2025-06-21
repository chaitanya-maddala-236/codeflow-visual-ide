import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
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
  Download,
  Users,
  GitCommit,
  GitPullRequest
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '@/components/CodeEditor';
import { FileExplorer } from '@/components/FileExplorer';
import { VisualizationPanel } from '@/components/VisualizationPanel';
import { ConsolePanel } from '@/components/ConsolePanel';
import CompilerService, { SUPPORTED_LANGUAGES } from '@/services/CompilerService';
import GitService from '@/services/GitService';
import CollaborationService from '@/services/CollaborationService';

interface ConsoleMessage {
  type: 'info' | 'success' | 'warning' | 'error' | 'output' | 'system';
  message: string;
  timestamp: Date;
}

const IDE = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeFile, setActiveFile] = useState('main.js');
  const [isRunning, setIsRunning] = useState(false);
  const [showVisualization, setShowVisualization] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].template);

  // Feature toggles
  const [codeVisualization, setCodeVisualization] = useState(true);
  const [realtimeCompilation, setRealtimeCompilation] = useState(true);
  const [collaboration, setCollaboration] = useState(false);
  const [gitIntegration, setGitIntegration] = useState(true);

  // Services
  const compilerService = CompilerService.getInstance();
  const gitService = GitService.getInstance();
  const collaborationService = CollaborationService.getInstance();

  const [openFiles, setOpenFiles] = useState([
    { name: 'main.js', path: '/src/main.js', modified: true },
    { name: 'utils.js', path: '/src/utils.js', modified: false },
  ]);

  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>([
    { type: 'info', message: 'CodeStudio IDE initialized', timestamp: new Date() },
    { type: 'system', message: 'Ready to compile and visualize your code', timestamp: new Date() },
  ]);

  // Real-time compilation
  useEffect(() => {
    if (realtimeCompilation && code.trim()) {
      const timer = setTimeout(async () => {
        try {
          const errors = await compilerService.validateSyntax(code, language);
          if (errors.length > 0) {
            setConsoleOutput(prev => [...prev, 
              ...errors.map(error => ({ 
                type: 'error' as const, 
                message: error, 
                timestamp: new Date() 
              }))
            ]);
          }
        } catch (error) {
          console.error('Real-time compilation error:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [code, language, realtimeCompilation]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, 
      { type: 'info', message: 'Compiling code...', timestamp: new Date() }
    ]);

    try {
      const result = await compilerService.compileCode(code, language);
      
      if (result.success) {
        setConsoleOutput(prev => [...prev, 
          { type: 'success', message: 'Compilation successful', timestamp: new Date() },
          { type: 'output', message: result.output, timestamp: new Date() },
          { type: 'info', message: `Execution completed in ${result.executionTime}ms`, timestamp: new Date() },
        ]);
      } else {
        setConsoleOutput(prev => [...prev, 
          { type: 'error', message: 'Compilation failed', timestamp: new Date() },
          ...result.errors.map(error => ({ 
            type: 'error' as const, 
            message: error, 
            timestamp: new Date() 
          }))
        ]);
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, 
        { type: 'error', message: 'Compilation error: ' + (error instanceof Error ? error.message : 'Unknown error'), timestamp: new Date() }
      ]);
    }
    
    setIsRunning(false);
  };

  const handleStopCode = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [...prev, 
      { type: 'warning', message: 'Execution stopped by user', timestamp: new Date() }
    ]);
  };

  const handleGitCommit = async () => {
    if (!gitIntegration) {
      toast({
        title: "Git Integration Disabled",
        description: "Enable Git integration to use version control features.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!gitService.isRepositoryConnected()) {
        await gitService.connectRepository('https://github.com/user/codestudio-project.git');
        toast({
          title: "Repository Connected",
          description: "Successfully connected to Git repository.",
        });
      }

      const commitHash = await gitService.commit('Auto-save changes', [activeFile]);
      setConsoleOutput(prev => [...prev, 
        { type: 'success', message: `Committed changes: ${commitHash}`, timestamp: new Date() }
      ]);
      
      toast({
        title: "Changes Committed",
        description: `Commit ${commitHash} created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Git Error",
        description: error instanceof Error ? error.message : "Failed to commit changes",
        variant: "destructive"
      });
    }
  };

  const handleCollaboration = async () => {
    if (!collaboration) {
      toast({
        title: "Collaboration Disabled",
        description: "Enable collaboration to work with team members.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!collaborationService.isSessionActive()) {
        await collaborationService.startSession('current-project');
        toast({
          title: "Collaboration Started",
          description: "Collaboration session is now active.",
        });
      }

      await collaborationService.inviteCollaborator('teammate@example.com');
      setConsoleOutput(prev => [...prev, 
        { type: 'info', message: 'Collaborator invited to session', timestamp: new Date() }
      ]);
    } catch (error) {
      toast({
        title: "Collaboration Error",
        description: error instanceof Error ? error.message : "Failed to start collaboration",
        variant: "destructive"
      });
    }
  };

  const closeFile = (fileName: string) => {
    setOpenFiles(prev => prev.filter(file => file.name !== fileName));
    if (activeFile === fileName && openFiles.length > 1) {
      const remainingFiles = openFiles.filter(file => file.name !== fileName);
      setActiveFile(remainingFiles[0].name);
    }
  };

  const changeLanguage = (newLanguage: string) => {
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === newLanguage);
    if (langConfig) {
      setLanguage(newLanguage);
      setCode(langConfig.template);
      setActiveFile(`main${langConfig.fileExtension}`);
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
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/3ae34102-7bfe-4f32-9b52-616c9fc3d230.png" 
                  alt="CodeStudio" 
                  className="h-6 w-6 rounded-full"
                />
                CodeStudio
              </div>
            </Button>
            
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            
            <select 
              value={language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-slate-700 text-slate-200 px-3 py-1 rounded text-sm border border-slate-600"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            
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
            {/* Feature Toggles */}
            <div className="flex items-center gap-4 mr-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={codeVisualization} 
                  onCheckedChange={(checked) => {
                    setCodeVisualization(checked);
                    setShowVisualization(checked);
                  }}
                />
                <span className="text-xs text-slate-400">Visualization</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={realtimeCompilation} 
                  onCheckedChange={setRealtimeCompilation}
                />
                <span className="text-xs text-slate-400">Real-time</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={collaboration} 
                  onCheckedChange={setCollaboration}
                />
                <span className="text-xs text-slate-400">Collab</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={gitIntegration} 
                  onCheckedChange={setGitIntegration}
                />
                <span className="text-xs text-slate-400">Git</span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleGitCommit}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <GitCommit className="h-4 w-4 mr-2" />
              Commit
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCollaboration}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Collaborate
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
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
                  language={language}
                />
              </div>
            </div>
          </ResizablePanel>

          {showVisualization && codeVisualization && (
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
