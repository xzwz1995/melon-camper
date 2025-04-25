import fs from "fs"
import puppeteer from "puppeteer"

import CREDENTIALS from "./credentials.json"
import { COOKIES_JSON, IS_HEADLESS, LOGIN_URL, loadBrowser } from "./shared"

const tempDir = 'C:\\Users\\work';

const saveCookies = async () => {
  try {
    const cookies = await page.cookies()

    fs.writeFileSync(COOKIES_JSON, JSON.stringify(cookies, null, 2))
    console.log("Saved cookies to", COOKIES_JSON)
  } catch (error) {
    console.error("Error saving cookies:", error)
  }
}

const logIn = async () => {
  await page.locator("#email").fill(CREDENTIALS.email)
  await page.locator("#pwd").fill(CREDENTIALS.password)
  await page.locator("#formSubmit").click()

  await page.waitForNetworkIdle()
}
const browser = await puppeteer.launch({
  userDataDir: tempDir,  
  headless: IS_HEADLESS        
});
//const browser = await puppeteer.launch({ headless: IS_HEADLESS })
const page = await browser.newPage()

await loadBrowser(page, LOGIN_URL)

await logIn()
await saveCookies()

await browser.close()
