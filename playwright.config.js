// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    headless: false,
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    video: 'off'
  },
};

module.exports = config;
