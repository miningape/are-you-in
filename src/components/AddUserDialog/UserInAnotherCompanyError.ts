export const USER_IN_ANOTHER_COMPANY_ERROR = "@USER_IN_ANOTHER_COMPANY_ERROR";

export class UserInAnotherCompanyError extends Error {
  constructor() {
    super(USER_IN_ANOTHER_COMPANY_ERROR);
  }
}
