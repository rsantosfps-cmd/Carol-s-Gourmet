"use strict";

/* =====================================================
   CAROL'S GOURMET ERP 4.0
   APP.JS LIMPO E CONSOLIDADO
===================================================== */

/* =====================================================
   BANCO LOCAL
===================================================== */

let produtos = [];
let materiasPrimas = [];
let movimentacoes = [];
let producoes = [];
let precificacoes = [];

let produtoEditando = -1;
let materiaPrimaEditando = -1;

/* =====================================================
   HELPERS
===================================================== */

function garantirArray(valor) {
    return Array.isArray(valor) ? valor : [];
}

function formatarNumero(valor) {
    const numero = Number(valor) || 0;
    return numero.toFixed(2).replace(".", ",");
}

function formatarMoeda(valor) {
    return "R$ " + formatarNumero(valor);
}

function hojeISO() {
    return new Date().toISOString().split("T")[0];
}

function somarDias(dataISO, dias) {
    const data = new Date(dataISO + "T00:00:00");
    if (isNaN(data.getTime())) {
        return "";
    }
    data.setDate(data.getDate() + dias);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const partes = String(dataISO).split("-");
    if (partes.length !== 3) return String(dataISO);
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function calcularDigitoEAN(base12) {
    let soma = 0;
    for (let i = 0; i < 12; i++) {
        const n = Number(base12[i]) || 0;
        soma += (i % 2 === 0) ? n : n * 3;
    }
    return (10 - (soma % 10)) % 10;
}

function obterMaiorSequenciaEAN() {
    let maior = 0;
    garantirArray(produtos).forEach(function (produto) {
        const codigo = String(produto.codigoBarras || "").replace(/\D/g, "");
        if (codigo.length === 13 && codigo.startsWith("789")) {
            const seq = Number(codigo.slice(3, 12));
            if (Number.isFinite(seq) && seq > maior) maior = seq;
        }
    });
    return maior;
}

function gerarEAN() {
    let sequencia = obterMaiorSequenciaEAN() + 1;
    let codigo13 = "";

    do {
        const base12 = "789" + String(sequencia).padStart(9, "0");
        const digito = calcularDigitoEAN(base12);
        codigo13 = base12 + String(digito);
        sequencia += 1;
    } while (garantirArray(produtos).some(function (p) {
        return String(p.codigoBarras || "") === codigo13;
    }));

    return codigo13;
}

function obterMaiorCodigoProduto() {
    let maior = 0;
    garantirArray(produtos).forEach(function (produto) {
        const codigo = String(produto.codigo || "").trim();
        const match = codigo.match(/^P(\d+)$/i);
        if (match) {
            const n = Number(match[1]);
            if (Number.isFinite(n) && n > maior) maior = n;
        }
    });
    return maior;
}

function gerarCodigoProduto() {
    const proximo = obterMaiorCodigoProduto() + 1;
    return "P" + String(proximo).padStart(4, "0");
}

/* =====================================================
   LOCAL STORAGE
===================================================== */

function carregarBanco() {
    produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    materiasPrimas = JSON.parse(localStorage.getItem("materiasPrimas")) || [];
    movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
    producoes = JSON.parse(localStorage.getItem("producoes")) || [];
    precificacoes = JSON.parse(localStorage.getItem("precificacoes")) || [];
}

function salvarBanco() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
    localStorage.setItem("materiasPrimas", JSON.stringify(materiasPrimas));
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
    localStorage.setItem("producoes", JSON.stringify(producoes));
    localStorage.setItem("precificacoes", JSON.stringify(precificacoes));
}

/* =====================================================
   MENU MOBILE E ABAS
===================================================== */

function toggleMenu() {
    const menu = document.getElementById("menuLateral");
    if (menu) {
        menu.classList.toggle("open");
    }
}

function mostrarAba(id, botao) {
    document.querySelectorAll(".aba").forEach(function (item) {
        item.classList.remove("ativa");
    });

    const pagina = document.getElementById(id);
    if (pagina) {
        pagina.classList.add("ativa");
    }

    document.querySelectorAll(".menu-item").forEach(function (item) {
        item.classList.remove("ativo");
    });

    if (botao) {
        botao.classList.add("ativo");
    }

    const menu = document.getElementById("menuLateral");
    if (menu) {
        menu.classList.remove("open");
    }
}

/* =====================================================
   DASHBOARD
===================================================== */

function atualizarDashboard() {
    const total = document.getElementById("totalProdutos");
    if (total) {
        total.textContent = String(garantirArray(produtos).length);
    }

    const data = document.getElementById("ultimaAtualizacao");
    if (data) {
        data.textContent = new Date().toLocaleString("pt-BR");
    }
}

/* =====================================================
   DATAS AUTOMÁTICAS
===================================================== */

function configurarDatas() {
    const hoje = hojeISO();
    const campos = [
        "dataEstoque",
        "dataMovimentacao",
        "fabricacaoProducao",
        "fabricacaoEtiqueta"
    ];

    campos.forEach(function (id) {
        const campo = document.getElementById(id);
        if (campo && !campo.value) {
            campo.value = hoje;
        }
    });
}

