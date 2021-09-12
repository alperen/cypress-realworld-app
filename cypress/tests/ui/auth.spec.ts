import { User } from "../../../src/models";
import { isMobile } from "../../support/utils";
import Actor from "../../infra/Actor";
import Unauthenticated from "../../infra/Unauthenticated";
import Visit from "../../infra/Visit";
import Redirected from "../../infra/Redirected";
import SignIn from "../../infra/SignIn";
import Authenticated from "../../infra/Authenticated";
import Click from "../../infra/Click";
import Ensure from "../../infra/Ensure";
import Fill from "../../infra/Fill";
import SignUpForm from "../../infra/SignUpForm";

const apiGraphQL = `${Cypress.env("apiUrl")}/graphql`;

describe("User Sign-up and Login", function () {
  beforeEach(function () {
    cy.task("db:seed");

    cy.intercept("POST", "/users").as("signup");
    cy.intercept("POST", apiGraphQL, (req) => {
      const { body } = req;

      if (body.hasOwnProperty("operationName") && body.operationName === "CreateBankAccount") {
        req.alias = "gqlCreateBankAccountMutation";
      }
    });
  });

  it("should redirect unauthenticated user to signin page", function () {
    new Actor(cy)
      .named("Alperen")
      .is(new Unauthenticated())
      .attemptsTo(new Visit().to("personal page"))
      .should(new Redirected().to("sign in page"));
  });

  it("should redirect to the home page after login", function () {
    new Actor(cy)
      .named("Edgar Johns")
      .is(new Unauthenticated())
      .attemptsTo(
        new SignIn().withCredentials({
          username: "Katharina_Bernier",
          password: "s3cret",
        })
      )
      .should(new Redirected().to("home page"));
  });

  it("should remember a user for 30 days after login", function () {
    // new Actor(cy)
    //   .named("Edgar Johns")
    //   .is(new Unauthenticated())
    //   .attemptsTo(new SignIn().withAnyCredentials())
    //   .should(new HasTo().ACookie().ThatNamed("expiry"));

    // Logout User
    new Actor(cy)
      .named("Edgar Johns")
      .is(new Authenticated().withAnyCredentials())
      .attemptsTo(
        new Ensure().that(isMobile()).then(new Click().into("sidebar menu button")),
        new Click().into("sign out button")
      )
      .should(new Redirected().to("sign in page"));
  });

  it("should allow a visitor to sign-up, login, and logout", function () {
    const userInfo = {
      firstName: "Bob",
      lastName: "Ross",
      username: "PainterJoy90",
      password: "s3cret",
    };

    // Sign-up User
    new Actor(cy)
      .named(`${userInfo.firstName} ${userInfo.lastName}`)
      .is(new Unauthenticated())
      .attemptsTo(
        new Visit().to("home page"),
        new Click().into("sign up button"),
        new Fill().the(
          new SignUpForm()
            .withValues({
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              username: userInfo.username,
              password: userInfo.password,
            })
            .thenHitsSubmitButton()
        )
      );
    // cy.getBySel("signup-title").should("be.visible").and("contain", "Sign Up");
    cy.wait("@signup");

    // Login User
    new Actor(cy)
      .named(`${userInfo.firstName} ${userInfo.lastName}`)
      .is(new Unauthenticated())
      .attemptsTo(
        new SignIn().withCredentials({
          username: userInfo.username,
          password: userInfo.password,
        })
      );

    // Onboarding
    cy.getBySel("user-onboarding-dialog").should("be.visible");
    cy.getBySel("list-skeleton").should("not.exist");
    cy.getBySel("nav-top-notifications-count").should("exist");
    cy.visualSnapshot("User Onboarding Dialog");
    cy.getBySel("user-onboarding-next").click();

    cy.getBySel("user-onboarding-dialog-title").should("contain", "Create Bank Account");

    cy.getBySelLike("bankName-input").type("The Best Bank");
    cy.getBySelLike("accountNumber-input").type("123456789");
    cy.getBySelLike("routingNumber-input").type("987654321");
    cy.visualSnapshot("About to complete User Onboarding");
    cy.getBySelLike("submit").click();

    cy.wait("@gqlCreateBankAccountMutation");

    cy.getBySel("user-onboarding-dialog-title").should("contain", "Finished");
    cy.getBySel("user-onboarding-dialog-content").should("contain", "You're all set!");
    cy.visualSnapshot("Finished User Onboarding");
    cy.getBySel("user-onboarding-next").click();

    cy.getBySel("transaction-list").should("be.visible");
    cy.visualSnapshot("Transaction List is visible after User Onboarding");

    // Logout User
    if (isMobile()) {
      cy.getBySel("sidenav-toggle").click();
    }
    cy.getBySel("sidenav-signout").click();
    cy.location("pathname").should("eq", "/signin");
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should display login errors", function () {
    cy.visit("/");

    cy.getBySel("signin-username").type("User").find("input").clear().blur();
    cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");
    cy.visualSnapshot("Display Username is Required Error");

    cy.getBySel("signin-password").type("abc").find("input").blur();
    cy.get("#password-helper-text")
      .should("be.visible")
      .and("contain", "Password must contain at least 4 characters");
    cy.visualSnapshot("Display Password Error");

    cy.getBySel("signin-submit").should("be.disabled");
    cy.visualSnapshot("Sign In Submit Disabled");
  });

  it("should display signup errors", function () {
    cy.intercept("GET", "/signup");

    cy.visit("/signup");

    cy.getBySel("signup-first-name").type("First").find("input").clear().blur();
    cy.get("#firstName-helper-text").should("be.visible").and("contain", "First Name is required");

    cy.getBySel("signup-last-name").type("Last").find("input").clear().blur();
    cy.get("#lastName-helper-text").should("be.visible").and("contain", "Last Name is required");

    cy.getBySel("signup-username").type("User").find("input").clear().blur();
    cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");

    cy.getBySel("signup-password").type("password").find("input").clear().blur();
    cy.get("#password-helper-text").should("be.visible").and("contain", "Enter your password");

    cy.getBySel("signup-confirmPassword").type("DIFFERENT PASSWORD").find("input").blur();
    cy.get("#confirmPassword-helper-text")
      .should("be.visible")
      .and("contain", "Password does not match");
    cy.visualSnapshot("Display Sign Up Required Errors");

    cy.getBySel("signup-submit").should("be.disabled");
    cy.visualSnapshot("Sign Up Submit Disabled");
  });

  it("should error for an invalid user", function () {
    cy.login("invalidUserName", "invalidPa$$word");

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username and Password, Username or Password is Invalid");
  });

  it("should error for an invalid password for existing user", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "INVALID");
    });

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username, Username or Password is Invalid");
  });
});
