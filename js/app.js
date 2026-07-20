/*=========================================================
    CAROL'S GOURMET ERP
    APP.JS
    Parte 1 - Base do Sistema
=========================================================*/

"use strict";

/*=========================================================
    BANCO DE DADOS EM MEMÓRIA
=========================================================*/

let produtos = [];
let materiasPrimas = [];
let movimentacoes = [];
let producoes = [];


/*=========================================================
    INICIALIZAÇÃO
=========================================================*/

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema(){

    console.log("====================================");
    console.log("Carol's Gourmet ERP iniciado");
    console.log("====================================");

    carregarBanco();

    configurarDatas();

    atualizarDashboard();

    mostrarAba("dashboard");

    configurarEventos();

}


/*=========================================================
    EVENTOS
=========================================================*/

function configurarEventos(){

    const tipoMovimentacao =
        document.getElementById("tipoMovimentacao");

    if(tipoMovimentacao){

        tipoMovimentacao.addEventListener("change", function(){

            console.log("Tipo alterado.");

        });

    }

}


/*=========================================================
    BANCO LOCAL
=========================================================*/

function carregarBanco(){

    produtos =
        JSON.parse(localStorage.getItem("produtos")) || [];

    materiasPrimas =
        JSON.parse(localStorage.getItem("materiasPrimas")) || [];

    movimentacoes =
        JSON.parse(localStorage.getItem("movimentacoes")) || [];

    producoes =
        JSON.parse(localStorage.getItem("producoes")) || [];

}


function salvarBanco(){

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        "materiasPrimas",
        JSON.stringify(materiasPrimas)
    );

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    localStorage.setItem(
        "producoes",
        JSON.stringify(producoes)
    );

}


/*=========================================================
    MENU LATERAL
=========================================================*/

function toggleMenu(){

    const menu =
        document.getElementById("menuLateral");

    if(menu){

        menu.classList.toggle("fechado");

    }

}


/*=========================================================
    ABAS
=========================================================*/

function mostrarAba(id, botao=null){

    const abas =
        document.querySelectorAll(".aba");

    abas.forEach(function(aba){

        aba.classList.remove("ativa");

    });


    const selecionada =
        document.getElementById(id);

    if(selecionada){

        selecionada.classList.add("ativa");

    }


    const botoes =
        document.querySelectorAll(".menu-item");

    botoes.forEach(function(item){

        item.classList.remove("ativo");

    });


    if(botao){

        botao.classList.add("ativo");

    }

}


/*=========================================================
    DASHBOARD
=========================================================*/

function atualizarDashboard(){

    const totalProdutos =
        document.getElementById("totalProdutos");

    if(totalProdutos){

        totalProdutos.textContent =
            produtos.length;

    }


    const ultima =
        document.getElementById("ultimaAtualizacao");

    if(ultima){

        ultima.textContent =
            new Date().toLocaleString("pt-BR");

    }

}


/*=========================================================
    DATAS
=========================================================*/

function configurarDatas(){

    const hoje =
        new Date()
        .toISOString()
        .split("T")[0];

    const campos = [

        "dataMovimentacao",

        "dataFabricacao",

        "dataValidade",

        "fabricacaoEtiqueta",

        "validadeEtiqueta"

    ];

    campos.forEach(function(id){

        const campo =
            document.getElementById(id);

        if(campo){

            campo.value = hoje;

        }

    });

}


/*=========================================================
    GERADORES
=========================================================*/

function gerarCodigoInterno(prefixo){

    const numero =
        Date.now()
        .toString()
        .slice(-6);

    return prefixo + numero;

}


function gerarEAN13(){

    let codigo = "789";

    while(codigo.length < 12){

        codigo +=
            Math.floor(Math.random()*10);

    }

    let soma = 0;

    for(let i=0;i<12;i++){

        const numero =
            parseInt(codigo[i]);

        soma +=
            (i % 2 === 0)
            ? numero
            : numero * 3;

    }

    const digito =
        (10 - (soma % 10)) % 10;

    return codigo + digito;

}
/*=========================================================
    PARTE 2 - MÓDULO DE PRODUTOS
=========================================================*/

let produtoEditando = -1;


/*=========================================================
    INICIALIZAÇÃO DO FORMULÁRIO
=========================================================*/

