// ======================================================
// CAROL'S GOURMET ERP 4.0
// APP.JS - VERSÃO CONSOLIDADA
// ======================================================


// ======================================================
// BANCO DE DADOS
// ======================================================

let produtos =
    JSON.parse(
        localStorage.getItem("carols_produtos")
    ) || [];

let materias =
    JSON.parse(
        localStorage.getItem("carols_materias")
    ) || [];

let movimentacoes =
    JSON.parse(
        localStorage.getItem("carols_movimentacoes")
    ) || [];

let producoes =
    JSON.parse(
        localStorage.getItem("carols_producoes")
    ) || [];

let receitas =
    JSON.parse(
        localStorage.getItem("carols_receitas")
    ) || [];


// Garantir arrays válidos

if (!Array.isArray(produtos)) produtos = [];
if (!Array.isArray(materias)) materias = [];
if (!Array.isArray(movimentacoes)) movimentacoes = [];
if (!Array.isArray(producoes)) producoes = [];
if (!Array.isArray(receitas)) receitas = [];


// ======================================================
// VARIÁVEIS TEMPORÁRIAS
// ======================================================

let ingredientesReceita = [];


// ======================================================
// SALVAR BANCO
// ======================================================

function salvarBanco() {

    localStorage.setItem(
        "carols_produtos",
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        "carols_materias",
        JSON.stringify(materias)
    );

    localStorage.setItem(
        "carols_movimentacoes",
        JSON.stringify(movimentacoes)
    );

    localStorage.setItem(
        "carols_producoes",
        JSON.stringify(producoes)
    );

    localStorage.setItem(
        "carols_receitas",
        JSON.stringify(receitas)
    );
}


// ======================================================
// MENU LATERAL
// ======================================================

function toggleMenu() {

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {

        sidebar.classList.toggle("aberto");

    }
}


// ======================================================
// TROCAR ABA
// ======================================================

function mostrarAba(id, botao) {

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

    }


    if (id === "produtos") {

        carregarProdutos();

    }


    if (id === "materia-prima") {

        carregarMaterias();
        atualizarItensMovimentacao();

    }


    if (id === "receitas") {

        carregarProdutosReceita();
        carregarMateriasReceita();
        carregarListaReceitas();
        carregarIngredientesReceita();
        calcularCustoReceita();

    }


    if (id === "estoque") {

        carregarMaterias();
        atualizarItensMovimentacao();

    }


    if (id === "dashboard") {

        atualizarDashboard();

    }

}


// ======================================================
// DASHBOARD
// ======================================================

function atualizarDashboard() {

    const totalProdutos =
        document.getElementById("totalProdutos");

    if (totalProdutos) {

        totalProdutos.innerText =
            produtos.length;

    }


    const totalMateriaPrima =
        document.getElementById("totalMateriaPrima");

    if (totalMateriaPrima) {

        totalMateriaPrima.innerText =
            materias.length;

    }


    const ultimaAtualizacao =
        document.getElementById("ultimaAtualizacao");

    if (ultimaAtualizacao) {

        ultimaAtualizacao.innerText =
            new Date().toLocaleDateString();

    }

}


// ======================================================
// PRODUTOS
// ======================================================


// ------------------------------------------------------
// GERAR CÓDIGO
// ------------------------------------------------------

function gerarCodigoProduto() {

    let maiorNumero = 0;

    produtos.forEach(function (produto) {

        const codigo =
            String(produto.codigo || "");

        const numero =
            parseInt(
                codigo.replace("PROD-", ""),
                10
            );

        if (
            !isNaN(numero) &&
            numero > maiorNumero
        ) {

            maiorNumero = numero;

        }

    });


    return (
        "PROD-" +
        String(maiorNumero + 1)
            .padStart(4, "0")
    );

}


// ------------------------------------------------------
// GERAR EAN-13
// ------------------------------------------------------

