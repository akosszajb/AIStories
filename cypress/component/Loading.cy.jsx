// cypress/component/Loading.cy.jsx
import React from "react";
import { mount } from "cypress/react";
import Loading from "../../client/src/Components/Common/Loading/Loading.jsx";

describe("Loading.cy.jsx", () => {
  it("should render the loading spinner", () => {
    mount(<Loading />);
    cy.get('[data-testid="loading-spinner"]').should("exist");
    cy.get(".Loading").should("exist");
  });
});
