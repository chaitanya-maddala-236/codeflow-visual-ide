
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  GitBranch, 
  Activity, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Maximize2
} from 'lucide-react';

interface VisualizationPanelProps {
  code: string;
}

export const VisualizationPanel = ({ code }: VisualizationPanelProps) => {
  const [activeTab, setActiveTab] = useState('flowchart');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Parse code to generate visualization data
  const generateFlowchartData = (code: string) => {
    const functions = code.match(/function\s+(\w+)/g) || [];
    const variables = code.match(/(?:const|let|var)\s+(\w+)/g) || [];
    const loops = code.match(/for\s*\(|while\s*\(/g) || [];
    const conditionals = code.match(/if\s*\(/g) || [];

    return {
      functions: functions.map(f => f.replace('function ', '')),
      variables: variables.map(v => v.replace(/(?:const|let|var)\s+/, '')),
      complexity: loops.length + conditionals.length,
      totalNodes: functions.length + variables.length + loops.length + conditionals.length
    };
  };

  const flowchartData = generateFlowchartData(code);

  const FlowchartVisualization = () => (
    <div className="relative h-full bg-slate-900 rounded border border-slate-700 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Start node */}
        <rect x="180" y="20" width="60" height="30" rx="15" fill="#10B981" />
        <text x="210" y="38" textAnchor="middle" fill="white" fontSize="12">Start</text>
        
        {/* Function nodes */}
        <rect x="160" y="80" width="100" height="40" rx="5" fill="#6366F1" />
        <text x="210" y="95" textAnchor="middle" fill="white" fontSize="10">fibonacci(n)</text>
        <text x="210" y="108" textAnchor="middle" fill="white" fontSize="8">recursive</text>
        
        {/* Decision diamond */}
        <polygon points="210,140 240,160 210,180 180,160" fill="#F59E0B" />
        <text x="210" y="165" textAnchor="middle" fill="white" fontSize="9">n ≤ 1?</text>
        
        {/* Process rectangles */}
        <rect x="90" y="200" width="80" height="30" rx="5" fill="#3B82F6" />
        <text x="130" y="218" textAnchor="middle" fill="white" fontSize="10">return n</text>
        
        <rect x="250" y="200" width="120" height="30" rx="5" fill="#3B82F6" />
        <text x="310" y="215" textAnchor="middle" fill="white" fontSize="9">fib(n-1) + fib(n-2)</text>
        
        {/* End node */}
        <rect x="180" y="260" width="60" height="30" rx="15" fill="#EF4444" />
        <text x="210" y="278" textAnchor="middle" fill="white" fontSize="12">End</text>
        
        {/* Arrows */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
          </marker>
        </defs>
        
        <line x1="210" y1="50" x2="210" y2="80" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="210" y1="120" x2="210" y2="140" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="180" y1="160" x2="130" y2="200" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="240" y1="160" x2="310" y2="200" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="130" y1="230" x2="190" y2="260" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="310" y1="230" x2="220" y2="260" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Labels */}
        <text x="150" y="185" fill="#10B981" fontSize="8">Yes</text>
        <text x="270" y="185" fill="#EF4444" fontSize="8">No</text>
      </svg>
      
      {/* Overlay stats */}
      <div className="absolute top-4 left-4 space-y-2">
        <Badge className="bg-slate-700 text-slate-200">
          Nodes: {flowchartData.totalNodes}
        </Badge>
        <Badge className="bg-slate-700 text-slate-200">
          Complexity: {flowchartData.complexity}
        </Badge>
      </div>
    </div>
  );

  const DependencyGraph = () => (
    <div className="relative h-full bg-slate-900 rounded border border-slate-700 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Function nodes */}
        <circle cx="100" cy="80" r="30" fill="#6366F1" />
        <text x="100" y="85" textAnchor="middle" fill="white" fontSize="10">main()</text>
        
        <circle cx="250" cy="120" r="30" fill="#10B981" />
        <text x="250" y="125" textAnchor="middle" fill="white" fontSize="10">fibonacci()</text>
        
        <circle cx="350" cy="80" r="25" fill="#F59E0B" />
        <text x="350" y="85" textAnchor="middle" fill="white" fontSize="9">console.log</text>
        
        <circle cx="300" cy="200" r="25" fill="#EF4444" />
        <text x="300" y="205" textAnchor="middle" fill="white" fontSize="9">map()</text>
        
        {/* Dependencies */}
        <line x1="130" y1="90" x2="220" y2="110" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="125" y1="70" x2="325" y2="70" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="120" y1="100" x2="275" y2="185" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Self-reference for recursion */}
        <path d="M 280 120 Q 300 90 280 100" stroke="#64748B" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
      </svg>
      
      <div className="absolute top-4 left-4 space-y-2">
        <Badge className="bg-emerald-600 text-white">
          Functions: {flowchartData.functions.length}
        </Badge>
        <Badge className="bg-blue-600 text-white">
          Variables: {flowchartData.variables.length}
        </Badge>
      </div>
    </div>
  );

  const DataFlow = () => (
    <div className="relative h-full bg-slate-900 rounded border border-slate-700 overflow-hidden p-4">
      <div className="space-y-4">
        <div className="text-sm text-slate-300 font-medium">Variable Flow Analysis</div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm text-white">n → fibonacci(n)</div>
              <div className="text-xs text-slate-400">Parameter passing</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm text-white">result ← fibonacci(10)</div>
              <div className="text-xs text-slate-400">Return value assignment</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm text-white">numbers → map(x => x * 2)</div>
              <div className="text-xs text-slate-400">Array transformation</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm text-white">doubled ← map result</div>
              <div className="text-xs text-slate-400">Final assignment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Code Visualization
          </h3>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => setZoomLevel(100)}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-slate-400">
          Zoom: {zoomLevel}%
        </div>
      </div>

      {/* Visualization Content */}
      <div className="flex-1 p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="flowchart" className="text-xs">
              <GitBranch className="h-3 w-3 mr-1" />
              Flowchart
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Dependencies
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Data Flow
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-3 h-[calc(100%-3rem)]" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
            <TabsContent value="flowchart" className="h-full mt-0">
              <FlowchartVisualization />
            </TabsContent>
            
            <TabsContent value="dependencies" className="h-full mt-0">
              <DependencyGraph />
            </TabsContent>
            
            <TabsContent value="dataflow" className="h-full mt-0">
              <DataFlow />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
