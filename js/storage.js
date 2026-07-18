let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

let editando = null;


// Gerar código de barras automático
function gerarCodigo(){

    let codigo = "";

    for(let i = 0; i < 12; i++){
        codigo += Math.floor(Math.random() * 10);
    }

    return codigo;

}


// salvar ou atualizar produto
function salvarProduto(){

    let produto = {

        codigo: document.getElementById("codigo").value || gerarCodigo(),

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



// mostrar produtos
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

</td>


</tr>

`;

});


}



// carregar produto para edição

function editarProduto(index){

let p = produtos[index];


document.getElementById("codigo").value = p.codigo;

document.getElementById("produto").value = p.nome;

document.getElementById("preco").value = p.preco;

document.getElementById("estoque").value = p.estoque;


editando = index;


}


// excluir

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



// limpar

function limparCampos(){

document.getElementById("codigo").value="";

document.getElementById("produto").value="";

document.getElementById("preco").value="";

document.getElementById("estoque").value="";

}


mostrarProdutos();
