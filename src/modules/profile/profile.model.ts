export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  googleId?: string;
  avatar?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  password: string;
  confirmPassword: string;

}