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


    // Atualiza os dados da aba aberta

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
        document.getElementById(
            "totalProdutos"
        );

    if (totalProdutos) {

        totalProdutos.innerText =
            produtos.length;

    }


    const totalMateriaPrima =
        document.getElementById(
            "totalMateriaPrima"
        );

    if (totalMateriaPrima) {

        totalMateriaPrima.innerText =
            materias.length;

    }


    const ultimaAtualizacao =
        document.getElementById(
            "ultimaAtualizacao"
        );

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
        document.getElementById(
            "codigoProduto"
        );

    if (codigo) {

        codigo.value =
            gerarCodigoProduto();

    }


    const ean =
        document.getElementById(
            "eanProduto"
        );

    if (ean) {

        ean.value =
            gerarEAN13();

    }


    const nome =
        document.getElementById(
            "nomeProduto"
        );

    if (nome) {

        nome.value = "";

    }


    const categoria =
        document.getElementById(
            "categoriaProduto"
        );

    if (categoria) {

        categoria.value = "";

    }


    const unidade =
        document.getElementById(
            "unidadeProduto"
        );

    if (unidade) {

        unidade.value = "";

    }


    const status =
        document.getElementById(
            "statusProduto"
        );

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
        document.querySelectorAll(
            "button"
        );

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
        document.getElementById(
            "nomeProduto"
        );

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


            const valorEstoque =
                estoque * custo;


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
                        onclick="editarMateriaPrima(${index})"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        onclick="excluirMateriaPrima(${index})"
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
// EDITAR MATÉRIA-PRIMA
// ------------------------------------------------------

function editarMateriaPrima(index) {

    const materia =
        materias[index];


    if (!materia) {

        return;

    }


    document.getElementById(
        "codigoMP"
    ).value =
        materia.codigo || "";


    document.getElementById(
        "nomeMP"
    ).value =
        materia.nome || "";


    document.getElementById(
        "categoriaMP"
    ).value =
        materia.categoria || "";


    document.getElementById(
        "unidadeMP"
    ).value =
        materia.unidade || "";


    document.getElementById(
        "estoqueMP"
    ).value =
        Number(
            materia.estoque || 0
        );


    document.getElementById(
        "custoMP"
    ).value =
        Number(
            materia.custo || 0
        );


    window.materiaEditando =
        index;


    atualizarBotaoMateriaPrima();
}


// ------------------------------------------------------
// ATUALIZAR MATÉRIA-PRIMA
// ------------------------------------------------------

function atualizarMateriaPrima(index) {

    const materia =
        materias[index];


    if (!materia) {

        return;

    }


    const nome =
        document.getElementById(
            "nomeMP"
        )?.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da matéria-prima."
        );

        return;

    }


    const novoEstoque =
        Number(
            document.getElementById(
                "estoqueMP"
            )?.value || 0
        );


    const novoCusto =
        Number(
            document.getElementById(
                "custoMP"
            )?.value || 0
        );


    if (novoEstoque < 0) {

        alert(
            "O estoque não pode ser negativo."
        );

        return;

    }


    if (novoCusto < 0) {

        alert(
            "O custo não pode ser negativo."
        );

        return;

    }


    materia.codigo =
        document.getElementById(
            "codigoMP"
        )?.value.trim()
        || materia.codigo;


    materia.nome =
        nome;


    materia.categoria =
        document.getElementById(
            "categoriaMP"
        )?.value || "";


    materia.unidade =
        document.getElementById(
            "unidadeMP"
        )?.value || "";


    materia.estoque =
        novoEstoque;


    materia.custo =
        novoCusto;


    salvarBanco();

    carregarMaterias();

    atualizarItensMovimentacao();

    carregarMateriasReceita();

    atualizarDashboard();

    novaMateriaPrima();


    alert(
        "Matéria-prima atualizada com sucesso!"
    );
}


// ------------------------------------------------------
// EXCLUIR MATÉRIA-PRIMA
// ------------------------------------------------------

function excluirMateriaPrima(index) {

    const materia =
        materias[index];


    if (!materia) {

        return;

    }


    if (
        !confirm(
            `Deseja excluir a matéria-prima "${materia.nome}"?`
        )
    ) {

        return;

    }


    materias.splice(
        index,
        1
    );


    salvarBanco();

    carregarMaterias();

    atualizarItensMovimentacao();

    carregarMateriasReceita();

    atualizarDashboard();


    alert(
        "Matéria-prima excluída."
    );
}


// ======================================================
// MOVIMENTAÇÃO DE ESTOQUE
// ======================================================

