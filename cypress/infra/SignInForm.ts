import Fillable, { FillableHandlerContext } from "./Fillable";

interface SignInFormValues {
  username: string;
  password: string;
}

export default class SignInForm implements Fillable {
  private values: SignInFormValues | undefined = undefined;
  private shouldHitToSubmitButton = false;
  private shouldCheckTheRememberMeField = false;

  withValues(values: SignInFormValues): this {
    this.values = values;

    return this;
  }

  checksRememberMeField(): this {
    this.shouldCheckTheRememberMeField = true;

    return this;
  }

  thenHitsToSubmitButton(): this {
    this.shouldHitToSubmitButton = true;

    return this;
  }

  handle({ cy, actor }: FillableHandlerContext) {
    cy.log(`${actor.actorName} fills the sign in form`);

    if (this.values?.username) {
      cy.getBySel("signin-username").type(this.values.username);
    }

    if (this.values?.password) {
      cy.getBySel("signin-password").type(this.values.password);
    }

    if (this.shouldCheckTheRememberMeField) {
      cy.getBySel("signin-remember-me").find("input").check();
    }

    if (this.shouldHitToSubmitButton) {
      cy.log(`${actor.actorName} hits the submit button`);

      cy.getBySel("signin-submit").click();
    }
  }
}
