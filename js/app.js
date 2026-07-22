/*=========================================================
CAROL'S GOURMET ERP 4.0
APP.JS
SISTEMA COMPLETO
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
CONTROLE DE EDIÇÃO
=========================================================*/

let produtoEditando = -1;
let materiaPrimaEditando = -1;

/*=========================================================
INICIALIZAÇÃO
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

```
console.log("Carol's Gourmet ERP 4.0 iniciado.");

carregarBanco();

configurarDatas();

atualizarDashboard();

novoCadastro();

novaMateriaPrima();

atualizarTabelaProdutos();

atualizarTabelaMateriaPrima();

atualizarHistoricoMovimentacoes();

atualizarListaProducoes();

atualizarSelectProdutos();

atualizarEstoqueVisual();

mostrarAba("dashboard");
```

});

/*=========================================================
BANCO LOCAL
=========================================================*/

function carregarBanco() {

```
try {

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

} catch (erro) {

    console.error("Erro ao carregar banco:", erro);

    produtos = [];
    materiasPrimas = [];
    movimentacoes = [];
    producoes = [];
    precificacoes = [];

}
```

}

/*=========================================================
SALVAR BANCO
=========================================================*/

function salvarBanco() {

```
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
```

}

/*=========================================================
MENU LATERAL
=========================================================*/

function toggleMenu() {

```
const menu =
    document.getElementById("menuLateral");

if (!menu) {
    return;
}

menu.classList.toggle("fechado");
```

}

/*=========================================================
CONTROLE DAS ABAS
=========================================================*/

function mostrarAba(id, botao = null) {

```
const abas =
    document.querySelectorAll(".aba");

abas.forEach(function (aba) {

    aba.classList.remove("ativa");

});


const abaSelecionada =
    document.getElementById(id);

if (abaSelecionada) {

    abaSelecionada.classList.add("ativa");

}


const botoes =
    document.querySelectorAll(".menu-item");

botoes.forEach(function (item) {

    item.classList.remove("ativo");

});


if (botao) {

    botao.classList.add("ativo");

} else {

    botoes.forEach(function (item) {

        const evento =
            item.getAttribute("onclick") || "";

        if (
            evento.includes(
                "mostrarAba('" + id + "'"
            )
        ) {

            item.classList.add("ativo");

        }

    });

}


window.scrollTo({
    top: 0,
    behavior: "smooth"
});
```

}

/*=========================================================
DASHBOARD
=========================================================*/

function atualizarDashboard() {

```
const totalProdutos =
    document.getElementById("totalProdutos");

if (totalProdutos) {

    totalProdutos.textContent =
        produtos.length;

}


const ultimaAtualizacao =
    document.getElementById("ultimaAtualizacao");

if (ultimaAtualizacao) {

    if (movimentacoes.length > 0) {

        const ultima =
            movimentacoes[
                movimentacoes.length - 1
            ];

        ultimaAtualizacao.textContent =
            ultima.dataHora ||
            new Date().toLocaleString("pt-BR");

    } else {

        ultimaAtualizacao.textContent =
            "Nenhuma movimentação registrada.";

    }

}
```

}

/*=========================================================
DATAS
=========================================================*/

function configurarDatas() {

```
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


campos.forEach(function (id) {

    const campo =
        document.getElementById(id);

    if (campo && !campo.value) {

        campo.value = hoje;

    }

});
```

}

/*=========================================================
CÓDIGO INTERNO
=========================================================*/

function gerarCodigoInterno(prefixo) {

```
const numero =
    Date.now()
    .toString()
    .slice(-6);

return prefixo + numero;
```

}

/*=========================================================
EAN-13
=========================================================*/

function gerarEAN13() {

```
let codigo = "789";

while (codigo.length < 12) {

    codigo +=
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
        parseInt(codigo[i], 10);

    if (i % 2 === 0) {

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


return codigo + digito;
```

}

/*=========================================================
PRODUTOS
=========================================================*/

