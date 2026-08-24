// ======================================================
// CAROL'S GOURMET ERP 4.0
// APP.JS - VERSÃO CORRIGIDA
// CONTROLE POR UNIDADE OU POR PESO
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


// ======================================================
// GARANTIR ARRAYS
// ======================================================

if (!Array.isArray(produtos)) {
    produtos = [];
}

if (!Array.isArray(materias)) {
    materias = [];
}

if (!Array.isArray(movimentacoes)) {
    movimentacoes = [];
}

if (!Array.isArray(producoes)) {
    producoes = [];
}

if (!Array.isArray(receitas)) {
    receitas = [];
}


// ======================================================
// VARIÁVEIS TEMPORÁRIAS
// ======================================================

let ingredientesReceita = [];


// ======================================================
// NORMALIZAÇÃO DAS MATÉRIAS-PRIMAS
// NÃO APAGA DADOS EXISTENTES
// ======================================================

materias.forEach(function (materia) {

    if (
        materia.pesoUnidade === undefined ||
        materia.pesoUnidade === null
    ) {
        materia.pesoUnidade =
            materia.peso ||
            materia.pesoPorUnidade ||
            0;
    }

    if (!materia.unidadePeso) {
        materia.unidadePeso =
            materia.unidadeDePeso ||
            "g";
    }

    /*
     * Compatibilidade:
     *
     * Se já existir tipoControle, mantém.
     *
     * Se não existir:
     * - matéria com peso cadastrado => peso
     * - matéria sem peso => unidade
     *
     * Isso não altera o conteúdo do banco.
     */

    if (!materia.tipoControle) {

        if (
            Number(materia.pesoUnidade || 0) > 0
        ) {
            materia.tipoControle = "peso";
        } else {
            materia.tipoControle = "unidade";
        }

    }

});


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
// FUNÇÕES DE PESO
// ======================================================

function obterPesoMateria(materia) {

    return Number(
        materia.pesoUnidade ||
        materia.peso ||
        materia.pesoPorUnidade ||
        0
    );

}


function obterUnidadePesoMateria(materia) {

    return (
        materia.unidadePeso ||
        materia.unidadeDePeso ||
        "g"
    );

}


// ======================================================
// CONVERTER QUALQUER PESO PARA GRAMAS
// ======================================================

function converterParaGramas(valor, unidade) {

    const numero = Number(valor || 0);

    const u =
        String(unidade || "g")
            .toLowerCase()
            .trim();

    if (u === "kg" || u === "quilo" || u === "quilos") {
        return numero * 1000;
    }

    if (
        u === "mg" ||
        u === "miligrama" ||
        u === "miligramas"
    ) {
        return numero / 1000;
    }

    return numero;
}


// ======================================================
// FORMATAR PESO
// ======================================================

function formatarPeso(valor, unidade) {

    const numero = Number(valor || 0);

    if (!numero) {
        return "—";
    }

    return (
        numero.toLocaleString(
            "pt-BR",
            {
                maximumFractionDigits: 3
            }
        ) +
        " " +
        (unidade || "g")
    );
}


// ======================================================
// TIPO DE CONTROLE
// unidade = ovos, bananas, etc.
// peso    = manteiga, chocolate, leite condensado etc.
// ======================================================

function obterTipoControleMateria(materia) {

    const tipo =
        String(
            materia.tipoControle ||
            materia.tipoControleEstoque ||
            materia.tipo ||
            ""
        )
        .toLowerCase()
        .trim();

    if (
        tipo === "peso" ||
        tipo === "grama" ||
        tipo === "gramas" ||
        tipo === "kg" ||
        tipo === "g"
    ) {
        return "peso";
    }

    if (
        tipo === "unidade" ||
        tipo === "unidades" ||
        tipo === "un"
    ) {
        return "unidade";
    }

    /*
     * Compatibilidade com registros antigos.
     */
    if (
        Number(
            materia.pesoUnidade ||
            materia.peso ||
            materia.pesoPorUnidade ||
            0
        ) > 0
    ) {
        return "peso";
    }

    return "unidade";
}


