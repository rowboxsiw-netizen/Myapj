export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdBy: string | null | undefined;
  createdAt: string;
  expiresAt: string | null;
  permissions: string[];
  isActive: boolean;
}