function novoCadastro() {

```
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

const foto =
    document.getElementById("fotoProduto");


if (codigo) {

    codigo.value =
        gerarCodigoInterno("PRD");

}


if (barras) {

    barras.value =
        gerarEAN13();

}


if (nome) {

    nome.value = "";

}


if (categoria) {

    categoria.value = "Doce";

}


if (unidade) {

    unidade.value = "Unidade";

}


if (status) {

    status.value = "Ativo";

}


if (foto) {

    foto.value = "";

}
```

}

/*=========================================================
SALVAR PRODUTO
=========================================================*/

function salvarProduto() {

```
const nome =
    document.getElementById("nomeProduto");


if (
    !nome ||
    nome.value.trim() === ""
) {

    alert(
        "Informe o nome do produto."
    );

    return;

}


const produto = {

    codigo:
        document.getElementById(
            "codigoInterno"
        ).value,

    codigoBarras:
        document.getElementById(
            "codigoBarras"
        ).value,

    nome:
        nome.value.trim(),

    categoria:
        document.getElementById(
            "categoriaProduto"
        ).value,

    unidade:
        document.getElementById(
            "unidadeProduto"
        ).value,

    status:
        document.getElementById(
            "statusProduto"
        ).value

};


if (
    produtoEditando === -1
) {

    produtos.push(produto);

} else {

    produtos[
        produtoEditando
    ] = produto;

}


salvarBanco();

atualizarTabelaProdutos();

atualizarSelectProdutos();

atualizarDashboard();

novoCadastro();


alert(
    "Produto salvo com sucesso!"
);
```

}

/*=========================================================
TABELA DE PRODUTOS
=========================================================*/

function atualizarTabelaProdutos() {

```
const tabela =
    document.getElementById(
        "listaProdutos"
    );


if (!tabela) {

    return;

}


tabela.innerHTML = "";


produtos.forEach(
    function (produto, indice) {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>${produto.codigo || ""}</td>

            <td>${produto.nome || ""}</td>

            <td>${produto.codigoBarras || ""}</td>

            <td>${produto.categoria || ""}</td>

            <td>${produto.unidade || ""}</td>

            <td>${produto.status || ""}</td>

            <td>

                <button
                    type="button"
                    onclick="editarProduto(${indice})">

                    ✏️

                </button>

                <button
                    type="button"
                    onclick="excluirProduto(${indice})">

                    🗑️

                </button>

            </td>

        `;


        tabela.appendChild(linha);

    }
);
```

}

/*=========================================================
EDITAR PRODUTO
=========================================================*/

function editarProduto(indice) {

```
const produto =
    produtos[indice];


if (!produto) {

    return;

}


produtoEditando =
    indice;


document.getElementById(
    "codigoInterno"
).value =
    produto.codigo || "";


document.getElementById(
    "codigoBarras"
).value =
    produto.codigoBarras || "";


document.getElementById(
    "nomeProduto"
).value =
    produto.nome || "";


document.getElementById(
    "categoriaProduto"
).value =
    produto.categoria || "Doce";


document.getElementById(
    "unidadeProduto"
).value =
    produto.unidade || "Unidade";


document.getElementById(
    "statusProduto"
).value =
    produto.status || "Ativo";


mostrarAba("produtos");
```

}

/*=========================================================
EXCLUIR PRODUTO
=========================================================*/

function excluirProduto(indice) {

```
if (
    !confirm(
        "Deseja excluir este produto?"
    )
) {

    return;

}


produtos.splice(
    indice,
    1
);


salvarBanco();

atualizarTabelaProdutos();

atualizarSelectProdutos();

atualizarDashboard();

novoCadastro();
```

}

/*=========================================================
PESQUISAR PRODUTO
=========================================================*/

function pesquisarProduto() {

```
const campo =
    document.getElementById(
        "pesquisaProduto"
    );


if (!campo) {

    return;

}


const texto =
    campo.value.toLowerCase();


const linhas =
    document.querySelectorAll(
        "#listaProdutos tr"
    );


linhas.forEach(function (linha) {

    const conteudo =
        linha.innerText.toLowerCase();


    linha.style.display =
        conteudo.includes(texto)
            ? ""
            : "none";

});
```

}

/*=========================================================
SELECTS DE PRODUTOS
=========================================================*/

function atualizarSelectProdutos() {

```
const selects = [

    "produtoMovimentacao",

    "produtoProducao",

    "produtoEtiqueta",

    "produtoPreco"

];