// ======================================================
// UNIDADE USADA NA RECEITA
// ======================================================

function obterUnidadeReceitaMateria(materia) {

    const tipo =
        obterTipoControleMateria(materia);

    if (tipo === "peso") {
        return "g";
    }

    return "un";
}


// ======================================================
// PESO TOTAL DA MATÉRIA-PRIMA
// ======================================================

function calcularPesoTotalMateria(materia) {

    const unidades =
        Number(
            materia.estoque || 0
        );

    const peso =
        converterParaGramas(
            obterPesoMateria(materia),
            obterUnidadePesoMateria(materia)
        );

    return unidades * peso;
}


// ======================================================
// CUSTO POR GRAMA
// ======================================================

function calcularCustoPorGrama(materia) {

    const tipo =
        obterTipoControleMateria(materia);

    if (tipo !== "peso") {
        return 0;
    }

    const pesoGramas =
        converterParaGramas(
            obterPesoMateria(materia),
            obterUnidadePesoMateria(materia)
        );

    const custo =
        Number(
            materia.custo || 0
        );

    if (
        pesoGramas <= 0 ||
        custo < 0
    ) {
        return 0;
    }

    return custo / pesoGramas;
}


// ======================================================
// CALCULAR CUSTO DE UMA QUANTIDADE DA MATÉRIA-PRIMA
// ======================================================

function calcularCustoQuantidadeMateria(
    materia,
    quantidade
) {

    if (!materia) {
        return 0;
    }

    const qtd =
        Number(
            quantidade || 0
        );

    if (qtd <= 0) {
        return 0;
    }

    const tipo =
        obterTipoControleMateria(materia);


    // --------------------------------------------------
    // MATÉRIA-PRIMA POR UNIDADE
    // --------------------------------------------------

    if (tipo === "unidade") {

        return (
            qtd *
            Number(
                materia.custo || 0
            )
        );

    }


    // --------------------------------------------------
    // MATÉRIA-PRIMA POR PESO
    //
    // Exemplo:
    //
    // manteiga:
    // 200 g = R$ 11,98
    //
    // receita:
    // 300 g
    //
    // custo por grama:
    // 11,98 / 200 = 0,0599
    //
    // custo:
    // 300 * 0,0599 = R$ 17,97
    // --------------------------------------------------

    const pesoEmGramas =
        converterParaGramas(
            obterPesoMateria(materia),
            obterUnidadePesoMateria(materia)
        );

    const custoEmbalagem =
        Number(
            materia.custo || 0
        );

    if (
        pesoEmGramas <= 0
    ) {

        return 0;

    }

    return (
        qtd *
        (
            custoEmbalagem /
            pesoEmGramas
        )
    );
}


// ======================================================
// MENU LATERAL
// ======================================================

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


// ======================================================
// TROCAR ABA
// ======================================================

function mostrarAba(id, botao) {

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
        document.getElementById(id);

    if (abaSelecionada) {

        abaSelecionada.classList.add(
            "ativa"
        );

    }


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


    // --------------------------------------------------
    // ATUALIZAR ABA
    // --------------------------------------------------

    if (id === "produtos") {
        carregarProdutos();
    }


    if (
        id === "materia-prima" ||
        id === "materias-primas"
    ) {

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
            new Date().toLocaleDateString(
                "pt-BR"
            );

    }

}


// ======================================================
// PRODUTOS
// ======================================================

