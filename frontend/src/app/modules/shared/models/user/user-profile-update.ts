export interface PasswordUpdateRequest {
  password: string;
  confirmPassword: string;
}

export interface UserProfileRequest {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  group: string;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  address: string;
}