function iniciarFormularioProduto(){

    const codigo =
        document.getElementById("codigoInterno");

    const barras =
        document.getElementById("codigoBarras");

    const nome =
        document.getElementById("nomeProduto");

    const preco =
        document.getElementById("precoProduto");

    const estoque =
        document.getElementById("estoqueInicial");

    if(codigo) codigo.value =
        gerarCodigoInterno("PRD");

    if(barras) barras.value =
        gerarEAN13();

    if(nome) nome.value = "";

    if(preco) preco.value = "";

    if(estoque) estoque.value = 0;

    produtoEditando = -1;

}


/*=========================================================
    SALVAR PRODUTO
=========================================================*/

function salvarProduto(){

    const codigo =
        document.getElementById("codigoInterno").value.trim();

    const codigoBarras =
        document.getElementById("codigoBarras").value.trim();

    const nome =
        document.getElementById("nomeProduto").value.trim();

    const preco =
        parseFloat(
            document.getElementById("precoProduto").value
        );

    const estoque =
        parseInt(
            document.getElementById("estoqueInicial").value
        );


    if(nome === ""){

        alert("Informe o nome do produto.");

        return;

    }


    if(isNaN(preco)){

        alert("Informe o preço de venda.");

        return;

    }


    const produto = {

        codigo,
        codigoBarras,
        nome,
        preco,
        estoque

    };


    if(produtoEditando === -1){

        produtos.push(produto);

    }else{

        produtos[produtoEditando] = produto;

    }


    salvarBanco();

    atualizarTabelaProdutos();

    atualizarDashboard();

    atualizarSelectProdutos();

    iniciarFormularioProduto();

}


/*=========================================================
    TABELA DE PRODUTOS
=========================================================*/

function atualizarTabelaProdutos(){

    const tabela =
        document.getElementById("listaProdutos");

    if(!tabela) return;

    tabela.innerHTML = "";


    produtos.forEach(function(produto, indice){

        tabela.innerHTML += `

            <tr>

                <td>${produto.codigo}</td>

                <td>${produto.nome}</td>

                <td>
                    R$ ${produto.preco.toFixed(2)}
                </td>

                <td>
                    ${produto.estoque}
                </td>

                <td>

                    <button onclick="editarProduto(${indice})">
                        ✏️
                    </button>

                    <button onclick="excluirProduto(${indice})">
                        🗑️
                    </button>

                </td>

            </tr>

        `;

    });

}


/*=========================================================
    EDITAR PRODUTO
=========================================================*/

function editarProduto(indice){

    const produto = produtos[indice];

    produtoEditando = indice;

    document.getElementById("codigoInterno").value =
        produto.codigo;

    document.getElementById("codigoBarras").value =
        produto.codigoBarras;

    document.getElementById("nomeProduto").value =
        produto.nome;

    document.getElementById("precoProduto").value =
        produto.preco;

    document.getElementById("estoqueInicial").value =
        produto.estoque;

}


/*=========================================================
    EXCLUIR PRODUTO
=========================================================*/

function excluirProduto(indice){

    const confirmar =
        confirm("Deseja excluir este produto?");

    if(!confirmar) return;


    produtos.splice(indice, 1);

    salvarBanco();

    atualizarTabelaProdutos();

    atualizarDashboard();

    atualizarSelectProdutos();

}


/*=========================================================
    PESQUISAR PRODUTO
=========================================================*/

function pesquisarProduto(){

    const texto =
        document
        .getElementById("pesquisaProduto")
        .value
        .toLowerCase();


    const linhas =
        document.querySelectorAll("#listaProdutos tr");


    linhas.forEach(function(linha){

        linha.style.display =
            linha.innerText
                .toLowerCase()
                .includes(texto)
            ? ""
            : "none";

    });

}


/*=========================================================
    PREENCHER SELECTS
=========================================================*/

function atualizarSelectProdutos(){

    const selects = [

        "produtoMovimentacao",

        "produtoProducao",

        "produtoEtiqueta"

    ];


    selects.forEach(function(id){

        const select =
            document.getElementById(id);

        if(!select) return;

        select.innerHTML = "";


        produtos.forEach(function(produto){

            select.innerHTML += `

                <option value="${produto.codigo}">

                    ${produto.nome}

                </option>

            `;

        });

    });

}


/*=========================================================
    BOTÃO NOVO CADASTRO
=========================================================*/

function novoCadastro(){

    iniciarFormularioProduto();

}


/*=========================================================
    INICIAR MÓDULO AO ABRIR O SISTEMA
=========================================================*/

document.addEventListener("DOMContentLoaded", function(){

    iniciarFormularioProduto();

    atualizarTabelaProdutos();

    atualizarSelectProdutos();

});
