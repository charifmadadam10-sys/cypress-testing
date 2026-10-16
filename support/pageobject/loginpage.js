class LoginPage {

    get loginSuccessText() {
        return cy.get('.post-title')
    }
    get invalidTextlogin(){
        return cy.get('#error')
    }
    verifyLoginSuccessText() {
        this.loginSuccessText.should('have.text', 'Logged In Successfully')
    }
    invalidusernamelogin() {
        this.invalidTextlogin.should('have.text', 'Your username is invalid!')
    }

    invalidpasswordlogin() {
        this.invalidTextlogin.should('have.text', 'Your password is invalid!')
    }

}
export default LoginPage