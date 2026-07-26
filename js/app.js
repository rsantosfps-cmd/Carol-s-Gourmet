/* =========================================================
   CAROL'S GOURMET
   APP.JS
   ERP 4.0
   VERSÃO COMPLETA E CORRIGIDA

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
   CHAVES DO LOCALSTORAGE
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

    }

    catch (erro) {

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


    const agora =
        new Date().toLocaleString(
            "pt-BR"
        );


    localStorage.setItem(
        STORAGE_ULTIMA_ATUALIZACAO,
        agora
    );


    atualizarUltimaAtualizacao();

}


/* =========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================= */

function inicializarSistema() {

    gerarNovoCodigoProduto();

    gerarNovoCodigoMP();

    atualizarSelectsProdutos();

    atualizarSelectsMateriaPrima();

    alterarTipoEstoque();

    atualizarItensMovimentacao();

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
   GERAR CÓDIGO INTERNO
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
                    item.codigo.replace(
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


    const proximo =
        maiorNumero + 1;


    return (
        prefixo +
        String(proximo).padStart(
            4,
            "0"
        )
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
   GERAR EAN-13
========================================================= */

function gerarEAN13() {

    let numeroBase = "";


    for (
        let i = 0;
        i < 12;
        i++
    ) {

        numeroBase +=
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
            parseInt(
                numeroBase[i],
                10
            );


        if (
            i % 2 === 0
        ) {

            soma += numero;

        }

        else {

            soma +=
                numero * 3;

        }

    }


    const digito =
        (
            10 -
            (
                soma % 10
            )
        ) % 10;


    return (
        numeroBase +
        digito
    );

}


/* =========================================================
   SALVAR PRODUTO
========================================================= */

function salvarProduto() {

    const codigo =
        document.getElementById(
            "codigoProduto"
        ).value.trim();


    const nome =
        document.getElementById(
            "nomeProduto"
        ).value.trim();


    const categoria =
        document.getElementById(
            "categoriaProduto"
        ).value;


    const unidade =
        document.getElementById(
            "unidadeProduto"
        ).value;


    const status =
        document.getElementById(
            "statusProduto"
        ).value;


    if (!nome) {

        alert(
            "Digite o nome do produto."
        );

        return;

    }


    if (!categoria) {

        alert(
            "Selecione uma categoria."
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

    }

    else {

        const novoProdutoObjeto = {

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
            novoProdutoObjeto
        );

    }


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
   LISTAR PRODUTOS
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


            const valorTotal =
                (
                    Number(
                        produto.estoque
                    ) || 0
                ) *
                (
                    Number(
                        produto.custoUnitario
                    ) || 0
                );


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
                    ${Number(
                        produto.estoque || 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${formatarMoeda(
                        produto.custoUnitario || 0
                    )}
                </td>

                <td>
                    ${formatarMoeda(
                        valorTotal
                    )}
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

                return item.id === id;

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

    const confirmar =
        confirm(
            "Deseja realmente excluir este produto?"
        );


    if (!confirmar) {

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
        ).value.trim();


    const nome =
        document.getElementById(
            "nomeMP"
        ).value.trim();


    const categoria =
        document.getElementById(
            "categoriaMP"
        ).value;


    const unidade =
        document.getElementById(
            "unidadeMP"
        ).value;


    const estoque =
        Number(
            document.getElementById(
                "estoqueMP"
            ).value
        ) || 0;


    const custo =
        Number(
            document.getElementById(
                "custoMP"
            ).value
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

    }

    else {

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
   LISTAR MATÉRIA-PRIMA
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

            const linha =
                document.createElement(
                    "tr"
                );


            const custoTotal =
                (
                    Number(
                        materia.estoque
                    ) || 0
                ) *
                (
                    Number(
                        materia.custo
                    ) || 0
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
                    ${Number(
                        materia.estoque || 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${formatarMoeda(
                        materia.custo || 0
                    )}
                </td>

                <td>
                    ${formatarMoeda(
                        custoTotal
                    )}
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
   CONSULTA E MOVIMENTAÇÃO MANUAL
========================================================= */

function alterarTipoEstoque() {

    const select =
        document.getElementById(
            "tipoEstoque"
        );


    if (!select) {

        return;

    }


    const tipo =
        select.value;


    const cabecalho =
        document.getElementById(
            "cabecalhoEstoque"
        );


    const tabela =
        document.getElementById(
            "listaEstoque"
        );


    if (
        !cabecalho ||
        !tabela
    ) {

        return;

    }


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

                const valorTotal =
                    (
                        Number(
                            item.estoque
                        ) || 0
                    ) *
                    (
                        Number(
                            item.custo
                        ) || 0
                    );


                tabela.innerHTML += `

                    <tr>

                        <td>
                            ${item.codigo || ""}
                        </td>

                        <td>
                            ${item.nome || ""}
                        </td>

                        <td>
                            ${item.categoria || ""}
                        </td>

                        <td>
                            ${item.unidade || ""}
                        </td>

                        <td>
                            ${Number(
                                item.estoque || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            ${formatarMoeda(
                                item.custo || 0
                            )}
                        </td>

                        <td>
                            ${formatarMoeda(
                                valorTotal
                            )}
                        </td>

                    </tr>

                `;

            }
        );

    }

    else {

        cabecalho.innerHTML = `

            <tr>

                <th>Código</th>

                <th>Nome</th>

                <th>Categoria</th>

                <th>Unidade</th>

                <th>Estoque Atual</th>

                <th>Status</th>

            </tr>

        `;


        produtos.forEach(
            function (item) {

                tabela.innerHTML += `

                    <tr>

                        <td>
                            ${item.codigo || ""}
                        </td>

                        <td>
                            ${item.nome || ""}
                        </td>

                        <td>
                            ${item.categoria || ""}
                        </td>

                        <td>
                            ${item.unidade || ""}
                        </td>

                        <td>
                            ${Number(
                                item.estoque || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            ${item.status || ""}
                        </td>

                    </tr>

                `;

            }
        );

    }

}


/* =========================================================
   ATUALIZAR ITENS PARA MOVIMENTAÇÃO
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

}


/* =========================================================
   REGISTRAR MOVIMENTAÇÃO MANUAL
========================================================= */

function registrarMovimentacao() {

    const tipoEstoque =
        document.getElementById(
            "tipoEstoqueMovimentacao"
        ).value;


    const operacao =
        document.getElementById(
            "tipoMovimentacao"
        ).value;


    const itemId =
        Number(
            document.getElementById(
                "itemMovimentacao"
            ).value
        );


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeMovimentacao"
            ).value
        );


    const data =
        document.getElementById(
            "dataMovimentacao"
        ).value ||
        obterDataHoje();


    const observacao =
        document.getElementById(
            "observacaoMovimentacao"
        ).value.trim();


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


    let item;


    if (
        tipoEstoque ===
        "materiaPrima"
    ) {

        item =
            materiasPrimas.find(
                function (produto) {

                    return (
                        produto.id ===
                        itemId
                    );

                }
            );

    }

    else {

        item =
            produtos.find(
                function (produto) {

                    return (
                        produto.id ===
                        itemId
                    );

                }
            );

    }


    if (!item) {

        alert(
            "Item não encontrado."
        );

        return;

    }


    if (
        operacao ===
        "saida" &&
        Number(
            item.estoque || 0
        ) <
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
            Number(
                item.estoque || 0
            ) +
            quantidade;

    }

    else {

        item.estoque =
            Number(
                item.estoque || 0
            ) -
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
            observacao,

        origem:
            "manual"

    });


    salvarDados();

    atualizarTudo();


    document.getElementById(
        "quantidadeMovimentacao"
    ).value = "";


    document.getElementById(
        "observacaoMovimentacao"
    ).value = "";


    alert(
        "Movimentação registrada com sucesso!"
    );

}


/* =========================================================
   HISTÓRICO DE MOVIMENTAÇÕES
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

                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

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
                        ${
                            movimento.itemNome ||
                            ""
                        }
                    </td>

                    <td>
                        ${Number(
                            movimento.quantidade ||
                            0
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
                        ${
                            movimento.observacao ||
                            ""
                        }
                    </td>

                `;


                tabela.appendChild(
                    linha
                );

            }
        );

}


/* =========================================================
   PRODUÇÃO
   PRODUÇÃO = ENTRADA AUTOMÁTICA DE PRODUTO ACABADO

   IMPORTANTE:
   Ao registrar produção:
   1. A quantidade produzida é adicionada ao estoque.
   2. A produção é salva no histórico de produção.
   3. É criada uma movimentação automática de entrada.
   4. O usuário NÃO precisa registrar outra entrada
      manualmente no Estoque.
========================================================= */

function registrarProducao() {

    const produtoId =
        Number(
            document.getElementById(
                "produtoProducao"
            ).value
        );


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeProducao"
            ).value
        );


    const fabricacao =
        document.getElementById(
            "fabricacaoProducao"
        ).value ||
        obterDataHoje();


    const validadeCampo =
        document.getElementById(
            "validadeProducao"
        );


    const validade =
        validadeCampo
            ? validadeCampo.value
            : "";


    const observacao =
        document.getElementById(
            "observacaoProducao"
        ).value.trim();


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


    /*
       UMA ÚNICA ALTERAÇÃO DE ESTOQUE

       A produção entra diretamente
       como produto acabado.
    */

    produto.estoque =
        Number(
            produto.estoque || 0
        ) +
        quantidade;


    /*
       REGISTRA A PRODUÇÃO
    */

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
            validade,

        observacao:
            observacao

    });


    /*
       REGISTRA NO HISTÓRICO DE ESTOQUE

       Isso é apenas histórico/auditoria.
       Não altera o estoque novamente.
    */

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
            observacao
                ? "Produção: " +
                  observacao
                : "Produção registrada",

        origem:
            "producao"

    });


    salvarDados();

    atualizarTudo();


    alert(
        "Produção registrada com sucesso!\n\n" +
        "Quantidade produzida: " +
        quantidade +
        "\n" +
        "Produto adicionado ao estoque de produtos acabados."
    );


    document.getElementById(
        "quantidadeProducao"
    ).value =
        "1";


    document.getElementById(
        "observacaoProducao"
    ).value =
        "";


    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoProducao"
        );


    if (fabricacaoCampo) {

        fabricacaoCampo.value =
            obterDataHoje();

    }


    calcularValidadeProducao();

}


