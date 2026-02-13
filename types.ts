
export enum ProjectStatus {
  VOTING = 'VOTING',
  LAUNCHED = 'LAUNCHED'
}

export interface Project {
  id: string;
  githubUrl: string;
  repoName: string;
  owner: string;
  description: string;
  summary: string;
  tags: string[];
  likes: number;
  stars: number;
  forks: number;
  status: ProjectStatus;
  authorWallet: string;
  createdAt: number;
  votedBy: string[];
  // New fields for Pump.fun integration
  tokenLaunched?: boolean;
  tokenMint?: string;
  tokenSymbol?: string;
}

export interface UserState {
  connected: boolean;
  publicKey: string | null;
  isAdmin?: boolean;
}
