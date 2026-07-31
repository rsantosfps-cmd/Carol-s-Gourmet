/* =========================================================
   CAROL'S GOURMET
   APP.JS
   VERSÃO COMPLETA
   ---------------------------------------------------------
   - Produtos
   - Matéria-prima
   - Estoque
   - Produção
   - Precificação
   - Etiquetas EAN-13
   - Tarjetas 5 x 21 cm
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
   LOCAL STORAGE
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

        atualizarProdutosTarjeta();

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

    atualizarSelectsProdutos();

    atualizarSelectsMateriaPrima();

    alterarTipoEstoque();

    atualizarItensMovimentacao();

}


/* =========================================================
   MENU LATERAL
========================================================= */

function mostrarAba(idAba, botao) {

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
   CÓDIGO INTERNO
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

                maiorNumero = numero;

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
   EAN-13
   ---------------------------------------------------------
   NÃO ALTERAR A ESTRUTURA
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

        } else {

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


        produtoEditando = null;


    } else {

        produtos.push({

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

            dataCadastro:
                new Date().toISOString()

        });

    }


    salvarDados();

    atualizarTudo();

    novoProduto();

    atualizarProdutosTarjeta();


    alert(
        "Produto salvo com sucesso!"
    );

}


/* =========================================================
   NOVO PRODUTO
========================================================= */

function novoProduto() {

    produtoEditando = null;


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
                    R$ ${Number(
                        produto.custoUnitario || 0
                    ).toFixed(2)}
                </td>

                <td>
                    R$ ${valorTotal.toFixed(2)}
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


    produtoEditando = id;


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
            produto.codigo || "";

    }


    if (ean) {

        ean.value =
            produto.ean || "";

    }


    if (nome) {

        nome.value =
            produto.nome || "";

    }


    if (categoria) {

        categoria.value =
            produto.categoria || "";

    }


    if (unidade) {

        unidade.value =
            produto.unidade ||
            "Unidade";

    }


    if (status) {

        status.value =
            produto.status ||
            "Ativo";

    }


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

                return produto.id !== id;

            }
        );


    salvarDados();

    atualizarTudo();

    atualizarProdutosTarjeta();

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

    materiaPrimaEditando = null;


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

                <td>${materia.codigo || ""}</td>

                <td>${materia.nome || ""}</td>

                <td>${materia.categoria || ""}</td>

                <td>${materia.unidade || ""}</td>

                <td>
                    ${Number(
                        materia.estoque || 0
                    ).toFixed(2)}
                </td>

                <td>
                    R$ ${Number(
                        materia.custo || 0
                    ).toFixed(2)}
                </td>

                <td>
                    R$ ${custoTotal.toFixed(2)}
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


    if (!cabecalho || !tabela) {

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

                        <td>${item.codigo}</td>

                        <td>${item.nome}</td>

                        <td>${item.categoria}</td>

                        <td>${item.unidade}</td>

                        <td>
                            ${Number(
                                item.estoque || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            R$ ${Number(
                                item.custo || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            R$ ${valorTotal.toFixed(2)}
                        </td>

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

                        <td>${item.codigo}</td>

                        <td>${item.nome}</td>

                        <td>${item.categoria}</td>

                        <td>${item.unidade}</td>

                        <td>
                            ${Number(
                                item.estoque || 0
                            ).toFixed(2)}
                        </td>

                        <td>${item.status}</td>

                    </tr>

                `;

            }
        );

    }

}


/* =========================================================
   MOVIMENTAÇÃO
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


    if (!tipo || !select) {

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
                item.codigo +
                " - " +
                item.nome;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   REGISTRAR MOVIMENTAÇÃO
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


    } else {

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
        ) < quantidade
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


    } else {

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

                `;


                tabela.appendChild(
                    linha
                );

            }
        );

}


/* =========================================================
   PRODUÇÃO
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


    const validade =
        document.getElementById(
            "validadeProducao"
        ).value;


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


    produto.estoque =
        Number(
            produto.estoque || 0
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
            validade,

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


    const quantidadeCampo =
        document.getElementById(
            "quantidadeProducao"
        );


    const observacaoCampo =
        document.getElementById(
            "observacaoProducao"
        );


    if (quantidadeCampo) {

        quantidadeCampo.value = "1";

    }


    if (observacaoCampo) {

        observacaoCampo.value = "";

    }


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
   ETIQUETA
   ---------------------------------------------------------
   ESTA PARTE CONTINUA SEPARADA DA TARJETA
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
            formatarData(
                validade
            );

    }


    const areaCodigo =
        document.getElementById(
            "codigoBarrasEtiqueta"
        );


    if (!areaCodigo) {

        return;

    }


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


    } else {

        areaCodigo.textContent =
            produto.ean || "";

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

        "fabricacaoEtiqueta",

        "fabricacaoTarjeta"

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

    calcularValidadeTarjeta();

}


/* =========================================================
   DATA DE HOJE
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
   VALIDADE PRODUÇÃO
   ---------------------------------------------------------
   Palha Italiana = 20 dias
   Brownie = 20 dias
   Bolo de pote = 7 dias
   Outros = manual
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
        .trim()
        .toLowerCase();


    const categoria =
        String(
            produto.categoria || ""
        )
        .trim()
        .toLowerCase();


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


function calcularDataValidade(
    dataFabricacao,
    dias
) {

    if (
        !dataFabricacao ||
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
            .toISOString()
            .split("T")[0]
    );

}


/* =========================================================
   VALIDADE PRODUÇÃO
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


    let produto = null;


    if (
        produtoSelect &&
        produtoSelect.value
    ) {

        produto =
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

    }


    const dias =
        obterDiasValidadeProduto(
            produto
        );


    if (dias === null) {

        /*
         * Outros produtos:
         * não altera automaticamente.
         */

        return;

    }


    validade.value =
        calcularDataValidade(
            fabricacao.value,
            dias
        );

}


