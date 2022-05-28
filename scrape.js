const puppeteer = require("puppeteer");
const { resourceLimits } = require("worker_threads");

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("http://books.toscrape.com/");
    await page.waitForTimeout(1000);

    const num = await page.evaluate(() => {
        let articles = document.querySelectorAll('.product_pod');
        return articles.length;
    });

    const books = [];
    
    for(let i = 1; i <= num; i++) {
        await page.click(`#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(${i}) > article > div.image_container > a > img`);
        const book = await page.evaluate(() => {
            let title = document.querySelector('h1').innerText;
            let price = document.querySelector('.price_color').innerText;
            return {
                title,
                price
            }
        });
        books.push(book);
        await page.goBack();
    };

    browser.close();
    return books;
};

scrape().then((value) => {
    console.log(value);
});

