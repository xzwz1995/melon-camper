import puppeteer from 'puppeteer';
import fs from 'fs';
import CREDENTIALS from './credentials.json'
import { loadBrowser, COOKIES_JSON, IS_HEADLESS } from './shared';

const WEBSITE_URL = "https://gmember.melon.com/login/login_form.htm?langCd=EN"

const saveCookies = async () => {
  try {
    const cookies = await page.cookies();

    fs.writeFileSync(COOKIES_JSON, JSON.stringify(cookies, null, 2));
    console.log("Saved cookies to", COOKIES_JSON)

  } catch (error) {
    console.error('Error saving cookies:', error);
  }
}

const logIn = async () => {
  await page.locator('#email').fill(CREDENTIALS.email);
  await page.locator('#pwd').fill(CREDENTIALS.password);
  await page.locator('#formSubmit').click();

  await page.waitForNetworkIdle();
}

const browser = await puppeteer.launch({ headless: IS_HEADLESS });
const page = await browser.newPage();

await loadBrowser(page, WEBSITE_URL);

await logIn();
await saveCookies();

await browser.close();