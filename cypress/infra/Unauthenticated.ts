import Performable, { PerformableContext } from "./Performable";

export default class Unauthenticated implements Performable{
  performAs(context: PerformableContext) {
    return;
  }
}
