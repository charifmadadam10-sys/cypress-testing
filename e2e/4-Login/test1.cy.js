const testDatalogin = require("../../fixtures/login1.json")
describe("Login",()=>{
    beforeEach(()=>{
        cy.visit("https://practicetestautomation.com/practice-test-login/")
    })  
    it('tc-01',()=>{
    cy.login1(testDatalogin.username.positive,testDatalogin.password.positive)
    cy.location().should((location)=>{
        expect(location.pathname).to.eq("/logged-in-successfully/")
        expect(location.protocol).to.eq("https:")
    })
    
})
})