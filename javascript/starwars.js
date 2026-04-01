const axios = require("axios");

const BASE_URL = "https://swapi.dev/api";

async function getPeople(peopleId) {
  const response = await axios.get(`${BASE_URL}/people/${peopleId}`);
  let { name, gender, homeworld, films } = response.data;
  console.table([name, gender, homeworld, films]);
  const response2 = await axios.get(homeworld);
  let homeworldName = response2?.data?.name; //quando colocamos ? antes do ponto, estamos tratando como opcional o valor
  console.log(homeworldName);

  //   for (let film of films) {
  //     const response3 = await axios.get(film);
  //     filmTitles.push(response3.data.title);
  //   }

  const promises = films.map((film) => axios.get(film));

  const response4 = await Promise.all(promises);
  let filmTitles = response4.map((resp) => resp.data.title);
  console.table(filmTitles);
}

getPeople(1);
