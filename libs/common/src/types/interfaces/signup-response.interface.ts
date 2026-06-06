export enum Role {
  DRIVER = 'driver',
  USER = 'user',
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignupResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}
