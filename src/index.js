let _ = require('lodash');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const fetchCountries = async name => {
  return await fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.length);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length <= 10 && data.length > 1) {
        data.forEach(country => {
          // Lists up to 10 countries that match entered value
          countryListEl(country);
        });
      } else {
        data.forEach(country => {
          // Creates html element for country with more detailed information
          countryInfoDetails(country);
        });
      }
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
};

inputCountry.addEventListener(
  'input',
  _.debounce(() => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    if (inputCountry.value == '') {
      return;
    } else {
      fetchCountries(inputCountry.value.trim());

    }
  }, DEBOUNCE_DELAY)
);

const countryListEl = country => {
  countryList.insertAdjacentHTML(
    'beforeend',
    `
  <li class="country-list__element">
    <img src="${country.flags.svg}" alt="${country.flags.svg}"/>
    <p>${country.name.common}</p>
   </li>`
  );
};

const countryInfoDetails = country => {
  countryInfo.innerHTML = `
  <img src="${country.flags.svg}" alt="${country.flags.svg}"/>
  <h2>${country.name.common}</h2>
  <p><span class="bold">Capital:</span> ${country.capital}</p>
  <p><span class="bold">Population:</span> ${country.population}</p>
  <p><span class="bold">Languages:</span> ${Object.values(country.languages)}</>
  `;
};
