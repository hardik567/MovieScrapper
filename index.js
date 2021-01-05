const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const papa = require('papaparse');
const fs = require('fs')


// Collecting data from website
const getHTML = async() => {
    const baseUrl = 'https://www.imdb.com/list/ls050101906/'
    const response = await axios.get(baseUrl);
    return response.data;
}

// converting data to excel format
const convert = (htmlString) => {
    const dom = new JSDOM(htmlString);
const {document} = dom.window;
const ele = document.querySelectorAll('.lister-item.mode-detail')

const movies = [];
for (let i = 0; i <ele.length ; i++) {
    const card = ele[i];
    movies[i] = {
        Name : card.querySelector('.lister-item-header a').textContent,
        ReleaseDate : card.querySelector('.lister-item-year').textContent.replace('(','').replace(')',''),
        Genre : card.querySelector('.genre').textContent.trim(),
        Rating : `${card.querySelector('.ipl-rating-star__rating').textContent}/10`,
    }
}
return movies;
}



// Create an excel sheet
const createExcel = (movieData) => {
const csv = papa.unparse(movieData);
fs.writeFileSync('movies.csv', csv);
}


const main = async () => {
    console.log('----!Starting Scraping!----')

    const html = await getHTML();
    const ConvertedStuff = convert(html);
    createExcel(ConvertedStuff);
    console.log('----Done----')
    
}

main (); 