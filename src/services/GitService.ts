
export interface GitRepository {
  name: string;
  url: string;
  branch: string;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    timestamp: Date;
  };
}

export interface GitStatus {
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
}

class GitService {
  private static instance: GitService;
  private repository: GitRepository | null = null;
  private isConnected = false;

  public static getInstance(): GitService {
    if (!GitService.instance) {
      GitService.instance = new GitService();
    }
    return GitService.instance;
  }

  public async connectRepository(url: string): Promise<GitRepository> {
    // Simulate connecting to repository
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.repository = {
      name: this.extractRepoName(url),
      url,
      branch: 'main',
      lastCommit: {
        hash: 'a1b2c3d',
        message: 'Initial commit',
        author: 'Developer',
        timestamp: new Date()
      }
    };
    
    this.isConnected = true;
    return this.repository;
  }

  public async getStatus(): Promise<GitStatus> {
    if (!this.isConnected) {
      throw new Error('Not connected to any repository');
    }
    
    // Simulate git status
    return {
      modified: ['src/main.js', 'src/utils.js'],
      added: [],
      deleted: [],
      untracked: ['src/newFile.js']
    };
  }

  public async commit(message: string, files: string[]): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Not connected to any repository');
    }
    
    // Simulate commit
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const commitHash = Math.random().toString(36).substring(2, 8);
    
    if (this.repository) {
      this.repository.lastCommit = {
        hash: commitHash,
        message,
        author: 'Current User',
        timestamp: new Date()
      };
    }
    
    return commitHash;
  }

  public async push(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to any repository');
    }
    
    // Simulate push
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  public async pull(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to any repository');
    }
    
    // Simulate pull
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  public getRepository(): GitRepository | null {
    return this.repository;
  }

  public isRepositoryConnected(): boolean {
    return this.isConnected;
  }

  private extractRepoName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1].replace('.git', '');
  }
}

export default GitService;
