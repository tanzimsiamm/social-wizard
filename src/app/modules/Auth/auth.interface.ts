export interface IUserRegisterInput {
  email: string;
  password: string;
}

export interface IUserLoginInput {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  isPremium: boolean;
  subscriptionStatus: string;
  freeTrialStart?: Date;
  freeTrialEnd?: Date;
  createdAt: Date;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}
