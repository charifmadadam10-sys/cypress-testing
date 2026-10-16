const testDatalogin = require("../../fixtures/login1.json")
import LoginPage from "../../support/pageobject/loginpage"

const lpn = new LoginPage()

describe("Login", () => {

    beforeEach(() => {
        cy.visit("https://practicetestautomation.com/practice-test-login/")
    })

    it("tc-01", () => {
        cy.login1(
            testDatalogin.username.positive,
            testDatalogin.password.positive
        )

        lpn.verifyLoginSuccessText()
    })

    it("tc-02", () => {
        cy.login1(
            testDatalogin.username.negative,
            testDatalogin.password.positive
        )

        lpn.invalidusernamelogin()
    })

    it("tc-03", () => {
        cy.login1(
            testDatalogin.username.positive,
            testDatalogin.password.negative
        )

        lpn.invalidpasswordlogin()
    })

})