/* =========================================================
   VALIDADE ETIQUETA
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


    let produto = null;


    if (
        produtoSelect &&
        produtoSelect.value
    ) {

        produto =
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

    }


    const dias =
        obterDiasValidadeProduto(
            produto
        );


    if (dias === null) {

        /*
         * Outros produtos:
         * validade manual.
         */

        return;

    }


    validade.value =
        calcularDataValidade(
            fabricacao.value,
            dias
        );

}


/* =========================================================
   EVENTOS DE DATA / PRODUTO
========================================================= */

document.addEventListener(
    "change",
    function (evento) {

        const id =
            evento.target.id;


        if (
            id ===
            "fabricacaoProducao" ||
            id ===
            "produtoProducao"
        ) {

            calcularValidadeProducao();

        }


        if (
            id ===
            "fabricacaoEtiqueta" ||
            id ===
            "produtoEtiqueta"
        ) {

            calcularValidadeEtiqueta();

        }


        if (
            id ===
            "fabricacaoTarjeta" ||
            id ===
            "produtoTarjeta"
        ) {

            calcularValidadeTarjeta();

        }


        if (
            id ===
            "tipoEstoqueMovimentacao"
        ) {

            atualizarItensMovimentacao();

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
                        produto.codigo +
                        " - " +
                        produto.nome;


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

}


/* =========================================================
   SELECT DA TARJETA
   ---------------------------------------------------------
   SOMENTE:
   - Palha Italiana
   - Brownie
========================================================= */

function produtoPodeTerTarjeta(
    produto
) {

    if (!produto) {

        return false;

    }


    const nome =
        String(
            produto.nome || ""
        )
        .toLowerCase();


    const categoria =
        String(
            produto.categoria || ""
        )
        .toLowerCase();


    return (
        nome.includes(
            "palha italiana"
        ) ||
        nome.includes(
            "brownie"
        ) ||
        categoria.includes(
            "palha italiana"
        ) ||
        categoria.includes(
            "brownie"
        )
    );

}


function atualizarProdutosTarjeta() {

    const select =
        document.getElementById(
            "produtoTarjeta"
        );


    if (!select) {

        return;

    }


    const valorAtual =
        select.value;


    select.innerHTML = `

        <option value="">
            Selecione Brownie ou Palha Italiana
        </option>

    `;


    produtos
        .filter(
            produtoPodeTerTarjeta
        )
        .forEach(
            function (produto) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    produto.id;


                option.textContent =
                    produto.codigo +
                    " - " +
                    produto.nome;


                select.appendChild(
                    option
                );

            }
        );


    if (
        produtos.some(
            function (produto) {

                return (
                    produtoPodeTerTarjeta(
                        produto
                    ) &&
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


    calcularValidadeTarjeta();

}


/* =========================================================
   VALIDADE DA TARJETA
========================================================= */

function calcularValidadeTarjeta() {

    const fabricacao =
        document.getElementById(
            "fabricacaoTarjeta"
        );


    const validade =
        document.getElementById(
            "validadeTarjeta"
        );


    const produtoSelect =
        document.getElementById(
            "produtoTarjeta"
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


    let produto = null;


    if (
        produtoSelect &&
        produtoSelect.value
    ) {

        produto =
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

    }


    const dias =
        obterDiasValidadeProduto(
            produto
        );


    if (dias === null) {

        return;

    }


    validade.value =
        calcularDataValidade(
            fabricacao.value,
            dias
        );

}


/* =========================================================
   ATUALIZAR MATÉRIA-PRIMA
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
            "1.0",

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
                            backup.produtos || [];


                        materiasPrimas =
                            backup.materiasPrimas || [];


                        movimentacoes =
                            backup.movimentacoes || [];


                        producoes =
                            backup.producoes || [];


                        precificacoes =
                            backup.precificacoes || [];


                        salvarDados();

                        atualizarTudo();

                        atualizarProdutosTarjeta();


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
   =========================================================
   TARJETAS
   =========================================================
   ---------------------------------------------------------
   SOMENTE:
   - PALHA ITALIANA
   - BROWNIE
   ---------------------------------------------------------
   Cada produto mantém seu próprio EAN-13.
   Cada sabor de brownie continua com seu próprio código.
   =========================================================
========================================================= */


/* =========================================================
   GERAR UMA TARJETA
========================================================= */

function criarTarjetaHTML(
    produto,
    fabricacao,
    validade
) {

    if (!produto) {

        return "";

    }


    /*
     * O EAN já pertence ao produto.
     * Não criamos outro código.
     */

    const ean =
        produto.ean ||
        gerarEAN13();


    /*
     * A estrutura visual da tarjeta é controlada
     * pelo CSS enviado anteriormente.
     *
     * Aqui apenas montamos os elementos.
     */

    return `

        <div
            class="tarjeta-impressao"
            data-produto-id="${produto.id}"
        >

            <div class="tarjeta-topo">

                <div class="tarjeta-xadrez">
                </div>

                <div class="tarjeta-onda-topo">
                </div>

            </div>


            <div class="tarjeta-conteudo">

                <div class="tarjeta-codigo">

                    <svg
                        class="barcode-tarjeta"
                        data-ean="${ean}"
                    ></svg>

                    <div class="tarjeta-datas">

                        <span>
                            FAB:
                            ${formatarData(
                                fabricacao
                            )}
                        </span>

                        <span>
                            VAL:
                            ${formatarData(
                                validade
                            )}
                        </span>

                    </div>

                </div>


                <div class="tarjeta-logo">

                    <img
                        src="assets/logo.png"
                        alt="Carol's Gourmet"
                    >

                </div>


                <div class="tarjeta-frase">

                    <div class="tarjeta-linha">

                        <span></span>

                        <strong>♥</strong>

                        <span></span>

                    </div>

                    <div class="tarjeta-frase-destaque">
                        Feito com amor,
                    </div>

                    <div class="tarjeta-frase-normal">
                        pra adoçar seus dias!
                    </div>

                    <div class="tarjeta-coracao">
                        ♥
                    </div>

                </div>

            </div>


            <div class="tarjeta-base">

                <div class="tarjeta-onda-base">
                </div>

                <div class="tarjeta-xadrez">
                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   GERAR TARJETAS
   ---------------------------------------------------------
   O botão pode ser usado várias vezes.
   Isso permite misturar sabores.
========================================================= */

function gerarTarjetas() {

    const produtoSelect =
        document.getElementById(
            "produtoTarjeta"
        );


    const quantidadeCampo =
        document.getElementById(
            "quantidadeTarjeta"
        );


    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoTarjeta"
        );


    const validadeCampo =
        document.getElementById(
            "validadeTarjeta"
        );


    const area =
        document.getElementById(
            "areaTarjetas"
        );


    if (!produtoSelect) {

        alert(
            "Campo de produto da tarjeta não encontrado."
        );

        return;

    }


    const produtoId =
        Number(
            produtoSelect.value
        );


    const quantidade =
        Number(
            quantidadeCampo
                ? quantidadeCampo.value
                : 1
        ) || 1;


    const fabricacao =
        fabricacaoCampo
            ? fabricacaoCampo.value
            : obterDataHoje();


    let validade =
        validadeCampo
            ? validadeCampo.value
            : "";


    if (!produtoId) {

        alert(
            "Selecione o Brownie ou a Palha Italiana."
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


    if (
        !produtoPodeTerTarjeta(
            produto
        )
    ) {

        alert(
            "A tarjeta está disponível somente para Brownie e Palha Italiana."
        );

        return;

    }


    if (
        !quantidade ||
        quantidade < 1
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    /*
     * Se a validade estiver vazia,
     * calculamos automaticamente.
     */

    if (!validade) {

        const dias =
            obterDiasValidadeProduto(
                produto
            );


        if (dias !== null) {

            validade =
                calcularDataValidade(
                    fabricacao,
                    dias
                );

        }

    }


    if (!area) {

        alert(
            "Área de tarjetas não encontrada."
        );

        return;

    }


    /*
     * Não apagamos as tarjetas anteriores.
     *
     * Isso permite:
     *
     * 5 Brownie Chocolate
     * + 5 Brownie Ninho
     * + 3 Palha Italiana
     *
     * na mesma folha.
     */

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        area.insertAdjacentHTML(
            "beforeend",
            criarTarjetaHTML(
                produto,
                fabricacao,
                validade
            )
        );

    }


    gerarCodigosTarjetas();


    atualizarResumoTarjetas();

}


/* =========================================================
   GERAR CÓDIGOS DE BARRAS DAS TARJETAS
========================================================= */

function gerarCodigosTarjetas() {

    if (
        typeof JsBarcode ===
        "undefined"
    ) {

        return;

    }


    const codigos =
        document.querySelectorAll(
            ".barcode-tarjeta"
        );


    codigos.forEach(
        function (svg) {

            const ean =
                svg.dataset.ean;


            if (!ean) {

                return;

            }


            svg.innerHTML = "";


            try {

                JsBarcode(
                    svg,
                    ean,
                    {

                        format:
                            "EAN13",

                        displayValue:
                            true,

                        width:
                            1.35,

                        height:
                            32,

                        margin:
                            2,

                        fontSize:
                            9,

                        textMargin:
                            1

                    }
                );


            } catch (erro) {

                console.error(
                    "Erro no EAN da tarjeta:",
                    erro
                );

            }

        }
    );

}


/* =========================================================
   RESUMO DAS TARJETAS
========================================================= */

function atualizarResumoTarjetas() {

    const area =
        document.getElementById(
            "areaTarjetas"
        );


    const resumo =
        document.getElementById(
            "folhaTarjetas"
        );


    if (!area || !resumo) {

        return;

    }


    const tarjetas =
        area.querySelectorAll(
            ".tarjeta-impressao"
        );


    resumo.textContent =
        tarjetas.length +
        (
            tarjetas.length === 1
                ? " tarjeta pronta"
                : " tarjetas prontas"
        );

}


/* =========================================================
   LIMPAR TARJETAS
========================================================= */

function limparTarjetas() {

    const area =
        document.getElementById(
            "areaTarjetas"
        );


    if (!area) {

        return;

    }


    area.innerHTML = "";


    atualizarResumoTarjetas();

}


/* =========================================================
   IMPRIMIR TARJETAS
========================================================= */

function imprimirTarjetas() {

    const area =
        document.getElementById(
            "areaTarjetas"
        );


    if (!area) {

        alert(
            "Área de tarjetas não encontrada."
        );

        return;

    }


    const tarjetas =
        area.querySelectorAll(
            ".tarjeta-impressao"
        );


    if (!tarjetas.length) {

        alert(
            "Gere pelo menos uma tarjeta antes de imprimir."
        );

        return;

    }


    gerarCodigosTarjetas();


    const conteudo =
        area.innerHTML;


    const janela =
        window.open(
            "",
            "_blank"
        );


    if (!janela) {

        alert(
            "O navegador bloqueou a janela de impressão. Permita pop-ups para este sistema."
        );

        return;

    }


    janela.document.open();


    janela.document.write(`

        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <meta charset="UTF-8">

            <title>
                Tarjetas - Carol's Gourmet
            </title>


            <style>

                @page {

                    size: A4 portrait;

                    margin: 0.5cm;

                }


                * {

                    box-sizing:
                        border-box;

                }


                html,
                body {

                    margin: 0;

                    padding: 0;

                    background:
                        white;

                }


                body {

                    font-family:
                        Arial,
                        sans-serif;

                }


                .folha-impressao {

                    width:
                        100%;

                    display:
                        flex;

                    flex-wrap:
                        wrap;

                    align-content:
                        flex-start;

                    gap:
                        0;

                }


                .tarjeta-impressao {

                    width:
                        5cm;

                    height:
                        21cm;

                    position:
                        relative;

                    overflow:
                        hidden;

                    background:
                        #fff;

                    page-break-inside:
                        avoid;

                    break-inside:
                        avoid;

                    margin-right:
                        0.15cm;

                    margin-bottom:
                        0.15cm;

                    border:
                        1px solid
                        #ddd;

                }


                .tarjeta-topo,
                .tarjeta-base {

                    position:
                        absolute;

                    left: 0;

                    width: 100%;

                    overflow:
                        hidden;

                }


                .tarjeta-topo {

                    top: 0;

                    height:
                        3.1cm;

                }


                .tarjeta-base {

                    bottom: 0;

                    height:
                        3.1cm;

                }


                .tarjeta-xadrez {

                    position:
                        absolute;

                    left: 0;

                    width: 100%;

                    height: 100%;

                    background-color:
                        #c51414;

                    background-image:
                        linear-gradient(
                            45deg,
                            #ffc928 25%,
                            transparent 25%,
                            transparent 75%,
                            #ffc928 75%
                        ),
                        linear-gradient(
                            45deg,
                            #ffc928 25%,
                            transparent 25%,
                            transparent 75%,
                            #ffc928 75%
                        );

                    background-position:
                        0 0,
                        12px 12px;

                    background-size:
                        24px 24px;

                }


                .tarjeta-conteudo {

                    position:
                        absolute;

                    top:
                        2.65cm;

                    bottom:
                        2.65cm;

                    left: 0;

                    right: 0;

                    background:
                        white;

                    display:
                        flex;

                    flex-direction:
                        column;

                    align-items:
                        center;

                }


                .tarjeta-codigo {

                    width:
                        90%;

                    margin-top:
                        0.25cm;

                    text-align:
                        center;

                }


                .barcode-tarjeta {

                    width:
                        100%;

                    max-width:
                        4.5cm;

                    height:
                        auto;

                }


                .tarjeta-datas {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    width:
                        90%;

                    font-size:
                        7px;

                    color:
                        #555;

                }


                .tarjeta-logo {

                    flex:
                        1;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    width:
                        100%;

                }


                .tarjeta-logo img {

                    width:
                        4.35cm;

                    height:
                        auto;

                    object-fit:
                        contain;

                }


                .tarjeta-frase {

                    width:
                        100%;

                    text-align:
                        center;

                    margin-bottom:
                        0.7cm;

                }


                .tarjeta-linha {

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    gap:
                        0.12cm;

                    margin-bottom:
                        0.08cm;

                }


                .tarjeta-linha span {

                    width:
                        0.9cm;

                    height:
                        1px;

                    background:
                        #b40000;

                }


                .tarjeta-linha strong {

                    color:
                        #b40000;

                    font-size:
                        15px;

                }


                .tarjeta-frase-destaque {

                    color:
                        #b40000;

                    font-family:
                        Georgia,
                        serif;

                    font-style:
                        italic;

                    font-weight:
                        bold;

                    font-size:
                        12px;

                }


                .tarjeta-frase-normal {

                    color:
                        #222;

                    font-size:
                        10px;

                    margin-top:
                        2px;

                }


                .tarjeta-coracao {

                    color:
                        #b40000;

                    font-size:
                        13px;

                    margin-top:
                        5px;

                }


                .tarjeta-onda-topo,
                .tarjeta-onda-base {

                    position:
                        absolute;

                    left: -5%;

                    width: 110%;

                    height:
                        0.55cm;

                    background:
                        white;

                    border-radius:
                        50%;

                }


                .tarjeta-onda-topo {

                    bottom:
                        -0.22cm;

                }


                .tarjeta-onda-base {

                    top:
                        -0.22cm;

                }

            </style>

        </head>


        <body>

            <div class="folha-impressao">

                ${conteudo}

            </div>


            <script>

                window.onload =
                    function () {

                        setTimeout(
                            function () {

                                window.print();

                            },
                            500
                        );

                    };

            <\/script>

        </body>

        </html>

    `);


    janela.document.close();

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

    atualizarProdutosTarjeta();

}


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatarData(data) {

    if (!data) {

        return "--/--/----";

    }


    const partes =
        String(data).split("-");


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


function formatarMoeda(valor) {

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
   COMPATIBILIDADE GLOBAL
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


/* =========================================================
   TARJETAS - FUNÇÕES GLOBAIS
========================================================= */

window.gerarTarjetas =
    gerarTarjetas;

window.imprimirTarjetas =
    imprimirTarjetas;

window.limparTarjetas =
    limparTarjetas;

window.atualizarProdutosTarjeta =
    atualizarProdutosTarjeta;

window.calcularValidadeTarjeta =
    calcularValidadeTarjeta;
