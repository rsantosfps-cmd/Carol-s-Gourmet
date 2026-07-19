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


<button onclick="gerarEtiqueta(${index})">
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


let codigo = document
.getElementById("codigoGerado")
.innerText
.replace("Código gerado:","")
.trim();



let janela = window.open(
"",
"PRINT",
"width=400,height=300"
);



janela.document.write(`

<html>

<body style="text-align:center;">


<svg id="barcode"></svg>


<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>


<script>

JsBarcode("#barcode","${codigo}",{

format:"CODE128",

width:2,

height:80,

displayValue:true

});


</script>


</body>

</html>

`);



janela.document.close();

janela.print();


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
