import Task from "./Task";

type PossiblePage = "personal page" | "sign in page" | "home page";

export default class Visit {
  to(page: PossiblePage): Task {
    return new Task(({ cy, actor }) => {
      cy.log(`${actor.actorName} goes to ${page}`);

      if (page === "personal page") {
        cy.visit("/personal");
      }

      if (page === "sign in page") {
        cy.visit("/signin");
      }

      if (page === "home page") {
        cy.visit("/");
      }
    });
  }
}