selects.forEach(function (id) {

    const select =
        document.getElementById(id);


    if (!select) {

        return;

    }


    select.innerHTML = "";


    produtos.forEach(function (produto) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            produto.codigo;


        option.textContent =
            produto.nome;


        select.appendChild(option);

    });

});
```

}

/*=========================================================
MATÉRIA-PRIMA
=========================================================*/

function novaMateriaPrima() {

```
materiaPrimaEditando = -1;


const codigo =
    document.getElementById(
        "codigoMP"
    );

const barras =
    document.getElementById(
        "codigoBarrasMP"
    );

const nome =
    document.getElementById(
        "nomeMP"
    );

const categoria =
    document.getElementById(
        "categoriaMP"
    );

const unidade =
    document.getElementById(
        "unidadeMP"
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
        gerarCodigoInterno("MP");

}


if (barras) {

    barras.value = "";

}


if (nome) {

    nome.value = "";

}


if (categoria) {

    categoria.selectedIndex = 0;

}


if (unidade) {

    unidade.selectedIndex = 0;

}


if (estoque) {

    estoque.value = "0";

}


if (custo) {

    custo.value = "";

}
```

}

/*=========================================================
SALVAR MATÉRIA-PRIMA
=========================================================*/

function salvarMateriaPrima() {

```
const nome =
    document.getElementById(
        "nomeMP"
    );


if (
    !nome ||
    nome.value.trim() === ""
) {

    alert(
        "Informe o nome da matéria-prima."
    );

    return;

}


const materiaPrima = {

    codigo:
        document.getElementById(
            "codigoMP"
        ).value,

    codigoBarras:
        document.getElementById(
            "codigoBarrasMP"
        ).value.trim(),

    nome:
        nome.value.trim(),

    categoria:
        document.getElementById(
            "categoriaMP"
        ).value,

    unidade:
        document.getElementById(
            "unidadeMP"
        ).value,

    estoque:
        parseFloat(
            document.getElementById(
                "estoqueMP"
            ).value
        ) || 0,

    custo:
        parseFloat(
            document.getElementById(
                "custoMP"
            ).value
        ) || 0

};


if (
    materiaPrimaEditando === -1
) {

    materiasPrimas.push(
        materiaPrima
    );

} else {

    materiasPrimas[
        materiaPrimaEditando
    ] =
        materiaPrima;

}


salvarBanco();

atualizarTabelaMateriaPrima();

novaMateriaPrima();


alert(
    "Matéria-prima salva com sucesso!"
);
```

}

/*=========================================================
TABELA MATÉRIA-PRIMA
=========================================================*/

function atualizarTabelaMateriaPrima() {

```
const tabela =
    document.getElementById(
        "listaMateriaPrima"
    );


if (!tabela) {

    return;

}


tabela.innerHTML = "";


