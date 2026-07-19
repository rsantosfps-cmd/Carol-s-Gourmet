/* ======================================
   CAROL'S GOURMET
   storage.js NOVO
====================================== */


let produtos = JSON.parse(
    localStorage.getItem("carols_gourmet")
) || [];


let produtoSelecionado = null;



/* ======================================
   INICIAR SISTEMA
====================================== */


window.addEventListener("load",()=>{


    gerarCodigos();


    mostrarProdutos();


    atualizarDashboard();


    eventos();


});





/* ======================================
   EVENTOS
====================================== */


function eventos(){


document
.getElementById("salvar")
.onclick = salvarProduto;



document
.getElementById("buscar")
.onkeyup = mostrarProdutos;



document
.getElementById("salvarEstoque")
.onclick = atualizarEstoque;



document
.getElementById("hoje")
.onclick = colocarHoje;



document
.getElementById("dataFabricacao")
.onchange = calcularValidade;



document
.getElementById("imprimirEtiqueta")
.onclick = imprimirEtiqueta;


}





/* ======================================
   GERAR CÓDIGOS
====================================== */


function gerarCodigos(){


let numero = produtos.length + 1;



document
.getElementById("codigoInterno")
.value =
"CAR" +
String(numero)
.padStart(4,"0");



document
.getElementById("codigoBarras")
.value =
gerarEAN(numero);



}



function gerarEAN(numero){


let codigo =

"789999" +

String(numero)
.padStart(6,"0");



let soma=0;



for(let i=0;i<12;i++){


let valor =
Number(codigo[i]);



if(i%2==0){

soma+=valor;

}else{

soma+=valor*3;

}


}



let resto=soma%10;


let digito =
resto===0?
0:
10-resto;



return codigo+digito;


}
document
.getElementById("codigoInterno")
.readOnly = true;


document
.getElementById("codigoBarras")
.readOnly = true;

/* ======================================
   SALVAR PRODUTO
====================================== */


