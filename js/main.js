let bodyTrendStrings = document.querySelector('#bodyTrendsNews #top');
let bodyVitrineNews = document.querySelector('#bodyTrendsNews #mid');
let bodyTrendsNews = document.querySelector('#bodyTrendsNews #bottom');

window.onload = function() {
    const qsCategory = escape(getParameterByName("category"));
    const categories = ["e", "b", "t", "m", "s"];

    if (categories.indexOf(qsCategory) !== -1) {
        bodyTrendStrings.innerHTML = getLoadingHtml("dark");
        bodyTrendsNews.innerHTML = getLoadingHtml();
        
        preencherComTrendStrings(qsCategory);
        preencherComTrendNews(qsCategory);

        return null;
    }

    bodyTrendStrings.innerHTML = getLoadingHtml("dark");
    bodyVitrineNews.innerHTML = getLoadingHtml();
    bodyTrendsNews.innerHTML = getLoadingHtml();

    preencherComTrendStrings();
    preencherComVitrineNews();
    preencherComTrendNews();
};

function getLoadingHtml(color = "success") {
    let carregando = "<br><div class='text-center'><div class='spinner-border text-"+color+"' style='width: 3rem; height: 3rem;' role='status'><span class='sr-only'></span></div></div>";

    return carregando;
}

async function preencherComTrendStrings(category = "h") {
    let response = await getRealTimeTrends(category);

    if (response.length < 1) {
        bodyTrendsNews.innerHTML = "Nenhum trend econtrado.";
        return null;
    }

    let stringsToDisplay = [];

    for (const item of response) {
        const trendTitles = item.title.split(', ');

        if (trendTitles.length < 2)
            continue;

        const idxTrend = stringsToDisplay.indexOf(trendTitles[0]) === -1 ? 0 : 1;
        stringsToDisplay.push(trendTitles[idxTrend]); // apenas um dos títulos retornados

        // stringsToDisplay.push(...trendTitles); //todos
    }

    const subject = category !== "h" ? " ("+ getSubjectName(category) +")" : "";
    let trendStringsHtml = "<div id=\"trendStringsArea\"><h5 class=\"text-dark\">Mais buscados em tempo real" + subject + ": </h5>";

    for (const str of stringsToDisplay) {
        const regx = new RegExp(' ', 'g');
        const strToSearchOnGoogle = str.replace(regx, '+');

        trendStringsHtml += "<a href=\"https://www.google.com.br/search?q=" + strToSearchOnGoogle + "\" class=\"btn btn-outline-dark btn-lg stringMaisBuscada\" style=\"margin-left: 10px; margin-top: 10px; \" >" + str + "</a>";
    }

    trendStringsHtml += "</div><br><hr class=\"styleTwo\">";

    bodyTrendStrings.innerHTML = trendStringsHtml;               
}

async function preencherComVitrineNews() {

    const response = await getYesterdayTrends();

    if (response.length < 1) {
        bodyTrendsNews.innerHTML = "Nenhuma trend econtrado.";
        return null;
    }

    let controle = false; // para mostrar apenas a primeira e a segunda notícia disponível
    let vitrineNews = "<h5 class=\"text-danger\">Relacionadas a temas mais buscados ontem: </h5><br>";
    vitrineNews += "<div class=\"row row-cols-1 row-cols-lg-2 g-4\" style=\" align-items: flex-start; \">";

    for (const item of response) {
        try {
            const quantityImgsToDisplay = 7;
            let imgsTrend = [];

            for (const article of item.articles)
                imgsTrend.push(article.image.imageUrl);

            // apenas mostra notícia que tenha, pelo menos 8 notícias relacionadas
            if (imgsTrend.length < quantityImgsToDisplay)
                continue;

            let primeiraNoticiaDoTrend = item.articles[0];
            
            vitrineNews += "<div class=\"col\" >";
            vitrineNews += "<div class=\"card border-2 bg-light\" style=\" margin-top:5px;\">";

            if (imgsTrend.length > 1) {
                vitrineNews += "<div style=\"flex-direction: row;\"><a target=\"_blank\" href=\"" + primeiraNoticiaDoTrend.url + "\">";

                for (let i = 0; i < imgsTrend.length; i++) {

                    const srcImg = imgsTrend[i];
                    vitrineNews += "<img src=\"" + srcImg + "\" class=\"\" width=\"120\" />";

                    if (i === quantityImgsToDisplay-1)
                        break;
                }

                vitrineNews += "</a></div>";
            }

            vitrineNews += "<div class=\"card-body\">";

            let title = "<h1><a class=\"card-title fw-bold text-decoration-none text-danger \" target=\"_blank\" href=\"" + primeiraNoticiaDoTrend.url + "\">" + primeiraNoticiaDoTrend.title + "</a></h1>";
            let snippet = "<h3><p class=\"text-start card-text\">" + primeiraNoticiaDoTrend.snippet + "</p></h3>";
            let timeAndSource = "<h5><span class=\"text-muted\">" + primeiraNoticiaDoTrend.timeAgo + "</span> · <span class=\"badge bg-secondary text-wrap\" >" + primeiraNoticiaDoTrend.source + "<span></h5>";        
            
            vitrineNews += title + timeAndSource;
            vitrineNews += "</div>";
            vitrineNews += "</div>";
            vitrineNews += "</div>";

            if (controle) {
                vitrineNews += "</div><hr class=\"styleTwo\">";
                break;
            }
            
            controle = true;
        } catch (error) { continue; }
    }

    bodyVitrineNews.innerHTML = vitrineNews;
}

