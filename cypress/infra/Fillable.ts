import Actor from "./Actor";

export interface FillableHandlerContext {
  cy: Cypress.cy;
  actor: Actor;
}

export default interface Fillable {
  handle(ctx: FillableHandlerContext): void;
}
