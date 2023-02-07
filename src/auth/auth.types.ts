export enum AuthProviders {
  GOOGLE = 'google',
  MAIL = 'mail',
}

export interface IJWTPayload {
  userId: string;
  roles: string[]; // TODO: Create real role enum with DBMS
  authProvider: AuthProviders;
}

export interface IAuthenticatedUser {
  userId: string;
  authProvider: AuthProviders;
  roles: string[];
}
