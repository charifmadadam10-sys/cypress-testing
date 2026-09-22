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
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
        cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')

    
    })
    it('TC02-remove items from cart', () => {
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
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
        cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')
        cy.get('[data-test="shopping-cart-link"]').click()
        cy.get('[data-test="remove-sauce-labs-backpack"]').click()
        cy.contains('Your Cart').should('be.visible')
        cy.contains('Sauce Labs Backpack').should('not.exist')
    })
    it('TC03-checkout', () => {
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
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
        cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')
        cy.get('[data-test="shopping-cart-link"]').click()
        cy.get('[data-test="remove-sauce-labs-backpack"]').click()
        cy.contains('Your Cart').should('be.visible')
        cy.contains('Sauce Labs Backpack').should('not.exist')
        cy.get('[data-test="checkout"]').click()
        cy.get('[data-test="firstName"]').type('John')
        cy.get('[data-test="lastName"]').type('Doe')
        cy.get('[data-test="postalCode"]').type('12345')
        cy.get('[data-test="continue"]').click()
        cy.get('[data-test="finish"]').click()
        cy.contains('Thank you for your order!').should('be.visible')

                
    })
    it('TC04-sort products by price low to high', () => {
        //สำหรับตรวจสอบว่าราคาสินค้าเรียงจากน้อยไปมาก //การบ้าน
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
        cy.get('[data-test="product-sort-container"]').select('Price (low to high)')
        cy.get('.inventory_item_price').then(($prices) => {
            const priceValues = $prices.map((index, html) => parseFloat(html.innerText.replace('$', ''))).get();
            const sortedPrices = [...priceValues].sort((a, b) => a - b);
            expect(priceValues).to.deep.equal(sortedPrices);
        })
        
    })
    it('TC05-sort products by price high to low', () => {
        //สำหรับตรวจสอบว่าราคาสินค้าเรียงจากมากไปน้อย //การบ้าน
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
        cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
        cy.get('.inventory_item_price').then(($prices) => {
            const priceValues = $prices.map((index, html) => parseFloat(html.innerText.replace('$', ''))).get();
            const sortedPrices = [...priceValues].sort((a, b) => b - a);
            expect(priceValues).to.deep.equal(sortedPrices);
        })
    })
    it('TC06-verify checkout item total', () => {
        //total price ของสินค้าต้องตรงกับราคาที่แสดงใน checkout //การบ้าน
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
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
        cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')
        cy.get('[data-test="shopping-cart-link"]').click()
        cy.get('[data-test="checkout"]').click()
        cy.get('[data-test="firstName"]').type('John')
        cy.get('[data-test="lastName"]').type('Doe')
        cy.get('[data-test="postalCode"]').type('12345')
        cy.get('[data-test="continue"]').click()
        cy.get('.summary_subtotal_label').then(($subtotal) => {
            const subtotalText = $subtotal.text();
            const subtotalValue = parseFloat(subtotalText.replace('Item total: $', ''));
            cy.get('.inventory_item_price').then(($prices) => {
                const priceValues = $prices.map((index, html) => parseFloat(html.innerText.replace('$', ''))).get();
                const calculatedSubtotal = priceValues.reduce((acc, price) => acc + price, 0);
                expect(subtotalValue).to.equal(calculatedSubtotal);
            })
        })
    })
})