export type UserProfile = "researcher" | "marketer" | "student";

export type UserSettings = {
  name: string;
  profile: UserProfile;
  language: string;
};