/* =========================================================
   CAROL'S GOURMET ERP
   APP.JS - VERSÃO CONSOLIDADA
   Compatível com o index.html enviado
========================================================= */

"use strict";

/* =========================================================
   BANCO DE DADOS
========================================================= */

let produtos = [];
let materiasPrimas = [];
let movimentacoes = [];
let producoes = [];
let precificacoes = [];

let produtoEditando = null;
let materiaPrimaEditando = null;


/* =========================================================
   LOCALSTORAGE
========================================================= */

const STORAGE_PRODUTOS =
    "carols_gourmet_produtos";

const STORAGE_MP =
    "carols_gourmet_materias_primas";

const STORAGE_MOVIMENTACOES =
    "carols_gourmet_movimentacoes";

const STORAGE_PRODUCOES =
    "carols_gourmet_producoes";

const STORAGE_PRECIFICACOES =
    "carols_gourmet_precificacoes";

const STORAGE_ULTIMA_ATUALIZACAO =
    "carols_gourmet_ultima_atualizacao";


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarDados();

        inicializarSistema();

        configurarDatas();

        configurarEventos();

        atualizarTudo();

    }
);


/* =========================================================
   CARREGAR DADOS
========================================================= */

function carregarDados() {

    try {

        produtos =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_PRODUTOS
                )
            ) || [];

        materiasPrimas =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_MP
                )
            ) || [];

        movimentacoes =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_MOVIMENTACOES
                )
            ) || [];

        producoes =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_PRODUCOES
                )
            ) || [];

        precificacoes =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_PRECIFICACOES
                )
            ) || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        produtos = [];
        materiasPrimas = [];
        movimentacoes = [];
        producoes = [];
        precificacoes = [];

    }

}


/* =========================================================
   SALVAR DADOS
========================================================= */

function salvarDados() {

    localStorage.setItem(
        STORAGE_PRODUTOS,
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        STORAGE_MP,
        JSON.stringify(materiasPrimas)
    );

    localStorage.setItem(
        STORAGE_MOVIMENTACOES,
        JSON.stringify(movimentacoes)
    );

    localStorage.setItem(
        STORAGE_PRODUCOES,
        JSON.stringify(producoes)
    );

    localStorage.setItem(
        STORAGE_PRECIFICACOES,
        JSON.stringify(precificacoes)
    );

    localStorage.setItem(
        STORAGE_ULTIMA_ATUALIZACAO,
        new Date().toLocaleString(
            "pt-BR"
        )
    );

    atualizarUltimaAtualizacao();

}


/* =========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================= */

function inicializarSistema() {

    gerarNovoCodigoProduto();

    gerarNovoCodigoMP();

}


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {

    const fabricacaoProducao =
        document.getElementById(
            "fabricacaoProducao"
        );

    if (fabricacaoProducao) {

        fabricacaoProducao.addEventListener(
            "change",
            calcularValidadeProducao
        );

    }


    const produtoProducao =
        document.getElementById(
            "produtoProducao"
        );

    if (produtoProducao) {

        produtoProducao.addEventListener(
            "change",
            calcularValidadeProducao
        );

    }


    const fabricacaoEtiqueta =
        document.getElementById(
            "fabricacaoEtiqueta"
        );

    if (fabricacaoEtiqueta) {

        fabricacaoEtiqueta.addEventListener(
            "change",
            calcularValidadeEtiqueta
        );

    }


    const produtoEtiqueta =
        document.getElementById(
            "produtoEtiqueta"
        );

    if (produtoEtiqueta) {

        produtoEtiqueta.addEventListener(
            "change",
            calcularValidadeEtiqueta
        );

    }

}


/* =========================================================
   MENU LATERAL
========================================================= */

function mostrarAba(
    idAba,
    botao
) {

    const abas =
        document.querySelectorAll(
            ".aba"
        );

    abas.forEach(
        function (aba) {

            aba.classList.remove(
                "ativa"
            );

        }
    );


    const abaSelecionada =
        document.getElementById(
            idAba
        );


    if (!abaSelecionada) {

        console.warn(
            "Aba não encontrada:",
            idAba
        );

        return;

    }


    abaSelecionada.classList.add(
        "ativa"
    );


    const botoes =
        document.querySelectorAll(
            ".menu-item"
        );


    botoes.forEach(
        function (item) {

            item.classList.remove(
                "ativo"
            );

        }
    );


    if (botao) {

        botao.classList.add(
            "ativo"
        );

    }


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "aberto"
        );

    }


    /* Atualiza validade ao entrar nas abas */

    if (
        idAba === "producao"
    ) {

        calcularValidadeProducao();

    }


    if (
        idAba === "etiquetas"
    ) {

        calcularValidadeEtiqueta();

    }

}


/* =========================================================
   MENU MOBILE
========================================================= */

function toggleMenu() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!sidebar) {

        return;

    }


    sidebar.classList.toggle(
        "aberto"
    );

}


/* =========================================================
   CÓDIGOS INTERNOS
========================================================= */

