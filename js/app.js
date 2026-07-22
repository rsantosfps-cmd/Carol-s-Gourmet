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

    console.log("====================================");
    console.log("Carol's Gourmet ERP 4.0");
    console.log("Sistema iniciado");
    console.log("====================================");

    carregarBanco();

    configurarDatas();

    atualizarDashboard();

    novoCadastro();

    novaMateriaPrima();

    atualizarTabelaProdutos();

    atualizarTabelaMateriaPrima();

    atualizarSelectProdutos();

    atualizarSelectPrecificacao();

    atualizarSelectEstoque();

    atualizarHistoricoMovimentacoes();

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
    MENU
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

            aba.classList.remove("ativa");

        });

    const aba =
        document.getElementById(id);

    if(aba){

        aba.classList.add("ativa");

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
    PARTE 2 - PRODUTOS
=========================================================*/

let produtoEditando = -1;


/*=========================================================
    NOVO CADASTRO
=========================================================*/

function novoCadastro(){

    produtoEditando = -1;

    const codigo =
        document.getElementById("codigoInterno");

    const barras =
        document.getElementById("codigoBarras");

    const nome =
        document.getElementById("nomeProduto");

    const categoria =
        document.getElementById("categoriaProduto");

    const unidade =
        document.getElementById("unidadeProduto");

    const status =
        document.getElementById("statusProduto");

    if(codigo)
        codigo.value =
            gerarCodigoInterno("PRD");

    if(barras)
        barras.value =
            gerarEAN13();

    if(nome)
        nome.value = "";

    if(categoria)
        categoria.value = "Doce";

    if(unidade)
        unidade.value = "Unidade";

    if(status)
        status.value = "Ativo";

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

    alert("Produto salvo.");

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

    if(!confirm("Excluir produto?")){

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
    PARTE 3 - PRECIFICAÇÃO
=========================================================*/

/*=========================================================
    ATUALIZAR SELECT
=========================================================*/

function atualizarSelectPrecificacao(){

    const select =
        document.getElementById("produtoPreco");

    if(!select) return;

    select.innerHTML = "";

    produtos.forEach(function(produto){

        select.innerHTML += `

            <option value="${produto.codigo}">

                ${produto.nome}

            </option>

        `;

    });

}


/*=========================================================
    CALCULAR PREÇO
=========================================================*/

function calcularPreco(){

    const custoMateria =
        parseFloat(
            document.getElementById("custoMateria").value
        ) || 0;

    const custoEmbalagem =
        parseFloat(
            document.getElementById("custoEmbalagem").value
        ) || 0;

    const outrosCustos =
        parseFloat(
            document.getElementById("outrosCustos").value
        ) || 0;

    const margem =
        parseFloat(
            document.getElementById("margemDesejada").value
        ) || 0;

    const taxaIfood =
        parseFloat(
            document.getElementById("taxaIfood").value
        ) || 0;


    const custoTotal =

        custoMateria +
        custoEmbalagem +
        outrosCustos;


    let precoSugerido = 0;

    if(margem < 100){

        precoSugerido =
            custoTotal /
            (1 - margem / 100);

    }


    let precoIfood = precoSugerido;

    if(taxaIfood < 100){

        precoIfood =
            precoSugerido /
            (1 - taxaIfood / 100);

    }


    document.getElementById("resultadoCusto").textContent =

        "R$ " + custoTotal.toFixed(2);

    document.getElementById("resultadoPreco").textContent =

        "R$ " + precoSugerido.toFixed(2);

    document.getElementById("resultadoIfood").textContent =

        "R$ " + precoIfood.toFixed(2);

}


/*=========================================================
    SALVAR PRECIFICAÇÃO
=========================================================*/

function salvarPrecificacao(){

    const precificacao = {

        produto:
            document.getElementById("produtoPreco").value,

        custoMateria:
            parseFloat(document.getElementById("custoMateria").value) || 0,

        custoEmbalagem:
            parseFloat(document.getElementById("custoEmbalagem").value) || 0,

        outrosCustos:
            parseFloat(document.getElementById("outrosCustos").value) || 0,

        margem:
            parseFloat(document.getElementById("margemDesejada").value) || 0,

        taxaIfood:
            parseFloat(document.getElementById("taxaIfood").value) || 0,

        custoTotal:
            document.getElementById("resultadoCusto").textContent,

        precoVenda:
            document.getElementById("resultadoPreco").textContent,

        precoIfood:
            document.getElementById("resultadoIfood").textContent

    };

    precificacoes.push(precificacao);

    salvarBanco();

    alert("Precificação salva com sucesso.");

}
/*=========================================================
    PARTE 4 - MATÉRIA-PRIMA
=========================================================*/

let materiaPrimaEditando = -1;


/*=========================================================
    NOVO CADASTRO
=========================================================*/

function novaMateriaPrima(){

    materiaPrimaEditando = -1;

    document.getElementById("codigoMP").value =
        gerarCodigoInterno("MAT");

    document.getElementById("codigoBarrasMP").value =
        gerarEAN13();

    document.getElementById("nomeMP").value = "";

    document.getElementById("categoriaMP").value =
        "Ingrediente";

    document.getElementById("unidadeMP").value =
        "Unidade";

    document.getElementById("estoqueMP").value = 0;

    document.getElementById("custoMP").value = "";

}


/*=========================================================
    SALVAR MATÉRIA-PRIMA
=========================================================*/

function salvarMateriaPrima(){

    const materia = {

        codigo:
            document.getElementById("codigoMP").value,

        codigoBarras:
            document.getElementById("codigoBarrasMP").value,

        nome:
            document.getElementById("nomeMP").value.trim(),

        categoria:
            document.getElementById("categoriaMP").value,

        unidade:
            document.getElementById("unidadeMP").value,

        estoque:
            Number(
                document.getElementById("estoqueMP").value
            ),

        custo:
            Number(
                document.getElementById("custoMP").value
            )

    };


    if(materia.nome === ""){

        alert("Informe o nome da matéria-prima.");

        return;

    }


    if(materiaPrimaEditando == -1){

        materiasPrimas.push(materia);

    }else{

        materiasPrimas[materiaPrimaEditando] = materia;

    }


    salvarBanco();

    atualizarTabelaMateriaPrima();

    novaMateriaPrima();

    alert("Matéria-prima salva.");

}


/*=========================================================
    TABELA
=========================================================*/

function atualizarTabelaMateriaPrima(){

    const tabela =
        document.getElementById("listaMateriaPrima");

    if(!tabela) return;

    tabela.innerHTML = "";


    materiasPrimas.forEach(function(mp, indice){

        tabela.innerHTML += `

        <tr>

            <td>${mp.codigo}</td>

            <td>${mp.nome}</td>

            <td>${mp.categoria}</td>

            <td>${mp.unidade}</td>

            <td>${mp.estoque}</td>

            <td>R$ ${mp.custo.toFixed(2)}</td>

            <td>

                <button
                    onclick="editarMateriaPrima(${indice})">

                    ✏️

                </button>

                <button
                    onclick="excluirMateriaPrima(${indice})">

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

function editarMateriaPrima(indice){

    materiaPrimaEditando = indice;

    const mp = materiasPrimas[indice];

    document.getElementById("codigoMP").value =
        mp.codigo;

    document.getElementById("codigoBarrasMP").value =
        mp.codigoBarras;

    document.getElementById("nomeMP").value =
        mp.nome;

    document.getElementById("categoriaMP").value =
        mp.categoria;

    document.getElementById("unidadeMP").value =
        mp.unidade;

    document.getElementById("estoqueMP").value =
        mp.estoque;

    document.getElementById("custoMP").value =
        mp.custo;

}


/*=========================================================
    EXCLUIR
=========================================================*/

function excluirMateriaPrima(indice){

    if(!confirm("Excluir matéria-prima?")){

        return;

    }

    materiasPrimas.splice(indice,1);

    salvarBanco();

    atualizarTabelaMateriaPrima();

}


/*=========================================================
    PESQUISA
=========================================================*/

function pesquisarMateriaPrima(){

    const texto =
        document
        .getElementById("pesquisaMP")
        .value
        .toLowerCase();

    const linhas =
        document.querySelectorAll(
            "#listaMateriaPrima tr"
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
    PARTE 5 - ESTOQUE E MOVIMENTAÇÕES
=========================================================*/


/*=========================================================
    ATUALIZAR SELEÇÃO DE ESTOQUE
=========================================================*/

function atualizarSelectEstoque(){

    const tipo =
        document.getElementById(
            "tipoMovimentacao"
        );

    const select =
        document.getElementById(
            "produtoMovimentacao"
        );

    if(!tipo || !select) return;


    select.innerHTML = "";


    if(tipo.value === "produto"){

        produtos.forEach(function(produto){

            select.innerHTML += `

                <option value="${produto.codigo}">

                    ${produto.nome}

                </option>

            `;

        });

    }


    if(tipo.value === "materiaPrima"){

        materiasPrimas.forEach(function(mp){

            select.innerHTML += `

                <option value="${mp.codigo}">

                    ${mp.nome}

                </option>

            `;

        });

    }

}


/*=========================================================
    REGISTRAR MOVIMENTAÇÃO
=========================================================*/

function registrarMovimentacao(){

    const tipo =
        document.getElementById(
            "tipoMovimentacao"
        ).value;


    const codigo =
        document.getElementById(
            "produtoMovimentacao"
        ).value;


    const operacao =
        document.getElementById(
            "operacaoEstoque"
        ).value;


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeMovimentacao"
            ).value
        );


    const data =
        document.getElementById(
            "dataMovimentacao"
        ).value;


    const observacao =
        document.getElementById(
            "observacaoMovimentacao"
        ).value.trim();


    if(!codigo){

        alert(
            "Selecione um produto ou matéria-prima."
        );

        return;

    }


    if(quantidade <= 0){

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    /*=====================================================
        MOVIMENTAÇÃO DE PRODUTO
    =====================================================*/

    if(tipo === "produto"){

        const produto =
            produtos.find(function(item){

                return item.codigo === codigo;

            });


        if(!produto){

            alert(
                "Produto não encontrado."
            );

            return;

        }


        /*-----------------------------------------------
            CRIA ESTOQUE DO PRODUTO SE NÃO EXISTIR
        -----------------------------------------------*/

        if(produto.estoque === undefined){

            produto.estoque = 0;

        }


        /*-----------------------------------------------
            ENTRADA
        -----------------------------------------------*/

        if(operacao === "entrada"){

            produto.estoque += quantidade;

        }


        /*-----------------------------------------------
            SAÍDA
        -----------------------------------------------*/

        if(operacao === "saida"){

            if(produto.estoque < quantidade){

                alert(
                    "Estoque insuficiente."
                );

                return;

            }

            produto.estoque -= quantidade;

        }

    }


    /*=====================================================
        MOVIMENTAÇÃO DE MATÉRIA-PRIMA
    =====================================================*/

    if(tipo === "materiaPrima"){

        const mp =
            materiasPrimas.find(function(item){

                return item.codigo === codigo;

            });


        if(!mp){

            alert(
                "Matéria-prima não encontrada."
            );

            return;

        }


        /*-----------------------------------------------
            ENTRADA
        -----------------------------------------------*/

        if(operacao === "entrada"){

            mp.estoque += quantidade;

        }


        /*-----------------------------------------------
            SAÍDA
        -----------------------------------------------*/

        if(operacao === "saida"){

            if(mp.estoque < quantidade){

                alert(
                    "Estoque insuficiente."
                );

                return;

            }

            mp.estoque -= quantidade;

        }

    }


    /*=====================================================
        SALVAR HISTÓRICO
    =====================================================*/

    const movimentacao = {

        data: data,

        tipo: tipo,

        codigo: codigo,

        operacao: operacao,

        quantidade: quantidade,

        observacao: observacao

    };


    movimentacoes.push(
        movimentacao
    );


    /*=====================================================
        SALVAR BANCO
    =====================================================*/

    salvarBanco();


    /*=====================================================
        ATUALIZAR TELA
    =====================================================*/

    atualizarTabelaMateriaPrima();

    atualizarTabelaProdutos();

    atualizarHistoricoMovimentacoes();


    /*=====================================================
        LIMPAR CAMPOS
    =====================================================*/

    document.getElementById(
        "quantidadeMovimentacao"
    ).value = 1;


    document.getElementById(
        "observacaoMovimentacao"
    ).value = "";


    alert(
        "Movimentação registrada com sucesso."
    );

}


/*=========================================================
    HISTÓRICO DE MOVIMENTAÇÕES
=========================================================*/

function atualizarHistoricoMovimentacoes(){

    const tabela =
        document.getElementById(
            "historicoMovimentacoes"
        );


    if(!tabela) return;


    tabela.innerHTML = "";


    movimentacoes.forEach(function(
        movimentacao
    ){


        let nome = movimentacao.codigo;


        /*-----------------------------------------------
            PROCURAR PRODUTO
        -----------------------------------------------*/

        if(
            movimentacao.tipo ===
            "produto"
        ){

            const produto =
                produtos.find(function(item){

                    return item.codigo ===
                        movimentacao.codigo;

                });


            if(produto){

                nome =
                    produto.nome;

            }

        }


        /*-----------------------------------------------
            PROCURAR MATÉRIA-PRIMA
        -----------------------------------------------*/

        if(
            movimentacao.tipo ===
            "materiaPrima"
        ){

            const mp =
                materiasPrimas.find(function(item){

                    return item.codigo ===
                        movimentacao.codigo;

                });


            if(mp){

                nome =
                    mp.nome;

            }

        }


        tabela.innerHTML += `

            <tr>

                <td>

                    ${movimentacao.data}

                </td>


                <td>

                    ${nome}

                </td>


                <td>

                    ${movimentacao.tipo}

                </td>


                <td>

                    ${movimentacao.quantidade}

                </td>


                <td>

                    ${movimentacao.operacao}

                </td>


                <td>

                    ${movimentacao.observacao || "-"}

                </td>

            </tr>

        `;

    });

}
/*=========================================================
PARTE 5 - MÓDULO DE PRECIFICAÇÃO
=========================================================*/

/*=========================================================
ATUALIZAR LISTA DE PRODUTOS
=========================================================*/

function atualizarSelectPrecificacao(){

```
const select =
    document.getElementById("produtoPreco");

if(!select) return;

select.innerHTML = "";

produtos.forEach(function(produto){

    const option =
        document.createElement("option");

    option.value =
        produto.codigo;

    option.textContent =
        produto.nome;

    select.appendChild(option);

});
```

}

/*=========================================================
CALCULAR PREÇO DE VENDA
=========================================================*/

function calcularPreco(){

```
const custoMateria =
    parseFloat(
        document.getElementById("custoMateria").value
    ) || 0;


const custoEmbalagem =
    parseFloat(
        document.getElementById("custoEmbalagem").value
    ) || 0;


const outrosCustos =
    parseFloat(
        document.getElementById("outrosCustos").value
    ) || 0;


const margem =
    parseFloat(
        document.getElementById("margemDesejada").value
    ) || 0;


const taxaIfood =
    parseFloat(
        document.getElementById("taxaIfood").value
    ) || 0;


/*=====================================================
    VALIDAÇÃO DA MARGEM
=====================================================*/

if(margem >= 100){

    alert(
        "A margem desejada deve ser menor que 100%."
    );

    return;

}


/*=====================================================
    CUSTO TOTAL
=====================================================*/

const custoTotal =

    custoMateria +
    custoEmbalagem +
    outrosCustos;


/*=====================================================
    PREÇO SUGERIDO
=====================================================*/

const precoSugerido =

    custoTotal /
    (1 - margem / 100);


/*=====================================================
    PREÇO PARA IFOOD
=====================================================*/

let precoIfood = precoSugerido;


if(taxaIfood < 100){

    precoIfood =

        precoSugerido /
        (1 - taxaIfood / 100);

}


/*=====================================================
    MOSTRAR RESULTADOS
=====================================================*/

const resultadoCusto =
    document.getElementById(
        "resultadoCusto"
    );


const resultadoPreco =
    document.getElementById(
        "resultadoPreco"
    );


const resultadoIfood =
    document.getElementById(
        "resultadoIfood"
    );


if(resultadoCusto){

    resultadoCusto.textContent =

        "R$ " +
        custoTotal.toFixed(2)
        .replace(".", ",");

}


if(resultadoPreco){

    resultadoPreco.textContent =

        "R$ " +
        precoSugerido.toFixed(2)
        .replace(".", ",");

}


if(resultadoIfood){

    resultadoIfood.textContent =

        "R$ " +
        precoIfood.toFixed(2)
        .replace(".", ",");

}
```

}
/*=========================================================
PARTE 6 - MÓDULO DE MATÉRIA-PRIMA
=========================================================*/

/*=========================================================
VARIÁVEL DE EDIÇÃO
=========================================================*/

let materiaPrimaEditando = -1;

/*=========================================================
NOVO CADASTRO DE MATÉRIA-PRIMA
=========================================================*/

function novaMateriaPrima(){

```
materiaPrimaEditando = -1;


const codigo =
    document.getElementById("codigoMP");

const barras =
    document.getElementById("codigoBarrasMP");

const nome =
    document.getElementById("nomeMP");

const categoria =
    document.getElementById("categoriaMP");

const unidade =
    document.getElementById("unidadeMP");

const estoque =
    document.getElementById("estoqueMP");

const custo =
    document.getElementById("custoMP");


if(codigo){

    codigo.value =
        gerarCodigoInterno("MP");

}


if(barras){

    barras.value =
        gerarEAN13();

}


if(nome){

    nome.value = "";

}


if(categoria){

    categoria.selectedIndex = 0;

}


if(unidade){

    unidade.selectedIndex = 0;

}


if(estoque){

    estoque.value = 0;

}


if(custo){

    custo.value = "";

}
```

}

/*=========================================================
SALVAR MATÉRIA-PRIMA
=========================================================*/

function salvarMateriaPrima(){

```
const codigo =
    document
    .getElementById("codigoMP")
    .value
    .trim();


const codigoBarras =
    document
    .getElementById("codigoBarrasMP")
    .value
    .trim();


const nome =
    document
    .getElementById("nomeMP")
    .value
    .trim();


const categoria =
    document
    .getElementById("categoriaMP")
    .value;


const unidade =
    document
    .getElementById("unidadeMP")
    .value;


const estoque =
    parseFloat(
        document
        .getElementById("estoqueMP")
        .value
    ) || 0;


const custo =
    parseFloat(
        document
        .getElementById("custoMP")
        .value
    ) || 0;


/*=====================================================
    VALIDAÇÃO
=====================================================*/

if(nome === ""){

    alert(
        "Informe o nome da matéria-prima."
    );

    return;

}


/*=====================================================
    OBJETO DA MATÉRIA-PRIMA
=====================================================*/

const materiaPrima = {

    codigo:
        codigo,

    codigoBarras:
        codigoBarras,

    nome:
        nome,

    categoria:
        categoria,

    unidade:
        unidade,

    estoque:
        estoque,

    custo:
        custo

};


/*=====================================================
    NOVO OU EDIÇÃO
=====================================================*/

if(materiaPrimaEditando === -1){

    materiasPrimas.push(
        materiaPrima
    );

}else{

    materiasPrimas[
        materiaPrimaEditando
    ] =
        materiaPrima;

}


/*=====================================================
    SALVAR NO LOCALSTORAGE
=====================================================*/

salvarBanco();


/*=====================================================
    ATUALIZAR TABELA
=====================================================*/

atualizarTabelaMateriaPrima();


/*=====================================================
    LIMPAR FORMULÁRIO
=====================================================*/

novaMateriaPrima();


alert(
    "Matéria-prima salva com sucesso."
);
```

}

/*=========================================================
TABELA DE MATÉRIA-PRIMA
=========================================================*/

function atualizarTabelaMateriaPrima(){

```
const tabela =
    document.getElementById(
        "listaMateriaPrima"
    );


if(!tabela) return;


tabela.innerHTML = "";


materiasPrimas.forEach(
    function(materiaPrima, indice){


    tabela.innerHTML += `

    <tr>

        <td>
            ${materiaPrima.codigo}
        </td>

        <td>
            ${materiaPrima.nome}
        </td>

        <td>
            ${materiaPrima.categoria}
        </td>

        <td>
            ${materiaPrima.unidade}
        </td>

        <td>
            ${materiaPrima.estoque}
        </td>

        <td>
            R$ ${Number(
                materiaPrima.custo
            ).toFixed(2).replace(".", ",")}
        </td>

        <td>

            <button
                onclick="editarMateriaPrima(${indice})">

                ✏️

            </button>

            <button
                onclick="excluirMateriaPrima(${indice})">

                🗑️

            </button>

        </td>

    </tr>

    `;


});
```

}

/*=========================================================
EDITAR MATÉRIA-PRIMA
=========================================================*/

function editarMateriaPrima(indice){

```
const materiaPrima =
    materiasPrimas[indice];


if(!materiaPrima) return;


materiaPrimaEditando =
    indice;


document.getElementById(
    "codigoMP"
).value =
    materiaPrima.codigo;


document.getElementById(
    "codigoBarrasMP"
).value =
    materiaPrima.codigoBarras;


document.getElementById(
    "nomeMP"
).value =
    materiaPrima.nome;


document.getElementById(
    "categoriaMP"
).value =
    materiaPrima.categoria;


document.getElementById(
    "unidadeMP"
).value =
    materiaPrima.unidade;


document.getElementById(
    "estoqueMP"
).value =
    materiaPrima.estoque;


document.getElementById(
    "custoMP"
).value =
    materiaPrima.custo;
```

}

/*=========================================================
EXCLUIR MATÉRIA-PRIMA
=========================================================*/

function excluirMateriaPrima(indice){

```
if(
    !confirm(
        "Deseja excluir esta matéria-prima?"
    )
){

    return;

}


materiasPrimas.splice(
    indice,
    1
);


salvarBanco();


atualizarTabelaMateriaPrima();


novaMateriaPrima();
```

}

/*=========================================================
PESQUISAR MATÉRIA-PRIMA
=========================================================*/

function pesquisarMateriaPrima(){

```
const campo =
    document.getElementById(
        "pesquisaMP"
    );


if(!campo) return;


const texto =
    campo.value
    .toLowerCase();


const linhas =
    document.querySelectorAll(
        "#listaMateriaPrima tr"
    );


linhas.forEach(
    function(linha){


    linha.style.display =

        linha.innerText
        .toLowerCase()
        .includes(texto)

        ? ""

        : "none";


});
```

}

/*=========================================================
INICIALIZAÇÃO DA MATÉRIA-PRIMA
=========================================================*/

document.addEventListener(
"DOMContentLoaded",
function(){

```
    novaMateriaPrima();

    atualizarTabelaMateriaPrima();

}
```

);

