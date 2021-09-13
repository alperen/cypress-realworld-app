import Task from "./Task";
import Performable, { PerformableContext } from "./Performable";

export default class Actor {
  private readonly cy: Cypress.cy;
  public actorName: string = "";

  constructor(cy: Cypress.cy) {
    this.cy = cy;
  }

  public named(actorName: string): this {
    this.actorName = actorName;

    return this;
  }

  public is(isObj: Performable): this {
    isObj.performAs({
      cy: this.cy,
      actor: this,
    });

    return this;
  }

  attemptsTo(...tasks: Performable[]): this {
    tasks.forEach((task) =>
      task.performAs({
        cy: this.cy,
        actor: this,
      })
    );

    return this;
  }

  should(...assertiveTasks: Task[]): this {
    assertiveTasks.forEach((assertiveTask) =>
      assertiveTask.performAs({
        cy: this.cy,
        actor: this,
      })
    );

    return this;
  }
}