function gerarCodigoInterno(
    prefixo,
    lista
) {

    let maiorNumero = 0;


    lista.forEach(
        function (item) {

            if (!item.codigo) {

                return;

            }


            const numero =
                parseInt(
                    String(
                        item.codigo
                    ).replace(
                        prefixo,
                        ""
                    ),
                    10
                );


            if (
                !isNaN(numero) &&
                numero > maiorNumero
            ) {

                maiorNumero =
                    numero;

            }

        }
    );


    return (
        prefixo +
        String(
            maiorNumero + 1
        ).padStart(
            4,
            "0"
        )
    );

}


/* =========================================================
   GERAR EAN-13
========================================================= */

function gerarEAN13() {

    let base = "";


    /*
       Prefixo 20 = código interno
       de circulação restrita.
       O objetivo é manter aparência
       de EAN-13 profissional.
    */

    base = "20";


    while (
        base.length < 12
    ) {

        base +=
            Math.floor(
                Math.random() * 10
            );

    }


    let soma = 0;


    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const numero =
            Number(
                base[i]
            );


        soma +=
            i % 2 === 0
                ? numero
                : numero * 3;

    }


    const digito =
        (
            10 -
            (
                soma % 10
            )
        ) % 10;


    return (
        base +
        digito
    );

}


/* =========================================================
   PRODUTOS
========================================================= */

function gerarNovoCodigoProduto() {

    const campo =
        document.getElementById(
            "codigoProduto"
        );


    if (!campo) {

        return;

    }


    campo.value =
        gerarCodigoInterno(
            "PROD-",
            produtos
        );

}


/* =========================================================
   SALVAR PRODUTO
========================================================= */

function salvarProduto() {

    const codigo =
        document.getElementById(
            "codigoProduto"
        )?.value.trim();


    const nome =
        document.getElementById(
            "nomeProduto"
        )?.value.trim();


    const categoria =
        document.getElementById(
            "categoriaProduto"
        )?.value;


    const unidade =
        document.getElementById(
            "unidadeProduto"
        )?.value;


    const status =
        document.getElementById(
            "statusProduto"
        )?.value;


    if (!nome) {

        alert(
            "Digite o nome do produto."
        );

        return;

    }


    if (!categoria) {

        alert(
            "Selecione a categoria."
        );

        return;

    }


    if (produtoEditando) {

        const produto =
            produtos.find(
                function (item) {

                    return (
                        item.id ===
                        produtoEditando
                    );

                }
            );


        if (produto) {

            produto.nome =
                nome;

            produto.categoria =
                categoria;

            produto.unidade =
                unidade;

            produto.status =
                status;

        }


        produtoEditando =
            null;


        salvarDados();

        atualizarTudo();

        novoProduto();


        alert(
            "Produto atualizado com sucesso!"
        );

        return;

    }


    const novo = {

        id:
            Date.now(),

        codigo:
            codigo ||
            gerarCodigoInterno(
                "PROD-",
                produtos
            ),

        ean:
            gerarEAN13(),

        nome:
            nome,

        categoria:
            categoria,

        unidade:
            unidade,

        status:
            status,

        estoque:
            0,

        custoUnitario:
            0,

        precoVenda:
            0,

        dataCadastro:
            new Date().toISOString()

    };


    produtos.push(
        novo
    );


    salvarDados();

    atualizarTudo();

    novoProduto();


    alert(
        "Produto salvo com sucesso!"
    );

}


/* =========================================================
   NOVO PRODUTO
========================================================= */

function novoProduto() {

    produtoEditando =
        null;


    const codigo =
        document.getElementById(
            "codigoProduto"
        );


    const ean =
        document.getElementById(
            "eanProduto"
        );


    const nome =
        document.getElementById(
            "nomeProduto"
        );


    const categoria =
        document.getElementById(
            "categoriaProduto"
        );


    const unidade =
        document.getElementById(
            "unidadeProduto"
        );


    const status =
        document.getElementById(
            "statusProduto"
        );


    if (codigo) {

        codigo.value =
            gerarCodigoInterno(
                "PROD-",
                produtos
            );

    }


    if (ean) {

        ean.value = "";

    }


    if (nome) {

        nome.value = "";

    }


    if (categoria) {

        categoria.value = "";

    }


    if (unidade) {

        unidade.value =
            "Unidade";

    }


    if (status) {

        status.value =
            "Ativo";

    }

}


/* =========================================================
   LISTA DE PRODUTOS
========================================================= */

