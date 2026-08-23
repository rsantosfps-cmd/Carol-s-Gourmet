// ======================================================
// CAROL'S GOURMET ERP 4.0
// APP.JS
// PARTE 1/4
// BANCO + MENU + DASHBOARD + PRODUTOS
// ======================================================


// ======================================================
// BANCO DE DADOS
// ======================================================

let produtos = JSON.parse(
    localStorage.getItem("carols_produtos")
) || [];

let materias = JSON.parse(
    localStorage.getItem("carols_materias")
) || [];

let movimentacoes = JSON.parse(
    localStorage.getItem("carols_movimentacoes")
) || [];

let producoes = JSON.parse(
    localStorage.getItem("carols_producoes")
) || [];

let receitas = JSON.parse(
    localStorage.getItem("carols_receitas")
) || [];


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
// INICIALIZAÇÃO
// ======================================================

window.addEventListener("load", function () {

    carregarProdutos();

    atualizarDashboard();

});


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
// GERAR CÓDIGO INTERNO
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


        if (!isNaN(numero) && numero > maiorNumero) {

            maiorNumero = numero;

        }

    });


    return "PROD-" +
        String(maiorNumero + 1)
            .padStart(4, "0");

}


// ======================================================
// GERAR EAN-13
// ======================================================

function gerarEAN13() {

    let numero = "";

    for (let i = 0; i < 12; i++) {

        numero +=
            Math.floor(Math.random() * 10);

    }


    let soma = 0;


    for (let i = 0; i < 12; i++) {

        const digito =
            Number(numero[i]);

        if (i % 2 === 0) {

            soma += digito;

        } else {

            soma += digito * 3;

        }

    }


    const resto =
        soma % 10;

    const digitoVerificador =
        resto === 0
            ? 0
            : 10 - resto;


    return numero +
        digitoVerificador;

}


// ======================================================
// NOVO PRODUTO
// ======================================================

function novoProduto() {

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

}


// ======================================================
// SALVAR PRODUTO
// ======================================================

function salvarProduto() {

    const nome =
        document.getElementById(
            "nomeProduto"
        );

    if (!nome || !nome.value.trim()) {

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


    novoProduto();


    alert(
        "Produto salvo com sucesso!"
    );

}


// ======================================================
// CARREGAR PRODUTOS
// ======================================================

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
                document.createElement("tr");


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


// ======================================================
// EDITAR PRODUTO
// ======================================================

function editarProduto(index) {

    const produto =
        produtos[index];


    if (!produto) {

        return;

    }


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
            produto.unidade || "";

    }

    if (status) {

        status.value =
            produto.status || "Ativo";

    }


    window.produtoEditando =
        index;


    const botao =
        document.querySelector(
            '[onclick="salvarProduto()"]'
        );


    if (botao) {

        botao.innerText =
            "Atualizar Produto";

    }

}


// ======================================================
// ATUALIZAR PRODUTO
// ======================================================

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
        )?.value
        || "";


    produto.unidade =
        document.getElementById(
            "unidadeProduto"
        )?.value
        || "";


    produto.status =
        document.getElementById(
            "statusProduto"
        )?.value
        || "Ativo";


    salvarBanco();


    carregarProdutos();


    atualizarDashboard();


    delete window.produtoEditando;


    novoProduto();


    alert(
        "Produto atualizado com sucesso!"
    );

}


// ======================================================
// SOBRESCREVER SALVAR PARA SUPORTAR EDIÇÃO
// ======================================================

const salvarProdutoOriginal =
    salvarProduto;


salvarProduto =
    function () {

        if (
            typeof window.produtoEditando
            === "number"
        ) {

            atualizarProduto(
                window.produtoEditando
            );

            return;

        }


        salvarProdutoOriginal();

    };


// ======================================================
// EXCLUIR PRODUTO
// ======================================================

