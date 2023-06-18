const { onRequest } = require("firebase-functions/v2/https");
const { defineInt, defineString } = require('firebase-functions/params');
const cors = require("cors");
const twitter = require('twitter-lite');

// params (.env)
const consumerKey = defineString('TWITTER_CONSUMER_KEY');
const consumerSecret = defineString('TWITTER_CONSUMER_SECRET');
const accessTokenKey = defineString('ACCESS_TOKEN');
const accessTokenSecret = defineString('ACCESS_TOKEN_SECRET');

const tt_client = new twitter({
    subdomain: "api", // "api" is the default (change for other subdomains)
    version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: consumerKey.value(),
    consumer_secret: consumerSecret.value(),
    access_token_key: accessTokenKey.value(),
    access_token_secret: accessTokenSecret.value()
});

exports.getTwitterTrendsByRegion = onRequest((req, res) => {
    cors()(req, res, async () => {
        try {
            const regiao = req.params.regiao || 1

            /*
            * TRENDS TWITTER
            */
            console.log(":: coletando trends do twitter...")

            woeidRegiao = {
                1: 23424768, // brazil
                2: 455827, // sao paulo
                3: 455825, // rio de janeiro
                4: 455824 // recife
            }

            const woeid = woeidRegiao[regiao]

            const requestTwitter = await tt_client.get("trends/place", {
                id: woeid
            })

            const trendsTwitter = requestTwitter[0].trends

            if (trendsTwitter.length < 1){
                return res.json({erro: "erro ao coletar trends do twitter"})
            }

            console.log(trendsTwitter)
            let meusTrendsTT = []

            for (const item of trendsTwitter) {
                meusTrendsTT.push({
                    titulo: item.name,
                    keywords: [item.name],
                    url: item.url,
                })
            }

            res.json(meusTrendsTT);
        } catch (err) {
            console.error(err);
            
            res.status(400).json({
                error: "ErrorCatch"
            });
        }
    })
    // logger.info("Hello logs!", {structuredData: true});
});