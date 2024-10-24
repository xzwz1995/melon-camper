import type { Page } from "puppeteer";

export const COOKIES_JSON = "./cookies.json";
export const IS_HEADLESS = false;

export const loadBrowser = async (page: Page, WEBSITE_URL: string) => {
  await page.goto(WEBSITE_URL, {
    waitUntil: 'load',
  });

  await page.setViewport({ width: 1080, height: 1024 });
}