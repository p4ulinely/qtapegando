const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors");
const googleTrends = require("google-trends-api");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.dailyTrendsByRegion = onRequest((req, res) => {
    cors()(req, res, async () => {
        try {
            let { geo, date, hl } = req.query;

            if (!geo)
                return res.status(400).json({
                    error: "preencha a geolocalização (XX)"
                });

            if (!date)
                return res.status(400).json({
                    error: "preencha a data (MM-DD-YY)"
                });

            if (!hl)
                hl = "EN";

            const result = JSON.parse(
                await googleTrends.dailyTrends({
                    geo,
                    trendDate: new Date(date),
                    hl,
            }));

            const trends = result.default.trendingSearchesDays[0].trendingSearches;

            res.json(trends);
        } catch (error) {
            console.error(error);
            
            res.status(400).json({
                error: "ErrorCatch"
            });
        }
    })
    // logger.info("Hello logs!", {structuredData: true});
});

exports.dailyTrendsFrequenciesByRegion = onRequest((req, res) => {
    cors()(req, res, async () => {
        try {
            let { geo, date, hl, limit = 15 } = req.query;

            if (!geo)
                return res.status(400).json({
                    error: "preencha a geolocalização (XX)"
                });

            if (!date)
                return res.status(400).json({
                    error: "preencha a data (MM-DD-YY)"
                });

            if (!hl)
                hl = "EN";

            console.log(": coletando trends");
            
            const result = JSON.parse(
                await googleTrends.dailyTrends({
                    geo,
                    trendDate: new Date(date),
                    hl,
            }));

            const trends = result.default.trendingSearchesDays[0].trendingSearches;
            
            if(trends.length < 1)
                return res.status(400).json({
                    error: "nenhum trend encontrado"
                });

            console.log(": parseando notícias relacionadas a cada trend");

            let relatedNews = [];
            
            for (const trend of trends) {
                for (const relatedArticle of trend.articles){
                    // relatedNews.push(relatedArticle.snippet); // breve descrição da notícia
                    relatedNews.push(relatedArticle.title); // título da notícia
                }
            }

            console.log(`:: ${relatedNews.length} notícias relacionadas`);
            console.log(": criando frequências a partir dos snippets das notícias");
            
            const snippetsJoinedWithBreakLine = relatedNews.join('\n');
            const frequenciesAsObject = nlpService.listaDeFrequenciasParaFrase(snippetsJoinedWithBreakLine);
            
            console.log(": convertendo frequências para array ordenado");

            let frequenciesAsArray = [];

            for (let key of Object.keys(frequenciesAsObject)){
                frequenciesAsArray.push({ 
                    key,
                    freq: frequenciesAsObject[key] 
                });
            }

            frequenciesAsArray.sort((a, b) => {
                // return a.freq - b.freq; ASC
                return b.freq - a.freq;
            });

            const keyQuantity = frequenciesAsArray.length;

            limit = limit > keyQuantity ? keyQuantity : limit;

            res.json({ 
                qnt: keyQuantity,
                frequencias: frequenciesAsArray.slice(0, limit),
            });
        } catch (error) {
            console.error(error);
            
            res.status(400).json({
                error: "ErrorCatch"
            });
        }
    })
});

exports.realTimeTrendsByRegion = onRequest((req, res) => {
    cors()(req, res, async () => {
        try {
            let { geo, category, hl } = req.query;

            if (!geo)
                return res.status(400).json({
                    error: "preencha a geolocalização (XX)"
                });

            //All : 'all' Entertainment: 'e' Business : 'b' Science/Tech : 't' Health : 'm' Sports : 's' Top Stories : 'h'
            if (!category)
                category = "all";

            if (!hl)
                hl = "EN";

            const result = JSON.parse(
                await googleTrends.realTimeTrends({
                    geo,
                    category,
                    hl,
            }));

            res.json(result.storySummaries.trendingStories);
        } catch (error) {
            console.error(error);
            
            res.status(400).json({
                error: "ErrorCatch"
            });
        }
    })
});