import Task from "./Task";

type ClickTarget = "sign out button" | "sidebar menu button" | "sign up button";

export default class Click {
  into(target: ClickTarget): Task {
    return new Task(({ cy, actor }) => {
      cy.log(`${actor.actorName} clicks to ${target}`);

      if (target === "sign out button") {
        cy.getBySel("sidenav-signout").click();
      }

      if (target === "sidebar menu button") {
        cy.getBySel("sidenav-toggle").click();
      }

      if (target === "sign up button") {
        cy.getBySel("signup").click();
      }
    });
  }
}
