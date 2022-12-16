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
        console.log(data);
        data.forEach(country => {
          let newCountry = document.createElement('li');
          let flag = document.createElement('img');
          let name = document.createElement('p');

          countryList.appendChild(newCountry);
          newCountry.appendChild(flag);
          newCountry.appendChild(name);
          newCountry.classList.add('country-list__element');
          flag.setAttribute('src', country.flags.svg);
          flag.setAttribute('alt', country.name.official);
          name.innerHTML = `${country.name.common}`;
        });
      } else {
        console.log(data);
        data.forEach(country => {
          let countryFlag = document.createElement('img');
          let countryName = document.createElement('h2');
          let capital = document.createElement('p');
          let population = document.createElement('p');
          let languages = document.createElement('p');

          countryInfo.appendChild(countryFlag);
          countryFlag.setAttribute('src', country.flags.svg);
          countryFlag.setAttribute('alt', country.name.official);

          countryInfo.appendChild(countryName);
          countryName.innerHTML = `${country.name.common}`;

          countryInfo.appendChild(capital);
          capital.innerHTML = `<span class="bold">Capital:</span> ${country.capital}`;

          countryInfo.appendChild(population);
          population.innerHTML = `<span class="bold">Population:</span> ${country.population}`;
          countryInfo.appendChild(languages);
          languages.innerHTML = `<span class="bold">Languages:</span> ${Object.values(
            country.languages
          )}`;
        });
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
};

inputCountry.addEventListener(
  'input',
  _.debounce(() => {
    if (inputCountry.value == '') {
      countryInfo.innerHTML = '';
      return;
    } else {
      fetchCountries(inputCountry.value.trim());
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    }
  }, DEBOUNCE_DELAY)
);