function atualizarListaProdutos() {

    const tabela =
        document.getElementById(
            "listaProdutos"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    produtos.forEach(
        function (produto) {

            const linha =
                document.createElement(
                    "tr"
                );


            const estoque =
                Number(
                    produto.estoque
                ) || 0;


            const custo =
                Number(
                    produto.custoUnitario
                ) || 0;


            const valorTotal =
                estoque *
                custo;


            linha.innerHTML = `

                <td>
                    ${produto.codigo || ""}
                </td>

                <td>
                    ${produto.nome || ""}
                </td>

                <td>
                    ${produto.categoria || ""}
                </td>

                <td>
                    ${produto.unidade || ""}
                </td>

                <td>
                    ${estoque.toFixed(2)}
                </td>

                <td>
                    ${formatarMoeda(custo)}
                </td>

                <td>
                    ${formatarMoeda(valorTotal)}
                </td>

                <td>

                    <button
                        class="btn btn-primary"
                        onclick="editarProduto(${produto.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn btn-cancel"
                        onclick="excluirProduto(${produto.id})"
                    >
                        Excluir
                    </button>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );

}


/* =========================================================
   EDITAR PRODUTO
========================================================= */

function editarProduto(id) {

    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!produto) {

        return;

    }


    produtoEditando =
        id;


    document.getElementById(
        "codigoProduto"
    ).value =
        produto.codigo || "";


    document.getElementById(
        "eanProduto"
    ).value =
        produto.ean || "";


    document.getElementById(
        "nomeProduto"
    ).value =
        produto.nome || "";


    document.getElementById(
        "categoriaProduto"
    ).value =
        produto.categoria || "";


    document.getElementById(
        "unidadeProduto"
    ).value =
        produto.unidade ||
        "Unidade";


    document.getElementById(
        "statusProduto"
    ).value =
        produto.status ||
        "Ativo";


    mostrarAba(
        "produtos",
        document.querySelector(
            '[onclick*="produtos"]'
        )
    );

}


/* =========================================================
   EXCLUIR PRODUTO
========================================================= */

function excluirProduto(id) {

    if (
        !confirm(
            "Deseja realmente excluir este produto?"
        )
    ) {

        return;

    }


    produtos =
        produtos.filter(
            function (produto) {

                return (
                    produto.id !== id
                );

            }
        );


    salvarDados();

    atualizarTudo();

}


/* =========================================================
   MATÉRIA-PRIMA
========================================================= */

function gerarNovoCodigoMP() {

    const campo =
        document.getElementById(
            "codigoMP"
        );


    if (!campo) {

        return;

    }


    campo.value =
        gerarCodigoInterno(
            "MP-",
            materiasPrimas
        );

}


/* =========================================================
   SALVAR MATÉRIA-PRIMA
========================================================= */

function salvarMateriaPrima() {

    const codigo =
        document.getElementById(
            "codigoMP"
        )?.value.trim();


    const nome =
        document.getElementById(
            "nomeMP"
        )?.value.trim();


    const categoria =
        document.getElementById(
            "categoriaMP"
        )?.value;


    const unidade =
        document.getElementById(
            "unidadeMP"
        )?.value;


    const estoque =
        Number(
            document.getElementById(
                "estoqueMP"
            )?.value
        ) || 0;


    const custo =
        Number(
            document.getElementById(
                "custoMP"
            )?.value
        ) || 0;


    if (!nome) {

        alert(
            "Digite o nome da matéria-prima."
        );

        return;

    }


    if (materiaPrimaEditando) {

        const materia =
            materiasPrimas.find(
                function (item) {

                    return (
                        item.id ===
                        materiaPrimaEditando
                    );

                }
            );


        if (materia) {

            materia.nome =
                nome;

            materia.categoria =
                categoria;

            materia.unidade =
                unidade;

            materia.custo =
                custo;

        }


        materiaPrimaEditando =
            null;

    } else {

        materiasPrimas.push({

            id:
                Date.now(),

            codigo:
                codigo ||
                gerarCodigoInterno(
                    "MP-",
                    materiasPrimas
                ),

            nome:
                nome,

            categoria:
                categoria,

            unidade:
                unidade,

            estoque:
                estoque,

            custo:
                custo,

            dataCadastro:
                new Date().toISOString()

        });

    }


    salvarDados();

    atualizarTudo();

    novaMateriaPrima();


    alert(
        "Matéria-prima salva com sucesso!"
    );

}


/* =========================================================
   NOVA MATÉRIA-PRIMA
========================================================= */

function novaMateriaPrima() {

    materiaPrimaEditando =
        null;


    const codigo =
        document.getElementById(
            "codigoMP"
        );


    const nome =
        document.getElementById(
            "nomeMP"
        );


    const estoque =
        document.getElementById(
            "estoqueMP"
        );


    const custo =
        document.getElementById(
            "custoMP"
        );


    if (codigo) {

        codigo.value =
            gerarCodigoInterno(
                "MP-",
                materiasPrimas
            );

    }


    if (nome) {

        nome.value = "";

    }


    if (estoque) {

        estoque.value = "0";

    }


    if (custo) {

        custo.value = "";

    }

}


/* =========================================================
   LISTA MATÉRIA-PRIMA
========================================================= */

function atualizarListaMateriaPrima() {

    const tabela =
        document.getElementById(
            "listaMateriaPrima"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    materiasPrimas.forEach(
        function (materia) {

            const estoque =
                Number(
                    materia.estoque
                ) || 0;


            const custo =
                Number(
                    materia.custo
                ) || 0;


            const custoTotal =
                estoque *
                custo;


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${materia.codigo || ""}
                </td>

                <td>
                    ${materia.nome || ""}
                </td>

                <td>
                    ${materia.categoria || ""}
                </td>

                <td>
                    ${materia.unidade || ""}
                </td>

                <td>
                    ${estoque.toFixed(2)}
                </td>

                <td>
                    ${formatarMoeda(custo)}
                </td>

                <td>
                    ${formatarMoeda(custoTotal)}
                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );

}


/* =========================================================
   ESTOQUE
========================================================= */

function alterarTipoEstoque() {

    const select =
        document.getElementById(
            "tipoEstoque"
        );


    const cabecalho =
        document.getElementById(
            "cabecalhoEstoque"
        );


    const tabela =
        document.getElementById(
            "listaEstoque"
        );


    if (
        !select ||
        !cabecalho ||
        !tabela
    ) {

        return;

    }


    const tipo =
        select.value;


    cabecalho.innerHTML = "";

    tabela.innerHTML = "";


    if (
        tipo ===
        "materiaPrima"
    ) {

        cabecalho.innerHTML = `

            <tr>

                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Unidade</th>
                <th>Estoque</th>
                <th>Custo</th>
                <th>Valor Total</th>

            </tr>

        `;


        materiasPrimas.forEach(
            function (item) {

                const estoque =
                    Number(
                        item.estoque
                    ) || 0;


                const custo =
                    Number(
                        item.custo
                    ) || 0;


                tabela.innerHTML += `

                    <tr>

                        <td>${item.codigo || ""}</td>

                        <td>${item.nome || ""}</td>

                        <td>${item.categoria || ""}</td>

                        <td>${item.unidade || ""}</td>

                        <td>${estoque.toFixed(2)}</td>

                        <td>${formatarMoeda(custo)}</td>

                        <td>${formatarMoeda(
                            estoque * custo
                        )}</td>

                    </tr>

                `;

            }
        );

    } else {

        cabecalho.innerHTML = `

            <tr>

                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Unidade</th>
                <th>Estoque</th>
                <th>Status</th>

            </tr>

        `;


        produtos.forEach(
            function (item) {

                tabela.innerHTML += `

                    <tr>

                        <td>${item.codigo || ""}</td>

                        <td>${item.nome || ""}</td>

                        <td>${item.categoria || ""}</td>

                        <td>${item.unidade || ""}</td>

                        <td>${Number(
                            item.estoque || 0
                        ).toFixed(2)}</td>

                        <td>${item.status || ""}</td>

                    </tr>

                `;

            }
        );

    }

}


/* =========================================================
   ITENS DE MOVIMENTAÇÃO
========================================================= */

function atualizarItensMovimentacao() {

    const tipo =
        document.getElementById(
            "tipoEstoqueMovimentacao"
        );


    const select =
        document.getElementById(
            "itemMovimentacao"
        );


    if (
        !tipo ||
        !select
    ) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML = `

        <option value="">
            Selecione um item
        </option>

    `;


    const lista =
        tipo.value ===
        "materiaPrima"
            ? materiasPrimas
            : produtos;


    lista.forEach(
        function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                (
                    item.codigo ||
                    ""
                ) +
                " - " +
                (
                    item.nome ||
                    ""
                );


            select.appendChild(
                option
            );

        }
    );


    if (
        lista.some(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    valorAtual
                );

            }
        )
    ) {

        select.value =
            valorAtual;

    }

}


/* =========================================================
   MOVIMENTAÇÃO
========================================================= */

function registrarMovimentacao() {

    const tipoEstoque =
        document.getElementById(
            "tipoEstoqueMovimentacao"
        )?.value;


    const operacao =
        document.getElementById(
            "tipoMovimentacao"
        )?.value;


    const itemId =
        Number(
            document.getElementById(
                "itemMovimentacao"
            )?.value
        );


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeMovimentacao"
            )?.value
        );


    const data =
        document.getElementById(
            "dataMovimentacao"
        )?.value ||
        obterDataHoje();


    const observacao =
        document.getElementById(
            "observacaoMovimentacao"
        )?.value.trim();


    if (!itemId) {

        alert(
            "Selecione um item."
        );

        return;

    }


    if (
        !quantidade ||
        quantidade <= 0
    ) {

        alert(
            "Digite uma quantidade válida."
        );

        return;

    }


    const lista =
        tipoEstoque ===
        "materiaPrima"
            ? materiasPrimas
            : produtos;


    const item =
        lista.find(
            function (produto) {

                return (
                    produto.id ===
                    itemId
                );

            }
        );


    if (!item) {

        alert(
            "Item não encontrado."
        );

        return;

    }


    const estoqueAtual =
        Number(
            item.estoque
        ) || 0;


    if (
        operacao === "saida" &&
        estoqueAtual <
            quantidade
    ) {

        alert(
            "Estoque insuficiente."
        );

        return;

    }


    if (
        operacao ===
        "entrada"
    ) {

        item.estoque =
            estoqueAtual +
            quantidade;

    } else {

        item.estoque =
            estoqueAtual -
            quantidade;

    }


    movimentacoes.push({

        id:
            Date.now(),

        data:
            data,

        tipo:
            tipoEstoque,

        itemId:
            itemId,

        itemNome:
            item.nome,

        quantidade:
            quantidade,

        operacao:
            operacao,

        observacao:
            observacao

    });


    salvarDados();

    atualizarTudo();


    const quantidadeCampo =
        document.getElementById(
            "quantidadeMovimentacao"
        );


    const observacaoCampo =
        document.getElementById(
            "observacaoMovimentacao"
        );


    if (quantidadeCampo) {

        quantidadeCampo.value = "";

    }


    if (observacaoCampo) {

        observacaoCampo.value = "";

    }


    alert(
        "Movimentação registrada com sucesso!"
    );

}


/* =========================================================
   HISTÓRICO
========================================================= */

function atualizarHistoricoMovimentacoes() {

    const tabela =
        document.getElementById(
            "historicoMovimentacoes"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    movimentacoes
        .slice()
        .reverse()
        .forEach(
            function (movimento) {

                tabela.innerHTML += `

                    <tr>

                        <td>
                            ${formatarData(
                                movimento.data
                            )}
                        </td>

                        <td>
                            ${
                                movimento.tipo ===
                                "materiaPrima"
                                    ? "Matéria-Prima"
                                    : "Produto Acabado"
                            }
                        </td>

                        <td>
                            ${movimento.itemNome || ""}
                        </td>

                        <td>
                            ${Number(
                                movimento.quantidade || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            ${
                                movimento.operacao ===
                                "entrada"
                                    ? "Entrada"
                                    : "Saída"
                            }
                        </td>

                        <td>
                            ${movimento.observacao || ""}
                        </td>

                    </tr>

                `;

            }
        );

}


/* =========================================================
   PRAZO DE VALIDADE POR CATEGORIA
========================================================= */

function obterDiasValidade(
    produto
) {

    if (!produto) {

        return null;

    }


    const categoria =
        String(
            produto.categoria || ""
        )
        .trim()
        .toLowerCase();


    const nome =
        String(
            produto.nome || ""
        )
        .trim()
        .toLowerCase();


    /*
       Palha Italiana:
       20 dias
    */

    if (
        categoria.includes(
            "palha italiana"
        ) ||
        nome.includes(
            "palha italiana"
        )
    ) {

        return 20;

    }


    /*
       Brownie:
       20 dias
    */

    if (
        categoria.includes(
            "brownie"
        ) ||
        nome.includes(
            "brownie"
        )
    ) {

        return 20;

    }


    /*
       Bolo de Pote:
       7 dias
    */

    if (
        categoria.includes(
            "bolo de pote"
        ) ||
        nome.includes(
            "bolo de pote"
        )
    ) {

        return 7;

    }


    /*
       Outros produtos:
       validade manual
    */

    return null;

}


/* =========================================================
   CALCULAR DATA DE VALIDADE
========================================================= */

function calcularDataValidade(
    dataFabricacao,
    produto
) {

    if (
        !dataFabricacao ||
        !produto
    ) {

        return "";

    }


    const dias =
        obterDiasValidade(
            produto
        );


    if (
        dias === null
    ) {

        return "";

    }


    const data =
        new Date(
            dataFabricacao +
            "T00:00:00"
        );


    data.setDate(
        data.getDate() +
        dias
    );


    return (
        data
            .getFullYear()
            .toString() +
        "-" +
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +
        "-" +
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        )
    );

}


/* =========================================================
   VALIDADE DA PRODUÇÃO
========================================================= */

function calcularValidadeProducao() {

    const produtoSelect =
        document.getElementById(
            "produtoProducao"
        );


    const fabricacao =
        document.getElementById(
            "fabricacaoProducao"
        );


    const validade =
        document.getElementById(
            "validadeProducao"
        );


    if (
        !produtoSelect ||
        !fabricacao ||
        !validade
    ) {

        return;

    }


    const produto =
        produtos.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    produtoSelect.value
                );

            }
        );


    const dataValidade =
        calcularDataValidade(
            fabricacao.value,
            produto
        );


    if (
        dataValidade
    ) {

        validade.value =
            dataValidade;

    } else {

        validade.value = "";

    }

}


/* =========================================================
   VALIDADE DA ETIQUETA
========================================================= */

function calcularValidadeEtiqueta() {

    const produtoSelect =
        document.getElementById(
            "produtoEtiqueta"
        );


    const fabricacao =
        document.getElementById(
            "fabricacaoEtiqueta"
        );


    const validade =
        document.getElementById(
            "validadeEtiqueta"
        );


    if (
        !produtoSelect ||
        !fabricacao ||
        !validade
    ) {

        return;

    }


    const produto =
        produtos.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    produtoSelect.value
                );

            }
        );


    const dataValidade =
        calcularDataValidade(
            fabricacao.value,
            produto
        );


    if (
        dataValidade
    ) {

        validade.value =
            dataValidade;

    } else {

        /*
           Outros produtos:
           validade manual.
           Como o campo é readonly no index atual,
           ele permanecerá vazio até que o HTML
           permita edição manual.
        */

        validade.value = "";

    }

}


/* =========================================================
   CONFIGURAR DATAS
========================================================= */

function configurarDatas() {

    const hoje =
        obterDataHoje();


    const campos = [

        "dataMovimentacao",

        "fabricacaoProducao",

        "fabricacaoEtiqueta"

    ];


    campos.forEach(
        function (id) {

            const campo =
                document.getElementById(
                    id
                );


            if (
                campo &&
                !campo.value
            ) {

                campo.value =
                    hoje;

            }

        }
    );


    calcularValidadeProducao();

    calcularValidadeEtiqueta();

}


/* =========================================================
   PRODUÇÃO
========================================================= */

function registrarProducao() {

    const produtoId =
        Number(
            document.getElementById(
                "produtoProducao"
            )?.value
        );


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeProducao"
            )?.value
        );


    const fabricacao =
        document.getElementById(
            "fabricacaoProducao"
        )?.value ||
        obterDataHoje();


    const validade =
        document.getElementById(
            "validadeProducao"
        )?.value;


    const observacao =
        document.getElementById(
            "observacaoProducao"
        )?.value.trim();


    if (!produtoId) {

        alert(
            "Selecione um produto."
        );

        return;

    }


    if (
        !quantidade ||
        quantidade <= 0
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id ===
                    produtoId
                );

            }
        );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const validadeAutomatica =
        calcularDataValidade(
            fabricacao,
            produto
        );


    const validadeFinal =
        validadeAutomatica ||
        validade;


    produto.estoque =
        (
            Number(
                produto.estoque
            ) || 0
        ) +
        quantidade;


    producoes.push({

        id:
            Date.now(),

        produtoId:
            produto.id,

        produtoNome:
            produto.nome,

        quantidade:
            quantidade,

        fabricacao:
            fabricacao,

        validade:
            validadeFinal || "",

        observacao:
            observacao

    });


    movimentacoes.push({

        id:
            Date.now() + 1,

        data:
            fabricacao,

        tipo:
            "produtoAcabado",

        itemId:
            produto.id,

        itemNome:
            produto.nome,

        quantidade:
            quantidade,

        operacao:
            "entrada",

        observacao:
            "Produção registrada"

    });


    salvarDados();

    atualizarTudo();


    document.getElementById(
        "quantidadeProducao"
    ).value =
        "1";


    document.getElementById(
        "observacaoProducao"
    ).value =
        "";


    alert(
        "Produção registrada com sucesso!"
    );

}


/* =========================================================
   LISTA PRODUÇÃO
========================================================= */

function atualizarListaProducao() {

    const tabela =
        document.getElementById(
            "listaProducao"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    producoes
        .slice()
        .reverse()
        .forEach(
            function (producao) {

                tabela.innerHTML += `

                    <tr>

                        <td>
                            ${producao.produtoNome || ""}
                        </td>

                        <td>
                            ${Number(
                                producao.quantidade || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            ${formatarData(
                                producao.fabricacao
                            )}
                        </td>

                        <td>
                            ${formatarData(
                                producao.validade
                            )}
                        </td>

                    </tr>

                `;

            }
        );

}


/* =========================================================
   PRECIFICAÇÃO
========================================================= */

function calcularPreco() {

    const produtoId =
        Number(
            document.getElementById(
                "produtoPreco"
            )?.value
        );


    const custoMateria =
        Number(
            document.getElementById(
                "custoMateria"
            )?.value
        ) || 0;


    const custoEmbalagem =
        Number(
            document.getElementById(
                "custoEmbalagem"
            )?.value
        ) || 0;


    const outrosCustos =
        Number(
            document.getElementById(
                "outrosCustos"
            )?.value
        ) || 0;


    const margem =
        Number(
            document.getElementById(
                "margemLucro"
            )?.value
        ) || 0;


    const custoTotal =
        custoMateria +
        custoEmbalagem +
        outrosCustos;


    const precoVenda =
        custoTotal *
        (
            1 +
            margem / 100
        );


    const resultadoCusto =
        document.getElementById(
            "resultadoCusto"
        );


    const resultadoVenda =
        document.getElementById(
            "resultadoVenda"
        );


    if (resultadoCusto) {

        resultadoCusto.textContent =
            formatarMoeda(
                custoTotal
            );

    }


    if (resultadoVenda) {

        resultadoVenda.textContent =
            formatarMoeda(
                precoVenda
            );

    }


    if (!produtoId) {

        return;

    }


    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id ===
                    produtoId
                );

            }
        );


    if (!produto) {

        return;

    }


    produto.custoUnitario =
        custoTotal;


    produto.precoVenda =
        precoVenda;


    precificacoes.push({

        id:
            Date.now(),

        produtoId:
            produtoId,

        custoMateria:
            custoMateria,

        custoEmbalagem:
            custoEmbalagem,

        outrosCustos:
            outrosCustos,

        margem:
            margem,

        custoTotal:
            custoTotal,

        precoVenda:
            precoVenda

    });


    salvarDados();

    atualizarListaProdutos();

}


/* =========================================================
   ETIQUETA
========================================================= */

function gerarEtiqueta() {

    const produtoId =
        Number(
            document.getElementById(
                "produtoEtiqueta"
            )?.value
        );


    const fabricacao =
        document.getElementById(
            "fabricacaoEtiqueta"
        )?.value;


    const validadeCampo =
        document.getElementById(
            "validadeEtiqueta"
        );


    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id ===
                    produtoId
                );

            }
        );


    if (!produto) {

        alert(
            "Selecione um produto."
        );

        return;

    }


    const validadeAutomatica =
        calcularDataValidade(
            fabricacao,
            produto
        );


    const validade =
        validadeAutomatica ||
        validadeCampo?.value ||
        "";


    if (
        validadeCampo &&
        validadeAutomatica
    ) {

        validadeCampo.value =
            validadeAutomatica;

    }


    const mostrarProduto =
        document.getElementById(
            "mostrarProduto"
        );


    const mostrarFabricacao =
        document.getElementById(
            "mostrarFabricacao"
        );


    const mostrarValidade =
        document.getElementById(
            "mostrarValidade"
        );


    if (mostrarProduto) {

        mostrarProduto.textContent =
            produto.nome;

    }


    if (mostrarFabricacao) {

        mostrarFabricacao.textContent =
            formatarData(
                fabricacao
            );

    }


    if (mostrarValidade) {

        mostrarValidade.textContent =
            validade
                ? formatarData(
                    validade
                )
                : "--/--/----";

    }


    gerarCodigoBarrasEtiqueta(
        produto
    );

}


/* =========================================================
   GERAR CÓDIGO DE BARRAS DA ETIQUETA
========================================================= */

function gerarCodigoBarrasEtiqueta(
    produto
) {

    const area =
        document.getElementById(
            "codigoBarrasEtiqueta"
        );


    if (!area) {

        return;

    }


    area.innerHTML = "";


    const ean =
        produto.ean ||
        gerarEAN13();


    /*
       Se o produto antigo não possuía EAN,
       salva um novo EAN permanentemente.
    */

    if (!produto.ean) {

        produto.ean =
            ean;

        salvarDados();

    }


    if (
        typeof JsBarcode ===
        "undefined"
    ) {

        area.textContent =
            ean;

        return;

    }


    /*
       Cria SVG próprio.
       Isso evita problemas de tamanho
       e mantém o EAN-13 completo.
    */

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.setAttribute(
        "width",
        "260"
    );


    svg.setAttribute(
        "height",
        "95"
    );


    svg.setAttribute(
        "viewBox",
        "0 0 260 95"
    );


    area.appendChild(
        svg
    );


    try {

        JsBarcode(
            svg,
            ean,
            {

                format:
                    "ean13",

                width:
                    2,

                height:
                    58,

                displayValue:
                    true,

                fontSize:
                    14,

                textMargin:
                    4,

                margin:
                    0,

                flat:
                    false

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao gerar EAN-13:",
            erro
        );

        area.textContent =
            ean;

    }

}


/* =========================================================
   SALVAR ETIQUETA PNG
========================================================= */

function salvarEtiquetaPNG() {

    const etiqueta =
        document.getElementById(
            "etiquetaGerada"
        );


    if (!etiqueta) {

        return;

    }


    if (
        typeof html2canvas ===
        "undefined"
    ) {

        alert(
            "A biblioteca html2canvas não foi carregada."
        );

        return;

    }


    /*
       Garante que a etiqueta esteja
       atualizada antes de salvar.
    */

    gerarEtiqueta();


    setTimeout(
        function () {

            html2canvas(
                etiqueta,
                {

                    scale:
                        3,

                    backgroundColor:
                        "#ffffff",

                    useCORS:
                        true

                }
            ).then(
                function (canvas) {

                    const link =
                        document.createElement(
                            "a"
                        );


                    link.download =
                        "etiqueta-" +
                        obterDataHoraArquivo() +
                        ".png";


                    link.href =
                        canvas.toDataURL(
                            "image/png"
                        );


                    link.click();

                }
            ).catch(
                function (erro) {

                    console.error(
                        erro
                    );

                    alert(
                        "Não foi possível gerar a imagem da etiqueta."
                    );

                }
            );

        },
        200
    );

}


/* =========================================================
   SELECTS DE PRODUTOS
========================================================= */

function atualizarSelectsProdutos() {

    const selects = [

        "produtoProducao",

        "produtoPreco",

        "produtoEtiqueta"

    ];


    selects.forEach(
        function (id) {

            const select =
                document.getElementById(
                    id
                );


            if (!select) {

                return;

            }


            const valorAtual =
                select.value;


            select.innerHTML = `

                <option value="">
                    Selecione um produto
                </option>

            `;


            produtos.forEach(
                function (produto) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        produto.id;


                    option.textContent =
                        (
                            produto.codigo ||
                            ""
                        ) +
                        " - " +
                        (
                            produto.nome ||
                            ""
                        );


                    select.appendChild(
                        option
                    );

                }
            );


            if (
                produtos.some(
                    function (produto) {

                        return String(
                            produto.id
                        ) ===
                        String(
                            valorAtual
                        );

                    }
                )
            ) {

                select.value =
                    valorAtual;

            }

        }
    );


    calcularValidadeProducao();

    calcularValidadeEtiqueta();

}


/* =========================================================
   SELECTS MATÉRIA-PRIMA
========================================================= */

function atualizarSelectsMateriaPrima() {

    atualizarItensMovimentacao();

}


/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {

    const totalProdutos =
        document.getElementById(
            "totalProdutos"
        );


    const totalMP =
        document.getElementById(
            "totalMateriaPrima"
        );


    if (totalProdutos) {

        totalProdutos.textContent =
            produtos.length;

    }


    if (totalMP) {

        totalMP.textContent =
            materiasPrimas.length;

    }


    atualizarUltimaAtualizacao();

}


/* =========================================================
   ÚLTIMA ATUALIZAÇÃO
========================================================= */

function atualizarUltimaAtualizacao() {

    const campo =
        document.getElementById(
            "ultimaAtualizacao"
        );


    if (!campo) {

        return;

    }


    const ultima =
        localStorage.getItem(
            STORAGE_ULTIMA_ATUALIZACAO
        );


    campo.textContent =
        ultima || "--";

}


/* =========================================================
   BACKUP
========================================================= */

function exportarBackup() {

    const backup = {

        versao:
            "4.0",

        data:
            new Date().toISOString(),

        produtos:
            produtos,

        materiasPrimas:
            materiasPrimas,

        movimentacoes:
            movimentacoes,

        producoes:
            producoes,

        precificacoes:
            precificacoes

    };


    const arquivo =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    4
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            arquivo
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "backup-carols-gourmet-" +
        obterDataHoje() +
        ".json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORTAR BACKUP
========================================================= */

function importarBackup() {

    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        ".json,application/json";


    input.onchange =
        function (evento) {

            const arquivo =
                evento.target.files[0];


            if (!arquivo) {

                return;

            }


            const leitor =
                new FileReader();


            leitor.onload =
                function (e) {

                    try {

                        const backup =
                            JSON.parse(
                                e.target.result
                            );


                        if (
                            !backup ||
                            !Array.isArray(
                                backup.produtos
                            )
                        ) {

                            alert(
                                "Arquivo de backup inválido."
                            );

                            return;

                        }


                        if (
                            !confirm(
                                "Restaurar este backup irá substituir os dados atuais. Deseja continuar?"
                            )
                        ) {

                            return;

                        }


                        produtos =
                            backup.produtos ||
                            [];


                        materiasPrimas =
                            backup.materiasPrimas ||
                            [];


                        movimentacoes =
                            backup.movimentacoes ||
                            [];


                        producoes =
                            backup.producoes ||
                            [];


                        precificacoes =
                            backup.precificacoes ||
                            [];


                        salvarDados();

                        atualizarTudo();


                        alert(
                            "Backup restaurado com sucesso!"
                        );

                    } catch (erro) {

                        console.error(
                            erro
                        );

                        alert(
                            "Não foi possível restaurar o backup."
                        );

                    }

                };


            leitor.readAsText(
                arquivo
            );

        };


    input.click();

}


/* =========================================================
   ATUALIZAÇÃO GERAL
========================================================= */

function atualizarTudo() {

    atualizarDashboard();

    atualizarListaProdutos();

    atualizarListaMateriaPrima();

    atualizarSelectsProdutos();

    atualizarSelectsMateriaPrima();

    alterarTipoEstoque();

    atualizarItensMovimentacao();

    atualizarHistoricoMovimentacoes();

    atualizarListaProducao();

}


/* =========================================================
   DATA ATUAL
========================================================= */

function obterDataHoje() {

    const agora =
        new Date();


    return (

        agora.getFullYear() +

        "-" +

        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        "-" +

        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        )

    );

}


/* =========================================================
   FORMATAÇÃO DE DATA
========================================================= */

function formatarData(
    data
) {

    if (!data) {

        return "--/--/----";

    }


    const partes =
        String(
            data
        ).split("-");


    if (
        partes.length === 3
    ) {

        return (

            partes[2] +

            "/" +

            partes[1] +

            "/" +

            partes[0]

        );

    }


    return data;

}


/* =========================================================
   FORMATAÇÃO DE MOEDA
========================================================= */

function formatarMoeda(
    valor
) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {

            style:
                "currency",

            currency:
                "BRL"

        }
    );

}


/* =========================================================
   NOME DE ARQUIVO
========================================================= */

function obterDataHoraArquivo() {

    const agora =
        new Date();


    return (

        agora.getFullYear() +

        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        ) +

        "-" +

        String(
            agora.getHours()
        ).padStart(
            2,
            "0"
        ) +

        String(
            agora.getMinutes()
        ).padStart(
            2,
            "0"
        ) +

        String(
            agora.getSeconds()
        ).padStart(
            2,
            "0"
        )

    );

}


/* =========================================================
   COMPATIBILIDADE COM INDEX.HTML
========================================================= */

window.mostrarAba =
    mostrarAba;

window.toggleMenu =
    toggleMenu;

window.salvarProduto =
    salvarProduto;

window.novoProduto =
    novoProduto;

window.editarProduto =
    editarProduto;

window.excluirProduto =
    excluirProduto;

window.salvarMateriaPrima =
    salvarMateriaPrima;

window.novaMateriaPrima =
    novaMateriaPrima;

window.alterarTipoEstoque =
    alterarTipoEstoque;

window.atualizarItensMovimentacao =
    atualizarItensMovimentacao;

window.registrarMovimentacao =
    registrarMovimentacao;

window.registrarProducao =
    registrarProducao;

window.calcularPreco =
    calcularPreco;

window.gerarEtiqueta =
    gerarEtiqueta;

window.salvarEtiquetaPNG =
    salvarEtiquetaPNG;

window.exportarBackup =
    exportarBackup;

window.importarBackup =
    importarBackup;

window.calcularValidadeProducao =
    calcularValidadeProducao;

window.calcularValidadeEtiqueta =
    calcularValidadeEtiqueta;