function excluirProduto(index) {

    const produto =
        produtos[index];


    if (!produto) {

        return;

    }


    const confirmar =
        confirm(
            `Deseja excluir o produto "${produto.nome}"?`
        );


    if (!confirmar) {

        return;

    }


    produtos.splice(
        index,
        1
    );


    salvarBanco();


    carregarProdutos();


    atualizarDashboard();


    alert(
        "Produto excluído."
    );

}


// ======================================================
// FIM DA PARTE 1
// ======================================================
// ======================================================
// CAROL'S GOURMET ERP 4.0
// PARTE 2/4
// MATÉRIAS-PRIMAS
// ======================================================


// ======================================================
// GARANTIR DADOS
// ======================================================

if (!Array.isArray(materias)) {

    materias = [];

}


if (!Array.isArray(movimentacoes)) {

    movimentacoes = [];

}


// ======================================================
// GERAR CÓDIGO DA MATÉRIA-PRIMA
// ======================================================

function gerarCodigoMP() {

    let maiorNumero = 0;


    materias.forEach(function (materia) {

        const codigo =
            String(materia.codigo || "");


        const numero =
            parseInt(
                codigo.replace("MP-", ""),
                10
            );


        if (
            !isNaN(numero) &&
            numero > maiorNumero
        ) {

            maiorNumero = numero;

        }

    });


    return "MP-" +
        String(maiorNumero + 1)
            .padStart(4, "0");

}


// ======================================================
// NOVA MATÉRIA-PRIMA
// ======================================================

function novaMateriaPrima() {

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


    delete window.materiaEditando;


    atualizarBotaoMateriaPrima();

}


// ======================================================
// ATUALIZAR TEXTO DO BOTÃO
// ======================================================

function atualizarBotaoMateriaPrima() {

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
            texto === "salvar matéria-prima" ||
            texto === "salvar materia-prima" ||
            texto === "atualizar matéria-prima" ||
            texto === "atualizar materia-prima"
        ) {

            if (
                typeof window.materiaEditando
                === "number"
            ) {

                botao.innerText =
                    "Atualizar Matéria-Prima";

            } else {

                botao.innerText =
                    "Salvar Matéria-Prima";

            }

        }

    });

}


// ======================================================
// SALVAR MATÉRIA-PRIMA
// ======================================================

function salvarMateriaPrima() {

    if (
        typeof window.materiaEditando
        === "number"
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


    const nome =
        campoNome.value.trim();


    let codigo =
        document.getElementById(
            "codigoMP"
        )?.value.trim();


    if (!codigo) {

        codigo =
            gerarCodigoMP();

    }


    const categoria =
        document.getElementById(
            "categoriaMP"
        )?.value || "";


    const unidade =
        document.getElementById(
            "unidadeMP"
        )?.value || "";


    const estoque =
        Number(
            document.getElementById(
                "estoqueMP"
            )?.value || 0
        );


    const custo =
        Number(
            document.getElementById(
                "custoMP"
            )?.value || 0
        );


    if (estoque < 0) {

        alert(
            "O estoque não pode ser negativo."
        );

        return;

    }


    if (custo < 0) {

        alert(
            "O custo não pode ser negativo."
        );

        return;

    }


    const materia = {

        codigo: codigo,

        nome: nome,

        categoria: categoria,

        unidade: unidade,

        estoque: estoque,

        custo: custo,

        data:
            new Date().toLocaleString()

    };


    materias.push(
        materia
    );


    salvarBanco();


    carregarMaterias();


    atualizarDashboard();


    atualizarItensMovimentacao();


    novaMateriaPrima();


    alert(
        "Matéria-prima salva com sucesso!"
    );

}


// ======================================================
// CARREGAR MATÉRIAS-PRIMAS
// ======================================================

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


            tabela.appendChild(
                linha
            );

        }
    );

}


// ======================================================
// EDITAR MATÉRIA-PRIMA
// ======================================================

