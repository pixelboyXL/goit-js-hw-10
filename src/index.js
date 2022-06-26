// Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою. 
// Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку.
// Напиши функцію fetchCountries(name), яка робить HTTP - запит на ресурс name і повертає проміс з масивом країн - результатом запиту.

// У відповіді від бекенду повертаються об'єкти, велика частина властивостей яких, тобі не знадобиться. Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів.
// Назву країни для пошуку користувач вводить у текстове поле input#search-box. HTTP-запити виконуються при введенні назви країни, тобто на події input. Але робити запит з кожним натисканням клавіші не можна, оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.
// Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст.
// Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.
// Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.

// Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою.
// Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.
// Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.

// Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено. Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів.

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './jss/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector("#search-box");
const list = document.querySelector(".country-list");
const div = document.querySelector(".country-info");

let searchCountryName = '';

input.addEventListener("input", debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
    searchCountryName = input.value.trim();
    if (searchCountryName === '') {
        clearAll();
        return;
    } else fetchCountries(searchCountryName).then(countryNames => {
        if (countryNames.length < 2) {
            createCountrieCard(countryNames);
            Notiflix.Notify.success('Here your result');
        } else if (countryNames.length < 10 && countryNames.length > 1) {
            createCountrieList(countryNames);
            Notiflix.Notify.success('Here your results');
        } else {
            clearAll();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        };
    })
        .catch(() => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
};

function createCountrieCard(country) {
    clearAll();
    const c = country[0];
    const readyCard = `<div class="country-card">
        <div class="country-card--header">
            <img src="${c.flags.svg}" alt="Country flag" width="55", height="35">
            <h2 class="country-card--name"> ${c.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${c.capital}</span></p>
            <p class="country-card--field">Population: <span class="country-value">${c.population}</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(c.languages).join(',')}</span></p>
    </div>`
    div.innerHTML = readyCard;
};

function createCountrieList(country) {
    clearAll();
    const readyList = country.map((c) => 
        `<li class="country-list--item">
            <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${c.name.official}</span>
        </li>`)
        .join("");
    list.insertAdjacentHTML('beforeend', readyList);
};

function clearAll() {
  list.innerHTML = '';
  div.innerHTML = '';
};