/* =========================================================
   LISTA DE PRODUÇÕES
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
                            ${
                                producao.produtoNome ||
                                ""
                            }
                        </td>

                        <td>
                            ${Number(
                                producao.quantidade ||
                                0
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
            ).value
        );


    const custoMateria =
        Number(
            document.getElementById(
                "custoMateria"
            ).value
        ) || 0;


    const custoEmbalagem =
        Number(
            document.getElementById(
                "custoEmbalagem"
            ).value
        ) || 0;


    const outrosCustos =
        Number(
            document.getElementById(
                "outrosCustos"
            ).value
        ) || 0;


    const margem =
        Number(
            document.getElementById(
                "margemLucro"
            ).value
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


    if (produtoId) {

        const produto =
            produtos.find(
                function (item) {

                    return (
                        item.id ===
                        produtoId
                    );

                }
            );


        if (produto) {

            produto.custoUnitario =
                custoTotal;

            produto.precoVenda =
                precoVenda;

        }


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

}


/* =========================================================
   ETIQUETAS
   MANTIDA A LÓGICA PROFISSIONAL EAN-13
========================================================= */

function gerarEtiqueta() {

    const produtoId =
        Number(
            document.getElementById(
                "produtoEtiqueta"
            ).value
        );


    const fabricacao =
        document.getElementById(
            "fabricacaoEtiqueta"
        ).value;


    const validade =
        document.getElementById(
            "validadeEtiqueta"
        ).value;


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


    document.getElementById(
        "mostrarProduto"
    ).textContent =
        produto.nome;


    document.getElementById(
        "mostrarFabricacao"
    ).textContent =
        formatarData(
            fabricacao
        );


    document.getElementById(
        "mostrarValidade"
    ).textContent =
        formatarData(
            validade
        );


    const areaCodigo =
        document.getElementById(
            "codigoBarrasEtiqueta"
        );


    areaCodigo.innerHTML = "";


    if (
        typeof JsBarcode !==
        "undefined"
    ) {

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );


        areaCodigo.appendChild(
            svg
        );


        JsBarcode(
            svg,
            produto.ean ||
            gerarEAN13(),
            {

                format:
                    "EAN13",

                displayValue:
                    true,

                width:
                    2,

                height:
                    50,

                margin:
                    5

            }
        );

    }

    else {

        areaCodigo.textContent =
            produto.ean || "";

    }

}


