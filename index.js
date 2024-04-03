require('dotenv').config();
const mongoose = require("mongoose");
const News = require('./models/News');
const axios = require('axios');
const getFreshNews = require('./src/mediastack');
const generatePoem = require('./src/openai');

// Check which env we are using
const databaseUrl = process.env.NODE_ENV === 'dev' ? process.env.DATABASE_URL : process.env.CLOUD_DATABASE_URL;
//console.log("Database url is : ", databaseUrl)

mongoose.set('strictQuery', true);
mongoose.connect(databaseUrl);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


async function getTodayNews() {
    const dateNowUTC = new Date();
    //console.log(dateNowUTC.toLocaleDateString()); // Date courante locale : 2024-03-26
    //console.log(dateNowUTC.toLocaleString()); // Datetime courante locale : 2024-03-26 22 h 06 min 44 s
    let todayNews = await News.findOne({date: dateNowUTC.getFullYear() + '-' + (dateNowUTC.getMonth()+1).toString().padStart(2, '0') + '-' + dateNowUTC.getDate()}).exec();
    
    if (todayNews) {
        if (todayNews.news.length > 0) {
            return todayNews;
        } else {
            // If for any reason we have no data in our daily database record, we want to delete and renew our daily data
            await News.findByIdAndDelete(todayNews._id)
            .then(function (response) {
                todayNews = null;
            })
            .catch(function (error) {
                throw new Error("Failed to delete a bad record ! ", error);
            });
        }
    }

    // If we don't have any data for today, we have to contact the API to get fresh news
    if (null === todayNews) {
        const myFreshNews = getFreshNews(dateNowUTC);
        return myFreshNews;
    }
}

getTodayNews()
    .then(function (response) {
        //console.log("Nombre de résultat : ", response.news.length);
        let titles = [];
        for (const i in response.news) {
            if (Object.hasOwnProperty.call(response.news, i)) {
                const element = response.news[i];
                titles.push(element.title);
            }
        }
        console.log(titles);

        console.log('-----------------------');
        console.log('--- POEM GENERATION ---');
        console.log('-----------------------\n');

        generatePoem(titles)
            .then(function (poem) {
                console.log(poem.message.content);
            });
    })
    .catch(function (error) {
        console.error(error);
    });
