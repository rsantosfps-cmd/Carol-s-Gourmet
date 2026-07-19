/* ======================================
   CAROL'S GOURMET
   storage.js
====================================== */


let produtos = JSON.parse(
    localStorage.getItem("carols_gourmet")
) || [];

let produtoSelecionado = null;



/* ======================================
   INICIALIZAÇÃO
====================================== */


window.onload = function(){

    gerarCodigos();

    mostrarProdutos();

    atualizarDashboard();

    configurarEventos();

};





/* ======================================
   EVENTOS
====================================== */


function configurarEventos(){


document
.getElementById("salvar")
.addEventListener(
"click",
salvarProduto
);



document
.getElementById("buscar")
.addEventListener(
"keyup",
mostrarProdutos
);



document
.getElementById("hoje")
.addEventListener(
"click",
function(){

let hoje =
new Date()
.toISOString()
.substring(0,10);


document
.getElementById("dataFabricacao")
.value = hoje;


calcularValidade();

});


document
.getElementById("dataFabricacao")
.addEventListener(
"change",
calcularValidade
);


document
.getElementById("salvarEstoque")
.addEventListener(
"click",
movimentarEstoque
);


document
.getElementById("imprimirEtiqueta")
.addEventListener(
"click",
imprimirEtiqueta
);


}






/* ======================================
   CÓDIGOS AUTOMÁTICOS
====================================== */


function gerarCodigos(){


let numero =
produtos.length + 1;


document
.getElementById("codigoInterno")
.value =
"CAR" +
String(numero)
.padStart(4,"0");



let ean =
gerarEAN13(numero);



document
.getElementById("codigoBarras")
.value =
ean;


}






/* ======================================
   EAN 13
====================================== */


function gerarEAN13(numero){


let base =
"789999" +
String(numero)
.padStart(6,"0");



let soma = 0;


for(
let i=0;
i<12;
i++
){


let n =
parseInt(base[i]);


if(i % 2 === 0){

soma += n;

}

else{

soma += n*3;

}


}



let resto =
soma % 10;



let digito =
resto === 0
?
0
:
10-resto;



return base + digito;


}






/* ======================================
   SALVAR PRODUTO
====================================== */


function salvarProduto(){



let nome =
document
.getElementById("produto")
.value;



let preco =
Number(
document
.getElementById("preco")
.value
);



let estoque =
Number(
document
.getElementById("estoque")
.value
);



if(nome===""){

alert(
"Digite o nome do produto"
);

return;

}





let produto = {


id:
Date.now(),


codigoInterno:
document
.getElementById("codigoInterno")
.value,


codigoBarras:
document
.getElementById("codigoBarras")
.value,


nome:nome,


preco:preco,


estoque:estoque

};




produtos.push(produto);



salvar();



limparFormulario();



mostrarProdutos();



atualizarDashboard();



gerarCodigos();



}






/* ======================================
   SALVAR LOCAL
====================================== */


function salvar(){

localStorage.setItem(

"carols_gourmet",

JSON.stringify(produtos)

);

}






/* ======================================
   MOSTRAR PRODUTOS
====================================== */


function mostrarProdutos(){


let lista =
document
.getElementById("listaProdutos");



lista.innerHTML="";



let busca =
document
.getElementById("buscar")
.value
.toLowerCase();





produtos
.filter(p=>

p.nome
.toLowerCase()
.includes(busca)

)
.forEach((p,index)=>{



lista.innerHTML += `


<tr>

<td>${p.codigoInterno}</td>

<td>${p.nome}</td>

<td>
R$ ${p.preco.toFixed(2)}
</td>

<td>${p.estoque}</td>

<td>${p.codigoBarras}</td>


<td>


<button onclick="editar(${index})">
✏️
</button>


<button onclick="abrirEstoque(${index})">
📦
</button>


<button onclick="abrirEtiqueta(${index})">
🏷️
</button>


<button onclick="excluir(${index})">
🗑️
</button>


</td>


</tr>


`;



});


}






/* ======================================
   EDITAR
====================================== */


function editar(index){


let p =
produtos[index];



document
.getElementById("produto")
.value=p.nome;


document
.getElementById("preco")
.value=p.preco;


document
.getElementById("estoque")
.value=p.estoque;



produtoSelecionado=index;



}






/* ======================================
   EXCLUIR
====================================== */


function excluir(index){


if(confirm("Excluir produto?")){


produtos.splice(index,1);


salvar();


mostrarProdutos();


atualizarDashboard();


}


}






/* ======================================
   DASHBOARD
====================================== */


function atualizarDashboard(){


document
.getElementById("totalProdutos")
.innerHTML =
produtos.length;



let total=0;

let baixo=0;



produtos.forEach(p=>{


total += p.estoque;


if(p.estoque<=5){

baixo++;

}


});



document
.getElementById("totalEstoque")
.innerHTML =
total;



document
.getElementById("estoqueBaixo")
.innerHTML =
baixo;


}






/* ======================================
   ESTOQUE
====================================== */


function abrirEstoque(index){


produtoSelecionado=index;



let p =
produtos[index];



document
.getElementById("painelEstoque")
.style.display="block";



document
.getElementById("produtoEstoqueNome")
.innerHTML=p.nome;



document
.getElementById("estoqueAtual")
.innerHTML=p.estoque;


}





function movimentarEstoque(){



let p =
produtos[produtoSelecionado];



let entrada =
Number(
document
.getElementById("entrada")
.value
);



let saida =
Number(
document
.getElementById("saida")
.value
);



p.estoque += entrada;

p.estoque -= saida;



salvar();


mostrarProdutos();


atualizarDashboard();


alert(
"Estoque atualizado"
);


}






/* ======================================
   ETIQUETA
====================================== */


function abrirEtiqueta(index){


let p =
produtos[index];


produtoSelecionado=index;



document
.getElementById("painelEtiqueta")
.style.display="block";



document
.getElementById("produtoEtiquetaNome")
.innerHTML=p.nome;



document
.getElementById("codigoEtiqueta")
.innerHTML=p.codigoBarras;



JsBarcode(
"#barcodePreview",
p.codigoBarras,
{
format:"EAN13",
width:2,
height:50
}
);


}







function calcularValidade(){


let data =
document
.getElementById("dataFabricacao")
.value;



if(!data)return;



let d =
new Date(data);



d.setDate(
d.getDate()+7
);



document
.getElementById("dataValidade")
.value =
d.toISOString()
.substring(0,10);



}






function imprimirEtiqueta(){


window.print();


}







function limparFormulario(){


document
.getElementById("produto")
.value="";


document
.getElementById("preco")
.value="";


document
.getElementById("estoque")
.value="";


}
