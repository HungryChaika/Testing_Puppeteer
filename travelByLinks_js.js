const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const readFileAsync = async (path) => {
    return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            return reject(err.message);
        }
        resolve(data);
    }));
}

const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
        if (err) {
            return reject(err.message);
        }
        resolve();
    }));
}

const travelByLinks = async () => {
    const data = await readFileAsync(path.resolve(__dirname, 'links.json'));
    const links = JSON.parse(data);

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    const animeInfo = [];
    for (let i = 10; i < 20; i++) {
        await page.goto(links[i], { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate(() => {
            try {
                let anime_title = document.querySelector('h1')?.innerText;
                let anime_type = null;
                let anime_episodes = null;
                let anime_status = null;
                let anime_genres = null;
                let anime_primary_source = null;
                let anime_date_release = null;
                let age_rating = null;
                let duration = null;
                let description = document.querySelector('.description.pb-3')?.innerText;
        
                const all_elem = document.querySelector('.anime-info dl.row');
                for(let j = 0; j < all_elem.childElementCount; j++) {
        
                    if(all_elem.childNodes[j]?.innerText == "Тип") {
                        anime_type = all_elem.childNodes[j+1]?.innerText;
                    };
                    if(all_elem.childNodes[j]?.innerText == "Эпизоды") {
                        anime_episodes = all_elem.childNodes[j+1]?.innerText;
                    };
                    if(all_elem.childNodes[j]?.innerText == "Статус") {
                        anime_status = all_elem.childNodes[j+1]?.innerText;
                    };
                    if(all_elem.childNodes[j]?.innerText == "Жанр") {
                        anime_genres = (all_elem.childNodes[j+1]?.innerText).split(', ');
                    };
                    if(all_elem.childNodes[j]?.innerText == "Первоисточник") {
                        anime_primary_source = all_elem.childNodes[j+1]?.innerText;
                    };
                    if(all_elem.childNodes[j]?.innerText == "Выпуск") {
                        anime_date_release = all_elem.childNodes[j+1]?.innerText;
                    };
                    if(all_elem.childNodes[j]?.innerText == "Возрастные ограничения") {
                        age_rating = all_elem.childNodes[j+1]?.innerText;
                    };
                    if(all_elem.childNodes[j]?.innerText == "Длительность") {
                        duration = all_elem.childNodes[j+1]?.innerText;
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
            } catch (e) {
                return {
                    link: document.URL
                }
            }
        });

        animeInfo.push(data);
    }

    browser.close();

    return animeInfo;
};

travelByLinks().then(data => {
    const jsonString = JSON.stringify(data);
    fs.appendFile(path.resolve(__dirname, 'anime.json'), jsonString, (err) => {
        err && console.log(err);
    });
});
