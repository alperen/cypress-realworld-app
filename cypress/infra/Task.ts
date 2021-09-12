import Actor from "./Actor";
import Performable, { PerformableContext } from "./Performable";

interface TaskHandlerContext {
  cy: Cypress.cy;
  actor: Actor;
}

type TaskHandler = (ctx: TaskHandlerContext) => void;

export default class Task implements Performable {
  private readonly handler: TaskHandler;

  constructor(handler: TaskHandler) {
    this.handler = handler;
  }

  public performAs(ctx: PerformableContext): void {
    this.handler(ctx);
  }
}
