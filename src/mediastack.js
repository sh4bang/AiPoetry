const axios = require('axios');
const News = require('../models/News');

const getFreshNews = async (dateNowUTC) => {
    const myFreshNews = await axios.get('http://api.mediastack.com/v1/news', {
        params: {
            // Q: Pourquoi pas besoin de faire "require('dotenv').config();" dans ce fichier pour accéder aux fichiers .env ?
            access_key: process.env.MEDIASTACK_TOKEN,
            languages: 'fr',
            date: dateNowUTC.getFullYear() + '-' + (dateNowUTC.getMonth()+1).toString().padStart(2, '0') + '-' + dateNowUTC.getDate(),
            sort: 'popularity',
            limit: 5
        }
    })
    .then(function (response) {
        // Q: On s'occupe vraiment de créer une entrée dans la BD ici ?
        // On peut pas juste renvoyer les data brut au "controller" et le laisser créer le document en BD ?
        // On dégagerait ainsi la dépendances à la BD de ce fichier...
        const FreshNews = new News({
            date: dateNowUTC.getFullYear() + '-' + (dateNowUTC.getMonth()+1).toString().padStart(2, '0') + '-' + dateNowUTC.getDate(),
            language: 'fr', 
            news: response.data.data, 
            createdAt: dateNowUTC
        });
        FreshNews.save();

        return FreshNews;
    })
    .catch(function (error) {
        // Q: Y'aurait pas une bonne pratique pour gérer les Exceptions un peu mieux que ça ? J'imagine dans le cas d'un CLI c'est suffisant...
        console.error(error);
    })

    return myFreshNews;
}

module.exports = getFreshNews;