function editarMateriaPrima(index) {

    const materia =
        materias[index];


    if (!materia) {

        return;

    }


    const codigo =
        document.getElementById(
            "codigoMP"
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
            materia.codigo || "";

    }


    if (nome) {

        nome.value =
            materia.nome || "";

    }


    if (categoria) {

        categoria.value =
            materia.categoria || "";

    }


    if (unidade) {

        unidade.value =
            materia.unidade || "";

    }


    if (estoque) {

        estoque.value =
            Number(
                materia.estoque || 0
            );

    }


    if (custo) {

        custo.value =
            Number(
                materia.custo || 0
            );

    }


    window.materiaEditando =
        index;


    atualizarBotaoMateriaPrima();

}


// ======================================================
// ATUALIZAR MATÉRIA-PRIMA
// ======================================================

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


    materia.estoque =
        novoEstoque;


    materia.custo =
        novoCusto;


    salvarBanco();


    carregarMaterias();


    atualizarDashboard();


    atualizarItensMovimentacao();


    novaMateriaPrima();


    alert(
        "Matéria-prima atualizada com sucesso!"
    );

}


// ======================================================
// EXCLUIR MATÉRIA-PRIMA
// ======================================================

function excluirMateriaPrima(index) {

    const materia =
        materias[index];


    if (!materia) {

        return;

    }


    const confirmar =
        confirm(
            `Deseja excluir a matéria-prima "${materia.nome}"?`
        );


    if (!confirmar) {

        return;

    }


    materias.splice(
        index,
        1
    );


    salvarBanco();


    carregarMaterias();


    atualizarDashboard();


    atualizarItensMovimentacao();


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


// ======================================================
// REGISTRAR MOVIMENTAÇÃO
// ======================================================

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


    if (operacao === "entrada") {

        materia.estoque =
            Number(
                materia.estoque || 0
            ) + quantidade;

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
            ) - quantidade;

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
// INICIALIZAR MATÉRIAS-PRIMAS
// ======================================================

function iniciarMaterias() {

    carregarMaterias();

    atualizarItensMovimentacao();

}


// ======================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ======================================================

window.addEventListener(
    "load",
    function () {

        iniciarMaterias();

    }
);


// ======================================================
// FIM DA PARTE 2
// ======================================================
// ======================================================
// CAROL'S GOURMET ERP 4.0
// PARTE 3/4
// RECEITAS + CUSTO + PRECIFICAÇÃO
// ======================================================


// ======================================================
// BANCO DE RECEITAS
// ======================================================

if (!Array.isArray(receitas)) {

    receitas = [];

}


// ======================================================
// VARIÁVEIS TEMPORÁRIAS DA RECEITA
// ======================================================

let ingredientesReceita = [];


// ======================================================
// NOVA RECEITA
// ======================================================

function novaReceita() {

    ingredientesReceita = [];


    const nome =
        document.getElementById(
            "nomeReceita"
        );

    if (nome) {

        nome.value = "";

    }


    const rendimento =
        document.getElementById(
            "rendimentoReceita"
        );

    if (rendimento) {

        rendimento.value = "1";

    }


    const margem =
        document.getElementById(
            "margemReceita"
        );

    if (margem) {

        margem.value = "50";

    }


    const embalagem =
        document.getElementById(
            "custoEmbalagemReceita"
        );

    if (embalagem) {

        embalagem.value = "0";

    }


    const outros =
        document.getElementById(
            "outrosCustosReceita"
        );

    if (outros) {

        outros.value = "0";

    }


    const lista =
        document.getElementById(
            "listaIngredientes"
        );

    if (lista) {

        lista.innerHTML = "";

    }


    limparResultadosReceita();

    carregarMateriasReceita();

}


// ======================================================
// CARREGAR MATÉRIAS-PRIMAS NO SELECT
// ======================================================

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


// ======================================================
// ADICIONAR INGREDIENTE
// ======================================================

function adicionarIngrediente() {

    const select =
        document.getElementById(
            "materiaReceita"
        );


    const quantidadeCampo =
        document.getElementById(
            "quantidadeIngrediente"
        );


    if (!select || !quantidadeCampo) {

        return;

    }


    const codigo =
        select.value;


    const quantidade =
        Number(
            quantidadeCampo.value || 0
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


    const ingredienteExistente =
        ingredientesReceita.find(
            function (item) {

                return (
                    item.codigo ===
                    materia.codigo
                );

            }
        );


    if (ingredienteExistente) {

        ingredienteExistente.quantidade +=
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

            custoUnitario:
                Number(
                    materia.custo || 0
                )

        });

    }


    quantidadeCampo.value = "";


    select.value = "";


    carregarIngredientesReceita();


    calcularReceita();

}


