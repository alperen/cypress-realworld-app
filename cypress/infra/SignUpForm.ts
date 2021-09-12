import Fillable, { FillableHandlerContext } from "./Fillable";

interface SignupFormValues {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export default class SignUpForm implements Fillable {
  private shouldHitSubmitButton = false;
  private values: Partial<SignupFormValues> | undefined = undefined;

  handle({ cy, actor }: FillableHandlerContext): void {
    cy.log(`${actor.actorName} attempts to fill sign up form`);

    if (this.values?.firstName) {
      cy.getBySel("signup-first-name").type(this.values.firstName);
    }

    if (this.values?.lastName) {
      cy.getBySel("signup-last-name").type(this.values.lastName);
    }

    if (this.values?.username) {
      cy.getBySel("signup-username").type(this.values.username);
    }

    if (this.values?.password) {
      cy.getBySel("signup-password").type(this.values.password);
      cy.getBySel("signup-confirmPassword").type(this.values.password);
    }

    if (this.shouldHitSubmitButton) {
      cy.log(`${actor.actorName} hits to sign up submit button`);

      cy.getBySel("signup-submit").click();
    }
  }

  withValues(values: Partial<SignupFormValues>): this {
    this.values = values;

    return this;
  }

  thenHitsSubmitButton(): this {
    this.shouldHitSubmitButton = true;

    return this;
  }
}
