require("cypress-plugin-tab")

describe("Auto correct", () => {
  it("Auto correction", () => {
    cy.visit("http://127.0.0.1:5500/")

    cy.get("#commandInput").type("g ").should("have.value", "g ").clear().should("have.value", "")
    cy.get("#commandInput").type("gi ").should("have.value", "gi ").clear().should("have.value", "")
    cy.get("#commandInput").type("giv ").should("have.value", "giv ").clear().should("have.value", "")
    cy.get("#commandInput").type("give ").should("have.value", "give ").clear().should("have.value", "")
    cy.get("#commandInput").type("give k ").should("have.value", "give k ").clear().should("have.value", "")
    cy.get("#commandInput").type("give ka ").should("have.value", "give ka ").clear().should("have.value", "")
    cy.get("#commandInput").type("give us").tab().should("have.value", "give user1").clear().should("have.value", "")
    cy.get("#commandInput").type("give u").tab().should("have.value", "give user1").clear().should("have.value", "")

    cy.get("#commandInput").type("g").tab().type(" us").tab().type(" ap").tab().type(" 2234234").tab()
      .should("have.value", "give user1 apple 2234234").clear()
      .should("have.value", "")

    cy.get("#commandInput").type("g").tab().type(" us").tab().type(" ap").tab().type(" 2234234").tab()
      .should("have.value", "give user1 apple 2234234")
      .type(Cypress._.repeat("{leftArrow}", 14))

    Cypress._.times(4, () => {
      cy.get("#commandInput").type("{backspace}").invoke("val").should('have.length', 24)
      cy.get(`#commandHighlight [data-index="3"]`).should("have.css", "color", "rgb(253, 224, 71)") // Not error
      cy.get(`#commandHighlight [data-index="1"]`).should("have.css", "color", "rgb(248, 113, 113)") // Error
    })

    cy.get("#commandInput").clear().should("have.value", "")
    cy.get("#commandInput").type("give u a{leftArrow}{leftArrow}").tab().type("{rightArrow}{rightArrow}").tab().should('have.value', "give user1 apple")
    cy.get("#commandInput").type("g").tab().type(" us").tab().type(" ap").tab().type(" 2234234").tab()
  })
})

describe("Auto correct bugeja v2", () => {
  it("Auto correction", () => {
    cy.visit("http://127.0.0.1:5500/")

    cy.get("#commandInput").type("give user2").type(Cypress._.repeat("{leftArrow}", 6)).type("{backspace}").type(" ")
      .should("have.value", "giv  user2").clear().should("have.value", "")

    cy.get("#commandInput").type("give user2").type(Cypress._.repeat("{leftArrow}", 6)).type("{backspace}").type("{rightArrow}{backspace}")
      .should("have.value", "givuser2").clear().should("have.value", "");

    cy.get("#commandInput").type("give us a").type("{leftArrow}{leftArrow}").type("{ctrl+ }")
      .should("have.value", "give us    a").clear().should("have.value", "");

    cy.get("#commandInput").type("give us a").type("{leftArrow}{leftArrow}").type("{esc}")
      .should("have.value", "give us a").clear().should("have.value", "");

    cy.get("#commandInput").type("g u").type("{leftArrow}{leftArrow}").type(Cypress._.repeat("{ctrl+ }", 8)).type("{esc}")
      .should("have.value", "g u").clear().should("have.value", "");

    cy.get("#commandInput").type("gi");
    cy.get("#tooltip").invoke("text").should("have.length.above", 5);
    cy.get("#commandInput").clear().should("have.value", "");

    cy.get("#commandInput").type("gi").type(Cypress._.repeat("{ctrl+ }", 8));
    cy.get("#tooltip").invoke("text").should("have.length.above", 5);
    cy.get("#commandInput").clear().should("have.value", "");

    // cy.get("#commandInput").type("give kassu11").type('{shift}', { release: false }).type(Cypress._.repeat("{leftArrow}", 10)).type(Cypress._.repeat("{rightArrow}", 5)).type("_")
    //   .should("have.value", "give kas_");
  });
});