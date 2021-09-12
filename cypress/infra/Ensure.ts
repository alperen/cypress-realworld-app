import Task from "./Task";

export default class Ensure {
  private condition = false;

  that(condition: boolean): this {
    this.condition = condition;

    return this;
  }

  then(task: Task): Task {
    return new Task((ctx) => {
      if (this.condition) {
        task.performAs(ctx);
      }
    });
  }
}
