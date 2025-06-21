
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  cursor?: {
    line: number;
    column: number;
  };
}

export interface CollaborationSession {
  id: string;
  projectId: string;
  collaborators: Collaborator[];
  createdAt: Date;
}

class CollaborationService {
  private static instance: CollaborationService;
  private session: CollaborationSession | null = null;
  private isActive = false;
  private collaborators: Collaborator[] = [];

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  public async startSession(projectId: string): Promise<CollaborationSession> {
    // Simulate starting collaboration session
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.session = {
      id: Math.random().toString(36).substring(2, 10),
      projectId,
      collaborators: [
        {
          id: 'current-user',
          name: 'You',
          email: 'user@example.com',
          avatar: '',
          isOnline: true
        }
      ],
      createdAt: new Date()
    };
    
    this.isActive = true;
    return this.session;
  }

  public async inviteCollaborator(email: string): Promise<void> {
    if (!this.session) {
      throw new Error('No active collaboration session');
    }
    
    // Simulate invitation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Add mock collaborator
    const newCollaborator: Collaborator = {
      id: Math.random().toString(36).substring(2, 10),
      name: email.split('@')[0],
      email,
      avatar: '',
      isOnline: Math.random() > 0.5,
      cursor: {
        line: Math.floor(Math.random() * 20) + 1,
        column: Math.floor(Math.random() * 50) + 1
      }
    };
    
    this.session.collaborators.push(newCollaborator);
    this.collaborators.push(newCollaborator);
  }

  public getActiveSession(): CollaborationSession | null {
    return this.session;
  }

  public getCollaborators(): Collaborator[] {
    return this.collaborators;
  }

  public isSessionActive(): boolean {
    return this.isActive;
  }

  public async endSession(): Promise<void> {
    this.session = null;
    this.isActive = false;
    this.collaborators = [];
  }

  public updateCursorPosition(line: number, column: number): void {
    // Simulate cursor position update for current user
    if (this.session) {
      const currentUser = this.session.collaborators.find(c => c.id === 'current-user');
      if (currentUser) {
        currentUser.cursor = { line, column };
      }
    }
  }
}

export default CollaborationService;
