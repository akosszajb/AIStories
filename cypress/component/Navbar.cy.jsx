// cypress/component/Navbar.cy.jsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";
import Navbar from "../../client/src/Components/Common/Navbar/Navbar";

describe("Navbar.cy.jsx", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should show Register and Login when logged out", () => {
    mount(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    cy.contains("Register").should("exist");
    cy.contains("Login").should("exist");
    cy.contains("Logout").should("not.exist");
    cy.contains("AI Stories").should("exist");
  });

  it("should show Logout and profile when logged in", () => {
    localStorage.setItem("token", "dummy_token");

    mount(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    cy.contains("Logout").should("exist");
    cy.contains("Profile").should("exist");
    cy.contains("Register").should("not.exist");
    cy.contains("Login").should("not.exist");
  });
});
