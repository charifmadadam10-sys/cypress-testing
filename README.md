# SauceDemo Login Testing with Cypress

เอกสารสรุปสำหรับอ่านทบทวน: เทสระบบ Login ของเว็บ [SauceDemo](https://www.saucedemo.com) ด้วย Cypress

---

## สารบัญ

1. [ภาพรวมโปรเจกต์](#1-ภาพรวมโปรเจกต์)
2. [การติดตั้ง](#2-การติดตั้ง)
3. [โครงสร้างโปรเจกต์](#3-โครงสร้างโปรเจกต์)
4. [คำสั่ง Cypress ที่ต้องจำ](#4-คำสั่ง-cypress-ที่ต้องจำ)
5. [Selector และข้อมูลทดสอบที่ต้องจำ](#5-selector-และข้อมูลทดสอบที่ต้องจำ)
6. [โค้ดตัวอย่างพร้อมอธิบาย](#6-โค้ดตัวอย่างพร้อมอธิบาย)
7. [คำสั่งรันเทสใน Terminal](#7-คำสั่งรันเทสใน-terminal)
8. [จุดที่ควรปรับปรุง (Best Practices)](#8-จุดที่ควรปรับปรุง-best-practices)
9. [โค้ดเวอร์ชันปรับปรุงแล้ว](#9-โค้ดเวอร์ชันปรับปรุงแล้ว)

---

## 1. ภาพรวมโปรเจกต์

| หัวข้อ | รายละเอียด |
|---|---|
| เว็บที่ทดสอบ | https://www.saucedemo.com |
| เครื่องมือ | Cypress (JavaScript) |
| สิ่งที่ทดสอบ | หน้า Login |
| จำนวนเทสเคส | 5 เคส |

| รหัส | ชื่อ | สิ่งที่ทดสอบ | ผลที่คาดหวัง |
|---|---|---|---|
| TC01 | open website | Login ด้วยข้อมูลถูกต้อง | เข้า `/inventory.html` |
| TC02 | wrong username/password | username ผิด + password ผิด | ขึ้น error `do not match` |
| TC03 | wrong username/password (2) | กรอกไม่ถูกทั้งคู่ (พิมพ์ไม่ครบ) | ขึ้น error `do not match` |
| TC04 | no username | ไม่กรอก username | ขึ้น error `Username is required` |
| TC05 | no password | ไม่กรอก password | ขึ้น error `Password is required` |

---

## 2. การติดตั้ง

ต้องมี [Node.js](https://nodejs.org) ติดตั้งก่อน (ตรวจด้วย `node -v`)

```bash
# สร้างโฟลเดอร์โปรเจกต์
mkdir saucedemo-cypress
cd saucedemo-cypress

# สร้าง package.json
npm init -y

# ติดตั้ง Cypress
npm install cypress --save-dev
```

เปิด Cypress ครั้งแรก (จะสร้างโครงสร้างโฟลเดอร์ให้อัตโนมัติ):

```bash
npx cypress open
```

---

## 3. โครงสร้างโปรเจกต์

```
saucedemo-cypress/
├── cypress/
│   ├── e2e/
│   │   └── saucedemo.cy.js     <- ไฟล์เทสของเรา
│   ├── fixtures/               <- เก็บข้อมูลทดสอบ (json)
│   ├── screenshots/            <- ภาพแคปเมื่อเทส fail (สร้างอัตโนมัติ)
│   ├── videos/                 <- วิดีโอการรัน (สร้างอัตโนมัติ)
│   └── support/                <- คำสั่งที่เขียนเองใช้ซ้ำ
├── cypress.config.js           <- ไฟล์ตั้งค่า
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
| `cy.get(selector)` | ค้นหา element |
| `.type('text')` | พิมพ์ข้อความ |
| `.clear()` | ล้างข้อความในช่อง |
| `.click()` | คลิก |
| `cy.wait(ms)` | หยุดรอ (ไม่แนะนำ) |
| `cy.url()` | ดึง URL ปัจจุบัน |

### Assertion (ตรวจผล)

| คำสั่ง | ความหมาย |
|---|---|
| `.should('be.visible')` | มองเห็นบนหน้าจอ |
| `.should('exist')` | มี element อยู่ใน DOM |
| `.should('contain', 'text')` | มีข้อความนี้อยู่ข้างใน |
| `.should('have.text', 'text')` | ข้อความตรงเป๊ะ |
| `.should('have.value', 'x')` | ค่าในช่อง input เท่ากับ x |
| `cy.url().should('include', 'x')` | URL มีคำว่า x |
| `cy.url().should('eq', 'url')` | URL ตรงกันทั้งหมด |
| `.and(...)` | ต่อ assertion เพิ่ม (ใช้แทน `.should` ตัวที่ 2) |

---

## 5. Selector และข้อมูลทดสอบที่ต้องจำ

### Selector

```javascript
'[data-test="username"]'      // ช่องกรอก username
'[data-test="password"]'      // ช่องกรอก password
'[data-test="login-button"]'  // ปุ่ม Login
'[data-test="error"]'         // กล่อง error สีแดง
```

`data-test` เป็น attribute ที่นักพัฒนาใส่ไว้เพื่อใช้เทสโดยเฉพาะ เสถียรกว่า class/id เพราะไม่เปลี่ยนตามดีไซน์

### ข้อมูลทดสอบ

| รายการ | ค่า |
|---|---|
| Username ที่ถูกต้อง | `standard_user` |
| Password ที่ถูกต้อง | `secret_sauce` |
| URL หลัง login สำเร็จ | `/inventory.html` |

### ข้อความ Error

| กรณี | ข้อความ |
|---|---|
| ข้อมูลผิด | `Epic sadface: Username and password do not match any user in this service` |
| ไม่กรอก username | `Epic sadface: Username is required` |
| ไม่กรอก password | `Epic sadface: Password is required` |

---

## 6. โค้ดตัวอย่างพร้อมอธิบาย

### โค้ดต้นฉบับ (ไฟล์ `cypress/e2e/saucedemo.cy.js`)

```javascript
describe('SauceDemo Testing', () => {

  it('TC01-open website', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').should('be.visible')
    cy.get('[data-test="password"]').should('be.visible')
    cy.get('[data-test="login-button"]').should('be.visible')
    cy.wait(2000)
    cy.get('[data-test="username"]').type('standard_user')
    cy.wait(2000)
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.wait(2000)
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory.html')
    // cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
  })

  it('TC02-wrong username/Password', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('Standard')
    cy.wait(2000)
    cy.get('[data-test="password"]').type('wrong_password')
    cy.wait(2000)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'do not match')
  })

  it('TC03-Wrong username/Password (2)', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('standard')
    cy.wait(2000)
    cy.get('[data-test="password"]').type('secret')
    cy.wait(2000)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'do not match')
  })

  it('TC04-No username', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.wait(2000)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'Username is required')
  })

  it('TC05-No password', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('standard_user')
    cy.wait(2000)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'Password is required')
  })

})
```

### อธิบายทีละเทสเคส

#### TC01: Login สำเร็จ (Happy Path)

| ขั้นตอน | โค้ด | ความหมาย |
|---|---|---|
| 1 | `cy.visit(...)` | เปิดหน้า Login |
| 2 | `.should('be.visible')` x3 | ตรวจว่าช่อง username, password และปุ่ม login แสดงอยู่ |
| 3 | `.type('standard_user')` | กรอก username |
| 4 | `.type('secret_sauce')` | กรอก password |
| 5 | `.click()` | กดปุ่ม Login |
| 6 | `cy.url().should('include', '/inventory.html')` | ตรวจว่าเข้าหน้าสินค้าแล้ว = login สำเร็จ |

`include` = URL มีข้อความนี้อยู่, `eq` = URL ต้องตรงทั้งหมด (เข้มงวดกว่า)

#### TC02: Username และ Password ผิด

- `Standard` (S ใหญ่) ใช้ไม่ได้ เพราะ username แยกตัวพิมพ์เล็ก/ใหญ่
- `wrong_password` คือรหัสผ่านผิด
- ตรวจว่ากล่อง error แสดงขึ้นและมีคำว่า `do not match`

#### TC03: ข้อมูลผิดอีกรูปแบบ

- ใช้ `standard` (ไม่ครบ) และ `secret` (ไม่ครบ)
- ผลที่คาดหวังเหมือน TC02
- ชื่อเดิมเขียนว่า "No username/Password" ซึ่งไม่ตรงกับสิ่งที่ทดสอบ (จริงๆ คือ "กรอกผิด" ไม่ใช่ "ไม่กรอก")

#### TC04: ไม่กรอก Username

- กรอกแค่ password แล้วกด Login
- คาดหวัง error `Username is required`

#### TC05: ไม่กรอก Password

- กรอกแค่ username แล้วกด Login
- คาดหวัง error `Password is required`

### รูปแบบเทสที่ใช้ซ้ำทุกเคส

```
เปิดหน้า  ->  ทำ action (พิมพ์/คลิก)  ->  ตรวจผล (should)
 visit            type / click               should
```

---

## 7. คำสั่งรันเทสใน Terminal

### เปิด Cypress แบบมีหน้าต่าง (Interactive)

```bash
npx cypress open
```
เลือก **E2E Testing** -> เลือกเบราว์เซอร์ -> คลิกไฟล์เทส เหมาะกับตอนเขียนและ debug เพราะเห็นการทำงานทีละขั้น

### รันแบบไม่มีหน้าต่าง (Headless)

```bash
npx cypress run
```
รันทุกไฟล์เทส ใช้ Electron เป็นค่าเริ่มต้น และบันทึกวิดีโอ/ภาพแคปให้อัตโนมัติ เหมาะกับ CI/CD

### รันเฉพาะไฟล์

```bash
npx cypress run --spec "cypress/e2e/saucedemo.cy.js"
```

### เลือกเบราว์เซอร์

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### รันแบบเห็นหน้าเบราว์เซอร์ (Headed)

```bash
npx cypress run --headed
npx cypress run --headed --browser chrome
```

### สรุปคำสั่ง

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npx cypress open` | เปิด Test Runner แบบมี UI |
| `npx cypress run` | รันทุกเทสแบบ headless |
| `npx cypress run --spec "path"` | รันเฉพาะไฟล์ |
| `npx cypress run --browser chrome` | เลือกเบราว์เซอร์ |
| `npx cypress run --headed` | รันแบบเห็นหน้าต่างเบราว์เซอร์ |
| `npx cypress verify` | ตรวจว่า Cypress ติดตั้งถูกต้อง |
| `npx cypress --version` | ดูเวอร์ชัน |

### ตั้งสคริปต์ใน package.json (ทางลัด)

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:chrome": "cypress run --browser chrome"
  }
}
```

จากนั้นรันด้วย:

```bash
npm run cy:open
npm run cy:run
```

---

## 8. จุดที่ควรปรับปรุง (Best Practices)

| ปัญหาในโค้ดเดิม | วิธีแก้ |
|---|---|
| `cy.wait(2000)` เป็น hard wait ทำให้เทสช้า | ลบทิ้ง เพราะ Cypress รอ element ให้อัตโนมัติ (auto-retry) |
| `cy.visit()` ซ้ำทุกเทส | ย้ายไปไว้ใน `beforeEach()` |
| มีช่องว่างท้าย selector `'[...] '` | ลบช่องว่างออก |
| ข้อมูลทดสอบฝังในโค้ด | แยกเก็บเป็นตัวแปรหรือไฟล์ fixture |
| เทส error ไม่ตรวจว่ายังอยู่หน้า login | เพิ่ม `cy.url().should('not.include', '/inventory')` |
| ชื่อ TC03 ไม่ตรงกับสิ่งที่ทดสอบ | เปลี่ยนชื่อให้สื่อความหมาย |

---

## 9. โค้ดเวอร์ชันปรับปรุงแล้ว

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
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'do not match')
    cy.url().should('not.include', '/inventory')
  })

  it('TC03 - Username และ Password ไม่ครบ', () => {
    cy.get('[data-test="username"]').type('standard')
    cy.get('[data-test="password"]').type('secret')
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'do not match')
  })

  it('TC04 - ไม่กรอก Username', () => {
    cy.get('[data-test="password"]').type(validUser.password)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username is required')
  })

  it('TC05 - ไม่กรอก Password', () => {
    cy.get('[data-test="username"]').type(validUser.username)
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Password is required')
  })
})
```

---

## ทิปเวลาเทส Fail

1. ดู error message ใน Test Runner ว่าหา element ไม่เจอหรือ assertion ไม่ตรง
2. ดูภาพแคปใน `cypress/screenshots/`
3. ตรวจ selector ด้วย DevTools (กด F12) ว่าตรงกับหน้าเว็บจริง
4. ลองรันแบบ `npx cypress open` เพื่อดูการทำงานทีละขั้น
