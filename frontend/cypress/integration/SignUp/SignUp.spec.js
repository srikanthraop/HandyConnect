import { startMirage } from "../../mirage/devServer"

describe("SignUp page", function () {
    let server

    beforeEach(() => {
        server = startMirage()
        cy.visit('/signup')
    })

    afterEach(() => {
        server.shutdown()
    })

    it("Verify all the fields", () => {
        cy.get('#firstNameId').should('exist')
        cy.get('#lastNameId').should('exist')
        cy.get('#phoneId').should('exist')
        cy.get('#cityId').should('exist')
        cy.get('#emailId').should('exist')
        cy.get('#passwordId').should('exist')
        cy.get('#rePasswordId').should('exist')
        cy.get('#signup-button').should('exist')
    })

    it("Verify SignUp required fields", () => {
        cy.get('#firstNameId').type('FName')
        cy.get('#signup-button').click()
        cy.get(':nth-child(7) > .invalid-feedback').should('exist')
    })

    it("Verify SignUp API completion and redirected to Homepage", () => {
        cy.wait(500)
        cy.get('#firstNameId').type('fName');
        cy.get("#firstNameId").should('have.value', 'fName')
        cy.get('#lastNameId').type('sName');
        cy.get("#lastNameId").should('have.value', 'sName')
        cy.get('#phoneId').type('1234567890');
        cy.get("#phoneId").should('have.value', '1234567890')
        cy.get('#cityId').select('Tampa');
        cy.get("#cityId").should('have.value', 'Tampa')
        cy.get('#emailId').type('a@b.c');
        cy.get("#emailId").should('have.value', 'a@b.c')
        cy.get('#passwordId').type('12345678');
        cy.get("#passwordId").should('have.value', '12345678')
        cy.get('#rePasswordId').type('12345678');
        cy.get("#rePasswordId").should('have.value', '12345678')

        cy.get('#signup-button').click();
        cy.url().should('eq', 'http://localhost:3000/')
        cy.get('#dashboardContainerId').should('exist')
    })
})