/* =========================================================
   SALVAR ETIQUETA COMO PNG
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


    html2canvas(
        etiqueta
    ).then(
        function (canvas) {

            const link =
                document.createElement(
                    "a"
                );


            link.download =
                "etiqueta-carols-gourmet.png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        }
    );

}


/* =========================================================
   DATAS
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
   OBTER DATA DE HOJE
========================================================= */

function obterDataHoje() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        ano +
        "-" +
        mes +
        "-" +
        dia
    );

}


/* =========================================================
   DETERMINAR PRAZO DE VALIDADE
=========================================================

   Palha Italiana = 20 dias
   Brownie        = 20 dias
   Bolo de Pote   = 7 dias
   Outros         = manual
========================================================= */

function obterDiasValidadeProduto(
    produto
) {

    if (!produto) {

        return null;

    }


    const nome =
        String(
            produto.nome || ""
        )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );


    const categoria =
        String(
            produto.categoria || ""
        )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );


    if (
        nome.includes(
            "palha italiana"
        ) ||
        categoria.includes(
            "palha italiana"
        )
    ) {

        return 20;

    }


    if (
        nome.includes(
            "brownie"
        ) ||
        categoria.includes(
            "brownie"
        )
    ) {

        return 20;

    }


    if (
        nome.includes(
            "bolo de pote"
        ) ||
        categoria.includes(
            "bolo de pote"
        )
    ) {

        return 7;

    }


    return null;

}