materiasPrimas.forEach(
    function (materia, indice) {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>${materia.codigo || ""}</td>

            <td>${materia.nome || ""}</td>

            <td>${materia.categoria || ""}</td>

            <td>${materia.unidade || ""}</td>

            <td>${materia.estoque || 0}</td>

            <td>
                R$ ${Number(
                    materia.custo || 0
                ).toFixed(2)}
            </td>

            <td>

                <button
                    type="button"
                    onclick="editarMateriaPrima(${indice})">

                    ✏️

                </button>

                <button
                    type="button"
                    onclick="excluirMateriaPrima(${indice})">

                    🗑️

                </button>

            </td>

        `;


        tabela.appendChild(linha);

    }
);
```

}

/*=========================================================
EDITAR MATÉRIA-PRIMA
=========================================================*/

function editarMateriaPrima(indice) {

```
const materia =
    materiasPrimas[indice];


if (!materia) {

    return;

}


materiaPrimaEditando =
    indice;


document.getElementById(
    "codigoMP"
).value =
    materia.codigo || "";


document.getElementById(
    "codigoBarrasMP"
).value =
    materia.codigoBarras || "";


document.getElementById(
    "nomeMP"
).value =
    materia.nome || "";


document.getElementById(
    "categoriaMP"
).value =
    materia.categoria || "Ingrediente";


document.getElementById(
    "unidadeMP"
).value =
    materia.unidade || "Unidade";


document.getElementById(
    "estoqueMP"
).value =
    materia.estoque || 0;


document.getElementById(
    "custoMP"
).value =
    materia.custo || 0;


mostrarAba("materiaPrima");
```

}

/*=========================================================
EXCLUIR MATÉRIA-PRIMA
=========================================================*/

function excluirMateriaPrima(indice) {

```
if (
    !confirm(
        "Deseja excluir esta matéria-prima?"
    )
) {

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

function pesquisarMateriaPrima() {

```
const campo =
    document.getElementById(
        "pesquisaMP"
    );


if (!campo) {

    return;

}


const texto =
    campo.value.toLowerCase();


const linhas =
    document.querySelectorAll(
        "#listaMateriaPrima tr"
    );


linhas.forEach(function (linha) {

    const conteudo =
        linha.innerText.toLowerCase();


    linha.style.display =
        conteudo.includes(texto)
            ? ""
            : "none";

});
```

}

/*=========================================================
PRECIFICAÇÃO
=========================================================*/

function calcularPreco() {

```
const custoMateria =
    parseFloat(
        document.getElementById(
            "custoMateria"
        ).value
    ) || 0;


const custoEmbalagem =
    parseFloat(
        document.getElementById(
            "custoEmbalagem"
        ).value
    ) || 0;


const outrosCustos =
    parseFloat(
        document.getElementById(
            "outrosCustos"
        ).value
    ) || 0;


const margem =
    parseFloat(
        document.getElementById(
            "margemDesejada"
        ).value
    ) || 0;


const taxaIfood =
    parseFloat(
        document.getElementById(
            "taxaIfood"
        ).value
    ) || 0;


const custoTotal =
    custoMateria +
    custoEmbalagem +
    outrosCustos;


const precoSugerido =
    custoTotal *
    (
        1 +
        margem / 100
    );


let precoIfood =
    precoSugerido;


if (taxaIfood < 100) {

    precoIfood =
        precoSugerido /
        (
            1 -
            taxaIfood / 100
        );

}


document.getElementById(
    "resultadoCusto"
).textContent =
    formatarMoeda(custoTotal);


document.getElementById(
    "resultadoPreco"
).textContent =
    formatarMoeda(precoSugerido);


document.getElementById(
    "resultadoIfood"
).textContent =
    formatarMoeda(precoIfood);


const produtoSelecionado =
    document.getElementById(
        "produtoPreco"
    );


if (
    produtoSelecionado &&
    produtoSelecionado.value
) {

    precificacoes.push({

        produto:
            produtoSelecionado.value,

        custo:
            custoTotal,

        margem:
            margem,

        taxaIfood:
            taxaIfood,

        preco:
            precoSugerido,

        precoIfood:
            precoIfood,

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    });


    salvarBanco();

}
```

}

/*=========================================================
ESTOQUE
=========================================================*/

function registrarMovimentacao() {

```
const tipo =
    document.getElementById(
        "tipoMovimentacao"
    ).value;


const operacao =
    document.getElementById(
        "operacaoEstoque"
    ).value;


const codigo =
    document.getElementById(
        "produtoMovimentacao"
    ).value;


const quantidade =
    parseFloat(
        document.getElementById(
            "quantidadeMovimentacao"
        ).value
    ) || 0;


const data =
    document.getElementById(
        "dataMovimentacao"
    ).value;


const observacao =
    document.getElementById(
        "observacaoMovimentacao"
    ).value;


if (!codigo) {

    alert(
        "Selecione um produto."
    );

    return;

}


if (quantidade <= 0) {

    alert(
        "Informe uma quantidade válida."
    );

    return;

}


if (
    tipo === "produto"
) {

    const produto =
        produtos.find(
            function (item) {

                return item.codigo === codigo;

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
        );


    if (
        operacao === "entrada"
    ) {

        produto.estoque +=
            quantidade;

    } else {

        if (
            produto.estoque <
            quantidade
        ) {

            alert(
                "Estoque insuficiente."
            );

            return;

        }

        produto.estoque -=
            quantidade;

    }

} else {

    const materia =
        materiasPrimas.find(
            function (item) {

                return item.codigo === codigo;

            }
        );


    if (!materia) {

        alert(
            "Matéria-prima não encontrada."
        );

        return;

    }


    if (
        operacao === "entrada"
    ) {

        materia.estoque +=
            quantidade;

    } else {

        if (
            materia.estoque <
            quantidade
        ) {

            alert(
                "Estoque insuficiente."
            );

            return;

        }

        materia.estoque -=
            quantidade;

    }

}


movimentacoes.push({

    data:
        data,

    tipo:
        tipo,

    codigo:
        codigo,

    quantidade:
        quantidade,

    operacao:
        operacao,

    observacao:
        observacao,

    dataHora:
        new Date().toLocaleString(
            "pt-BR"
        )

});


salvarBanco();

atualizarTabelaProdutos();

atualizarTabelaMateriaPrima();

atualizarHistoricoMovimentacoes();

atualizarDashboard();

atualizarEstoqueVisual();


alert(
    "Movimentação registrada com sucesso!"
);
```

}

/*=========================================================
HISTÓRICO DE MOVIMENTAÇÕES
=========================================================*/

function atualizarHistoricoMovimentacoes() {

```
const tabela =
    document.getElementById(
        "historicoMovimentacoes"
    );


if (!tabela) {

    return;

}


tabela.innerHTML = "";


movimentacoes.forEach(
    function (mov) {

        let nome =
            mov.codigo || "";


        const produto =
            produtos.find(
                function (item) {

                    return item.codigo === mov.codigo;

                }
            );


        const materia =
            materiasPrimas.find(
                function (item) {

                    return item.codigo === mov.codigo;

                }
            );


        if (produto) {

            nome =
                produto.nome;

        }


        if (materia) {

            nome =
                materia.nome;

        }


        tabela.innerHTML += `

            <tr>

                <td>${mov.data || ""}</td>

                <td>${nome}</td>

                <td>${mov.tipo || ""}</td>

                <td>${mov.quantidade || 0}</td>

                <td>${mov.operacao || ""}</td>

                <td>${mov.observacao || ""}</td>

            </tr>

        `;

    }
);
```

}

/*=========================================================
ATUALIZAÇÃO VISUAL DO ESTOQUE
=========================================================*/

function atualizarEstoqueVisual() {

```
atualizarSelectMovimentacao();
```

}

/*=========================================================
SELECT DE MOVIMENTAÇÃO
=========================================================*/

function atualizarSelectMovimentacao() {

```
const tipo =
    document.getElementById(
        "tipoMovimentacao"
    );


const select =
    document.getElementById(
        "produtoMovimentacao"
    );


if (!tipo || !select) {

    return;

}


select.innerHTML = "";


if (
    tipo.value === "produto"
) {

    produtos.forEach(function (produto) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            produto.codigo;

        option.textContent =
            produto.nome;

        select.appendChild(option);

    });

} else {

    materiasPrimas.forEach(function (materia) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            materia.codigo;

        option.textContent =
            materia.nome;

        select.appendChild(option);

    });

}
```

}

/*=========================================================
PRODUÇÃO
=========================================================*/

function registrarProducao() {

```
const codigo =
    document.getElementById(
        "produtoProducao"
    ).value;


const quantidade =
    parseFloat(
        document.getElementById(
            "quantidadeProduzida"
        ).value
    ) || 0;


const fabricacao =
    document.getElementById(
        "dataFabricacao"
    ).value;


const validade =
    document.getElementById(
        "dataValidade"
    ).value;


const observacao =
    document.getElementById(
        "observacaoProducao"
    ).value;


if (!codigo) {

    alert(
        "Selecione um produto."
    );

    return;

}


if (quantidade <= 0) {

    alert(
        "Informe uma quantidade válida."
    );

    return;

}


const produto =
    produtos.find(
        function (item) {

            return item.codigo === codigo;

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
    );


produto.estoque +=
    quantidade;


producoes.push({

    codigo:
        codigo,

    quantidade:
        quantidade,

    fabricacao:
        fabricacao,

    validade:
        validade,

    observacao:
        observacao,

    dataHora:
        new Date().toLocaleString(
            "pt-BR"
        )

});


salvarBanco();

atualizarTabelaProdutos();

atualizarListaProducoes();

atualizarDashboard();


alert(
    "Produção registrada com sucesso!"
);
```

}

/*=========================================================
LISTA DE PRODUÇÕES
=========================================================*/

function atualizarListaProducoes() {

```
const tabela =
    document.getElementById(
        "listaProducoes"
    );


if (!tabela) {

    return;

}


tabela.innerHTML = "";


producoes.forEach(
    function (producao) {

        const produto =
            produtos.find(
                function (item) {

                    return item.codigo ===
                        producao.codigo;

                }
            );


        tabela.innerHTML += `

            <tr>

                <td>
                    ${producao.dataHora || ""}
                </td>

                <td>
                    ${produto
                        ? produto.nome
                        : producao.codigo}
                </td>

                <td>
                    ${producao.quantidade || 0}
                </td>

                <td>
                    ${producao.fabricacao || ""}
                </td>

                <td>
                    ${producao.validade || ""}
                </td>

                <td>
                    ${producao.observacao || ""}
                </td>

            </tr>

        `;

    }
);
```

}

/*=========================================================
ETIQUETAS
=========================================================*/

function gerarEtiqueta() {

```
const codigo =
    document.getElementById(
        "produtoEtiqueta"
    ).value;


const produto =
    produtos.find(
        function (item) {

            return item.codigo === codigo;

        }
    );


if (!produto) {

    alert(
        "Selecione um produto."
    );

    return;

}


const fabricacao =
    document.getElementById(
        "fabricacaoEtiqueta"
    ).value;


const validade =
    document.getElementById(
        "validadeEtiqueta"
    ).value;


const nome =
    document.getElementById(
        "prevNomeProduto"
    );


const codigoPrev =
    document.getElementById(
        "prevCodigo"
    );


const prevFabricacao =
    document.getElementById(
        "prevFabricacao"
    );


const prevValidade =
    document.getElementById(
        "prevValidade"
    );


if (nome) {

    nome.textContent =
        produto.nome;

}


if (codigoPrev) {

    codigoPrev.textContent =
        produto.codigoBarras ||
        produto.codigo;

}


if (prevFabricacao) {

    prevFabricacao.textContent =
        formatarData(fabricacao);

}


if (prevValidade) {

    prevValidade.textContent =
        formatarData(validade);

}


if (
    typeof JsBarcode !==
    "undefined"
) {

    const barcode =
        document.getElementById(
            "barcode"
        );


    if (barcode) {

        barcode.innerHTML = "";

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );


        barcode.appendChild(svg);


        JsBarcode(
            svg,
            produto.codigoBarras ||
            produto.codigo,
            {
                format: "EAN13",
                displayValue: true,
                width: 2,
                height: 50
            }
        );

    }

}
```

}

/*=========================================================
IMPRESSÃO
=========================================================*/

function imprimirEtiquetas() {

```
gerarEtiqueta();


const preview =
    document.getElementById(
        "previewEtiqueta"
    );


if (!preview) {

    return;

}


const janela =
    window.open(
        "",
        "_blank"
    );


if (!janela) {

    alert(
        "O navegador bloqueou a janela de impressão."
    );

    return;

}


janela.document.write(`

    <!DOCTYPE html>

    <html lang="pt-BR">

    <head>

        <meta charset="UTF-8">

        <title>Etiqueta</title>

        <style>

            body {

                font-family: Arial, sans-serif;

                text-align: center;

                margin: 20px;

            }

            .etiqueta-preview {

                width: 300px;

                margin: auto;

                border: 1px solid #000;

                padding: 15px;

            }

        </style>

    </head>

    <body>

        ${preview.innerHTML}

        <script>

            window.onload = function(){

                window.print();

            };

        <\/script>

    </body>

    </html>

`);


janela.document.close();
```

}

/*=========================================================
CONFIGURAÇÕES
=========================================================*/

function editarEmpresa() {

```
alert(
    "Configuração de dados da empresa disponível para personalização."
);
```

}

function configurarImpressora() {

```
alert(
    "Configuração de impressão disponível."
);
```

}

function exportarBackup() {

```
const dados = {

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
                dados,
                null,
                4
            )
        ],
        {
            type: "application/json"
        }
    );


