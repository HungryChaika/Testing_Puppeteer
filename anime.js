//  **************************************** ANIME.GO ****************************************
// При переходах по анимешкам и возвращении обратно к списку, тебя отскролит выше. Как итог
// в цикле перебора (с кликами) появляется ошибка, т.к. дочернего элемента с такой большой
// позицией просто нет ( i ). { Решил записываю все ссылки анимешек в массив };

const puppeteer = require("puppeteer");

let scrape = (async (document) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("https://animego.org/anime");
    await page.waitForTimeout(5000);
//                                                      Рабочий скроллинг!!!!!!
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                const expected_number_of_elements_after_scrolling = 10;
                const scroll_distance = 300;
                window.scrollBy(0, scroll_distance);
                if(document.querySelector('#anime-list-container').childElementCount >= expected_number_of_elements_after_scrolling) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
//                                           Берём все ссылки с главной страницы !!!
/*
    const array_of_anime_links = await page.evaluate(() => {
        let number_of_elems_per_page = document.querySelector('#anime-list-container').childElementCount;
        const arr = [];
        for(let i = 1; i <= number_of_elems_per_page; i++) {
            arr.push(document.querySelector(`#anime-list-container div:nth-child(${i}) div div.media-body div.h5.font-weight-normal.mb-1 a`).href);
        };
        return arr;
    });
*/
//                                      Проходим по информации с помощью ссылок (Не закончено) !!!
/*
    const all_anime_content = [];
    for(let i = 0; i < array_of_anime_links.length; i++) {
        await page.goto(array_of_anime_links[i]);

    };
    */
await page.goto('https://animego.org/anime/klub-dobryh-del-2055');    //сериал-вышел
//await page.goto('https://animego.org/anime/obruchennye-kukushkami-2024');     //сериал-онгоинг
//await page.goto('https://animego.org/anime/pererozhdenie-dyadi-2058');    //сериал-анонс
//await page.goto('https://animego.org/anime/hana-i-alisa-delo-ob-ubiystve-2034');     //фильм
    await page.waitForTimeout(5000);
    const answer = page.evaluate(() => {
        let anime_title = document.querySelector('h1').innerText;
        let anime_type = null;
        let anime_episodes = null;
        let anime_status = null;
        let anime_genres = null;
        let anime_primary_source = null;
        let anime_date_release = null;
        let age_rating = null;
        let duration = null;
        let description = document.querySelector('.description.pb-3').innerText;

        const fuck = [];

        const all_elem = document.querySelector('div.anime-info dl.row');
        for(let j = 0; j < all_elem.childElementCount; j++) {

            fuck.push(all_elem.childNodes[j].innerText);

            if(all_elem.childNodes[j].innerText == "Тип") {
                anime_type = all_elem.childNodes[j+1].innerText;
            };
            if(all_elem.childNodes[j].innerText == "Эпизоды") {
                anime_episodes = all_elem.childNodes[j+1].innerText;
            };
            if(all_elem.childNodes[j].innerText == "Статус") {
                anime_status = all_elem.childNodes[j+1].innerText;
            };
            if(all_elem.childNodes[j].innerText == "Жанр") {
                anime_genres = (all_elem.childNodes[j+1].innerText).split(', ');
            };
            if(all_elem.childNodes[j].innerText == "Первоисточник") {
                anime_primary_source = all_elem.childNodes[j+1].innerText;
            };
            if(all_elem.childNodes[j].innerText == "Выпуск") {
                anime_date_release = all_elem.childNodes[j+1].innerText;
            };
            if(all_elem.childNodes[j].innerText == "Возрастные ограничения") {
                age_rating = all_elem.childNodes[j+1].innerText;
            };
            if(all_elem.childNodes[j].innerText == "Длительность") {
                duration = all_elem.childNodes[j+1].innerText;
            };
        };

        return {
            anime_title,            // Название
            anime_genres,           // Жанры
            anime_type,             // Тип
            anime_status,           // Статус
            anime_episodes,         // Уоличество эпизодов
            anime_date_release,     // Дата выхода
            anime_primary_source,   // Первоисточник
            age_rating,             // Возрастной рейтинг
            duration,               // Длительность
            description             // Описание
        }
    });

    browser.close();
    //return all_anime_content;
    //return array_of_anime_links;
    return answer;
})().then((value) => {
    console.log(value);
});



// **************************************** Переход по анимешкам с помощью кликов в AnimeGo ****************************************
/*
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
*/


//  **************************************** YUMMYANIME.TV ****************************************
// УЕТА ЗНАТНАЯ - ПРОБЛЕМА ПЕРЕКЛЮЧЕНИЯ МЕЖДУ СТРАНИЦАМИ!!!
/*
const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("https://yummyanime.tv/series/");
    await page.waitForTimeout(3000);

    page.click(`#pagination > div > a:nth-child(${6})`);
//  В ПОПЫТКАХ РАЗОБРАТЬСЯ СО СТРЕЛКАМИ ПЕРЕКЛЮЧЕНЯ МЕЖДУ СТРАНИЦАМИ!!!
    const result = await page.evaluate(() => {
        const elem = document.querySelector("#pagination > div.pagination__inner.d-flex.jc-center");
        const str = Array.from(elem.childNodes).map(i => i.innerHTML).toString().split(",");
        const qwe = [];
        const asd = [];
        for(i in str) {
            qwe.push(Number(i));
        };
        for(i in qwe) {
            asd.push(typeof i);
        };
        return {
            res: elem.childElementCount,
            my_array: qwe
        };
    });
    browser.close();
    return result;
})().then((value) => {
    console.log(value);
});
*/


//  **************************************** JUT.SU ****************************************
// Не подойдёт, потому что осознал, что на страницах тайтллов слишком мало информации
// (сайт чисто для просмотра). Поэтому он отметается!
/*
const puppeteer = require("puppeteer");

let scrape = (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto("https://jut.su/anime/");
    await page.waitForTimeout(1000);

    const conteiner_all_elems = await page.evaluate(() => {
        const container = document.querySelector('.all_anime_content');
        return {
            num: container.childElementCount,
        };
    });

// Это работает!
    let i = 1;
    page.click(`#dle-content > .all_anime_content > div:nth-child(${i}) > a > div > div.all_anime_image`);
    await page.waitForTimeout(10000);

    browser.close();
    return conteiner_all_elems;

})().then((value) => {
    console.log(value);
});
*/



//  **************************************** МЫСЛИ О СКРОЛИНГЕ ****************************************
/*
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://animego.org/anime');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);

    await page.screenshot({
        path: 'yoursite.png',
        fullPage: true
    });

    await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
};
*/
/*
// **************************************** НЕМНОГО ДРУГОЕ, НО ТОЖЕ ПРО СКРОЛЛИНГ (ОЧЕНЬ СЫРОЕ) ****************************************
await page.evaluate( () => {
  window.scrollBy(0, window.innerHeight);
});
await page.waitForSelector('.class_name');
*/