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
    cy.get("#commandInput").type("give ka").tab().should("have.value", "give kassu11").clear().should("have.value", "")
    cy.get("#commandInput").type("give ka").tab().should("have.value", "give kassu11").clear().should("have.value", "")

    cy.get("#commandInput").type("g").tab().type(" ka").tab().type(" ap").tab().type(" 2234234").tab()
      .should("have.value", "give kassu11 apple 2234234").clear()
      .should("have.value", "")

    cy.get("#commandInput").type("g").tab().type(" ka").tab().type(" ap").tab().type(" 2234234").tab()
      .should("have.value", "give kassu11 apple 2234234")
      .type(Cypress._.repeat("{leftArrow}", 14))

    Cypress._.times(6, () => {
      cy.get("#commandInput").type("{backspace}").invoke("val").should('have.length', 26)
      cy.get(`[data-index="3"]`).should("have.css", "color", "rgb(253, 224, 71)") // Not error
      cy.get(`[data-index="1"]`).should("have.css", "color", "rgb(248, 113, 113)") // Error
    })

    cy.get("#commandInput").type(Cypress._.repeat("{leftArrow}", 2)).invoke("val").should('have.length', 20)
    cy.get("#commandInput").type("{rightArrow}{rightArrow}").tab().should('have.value', "give kassu11 apple 2234234")
  })
})

describe("Auto correct bugeja v2", () => {
  it("Auto correction", () => {
    cy.visit("http://127.0.0.1:5500/")

    cy.get("#commandInput").type("give kassu11").type(Cypress._.repeat("{leftArrow}", 8)).type("{backspace}").type(" ")
      .should("have.value", "giv  kassu11").clear().should("have.value", "")

    cy.get("#commandInput").type("give kassu11").type(Cypress._.repeat("{leftArrow}", 8)).type("{backspace}").type("{rightArrow}{backspace}")
      .should("have.value", "givkassu11").clear().should("have.value", "");

    cy.get("#commandInput").type("give ka a").type("{leftArrow}{leftArrow}").type("{ctrl+ }")
      .should("have.value", "give ka      a").clear().should("have.value", "");

    cy.get("#commandInput").type("give ka a").type("{leftArrow}{leftArrow}").type("{esc}")
      .should("have.value", "give ka a").clear().should("have.value", "");

    cy.get("#commandInput").type("g k").type("{leftArrow}{leftArrow}").type(Cypress._.repeat("{ctrl+ }", 8)).type("{esc}")
      .should("have.value", "g k").clear().should("have.value", "");

    cy.get("#commandInput").type("gi");
    cy.get("#tooltip").invoke("text").should("have.length.above", 5);
    cy.get("#commandInput").clear().should("have.value", "");

    cy.get("#commandInput").type("gi").type(Cypress._.repeat("{ctrl+ }", 8));
    cy.get("#tooltip").invoke("text").should("have.length.above", 5);
    cy.get("#commandInput").clear().should("have.value", "");

    cy.get("#commandInput").type("give kassu11").type('{shift}', { release: false }).type(Cypress._.repeat("{leftArrow}", 10)).type(Cypress._.repeat("{rightArrow}", 5)).type("_")
      .should("have.value", "give kas_");
  });
});