function gerarEAN13() {

    let numero = "";

    for (let i = 0; i < 12; i++) {

        numero +=
            Math.floor(
                Math.random() * 10
            );

    }


    let soma = 0;

    for (let i = 0; i < 12; i++) {

        const digito =
            Number(numero[i]);

        if (i % 2 === 0) {

            soma += digito;

        } else {

            soma +=
                digito * 3;

        }

    }


    const resto =
        soma % 10;

    const digitoVerificador =
        resto === 0
            ? 0
            : 10 - resto;


    return (
        numero +
        digitoVerificador
    );

}


// ------------------------------------------------------
// NOVO PRODUTO
// ------------------------------------------------------

function novoProduto() {

    delete window.produtoEditando;


    const codigo =
        document.getElementById("codigoProduto");

    if (codigo) {

        codigo.value =
            gerarCodigoProduto();

    }


    const ean =
        document.getElementById("eanProduto");

    if (ean) {

        ean.value =
            gerarEAN13();

    }


    const nome =
        document.getElementById("nomeProduto");

    if (nome) {

        nome.value = "";

    }


    const categoria =
        document.getElementById("categoriaProduto");

    if (categoria) {

        categoria.value = "";

    }


    const unidade =
        document.getElementById("unidadeProduto");

    if (unidade) {

        unidade.value = "";

    }


    const status =
        document.getElementById("statusProduto");

    if (status) {

        status.value = "Ativo";

    }


    atualizarBotaoProduto();

}


// ------------------------------------------------------
// BOTÃO PRODUTO
// ------------------------------------------------------

function atualizarBotaoProduto() {

    const botoes =
        document.querySelectorAll("button");

    botoes.forEach(function (botao) {

        const texto =
            botao.innerText
                .trim()
                .toLowerCase();

        if (
            texto === "salvar produto" ||
            texto === "atualizar produto"
        ) {

            if (
                typeof window.produtoEditando ===
                "number"
            ) {

                botao.innerText =
                    "Atualizar Produto";

            } else {

                botao.innerText =
                    "Salvar Produto";

            }

        }

    });

}


// ------------------------------------------------------
// SALVAR PRODUTO
// ------------------------------------------------------

function salvarProduto() {

    if (
        typeof window.produtoEditando ===
        "number"
    ) {

        atualizarProduto(
            window.produtoEditando
        );

        return;

    }


    const nome =
        document.getElementById("nomeProduto");

    if (
        !nome ||
        !nome.value.trim()
    ) {

        alert(
            "Digite o nome do produto."
        );

        return;

    }


    let codigo =
        document.getElementById(
            "codigoProduto"
        )?.value.trim();


    if (!codigo) {

        codigo =
            gerarCodigoProduto();

    }


    let ean =
        document.getElementById(
            "eanProduto"
        )?.value.trim();


    if (!ean) {

        ean =
            gerarEAN13();

    }


    const produto = {

        codigo: codigo,

        ean: ean,

        nome:
            nome.value.trim(),

        categoria:
            document.getElementById(
                "categoriaProduto"
            )?.value || "",

        unidade:
            document.getElementById(
                "unidadeProduto"
            )?.value || "",

        status:
            document.getElementById(
                "statusProduto"
            )?.value || "Ativo",

        estoque: 0,

        custo: 0,

        precoVenda: 0,

        data:
            new Date().toLocaleString()

    };


    produtos.push(produto);

    salvarBanco();

    carregarProdutos();

    atualizarDashboard();

    carregarProdutosReceita();

    novoProduto();


    alert(
        "Produto salvo com sucesso!"
    );

}


// ------------------------------------------------------
// CARREGAR PRODUTOS
// ------------------------------------------------------

