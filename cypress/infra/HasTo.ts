import Task from "./Task";

class CookieAssertions {
  ThatNamed(cookieName: string): Task {
    return new Task(({ cy, actor }) => {
      cy.log(`${actor.actorName} searchs for ${cookieName} on his cookies`);

      cy.getCookie("connect.sid").should("have.property", cookieName);
    });
  }
}

export default class HasTo {
  ACookie() {
    return new CookieAssertions();
  }
}
