"use strict";

const containerCountries = document.querySelector(".section-countries");
const containerDetails = document.querySelector(".section-details");
const containerCard = document.querySelector(".card");

const form = document.querySelector(".form");

const inputSearch = document.querySelector(".form__input--search");
const inputFilter = document.querySelector(".form__input--filter");

const btnTheme = document.querySelector(".btn--theme");
const btnLoad = document.querySelector(".btn--load");
let btnBack;
let btnsBorder;

const spinner = document.querySelector(".spinner");

const textCountries = document.querySelector(".countries__text");

console.log(btnTheme);

class App {
  #APICountries = [];
  #searchedCountries = [];
  #filteredCountries = [];
  #renderedCountries = 0;
  #observer;
  #isFiltered = false;
  #isSearched = false;

  constructor() {
    this.#loadCreateCountry();

    btnTheme.addEventListener("click", this.#toggletheme.bind(this));
    btnLoad.addEventListener("click", this.#handleLoadClick.bind(this));
    inputSearch.addEventListener("input", this.#searchCountries.bind(this));
    inputFilter.addEventListener("input", this.#filterCountries.bind(this));

    containerCountries.addEventListener(
      "click",
      this.#renderDetails.bind(this)
    );
  }

  async #loadCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      this.#APICountries = await response.json();
    } catch (err) {
      alert(
        "Failed To load the Countries please Make sure that a stable internet connection is avaliable and reload the Page"
      );
    }
  }

  #createCountry(startIndex, endIndex, sourceArr) {
    // EMPTy ARRAY
    const countriesArr = [];

    // CREATE COUNTRY OBJECTS
    for (let i = startIndex; i <= endIndex; i++) {
      const country = sourceArr[i];
      countriesArr.push(
        new Country(
          country.name.common,
          country.population,
          country.region,
          country.subregion,
          country.capital,
          country.languages,
          country.currencies,
          country.borders,
          country.flags.png
        )
      );
      if (
        this.#renderedCountries === this.#APICountries.length - 1 &&
        sourceArr === this.#APICountries
      ) {
        this.#observer.unobserve(btnLoad);

        this.#hideSpinner();
        this.#hideLoadBtn();
        this.#renderLoadEndText();

        return countriesArr;
      }
      if (sourceArr === this.#APICountries) this.#renderedCountries++;
    }
    return countriesArr;
  }

  async #loadCreateCountry() {
    // prettier-ignore
    if (this.#renderedCountries === this.#APICountries.length - 1 && this.#renderedCountries !== 0) return;

    // LOAD COUNTRIES
    await this.#loadCountries();

    // CREATE COUNTRIES
    const countries = this.#createCountry(
      this.#renderedCountries,
      this.#renderedCountries + 19,
      this.#APICountries
    );

    this.#renderCountries(countries);
  }
  #renderCountries(countriesArr) {
    // CREATE COUNTRIES HTML

    countriesArr.forEach((country) => {
      const html = `
          <article class="card" data-name="${country.name}">
          <div class="card__img-box">
          <img
          src= ${country.flag}
          alt="${country.name} Flag"
          class="card__img"
          />
          </div>
          <div class="card__box">
          <h2 class="heading-secondary">${country.name}</h2>
          <ul class="card__list">
          <li class="card__item">
          Population: <span class="card__span">${country.population}</span>
          </li>
          <li class="card__item">
          Region: <span class="card__span">${country.region}</span>
          </li>
          <li class="card__item">
          Capital: <span class="card__span">${country.capital}</span>
          </li>
          </ul>
          </div>
          </article>
          `;
      containerCountries.insertAdjacentHTML("beforeend", html);
    });

    // prettier-ignore
    if (this.#renderedCountries === this.#APICountries.length - 1 && this.#renderedCountries !== 0) return;
    this.#renderLoadBtn();
    this.#hideSpinner();
  }

  #renderDetails(e) {
    if (!e.target.closest(".card") && !e.target.closest(".btn--border")) return;

    containerDetails.innerHTML = "";

    let target;
    let country;

    if (e.target.closest(".card")) {
      target = e.target.closest(".card");

      country = this.#APICountries.find(
        (country) => country.name.common === target.dataset.name
      );
    }
    if (e.target.closest(".btn--border")) {
      target = e.target.closest(".btn--border");

      country = this.#APICountries.find(
        (country) =>
          country.name.common.toLowerCase() === target.textContent.toLowerCase()
      );
    }

    let borderCountries;
    if (country.borders) {
      borderCountries = this.#APICountries.filter((APICountry, i) => {
        for (let i = 0; i < country.borders.length; i++) {
          if (country.borders[i].includes(APICountry.cca3)) return true;
          else continue;
        }
      });
    }

    const nativeName = Object.values(country.name.nativeName)[
      Object.values(country.name.nativeName).length - 1
    ].common;
    const population = new Intl.NumberFormat(navigator.language).format(
      country.population
    );
    const currencies = Object.values(country.currencies)[0].name;

    const languages = Object.values(country.languages);
    console.log(country.cca3);

    let html = ` 
    <div>
    <div class="btn-box--back u-margin-bottom-large">
      <button class="btn btn--back">&larr; Back</button>
    </div>
    <div class="details__img-box">
      <img
        src="${country.flags.png}"
        alt="${country.name.common} Flag"
        class="details__img"
      />
    </div>
  </div>
  <div class="details__text">
    <h2 class="heading-secondary u-font-large u-margin-bottom-small">
      ${country.name.common}
    </h2>
    <ul class="details__list details__list--left">
      <li class="details__item">
        Native Name: <span class="details__span">${nativeName}</span>
      </li>
      <li class="details__item">
        Population: <span class="details__span">${population}</span>
      </li>
      <li class="details__item">
        Region: <span class="details__span">${country.region}</span>
      </li>
      <li class="details__item">
        Sub Region: <span class="details__span">${country.subregion}</span>
      </li>
      <li class="details__item">
        Capital: <span class="details__span">${country.capital}</span>
      </li>
    </ul>
    <ul class="details__list">
      <li class="details__item">
        Top Level Domain: <span class="details__span">${country.tld}</span>
      </li>
      <li class="details__item">
        Currencies: <span class="details__span">${currencies}</span>
      </li>
      <li class="details__item">
        Languages: <span class="details__span">${languages}</span>
      </li>
    </ul>
    <div class="details__borders-box">
    `;

    if (country.borders) {
      html += `
        <h3 class="heading-tertiary u-margin-bottom-small">
            Border Countries:
        </h3>
        <ul class="details__list details__list--borders">`;

      borderCountries.forEach((borderCountry, i, arr) => {
        if (arr.length - 1 > i) {
          html += `
                <li class="details__item">
                <button class="btn btn--border">${borderCountry.name.common}</button>
                </li>
                `;
        } else {
          html += `
                <li class="details__item">
                <button class="btn btn--border">${borderCountry.name.common}</button>
                </li>
            </ul>
            </div>
      </div>`;
        }
      });
    }

    containerDetails.insertAdjacentHTML("beforeend", html);

    containerDetails.classList.add("section-details--active");

    containerDetails.style.top = `${window.scrollY}px`;

    document.body.classList.add("u-overflow-hidden");

    btnBack = document.querySelector(".btn--back");
    btnsBorder = document.querySelectorAll(".btn--border");
    btnBack.addEventListener("click", this.#hideDetails.bind(this));
    btnsBorder.forEach((btn) => {
      btn.addEventListener("click", this.#renderDetails.bind(this));
    });
    window.addEventListener("resize", function () {
      containerDetails.style.top = `${window.scrollY}px`;
    });
  }

  #hideDetails() {
    document.body.classList.remove("u-overflow-hidden");
    containerDetails.classList.remove("section-details--active");
  }
  #renderSpinner() {
    spinner.classList.remove("u-display-none");
  }
  #hideSpinner() {
    spinner.classList.add("u-display-none");
  }
  #hideLoadBtn() {
    btnLoad.classList.add("u-display-none");
  }
  #renderLoadBtn() {
    btnLoad.classList.remove("u-display-none");
  }
  #renderLoadEndText() {
    textCountries.classList.remove("u-display-none");
  }

  #toggletheme() {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  }

  // LAZY LOADING
  #observeCountries() {
    const options = {
      root: null,
      rootMargin: "500px",
      threshold: 0.1,
    };
    this.#observer = new IntersectionObserver(
      this.#loadMore.bind(this),
      options
    );

    this.#observer.observe(btnLoad);
  }
  #loadMore(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    this.#hideLoadBtn();
    this.#renderSpinner();
    this.#loadCreateCountry();
  }

  #handleLoadClick() {
    this.#loadCreateCountry();
    this.#observeCountries();
  }

  // Search

  #searchCountries() {
    this.#isSearched = true;
    const searchValue = inputSearch.value.trimEnd();

    document.querySelectorAll(".card").forEach((card) => card.remove());
    if (searchValue === "") {
      this.#isSearched = false;
      if (this.#isFiltered) {
        this.#filterCountries();
        return;
      }
      this.#loadCreateCountry();
      this.#renderLoadBtn();
      return;
    }

    const sourceArr = this.#isFiltered
      ? this.#filteredCountries
      : this.#APICountries;
    this.#searchedCountries = sourceArr.filter(
      (country) =>
        country.name.common.slice(0, searchValue.length).toLowerCase() ===
        searchValue
    );
    const countries = this.#createCountry(
      0,
      this.#searchedCountries.length - 1,
      this.#searchedCountries
    );
    this.#renderCountries(countries);

    this.#hideLoadBtn();
  }
  #filterCountries() {
    this.#isFiltered = true;
    const filterValue = inputFilter.value;

    document.querySelectorAll(".card").forEach((card) => card.remove());

    if (filterValue === "") {
      this.#loadCreateCountry();
      this.#renderLoadBtn();
      return;
    }
    const sourceArr = this.#isSearched
      ? this.#searchedCountries
      : this.#APICountries;

    this.#filteredCountries = sourceArr.filter((country) => {
      console.log(country, country.region);
      return country.region.toLowerCase() === filterValue;
    });

    console.log(this.#filteredCountries);

    const countries = this.#createCountry(
      0,
      this.#filteredCountries.length - 1,
      this.#filteredCountries
    );
    this.#renderCountries(countries);

    this.#hideLoadBtn();
  }
}