function carregarProdutos() {

    const tabela =
        document.getElementById(
            "listaProdutos"
        );

    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    produtos.forEach(
        function (produto, index) {

            const custo =
                Number(
                    produto.custo || 0
                );

            const estoque =
                Number(
                    produto.estoque || 0
                );

            const valorEstoque =
                estoque * custo;


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${produto.codigo || ""}
                </td>

                <td>
                    ${produto.nome || ""}
                </td>

                <td>
                    ${produto.ean || ""}
                </td>

                <td>
                    ${produto.categoria || ""}
                </td>

                <td>
                    ${produto.unidade || ""}
                </td>

                <td>
                    ${estoque}
                </td>

                <td>
                    R$ ${custo.toFixed(2)}
                </td>

                <td>
                    R$ ${valorEstoque.toFixed(2)}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editarProduto(${index})"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        onclick="excluirProduto(${index})"
                    >
                        🗑️
                    </button>

                </td>

            `;


            tabela.appendChild(linha);

        }
    );

}


// ------------------------------------------------------
// EDITAR PRODUTO
// ------------------------------------------------------

function editarProduto(index) {

    const produto =
        produtos[index];

    if (!produto) {

        return;

    }


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
        produto.unidade || "";


    document.getElementById(
        "statusProduto"
    ).value =
        produto.status || "Ativo";


    window.produtoEditando =
        index;


    atualizarBotaoProduto();

}


// ------------------------------------------------------
// ATUALIZAR PRODUTO
// ------------------------------------------------------

function atualizarProduto(index) {

    const produto =
        produtos[index];

    if (!produto) {

        return;

    }


    produto.codigo =
        document.getElementById(
            "codigoProduto"
        )?.value.trim()
        || produto.codigo;


    produto.ean =
        document.getElementById(
            "eanProduto"
        )?.value.trim()
        || produto.ean;


    produto.nome =
        document.getElementById(
            "nomeProduto"
        )?.value.trim()
        || produto.nome;


    produto.categoria =
        document.getElementById(
            "categoriaProduto"
        )?.value || "";


    produto.unidade =
        document.getElementById(
            "unidadeProduto"
        )?.value || "";


    produto.status =
        document.getElementById(
            "statusProduto"
        )?.value || "Ativo";


    salvarBanco();

    carregarProdutos();

    carregarProdutosReceita();

    atualizarDashboard();

    delete window.produtoEditando;

    novoProduto();


    alert(
        "Produto atualizado com sucesso!"
    );

}


// ------------------------------------------------------
// EXCLUIR PRODUTO
// ------------------------------------------------------

function excluirProduto(index) {

    const produto =
        produtos[index];

    if (!produto) {

        return;

    }


    if (
        !confirm(
            `Deseja excluir o produto "${produto.nome}"?`
        )
    ) {

        return;

    }


    produtos.splice(
        index,
        1
    );


    salvarBanco();

    carregarProdutos();

    carregarProdutosReceita();

    atualizarDashboard();


    alert(
        "Produto excluído."
    );

}


// ======================================================
// MATÉRIAS-PRIMAS
// ======================================================


// ------------------------------------------------------
// GERAR CÓDIGO MP
// ------------------------------------------------------

function gerarCodigoMP() {

    let maiorNumero = 0;


    materias.forEach(
        function (materia) {

            const codigo =
                String(
                    materia.codigo || ""
                );

            const numero =
                parseInt(
                    codigo.replace(
                        "MP-",
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
        "MP-" +
        String(
            maiorNumero + 1
        ).padStart(4, "0")
    );

}


// ------------------------------------------------------
// NOVA MATÉRIA-PRIMA
// ------------------------------------------------------

function novaMateriaPrima() {

    delete window.materiaEditando;


    const codigo =
        document.getElementById(
            "codigoMP"
        );

    if (codigo) {

        codigo.value =
            gerarCodigoMP();

    }


    const nome =
        document.getElementById(
            "nomeMP"
        );

    if (nome) {

        nome.value = "";

    }


    const categoria =
        document.getElementById(
            "categoriaMP"
        );

    if (categoria) {

        categoria.value = "";

    }


    const unidade =
        document.getElementById(
            "unidadeMP"
        );

    if (unidade) {

        unidade.value = "";

    }


    const pesoUnidade =
        document.getElementById(
            "pesoUnidadeMP"
        );

    if (pesoUnidade) {

        pesoUnidade.value = "";

    }


    const estoque =
        document.getElementById(
            "estoqueMP"
        );

    if (estoque) {

        estoque.value = "0";

    }


    const custo =
        document.getElementById(
            "custoMP"
        );

    if (custo) {

        custo.value = "";

    }


    atualizarBotaoMateriaPrima();

}


// ------------------------------------------------------
// BOTÃO MATÉRIA-PRIMA
// ------------------------------------------------------

function atualizarBotaoMateriaPrima() {

    const botoes =
        document.querySelectorAll(
            "button"
        );


    botoes.forEach(
        function (botao) {

            const texto =
                botao.innerText
                    .trim()
                    .toLowerCase();


            if (
                texto ===
                    "salvar matéria-prima" ||
                texto ===
                    "salvar materia-prima" ||
                texto ===
                    "atualizar matéria-prima" ||
                texto ===
                    "atualizar materia-prima"
            ) {

                if (
                    typeof window.materiaEditando ===
                    "number"
                ) {

                    botao.innerText =
                        "Atualizar Matéria-Prima";

                } else {

                    botao.innerText =
                        "Salvar Matéria-Prima";

                }

            }

        }
    );

}


// ------------------------------------------------------
// SALVAR MATÉRIA-PRIMA
// ------------------------------------------------------

function salvarMateriaPrima() {

    if (
        typeof window.materiaEditando ===
        "number"
    ) {

        atualizarMateriaPrima(
            window.materiaEditando
        );

        return;

    }


    const campoNome =
        document.getElementById(
            "nomeMP"
        );


    if (
        !campoNome ||
        !campoNome.value.trim()
    ) {

        alert(
            "Digite o nome da matéria-prima."
        );

        return;

    }


    const pesoUnidade =
        Number(
            document.getElementById(
                "pesoUnidadeMP"
            )?.value || 0
        );


    const materia = {

        codigo:
            document.getElementById(
                "codigoMP"
            )?.value.trim()
            || gerarCodigoMP(),

        nome:
            campoNome.value.trim(),

        categoria:
            document.getElementById(
                "categoriaMP"
            )?.value || "",

        unidade:
            document.getElementById(
                "unidadeMP"
            )?.value || "",

        pesoUnidade:
            pesoUnidade,

        estoque:
            Number(
                document.getElementById(
                    "estoqueMP"
                )?.value || 0
            ),

        custo:
            Number(
                document.getElementById(
                    "custoMP"
                )?.value || 0
            ),

        data:
            new Date().toLocaleString()

    };


    if (materia.estoque < 0) {

        alert(
            "O estoque não pode ser negativo."
        );

        return;

    }


    if (materia.custo < 0) {

        alert(
            "O custo não pode ser negativo."
        );

        return;

    }


    if (materia.pesoUnidade < 0) {

        alert(
            "O peso por unidade não pode ser negativo."
        );

        return;

    }


    materias.push(materia);


    salvarBanco();

    carregarMaterias();

    atualizarItensMovimentacao();

    carregarMateriasReceita();

    atualizarDashboard();

    novaMateriaPrima();


    alert(
        "Matéria-prima salva com sucesso!"
    );

}


// ------------------------------------------------------
// CARREGAR MATÉRIAS
// ------------------------------------------------------

function carregarMaterias() {

    const tabela =
        document.getElementById(
            "listaMateriaPrima"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    materias.forEach(
        function (materia, index) {

            const estoque =
                Number(
                    materia.estoque || 0
                );


            const custo =
                Number(
                    materia.custo || 0
                );


            const pesoUnidade =
                Number(
                    materia.pesoUnidade || 0
                );


            const
