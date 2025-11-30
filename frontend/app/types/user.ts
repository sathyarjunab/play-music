export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  friends: Partial<UserType>[];
  requestsSent: Partial<UserType>[];
  requestsReceived: Partial<UserType>[];
  accepted: Partial<UserType>[];
  rejected: Partial<UserType>[];
};