function gerarCodigoProduto() {

    let maiorNumero = 0;

    produtos.forEach(
        function (produto) {

            const codigo =
                String(
                    produto.codigo || ""
                );

            const numero =
                parseInt(
                    codigo.replace(
                        "PROD-",
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
        "PROD-" +
        String(
            maiorNumero + 1
        ).padStart(4, "0")
    );

}


function gerarEAN13() {

    let numero = "";

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        numero +=
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

        const digito =
            Number(
                numero[i]
            );

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


function atualizarBotaoProduto() {

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

        }
    );

}


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
            )?.value ||
            "Ativo",

        estoque: 0,

        custo: 0,

        precoVenda: 0,

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    };


    produtos.push(
        produto
    );


    salvarBanco();

    carregarProdutos();

    atualizarDashboard();

    carregarProdutosReceita();

    novoProduto();


    alert(
        "Produto salvo com sucesso!"
    );

}


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

                <td>${produto.codigo || ""}</td>

                <td>${produto.nome || ""}</td>

                <td>${produto.ean || ""}</td>

                <td>${produto.categoria || ""}</td>

                <td>${produto.unidade || ""}</td>

                <td>${estoque}</td>

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


            tabela.appendChild(
                linha
            );

        }
    );

}


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
        produto.status ||
        "Ativo";


    window.produtoEditando =
        index;


    atualizarBotaoProduto();

}


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
        )?.value ||
        "Ativo";


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


// ======================================================
// CAMPO TIPO DE CONTROLE
// ======================================================

function obterCampoTipoControleMP() {

    return (
        document.getElementById(
            "tipoControleMP"
        ) ||
        document.getElementById(
            "tipoMP"
        ) ||
        document.getElementById(
            "controleMP"
        )
    );

}


// ======================================================
// NOVA MATÉRIA-PRIMA
// ======================================================

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


    const peso =
        obterCampoPesoMP();

    if (peso) {
        peso.value = "";
    }


    const unidadePeso =
        document.getElementById(
            "unidadePesoMP"
        );

    if (unidadePeso) {
        unidadePeso.value = "g";
    }


    const tipoControle =
        obterCampoTipoControleMP();

    if (tipoControle) {
        tipoControle.value =
            "unidade";
    }


    atualizarBotaoMateriaPrima();

}


// ======================================================
// BOTÃO MATÉRIA-PRIMA
// ======================================================

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
                texto === "salvar matéria-prima" ||
                texto === "salvar materia-prima" ||
                texto === "atualizar matéria-prima" ||
                texto === "atualizar materia-prima"
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


// ======================================================
// PEGAR CAMPO DE PESO
// ======================================================

function obterCampoPesoMP() {

    return (
        document.getElementById(
            "pesoMP"
        ) ||
        document.getElementById(
            "pesoUnidadeMP"
        ) ||
        document.getElementById(
            "pesoPorUnidadeMP"
        )
    );

}


// ======================================================
// CAMPO UNIDADE DE PESO
// ======================================================

function obterCampoUnidadePesoMP() {

    return document.getElementById(
        "unidadePesoMP"
    );

}


