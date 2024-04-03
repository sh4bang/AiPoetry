const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
    {
        // Date de la récupération des articles (YYYY/MM/JJ)
        date: {
            type: String,
            required: true
        },
        // Langue des articles
        language: {
            type: String,
            required: true,
            min: 2,
            max: 3
        },
        // Liste des articles
        news: {
            type: Array,
            required: true
        },
        // Datetime de la récupération des articles
        createdAt: {
            type: Date,
            required: true
        },
    }
)

module.exports = mongoose.model('News', NewsSchema);