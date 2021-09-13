import Task from "./Task";

type SeeableTarget =
  | "user on boarding dialog"
  | "notification count"
  | "user on boarding dialog title"
  | "user on boarding dialog content";

export default class See {
  private target!: SeeableTarget;
  private query: string | undefined;

  the(target: SeeableTarget) {
    this.target = target;

    return this;
  }

  onTheScreen(): Task {
    return new Task(({ actor }) => {
      cy.log(`${actor.actorName} looks up the ${this.target} on the screen`);

      switch (this.target) {
        case "user on boarding dialog":
          cy.getBySel("user-onboarding-dialog").should("be.visible");
          break;
        case "notification count":
          cy.getBySel("nav-top-notifications-count").should("exist");
          break;
        case "user on boarding dialog title":
          cy.getBySel("user-onboarding-dialog-title").should("contain", this.query);
          break;
        case "user on boarding dialog content":
          cy.getBySel("user-onboarding-dialog-content").should("contain", this.query  );
          break;
      }
    });
  }

  as(query: string): this {
    this.query = query;

    return this;
  }
}
