
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Search, 
  Plus, 
  MoreHorizontal,
  Code,
  Image,
  Settings
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean;
}

export const FileExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        { name: 'main.js', type: 'file' },
        { name: 'utils.js', type: 'file' },
        { name: 'config.json', type: 'file' },
        {
          name: 'components',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'Header.js', type: 'file' },
            { name: 'Footer.js', type: 'file' },
          ]
        }
      ]
    },
    {
      name: 'assets',
      type: 'folder',
      expanded: false,
      children: [
        { name: 'logo.png', type: 'file' },
        { name: 'styles.css', type: 'file' },
      ]
    },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]);

  const toggleFolder = (path: string[]) => {
    const updateTree = (nodes: FileNode[], currentPath: string[]): FileNode[] => {
      return nodes.map(node => {
        if (currentPath.length === 1 && node.name === currentPath[0]) {
          return { ...node, expanded: !node.expanded };
        } else if (currentPath.length > 1 && node.name === currentPath[0] && node.children) {
          return {
            ...node,
            children: updateTree(node.children, currentPath.slice(1))
          };
        }
        return node;
      });
    };

    setFileTree(updateTree(fileTree, path));
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'folder') {
      return Folder;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return Code;
      case 'json':
        return Settings;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return Image;
      default:
        return FileText;
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0, path: string[] = []) => {
    return nodes.map((node, index) => {
      const currentPath = [...path, node.name];
      const Icon = node.type === 'folder' && node.expanded ? FolderOpen : getFileIcon(node.name, node.type);
      
      return (
        <div key={index}>
          <div 
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-700/50 rounded transition-colors ${
              node.type === 'file' ? 'text-slate-300' : 'text-slate-200'
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(currentPath);
              }
            }}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{node.name}</span>
          </div>
          
          {node.type === 'folder' && node.expanded && node.children && (
            <div>
              {renderFileTree(node.children, depth + 1, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-200">Explorer</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="h-3 w-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search files..."
            className="h-7 pl-7 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {renderFileTree(fileTree)}
        </div>
      </div>

      {/* Status */}
      <div className="p-2 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          {fileTree.length} items
        </div>
      </div>
    </div>
  );
};
