let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

let editando = null;


// ===============================
// GERAR CÓDIGO AUTOMÁTICO
// ===============================

function gerarCodigo(){

    let maior = 0;

    produtos.forEach(p => {

        let numero = parseInt(p.codigo);

        if(numero > maior){
            maior = numero;
        }

    });


    maior++;


    return maior.toString().padStart(12,"0");

}



// ===============================
// SALVAR PRODUTO
// ===============================

function salvarProduto(){


let codigo;



// Se estiver editando mantém o código
if(editando !== null){

    codigo = produtos[editando].codigo;

}else{

    codigo = gerarCodigo();

}



let produto = {

    codigo: codigo,

    nome: document.getElementById("produto").value,

    preco: document.getElementById("preco").value,

    estoque: document.getElementById("estoque").value

};



if(editando !== null){


    produtos[editando] = produto;

    editando = null;


}else{


    produtos.push(produto);


}



localStorage.setItem(
    "produtos",
    JSON.stringify(produtos)
);



mostrarCodigo(codigo);

limparCampos();

mostrarProdutos();



}



// ===============================
// MOSTRAR PRODUTOS
// ===============================

function mostrarProdutos(){


let lista = document.getElementById("lista");


lista.innerHTML="";



produtos.forEach((p,index)=>{


lista.innerHTML += `

<tr>

<td>${p.codigo}</td>

<td>${p.nome}</td>

<td>R$ ${p.preco}</td>

<td>${p.estoque}</td>

<td>

<button onclick="editarProduto(${index})">
Editar
</button>


<button onclick="excluirProduto(${index})">
Excluir
</button>


<button onclick="abrirEtiqueta(${index})">
Etiqueta
</button>


</td>

</tr>

`;


});


}



// ===============================
// EDITAR
// ===============================

function editarProduto(index){


let p = produtos[index];


document.getElementById("produto").value = p.nome;

document.getElementById("preco").value = p.preco;

document.getElementById("estoque").value = p.estoque;


editando = index;


mostrarCodigo(p.codigo);


gerarCodigoBarras(p.codigo);


}




// ===============================
// EXCLUIR
// ===============================

function excluirProduto(index){


if(confirm("Excluir produto?")){


produtos.splice(index,1);


localStorage.setItem(
"produtos",
JSON.stringify(produtos)
);


mostrarProdutos();


}


}



// ===============================
// MOSTRAR CÓDIGO GERADO
// ===============================

function mostrarCodigo(codigo){


let campo = document.getElementById("codigoGerado");


if(campo){

campo.innerHTML = 
"Código gerado: <br>" + codigo;

}


}



// ===============================
// GERAR CÓDIGO DE BARRAS
// ===============================

function gerarCodigoBarras(codigo){


JsBarcode("#barcode", codigo, {

format:"CODE128",

width:2,

height:80,

displayValue:true

});


}



// ===============================
// GERAR ETIQUETA
// ===============================

function gerarEtiqueta(index){


let produto = produtos[index];


mostrarCodigo(produto.codigo);


gerarCodigoBarras(produto.codigo);


}



// ===============================
// IMPRIMIR ETIQUETA
// ===============================
function imprimirEtiqueta(){


let codigo = produtoEtiqueta.codigo;


let fabricacao =
document.getElementById("dataFabricacaoEtiqueta").value;


let validade =
document.getElementById("dataValidadeEtiqueta").value;



let fab = fabricacao.split("-").reverse().join("/");

let val = validade.split("-").reverse().join("/");



let janela = window.open(
"",
"",
"width=400,height=300"
);



janela.document.write(`

<html>

<head>

<style>

@page{

size:50mm 30mm;

margin:0;

}


body{

width:50mm;

height:30mm;

margin:0;

text-align:center;

font-family:Arial;

font-size:8px;

}


.titulo{

font-weight:bold;

font-size:9px;

}


svg{

width:45mm;

height:12mm;

}


</style>

</head>


<body>


<div class="titulo">
CAROL'S GOURMET
</div>


FAB: ${fab}

<br>

VAL: ${val}


<svg id="barcode"></svg>



<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>



<script>


JsBarcode("#barcode","${codigo}",{

format:"CODE128",

width:1.5,

height:35,

displayValue:true,

fontSize:10

});


window.print();


</script>


</body>

</html>


`);


janela.document.close();



}


// ===============================
// LIMPAR CAMPOS
// ===============================

function limparCampos(){


document.getElementById("produto").value="";

document.getElementById("preco").value="";

document.getElementById("estoque").value="";


}



// INICIAR

mostrarProdutos();
function calcularValidade(){

let fabricacao = document.getElementById("fabricacao").value;


if(fabricacao){

let data = new Date(fabricacao);


data.setDate(data.getDate()+7);


let ano = data.getFullYear();

let mes = String(data.getMonth()+1).padStart(2,"0");

let dia = String(data.getDate()).padStart(2,"0");


document.getElementById("validade").value =
`${ano}-${mes}-${dia}`;

}

}
let produtoEtiqueta = null;


// abrir painel de etiqueta

function abrirEtiqueta(index){


produtoEtiqueta = produtos[index];


document.getElementById("painelEtiqueta").style.display="block";


}


// calcular validade +7 dias

function calcularValidadeEtiqueta(){


let data =
document.getElementById("dataFabricacaoEtiqueta").value;



if(data){


let validade = new Date(data);


validade.setDate(
validade.getDate()+7
);



let ano = validade.getFullYear();

let mes = String(validade.getMonth()+1).padStart(2,"0");

let dia = String(validade.getDate()).padStart(2,"0");



document.getElementById("dataValidadeEtiqueta").value =
`${ano}-${mes}-${dia}`;



}



}