/* =====================================================
   BACKUP
===================================================== */

function exportarBackup() {
    const dados = {
        produtos,
        materiasPrimas,
        movimentacoes,
        producoes,
        precificacoes
    };

    const arquivo = JSON.stringify(dados, null, 2);
    const blob = new Blob([arquivo], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "backup-carols-gourmet.json";
    link.click();
}

function importarBackup() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", function () {
        const file = input.files && input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function () {
            try {
                const dados = JSON.parse(String(reader.result || "{}"));
                produtos = garantirArray(dados.produtos);
                materiasPrimas = garantirArray(dados.materiasPrimas);
                movimentacoes = garantirArray(dados.movimentacoes);
                producoes = garantirArray(dados.producoes);
                precificacoes = garantirArray(dados.precificacoes);
                salvarBanco();
                inicializarTudo();
                alert("Backup restaurado com sucesso.");
            } catch (erro) {
                console.error(erro);
                alert("Arquivo de backup inválido.");
            }
        };
        reader.readAsText(file);
    });

    input.click();
}

/* =====================================================
   PRODUTOS
===================================================== */

function novoProduto() {
    produtoEditando = -1;

    const codigoCampo = document.getElementById("codigoProduto");
    const eanCampo = document.getElementById("eanProduto");
    const nomeCampo = document.getElementById("nomeProduto");
    const categoriaCampo = document.getElementById("categoriaProduto");
    const unidadeCampo = document.getElementById("unidadeProduto");
    const statusCampo = document.getElementById("statusProduto");

    if (codigoCampo) codigoCampo.value = gerarCodigoProduto();
    if (eanCampo) eanCampo.value = gerarEAN();
    if (nomeCampo) nomeCampo.value = "";
    if (categoriaCampo) categoriaCampo.value = "";
    if (unidadeCampo) unidadeCampo.value = "Unidade";
    if (statusCampo) statusCampo.value = "Ativo";
}

function salvarProduto() {
    const codigoCampo = document.getElementById("codigoProduto");
    const eanCampo = document.getElementById("eanProduto");
    const nomeCampo = document.getElementById("nomeProduto");
    const categoriaCampo = document.getElementById("categoriaProduto");
    const unidadeCampo = document.getElementById("unidadeProduto");
    const statusCampo = document.getElementById("statusProduto");

    if (!codigoCampo || !eanCampo || !nomeCampo || !categoriaCampo || !unidadeCampo || !statusCampo) {
        alert("Não foi possível localizar os campos do cadastro de produto.");
        return;
    }

    const codigo = String(codigoCampo.value || "").trim();
    const codigoBarras = String(eanCampo.value || "").trim();
    const nome = String(nomeCampo.value || "").trim();
    const categoria = categoriaCampo.value;
    const unidade = unidadeCampo.value;
    const status = statusCampo.value;

    if (!nome) {
        alert("Informe o nome do produto.");
        nomeCampo.focus();
        return;
    }

    if (!Array.isArray(produtos)) produtos = [];
    if (typeof produtoEditando !== "number") produtoEditando = -1;

    const produto = {
        codigo: codigo || gerarCodigoProduto(),
        codigoBarras: codigoBarras || gerarEAN(),
        nome: nome,
        categoria: categoria,
        unidade: unidade,
        status: status,
        estoque: 0,
        custo: 0,
        precoVenda: 0
    };

    if (produtoEditando === -1) {
        produtos.push(produto);
    } else {
        const produtoAtual = produtos[produtoEditando];
        if (!produtoAtual) {
            alert("Produto não encontrado para edição.");
            produtoEditando = -1;
            return;
        }

        produtoAtual.codigo = produto.codigo;
        produtoAtual.codigoBarras = produto.codigoBarras;
        produtoAtual.nome = produto.nome;
        produtoAtual.categoria = produto.categoria;
        produtoAtual.unidade = produto.unidade;
        produtoAtual.status = produto.status;
        if (produtoAtual.estoque === undefined) produtoAtual.estoque = 0;
        if (produtoAtual.custo === undefined) produtoAtual.custo = 0;
        if (produtoAtual.precoVenda === undefined) produtoAtual.precoVenda = 0;
    }

    salvarBanco();
    mostrarProdutos();
    atualizarDashboard();
    mostrarEstoque();

    if (typeof atualizarModuloProducao === "function") {
        atualizarModuloProducao();
    }
    if (typeof atualizarModuloEtiquetas === "function") {
        atualizarModuloEtiquetas();
    }
    if (typeof atualizarItensMovimentacao === "function") {
        atualizarItensMovimentacao();
    }

    alert("Produto salvo com sucesso.");
    novoProduto();
}