// ======================================================
// SALVAR MATÉRIA-PRIMA
// ======================================================

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


    const campoPeso =
        obterCampoPesoMP();


    const campoUnidadePeso =
        obterCampoUnidadePesoMP();


    const campoTipoControle =
        obterCampoTipoControleMP();


    let tipoControle =
        campoTipoControle?.value ||
        "";


    /*
     * Se o HTML ainda não tiver o campo
     * tipoControleMP, tentamos manter
     * compatibilidade.
     */

    if (!tipoControle) {

        if (
            Number(
                campoPeso?.value || 0
            ) > 0
        ) {

            tipoControle = "peso";

        } else {

            tipoControle = "unidade";

        }

    }


    tipoControle =
        String(
            tipoControle
        )
        .toLowerCase();


    if (
        tipoControle !== "peso" &&
        tipoControle !== "unidade"
    ) {

        tipoControle =
            "unidade";

    }


    const pesoUnidade =
        Number(
            campoPeso?.value || 0
        );


    const unidadePeso =
        campoUnidadePeso?.value ||
        "g";


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


    if (pesoUnidade < 0) {

        alert(
            "O peso não pode ser negativo."
        );

        return;

    }


    /*
     * IMPORTANTE:
     *
     * Peso só é obrigatório quando
     * a matéria-prima é controlada por peso.
     */

    if (
        tipoControle === "peso" &&
        pesoUnidade <= 0
    ) {

        alert(
            "Para uma matéria-prima controlada por peso, informe o peso da embalagem em gramas."
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
            estoque,

        custo:
            custo,

        tipoControle:
            tipoControle,

        pesoUnidade:
            pesoUnidade,

        unidadePeso:
            unidadePeso,

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    };


    materias.push(
        materia
    );


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


// ======================================================
// CARREGAR MATÉRIAS
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


            const pesoUnidade =
                obterPesoMateria(
                    materia
                );


            const unidadePeso =
                obterUnidadePesoMateria(
                    materia
                );


            const tipoControle =
                obterTipoControleMateria(
                    materia
                );


            const pesoTotal =
                calcularPesoTotalMateria(
                    materia
                );


            const custoTotal =
                tipoControle === "peso"
                    ? (
                        estoque *
                        custo
                    )
                    : (
                        estoque *
                        custo
                    );


            const custoPorGrama =
                calcularCustoPorGrama(
                    materia
                );


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>

                    <strong>
                        ${materia.nome || ""}
                    </strong>

                    <small
                        style="
                            display:block;
                            opacity:.65;
                            margin-top:3px;
                        "
                    >
                        ${materia.codigo || ""}
                    </small>

                </td>


                <td>

                    ${estoque}

                    ${
                        tipoControle === "peso"
                            ? " embalagem(ns)"
                            : " un"
                    }

                </td>


                <td>

                    ${
                        tipoControle === "peso"
                            ? formatarPeso(
                                pesoUnidade,
                                unidadePeso
                            )
                            : (
                                pesoUnidade > 0
                                    ? formatarPeso(
                                        pesoUnidade,
                                        unidadePeso
                                    )
                                    : "—"
                            )
                    }

                </td>


                <td>

                    ${
                        tipoControle === "peso"
                            ? formatarPeso(
                                pesoTotal,
                                "g"
                            )
                            : (
                                pesoTotal > 0
                                    ? formatarPeso(
                                        pesoTotal,
                                        "g"
                                    )
                                    : "—"
                            )
                    }

                </td>


                <td>

                    ${
                        tipoControle === "peso"
                            ? "R$ " +
                              custo.toFixed(2) +
                              " / embalagem"
                            : "R$ " +
                              custo.toFixed(2) +
                              " / un"
                    }

                </td>


                <td>

                    R$ ${custoTotal.toFixed(2)}

                    ${
                        tipoControle === "peso" &&
                        custoPorGrama > 0
                            ? `
                                <small
                                    style="
                                        display:block;
                                        opacity:.65;
                                    "
                                >
                                    R$ ${custoPorGrama.toFixed(4)}/g
                                </small>
                              `
                            : ""
                    }

                </td>


                <td>

                    <button
                        type="button"
                        onclick="editarMateriaPrima(${index})"
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        type="button"
                        onclick="excluirMateriaPrima(${index})"
                        title="Excluir"
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

    if (codigo) {
        codigo.value =
            materia.codigo || "";
    }


    const nome =
        document.getElementById(
            "nomeMP"
        );

    if (nome) {
        nome.value =
            materia.nome || "";
    }


    const categoria =
        document.getElementById(
            "categoriaMP"
        );

    if (categoria) {
        categoria.value =
            materia.categoria || "";
    }


    const unidade =
        document.getElementById(
            "unidadeMP"
        );

    if (unidade) {
        unidade.value =
            materia.unidade || "";
    }


    const estoque =
        document.getElementById(
            "estoqueMP"
        );

    if (estoque) {
        estoque.value =
            Number(
                materia.estoque || 0
            );
    }


    const custo =
        document.getElementById(
            "custoMP"
        );

    if (custo) {
        custo.value =
            Number(
                materia.custo || 0
            );
    }


    const campoPeso =
        obterCampoPesoMP();

    if (campoPeso) {

        campoPeso.value =
            obterPesoMateria(
                materia
            );

    }


    const campoUnidadePeso =
        obterCampoUnidadePesoMP();

    if (campoUnidadePeso) {

        campoUnidadePeso.value =
            obterUnidadePesoMateria(
                materia
            );

    }


    const campoTipoControle =
        obterCampoTipoControleMP();

    if (campoTipoControle) {

        campoTipoControle.value =
            obterTipoControleMateria(
                materia
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


    const campoPeso =
        obterCampoPesoMP();


    const campoUnidadePeso =
        obterCampoUnidadePesoMP();


    const campoTipoControle =
        obterCampoTipoControleMP();


    let novoPeso =
        Number(
            campoPeso?.value || 0
        );


    const novaUnidadePeso =
        campoUnidadePeso?.value ||
        "g";


    let novoTipoControle =
        campoTipoControle?.value ||
        materia.tipoControle ||
        "";


    if (!novoTipoControle) {

        novoTipoControle =
            novoPeso > 0
                ? "peso"
                : "unidade";

    }


    novoTipoControle =
        String(
            novoTipoControle
        )
        .toLowerCase();


    if (
        novoTipoControle !== "peso" &&
        novoTipoControle !== "unidade"
    ) {

        novoTipoControle =
            "unidade";

    }


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


    if (novoPeso < 0) {

        alert(
            "O peso não pode ser negativo."
        );

        return;

    }


    if (
        novoTipoControle === "peso" &&
        novoPeso <= 0
    ) {

        alert(
            "Para uma matéria-prima controlada por peso, informe o peso da embalagem."
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


    materia.tipoControle =
        novoTipoControle;


    materia.pesoUnidade =
        novoPeso;


    materia.unidadePeso =
        novaUnidadePeso;


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


// ======================================================
// EXCLUIR MATÉRIA-PRIMA
// ======================================================

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

        tipoControle:
            obterTipoControleMateria(
                materia
            ),

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

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
// ======================================================

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
                materia.nome +
                (
                    obterTipoControleMateria(
                        materia
                    ) === "peso"
                        ? " — g"
                        : " — un"
                );


            select.appendChild(
                option
            );

        }
    );

}


// ======================================================
// ATUALIZAR INFORMAÇÃO DA QUANTIDADE DA RECEITA
// ======================================================

function atualizarUnidadeQuantidadeReceita() {

    const select =
        document.getElementById(
            "materiaReceita"
        );


    const quantidade =
        document.getElementById(
            "quantidadeReceita"
        );


    if (!select || !quantidade) {
        return;
    }


    const materia =
        materias.find(
            function (item) {

                return (
                    item.codigo ===
                    select.value
                );

            }
        );


    if (!materia) {

        quantidade.placeholder =
            "Quantidade utilizada";

        return;

    }


    const tipo =
        obterTipoControleMateria(
            materia
        );


    if (tipo === "peso") {

        quantidade.placeholder =
            "Quantidade em gramas";

        quantidade.title =
            "Digite a quantidade utilizada em gramas.";

    } else {

        quantidade.placeholder =
            "Quantidade em unidades";

        quantidade.title =
            "Digite a quantidade utilizada em unidades.";

    }

}


// ======================================================
// NOVA RECEITA
// ======================================================

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


// ======================================================
// ADICIONAR INGREDIENTE
// ======================================================

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


    const tipo =
        obterTipoControleMateria(
            materia
        );


    /*
     * SOMENTE matéria-prima por peso
     * precisa ter peso da embalagem.
     */

    if (
        tipo === "peso" &&
        converterParaGramas(
            obterPesoMateria(materia),
            obterUnidadePesoMateria(materia)
        ) <= 0
    ) {

        alert(
            "Essa matéria-prima está configurada por peso, mas não possui o peso da embalagem cadastrado. Edite a matéria-prima e informe o peso."
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

        existente.quantidade =
            Number(
                existente.quantidade || 0
            ) +
            quantidade;

    } else {

        ingredientesReceita.push({

            codigo:
                materia.codigo,

            nome:
                materia.nome,

            tipoControle:
                tipo,

            unidadeReceita:
                obterUnidadeReceitaMateria(
                    materia
                ),

            unidade:
                obterUnidadeReceitaMateria(
                    materia
                ),

            quantidade:
                quantidade,

            custo:
                Number(
                    materia.custo || 0
                ),

            pesoUnidade:
                obterPesoMateria(
                    materia
                ),

            unidadePeso:
                obterUnidadePesoMateria(
                    materia
                )

        });

    }


    quantidadeInput.value = "";

    materiaSelect.value = "";


    atualizarUnidadeQuantidadeReceita();

    atualizarTabelaReceita();

    calcularCustoReceita();

}


// ======================================================
// TABELA DE INGREDIENTES
// ======================================================

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


            const tipo =
                item.tipoControle ||
                (
                    Number(
                        item.pesoUnidade || 0
                    ) > 0
                        ? "peso"
                        : "unidade"
                );


            const unidade =
                tipo === "peso"
                    ? "g"
                    : "un";


            const materiaAtual =
                materias.find(
                    function (materia) {

                        return (
                            materia.codigo ===
                            item.codigo
                        );

                    }
                );


            let custoTotal = 0;


            if (materiaAtual) {

                custoTotal =
                    calcularCustoQuantidadeMateria(
                        materiaAtual,
                        quantidade
                    );

            } else {

                /*
                 * Compatibilidade com receitas
                 * antigas que já estão salvas.
                 */

                if (
                    tipo === "peso" &&
                    Number(
                        item.pesoUnidade || 0
                    ) > 0
                ) {

                    const pesoGramas =
                        converterParaGramas(
                            item.pesoUnidade,
                            item.unidadePeso || "g"
                        );

                    custoTotal =
                        quantidade *
                        (
                            Number(
                                item.custo || 0
                            ) /
                            pesoGramas
                        );

                } else {

                    custoTotal =
                        quantidade *
                        Number(
                            item.custo || 0
                        );

                }

            }


            let custoUnitarioExibido = 0;


            if (
                tipo === "peso" &&
                materiaAtual
            ) {

                custoUnitarioExibido =
                    calcularCustoPorGrama(
                        materiaAtual
                    );

            } else if (
                tipo === "peso" &&
                Number(
                    item.pesoUnidade || 0
                ) > 0
            ) {

                custoUnitarioExibido =
                    Number(
                        item.custo || 0
                    ) /
                    converterParaGramas(
                        item.pesoUnidade,
                        item.unidadePeso || "g"
                    );

            } else {

                custoUnitarioExibido =
                    Number(
                        item.custo || 0
                    );

            }


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
                    ${unidade}
                </td>


                <td>
                    ${
                        tipo === "peso"
                            ? "R$ " +
                              custoUnitarioExibido.toFixed(4) +
                              " / g"
                            : "R$ " +
                              custoUnitarioExibido.toFixed(2) +
                              " / un"
                    }
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
        index >=
        ingredientesReceita.length
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


// ======================================================
// CALCULAR CUSTO DA RECEITA
// ======================================================

function calcularCustoReceita() {

    let custoIngredientes = 0;


    ingredientesReceita.forEach(
        function (item) {

            const quantidade =
                Number(
                    item.quantidade || 0
                );


            if (quantidade <= 0) {
                return;
            }


            const materia =
                materias.find(
                    function (materia) {

                        return (
                            materia.codigo ===
                            item.codigo
                        );

                    }
                );


            if (materia) {

                custoIngredientes +=
                    calcularCustoQuantidadeMateria(
                        materia,
                        quantidade
                    );

                return;

            }


            /*
             * Compatibilidade com receitas
             * antigas.
             */

            const tipo =
                item.tipoControle ||
                (
                    Number(
                        item.pesoUnidade || 0
                    ) > 0
                        ? "peso"
                        : "unidade"
                );


            if (
                tipo === "peso" &&
                Number(
                    item.pesoUnidade || 0
                ) > 0
            ) {

                const pesoGramas =
                    converterParaGramas(
                        item.pesoUnidade,
                        item.unidadePeso || "g"
                    );


                if (pesoGramas > 0) {

                    custoIngredientes +=
                        quantidade *
                        (
                            Number(
                                item.custo || 0
                            ) /
                            pesoGramas
                        );

                }

            } else {

                custoIngredientes +=
                    quantidade *
                    Number(
                        item.custo || 0
                    );

            }

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


// ======================================================
// SALVAR RECEITA
// ======================================================

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
        ingredientesReceita.length ===
        0
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


    /*
     * Atualizar os dados dos ingredientes
     * antes de salvar.
     */

    const ingredientesParaSalvar =
        ingredientesReceita.map(
            function (item) {

                const materia =
                    materias.find(
                        function (m) {

                            return (
                                m.codigo ===
                                item.codigo
                            );

                        }
                    );


                if (!materia) {
                    return item;
                }


                return {

                    codigo:
                        materia.codigo,

                    nome:
                        materia.nome,

                    tipoControle:
                        obterTipoControleMateria(
                            materia
                        ),

                    unidadeReceita:
                        obterUnidadeReceitaMateria(
                            materia
                        ),

                    unidade:
                        obterUnidadeReceitaMateria(
                            materia
                        ),

                    quantidade:
                        Number(
                            item.quantidade || 0
                        ),

                    custo:
                        Number(
                            materia.custo || 0
                        ),

                    pesoUnidade:
                        obterPesoMateria(
                            materia
                        ),

                    unidadePeso:
                        obterUnidadePesoMateria(
                            materia
                        )

                };

            }
        );


    const dadosReceita = {

        codigoProduto:
            codigoProduto,

        produto:
            produto.nome,

        ingredientes:
            ingredientesParaSalvar,

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
            new Date().toLocaleString(
                "pt-BR"
            )

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


// ======================================================
// EDITAR RECEITA
// ======================================================

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
            receita.rendimento ||
            1;

    }


    const embalagem =
        document.getElementById(
            "custoEmbalagem"
        );


    if (embalagem) {

        embalagem.value =
            receita.custoEmbalagem ||
            0;

    }


    const outros =
        document.getElementById(
            "outrosCustos"
        );


    if (outros) {

        outros.value =
            receita.outrosCustos ||
            0;

    }


    const margem =
        document.getElementById(
            "margemLucro"
        );


    if (margem) {

        margem.value =
            receita.margemLucro ||
            0;

    }


    ingredientesReceita =
        JSON.parse(
            JSON.stringify(
                receita.ingredientes ||
                []
            )
        );


    /*
     * Atualizar receitas antigas com
     * informações atuais da matéria-prima.
     */

    ingredientesReceita =
        ingredientesReceita.map(
            function (item) {

                const materia =
                    materias.find(
                        function (m) {

                            return (
                                m.codigo ===
                                item.codigo
                            );

                        }
                    );


                if (!materia) {
                    return item;
                }


                return {

                    ...item,

                    tipoControle:
                        obterTipoControleMateria(
                            materia
                        ),

                    unidadeReceita:
                        obterUnidadeReceitaMateria(
                            materia
                        ),

                    unidade:
                        obterUnidadeReceitaMateria(
                            materia
                        ),

                    custo:
                        Number(
                            materia.custo || 0
                        ),

                    pesoUnidade:
                        obterPesoMateria(
                            materia
                        ),

                    unidadePeso:
                        obterUnidadePesoMateria(
                            materia
                        )

                };

            }
        );


    window.receitaEditando =
        codigoProduto;


    atualizarTabelaReceita();

    calcularCustoReceita();

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
        function (receita) {

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
                        receita.custoUnitario ||
                        0
                    ).toFixed(2)}
                </td>

                <td>
                    ${Number(
                        receita.margemLucro ||
                        0
                    ).toFixed(2)}%
                </td>

                <td>

                    <strong>
                        R$ ${Number(
                            receita.valorVenda ||
                            0
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
// COMPATIBILIDADE
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

    /*
     * NÃO APAGA BANCO.
     */

    carregarProdutos();

    carregarMaterias();

    atualizarItensMovimentacao();

    carregarProdutosReceita();

    carregarMateriasReceita();

    carregarListaReceitas();

    atualizarTabelaReceita();

    atualizarDashboard();

    atualizarUnidadeQuantidadeReceita();

}


// ======================================================
// EVENTO LOAD
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
// QUANDO TROCAR MATÉRIA-PRIMA
// ======================================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.id ===
            "materiaReceita"
        ) {

            atualizarUnidadeQuantidadeReceita();

        }


        if (
            event.target.id ===
            "tipoControleMP"
        ) {

            atualizarInterfaceTipoMateria();

        }

    }
);


// ======================================================
// ATUALIZAR INTERFACE DO TIPO DE MATÉRIA
// ======================================================

function atualizarInterfaceTipoMateria() {

    const campoTipo =
        obterCampoTipoControleMP();


    if (!campoTipo) {
        return;
    }


    const campoPeso =
        obterCampoPesoMP();


    const tipo =
        String(
            campoTipo.value || "unidade"
        )
        .toLowerCase();


    if (campoPeso) {

        if (tipo === "peso") {

            campoPeso.placeholder =
                "Peso da embalagem em gramas";

            campoPeso.title =
                "Exemplo: embalagem de 200 g";

        } else {

            campoPeso.placeholder =
                "Peso por unidade (opcional)";

            campoPeso.title =
                "Opcional. Exemplo: 1 ovo = 50 g";

        }

    }

}


// ======================================================
// GARANTIR FUNÇÕES GLOBAIS
// COMPATÍVEL COM ONCLICK DO HTML
// ======================================================

window.toggleMenu =
    toggleMenu;

window.mostrarAba =
    mostrarAba;

window.novoProduto =
    novoProduto;

window.salvarProduto =
    salvarProduto;

window.editarProduto =
    editarProduto;

window.atualizarProduto =
    atualizarProduto;

window.excluirProduto =
    excluirProduto;

window.novaMateriaPrima =
    novaMateriaPrima;

window.salvarMateriaPrima =
    salvarMateriaPrima;

window.editarMateriaPrima =
    editarMateriaPrima;

window.atualizarMateriaPrima =
    atualizarMateriaPrima;

window.excluirMateriaPrima =
    excluirMateriaPrima;

window.registrarMovimentacao =
    registrarMovimentacao;

window.novaReceita =
    novaReceita;

window.adicionarIngrediente =
    adicionarIngrediente;

window.removerIngrediente =
    removerIngrediente;

window.salvarReceita =
    salvarReceita;

window.editarReceita =
    editarReceita;

window.calcularReceita =
    calcularReceita;

window.finalizarReceita =
    finalizarReceita;

window.calcularCustoReceita =
    calcularCustoReceita;

window.carregarMaterias =
    carregarMaterias;

window.carregarProdutos =
    carregarProdutos;

window.atualizarInterfaceTipoMateria =
    atualizarInterfaceTipoMateria;


// ======================================================
// FIM DO APP.JS
// ======================================================