function atualizarItensMovimentacao() {

    const select =
        document.getElementById(
            "itemMovimentacao"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Selecione uma matéria-prima
        </option>

    `;


    materias.forEach(
        function (materia) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                materia.codigo;


            option.textContent =
                materia.nome;


            select.appendChild(
                option
            );

        }
    );
}


// ------------------------------------------------------
// REGISTRAR MOVIMENTAÇÃO
// ------------------------------------------------------

function registrarMovimentacao() {

    const codigo =
        document.getElementById(
            "itemMovimentacao"
        )?.value;


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeMovimentacao"
            )?.value || 0
        );


    const operacao =
        document.getElementById(
            "tipoMovimentacao"
        )?.value;


    if (
        !codigo ||
        quantidade <= 0
    ) {

        alert(
            "Preencha os dados da movimentação."
        );

        return;

    }


    const materia =
        materias.find(
            function (item) {

                return (
                    item.codigo ===
                    codigo
                );

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

        materia.estoque =
            Number(
                materia.estoque || 0
            ) +
            quantidade;

    } else {

        if (
            quantidade >
            Number(
                materia.estoque || 0
            )
        ) {

            alert(
                "Estoque insuficiente."
            );

            return;

        }


        materia.estoque =
            Number(
                materia.estoque || 0
            ) -
            quantidade;

    }


    movimentacoes.push({

        item:
            materia.nome,

        codigo:
            materia.codigo,

        quantidade:
            quantidade,

        operacao:
            operacao,

        data:
            new Date().toLocaleString()

    });


    salvarBanco();

    carregarMaterias();

    atualizarDashboard();

    atualizarItensMovimentacao();


    const campoQuantidade =
        document.getElementById(
            "quantidadeMovimentacao"
        );


    if (campoQuantidade) {

        campoQuantidade.value = "";

    }


    alert(
        "Movimentação registrada com sucesso!"
    );
}


// ======================================================
// RECEITAS
// ÚNICA IMPLEMENTAÇÃO
// ======================================================


// ------------------------------------------------------
// CARREGAR PRODUTOS NA RECEITA
// ------------------------------------------------------

function carregarProdutosReceita() {

    const select =
        document.getElementById(
            "produtoReceita"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Selecione o produto
        </option>

    `;


    produtos.forEach(
        function (produto) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                produto.codigo;


            option.textContent =
                produto.nome;


            select.appendChild(
                option
            );

        }
    );
}


// ------------------------------------------------------
// CARREGAR MATÉRIAS NA RECEITA
// ------------------------------------------------------