// ======================================================
// CARREGAR INGREDIENTES NA TABELA
// ======================================================

function carregarIngredientesReceita() {

    const tabela =
        document.getElementById(
            "listaIngredientes"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    ingredientesReceita.forEach(
        function (ingrediente, index) {

            const quantidade =
                Number(
                    ingrediente.quantidade || 0
                );


            const custoUnitario =
                Number(
                    ingrediente.custoUnitario || 0
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
                    ${ingrediente.nome}
                </td>

                <td>
                    ${quantidade}
                </td>

                <td>
                    ${ingrediente.unidade || ""}
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


// ======================================================
// REMOVER INGREDIENTE
// ======================================================

function removerIngrediente(index) {

    if (
        index < 0 ||
        index >= ingredientesReceita.length
    ) {

        return;

    }


    ingredientesReceita.splice(
        index,
        1
    );


    carregarIngredientesReceita();


    calcularReceita();

}


// ======================================================
// CALCULAR CUSTO DA RECEITA
// ======================================================

function calcularReceita() {

    let custoIngredientes = 0;


    ingredientesReceita.forEach(
        function (ingrediente) {

            const quantidade =
                Number(
                    ingrediente.quantidade || 0
                );


            const custo =
                Number(
                    ingrediente.custoUnitario || 0
                );


            custoIngredientes +=
                quantidade * custo;

        }
    );


    const custoEmbalagem =
        Number(
            document.getElementById(
                "custoEmbalagemReceita"
            )?.value || 0
        );


    const outrosCustos =
        Number(
            document.getElementById(
                "outrosCustosReceita"
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
                "margemReceita"
            )?.value || 0
        );


    const custoTotal =
        custoIngredientes +
        custoEmbalagem +
        outrosCustos;


    const quantidadeRendimento =
        rendimento > 0
            ? rendimento
            : 1;


    const custoPorUnidade =
        custoTotal /
        quantidadeRendimento;


    const precoVenda =
        custoPorUnidade *
        (
            1 +
            margem / 100
        );


    const lucroPorUnidade =
        precoVenda -
        custoPorUnidade;


    atualizarResultado(
        "resultadoCustoIngredientes",
        custoIngredientes
    );


    atualizarResultado(
        "resultadoCustoTotal",
        custoTotal
    );


    atualizarResultado(
        "resultadoCustoUnidade",
        custoPorUnidade
    );


    atualizarResultado(
        "resultadoPrecoVenda",
        precoVenda
    );


    atualizarResultado(
        "resultadoLucro",
        lucroPorUnidade
    );


    return {

        custoIngredientes:
            custoIngredientes,

        custoEmbalagem:
            custoEmbalagem,

        outrosCustos:
            outrosCustos,

        custoTotal:
            custoTotal,

        rendimento:
            quantidadeRendimento,

        custoPorUnidade:
            custoPorUnidade,

        margem:
            margem,

        precoVenda:
            precoVenda,

        lucroPorUnidade:
            lucroPorUnidade

    };

}


// ======================================================
// ATUALIZAR RESULTADO NA TELA
// ======================================================

function atualizarResultado(id, valor) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return;

    }


    elemento.innerText =
        "R$ " +
        Number(valor || 0)
            .toFixed(2);

}


// ======================================================
// LIMPAR RESULTADOS
// ======================================================

function limparResultadosReceita() {

    const campos = [

        "resultadoCustoIngredientes",

        "resultadoCustoTotal",

        "resultadoCustoUnidade",

        "resultadoPrecoVenda",

        "resultadoLucro"

    ];


    campos.forEach(
        function (id) {

            const elemento =
                document.getElementById(id);


            if (elemento) {

                elemento.innerText =
                    "R$ 0,00";

            }

        }
    );

}


// ======================================================
// SALVAR RECEITA
// ======================================================

function salvarReceita() {

    const campoNome =
        document.getElementById(
            "nomeReceita"
        );


    if (
        !campoNome ||
        !campoNome.value.trim()
    ) {

        alert(
            "Digite o nome da receita."
        );

        return;

    }


    if (
        ingredientesReceita.length === 0
    ) {

        alert(
            "Adicione pelo menos um ingrediente."
        );

        return;

    }


    const nome =
        campoNome.value.trim();


    const calculo =
        calcularReceita();


    if (!calculo) {

        return;

    }


    const receita = {

        id:
            Date.now(),

        nome:
            nome,

        ingredientes:
            JSON.parse(
                JSON.stringify(
                    ingredientesReceita
                )
            ),

        custoIngredientes:
            calculo.custoIngredientes,

        custoEmbalagem:
            calculo.custoEmbalagem,

        outrosCustos:
            calculo.outrosCustos,

        custoTotal:
            calculo.custoTotal,

        rendimento:
            calculo.rendimento,

        custoPorUnidade:
            calculo.custoPorUnidade,

        margem:
            calculo.margem,

        precoVenda:
            calculo.precoVenda,

        lucroPorUnidade:
            calculo.lucroPorUnidade,

        data:
            new Date().toLocaleString()

    };


    receitas.push(
        receita
    );


    salvarBanco();


    carregarListaReceitas();


    alert(
        "Receita salva com sucesso!"
    );

}


// ======================================================
// CARREGAR LISTA DE RECEITAS
// ======================================================

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
                    ${receita.nome || ""}
                </td>

                <td>
                    ${receita.rendimento || 0}
                </td>

                <td>
                    R$ ${Number(
                        receita.custoTotal || 0
                    ).toFixed(2)}
                </td>

                <td>
                    R$ ${Number(
                        receita.custoPorUnidade || 0
                    ).toFixed(2)}
                </td>

                <td>
                    R$ ${Number(
                        receita.precoVenda || 0
                    ).toFixed(2)}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editarReceita(${index})"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        onclick="excluirReceita(${index})"
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


// ======================================================
// EDITAR RECEITA
// ======================================================

function editarReceita(index) {

    const receita =
        receitas[index];


    if (!receita) {

        return;

    }


    const campoNome =
        document.getElementById(
            "nomeReceita"
        );


    const rendimento =
        document.getElementById(
            "rendimentoReceita"
        );


    const margem =
        document.getElementById(
            "margemReceita"
        );


    const embalagem =
        document.getElementById(
            "custoEmbalagemReceita"
        );


    const outros =
        document.getElementById(
            "outrosCustosReceita"
        );


    if (campoNome) {

        campoNome.value =
            receita.nome || "";

    }


    if (rendimento) {

        rendimento.value =
            receita.rendimento || 1;

    }


    if (margem) {

        margem.value =
            receita.margem || 0;

    }


    if (embalagem) {

        embalagem.value =
            receita.custoEmbalagem || 0;

    }


    if (outros) {

        outros.value =
            receita.outrosCustos || 0;

    }


    ingredientesReceita =
        JSON.parse(
            JSON.stringify(
                receita.ingredientes || []
            )
        );


    carregarIngredientesReceita();


    calcularReceita();


    window.receitaEditando =
        index;

}


// ======================================================
// ATUALIZAR RECEITA
// ======================================================

function atualizarReceita(index) {

    const receita =
        receitas[index];


    if (!receita) {

        return;

    }


    const nome =
        document.getElementById(
            "nomeReceita"
        )?.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da receita."
        );

        return;

    }


    const calculo =
        calcularReceita();


    receita.nome =
        nome;


    receita.ingredientes =
        JSON.parse(
            JSON.stringify(
                ingredientesReceita
            )
        );


    receita.custoIngredientes =
        calculo.custoIngredientes;


    receita.custoEmbalagem =
        calculo.custoEmbalagem;


    receita.outrosCustos =
        calculo.outrosCustos;


    receita.custoTotal =
        calculo.custoTotal;


    receita.rendimento =
        calculo.rendimento;


    receita.custoPorUnidade =
        calculo.custoPorUnidade;


    receita.margem =
        calculo.margem;


    receita.precoVenda =
        calculo.precoVenda;


    receita.lucroPorUnidade =
        calculo.lucroPorUnidade;


    salvarBanco();


    carregarListaReceitas();


    delete window.receitaEditando;


    alert(
        "Receita atualizada com sucesso!"
    );

}


// ======================================================
// EXCLUIR RECEITA
// ======================================================

function excluirReceita(index) {

    const receita =
        receitas[index];


    if (!receita) {

        return;

    }


    const confirmar =
        confirm(
            `Deseja excluir a receita "${receita.nome}"?`
        );


    if (!confirmar) {

        return;

    }


    receitas.splice(
        index,
        1
    );


    salvarBanco();


    carregarListaReceitas();


    alert(
        "Receita excluída."
    );

}


// ======================================================
// FINALIZAR EDIÇÃO / NOVA RECEITA
// ======================================================

function finalizarReceita() {

    ingredientesReceita = [];


    delete window.receitaEditando;


    novaReceita();


    carregarListaReceitas();

}


// ======================================================
// INICIALIZAÇÃO DAS RECEITAS
// ======================================================

function iniciarReceitas() {

    carregarMateriasReceita();

    carregarListaReceitas();

}


// ======================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ======================================================

window.addEventListener(
    "load",
    function () {

        iniciarReceitas();

    }
);


// ======================================================
// FIM DA PARTE 3
// ======================================================
// ======================================================
// CAROL'S GOURMET ERP 4.0
// PARTE 4/4
// RECEITAS + CUSTO + PRECIFICAÇÃO
// ======================================================


// ======================================================
// BANCO DE RECEITAS
// ======================================================

let receitas = JSON.parse(
    localStorage.getItem("carols_receitas")
) || [];


// ======================================================
// SALVAR RECEITAS
// ======================================================

function salvarReceitas(){

    localStorage.setItem(
        "carols_receitas",
        JSON.stringify(receitas)
    );

}


// ======================================================
// CARREGAR PRODUTOS NA RECEITA
// ======================================================

function carregarProdutosReceita(){

    const select =
        document.getElementById("produtoReceita");

    if(!select){
        return;
    }


    select.innerHTML = `
        <option value="">
            Selecione o produto
        </option>
    `;


    if(typeof produtos === "undefined"){
        return;
    }


    produtos.forEach(function(produto){

        const option =
            document.createElement("option");


        option.value =
            produto.codigo;


        option.textContent =
            produto.nome;


        select.appendChild(option);

    });

}


// ======================================================
// CARREGAR MATÉRIAS-PRIMAS NA RECEITA
// ======================================================

function carregarMateriasReceita(){

    const select =
        document.getElementById("materiaReceita");

    if(!select){
        return;
    }


    select.innerHTML = `
        <option value="">
            Selecione a matéria-prima
        </option>
    `;


    if(typeof materias === "undefined"){
        return;
    }


    materias.forEach(function(mp){

        const option =
            document.createElement("option");


        option.value =
            mp.codigo;


        option.textContent =
            mp.nome;


        select.appendChild(option);

    });

}


// ======================================================
// ADICIONAR INGREDIENTE À RECEITA
// ======================================================

function adicionarIngrediente(){

    const materiaSelect =
        document.getElementById("materiaReceita");


    const quantidadeInput =
        document.getElementById("quantidadeReceita");


    if(!materiaSelect || !quantidadeInput){
        return;
    }


    const codigo =
        materiaSelect.value;


    const quantidade =
        Number(quantidadeInput.value || 0);


    if(!codigo){

        alert(
            "Selecione uma matéria-prima."
        );

        return;

    }


    if(quantidade <= 0){

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    const materia =
        materias.find(function(mp){

            return mp.codigo === codigo;

        });


    if(!materia){

        alert(
            "Matéria-prima não encontrada."
        );

        return;

    }


    // Verifica se já existe na receita

    const existente =
        ingredientesReceita.find(function(item){

            return item.codigo === codigo;

        });


    if(existente){

        existente.quantidade += quantidade;

    }else{

        ingredientesReceita.push({

            codigo: materia.codigo,

            nome: materia.nome,

            unidade: materia.unidade,

            quantidade: quantidade,

            custo: Number(materia.custo || 0)

        });

    }


    quantidadeInput.value = "";


    materiaSelect.value = "";


    atualizarTabelaReceita();


    calcularCustoReceita();

}


// ======================================================
// INGREDIENTES TEMPORÁRIOS DA RECEITA
// ======================================================

let ingredientesReceita = [];


// ======================================================
// ATUALIZAR TABELA DA RECEITA
// ======================================================

function atualizarTabelaReceita(){

    const tabela =
        document.getElementById(
            "listaIngredientesReceita"
        );


    if(!tabela){
        return;
    }


    tabela.innerHTML = "";


    ingredientesReceita.forEach(
        function(item,index){

            const custo =
                Number(item.quantidade || 0) *
                Number(item.custo || 0);


            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    ${item.nome}
                </td>

                <td>
                    ${item.quantidade}
                </td>

                <td>
                    ${item.unidade || ""}
                </td>

                <td>
                    R$ ${item.custo.toFixed(2)}
                </td>

                <td>
                    R$ ${custo.toFixed(2)}
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


            tabela.appendChild(linha);

        }
    );

}


// ======================================================
// REMOVER INGREDIENTE
// ======================================================

function removerIngrediente(index){

    if(
        !confirm(
            "Remover este ingrediente da receita?"
        )
    ){

        return;

    }


    ingredientesReceita.splice(
        index,
        1
    );


    atualizarTabelaReceita();


    calcularCustoReceita();

}


// ======================================================
// CALCULAR CUSTO DA RECEITA
// ======================================================

function calcularCustoReceita(){

    let custoIngredientes = 0;


    ingredientesReceita.forEach(
        function(item){

            custoIngredientes +=
                Number(item.quantidade || 0) *
                Number(item.custo || 0);

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


    const quantidadeProducao =
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


    const custoPorUnidade =
        quantidadeProducao > 0
        ? custoTotal / quantidadeProducao
        : custoTotal;


    const valorVenda =
        custoPorUnidade *
        (1 + margem / 100);


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


    if(resultadoIngredientes){

        resultadoIngredientes.innerText =
            "R$ " +
            custoIngredientes.toFixed(2);

    }


    if(resultadoCusto){

        resultadoCusto.innerText =
            "R$ " +
            custoTotal.toFixed(2);

    }


    if(resultadoUnitario){

        resultadoUnitario.innerText =
            "R$ " +
            custoPorUnidade.toFixed(2);

    }


    if(resultadoVenda){

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


// ======================================================
// SALVAR RECEITA
// ======================================================

function salvarReceita(){

    const produtoSelect =
        document.getElementById(
            "produtoReceita"
        );


    if(!produtoSelect){

        return;

    }


    const codigoProduto =
        produtoSelect.value;


    if(!codigoProduto){

        alert(
            "Selecione o produto."
        );

        return;

    }


    if(ingredientesReceita.length === 0){

        alert(
            "Adicione pelo menos uma matéria-prima."
        );

        return;

    }


    const produto =
        produtos.find(function(p){

            return p.codigo === codigoProduto;

        });


    if(!produto){

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const calculo =
        calcularCustoReceita();


    const rendimento =
        Number(
            document.getElementById(
                "rendimentoReceita"
            )?.value || 1
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


    const margem =
        Number(
            document.getElementById(
                "margemLucro"
            )?.value || 0
        );


    // Procurar receita existente

    const receitaExistente =
        receitas.find(function(r){

            return r.codigoProduto === codigoProduto;

        });


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
            rendimento,

        custoIngredientes:
            calculo.ingredientes,

        custoEmbalagem:
            embalagem,

        outrosCustos:
            outros,

        custoTotal:
            calculo.total,

        custoUnitario:
            calculo.unitario,

        margemLucro:
            margem,

        valorVenda:
            calculo.venda,

        data:
            new Date().toLocaleString()

    };


    if(receitaExistente){

        Object.assign(
            receitaExistente,
            dadosReceita
        );

        alert(
            "Receita atualizada!"
        );

    }else{

        receitas.push(
            dadosReceita
        );

        alert(
            "Receita salva!"
        );

    }


    salvarReceitas();


    carregarListaReceitas();

}


// ======================================================
// CARREGAR RECEITA PARA EDIÇÃO
// ======================================================

function editarReceita(codigoProduto){

    const receita =
        receitas.find(function(r){

            return r.codigoProduto === codigoProduto;

        });


    if(!receita){

        alert(
            "Receita não encontrada."
        );

        return;

    }


    const produtoSelect =
        document.getElementById(
            "produtoReceita"
        );


    if(produtoSelect){

        produtoSelect.value =
            receita.codigoProduto;

    }


    const rendimento =
        document.getElementById(
            "rendimentoReceita"
        );


    if(rendimento){

        rendimento.value =
            receita.rendimento;

    }


    const embalagem =
        document.getElementById(
            "custoEmbalagem"
        );


    if(embalagem){

        embalagem.value =
            receita.custoEmbalagem;

    }


    const outros =
        document.getElementById(
            "outrosCustos"
        );


    if(outros){

        outros.value =
            receita.outrosCustos;

    }


    const margem =
        document.getElementById(
            "margemLucro"
        );


    if(margem){

        margem.value =
            receita.margemLucro;

    }


    ingredientesReceita =
        JSON.parse(
            JSON.stringify(
                receita.ingredientes
            )
        );


    atualizarTabelaReceita();


    calcularCustoReceita();

}


// ======================================================
// LISTA DE RECEITAS
// ======================================================

function carregarListaReceitas(){

    const tabela =
        document.getElementById(
            "listaReceitas"
        );


    if(!tabela){
        return;
    }


    tabela.innerHTML = "";


    receitas.forEach(function(
        receita,
        index
    ){

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${receita.produto}
            </td>

            <td>
                ${receita.rendimento}
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


        tabela.appendChild(linha);

    });

}


// ======================================================
// NOVA RECEITA
// ======================================================

function novaReceita(){

    const produto =
        document.getElementById(
            "produtoReceita"
        );


    if(produto){

        produto.value = "";

    }


    const rendimento =
        document.getElementById(
            "rendimentoReceita"
        );


    if(rendimento){

        rendimento.value = 1;

    }


    const embalagem =
        document.getElementById(
            "custoEmbalagem"
        );


    if(embalagem){

        embalagem.value = 0;

    }


    const outros =
        document.getElementById(
            "outrosCustos"
        );


    if(outros){

        outros.value = 0;

    }


    const margem =
        document.getElementById(
            "margemLucro"
        );


    if(margem){

        margem.value = 0;

    }


    ingredientesReceita = [];


    atualizarTabelaReceita();


    calcularCustoReceita();

}


// ======================================================
// INICIALIZAÇÃO DA PARTE 4
// ======================================================

function iniciarReceitas(){

    carregarProdutosReceita();

    carregarMateriasReceita();

    carregarListaReceitas();

    atualizarTabelaReceita();

    calcularCustoReceita();

}


// ======================================================
// EVENTOS AUTOMÁTICOS
// ======================================================

window.addEventListener(
    "load",
    function(){

        iniciarReceitas();

    }
);


// ======================================================
// RECALCULAR AO ALTERAR VALORES
// ======================================================

document.addEventListener(
    "input",
    function(event){

        const ids = [

            "rendimentoReceita",

            "custoEmbalagem",

            "outrosCustos",

            "margemLucro",

            "quantidadeReceita"

        ];


        if(
            ids.includes(
                event.target.id
            )
        ){

            calcularCustoReceita();

        }

    }
);