const url =
    URL.createObjectURL(
        arquivo
    );


const link =
    document.createElement("a");


link.href =
    url;


link.download =
    "backup-carols-gourmet.json";


link.click();


URL.revokeObjectURL(
    url
);
```

}

function importarBackup() {

```
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
            function () {

                try {

                    const dados =
                        JSON.parse(
                            leitor.result
                        );


                    produtos =
                        dados.produtos ||
                        [];

                    materiasPrimas =
                        dados.materiasPrimas ||
                        [];

                    movimentacoes =
                        dados.movimentacoes ||
                        [];

                    producoes =
                        dados.producoes ||
                        [];

                    precificacoes =
                        dados.precificacoes ||
                        [];


                    salvarBanco();


                    atualizarTabelaProdutos();

                    atualizarTabelaMateriaPrima();

                    atualizarHistoricoMovimentacoes();

                    atualizarListaProducoes();

                    atualizarSelectProdutos();

                    atualizarDashboard();


                    alert(
                        "Backup restaurado com sucesso!"
                    );

                } catch (erro) {

                    alert(
                        "Erro ao restaurar o backup."
                    );

                    console.error(
                        erro
                    );

                }

            };


        leitor.readAsText(
            arquivo
        );

    };


input.click();
```

}

function testarCamera() {

```
if (
    typeof abrirCamera ===
    "function"
) {

    abrirCamera();

    return;

}


