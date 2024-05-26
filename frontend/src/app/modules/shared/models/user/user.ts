export interface User {
  sub?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  address?: string;
  roles?: string[];
  loginPayload?: {
    accessToken: string;
    refreshToken: string;
  }
}

export interface UserResponse {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  address?: string;
}
