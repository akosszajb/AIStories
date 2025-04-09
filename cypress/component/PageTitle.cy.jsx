// cypress/component/PageTitle.cy.jsx
import React from "react";
import { mount } from "cypress/react";
import PageTitle from "../../client/src/Components/Common/PageTitle/PageTitle";

describe("PageTitle.cy.jsx", () => {
  it("should render the given title", () => {
    const testTitle = "Hello, this is just a testTitle!";
    mount(<PageTitle title={testTitle} />);
    cy.get("h2.welcometitle").should("contain.text", testTitle);
  });
});