if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
) {

    navigator.mediaDevices
        .getUserMedia({
            video: true
        })
        .then(function (stream) {

            alert(
                "Webcam funcionando corretamente."
            );


            stream
                .getTracks()
                .forEach(function (track) {

                    track.stop();

                });

        })
        .catch(function () {

            alert(
                "Não foi possível acessar a webcam."
            );

        });

} else {

    alert(
        "Este navegador não oferece suporte à webcam."
    );

}
```

}

/*=========================================================
FORMATAÇÃO
=========================================================*/

function formatarMoeda(valor) {

```
return Number(
    valor || 0
).toLocaleString(
    "pt-BR",
    {
        style: "currency",
        currency: "BRL"
    }
);
```

}

function formatarData(data) {

```
if (!data) {

    return "--/--/----";

}


const partes =
    data.split("-");


if (
    partes.length !== 3
) {

    return data;

}


return (

    partes[2] +
    "/" +
    partes[1] +
    "/" +
    partes[0]

);
```

}

/*=========================================================
TROCA DE TIPO DE ESTOQUE
=========================================================*/

document.addEventListener(
"change",
function (evento) {

```
    if (
        evento.target &&
        evento.target.id ===
            "tipoMovimentacao"
    ) {

        atualizarSelectMovimentacao();

    }

}
```

);

/*=========================================================
FUNÇÕES GLOBAIS
COMPATIBILIDADE COM onclick="" DO INDEX
=========================================================*/

window.toggleMenu =
toggleMenu;

window.mostrarAba =
mostrarAba;

window.salvarProduto =
salvarProduto;

window.novoCadastro =
novoCadastro;

window.editarProduto =
editarProduto;

window.excluirProduto =
excluirProduto;

window.pesquisarProduto =
pesquisarProduto;

window.salvarMateriaPrima =
salvarMateriaPrima;

window.novaMateriaPrima =
novaMateriaPrima;

window.editarMateriaPrima =
editarMateriaPrima;

window.excluirMateriaPrima =
excluirMateriaPrima;

window.pesquisarMateriaPrima =
pesquisarMateriaPrima;

window.calcularPreco =
calcularPreco;

window.registrarMovimentacao =
registrarMovimentacao;

window.registrarProducao =
registrarProducao;

window.gerarEtiqueta =
gerarEtiqueta;

window.imprimirEtiquetas =
imprimirEtiquetas;

window.editarEmpresa =
editarEmpresa;

window.configurarImpressora =
configurarImpressora;

window.exportarBackup =
exportarBackup;

window.importarBackup =
importarBackup;

window.testarCamera =
testarCamera;

/*=========================================================
FIM DO APP.JS
=========================================================*/
