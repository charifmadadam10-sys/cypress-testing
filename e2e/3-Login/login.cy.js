describe('SauceDemo Testing' , () => {
    it('TC01-open website', () => {
        //testcase1
        cy.visit('https://www.saucedemo.com')
        cy.get('[data-test="username"] ').should('be.visible')
        cy.get('[data-test="password"] ').should('be.visible')
        cy.get('[data-test="login-button"] ').should('be.visible')

    })
  })