export interface CreateUserDto {
  email: String;
  password: String;
  givenName: String;
  familyName: String;
  language: String;
  verified?: Boolean;
}