function mostrarProdutos() {
    const tabela = document.getElementById("listaProdutos");
    if (!tabela) return;

    tabela.innerHTML = "";

    if (!Array.isArray(produtos) || produtos.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    produtos.forEach(function (produto, indice) {
        const estoque = Number(produto.estoque) || 0;
        const custo = Number(produto.custo) || 0;
        const valorTotal = estoque * custo;

        tabela.innerHTML += `
            <tr>
                <td>${produto.codigo || ""}</td>
                <td>${produto.nome || ""}</td>
                <td>${produto.categoria || ""}</td>
                <td>${produto.unidade || ""}</td>
                <td>${estoque}</td>
                <td>${formatarMoeda(custo)}</td>
                <td>${formatarMoeda(valorTotal)}</td>
                <td>
                    <button type="button" class="btn btn-edit" onclick="editarProduto(${indice})">✏️</button>
                    <button type="button" class="btn btn-delete" onclick="excluirProduto(${indice})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

function editarProduto(indice) {
    if (!Array.isArray(produtos) || !produtos[indice]) {
        alert("Produto não encontrado.");
        return;
    }

    const produto = produtos[indice];
    produtoEditando = indice;

    const codigoCampo = document.getElementById("codigoProduto");
    const eanCampo = document.getElementById("eanProduto");
    const nomeCampo = document.getElementById("nomeProduto");
    const categoriaCampo = document.getElementById("categoriaProduto");
    const unidadeCampo = document.getElementById("unidadeProduto");
    const statusCampo = document.getElementById("statusProduto");

    if (codigoCampo) codigoCampo.value = produto.codigo || "";
    if (eanCampo) eanCampo.value = produto.codigoBarras || "";
    if (nomeCampo) nomeCampo.value = produto.nome || "";
    if (categoriaCampo) categoriaCampo.value = produto.categoria || "";
    if (unidadeCampo) unidadeCampo.value = produto.unidade || "Unidade";
    if (statusCampo) statusCampo.value = produto.status || "Ativo";

    mostrarAba("produtos", document.querySelector('[onclick*="produtos"]'));
}

function excluirProduto(indice) {
    if (!Array.isArray(produtos) || !produtos[indice]) {
        alert("Produto não encontrado.");
        return;
    }

    const produto = produtos[indice];
    if (!confirm('Deseja realmente excluir o produto "' + produto.nome + '"?')) {
        return;
    }

    produtos.splice(indice, 1);
    salvarBanco();
    mostrarProdutos();
    atualizarDashboard();
    mostrarEstoque();

    if (typeof atualizarModuloProducao === "function") {
        atualizarModuloProducao();
    }
    if (typeof atualizarModuloEtiquetas === "function") {
        atualizarModuloEtiquetas();
    }
    if (typeof atualizarItensMovimentacao === "function") {
        atualizarItensMovimentacao();
    }

    alert("Produto excluído com sucesso.");
}

function inicializarProdutos() {
    if (!Array.isArray(produtos)) produtos = [];
    mostrarProdutos();
    novoProduto();
}

/* =====================================================
   MATÉRIA-PRIMA
===================================================== */

function gerarCodigoMateriaPrima() {
    let maior = 0;
    garantirArray(materiasPrimas).forEach(function (item) {
        const codigo = String(item.codigo || "").trim();
        const match = codigo.match(/^MP(\d+)$/i);
        if (match) {
            const n = Number(match[1]);
            if (Number.isFinite(n) && n > maior) maior = n;
        }
    });
    return "MP" + String(maior + 1).padStart(4, "0");
}

function novaMateriaPrima() {
    materiaPrimaEditando = -1;

    const codigo = document.getElementById("codigoMP");
    const nome = document.getElementById("nomeMP");
    const categoria = document.getElementById("categoriaMP");
    const unidade = document.getElementById("unidadeMP");
    const estoque = document.getElementById("estoqueMP");
    const custo = document.getElementById("custoMP");

    if (codigo) codigo.value = gerarCodigoMateriaPrima();
    if (nome) nome.value = "";
    if (categoria) categoria.value = "Ingrediente";
    if (unidade) unidade.value = "Kg";
    if (estoque) estoque.value = "0";
    if (custo) custo.value = "";
}

function salvarMateriaPrima() {
    const codigo = document.getElementById("codigoMP");
    const nome = document.getElementById("nomeMP");
    const categoria = document.getElementById("categoriaMP");
    const unidade = document.getElementById("unidadeMP");
    const estoque = document.getElementById("estoqueMP");
    const custo = document.getElementById("custoMP");

    if (!codigo || !nome || !categoria || !unidade || !estoque || !custo) {
        alert("Erro: algum campo da matéria-prima não foi encontrado.");
        return;
    }

    if (!String(nome.value || "").trim()) {
        alert("Informe o nome da matéria-prima.");
        nome.focus();
        return;
    }

    const materiaPrima = {
        codigo: codigo.value,
        nome: String(nome.value || "").trim(),
        categoria: categoria.value,
        unidade: unidade.value,
        estoque: Number(estoque.value) || 0,
        custo: Number(custo.value) || 0
    };

    if (materiaPrimaEditando === -1) {
        materiasPrimas.push(materiaPrima);
    } else {
        materiasPrimas[materiaPrimaEditando] = materiaPrima;
    }

    salvarBanco();
    mostrarMateriasPrimas();
    mostrarEstoque();
    novaMateriaPrima();
    alert("Matéria-prima salva com sucesso!");
}

function mostrarMateriasPrimas() {
    const tabela = document.getElementById("listaMateriaPrima");
    if (!tabela) return;

    tabela.innerHTML = "";

    if (!Array.isArray(materiasPrimas) || materiasPrimas.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Nenhuma matéria-prima cadastrada.</td>
            </tr>
        `;
        return;
    }

    materiasPrimas.forEach(function (materiaPrima, index) {
        const estoque = Number(materiaPrima.estoque) || 0;
        const custoUnitario = Number(materiaPrima.custo) || 0;
        const valorEstoque = estoque * custoUnitario;

        tabela.innerHTML += `
            <tr>
                <td>${materiaPrima.codigo || ""}</td>
                <td>${materiaPrima.nome || ""}</td>
                <td>${materiaPrima.categoria || ""}</td>
                <td>${materiaPrima.unidade || ""}</td>
                <td>${estoque}</td>
                <td>${formatarMoeda(custoUnitario)}</td>
                <td>${formatarMoeda(valorEstoque)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarMateriaPrima(${index})">✏️</button>
                    <button class="btn btn-delete btn-sm" onclick="excluirMateriaPrima(${index})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

function editarMateriaPrima(index) {
    const materiaPrima = materiasPrimas[index];
    if (!materiaPrima) return;

    materiaPrimaEditando = index;

    const codigo = document.getElementById("codigoMP");
    const nome = document.getElementById("nomeMP");
    const categoria = document.getElementById("categoriaMP");
    const unidade = document.getElementById("unidadeMP");
    const estoque = document.getElementById("estoqueMP");
    const custo = document.getElementById("custoMP");

    if (codigo) codigo.value = materiaPrima.codigo || "";
    if (nome) nome.value = materiaPrima.nome || "";
    if (categoria) categoria.value = materiaPrima.categoria || "Ingrediente";
    if (unidade) unidade.value = materiaPrima.unidade || "Kg";
    if (estoque) estoque.value = materiaPrima.estoque || 0;
    if (custo) custo.value = materiaPrima.custo || 0;
}

function excluirMateriaPrima(index) {
    if (!confirm("Excluir esta matéria-prima?")) return;
    materiasPrimas.splice(index, 1);
    salvarBanco();
    mostrarMateriasPrimas();
    mostrarEstoque();
    novaMateriaPrima();
}

/* =====================================================
   ESTOQUE
===================================================== */

function mostrarEstoque() {
    const tipoEstoque = document.getElementById("tipoEstoque");
    const cabecalho = document.getElementById("cabecalhoEstoque");
    const tabela = document.getElementById("listaEstoque");

    if (!tipoEstoque || !cabecalho || !tabela) return;

    const tipo = tipoEstoque.value;
    cabecalho.innerHTML = "";
    tabela.innerHTML = "";

    if (tipo === "materiaPrima") {
        cabecalho.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Unidade</th>
                <th>Estoque</th>
                <th>Custo Unitário</th>
                <th>Valor Total</th>
            </tr>
        `;

        if (!Array.isArray(materiasPrimas) || materiasPrimas.length === 0) {
            tabela.innerHTML = `
                <tr><td colspan="7" class="text-center">Nenhuma matéria-prima cadastrada.</td></tr>
            `;
            atualizarItensMovimentacao();
            return;
        }

        materiasPrimas.forEach(function (materiaPrima) {
            const estoque = Number(materiaPrima.estoque) || 0;
            const custoUnitario = Number(materiaPrima.custo) || 0;
            const valorTotal = estoque * custoUnitario;

            tabela.innerHTML += `
                <tr>
                    <td>${materiaPrima.codigo || ""}</td>
                    <td>${materiaPrima.nome || ""}</td>
                    <td>${materiaPrima.categoria || ""}</td>
                    <td>${materiaPrima.unidade || ""}</td>
                    <td>${estoque}</td>
                    <td>${formatarMoeda(custoUnitario)}</td>
                    <td>${formatarMoeda(valorTotal)}</td>
                </tr>
            `;
        });

        atualizarItensMovimentacao();
        return;
    }

    if (tipo === "produtoAcabado") {
        cabecalho.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Status</th>
            </tr>
        `;

        if (!Array.isArray(produtos) || produtos.length === 0) {
            tabela.innerHTML = `
                <tr><td colspan="5" class="text-center">Nenhum produto cadastrado.</td></tr>
            `;
            atualizarItensMovimentacao();
            return;
        }

        produtos.forEach(function (produto) {
            const estoque = Number(produto.estoque) || 0;
            const status = estoque > 0 ? "Disponível" : "Sem estoque";

            tabela.innerHTML += `
                <tr>
                    <td>${produto.codigo || ""}</td>
                    <td>${produto.nome || ""}</td>
                    <td>${produto.categoria || ""}</td>
                    <td>${estoque}</td>
                    <td>${status}</td>
                </tr>
            `;
        });

        atualizarItensMovimentacao();
    }
}

function alterarTipoEstoque() {
    mostrarEstoque();
    atualizarItensMovimentacao();
}

function atualizarItensMovimentacao() {
    const tipoEstoque = document.getElementById("tipoEstoqueMovimentacao");
    const selectItem = document.getElementById("itemMovimentacao");

    if (!tipoEstoque || !selectItem) return;

    const tipo = tipoEstoque.value;
    selectItem.innerHTML = "";

    const primeiraOpcao = document.createElement("option");
    primeiraOpcao.value = "";
    primeiraOpcao.textContent = "Selecione um item";
    selectItem.appendChild(primeiraOpcao);

    if (tipo === "materiaPrima") {
        if (!Array.isArray(materiasPrimas) || materiasPrimas.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Nenhuma matéria-prima cadastrada";
            selectItem.appendChild(option);
            return;
        }

        materiasPrimas.forEach(function (materiaPrima) {
            const option = document.createElement("option");
            option.value = materiaPrima.codigo;
            option.textContent = materiaPrima.codigo + " - " + materiaPrima.nome;
            selectItem.appendChild(option);
        });
        return;
    }

    if (tipo === "produtoAcabado") {
        if (!Array.isArray(produtos) || produtos.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Nenhum produto cadastrado";
            selectItem.appendChild(option);
            return;
        }

        produtos.forEach(function (produto) {
            const option = document.createElement("option");
            option.value = produto.codigo;
            option.textContent = produto.codigo + " - " + produto.nome;
            selectItem.appendChild(option);
        });
    }
}

function registrarMovimentacao() {
    const tipoEstoque = document.getElementById("tipoEstoqueMovimentacao");
    const tipoMovimentacao = document.getElementById("tipoMovimentacao");
    const itemMovimentacao = document.getElementById("itemMovimentacao");
    const quantidadeCampo = document.getElementById("quantidadeMovimentacao");
    const dataCampo = document.getElementById("dataMovimentacao");
    const observacaoCampo = document.getElementById("observacaoMovimentacao");

    if (!tipoEstoque || !tipoMovimentacao || !itemMovimentacao || !quantidadeCampo || !dataCampo) {
        alert("Não foi possível localizar os campos de movimentação.");
        return;
    }

    const tipo = tipoEstoque.value;
    const operacao = tipoMovimentacao.value;
    const codigo = String(itemMovimentacao.value || "").trim();
    const quantidade = Number(quantidadeCampo.value);
    const data = dataCampo.value || hojeISO();
    const observacao = observacaoCampo ? String(observacaoCampo.value || "").trim() : "";

    if (!quantidade || quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        return;
    }

    if (!codigo) {
        alert("Selecione um item.");
        return;
    }

    if (tipo === "produtoAcabado") {
        const produto = garantirArray(produtos).find(function (item) {
            return String(item.codigo || "").trim() === codigo;
        });

        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }

        if (produto.estoque === undefined || produto.estoque === null) {
            produto.estoque = 0;
        }

        if (operacao === "entrada") {
            produto.estoque = Number(produto.estoque) + quantidade;
        } else if (operacao === "saida") {
            if (Number(produto.estoque) < quantidade) {
                alert("Estoque insuficiente para realizar esta saída.");
                return;
            }
            produto.estoque = Number(produto.estoque) - quantidade;
        }
    }

    if (tipo === "materiaPrima") {
        const materiaPrima = garantirArray(materiasPrimas).find(function (item) {
            return String(item.codigo || "").trim() === codigo;
        });

        if (!materiaPrima) {
            alert("Matéria-prima não encontrada.");
            return;
        }

        if (materiaPrima.estoque === undefined || materiaPrima.estoque === null) {
            materiaPrima.estoque = 0;
        }

        if (operacao === "entrada") {
            materiaPrima.estoque = Number(materiaPrima.estoque) + quantidade;
        } else if (operacao === "saida") {
            if (Number(materiaPrima.estoque) < quantidade) {
                alert("Estoque insuficiente para realizar esta saída.");
                return;
            }
            materiaPrima.estoque = Number(materiaPrima.estoque) - quantidade;
        }
    }

    if (!Array.isArray(movimentacoes)) movimentacoes = [];

    movimentacoes.push({
        id: Date.now(),
        data: data,
        tipo: tipo,
        codigo: codigo,
        operacao: operacao,
        quantidade: quantidade,
        observacao: observacao
    });

    salvarBanco();
    mostrarEstoque();
    atualizarHistoricoMovimentacoes();
    atualizarDashboard();

    quantidadeCampo.value = "";
    if (observacaoCampo) observacaoCampo.value = "";

    alert("Movimentação registrada com sucesso.");
}

function atualizarHistoricoMovimentacoes() {
    const tabela = document.getElementById("historicoMovimentacoes");
    if (!tabela) return;

    tabela.innerHTML = "";

    if (!Array.isArray(movimentacoes) || movimentacoes.length === 0) {
        tabela.innerHTML = `
            <tr><td colspan="6" class="text-center">Nenhuma movimentação registrada.</td></tr>
        `;
        return;
    }

    movimentacoes.slice().reverse().forEach(function (movimentacao) {
        let nome = movimentacao.codigo;

        if (movimentacao.tipo === "produtoAcabado" || movimentacao.tipo === "produto") {
            const produto = garantirArray(produtos).find(function (item) {
                return String(item.codigo || "").trim() === String(movimentacao.codigo || "").trim();
            });
            if (produto) nome = produto.nome;
        }

        if (movimentacao.tipo === "materiaPrima") {
            const materiaPrima = garantirArray(materiasPrimas).find(function (item) {
                return String(item.codigo || "").trim() === String(movimentacao.codigo || "").trim();
            });
            if (materiaPrima) nome = materiaPrima.nome;
        }

        const tipoTexto = movimentacao.tipo === "materiaPrima" ? "Matéria-Prima" : "Produto Acabado";
        const operacaoTexto = movimentacao.operacao === "saida" ? "Saída" : "Entrada";

        tabela.innerHTML += `
            <tr>
                <td>${movimentacao.data || "-"}</td>
                <td>${tipoTexto}</td>
                <td>${nome}</td>
                <td>${movimentacao.quantidade}</td>
                <td>${operacaoTexto}</td>
                <td>${movimentacao.observacao || "-"}</td>
            </tr>
        `;
    });
}

function inicializarEstoque() {
    const dataMovimentacao = document.getElementById("dataMovimentacao");
    if (dataMovimentacao && !dataMovimentacao.value) {
        dataMovimentacao.value = hojeISO();
    }

    mostrarEstoque();
    atualizarItensMovimentacao();
    atualizarHistoricoMovimentacoes();
}

/* =====================================================
   PRODUÇÃO
===================================================== */

function calcularValidadeProducao() {
    const produtoCampo = document.getElementById("produtoProducao");
    const fabricacaoCampo = document.getElementById("fabricacaoProducao");
    const validadeCampo = document.getElementById("validadeProducao");

    if (!produtoCampo || !fabricacaoCampo || !validadeCampo) return;

    const produto = garantirArray(produtos).find(function (item) {
        return String(item.codigo || "").trim() === String(produtoCampo.value || "").trim();
    });

    if (!produto) {
        validadeCampo.value = "";
        validadeCampo.readOnly = true;
        return;
    }

    const nome = String(produto.nome || "").toLowerCase().trim();
    let diasValidade = null;

    if (nome.includes("palha italiana")) {
        diasValidade = 20;
    } else if (nome.includes("brownie")) {
        diasValidade = 20;
    } else if (nome.includes("bolo de pote")) {
        diasValidade = 7;
    }

    if (diasValidade === null) {
        validadeCampo.readOnly = false;
        validadeCampo.value = "";
        return;
    }

    validadeCampo.readOnly = true;

    if (!fabricacaoCampo.value) {
        validadeCampo.value = "";
        return;
    }

    validadeCampo.value = somarDias(fabricacaoCampo.value, diasValidade);
}

function atualizarProdutosProducao() {
    const select = document.getElementById("produtoProducao");
    if (!select) return;

    select.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um produto";
    select.appendChild(opcaoInicial);

    if (!Array.isArray(produtos) || produtos.length === 0) {
        const opcao = document.createElement("option");
        opcao.value = "";
        opcao.textContent = "Nenhum produto cadastrado";
        select.appendChild(opcao);
        return;
    }

    produtos.forEach(function (produto) {
        if (!produto || !String(produto.codigo || "").trim()) return;

        const opcao = document.createElement("option");
        opcao.value = String(produto.codigo).trim();
        opcao.textContent = String(produto.nome || "Produto sem nome") + " - Código: " + String(produto.codigo || "").trim();
        select.appendChild(opcao);
    });
}

function mostrarProducoes() {
    const tabela = document.getElementById("listaProducao");
    if (!tabela) return;

    tabela.innerHTML = "";

    if (!Array.isArray(producoes) || producoes.length === 0) {
        tabela.innerHTML = `
            <tr><td colspan="4">Nenhuma produção registrada.</td></tr>
        `;
        return;
    }

    producoes.slice().reverse().forEach(function (producao) {
        tabela.innerHTML += `
            <tr>
                <td>${producao.nomeProduto || ""}</td>
                <td>${producao.quantidade || 0}</td>
                <td>${formatarDataBR(producao.dataFabricacao)}</td>
                <td>${formatarDataBR(producao.validade)}</td>
            </tr>
        `;
    });
}

function registrarProducao() {
    if (!Array.isArray(produtos)) produtos = [];
    if (!Array.isArray(producoes)) producoes = [];
    if (!Array.isArray(movimentacoes)) movimentacoes = [];

    const produtoCampo = document.getElementById("produtoProducao");
    const quantidadeCampo = document.getElementById("quantidadeProducao");
    const fabricacaoCampo = document.getElementById("fabricacaoProducao");
    const validadeCampo = document.getElementById("validadeProducao");
    const observacaoCampo = document.getElementById("observacaoProducao");

    if (!produtoCampo || !quantidadeCampo || !fabricacaoCampo || !validadeCampo) {
        alert("Não foi possível localizar os campos da produção.");
        return;
    }

    calcularValidadeProducao();

    const codigoProduto = String(produtoCampo.value || "").trim();
    const quantidade = Number(quantidadeCampo.value);
    const dataFabricacao = fabricacaoCampo.value || hojeISO();
    const dataValidade = String(validadeCampo.value || "").trim();
    const observacao = observacaoCampo ? String(observacaoCampo.value || "").trim() : "";

    if (!codigoProduto) {
        alert("Selecione um produto.");
        return;
    }

    if (!quantidade || quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        quantidadeCampo.focus();
        return;
    }

    if (!dataFabricacao) {
        alert("Informe a data de fabricação.");
        fabricacaoCampo.focus();
        return;
    }

    if (!dataValidade) {
        alert("Informe a validade do produto.");
        validadeCampo.focus();
        return;
    }

    const produto = produtos.find(function (item) {
        return String(item.codigo || "").trim() === codigoProduto;
    });

    if (!produto) {
        alert("Produto não encontrado.");
        return;
    }

    if (produto.estoque === undefined || produto.estoque === null || isNaN(Number(produto.estoque))) {
        produto.estoque = 0;
    }

    produto.estoque = Number(produto.estoque) + quantidade;

    const producao = {
        id: Date.now(),
        codigoProduto: produto.codigo || "",
        nomeProduto: produto.nome || "",
        codigoBarras: produto.codigoBarras || "",
        quantidade: quantidade,
        dataFabricacao: dataFabricacao,
        validade: dataValidade,
        observacao: observacao
    };

    producoes.push(producao);

    movimentacoes.push({
        id: Date.now() + 1,
        data: dataFabricacao,
        tipo: "produtoAcabado",
        codigo: String(produto.codigo || ""),
        operacao: "entrada",
        quantidade: quantidade,
        observacao: "Produção - " + (produto.nome || "")
    });

    salvarBanco();
    mostrarProdutos();
    mostrarEstoque();
    atualizarHistoricoMovimentacoes();
    mostrarProducoes();
    atualizarProdutosProducao();
    atualizarProdutosEtiquetas();
    atualizarDashboard();

    quantidadeCampo.value = "1";
    if (observacaoCampo) observacaoCampo.value = "";
    alert("Produção registrada com sucesso!");
}

function inicializarProducao() {
    atualizarProdutosProducao();
    mostrarProducoes();

    const fabricacao = document.getElementById("fabricacaoProducao");
    if (fabricacao && !fabricacao.value) {
        fabricacao.value = hojeISO();
    }

    calcularValidadeProducao();

    const produtoCampo = document.getElementById("produtoProducao");
    const fabricacaoCampo = document.getElementById("fabricacaoProducao");

    if (produtoCampo) {
        produtoCampo.addEventListener("change", calcularValidadeProducao);
    }
    if (fabricacaoCampo) {
        fabricacaoCampo.addEventListener("change", calcularValidadeProducao);
    }
}

function atualizarModuloProducao() {
    atualizarProdutosProducao();
    calcularValidadeProducao();
    mostrarProducoes();
}

/* =====================================================
   ETIQUETAS
===================================================== */

function atualizarProdutosEtiquetas() {
    const select = document.getElementById("produtoEtiqueta");
    if (!select) return;

    select.innerHTML = "";

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um produto";
    select.appendChild(opcaoInicial);

    if (!Array.isArray(produtos) || produtos.length === 0) {
        const opcao = document.createElement("option");
        opcao.value = "";
        opcao.textContent = "Nenhum produto cadastrado";
        select.appendChild(opcao);
        return;
    }

    produtos.forEach(function (produto) {
        if (!produto || !String(produto.codigo || "").trim()) return;

        const opcao = document.createElement("option");
        opcao.value = String(produto.codigo).trim();
        opcao.textContent = String(produto.nome || "Produto sem nome") + " - Código: " + String(produto.codigo || "").trim();
        select.appendChild(opcao);
    });
}

function calcularValidadeEtiqueta() {
    const produtoCampo = document.getElementById("produtoEtiqueta");
    const fabricacaoCampo = document.getElementById("fabricacaoEtiqueta");
    const validadeCampo = document.getElementById("validadeEtiqueta");

    if (!produtoCampo || !fabricacaoCampo || !validadeCampo) return;

    if (!Array.isArray(produtos)) {
        produtos = [];
    }

    const codigoProduto = String(produtoCampo.value || "").trim();

    const produto = produtos.find(function (item) {
        return String(item.codigo || "").trim() === codigoProduto;
    });

    if (!produto) {
        validadeCampo.value = "";
        validadeCampo.readOnly = true;
        return;
    }

    const nome = String(produto.nome || "").toLowerCase().trim();
    let diasValidade = null;

    if (nome.includes("palha italiana")) {
        diasValidade = 20;
    } else if (nome.includes("brownie")) {
        diasValidade = 20;
    } else if (nome.includes("bolo de pote")) {
        diasValidade = 7;
    }

    if (diasValidade === null) {
        validadeCampo.readOnly = false;
        return;
    }

    validadeCampo.readOnly = true;

    if (!fabricacaoCampo.value) {
        validadeCampo.value = "";
        return;
    }

    validadeCampo.value = somarDias(fabricacaoCampo.value, diasValidade);
}

function gerarEtiqueta() {
    calcularValidadeEtiqueta();

    const produtoCampo = document.getElementById("produtoEtiqueta");
    const fabricacaoCampo = document.getElementById("fabricacaoEtiqueta");
    const validadeCampo = document.getElementById("validadeEtiqueta");
    const produtoNome = document.getElementById("mostrarProduto");
    const mostrarFabricacao = document.getElementById("mostrarFabricacao");
    const mostrarValidade = document.getElementById("mostrarValidade");
    const codigoBarras = document.getElementById("codigoBarrasEtiqueta");

    if (!produtoCampo || !fabricacaoCampo || !validadeCampo || !produtoNome || !mostrarFabricacao || !mostrarValidade || !codigoBarras) {
        alert("Não foi possível localizar os campos da etiqueta.");
        return;
    }

    const produto = garantirArray(produtos).find(function (item) {
        return String(item.codigo || "").trim() === String(produtoCampo.value || "").trim();
    });

    if (!produto) {
        alert("Selecione um produto.");
        return;
    }

    if (!fabricacaoCampo.value) {
        alert("Informe a data de fabricação.");
        return;
    }

    if (!validadeCampo.value) {
        alert("Informe a data de validade.");
        return;
    }

    produtoNome.textContent = produto.nome || "Produto";
    mostrarFabricacao.textContent = formatarDataBR(fabricacaoCampo.value);
    mostrarValidade.textContent = formatarDataBR(validadeCampo.value);
    codigoBarras.innerHTML = "";

    const codigo = String(produto.codigoBarras || "").replace(/\D/g, "");
    if (codigo.length !== 13) {
        alert("O produto selecionado não possui um código EAN-13 válido.");
        return;
    }

    if (typeof JsBarcode !== "function") {
        alert("A biblioteca JsBarcode não foi carregada.");
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.overflow = "visible";
    codigoBarras.appendChild(wrapper);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "barcodeGerado";
    svg.style.display = "block";
    svg.style.maxWidth = "100%";
    wrapper.appendChild(svg);

    JsBarcode(svg, codigo, {
        format: "EAN13",
        width: 1.3,
        height: 44,
        displayValue: true,
        fontSize: 10,
        fontOptions: "normal",
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 2,
        margin: 1,
        flat: false
    });
}

function salvarEtiquetaPNG() {
    const etiqueta = document.getElementById("etiquetaGerada");
    if (!etiqueta) {
        alert("Não foi possível localizar a etiqueta.");
        return;
    }

    if (typeof html2canvas !== "function") {
        alert("A biblioteca para gerar imagem não foi carregada.");
        return;
    }

    html2canvas(etiqueta, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true
    }).then(function (canvas) {
        const link = document.createElement("a");
        link.download = "etiqueta-carols-gourmet.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch(function (erro) {
        console.error("Erro ao gerar etiqueta:", erro);
        alert("Não foi possível gerar a imagem da etiqueta.");
    });
}

function inicializarEtiquetas() {
    atualizarProdutosEtiquetas();

    const fabricacao = document.getElementById("fabricacaoEtiqueta");
    if (fabricacao && !fabricacao.value) {
        fabricacao.value = hojeISO();
    }

    calcularValidadeEtiqueta();

    const produtoCampo = document.getElementById("produtoEtiqueta");
    const fabricacaoCampo = document.getElementById("fabricacaoEtiqueta");

    if (produtoCampo) {
        produtoCampo.addEventListener("change", calcularValidadeEtiqueta);
    }
    if (fabricacaoCampo) {
        fabricacaoCampo.addEventListener("change", calcularValidadeEtiqueta);
    }
}

function atualizarModuloEtiquetas() {
    atualizarProdutosEtiquetas();
    calcularValidadeEtiqueta();
}

/* =====================================================
   INICIALIZAÇÃO GERAL
===================================================== */

function inicializarTudo() {
    carregarBanco();
    configurarDatas();
    atualizarDashboard();
    inicializarProdutos();
    mostrarMateriasPrimas();
    novaMateriaPrima();
    inicializarEstoque();
    inicializarProducao();
    inicializarEtiquetas();
    mostrarAba("dashboard");
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Carol's Gourmet iniciado");
    inicializarTudo();
});
