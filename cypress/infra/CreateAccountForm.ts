import Fillable, { FillableHandlerContext } from "./Fillable";

interface CreateAccountFormValues {
  routingNumber: string;
  bankName: string;
  accountNumber: string;
}

export default class CreateAccountForm implements Fillable {
  private values!: Partial<CreateAccountFormValues>;
  private shouldHitSubmitButton!: boolean;

  withValues(values: Partial<CreateAccountFormValues>): this {
    this.values = values;

    return this;
  }

  thenHitsToSubmitButton(): this {
    this.shouldHitSubmitButton = true;
    return this;
  }

  handle({ actor, cy }: FillableHandlerContext): void {
    if (this.values.bankName) {
      cy.getBySelLike("bankName-input").type(this.values.bankName);
    }

    if (this.values.accountNumber) {
      cy.getBySelLike("accountNumber-input").type(this.values.accountNumber);
    }

    if (this.values.routingNumber) {
      cy.getBySelLike("routingNumber-input").type(this.values.routingNumber);
    }

    if (this.shouldHitSubmitButton) {
      cy.getBySelLike("submit").click();
    }
  }
}
