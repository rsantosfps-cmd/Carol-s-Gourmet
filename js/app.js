/*=========================================================
    CAROL'S GOURMET ERP 4.0
    APP.JS
    PARTE 1 - BASE DO SISTEMA
=========================================================*/

"use strict";

/*=========================================================
    BANCO DE DADOS
=========================================================*/

let produtos = [];
let materiasPrimas = [];
let movimentacoes = [];
let producoes = [];
let precificacoes = [];

/*=========================================================
    INICIALIZAÇÃO
=========================================================*/

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema(){

    console.clear();

    console.log("========================================");
    console.log("   CAROL'S GOURMET ERP 4.0");
    console.log("   Sistema iniciado com sucesso");
    console.log("========================================");

    carregarBanco();

    configurarDatas();

    iniciarDashboard();

    mostrarAba("dashboard");

}

/*=========================================================
    LOCAL STORAGE
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

    precificacoes =
        JSON.parse(localStorage.getItem("precificacoes")) || [];

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

    localStorage.setItem(
        "precificacoes",
        JSON.stringify(precificacoes)
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
    CONTROLE DAS ABAS
=========================================================*/

function mostrarAba(id, botao = null){

    document
        .querySelectorAll(".aba")
        .forEach(function(aba){

            aba.classList.remove("ativo");

        });

    const aba =
        document.getElementById(id);

    if(aba){

        aba.classList.add("ativo");

    }

    document
        .querySelectorAll(".menu-item")
        .forEach(function(item){

            item.classList.remove("ativo");

        });

    if(botao){

        botao.classList.add("ativo");

    }

}

/*=========================================================
    DASHBOARD
=========================================================*/

function iniciarDashboard(){

    atualizarDashboard();

}

function atualizarDashboard(){

    const total =
        document.getElementById("totalProdutos");

    if(total){

        total.textContent =
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
            Math.floor(Math.random() * 10);

    }

    let soma = 0;

    for(let i = 0; i < 12; i++){

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
    NOVO CADASTRO
=========================================================*/

function novoCadastro(){

    produtoEditando = -1;

    document.getElementById("codigoInterno").value =
        gerarCodigoInterno("PRD");

    document.getElementById("codigoBarras").value =
        gerarEAN13();

    document.getElementById("nomeProduto").value = "";

    document.getElementById("categoriaProduto").value =
        "Doce";

    document.getElementById("unidadeProduto").value =
        "Unidade";

    document.getElementById("statusProduto").value =
        "Ativo";

}

/*=========================================================
    SALVAR PRODUTO
=========================================================*/

function salvarProduto(){

    const produto = {

        codigo:
            document.getElementById("codigoInterno").value,

        codigoBarras:
            document.getElementById("codigoBarras").value,

        nome:
            document.getElementById("nomeProduto").value.trim(),

        categoria:
            document.getElementById("categoriaProduto").value,

        unidade:
            document.getElementById("unidadeProduto").value,

        status:
            document.getElementById("statusProduto").value

    };

    if(produto.nome === ""){

        alert("Informe o nome do produto.");

        return;

    }

    if(produtoEditando == -1){

        produtos.push(produto);

    }else{

        produtos[produtoEditando] = produto;

    }

    salvarBanco();

    atualizarTabelaProdutos();

    atualizarSelectProdutos();

    atualizarDashboard();

    novoCadastro();

    alert("Produto salvo com sucesso.");

}

/*=========================================================
    TABELA
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

            <td>${produto.codigoBarras}</td>

            <td>${produto.categoria}</td>

            <td>${produto.unidade}</td>

            <td>${produto.status}</td>

            <td>

                <button
                    onclick="editarProduto(${indice})">

                    ✏️

                </button>

                <button
                    onclick="excluirProduto(${indice})">

                    🗑️

                </button>

            </td>

        </tr>

        `;

    });

}

/*=========================================================
    EDITAR
=========================================================*/

function editarProduto(indice){

    produtoEditando = indice;

    const produto = produtos[indice];

    document.getElementById("codigoInterno").value =
        produto.codigo;

    document.getElementById("codigoBarras").value =
        produto.codigoBarras;

    document.getElementById("nomeProduto").value =
        produto.nome;

    document.getElementById("categoriaProduto").value =
        produto.categoria;

    document.getElementById("unidadeProduto").value =
        produto.unidade;

    document.getElementById("statusProduto").value =
        produto.status;

}

/*=========================================================
    EXCLUIR
=========================================================*/

function excluirProduto(indice){

    if(!confirm("Excluir este produto?")){

        return;

    }

    produtos.splice(indice,1);

    salvarBanco();

    atualizarTabelaProdutos();

    atualizarSelectProdutos();

    atualizarDashboard();

}

/*=========================================================
    PESQUISA
=========================================================*/

function pesquisarProduto(){

    const texto =
        document
        .getElementById("pesquisaProduto")
        .value
        .toLowerCase();

    const linhas =
        document.querySelectorAll(
            "#listaProdutos tr"
        );

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
    SELECTS
=========================================================*/

function atualizarSelectProdutos(){

    const selects = [

        "produtoMovimentacao",

        "produtoProducao",

        "produtoEtiqueta",

        "produtoPreco"

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
    INICIALIZAÇÃO DO MÓDULO
=========================================================*/

document.addEventListener("DOMContentLoaded", function(){

    novoCadastro();

    atualizarTabelaProdutos();

    atualizarSelectProdutos();

});