function salvarProduto(){


let nome =
document
.getElementById("produto")
.value
.trim();



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




// EDITAR PRODUTO EXISTENTE

if(produtoSelecionado !== null){


    produtos[produtoSelecionado].nome = nome;


    produtos[produtoSelecionado].preco = preco;


    produtos[produtoSelecionado].estoque = estoque;



    alert(
        "Produto atualizado com sucesso!"
    );


}



// NOVO PRODUTO

else{


    let novoProduto = {


        id:Date.now(),


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



    produtos.push(novoProduto);


}


salvarDados();



mostrarProdutos();



atualizarDashboard();



limparCadastro();



gerarCodigos();


}






/* ======================================
   SALVAR NO NAVEGADOR
====================================== */


function salvarDados(){


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



if(!lista)return;



lista.innerHTML="";



let pesquisa =

document
.getElementById("buscar")
.value
.toLowerCase();




produtos

.filter(produto =>

produto.nome
.toLowerCase()
.includes(pesquisa)

)

.forEach((produto,index)=>{



lista.innerHTML += `


<tr>


<td>

${produto.codigoInterno}

</td>


<td>

${produto.nome}

</td>



<td>

R$ ${produto.preco.toFixed(2)}

</td>



<td>

${produto.estoque}

</td>



<td>

${produto.codigoBarras}

</td>



<td>



<button onclick="editarProduto(${index})">

✏️

</button>



<button onclick="abrirEstoque(${index})">

📦

</button>



<button onclick="abrirEtiqueta(${index})">

🏷️

</button>



<button onclick="excluirProduto(${index})">

🗑️

</button>



</td>



</tr>


`;



});


}






/* ======================================
   EDITAR PRODUTO
====================================== */

function editarProduto(index){


let produto = produtos[index];


produtoSelecionado = index;



// Mantém os códigos travados

document
.getElementById("codigoInterno")
.value = produto.codigoInterno;


document
.getElementById("codigoBarras")
.value = produto.codigoBarras;



// Bloqueia alteração dos códigos

document
.getElementById("codigoInterno")
.readOnly = true;


document
.getElementById("codigoBarras")
.readOnly = true;




// Campos editáveis

document
.getElementById("produto")
.value = produto.nome;



document
.getElementById("preco")
.value = produto.preco;



document
.getElementById("estoque")
.value = produto.estoque;



}





/* ======================================
   EXCLUIR PRODUTO
====================================== */


function excluirProduto(index){


let confirmar = confirm(

"Excluir este produto?"

);



if(confirmar){


produtos.splice(index,1);



salvarDados();



mostrarProdutos();



atualizarDashboard();



gerarCodigos();


}


}






/* ======================================
   LIMPAR CADASTRO
====================================== */


function limparCadastro(){


document
.getElementById("produto")
.value="";


document
.getElementById("preco")
.value="";


document
.getElementById("estoque")
.value="";


produtoSelecionado=null;


}
/* ======================================
   DASHBOARD
====================================== */


function atualizarDashboard(){


let totalProdutos =
produtos.length;



let totalEstoque = 0;

let estoqueBaixo = 0;



produtos.forEach(produto=>{


totalEstoque += Number(produto.estoque);



if(produto.estoque <= 5){

estoqueBaixo++;

}


});




let campoProdutos =
document.getElementById("totalProdutos");


let campoEstoque =
document.getElementById("totalEstoque");


let campoBaixo =
document.getElementById("estoqueBaixo");



if(campoProdutos)

campoProdutos.innerHTML =
totalProdutos;



if(campoEstoque)

campoEstoque.innerHTML =
totalEstoque;



if(campoBaixo)

campoBaixo.innerHTML =
estoqueBaixo;



}






/* ======================================
   ABRIR ESTOQUE
====================================== */


function abrirEstoque(index){


produtoSelecionado=index;



let produto =
produtos[index];



document
.getElementById("painelEstoque")
.style.display="block";



document
.getElementById("produtoEstoqueNome")
.innerHTML =
produto.nome;



document
.getElementById("estoqueAtual")
.innerHTML =
produto.estoque;



// limpa campos antigos

document
.getElementById("entrada")
.value="";


document
.getElementById("saida")
.value="";



}







/* ======================================
   ATUALIZAR ESTOQUE
====================================== */


function atualizarEstoque(){



if(produtoSelecionado===null){

alert(
"Selecione um produto primeiro"
);

return;

}



let produto =
produtos[produtoSelecionado];



let entrada =

Number(

document
.getElementById("entrada")
.value

) || 0;



let saida =

Number(

document
.getElementById("saida")
.value

) || 0;





// faz o cálculo

produto.estoque =

Number(produto.estoque)

+ entrada

- saida;





// impede negativo

if(produto.estoque < 0){

produto.estoque = 0;

}






// salva

salvarDados();



// atualiza tela

mostrarProdutos();

atualizarDashboard();





// atualiza valor mostrado

document
.getElementById("estoqueAtual")
.innerHTML =
produto.estoque;






// limpa campos depois da atualização

document
.getElementById("entrada")
.value="";


document
.getElementById("saida")
.value="";





alert(

"Estoque atualizado: "

+

produto.estoque

);




}






/* ======================================
   DATA FABRICAÇÃO
====================================== */


function colocarHoje(){


let hoje =

new Date()
.toISOString()
.substring(0,10);



document
.getElementById("dataFabricacao")
.value =
hoje;



calcularValidade();


}







function calcularValidade(){


let data =

document
.getElementById("dataFabricacao")
.value;



if(!data)return;




let validade =

new Date(data);



validade.setDate(

validade.getDate()+7

);



document
.getElementById("dataValidade")
.value =

validade
.toISOString()
.substring(0,10);



}
/* ======================================
   ETIQUETA
====================================== */


function abrirEtiqueta(index){


let produto =
produtos[index];


produtoSelecionado=index;



document
.getElementById("painelEtiqueta")
.style.display="block";



document
.getElementById("produtoEtiquetaNome")
.innerHTML =
produto.nome;



document
.getElementById("codigoEtiqueta")
.innerHTML =
produto.codigoBarras;



// gera código de barras na prévia

JsBarcode(

"#barcodePreview",

produto.codigoBarras,

{

format:"EAN13",

width:2,

height:50,

displayValue:true

}

);





}





/* ======================================
   IMPRIMIR ETIQUETA
====================================== */


function imprimirEtiqueta(){


let etiqueta = document.getElementById("previewEtiqueta").innerHTML;



let janela = window.open(
"",
"",
"width=300,height=200"
);



janela.document.write(`

<html>

<head>

<title>Etiqueta</title>


<style>

@page{

size:50mm 30mm;

margin:0;

}


body{

margin:0;

padding:0;

width:50mm;

height:30mm;

display:flex;

justify-content:center;

align-items:center;

font-family:Arial;

}


.etiqueta{

width:50mm;

height:30mm;

text-align:center;

font-size:9px;

}


svg{

width:45mm;

height:14mm;

}


</style>


</head>


<body>


${etiqueta}


</body>


</html>

`);



janela.document.close();


janela.focus();


janela.print();


janela.close();


}







/* ======================================
   ATUALIZAR ETIQUETA
====================================== */


function atualizarEtiqueta(){



let produto =

produtos[produtoSelecionado];



if(!produto)return;



document
.getElementById("produtoEtiquetaNome")
.innerHTML =
produto.nome;



document
.getElementById("codigoEtiqueta")
.innerHTML =
produto.codigoBarras;



JsBarcode(

"#barcodePreview",

produto.codigoBarras,

{

format:"EAN13",

width:2,

height:50,

displayValue:true

}

);


}







/* ======================================
   LIMPAR DADOS ANTIGOS
====================================== */


function limparDadosTeste(){


localStorage.removeItem(
"carols_gourmet"
);


location.reload();


}