/* =========================================================
   CALCULAR VALIDADE DE PRODUÇÃO
========================================================= */

function calcularValidadeProducao() {

    const fabricacao =
        document.getElementById(
            "fabricacaoProducao"
        );


    const validade =
        document.getElementById(
            "validadeProducao"
        );


    const produtoSelect =
        document.getElementById(
            "produtoProducao"
        );


    if (
        !fabricacao ||
        !validade
    ) {

        return;

    }


    if (!fabricacao.value) {

        validade.value = "";

        return;

    }


    const produtoId =
        produtoSelect
            ? Number(
                produtoSelect.value
            )
            : 0;


    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id ===
                    produtoId
                );

            }
        );


    const dias =
        obterDiasValidadeProduto(
            produto
        );


    /*
       OUTROS PRODUTOS:
       validade manual.
    */

    if (
        dias === null
    ) {

        validade.readOnly =
            false;

        return;

    }


    /*
       PALHA / BROWNIE / BOLO:
       cálculo automático.
    */

    validade.readOnly =
        true;


    const data =
        new Date(
            fabricacao.value +
            "T00:00:00"
        );


    data.setDate(
        data.getDate() +
        dias
    );


    validade.value =
        data
            .toISOString()
            .split(
                "T"
            )[0];

}


/* =========================================================
   CALCULAR VALIDADE DA ETIQUETA
========================================================= */

function calcularValidadeEtiqueta() {

    const fabricacao =
        document.getElementById(
            "fabricacaoEtiqueta"
        );


    const validade =
        document.getElementById(
            "validadeEtiqueta"
        );


    const produtoSelect =
        document.getElementById(
            "produtoEtiqueta"
        );


    if (
        !fabricacao ||
        !validade
    ) {

        return;

    }


    if (!fabricacao.value) {

        validade.value = "";

        return;

    }


    const produtoId =
        produtoSelect
            ? Number(
                produtoSelect.value
            )
            : 0;


    const produto =
        produtos.find(
            function (item) {

                return (
                    item.id ===
                    produtoId
                );

            }
        );


    const dias =
        obterDiasValidadeProduto(
            produto
        );


    /*
       OUTROS PRODUTOS:
       validade manual.
    */

    if (
        dias === null
    ) {

        validade.readOnly =
            false;

        return;

    }


    /*
       PRODUTOS COM PRAZO PADRÃO
    */

    validade.readOnly =
        true;


    const data =
        new Date(
            fabricacao.value +
            "T00:00:00"
        );


    data.setDate(
        data.getDate() +
        dias
    );


    validade.value =
        data
            .toISOString()
            .split(
                "T"
            )[0];

}


/* =========================================================
   EVENTOS DE DATA E PRODUTO
========================================================= */

document.addEventListener(
    "change",
    function (evento) {

        if (
            evento.target.id ===
            "fabricacaoProducao" ||
            evento.target.id ===
            "produtoProducao"
        ) {

            calcularValidadeProducao();

        }


        if (
            evento.target.id ===
            "fabricacaoEtiqueta" ||
            evento.target.id ===
            "produtoEtiqueta"
        ) {

            calcularValidadeEtiqueta();

        }

    }
);


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

                        return (
                            String(
                                produto.id
                            ) ===
                            String(
                                valorAtual
                            )
                        );

                    }
                )
            ) {

                select.value =
                    valorAtual;

            }

        }
    );


    /*
       Depois de atualizar os produtos,
       recalcula as validades.
    */

    calcularValidadeProducao();

    calcularValidadeEtiqueta();

}


/* =========================================================
   SELECTS DE MATÉRIA-PRIMA
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
        ultima ||
        "--";

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


    link.click();


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


                        const confirmar =
                            confirm(
                                "Restaurar este backup irá substituir os dados atuais. Deseja continuar?"
                            );


                        if (!confirmar) {

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

                    }

                    catch (erro) {

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
        ).split(
            "-"
        );


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