function carregarMateriasReceita() {

    const select =
        document.getElementById(
            "materiaReceita"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Selecione a matéria-prima
        </option>

    `;


    materias.forEach(
        function (materia) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                materia.codigo;


            option.textContent =
                materia.nome;


            select.appendChild(
                option
            );

        }
    );
}


// ------------------------------------------------------
// NOVA RECEITA
// ------------------------------------------------------

function novaReceita() {

    delete window.receitaEditando;


    ingredientesReceita = [];


    const produto =
        document.getElementById(
            "produtoReceita"
        );


    if (produto) {

        produto.value = "";

    }


    const rendimento =
        document.getElementById(
            "rendimentoReceita"
        );


    if (rendimento) {

        rendimento.value = 1;

    }


    const embalagem =
        document.getElementById(
            "custoEmbalagem"
        );


    if (embalagem) {

        embalagem.value = 0;

    }


    const outros =
        document.getElementById(
            "outrosCustos"
        );


    if (outros) {

        outros.value = 0;

    }


    const margem =
        document.getElementById(
            "margemLucro"
        );


    if (margem) {

        margem.value = 0;

    }


    atualizarTabelaReceita();

    calcularCustoReceita();
}


// ------------------------------------------------------
// ADICIONAR INGREDIENTE
// ------------------------------------------------------

function adicionarIngrediente() {

    const materiaSelect =
        document.getElementById(
            "materiaReceita"
        );


    const quantidadeInput =
        document.getElementById(
            "quantidadeReceita"
        );


    if (
        !materiaSelect ||
        !quantidadeInput
    ) {

        return;

    }


    const codigo =
        materiaSelect.value;


    const quantidade =
        Number(
            quantidadeInput.value || 0
        );


    if (!codigo) {

        alert(
            "Selecione uma matéria-prima."
        );

        return;

    }


    if (quantidade <= 0) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    const materia =
        materias.find(
            function (item) {

                return (
                    item.codigo ===
                    codigo
                );

            }
        );


    if (!materia) {

        alert(
            "Matéria-prima não encontrada."
        );

        return;

    }


    const existente =
        ingredientesReceita.find(
            function (item) {

                return (
                    item.codigo ===
                    codigo
                );

            }
        );


    if (existente) {

        existente.quantidade +=
            quantidade;

    } else {

        ingredientesReceita.push({

            codigo:
                materia.codigo,

            nome:
                materia.nome,

            unidade:
                materia.unidade,

            quantidade:
                quantidade,

            custo:
                Number(
                    materia.custo || 0
                )

        });

    }


    quantidadeInput.value = "";

    materiaSelect.value = "";


    atualizarTabelaReceita();

    calcularCustoReceita();
}


// ------------------------------------------------------
// TABELA DE INGREDIENTES
// ------------------------------------------------------

function atualizarTabelaReceita() {

    const tabela =
        document.getElementById(
            "listaIngredientesReceita"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    ingredientesReceita.forEach(
        function (item, index) {

            const quantidade =
                Number(
                    item.quantidade || 0
                );


            const custoUnitario =
                Number(
                    item.custo || 0
                );


            const custoTotal =
                quantidade *
                custoUnitario;


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${item.nome || ""}
                </td>

                <td>
                    ${quantidade}
                </td>

                <td>
                    ${item.unidade || ""}
                </td>

                <td>
                    R$ ${custoUnitario.toFixed(2)}
                </td>

                <td>
                    R$ ${custoTotal.toFixed(2)}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="removerIngrediente(${index})"
                    >
                        🗑️
                    </button>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );
}


// ------------------------------------------------------
// REMOVER INGREDIENTE
// ------------------------------------------------------

function removerIngrediente(index) {

    if (
        index < 0 ||
        index >= ingredientesReceita.length
    ) {

        return;

    }


    if (
        !confirm(
            "Remover este ingrediente da receita?"
        )
    ) {

        return;

    }


    ingredientesReceita.splice(
        index,
        1
    );


    atualizarTabelaReceita();

    calcularCustoReceita();
}


// ------------------------------------------------------
// CALCULAR RECEITA
// ------------------------------------------------------

function calcularCustoReceita() {

    let custoIngredientes = 0;


    ingredientesReceita.forEach(
        function (item) {

            custoIngredientes +=
                Number(
                    item.quantidade || 0
                ) *
                Number(
                    item.custo || 0
                );

        }
    );


    const embalagem =
        Number(
            document.getElementById(
                "custoEmbalagem"
            )?.value || 0
        );


    const outros =
        Number(
            document.getElementById(
                "outrosCustos"
            )?.value || 0
        );


    const rendimento =
        Number(
            document.getElementById(
                "rendimentoReceita"
            )?.value || 1
        );


    const margem =
        Number(
            document.getElementById(
                "margemLucro"
            )?.value || 0
        );


    const custoTotal =
        custoIngredientes +
        embalagem +
        outros;


    const quantidade =
        rendimento > 0
            ? rendimento
            : 1;


    const custoPorUnidade =
        custoTotal /
        quantidade;


    const valorVenda =
        custoPorUnidade *
        (
            1 +
            margem / 100
        );


    const resultadoIngredientes =
        document.getElementById(
            "resultadoIngredientes"
        );


    const resultadoCusto =
        document.getElementById(
            "resultadoCustoReceita"
        );


    const resultadoUnitario =
        document.getElementById(
            "resultadoCustoUnitario"
        );


    const resultadoVenda =
        document.getElementById(
            "resultadoVendaReceita"
        );


    if (resultadoIngredientes) {

        resultadoIngredientes.innerText =
            "R$ " +
            custoIngredientes.toFixed(2);

    }


    if (resultadoCusto) {

        resultadoCusto.innerText =
            "R$ " +
            custoTotal.toFixed(2);

    }


    if (resultadoUnitario) {

        resultadoUnitario.innerText =
            "R$ " +
            custoPorUnidade.toFixed(2);

    }


    if (resultadoVenda) {

        resultadoVenda.innerText =
            "R$ " +
            valorVenda.toFixed(2);

    }


    return {

        ingredientes:
            custoIngredientes,

        total:
            custoTotal,

        unitario:
            custoPorUnidade,

        venda:
            valorVenda

    };
}


// ------------------------------------------------------
// SALVAR RECEITA
// ------------------------------------------------------

function salvarReceita() {

    const produtoSelect =
        document.getElementById(
            "produtoReceita"
        );


    if (!produtoSelect) {

        return;

    }


    const codigoProduto =
        produtoSelect.value;


    if (!codigoProduto) {

        alert(
            "Selecione o produto."
        );

        return;

    }


    if (
        ingredientesReceita.length === 0
    ) {

        alert(
            "Adicione pelo menos uma matéria-prima."
        );

        return;

    }


    const produto =
        produtos.find(
            function (item) {

                return (
                    item.codigo ===
                    codigoProduto
                );

            }
        );


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const calculo =
        calcularCustoReceita();


    const dadosReceita = {

        codigoProduto:
            codigoProduto,

        produto:
            produto.nome,

        ingredientes:
            JSON.parse(
                JSON.stringify(
                    ingredientesReceita
                )
            ),

        rendimento:
            Number(
                document.getElementById(
                    "rendimentoReceita"
                )?.value || 1
            ),

        custoIngredientes:
            calculo.ingredientes,

        custoEmbalagem:
            Number(
                document.getElementById(
                    "custoEmbalagem"
                )?.value || 0
            ),

        outrosCustos:
            Number(
                document.getElementById(
                    "outrosCustos"
                )?.value || 0
            ),

        custoTotal:
            calculo.total,

        custoUnitario:
            calculo.unitario,

        margemLucro:
            Number(
                document.getElementById(
                    "margemLucro"
                )?.value || 0
            ),

        valorVenda:
            calculo.venda,

        data:
            new Date().toLocaleString()

    };


    const receitaExistente =
        receitas.find(
            function (receita) {

                return (
                    receita.codigoProduto ===
                    codigoProduto
                );

            }
        );


    if (receitaExistente) {

        Object.assign(
            receitaExistente,
            dadosReceita
        );


        alert(
            "Receita atualizada!"
        );

    } else {

        receitas.push(
            dadosReceita
        );


        alert(
            "Receita salva!"
        );

    }


    salvarBanco();

    carregarListaReceitas();

    novaReceita();
}


// ------------------------------------------------------
// EDITAR RECEITA
// ------------------------------------------------------

function editarReceita(codigoProduto) {

    const receita =
        receitas.find(
            function (item) {

                return (
                    item.codigoProduto ===
                    codigoProduto
                );

            }
        );


    if (!receita) {

        alert(
            "Receita não encontrada."
        );

        return;

    }


    const produtoSelect =
        document.getElementById(
            "produtoReceita"
        );


    if (produtoSelect) {

        produtoSelect.value =
            receita.codigoProduto;

    }


    const rendimento =
        document.getElementById(
            "rendimentoReceita"
        );


    if (rendimento) {

        rendimento.value =
            receita.rendimento || 1;

    }


    const embalagem =
        document.getElementById(
            "custoEmbalagem"
        );


    if (embalagem) {

        embalagem.value =
            receita.custoEmbalagem || 0;

    }


    const outros =
        document.getElementById(
            "outrosCustos"
        );


    if (outros) {

        outros.value =
            receita.outrosCustos || 0;

    }


    const margem =
        document.getElementById(
            "margemLucro"
        );


    if (margem) {

        margem.value =
            receita.margemLucro || 0;

    }


    ingredientesReceita =
        JSON.parse(
            JSON.stringify(
                receita.ingredientes || []
            )
        );


    window.receitaEditando =
        codigoProduto;


    atualizarTabelaReceita();

    calcularCustoReceita();
}


// ------------------------------------------------------
// CARREGAR LISTA DE RECEITAS
// ------------------------------------------------------

function carregarListaReceitas() {

    const tabela =
        document.getElementById(
            "listaReceitas"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    receitas.forEach(
        function (receita, index) {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${receita.produto || ""}
                </td>

                <td>
                    ${receita.rendimento || 0}
                </td>

                <td>
                    R$ ${Number(
                        receita.custoUnitario || 0
                    ).toFixed(2)}
                </td>

                <td>
                    ${Number(
                        receita.margemLucro || 0
                    ).toFixed(2)}%
                </td>

                <td>
                    <strong>
                        R$ ${Number(
                            receita.valorVenda || 0
                        ).toFixed(2)}
                    </strong>
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editarReceita('${receita.codigoProduto}')"
                    >
                        ✏️
                    </button>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );
}


// ======================================================
// COMPATIBILIDADE COM POSSÍVEIS IDs DA VERSÃO ANTERIOR
// ======================================================

function carregarIngredientesReceita() {

    atualizarTabelaReceita();

}


function calcularReceita() {

    return calcularCustoReceita();

}


function finalizarReceita() {

    novaReceita();

    carregarListaReceitas();

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

function iniciarSistema() {

    carregarProdutos();

    carregarMaterias();

    atualizarItensMovimentacao();

    carregarProdutosReceita();

    carregarMateriasReceita();

    carregarListaReceitas();

    atualizarTabelaReceita();

    atualizarDashboard();

}


// ======================================================
// EVENTOS DE LOAD
// ======================================================

window.addEventListener(
    "load",
    function () {

        iniciarSistema();

    }
);


// ======================================================
// RECALCULAR RECEITA AUTOMATICAMENTE
// ======================================================

document.addEventListener(
    "input",
    function (event) {

        const ids = [

            "rendimentoReceita",

            "custoEmbalagem",

            "outrosCustos",

            "margemLucro",

            "quantidadeReceita"

        ];


        if (
            ids.includes(
                event.target.id
            )
        ) {

            calcularCustoReceita();

        }

    }
);


// ======================================================
// FIM DO APP.JS
// ======================================================
