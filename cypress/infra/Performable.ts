import Actor from "./Actor";

export interface PerformableContext {
  cy: Cypress.cy;
  actor: Actor;
}

export default interface Performable {
  performAs(context: PerformableContext): void;
}
