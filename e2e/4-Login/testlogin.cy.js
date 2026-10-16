describe('login', () => {
    beforeEach(()=> {
        cy.visit('https://practicetestautomation.com/practice-test-login/')
    })
    it('tc-01', () => {
        //cy.visit('https://practicetestautomation.com/practice-test-login/')
        cy.get('#username').type('student')
        cy.get('#password').type('Password123')
        cy.get('#submit').click()
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/logged-in-successfully/')
            expect(location.protocol).to.eq('https:')
        })
    })
    it('tc-02', () => {
        //cy.visit('https://practicetestautomation.com/practice-test-login/')
        cy.get('#username').type('incorrectUser')
        cy.get('#password').type('Password123')
        cy.get('#submit').click()
        cy.get('#error').contains('Your username is invalid!')
        cy.get('#error').should('have.text', 'Your username is invalid!')
    })
    it('tc-03', () => {
        //cy.visit('https://practicetestautomation.com/practice-test-login/')
        cy.get('#username').type('student')
        cy.get('#password').type('incorrectPassword')
        cy.get('#submit').click()
        cy.get('#error').contains('Your password is invalid!')
        cy.get('#error').should('have.text', 'Your password is invalid!')
    })
})