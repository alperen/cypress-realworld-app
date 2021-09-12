import Task from "./Task";
import Visit from "./Visit";
import Fill from "./Fill";
import SignInForm from "./SignInForm";

interface SignInFormCredentials {
  username: string;
  password: string;
}

export default class SignIn {
  withCredentials(credentials: SignInFormCredentials): Task {
    return new Task(({ actor }) => {
      actor.attemptsTo(
        new Visit().to("sign in page"),
        new Fill().the(
          new SignInForm()
            .withValues({
              username: credentials.username,
              password: credentials.password,
            })
            .checksRememberMeField()
            .thenHitsToSubmitButton()
        )
      );
    });
  }

  withAnyCredentials(): Task {
    return new Task(({ actor }) => {
      actor.attemptsTo(
        new Visit().to("sign in page"),
        new Fill().the(
          new SignInForm()
            .withValues({
              username: "Katharina_Bernier",
              password: "s3cret",
            })
            .checksRememberMeField()
            .thenHitsToSubmitButton()
        )
      );
    });
  }
}
