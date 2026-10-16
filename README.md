# SauceDemo Testing with Cypress

เอกสารสรุปสำหรับอ่านทบทวน: เทสเว็บ [SauceDemo](https://www.saucedemo.com) ด้วย Cypress
ครอบคลุม 3 ส่วน:
- **ส่วน A** Login SauceDemo (5 เคส)
- **ส่วน B** Shopping Flow SauceDemo (6 เคส: ใส่ตะกร้า, ลบ, checkout, sort ราคา, ตรวจยอดรวม)
- **ส่วน C** Login ของ [Practice Test Automation](https://practicetestautomation.com/practice-test-login/) (3 เคส) เขียน 2 แบบ คือเขียนตรงๆ กับแบบ Page Object + Fixture + Custom Command (ดูหัวข้อ 11)

---

## สารบัญ

1. [ภาพรวมโปรเจกต์](#1-ภาพรวมโปรเจกต์)
2. [การติดตั้ง](#2-การติดตั้ง)
3. [โครงสร้างโปรเจกต์](#3-โครงสร้างโปรเจกต์)
4. [คำสั่ง Cypress ที่ต้องจำ](#4-คำสั่ง-cypress-ที่ต้องจำ)
5. [Selector และข้อมูลทดสอบที่ต้องจำ](#5-selector-และข้อมูลทดสอบที่ต้องจำ)
6. [ส่วน A: เทส Login พร้อมอธิบาย](#6-ส่วน-a-เทส-login-พร้อมอธิบาย)
7. [ส่วน B: เทส Shopping Flow พร้อมอธิบาย](#7-ส่วน-b-เทส-shopping-flow-พร้อมอธิบาย)
8. [คำสั่งรันเทสใน Terminal](#8-คำสั่งรันเทสใน-terminal)
9. [จุดที่ควรปรับปรุง (Best Practices)](#9-จุดที่ควรปรับปรุง-best-practices)
10. [โค้ดเวอร์ชันปรับปรุงแล้ว](#10-โค้ดเวอร์ชันปรับปรุงแล้ว)
11. [ส่วน C: Practice Test Automation (Page Object + Fixture)](#11-ส่วน-c-practice-test-automation-page-object--fixture)

---

## 1. ภาพรวมโปรเจกต์

| หัวข้อ | รายละเอียด |
|---|---|
| เว็บที่ทดสอบ | https://www.saucedemo.com |
| เครื่องมือ | Cypress (JavaScript) |
| ไฟล์เทส A | `saucedemo-login.cy.js` (Login 5 เคส) |
| ไฟล์เทส B | `saucedemo-shop.cy.js` (Shopping 6 เคส) |
| ไฟล์เทส C | `login-plain.cy.js` และ `login-pom.cy.js` (Login เว็บ practicetestautomation.com 3 เคส เขียน 2 แบบ) |

### ส่วน A: Login

| รหัส | สิ่งที่ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| TC01 | Login ด้วยข้อมูลถูกต้อง | เข้า `/inventory.html` |
| TC02 | username ผิด + password ผิด | error `do not match` |
| TC03 | กรอกไม่ครบทั้งคู่ | error `do not match` |
| TC04 | ไม่กรอก username | error `Username is required` |
| TC05 | ไม่กรอก password | error `Password is required` |

### ส่วน B: Shopping Flow

| รหัส | สิ่งที่ทดสอบ | ผลที่คาดหวัง |
|---|---|---|
| TC01 | Login แล้วเพิ่มสินค้า 2 ชิ้น | badge ตะกร้าขึ้น 1 แล้ว 2 |
| TC02 | เพิ่มสินค้า 2 ชิ้น แล้วลบ Backpack ในหน้าตะกร้า | ไม่เห็น Backpack ในตะกร้า |
| TC03 | Checkout ครบขั้นตอน | เห็น `Thank you for your order!` |
| TC04 | Sort ราคาน้อยไปมาก | ราคาเรียงจากน้อยไปมาก |
| TC05 | Sort ราคามากไปน้อย | ราคาเรียงจากมากไปน้อย |
| TC06 | ตรวจยอดรวมหน้า Checkout Overview | Item total = ผลรวมราคาสินค้า |

---

## 2. การติดตั้ง

ต้องมี [Node.js](https://nodejs.org) ก่อน (ตรวจด้วย `node -v`)

```bash
mkdir saucedemo-cypress
cd saucedemo-cypress
npm init -y
npm install cypress --save-dev
npx cypress open        # เปิดครั้งแรก จะสร้างโครงสร้างโฟลเดอร์ให้
```

---

## 3. โครงสร้างโปรเจกต์

```
saucedemo-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── saucedemo-login.cy.js   <- เทส Login
│   │   ├── saucedemo-shop.cy.js    <- เทส Shopping Flow
│   │   └── practice/               <- ต้องอยู่ลึก 1 ชั้น เพราะโค้ดใช้ "../../"
│   │       ├── login-plain.cy.js   <- ส่วน C แบบเขียนตรงๆ
│   │       └── login-pom.cy.js     <- ส่วน C แบบ Page Object
│   ├── fixtures/                   <- ข้อมูลทดสอบ (json) เช่น login1.json
│   ├── screenshots/                <- ภาพแคปเมื่อเทส fail (สร้างอัตโนมัติ)
│   ├── videos/                     <- วิดีโอการรัน (สร้างอัตโนมัติ)
│   └── support/
│       ├── commands.js             <- คำสั่งที่เขียนเอง เช่น cy.login(), cy.login1()
│       └── pageobject/
│           └── loginpage.js        <- คลาส LoginPage (Page Object)
├── cypress.config.js
├── package.json
└── README.md
```

> ไฟล์เทสต้องลงท้ายด้วย `.cy.js` และอยู่ใน `cypress/e2e/`

---

## 4. คำสั่ง Cypress ที่ต้องจำ

### โครงสร้างเทส

| คำสั่ง | หน้าที่ |
|---|---|
| `describe('ชื่อ', () => {})` | จัดกลุ่มเทส (Test Suite) |
| `it('ชื่อ', () => {})` | เทสเคส 1 อัน |
| `it.only(...)` | รันเฉพาะเทสเคสนี้ |
| `it.skip(...)` | ข้ามเทสเคสนี้ |
| `beforeEach(() => {})` | รันก่อน **ทุก** เทสเคส |
| `before(() => {})` | รันครั้งเดียวก่อนเริ่มทั้งกลุ่ม |
| `afterEach(() => {})` | รันหลังทุกเทสเคส |

### Action (สั่งให้ทำ)

| คำสั่ง | หน้าที่ |
|---|---|
| `cy.visit(url)` | เปิดเว็บ |
| `cy.get(selector)` | ค้นหา element ด้วย selector |
| `cy.contains('ข้อความ')` | ค้นหา element จากข้อความที่แสดง |
| `.type('text')` | พิมพ์ข้อความ |
| `.clear()` | ล้างข้อความในช่อง |
| `.click()` | คลิก |
| `.select('ตัวเลือก')` | เลือกค่าใน dropdown (`<select>`) |
| `cy.wait(ms)` | หยุดรอ (ไม่แนะนำ) |
| `cy.url()` | ดึง URL ปัจจุบัน |

### Assertion (ตรวจผล)

| คำสั่ง | ความหมาย |
|---|---|
| `.should('be.visible')` | มองเห็นบนหน้าจอ |
| `.should('exist')` | มี element อยู่ใน DOM |
| `.should('not.exist')` | **ไม่มี** element นี้อยู่ใน DOM |
| `.should('contain', 'text')` | มีข้อความนี้อยู่ข้างใน |
| `.should('have.text', 'text')` | ข้อความตรงเป๊ะ |
| `.should('have.value', 'x')` | ค่าในช่อง input เท่ากับ x |
| `cy.url().should('include', 'x')` | URL มีคำว่า x |
| `cy.url().should('eq', 'url')` | URL ตรงกันทั้งหมด |
| `.and(...)` | ต่อ assertion เพิ่ม |
| `expect(a).to.equal(b)` | a เท่ากับ b (ใช้ใน `.then()`) |
| `expect(a).to.deep.equal(b)` | array/object ทั้งก้อนเท่ากัน |

### คำสั่งที่ใช้ดึงค่ามาคำนวณ (สำคัญสำหรับเทสส่วน B)

| คำสั่ง | หน้าที่ |
|---|---|
| `.then(($el) => {...})` | เอา element ที่หาเจอมาทำงานต่อด้วยโค้ด JS |
| `$prices.map((i, el) => ...).get()` | วนทุก element แล้วแปลงเป็น array ธรรมดา (jQuery map) |
| `html.innerText` | ข้อความที่แสดงของ element |
| `.replace('$', '')` | ตัดสัญลักษณ์ `$` ออก |
| `parseFloat('29.99')` | แปลงข้อความเป็นเลขทศนิยม |
| `[...arr].sort((a, b) => a - b)` | copy array แล้วเรียงน้อยไปมาก |
| `[...arr].sort((a, b) => b - a)` | copy array แล้วเรียงมากไปน้อย |
| `arr.reduce((acc, p) => acc + p, 0)` | รวมค่าทั้งหมดใน array |

---

## 5. Selector และข้อมูลทดสอบที่ต้องจำ

### Selector หน้า Login

```javascript
'[data-test="username"]'      // ช่องกรอก username
'[data-test="password"]'      // ช่องกรอก password
'[data-test="login-button"]'  // ปุ่ม Login
'[data-test="error"]'         // กล่อง error สีแดง
```

### Selector หน้าสินค้า / ตะกร้า / Checkout

```javascript
'[data-test="add-to-cart-sauce-labs-backpack"]'    // ปุ่มเพิ่ม Backpack
'[data-test="add-to-cart-sauce-labs-bike-light"]'  // ปุ่มเพิ่ม Bike Light
'[data-test="shopping-cart-badge"]'                // ตัวเลขบนไอคอนตะกร้า
'[data-test="shopping-cart-link"]'                 // ไอคอนตะกร้า (คลิกเพื่อเข้าหน้าตะกร้า)
'[data-test="remove-sauce-labs-backpack"]'         // ปุ่มลบ Backpack ออกจากตะกร้า
'[data-test="checkout"]'                           // ปุ่ม Checkout
'[data-test="firstName"]'                          // ช่องชื่อ
'[data-test="lastName"]'                           // ช่องนามสกุล
'[data-test="postalCode"]'                         // ช่องรหัสไปรษณีย์
'[data-test="continue"]'                           // ปุ่ม Continue
'[data-test="finish"]'                             // ปุ่ม Finish
'[data-test="product-sort-container"]'             // dropdown เรียงสินค้า
```

### Selector แบบ class (ไม่ใช่ data-test)

```javascript
'.inventory_item_price'     // ราคาสินค้าแต่ละชิ้น (ใช้ทั้งหน้าสินค้าและหน้า Checkout Overview)
'.summary_subtotal_label'   // ข้อความ "Item total: $xx.xx" ในหน้า Checkout Overview
```

> pattern ของปุ่มเพิ่ม/ลบ: `add-to-cart-` และ `remove-` ตามด้วยชื่อสินค้าเป็นตัวพิมพ์เล็กคั่นด้วย `-`

### ตัวเลือกใน dropdown เรียงสินค้า (ใช้กับ `.select()`)

| ข้อความที่เลือก | ความหมาย |
|---|---|
| `Price (low to high)` | ราคาน้อยไปมาก |
| `Price (high to low)` | ราคามากไปน้อย |
| `Name (A to Z)` | ชื่อ A-Z |
| `Name (Z to A)` | ชื่อ Z-A |

### ข้อมูลทดสอบ

| รายการ | ค่า |
|---|---|
| Username ที่ถูกต้อง | `standard_user` |
| Password ที่ถูกต้อง | `secret_sauce` |
| ข้อมูล checkout | `John` / `Doe` / `12345` |
| ราคา Backpack | $29.99 |
| ราคา Bike Light | $9.99 |
| URL หลัง login | `/inventory.html` |

### ข้อความที่ใช้ตรวจ

| กรณี | ข้อความ |
|---|---|
| ข้อมูล login ผิด | `Username and password do not match any user in this service` |
| ไม่กรอก username | `Username is required` |
| ไม่กรอก password | `Password is required` |
| หัวหน้าตะกร้า | `Your Cart` |
| สั่งซื้อสำเร็จ | `Thank you for your order!` |

---

## 6. ส่วน A: เทส Login พร้อมอธิบาย

### โค้ด

```javascript
describe('SauceDemo Login Testing', () => {

  it('TC01-open website', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').should('be.visible')
    cy.get('[data-test="password"]').should('be.visible')
    cy.get('[data-test="login-button"]').should('be.visible')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory.html')
  })

  it('TC02-wrong username/Password', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('Standard')
    cy.get('[data-test="password"]').type('wrong_password')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'do not match')
  })

  it('TC03-Wrong username/Password (2)', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('standard')
    cy.get('[data-test="password"]').type('secret')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'do not match')
  })

  it('TC04-No username', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'Username is required')
  })

  it('TC05-No password', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'Password is required')
  })

})
```

(ตัด `cy.wait(2000)` และช่องว่างท้าย selector ออกแล้ว ดูเหตุผลในหัวข้อ 9)

### อธิบายทีละเทสเคส

**TC01 Login สำเร็จ (Happy Path)**

| ขั้นตอน | โค้ด | ความหมาย |
|---|---|---|
| 1 | `cy.visit(...)` | เปิดหน้า Login |
| 2 | `.should('be.visible')` x3 | ตรวจว่าช่อง username, password และปุ่ม login แสดงอยู่ |
| 3 | `.type(...)` x2 | กรอก username และ password ที่ถูกต้อง |
| 4 | `.click()` | กดปุ่ม Login |
| 5 | `cy.url().should('include', '/inventory.html')` | ตรวจว่าเข้าหน้าสินค้าแล้ว = login สำเร็จ |

`include` = URL มีข้อความนี้อยู่, `eq` = URL ต้องตรงทั้งหมด (เข้มงวดกว่า)

**TC02 Username และ Password ผิด**: `Standard` (S ใหญ่) ใช้ไม่ได้เพราะ username แยกตัวพิมพ์เล็ก/ใหญ่ ตรวจว่า error แสดงและมีคำว่า `do not match`

**TC03 กรอกไม่ครบทั้งคู่**: ใช้ `standard` และ `secret` ผลที่คาดหวังเหมือน TC02 (ชื่อเทสเดิมเขียนว่า "No username/Password" ซึ่งไม่ตรง เพราะจริงๆ คือกรอกผิด ไม่ใช่ไม่กรอก)

**TC04 ไม่กรอก username**: กรอกแค่ password แล้วกด Login คาดหวัง `Username is required`

**TC05 ไม่กรอก password**: กรอกแค่ username แล้วกด Login คาดหวัง `Password is required`

---

## 7. ส่วน B: เทส Shopping Flow พร้อมอธิบาย

ทุกเทสในส่วนนี้ต้อง **Login ก่อน** (ในไฟล์ต้นฉบับ copy โค้ด login ซ้ำทุกเทส) จึงแนะนำให้ย้ายไปไว้ใน `beforeEach` หรือ custom command ดูหัวข้อ 10

### TC01: เพิ่มสินค้าลงตะกร้า

```javascript
cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
cy.get('[data-test="shopping-cart-badge"]').should('contain', '1')
cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
cy.get('[data-test="shopping-cart-badge"]').should('contain', '2')
```

| บรรทัด | ความหมาย |
|---|---|
| คลิก add-to-cart ของ Backpack | เพิ่มสินค้าชิ้นแรก |
| badge ต้องมี `1` | ตัวเลขบนไอคอนตะกร้าเป็น 1 |
| คลิก add-to-cart ของ Bike Light | เพิ่มสินค้าชิ้นที่สอง |
| badge ต้องมี `2` | ตัวเลขเปลี่ยนเป็น 2 |

> ชื่อเทส "open website" ไม่ตรงกับสิ่งที่ทดสอบจริง (คือ login + add to cart)

### TC02: ลบสินค้าออกจากตะกร้า

```javascript
cy.get('[data-test="shopping-cart-link"]').click()                 // เข้าหน้าตะกร้า
cy.get('[data-test="remove-sauce-labs-backpack"]').click()         // ลบ Backpack
cy.contains('Your Cart').should('be.visible')                      // ยังอยู่หน้าตะกร้า
cy.contains('Sauce Labs Backpack').should('not.exist')             // Backpack หายไปแล้ว
```

จุดสำคัญคือ `should('not.exist')` ใช้ยืนยันว่า element **หายไปจาก DOM จริงๆ**

### TC03: Checkout ครบขั้นตอน

```javascript
cy.get('[data-test="checkout"]').click()
cy.get('[data-test="firstName"]').type('John')
cy.get('[data-test="lastName"]').type('Doe')
cy.get('[data-test="postalCode"]').type('12345')
cy.get('[data-test="continue"]').click()      // ไปหน้า Checkout Overview
cy.get('[data-test="finish"]').click()        // ยืนยันสั่งซื้อ
cy.contains('Thank you for your order!').should('be.visible')
```

Flow: ตะกร้า -> Checkout -> กรอกข้อมูล -> Continue -> Overview -> Finish -> หน้าขอบคุณ

### TC04 และ TC05: ตรวจการเรียงราคา

```javascript
cy.get('[data-test="product-sort-container"]').select('Price (low to high)')

cy.get('.inventory_item_price').then(($prices) => {
  const priceValues = $prices.map((index, html) =>
    parseFloat(html.innerText.replace('$', ''))
  ).get()
  const sortedPrices = [...priceValues].sort((a, b) => a - b)
  expect(priceValues).to.deep.equal(sortedPrices)
})
```

อธิบายทีละขั้น:

| ขั้นตอน | ทำอะไร |
|---|---|
| `.select('Price (low to high)')` | เลือกตัวเลือกใน dropdown |
| `cy.get('.inventory_item_price')` | ดึง element ราคาทุกชิ้น (เช่น `$29.99`, `$9.99`, ...) |
| `.then(($prices) => {...})` | เอา element ทั้งหมดมาประมวลผลด้วย JS |
| `.map(...).get()` | วนทุก element แปลงเป็น array ของตัวเลข เช่น `[7.99, 9.99, 15.99, ...]` |
| `html.innerText.replace('$', '')` | ตัด `$` ออกให้เหลือแค่ตัวเลข |
| `parseFloat(...)` | แปลงข้อความเป็นเลขทศนิยม |
| `[...priceValues].sort(...)` | **copy** array แล้วเรียงเองเป็น "คำตอบที่ถูก" |
| `expect(priceValues).to.deep.equal(sortedPrices)` | เทียบว่าลำดับที่เว็บแสดง = ลำดับที่เรียงเองถูกต้อง |

**หลักคิด**: ให้โค้ดเรียงเองเป็นคำตอบที่ถูก แล้วเทียบกับที่เว็บแสดง

**ทำไมต้อง `[...priceValues]`**: `.sort()` แก้ array ต้นฉบับ ถ้าไม่ copy ก่อน ทั้งสองตัวแปรจะเป็น array เดียวกัน การเทียบจะผ่านเสมอโดยไม่ได้ตรวจอะไรเลย

**ทำไมใช้ `.deep.equal`**: array สองก้อนเทียบด้วย `.equal` (===) จะเป็นเท็จเสมอเพราะเป็นคนละ object ต้องใช้ `deep` เพื่อเทียบค่าข้างใน

TC05 ต่างกันแค่ `select('Price (high to low)')` และ `sort((a, b) => b - a)`

### TC06: ตรวจยอดรวมหน้า Checkout Overview

```javascript
cy.get('.summary_subtotal_label').then(($subtotal) => {
  const subtotalValue = parseFloat($subtotal.text().replace('Item total: $', ''))

  cy.get('.inventory_item_price').then(($prices) => {
    const priceValues = $prices.map((index, html) =>
      parseFloat(html.innerText.replace('$', ''))
    ).get()
    const calculatedSubtotal = priceValues.reduce((acc, price) => acc + price, 0)
    expect(subtotalValue).to.equal(calculatedSubtotal)
  })
})
```

| ขั้นตอน | ทำอะไร |
|---|---|
| `.summary_subtotal_label` | ดึงข้อความ `Item total: $39.98` |
| `.replace('Item total: $', '')` + `parseFloat` | เหลือเลข `39.98` |
| `.inventory_item_price` | ดึงราคาแต่ละชิ้นในหน้า Overview |
| `.reduce((acc, price) => acc + price, 0)` | รวมราคาทั้งหมด (เริ่มจาก 0) |
| `expect(subtotalValue).to.equal(calculatedSubtotal)` | เทียบยอดที่เว็บแสดง กับยอดที่คำนวณเอง |

ราคาในเทสนี้คือ 29.99 + 9.99 = 39.98 (ตรวจใน Node แล้วว่าค่าเท่ากันพอดี เทสจึงผ่านได้)

> **ข้อควรระวัง**: ตัวเลขทศนิยมใน JavaScript อาจคลาดเคลื่อนได้ในบางชุดราคา (เช่น `0.1 + 0.2 = 0.30000000000000004`) ถ้าเพิ่มสินค้าอื่นแล้วเทสพังแบบแปลกๆ ให้เทียบแบบปัดเศษแทน เช่น `expect(subtotalValue).to.be.closeTo(calculatedSubtotal, 0.001)` หรือ `calculatedSubtotal.toFixed(2)`

---

## 8. คำสั่งรันเทสใน Terminal

```bash
# เปิด Test Runner แบบมี UI (เหมาะตอนเขียน/ debug เห็นทีละขั้น)
npx cypress open

# รันทุกไฟล์แบบ headless (เหมาะกับ CI/CD)
npx cypress run

# รันเฉพาะไฟล์
npx cypress run --spec "cypress/e2e/saucedemo-login.cy.js"
npx cypress run --spec "cypress/e2e/saucedemo-shop.cy.js"
npx cypress run --spec "cypress/e2e/practice/login-plain.cy.js"
npx cypress run --spec "cypress/e2e/practice/login-pom.cy.js"

# รันหลายไฟล์ด้วย pattern
npx cypress run --spec "cypress/e2e/saucedemo-*.cy.js"

# เลือกเบราว์เซอร์
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge

# รันแบบเห็นหน้าต่างเบราว์เซอร์
npx cypress run --headed
npx cypress run --headed --browser chrome
```

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npx cypress open` | เปิด Test Runner แบบมี UI |
| `npx cypress run` | รันทุกเทสแบบ headless |
| `npx cypress run --spec "path"` | รันเฉพาะไฟล์ |
| `npx cypress run --browser chrome` | เลือกเบราว์เซอร์ |
| `npx cypress run --headed` | รันแบบเห็นหน้าต่างเบราว์เซอร์ |
| `npx cypress verify` | ตรวจว่า Cypress ติดตั้งถูกต้อง |
| `npx cypress --version` | ดูเวอร์ชัน |

### ตั้งทางลัดใน package.json

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:login": "cypress run --spec cypress/e2e/saucedemo-login.cy.js",
    "cy:shop": "cypress run --spec cypress/e2e/saucedemo-shop.cy.js",
    "cy:chrome": "cypress run --browser chrome"
  }
}
```

```bash
npm run cy:open
npm run cy:run
npm run cy:shop
```

---

## 9. จุดที่ควรปรับปรุง (Best Practices)

| ปัญหาในโค้ดเดิม | วิธีแก้ |
|---|---|
| `cy.wait(2000)` เป็น hard wait ทำให้เทสช้า | ลบทิ้ง Cypress รอ element ให้อัตโนมัติ (auto-retry) |
| โค้ด login ถูก copy ซ้ำในทุกเทส (ส่วน B ซ้ำ 6 รอบ) | ย้ายไป `beforeEach` หรือทำเป็น `cy.login()` |
| TC02, TC03, TC06 copy ขั้นตอนเพิ่มสินค้าซ้ำ | แยกเป็น helper หรือ custom command |
| `cy.visit()` ซ้ำทุกเทส | ย้ายไปไว้ใน `beforeEach()` |
| มีช่องว่างท้าย selector `'[...] '` | ลบช่องว่างออก |
| ข้อมูลทดสอบฝังในโค้ด | แยกเป็นตัวแปรหรือไฟล์ fixture |
| เทส error ไม่ตรวจว่ายังอยู่หน้า login | เพิ่ม `cy.url().should('not.include', '/inventory')` |
| ชื่อเทสไม่ตรงกับสิ่งที่ทดสอบ (TC03 login, TC01 shop) | เปลี่ยนชื่อให้สื่อความหมาย |
| TC03 checkout ไม่ตรวจกลางทาง | เพิ่ม `cy.url().should('include', '/checkout-step-two')` ก่อนกด Finish |
| เทียบทศนิยมด้วย `.equal` ใน TC06 | ใช้ `closeTo` หรือปัดเศษ 2 ตำแหน่ง |

---

## 10. โค้ดเวอร์ชันปรับปรุงแล้ว

### `cypress/support/commands.js` (custom command)

```javascript
Cypress.Commands.add('login', (username = 'standard_user', password = 'secret_sauce') => {
  cy.visit('https://www.saucedemo.com')
  cy.get('[data-test="username"]').type(username)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
  cy.url().should('include', '/inventory.html')
})
```

> ต้องมีบรรทัด `import './commands'` ใน `cypress/support/e2e.js` (ปกติมีให้อยู่แล้ว)

### `cypress/e2e/saucedemo-shop.cy.js`

```javascript
describe('SauceDemo Shopping Flow', () => {
  const backpack  = '[data-test="add-to-cart-sauce-labs-backpack"]'
  const bikeLight = '[data-test="add-to-cart-sauce-labs-bike-light"]'
  const badge     = '[data-test="shopping-cart-badge"]'

  // ดึงราคาจากทุก element แล้วแปลงเป็น array ของตัวเลข
  const getPrices = ($prices) =>
    $prices.map((i, el) => parseFloat(el.innerText.replace('$', ''))).get()

  const fillCheckoutInfo = () => {
    cy.get('[data-test="checkout"]').click()
    cy.get('[data-test="firstName"]').type('John')
    cy.get('[data-test="lastName"]').type('Doe')
    cy.get('[data-test="postalCode"]').type('12345')
    cy.get('[data-test="continue"]').click()
  }

  beforeEach(() => {
    cy.login()
  })

  it('TC01 - เพิ่มสินค้าลงตะกร้า', () => {
    cy.get(backpack).click()
    cy.get(badge).should('contain', '1')
    cy.get(bikeLight).click()
    cy.get(badge).should('contain', '2')
  })

  it('TC02 - ลบสินค้าออกจากตะกร้า', () => {
    cy.get(backpack).click()
    cy.get(bikeLight).click()
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="remove-sauce-labs-backpack"]').click()
    cy.contains('Your Cart').should('be.visible')
    cy.contains('Sauce Labs Backpack').should('not.exist')
    cy.get(badge).should('contain', '1')
  })

  it('TC03 - Checkout สำเร็จ', () => {
    cy.get(bikeLight).click()
    cy.get('[data-test="shopping-cart-link"]').click()
    fillCheckoutInfo()
    cy.url().should('include', '/checkout-step-two')
    cy.get('[data-test="finish"]').click()
    cy.contains('Thank you for your order!').should('be.visible')
  })

  it('TC04 - เรียงราคาน้อยไปมาก', () => {
    cy.get('[data-test="product-sort-container"]').select('Price (low to high)')
    cy.get('.inventory_item_price').then(($prices) => {
      const actual = getPrices($prices)
      const expected = [...actual].sort((a, b) => a - b)
      expect(actual).to.deep.equal(expected)
    })
  })

  it('TC05 - เรียงราคามากไปน้อย', () => {
    cy.get('[data-test="product-sort-container"]').select('Price (high to low)')
    cy.get('.inventory_item_price').then(($prices) => {
      const actual = getPrices($prices)
      const expected = [...actual].sort((a, b) => b - a)
      expect(actual).to.deep.equal(expected)
    })
  })

  it('TC06 - ยอดรวมใน Checkout Overview ถูกต้อง', () => {
    cy.get(backpack).click()
    cy.get(bikeLight).click()
    cy.get('[data-test="shopping-cart-link"]').click()
    fillCheckoutInfo()

    cy.get('.summary_subtotal_label').then(($subtotal) => {
      const shown = parseFloat($subtotal.text().replace('Item total: $', ''))

      cy.get('.inventory_item_price').then(($prices) => {
        const calculated = getPrices($prices).reduce((sum, p) => sum + p, 0)
        expect(shown).to.be.closeTo(calculated, 0.001)
      })
    })
  })
})
```

### `cypress/e2e/saucedemo-login.cy.js`

```javascript
describe('SauceDemo Login Testing', () => {
  const validUser = { username: 'standard_user', password: 'secret_sauce' }

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com')
  })

  it('TC01 - Login สำเร็จ', () => {
    cy.get('[data-test="username"]').should('be.visible').type(validUser.username)
    cy.get('[data-test="password"]').should('be.visible').type(validUser.password)
    cy.get('[data-test="login-button"]').should('be.visible').click()
    cy.url().should('include', '/inventory.html')
  })

  it('TC02 - Username ผิด และ Password ผิด', () => {
    cy.get('[data-test="username"]').type('Standard')
    cy.get('[data-test="password"]').type('wrong_password')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible').and('contain', 'do not match')
    cy.url().should('not.include', '/inventory')
  })

  it('TC03 - Username และ Password ไม่ครบ', () => {
    cy.get('[data-test="username"]').type('standard')
    cy.get('[data-test="password"]').type('secret')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible').and('contain', 'do not match')
  })

  it('TC04 - ไม่กรอก Username', () => {
    cy.get('[data-test="password"]').type(validUser.password)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username is required')
  })

  it('TC05 - ไม่กรอก Password', () => {
    cy.get('[data-test="username"]').type(validUser.username)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible').and('contain', 'Password is required')
  })
})
```

---

## 11. ส่วน C: Practice Test Automation (Page Object + Fixture)

เว็บ: https://practicetestautomation.com/practice-test-login/
เทส Login 3 เคสเดียวกัน เขียน 2 แบบเพื่อเปรียบเทียบ

### ข้อมูลของเว็บนี้

| รายการ | ค่า |
|---|---|
| Username ที่ถูกต้อง | `student` |
| Password ที่ถูกต้อง | `Password123` |
| URL หลัง login สำเร็จ | `/logged-in-successfully/` |
| Error username ผิด | `Your username is invalid!` |
| Error password ผิด | `Your password is invalid!` |

### Selector (ใช้ id ไม่ใช่ data-test)

```javascript
'#username'   // ช่องกรอก username
'#password'   // ช่องกรอก password
'#submit'     // ปุ่ม Submit
'#error'      // กล่องข้อความ error
```

`#ชื่อ` คือ selector แบบ id (ส่วน `.ชื่อ` คือ class, `[data-test="x"]` คือ attribute)

### แบบที่ 1: เขียนตรงๆ (ไม่มี Page Object)

```javascript
describe('login', () => {
  beforeEach(() => {
    cy.visit('https://practicetestautomation.com/practice-test-login/')
  })

  it('tc-01', () => {
    cy.get('#username').type('student')
    cy.get('#password').type('Password123')
    cy.get('#submit').click()
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/logged-in-successfully/')
      expect(location.protocol).to.eq('https:')
    })
  })

  it('tc-02', () => {
    cy.get('#username').type('incorrectUser')
    cy.get('#password').type('Password123')
    cy.get('#submit').click()
    cy.get('#error').contains('Your username is invalid!')
    cy.get('#error').should('have.text', 'Your username is invalid!')
  })

  it('tc-03', () => {
    cy.get('#username').type('student')
    cy.get('#password').type('incorrectPassword')
    cy.get('#submit').click()
    cy.get('#error').contains('Your password is invalid!')
    cy.get('#error').should('have.text', 'Your password is invalid!')
  })
})
```

**อธิบาย**

| โค้ด | ความหมาย |
|---|---|
| `beforeEach(() => cy.visit(...))` | เปิดหน้า Login ก่อนทุกเทส ไม่ต้อง visit ซ้ำในแต่ละ `it` |
| tc-01 | login ด้วย `student` / `Password123` แล้วตรวจ URL |
| `cy.location().should((location) => {...})` | ดึงข้อมูล URL เป็น object แล้วตรวจหลายเงื่อนไขพร้อมกัน |
| `location.pathname` | ส่วน path ของ URL เช่น `/logged-in-successfully/` |
| `location.protocol` | `https:` ยืนยันว่าเป็น https |
| tc-02 | username ผิด (`incorrectUser`) password ถูก ต้องขึ้น `Your username is invalid!` |
| tc-03 | username ถูก password ผิด (`incorrectPassword`) ต้องขึ้น `Your password is invalid!` |

**`contains` กับ `have.text` ต่างกัน**

| คำสั่ง | ตรวจแบบ |
|---|---|
| `cy.get('#error').contains('xxx')` | มีข้อความนี้เป็น **ส่วนหนึ่ง** ของ element (หลวม) |
| `cy.get('#error').should('have.text', 'xxx')` | ข้อความ **ตรงเป๊ะทุกตัวอักษร** (เข้มงวด) |

ในโค้ดใช้ทั้งสองบรรทัดซ้อนกัน ซึ่งซ้ำซ้อน เพราะ `have.text` เข้มงวดกว่าและครอบคลุม `contains` อยู่แล้ว เลือกใช้แบบใดแบบหนึ่งก็พอ

> เคล็ดลับ: เขียนสั้นลงได้เป็น `cy.location('pathname').should('eq', '/logged-in-successfully/')`

### แบบที่ 2: Page Object + Fixture + Custom Command

```javascript
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
```

เทสไฟล์นี้อ้างอิง 3 ไฟล์ที่ต้องมีอยู่ด้วย แต่ยังไม่ได้ส่งมา ด้านล่างเป็น **ตัวอย่างที่เขียนให้เข้ากับโค้ดข้างบน** (ชื่อ method และข้อความตรวจอาจต่างจากของจริงของคุณ ให้ปรับตามไฟล์ที่มี)

**1) `cypress/fixtures/login1.json`** (ข้อมูลทดสอบ)

```json
{
  "username": {
    "positive": "student",
    "negative": "incorrectUser"
  },
  "password": {
    "positive": "Password123",
    "negative": "incorrectPassword"
  }
}
```

**2) `cypress/support/commands.js`** (Custom Command)

```javascript
Cypress.Commands.add('login1', (username, password) => {
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#submit').click()
})
```

คำสั่งนี้ **ไม่ visit เว็บเอง** เพราะ `beforeEach` เปิดหน้าให้แล้ว (ต่างจาก `cy.login()` ของ SauceDemo ที่ visit เอง)

**3) `cypress/support/pageobject/loginpage.js`** (Page Object)

```javascript
class LoginPage {
  verifyLoginSuccessText() {
    cy.location('pathname').should('eq', '/logged-in-successfully/')
    cy.contains('Logged In Successfully').should('be.visible')
  }

  invalidusernamelogin() {
    cy.get('#error')
      .should('be.visible')
      .and('have.text', 'Your username is invalid!')
  }

  invalidpasswordlogin() {
    cy.get('#error')
      .should('be.visible')
      .and('have.text', 'Your password is invalid!')
  }
}

export default LoginPage
```

### อธิบายแนวคิดที่ต้องจำ

| คำศัพท์ | ความหมาย | ในโค้ดนี้ |
|---|---|---|
| **Fixture** | ไฟล์เก็บข้อมูลทดสอบแยกจากโค้ดเทส (มักเป็น json) | `login1.json` เก็บ username/password แบบ positive (ถูก) และ negative (ผิด) |
| **Custom Command** | คำสั่ง `cy.xxx` ที่เราสร้างเอง ใช้ซ้ำได้ทุกเทส | `cy.login1(user, pass)` |
| **Page Object Model (POM)** | แยก selector และการตรวจสอบของแต่ละหน้าไปไว้ใน class เดียว | `LoginPage` |
| `require("...json")` | โหลดไฟล์ json มาเป็น object ใช้ได้ทันที | `testDatalogin` |
| `import X from "..."` | นำเข้า class ที่ `export default` ไว้ | `LoginPage` |
| `new LoginPage()` | สร้าง object จาก class เพื่อเรียก method | `lpn` |
| `testDatalogin.username.positive` | อ่านค่าซ้อนใน json | `"student"` |

**เส้นทางการทำงานของ tc-02:**

```
beforeEach: visit หน้า Login
   ↓
cy.login1(negative username, positive password)   <- Custom Command พิมพ์และกดปุ่ม
   ↓
lpn.invalidusernamelogin()                        <- Page Object ตรวจ error
```

**ทำไมชื่อ path เป็น `../../`:** ไฟล์เทสต้องอยู่ที่ `cypress/e2e/<โฟลเดอร์>/xxx.cy.js` ถอยขึ้น 2 ชั้นจึงถึง `cypress/` แล้วเข้า `fixtures/` และ `support/` ได้ ถ้าวางไฟล์เทสตรงๆ ใน `cypress/e2e/` ต้องเปลี่ยนเป็น `../`

> ทางเลือกของ Cypress เอง: `cy.fixture('login1.json').then((data) => {...})` หรือโหลดใน `beforeEach` แล้วเก็บด้วย alias ก็ได้ ไม่ต้องใช้ `require`

### เปรียบเทียบสองแบบ

| หัวข้อ | แบบเขียนตรงๆ | แบบ POM + Fixture |
|---|---|---|
| ความง่าย | อ่านรู้เรื่องในไฟล์เดียว | ต้องเปิดหลายไฟล์ |
| เมื่อ selector เปลี่ยน (เช่น `#error`) | ต้องแก้ทุกเทส | แก้ที่ `loginpage.js` ที่เดียว |
| เมื่อข้อมูลทดสอบเปลี่ยน | แก้ในโค้ดเทส | แก้ที่ `login1.json` ที่เดียว |
| ใช้ซ้ำข้ามไฟล์เทส | ยาก | ง่าย (import / `cy.login1`) |
| เหมาะกับ | เทสน้อย เรียนรู้เบื้องต้น | โปรเจกต์ใหญ่ ทำงานเป็นทีม |

### จุดที่ควรระวัง

- ชื่อเทส `tc-01`, `tc-02`, `tc-03` ไม่บอกว่าทดสอบอะไร ควรเปลี่ยนเป็น เช่น `Login สำเร็จ`, `Username ผิด`, `Password ผิด`
- ชื่อ method `invalidusernamelogin` ฟังเหมือนเป็นการ "login" แต่จริงๆ เป็นการ **ตรวจผล** ควรตั้งชื่อเป็น `verifyInvalidUsernameError()`
- ในแบบตรงๆ มี `cy.get('#error').contains(...)` ซ้ำกับ `have.text` ควรเหลือบรรทัดเดียว
- ถ้าใช้ `require` กับ json แล้ว Cypress เตือนหรือ error ให้เปลี่ยนไปใช้ `import data from '../../fixtures/login1.json'` หรือ `cy.fixture()`

---

## ทิปเวลาเทส Fail

1. ดู error message ใน Test Runner ว่าหา element ไม่เจอ หรือ assertion ไม่ตรง
2. ดูภาพแคปใน `cypress/screenshots/`
3. ตรวจ selector ด้วย DevTools (กด F12) ว่าตรงกับหน้าเว็บจริง
4. รันแบบ `npx cypress open` เพื่อดูการทำงานทีละขั้น
5. ถ้าเทสที่ต้องคำนวณพัง ให้ใส่ `cy.log(JSON.stringify(priceValues))` เพื่อดูค่าที่ดึงมาจริง
