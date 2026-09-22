describe('SauceDemo Testing' , () => {
    it('TC01-open website', () => {
        //testcase1
        cy.visit('https://www.saucedemo.com')
        cy.get('[data-test="username"] ').should('be.visible')
        cy.get('[data-test="password"] ').should('be.visible')
        cy.get('[data-test="login-button"] ').should('be.visible')
        cy.wait(2000)
        cy.get('[data-test="username"] ').type('standard_user')
        cy.wait(2000)
        cy.get('[data-test="password"] ').type('secret_sauce')
        cy.wait(2000)
        cy.get('[data-test="login-button"] ').click()
        cy.url().should('include', '/inventory.html')
        //cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')


    })

    it('TC02-wrong username/Password', () => {
        //testcase2  //ถ้าใส่ .only จะรันเฉพาะ test case นี้ 
        //test username ที่ไม่ถูกต้อง
        cy.visit('https://www.saucedemo.com')
        cy.get('[data-test="username"] ').type('Standard')
        cy.wait(2000)
        cy.get('[data-test="password"] ').type('wrong_password')
        cy.wait(2000)
        cy.get('[data-test="login-button"] ').click()
        cy.get('[data-test="error"] ').should('be.visible')
        cy.get('[data-test="error"]').should('contain','do not match')
   

    })
    it('TC03-No username/Password', () => {
        //testcase3 //ไม่ถูกทั้ง username และ password
        cy.visit('https://www.saucedemo.com')
        cy.get('[data-test="username"] ').type('standard')
        cy.wait(2000)
        cy.get('[data-test="password"] ').type('secret')
        cy.wait(2000)
        cy.get('[data-test="login-button"] ').click()
        cy.get('[data-test="error"] ').should('be.visible')
        cy.get('[data-test="error"]').should('contain','do not match')
    })
    it('TC04-No username', () => {
        //testcase4
        cy.visit('https://www.saucedemo.com')
        cy.get('[data-test="password"] ').type('secret_sauce')
        cy.wait(2000)
        cy.get('[data-test="login-button"] ').click()
        cy.get('[data-test="error"] ').should('be.visible')
        cy.get('[data-test="error"]').should('contain','Username is required')

    })
    it('TC05-No password', () => {
        //testcase5
        cy.visit('https://www.saucedemo.com')
        cy.get('[data-test="username"] ').type('standard_user')
        cy.wait(2000)
        cy.get('[data-test="login-button"] ').click()
        cy.get('[data-test="error"] ').should('be.visible')
        cy.get('[data-test="error"]').should('contain','Password is required')
    })
    
  })