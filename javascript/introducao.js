//Debugar código
//console.log
//console.error
//console.warn
//console.table

//String
/*console.log(typeof "Augusto");

//number
console.log(typeof 1);
console.log(typeof 1.1);

//boolean
console.log(typeof true);

//[1, 2, 3, 4] = object
lista = [1, 2, 3, 4];
console.log(typeof lista);

// {} = object
obj = {
  nome: "augusto",
};
console.log(typeof obj);

console.log(Array.isArray(lista));
console.log(Array.isArray(obj));
*/

//Estruturas de condicao
/*nota = 8;
if (nota == 7 || nota > 7) {
  console.log("Aprovado");
} else if (nota >= 3) {
  console.log("Pegou exame");
} else {
  console.log("Reprovado");
}

// IF TERNÁRIO
statusDoAluno =
  nota >= 7 ? "Aprovado" : nota >= 3 ? "Pegou exame" : "Reprovado";
console.log(statusDoAluno);
*/
//switch case
/*uf = "PR";
switch (uf) {
  case "RS":
    console.log("Rio Grande do Sul");
    break;
  case "SC":
    console.log("Santa Catarina");
    break;
  default:
    console.log("UF inválido");
    break;
}
*/

// contador = 0;
// while (contador < 10) {
//   console.log(contador);

//   if (contador == 7) {
//     console.log("saindo...");
//     break;
//   }

//   contador++;
// }

//for loop
// for (i = 0; i < 10; i++) {
//   console.log(i);
// }

//for in
// obj = {
//   nome: "augusto",
//   idade: 25,
// };

// for (chave in obj) {
//   console.log(obj[chave]);
// }

//for of
lista = ["Augusto", "Maria", "Carlos"];
for (valor of lista) {
  console.log(valor);
}

//declaracao de funcao tradicional
function digaOla() {
  console.log("Ola");
}

//declaracao arrow function
soma = () => console.log(10 + 15);
soma();
