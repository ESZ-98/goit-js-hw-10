import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

listCountry.style.listStyle = 'none';

function inputSearch(event) {
  event.preventDefault();
  const inputValue = searchBox.value.trim();
  if (inputValue) {
    fetchCountries(inputValue)
      .then(countries => {
        console.log(countries);
        if (countries.length > 1 && countries.length < 11) {
          infoCountry.innerHTML = '';
          renderListCountry(countries);
        } else if (countries.length === 1) {
          listCountry.innerHTML = '';
          renderInfoCountry(countries);
        } else if (countries.length > 10) {
          listCountry.innerHTML = '';
          infoCountry.innerHTML = '';
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(error => {
        infoCountry.innerHTML = '';
        listCountry.innerHTML = '';
        console.log(error.name);
      });
  } else {
    infoCountry.innerHTML = '';
    listCountry.innerHTML = '';
  }
}

function renderInfoCountry(countries) {
  const { flags, name, capital, population, languages } = countries[0];
  const markup = `
    <span><img src = "${flags.svg}" width = "40"></span>
    <span style= "font-size: 24px"> <b>${name.official}</b></span>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b> ${Object.values(languages)}</p>
    `;
  infoCountry.innerHTML = markup;
}

function renderListCountry(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li> <span><img src = "${flags.svg}" width = "40"></span> <span>${name.official}</span></li>`;
    })
    .join('');
  listCountry.innerHTML = markup;
}

searchBox.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));
