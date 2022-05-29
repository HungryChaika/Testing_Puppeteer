//  **************************************** JUT.SU ****************************************
// Почти не работает, смог лишь получить количество элементов. Здесь так-же, как у Anime.go,
// авто прогрузка списка, но вроде как есть возможность переключать ручками. Изо всех сил
// пытался взять id, потому что это единственное нехорошее место из-за которого я не могу воспльзоваться
// селектором, потому что именно id внешнего дива у элемента не закономерно

const puppeteer = require("puppeteer");

let scrape = (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("https://jut.su/anime/");
    await page.waitForTimeout(1000);

//  #anime_fs_11 > a > div > div.all_anime_image
//  #anime_fs_7 > a > div > div.all_anime_image
//#anime_fs_7
//  #anime_fs_11 > a
//  #anime_fs_5 > a
//  #anime_fs_52 > a > div > div.all_anime_image

    const conteiner_all_elems = await page.evaluate(() => {
        const container = document.querySelector('.all_anime_content');
        /*
        for(let i = 0; i < container.childElementCount - 1; i++) {
            console.log(container.childNodes[i].id);
            break;
        };
        */
        return {
            num: container.childElementCount,
        };
    });

    browser.close();
    return conteiner_all_elems;
/*                                   ПЕРЕДЕЛАТЬ!!! (просто скопировано, даже не приступал к замене)
    const list_anime = [];

    for(let i = 1; i <= number_of_elems_per_page; i++) {
        await page.click(`#anime-list-container > div:nth-child(${i}) > div > div.media-body > div.h5.font-weight-normal.mb-1 > a`);
        await page.waitForTimeout(2000);
        const elem = await page.evaluate(() => {
            let title = document.querySelector('h1').innerText;
            return {
                title
            }
        });
        list_anime.push(elem);
        await page.goBack();
    };

    browser.close();
    return list_anime;
*/
})().then((value) => {
    console.log(value);
});



//  **************************************** ANIME.GO ****************************************
// Всё работает, но есть проблема с переходом на следующие страницы списка - список прогружается автоматически
// и нужно придумать как обрабатывать корректно этот список (нет возможности переключать страницы ручками)
/*
const puppeteer = require("puppeteer");

let scrape = (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("https://animego.org/anime");
    await page.waitForTimeout(1000);

    await page.mouse.wheel({deltaY: 10000});
    await page.waitForTimeout(2000);
    await page.mouse.wheel({deltaY: 10000});
    await page.waitForTimeout(2000);

    //let number_of_elements = 0;

    const number_of_elems_per_page = await page.evaluate(() => {
        let elems = document.querySelector('#anime-list-container');
        return elems.childElementCount;
    });

    browser.close();
    return number_of_elems_per_page;

    const list_anime = [];

    for(let i = 1; i <= number_of_elems_per_page; i++) {
        await page.click(`#anime-list-container > div:nth-child(${i}) > div > div.media-body > div.h5.font-weight-normal.mb-1 > a`);
        await page.waitForTimeout(2000);
        const elem = await page.evaluate(() => {
            let title = document.querySelector('h1').innerText;
            return {
                title
            }
        });
        list_anime.push(elem);
        await page.goBack();
    };

    browser.close();
    return list_anime;
})().then((value) => {
    console.log(value);
});
*/