class Country {
  // prettier-ignore
  constructor(name,population,region,subRegion,capital,languages,currencies,borderCountries,flag) {
    this.name = name;
    this.population = new Intl.NumberFormat(navigator.language).format(population);
    this.region = region;
    this.subRegion = subRegion;
    this.capital = capital;
    this.languages = languages;
    this.currencies = currencies;
    this.borderCountries = borderCountries;
    this.flag = flag;
}
}
new App();

/* 

     <div>
          <div class="btn-box--back u-margin-bottom-large">
            <button class="btn btn--back">&larr; Back</button>
          </div>
          <div class="details__img-box">
            <img
              src="https://images.unsplash.com/photo-1515787366009-7cbdd2dc587b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="#"
              class="details__img"
            />
          </div>
        </div>
        <div class="details__text">
          <h2 class="heading-secondary u-font-large u-margin-bottom-small">
            Germany
          </h2>
          <ul class="details__list details__list--left">
            <li class="details__item">
              Native Name: <span class="details__span">Belgie</span>
            </li>
            <li class="details__item">
              Population<span class="details__span"></span>
            </li>
            <li class="details__item">
              Region<span class="details__span"></span>
            </li>
            <li class="details__item">
              Sub Region<span class="details__span"></span>
            </li>
            <li class="details__item">
              Capital<span class="details__span"></span>
            </li>
          </ul>
          <ul class="details__list">
            <li class="details__item">
              Top Level Domain <span class="details__span"></span>
            </li>
            <li class="details__item">
              Currencies <span class="details__span"></span>
            </li>
            <li class="details__item">
              Languages<span class="details__span"></span>
            </li>
          </ul>
          <div class="details__borders-box">
            <h3 class="heading-tertiary u-margin-bottom-small">
              Border Countries:
            </h3>
            <ul class="details__list details__list--borders">
              <li class="details__item">
                <button class="btn btn--border">France</button>
              </li>
              <li class="details__item">
                <button class="btn btn--border">Germany</button>
              </li>
              <li class="details__item">
                <button class="btn btn--border">Portugal</button>
              </li>
            </ul>
          </div>
        </div>
*/
