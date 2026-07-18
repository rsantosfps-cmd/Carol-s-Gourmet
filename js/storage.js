let produtos = JSON.parse(localStorage.getItem("produtos")) || [];


function salvarProduto(){

let produto = {

codigo: document.getElementById("codigo").value,

nome: document.getElementById("produto").value,

preco: document.getElementById("preco").value,

estoque: document.getElementById("estoque").value

};


produtos.push(produto);


localStorage.setItem(
"produtos",
JSON.stringify(produtos)
);


mostrarProdutos();


}


function mostrarProdutos(){

let lista = document.getElementById("lista");

lista.innerHTML="";


produtos.forEach(p=>{


lista.innerHTML += `

<tr>

<td>${p.codigo}</td>

<td>${p.nome}</td>

<td>R$ ${p.preco}</td>

<td>${p.estoque}</td>

</tr>

`;

});


}


mostrarProdutos();
