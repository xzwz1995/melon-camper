import type { Page } from "puppeteer";

export const COOKIES_JSON = "./cookies.json";
export const IS_HEADLESS = false;
export const LOGIN_URL = "https://gmember.melon.com/login/login_form.htm?langCd=EN";
export const CONCERT_URL = "https://tkglobal.melon.com/performance/index.htm?langCd=EN&prodId=210489";
export const NIGHT = 1; // 0-indexed. Which concert day are you looking for?

export const loadBrowser = async (page: Page, WEBSITE_URL: string) => {
  await page.goto(WEBSITE_URL);

  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForNetworkIdle();
}

export const delay = async (time: number) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}