async function preencherComTrendNews(category = "h") {
    // const types = ["e", "b", "t", "m", "s", "h"];
    // const idxChoosenType = Math.floor(Math.random() * types.length);

    let response = await getRealTimeTrends(category);

    if (response.length < 1) {
        bodyTrendsNews.innerHTML = "Nenhum trend econtrado.";
        return null;
    }

    let noticias = "<h5 class=\"text-info\">Relacionadas a " + getSubjectName(category) + " em tempo real: </h5>";

    noticias += "<div class=\"container-fluid \">";
    noticias += "<div class=\"row\" >";

    for (const item of response) {
        try {
            let srcImgPrincipal = "http:" + item.image.imgUrl;
            let primeiraNoticiaDoTrend = item.articles[0];

            noticias += "<div style=\"margin-top: 30px;\" class=\"col-md-12 col-lg-6 bg-light rounded\"><br>"
            
            let img = "<div style=\"float: left; margin-right: 10px;\"><a target=\"_blank\" href=\"" + primeiraNoticiaDoTrend.url + "\"><img src=\"" + srcImgPrincipal + "\" class=\"rounded img-thumbnail\" /></a></div>";
            let title = "<h2><a class=\"text-decoration-none fw-bold text-info \" target=\"_blank\" href=\"" + primeiraNoticiaDoTrend.url + "\">" + primeiraNoticiaDoTrend.articleTitle + "</a></h2>";
            let timeAndSource = "<span class=\"badge bg-secondary text-wrap\">" + primeiraNoticiaDoTrend.source + "</span> · <span class=\"text-muted\"> " + primeiraNoticiaDoTrend.time + "</span>";
            // let entities = "<span class=\"text-success\"> " + item.entityNames.join("</span> · <span class=\"text-success \" >") + "</span>";

            noticias += img + title + "<h5>" + timeAndSource + "" + "</h5>" ;
            noticias += "<br></div>";
        } catch (error) { continue; }
    }

    noticias += "</div>";
    noticias += "</div>";

    bodyTrendsNews.innerHTML = noticias;
}

async function getYesterdayTrends() {
    let result = [];

    try {
        let ontem = new Date();
        let regx = new RegExp('/', 'g');
    
        ontem.setDate(ontem.getDate() - 1);
        ontem = ontem.toLocaleDateString('en-US').replace(regx, '-');
    
        let base = "https://tools-mkt-data.herokuapp.com/v1/gtrends/tendenciasDia?geo=BR&date=" + ontem + "&hl=pt_BR";
        result = await api(base);
    } catch (error) {
        console.error(err);
    }

    return result;
}

async function getRealTimeTrends(category = "h") {
    let result = [];

    try {
        let base = "https://tools-mkt-data.herokuapp.com/v1/gtrends/tempoReal?geo=BR&category=" + category + "&hl=pt_BR";
        result = await api(base);
    } catch (error) {
        console.error(err);
    }

    return result;
}

function api(url, verb='GET') {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open(verb, url);
		xhr.send(null);

		xhr.onreadystatechange = function () {
			if(xhr.readyState === 4){
                switch (xhr.status) {
                    case 200:
                        resolve(JSON.parse(xhr.responseText));
                        break;
                    case 404:
                        resolve(JSON.parse(xhr.responseText));
                        break;
                    case 400:
                        resolve(JSON.parse(xhr.responseText));
                        break;
                    default:
                        reject(JSON.stringify({message: 'Erro na requisicao'}));
                        break;
                }
			}
		};
	});
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getSubjectName(category) {
    const categoryName = {
        all: "tudo",
        e: "entretenimento",
        b: "negócios",
        t: "ciência/tecnologia",
        m: "saúde",
        s: "esportes",
        h: "temas", //top stories
    }
    
    return categoryName[category];
}