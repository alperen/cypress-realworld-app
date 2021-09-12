import Task from "./Task";

type PossiblePage = "sign in page" | "home page";

export default class Redirected {
  to(page: PossiblePage): Task {
    return new Task(({ cy, actor }) => {
      cy.log(`${actor.actorName} checks his location is ${page}`);

      if (page === "sign in page") {
        cy.location("pathname").should("equal", "/signin");
      }

      if (page === "home page") {
        cy.location("pathname").should("equal", "/");
      }
    });
  }
}
