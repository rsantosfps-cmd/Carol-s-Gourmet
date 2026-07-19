let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

let editando = null;


// ===============================
// GERAR CÓDIGO INTERNO AUTOMÁTICO
// ===============================

function gerarCodigo(){

    let maior = 0;

    produtos.forEach(p => {

        let numero = parseInt(
            p.codigo.replace("20","")
        );

        if(numero > maior){
            maior = numero;
        }

    });


    maior++;


    return "20" + maior.toString().padStart(10,"0");

}



// ===============================
// SALVAR / ATUALIZAR PRODUTO
// ===============================

function salvarProduto(){


let codigo = document.getElementById("codigo").value;


if(codigo === ""){

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



limparCampos();

mostrarProdutos();


}



// ===============================
// LISTAR PRODUTOS
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


document.getElementById("codigo").value = p.codigo;

document.getElementById("produto").value = p.nome;

document.getElementById("preco").value = p.preco;

document.getElementById("estoque").value = p.estoque;


editando = index;


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
// GERAR CÓDIGO DE BARRAS NA TELA
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


document.getElementById("codigo").value = produto.codigo;


gerarCodigoBarras(produto.codigo);



}




// ===============================
// IMPRIMIR SOMENTE ETIQUETA
// ===============================


function imprimirEtiqueta(){


let codigo = document.getElementById("codigo").value;



let janela = window.open("","PRINT","width=400,height=300");



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


document.getElementById("codigo").value="";

document.getElementById("produto").value="";

document.getElementById("preco").value="";

document.getElementById("estoque").value="";


document.getElementById("barcode").innerHTML="";


}



// iniciar sistema

mostrarProdutos();
