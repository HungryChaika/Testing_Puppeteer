const puppeteer = require("puppeteer");
const { resourceLimits } = require("worker_threads");

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("http://books.toscrape.com/");
    await page.waitForTimeout(1000);

    await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
    const result = await page.evaluate(() => {
        let title = document.querySelector('h1').innerText;
        let price = document.querySelector('.price_color').innerText;
        return {
            title,
            price
        }
    });

    browser.close();
    return result;
};

scrape().then((value) => {
    console.log(value);
});
