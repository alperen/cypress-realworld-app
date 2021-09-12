import Task from "./Task";
import Fillable from "./Fillable";

export default class Fill {
  public the(fillable: Fillable): Task {
    return new Task((ctx) => {
      fillable.handle(ctx);
    });
  }
}
