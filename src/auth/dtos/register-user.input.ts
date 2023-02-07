import { AuthProviders } from '../auth.types';

export class RegisterUserInput {
  email!: string;
  authProvider!: AuthProviders;
  password?: string;
  providerId?: string;
}
