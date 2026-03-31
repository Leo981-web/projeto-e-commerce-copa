const axios = require("axios");

// function mostraInter() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (1 != 1) {
//         resolve("Inter");
//       }

//       reject("Ocorreu um erro");
//     }, 3000);
//   });
// }

// // function buscarVariosDados() {
// //     return new Promise.all((resolve, reject) => { first })
// // }

// function mostraGremio() {
//   return "Gremio";
// }

// // mostraInter()
// //   .then((valor) => console.log(valor))
// //   .catch((err) => console.log(err));
// // console.log(mostraGremio());

// async function mostraTimes() {
//   try {
//     response = await mostraInter();
//     console.log(response);
//     console.log(mostraGremio());
//   } catch (err) {
//     console.log(err);
//   }
// }

// mostraTimes();

// async function buscarCep(cep) {
//   try {
//     let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
//     let endereco = await response.json();
//     console.log(endereco);
//   } catch (error) {
//     console.log(error);
//     console.error("Ocorreu um erro ao buscar o CEP " + cep);
// //   }
// }

async function buscarCep(cep) {
  try {
    let response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
    console.error("Ocorreu um erro ao buscar o CEP " + cep);
  }
}

buscarCep("99025414");
