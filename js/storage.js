let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

let editando = null;

let produtoEtiqueta = null;

let produtoEstoque = null;


// ==============================
// GERAR CÓDIGO INTERNO
// ==============================

function gerarCodigoInterno(){

    let numero = produtos.length + 1;

    return "PROD" + String(numero).padStart(3,"0");

}



// ==============================
// GERAR CÓDIGO DE BARRAS
// ==============================

function gerarCodigoBarras(){

    let maior = 200000000000;


    produtos.forEach(p=>{

        let codigo = Number(p.codigo);

        if(codigo > maior){

            maior = codigo;

        }

    });


    return String(maior + 1);

}



// ==============================
// SALVAR PRODUTO
// ==============================

function salvarProduto(){


let produto = {

    codigoInterno:
    editando !== null 
    ? produtos[editando].codigoInterno 
    : gerarCodigoInterno(),


    codigo:
    editando !== null 
    ? produtos[editando].codigo 
    : gerarCodigoBarras(),



    nome:
    document.getElementById("produto").value,


    preco:
    document.getElementById("preco").value,


    estoque:
    Number(document.getElementById("estoqueInicial").value || 0)

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



mostrarProdutos();


limparCampos();


mostrarCodigo(produto.codigo);

mostrarCodigoInterno(produto.codigoInterno);


}




// ==============================
// MOSTRAR PRODUTOS
// ==============================

function mostrarProdutos(){


let lista =
document.getElementById("lista");


lista.innerHTML="";



produtos.forEach((p,index)=>{


let alerta = "";


if(p.estoque <=5){

alerta = " ⚠️";

}



lista.innerHTML += `


<tr>


<td>
${p.codigoInterno}
</td>



<td>
${p.nome}
</td>



<td>
${p.estoque}${alerta}
</td>



<td>
${p.codigo}
</td>



<td>



<button onclick="editarProduto(${index})">
Editar
</button>



<button onclick="abrirEtiqueta(${index})">
Etiqueta
</button>



<button onclick="abrirEstoque(${index})">
Estoque
</button>



<button onclick="excluirProduto(${index})">
Excluir
</button>



</td>


</tr>


`;



});


}





// ==============================
// EDITAR
// ==============================

function editarProduto(index){


let p = produtos[index];


document.getElementById("produto").value =
p.nome;


document.getElementById("preco").value =
p.preco;


document.getElementById("estoqueInicial").value =
p.estoque;



editando=index;



mostrarCodigo(p.codigo);

mostrarCodigoInterno(p.codigoInterno);



}





// ==============================
// EXCLUIR
// ==============================

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





// ==============================
// CÓDIGOS NA TELA
// ==============================

function mostrarCodigo(codigo){


let campo =
document.getElementById("codigoGerado");


if(campo){

campo.innerHTML =
"Código de barras: " + codigo;

}


}



function mostrarCodigoInterno(codigo){


let campo =
document.getElementById("codigoInternoGerado");


if(campo){

campo.innerHTML =
"Código interno: " + codigo;

}


}




// ==============================
// ESTOQUE
// ==============================


function abrirEstoque(index){


produtoEstoque = produtos[index];


document.getElementById("painelEstoque").style.display="block";


document.getElementById("produtoEstoqueNome").innerHTML =
produtoEstoque.nome;


document.getElementById("estoqueAtual").innerHTML =
produtoEstoque.estoque;



}




function atualizarEstoque(){


let entrada =
Number(document.getElementById("entradaEstoque").value || 0);



let saida =
Number(document.getElementById("saidaEstoque").value || 0);




produtoEstoque.estoque =
produtoEstoque.estoque + entrada - saida;



localStorage.setItem(
"produtos",
JSON.stringify(produtos)
);



mostrarProdutos();



document.getElementById("estoqueAtual").innerHTML =
produtoEstoque.estoque;



}





// ==============================
// ETIQUETA
// ==============================


function abrirEtiqueta(index){


produtoEtiqueta = produtos[index];


document.getElementById("painelEtiqueta").style.display="block";


document.getElementById("produtoEtiquetaNome").innerHTML =
produtoEtiqueta.nome;


document.getElementById("produtoEtiquetaCodigo").innerHTML =
produtoEtiqueta.codigo;



}




function colocarHoje(){


let hoje = new Date();


let ano = hoje.getFullYear();

let mes =
String(hoje.getMonth()+1).padStart(2,"0");

let dia =
String(hoje.getDate()).padStart(2,"0");



document.getElementById("dataFabricacaoEtiqueta").value =
`${ano}-${mes}-${dia}`;



calcularValidadeEtiqueta();


}




function calcularValidadeEtiqueta(){


let data =
document.getElementById("dataFabricacaoEtiqueta").value;



if(data){


let validade =
new Date(data);


validade.setDate(
validade.getDate()+7
);



let ano =
validade.getFullYear();


let mes =
String(validade.getMonth()+1).padStart(2,"0");


let dia =
String(validade.getDate()).padStart(2,"0");



document.getElementById("dataValidadeEtiqueta").value =
`${ano}-${mes}-${dia}`;



}


}





function imprimirEtiqueta(){


let codigo =
produtoEtiqueta.codigo;



let quantidade =
Number(document.getElementById("quantidadeEtiqueta").value);



let fabricacao =
document.getElementById("dataFabricacaoEtiqueta").value;



let validade =
document.getElementById("dataValidadeEtiqueta").value;




let fab =
fabricacao.split("-").reverse().join("/");


let val =
validade.split("-").reverse().join("/");



let etiquetas="";



for(let i=0;i<quantidade;i++){


etiquetas += `

<div class="etiqueta">

FAB: ${fab}

<br>

VAL: ${val}


<svg id="barcode${i}"></svg>


</div>

`;

}



let janela =
window.open("","","width=400,height=500");



janela.document.write(`


<style>


@page{

size:50mm 30mm;

margin:0;

}



.etiqueta{

width:50mm;

height:30mm;

text-align:center;

font-family:Arial;

font-size:8px;

page-break-after:always;

}



svg{

width:45mm;

height:12mm;

}


</style>



${etiquetas}



<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>



<script>


${Array.from({length:quantidade},(_,i)=>`

JsBarcode("#barcode${i}","${codigo}",
{

format:"CODE128",

width:1.3,

height:35,

displayValue:true,

fontSize:9,

margin:0

});

`).join("")}



window.print();


</script>


`);



janela.document.close();



}





// ==============================
// LIMPAR
// ==============================

function limparCampos(){


document.getElementById("produto").value="";

document.getElementById("preco").value="";

document.getElementById("estoqueInicial").value="";

}



// ==============================
// INICIAR
// ==============================

mostrarProdutos();
