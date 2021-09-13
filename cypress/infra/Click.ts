import Performable, { PerformableContext } from "./Performable";

type ClickTarget =
  | "sign out button"
  | "sidebar menu button"
  | "sign up button"
  | "user onboarding modal next button";

export default class Click implements Performable {
  private target!: ClickTarget;

  performAs({ actor, cy }: PerformableContext): void {
    cy.log(`${actor.actorName} clicks to ${this.target}`);

    if (this.target === "sign out button") {
      cy.getBySel("sidenav-signout").click();
    }

    if (this.target === "sidebar menu button") {
      cy.getBySel("sidenav-toggle").click();
    }

    if (this.target === "sign up button") {
      cy.getBySel("signup").click();
    }

    if (this.target === "user onboarding modal next button") {
      cy.getBySel("user-onboarding-next").click();
    }
  }

  into(target: ClickTarget): this {
    this.target = target;

    return this;
  }
}
