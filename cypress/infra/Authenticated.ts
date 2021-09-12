import Performable, { PerformableContext } from "./Performable";

interface AuthenticationCredentials {
  username: string;
  password: string;
}

export default class Authenticated implements Performable {
  private credentials: AuthenticationCredentials | undefined = undefined;

  withAnyCredentials(): this {
    this.credentials = {
      username: "Katharina_Bernier",
      password: "s3cret",
    };

    return this;
  }

  withCredentials(credentials: AuthenticationCredentials): this {
    this.credentials = credentials;

    return this;
  }

  performAs(context: PerformableContext) {
    if (!this.credentials) {
      throw new Error('Please specify a credentials or use "withAnyCredentials"');
    }

    cy.loginByXstate(this.credentials.username, this.credentials.password);
  }
}
