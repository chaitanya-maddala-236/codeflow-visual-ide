
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Code, FileText, GitBranch, Play, Eye, Users, Settings, Plus, Search, Folder, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [codeVisualization, setCodeVisualization] = useState(true);
  const [realtimeCompilation, setRealtimeCompilation] = useState(true);
  const [collaboration, setCollaboration] = useState(false);
  const [gitIntegration, setGitIntegration] = useState(true);

  const recentProjects = [
    { id: 1, name: 'React Dashboard', language: 'JavaScript', lastModified: '2 hours ago', status: 'active' },
    { id: 2, name: 'Python ML Model', language: 'Python', lastModified: '1 day ago', status: 'completed' },
    { id: 3, name: 'Java Web API', language: 'Java', lastModified: '3 days ago', status: 'in-progress' },
    { id: 4, name: 'C++ Algorithm', language: 'C++', lastModified: '1 week ago', status: 'draft' },
  ];

  const templates = [
    { name: 'React App', description: 'Modern React application with TypeScript', language: 'JavaScript', icon: Code },
    { name: 'Python Script', description: 'Data analysis and machine learning', language: 'Python', icon: FileText },
    { name: 'Java Project', description: 'Enterprise Java application', language: 'Java', icon: GitBranch },
    { name: 'C++ Program', description: 'High-performance C++ application', language: 'C++', icon: Play },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'completed': return 'bg-blue-500';
      case 'in-progress': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'JavaScript': return 'bg-yellow-500';
      case 'Python': return 'bg-green-500';
      case 'Java': return 'bg-orange-500';
      case 'C++': return 'bg-blue-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/lovable-uploads/3ae34102-7bfe-4f32-9b52-616c9fc3d230.png" 
                  alt="CodeStudio Logo" 
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CodeStudio</h1>
                <p className="text-sm text-slate-400">Visual Development Environment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Start
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Create a new project or explore templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => navigate('/ide')}
                    className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    <div className="text-center">
                      <Code className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">New Project</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 border-slate-600 text-slate-300 hover:bg-slate-700">
                    <div className="text-center">
                      <GitBranch className="h-6 w-6 mx-auto mb-1" />
                      <div className="text-sm font-medium">Import from Git</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Projects
                  </CardTitle>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <div 
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/50 cursor-pointer transition-colors"
                      onClick={() => navigate('/ide')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-600 rounded">
                          <Folder className="h-4 w-4 text-slate-300" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{project.name}</h4>
                          <p className="text-sm text-slate-400">{project.lastModified}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getLanguageColor(project.language)} text-white`}>
                          {project.language}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Feature Toggles */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Features</CardTitle>
                <CardDescription className="text-slate-400">
                  Toggle advanced development features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Eye className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm">Code Visualization</span>
                  </div>
                  <Switch 
                    checked={codeVisualization} 
                    onCheckedChange={setCodeVisualization}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Play className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Real-time Compilation</span>
                  </div>
                  <Switch 
                    checked={realtimeCompilation} 
                    onCheckedChange={setRealtimeCompilation}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">Collaboration</span>
                  </div>
                  <Switch 
                    checked={collaboration} 
                    onCheckedChange={setCollaboration}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-300">
                    <GitBranch className="h-5 w-5 text-orange-400" />
                    <span className="text-sm">Git Integration</span>
                  </div>
                  <Switch 
                    checked={gitIntegration} 
                    onCheckedChange={setGitIntegration}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Templates */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Templates</CardTitle>
                <CardDescription className="text-slate-400">
                  Start with a pre-configured project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => navigate('/ide')}
                  >
                    <div className="flex items-start gap-3">
                      <template.icon className="h-5 w-5 text-indigo-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{template.description}</p>
                        <Badge className={`${getLanguageColor(template.language)} text-white text-xs mt-2`}>
                          {template.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
