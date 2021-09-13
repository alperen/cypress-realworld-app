import Task from "./Task";
import Performable from "./Performable";

export default class Ensure {
  private condition = false;

  that(condition: boolean): this {
    this.condition = condition;

    return this;
  }

  then(task: Performable): Task {
    return new Task((ctx) => {
      if (this.condition) {
        task.performAs(ctx);
      }
    });
  }
}
