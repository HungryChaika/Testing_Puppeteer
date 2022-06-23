//  **************************************** ANIME.GO ****************************************
const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require('path');

const readFileAsync = async (path) => {
    return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return reject(err.message);
        };
        resolve(data);
    }));
};

const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message);
        };
        resolve();
    }));
};

const correctDate = myDate => {
    myDate = myDate.replace(/январ\S+/gm, 1);
    myDate = myDate.replace(/феврал\S+/gm, 2);
    myDate = myDate.replace(/март\S+/gm, 3);
    myDate = myDate.replace(/апрел\S+/gm, 4);
    myDate = myDate.replace(/ма\S+/gm, 5);
    myDate = myDate.replace(/июн\S+/gm, 6);
    myDate = myDate.replace(/июл\S+/gm, 7);
    myDate = myDate.replace(/август\S+/gm, 8);
    myDate = myDate.replace(/сентябр\S+/gm, 9);
    myDate = myDate.replace(/октябр\S+/gm, 10);
    myDate = myDate.replace(/ноябр\S+/gm, 11);
    myDate = myDate.replace(/декабр\S+/gm, 12);
    return myDate;
};

const collecting_anime = (async (document) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    //await page.goto("https://animego.org/anime", { waitUntil: 'domcontentloaded' });
//                                          Фильтрация (беру сериалы и фильмы) !!!
    //await page.goto("https://animego.org/anime/filter/type-is-tv-or-movie/apply", { waitUntil: 'domcontentloaded' });
//                                              Рабочий скроллинг !!!
/* 
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                const expected_number_of_elements_after_scrolling = 1507;
                const scroll_distance = 300;
                window.scrollBy(0, scroll_distance);
                if(document.querySelector('#anime-list-container').childElementCount >= expected_number_of_elements_after_scrolling) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
 */
//                                           Берём все ссылки с главной страницы !!!
/* 
    const array_of_anime_links = await page.evaluate(() => {
        let number_of_elems_per_page = document.querySelector('#anime-list-container').childElementCount;
        console.log(number_of_elems_per_page);
        const arr = [];
        for(let i = 1; i <= number_of_elems_per_page; i++) {
            arr.push(document.querySelector(`#anime-list-container div:nth-child(${i}) div div.media-body div.h5.font-weight-normal.mb-1 a`).href);
        };
        return arr;
    });
 */
//                                            Посмотреть и записать json !!! 
    //await writeFileAsync(path.resolve(__dirname, 'links.json'), JSON.stringify(array_of_anime_links));
    const array_of_anime_links = JSON.parse(await readFileAsync(path.resolve(__dirname, 'links.json')));


//                                      Проходим по информации с помощью ссылок !!!
//await page.goto('https://animego.org/anime/plyazhnye-priklyucheniya-muromi-2039', { waitUntil: 'domcontentloaded' });    //сериал-вышел
//await page.goto('https://animego.org/anime/voshozhdenie-charodeya-2010', { waitUntil: 'domcontentloaded' });     //сериал-онгоинг (без описания)
//await page.goto('https://animego.org/anime/lyucifer-i-biskvitnyy-molot-2047', { waitUntil: 'domcontentloaded' });    //сериал-анонс
//await page.goto('https://animego.org/anime/sudbavelikiy-prikaz-kamelot-paladin-1973', { waitUntil: 'domcontentloaded' });     //фильм

    const all_anime_content = [];
   try {
    for(let i = 0; i < array_of_anime_links.length; i++) {
        await page.waitForTimeout(1000);
        await page.goto(array_of_anime_links[i], { waitUntil: 'domcontentloaded' });
        const info_about_one_anime = await page.evaluate(() => {

            if(document.querySelector('.error-404')?.innerText !== undefined) {
                return null;
            };

            let anime_title = document.querySelector('h1')?.innerText;
            let anime_type = null;
            let anime_episodes = null;
            let anime_status = null;
            let anime_genres = null;
            let anime_primary_source = null;
            let anime_date_release = null;
            let age_rating = null;
            let duration = null;
            let description = document.querySelector('.description.pb-3')?.innerText?.replace(/\n+/g, ' ');

            const all_elem = document.querySelector('div.anime-info dl.row');
            for(let j = 0; j < all_elem.childElementCount; j++) {
                if(all_elem.childNodes[j]?.innerText == "Тип") {            // Хороший, нет нареканий
                    anime_type = all_elem.childNodes[j+1]?.innerText;
                };
                if(all_elem.childNodes[j]?.innerText == "Эпизоды") {        // Хороший, а подобное 1 / 12 или 0 / ? можно обыграть добавлением в таблицу
                                                                            // 2-х столбцов: количество вышедших серий и количество запланированных серий
                    anime_episodes = all_elem.childNodes[j+1]?.innerText;
                };
                if(all_elem.childNodes[j]?.innerText == "Статус") {         // Хороший, нет нареканий
                    anime_status = all_elem.childNodes[j+1]?.innerText;
                };
                if(all_elem.childNodes[j]?.innerText == "Жанр") {           // Хороший, нет нареканий
                    anime_genres = (all_elem.childNodes[j+1]?.innerText)?.split(', ');
                };
                if(all_elem.childNodes[j]?.innerText == "Первоисточник") {  // Хороший, нет нареканий
                    anime_primary_source = all_elem.childNodes[j+1]?.innerText;
                };
                if(all_elem.childNodes[j]?.innerText == "Выпуск") {         // Хороший, исправил месяц на англоязычный
                    const dr = all_elem.childNodes[j+1]?.innerText;
                    anime_date_release = (dr?.charAt(0) == 'с') ?
                    dr.substring(2)?.split(' по ')[0] : dr;
                };
                if(all_elem.childNodes[j]?.innerText == "Возрастные ограничения") {    // Хороший, нет нареканий
                    age_rating = all_elem.childNodes[j+1]?.innerText;
                };
                if(all_elem.childNodes[j]?.innerText == "Длительность") {       // Хороший, нет нареканий
                    let elem = all_elem.childNodes[j+1]?.innerText;
                    if(anime_type == 'ТВ Сериал') {
                        duration = Number(elem?.split('мин.')[0]);
                    };
                    if(anime_type == 'Фильм') {
                        let hours = elem?.split('ч.');
                        duration = Number(hours[0]) * 60 + Number(hours[1]?.split('мин.')[0]);
                    };
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
                duration,               // Длительность (в минутах!!!)
                description             // Описание
            };
        });

        if(info_about_one_anime == null) {
            console.log('i am here')
            continue;
        };
//                                        Исправленние даты - сделал англоязычный месяц !!!
        if(info_about_one_anime?.anime_date_release) {
            info_about_one_anime.anime_date_release = correctDate(info_about_one_anime.anime_date_release);
        };

        all_anime_content.push(info_about_one_anime);
        if(i % 50 == 0) {
            await page.waitForTimeout(15000);
        };
        console.log(i);

    }} catch(e) {
        console.log(e);
    };

    browser.close();
    return all_anime_content;

})()
.then(value => {
    writeFileAsync(path.resolve(__dirname, 'anime-info.json'), JSON.stringify(value));
});
//                                      дописать данные
/* .then(value => {
    fs.appendFile(path.resolve(__dirname, 'anime-info.json'), JSON.stringify(value), (err) => {
        err && console.log(err);
    });
}); */
//                                   Посмотреть содержимое json-а !!!
/* const my_func = (async () => {
    return JSON.parse(await readFileAsync(path.resolve(__dirname, 'anime-info.json')));
})().then((value) => {
    console.log(value);
}); */








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