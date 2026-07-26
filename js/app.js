/* =====================================================
   CAROL'S GOURMET
   APP.JS
   BASE DO SISTEMA
===================================================== */


"use strict";



/* =====================================================
   BANCO LOCAL
===================================================== */


let produtos = [];

let materiasPrimas = [];

let movimentacoes = [];

let producoes = [];

let precificacoes = [];





/* =====================================================
   INICIALIZAÇÃO
===================================================== */


document.addEventListener(
"DOMContentLoaded",
function(){

    console.log(
        "Carol's Gourmet iniciado"
    );


    carregarBanco();


    configurarDatas();


    atualizarDashboard();


    mostrarAba(
        "dashboard"
    );


});






/* =====================================================
   LOCAL STORAGE
===================================================== */


function carregarBanco(){


    produtos =
    JSON.parse(
        localStorage.getItem("produtos")
    ) || [];



    materiasPrimas =
    JSON.parse(
        localStorage.getItem("materiasPrimas")
    ) || [];



    movimentacoes =
    JSON.parse(
        localStorage.getItem("movimentacoes")
    ) || [];



    producoes =
    JSON.parse(
        localStorage.getItem("producoes")
    ) || [];



    precificacoes =
    JSON.parse(
        localStorage.getItem("precificacoes")
    ) || [];



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








/* =====================================================
   MENU MOBILE
===================================================== */


function toggleMenu(){


const menu =
document.getElementById(
"menuLateral"
);



if(menu){


menu.classList.toggle(
"open"
);


}



}









/* =====================================================
   TROCA DE ABAS
===================================================== */


function mostrarAba(
id,
botao
){



document
.querySelectorAll(
".aba"
)
.forEach(
function(item){


item.classList.remove(
"ativa"
);


}
);





const pagina =
document.getElementById(
id
);



if(pagina){


pagina.classList.add(
"ativa"
);


}






document
.querySelectorAll(
".menu-item"
)
.forEach(
function(item){


item.classList.remove(
"ativo"
);


}
);





if(botao){


botao.classList.add(
"ativo"
);


}



}








/* =====================================================
   DASHBOARD
===================================================== */


function atualizarDashboard(){



const total =
document.getElementById(
"totalProdutos"
);



if(total){


total.innerHTML =
produtos.length;


}






const data =
document.getElementById(
"ultimaAtualizacao"
);



if(data){


data.innerHTML =
new Date()
.toLocaleString(
"pt-BR"
);


}



}









/* =====================================================
   DATAS AUTOMÁTICAS
===================================================== */


function configurarDatas(){



let hoje =
new Date()
.toISOString()
.split("T")[0];




let campos = [


"dataEstoque",

"fabricacaoProducao",

"fabricacaoEtiqueta"


];




campos.forEach(
function(id){



let campo =
document.getElementById(
id
);



if(campo){


campo.value =
hoje;


}



}
);



}









/* =====================================================
   GERADORES
===================================================== */


function gerarCodigo(){

return (
"CG" +
Date.now()
.toString()
.slice(-6)
);


}







/* =====================================================
   BACKUP
===================================================== */


function exportarBackup(){



let dados = {


produtos,

materiasPrimas,

movimentacoes,

producoes,

precificacoes


};



let arquivo =
JSON.stringify(
dados,
null,
2
);




let blob =
new Blob(
[arquivo],
{
type:"application/json"
}
);



let link =
document.createElement(
"a"
);



link.href =
URL.createObjectURL(
blob
);



link.download =
"backup-carols-gourmet.json";



link.click();



}









function importarBackup(){


alert(
"Função de restauração será adicionada na próxima etapa."
);


}
/* =====================================================
   MÓDULO PRODUTOS
===================================================== */


let produtoEditando = -1;


/* =====================================================
   GERAR CÓDIGO INTERNO DO PRODUTO
===================================================== */

function gerarCodigoProduto() {

    let numero = produtos.length + 1;

    let codigo;

    do {

        codigo =
            "P" +
            String(numero).padStart(4, "0");

        numero++;

    } while (
        produtos.some(
            function(produto) {

                return produto.codigo === codigo;

            }
        )
    );

    return codigo;

}


/* =====================================================
   GERAR CÓDIGO DE BARRAS EAN-13
===================================================== */

function gerarEAN() {

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

        let numero =
            parseInt(
                codigo[i]
            );


        if (i % 2 === 0) {

            soma += numero;

        } else {

            soma +=
                numero * 3;

        }

    }


    let digito =
        (10 - (soma % 10)) % 10;


    return codigo + digito;

}


/* =====================================================
   MÓDULO DE PRODUTOS
   CAROL'S GOURMET ERP 4.0
===================================================== */


/* =====================================================
   GERAR CÓDIGO INTERNO DO PRODUTO
===================================================== */

function gerarCodigoProduto() {

    const numero =
        Date.now()
            .toString()
            .slice(-6);

    return "P" + numero;

}


/* =====================================================
   GERAR CÓDIGO EAN-13
===================================================== */

function gerarEAN() {

    let codigo = "";

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        codigo +=
            Math.floor(
                Math.random() * 10
            );

    }


    /* =================================================
       CALCULAR DÍGITO VERIFICADOR
    ================================================= */

    let soma = 0;

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const numero =
            Number(
                codigo[i]
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


    const resto =
        soma % 10;


    const digito =
        resto === 0
            ? 0
            : 10 - resto;


    return (
        codigo +
        digito
    );

}


/* =====================================================
   NOVO PRODUTO
===================================================== */

function novoProduto() {

    produtoEditando = -1;


    const codigoCampo =
        document.getElementById(
            "codigoProduto"
        );


    const eanCampo =
        document.getElementById(
            "eanProduto"
        );


    const nomeCampo =
        document.getElementById(
            "nomeProduto"
        );


    const categoriaCampo =
        document.getElementById(
            "categoriaProduto"
        );


    const unidadeCampo =
        document.getElementById(
            "unidadeProduto"
        );


    const statusCampo =
        document.getElementById(
            "statusProduto"
        );


    /* =================================================
       GERAR CÓDIGO
    ================================================= */

    if (
        codigoCampo
    ) {

        codigoCampo.value =
            gerarCodigoProduto();

    }


    /* =================================================
       GERAR EAN-13
    ================================================= */

    if (
        eanCampo
    ) {

        eanCampo.value =
            gerarEAN();

    }


    /* =================================================
       LIMPAR NOME
    ================================================= */

    if (
        nomeCampo
    ) {

        nomeCampo.value =
            "";

    }


    /* =================================================
       LIMPAR CATEGORIA
    ================================================= */

    if (
        categoriaCampo
    ) {

        categoriaCampo.value =
            "";

    }


    /* =================================================
       UNIDADE PADRÃO
    ================================================= */

    if (
        unidadeCampo
    ) {

        unidadeCampo.value =
            "Unidade";

    }


    /* =================================================
       STATUS PADRÃO
    ================================================= */

    if (
        statusCampo
    ) {

        statusCampo.value =
            "Ativo";

    }

}


/* =====================================================
   SALVAR PRODUTO
===================================================== */

function salvarProduto() {


    /* =================================================
       LOCALIZAR CAMPOS DO INDEX
    ================================================= */

    const codigoCampo =
        document.getElementById(
            "codigoProduto"
        );


    const eanCampo =
        document.getElementById(
            "eanProduto"
        );


    const nomeCampo =
        document.getElementById(
            "nomeProduto"
        );


    const categoriaCampo =
        document.getElementById(
            "categoriaProduto"
        );


    const unidadeCampo =
        document.getElementById(
            "unidadeProduto"
        );


    const statusCampo =
        document.getElementById(
            "statusProduto"
        );


    /* =================================================
       VERIFICAR CAMPOS
    ================================================= */

    if (
        !codigoCampo ||
        !eanCampo ||
        !nomeCampo ||
        !categoriaCampo ||
        !unidadeCampo ||
        !statusCampo
    ) {

        alert(
            "Não foi possível localizar os campos do cadastro de produto."
        );

        return;

    }


    /* =================================================
       PEGAR VALORES
    ================================================= */

    const codigo =
        codigoCampo.value.trim();


    const codigoBarras =
        eanCampo.value.trim();


    const nome =
        nomeCampo.value.trim();


    const categoria =
        categoriaCampo.value;


    const unidade =
        unidadeCampo.value;


    const status =
        statusCampo.value;


    /* =================================================
       VALIDAR NOME
    ================================================= */

    if (
        nome === ""
    ) {

        alert(
            "Informe o nome do produto."
        );

        nomeCampo.focus();

        return;

    }


    /* =================================================
       GARANTIR ARRAY DE PRODUTOS
    ================================================= */

    if (
        !Array.isArray(
            produtos
        )
    ) {

        produtos = [];

    }


    /* =================================================
       GARANTIR PRODUTOEDITANDO
    ================================================= */

    if (
        typeof produtoEditando !==
        "number"
    ) {

        produtoEditando = -1;

    }


    /* =================================================
       NOVO PRODUTO
    ================================================= */

    if (
        produtoEditando === -1
    ) {


        const produto = {

            codigo:
                codigo ||
                gerarCodigoProduto(),

            codigoBarras:
                codigoBarras ||
                gerarEAN(),

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

            custo:
                0,

            precoVenda:
                0

        };


        produtos.push(
            produto
        );

    }


    /* =================================================
       EDITAR PRODUTO
    ================================================= */

    else {


        const produtoAtual =
            produtos[
                produtoEditando
            ];


        if (
            !produtoAtual
        ) {

            alert(
                "Produto não encontrado para edição."
            );

            produtoEditando = -1;

            return;

        }


        produtoAtual.codigo =
            codigo ||
            produtoAtual.codigo ||
            gerarCodigoProduto();


        produtoAtual.codigoBarras =
            codigoBarras ||
            produtoAtual.codigoBarras ||
            gerarEAN();


        produtoAtual.nome =
            nome;


        produtoAtual.categoria =
            categoria;


        produtoAtual.unidade =
            unidade;


        produtoAtual.status =
            status;


        /* =================================================
           GARANTIR CAMPOS EXISTENTES
        ================================================= */

        if (
            produtoAtual.estoque ===
            undefined
        ) {

            produtoAtual.estoque =
                0;

        }


        if (
            produtoAtual.custo ===
            undefined
        ) {

            produtoAtual.custo =
                0;

        }


        if (
            produtoAtual.precoVenda ===
            undefined
        ) {

            produtoAtual.precoVenda =
                0;

        }

    }


    /* =================================================
       SALVAR BANCO
    ================================================= */

    if (
        typeof salvarBanco ===
        "function"
    ) {

        salvarBanco();

    }


    /* =================================================
       ATUALIZAR LISTA DE PRODUTOS
    ================================================= */

    mostrarProdutos();


    /* =================================================
       ATUALIZAR DASHBOARD
    ================================================= */

    if (
        typeof atualizarDashboard ===
        "function"
    ) {

        atualizarDashboard();

    }


    /* =================================================
       ATUALIZAR ESTOQUE
    ================================================= */

    if (
        typeof mostrarEstoque ===
        "function"
    ) {

        mostrarEstoque();

    }


    /* =================================================
       ATUALIZAR LISTA DE MOVIMENTAÇÃO
    ================================================= */

    if (
        typeof atualizarItensMovimentacao ===
        "function"
    ) {

        atualizarItensMovimentacao();

    }


    /* =================================================
       MENSAGEM
    ================================================= */

    alert(
        "Produto salvo com sucesso."
    );


    /* =================================================
       PREPARAR NOVO CADASTRO
    ================================================= */

    novoProduto();

}


/* =====================================================
   MOSTRAR PRODUTOS
===================================================== */

function mostrarProdutos() {


    const tabela =
        document.getElementById(
            "listaProdutos"
        );


    if (
        !tabela
    ) {

        return;

    }


    tabela.innerHTML =
        "";


    /* =================================================
       NENHUM PRODUTO
    ================================================= */

    if (
        !Array.isArray(
            produtos
        ) ||
        produtos.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center"
                >

                    Nenhum produto cadastrado.

                </td>

            </tr>

        `;

        return;

    }


    /* =================================================
       LISTAR PRODUTOS
    ================================================= */

    produtos.forEach(
        function(
            produto,
            indice
        ) {


            const estoque =
                Number(
                    produto.estoque
                ) || 0;


            const custo =
                Number(
                    produto.custo
                ) || 0;


            const valorTotal =
                estoque *
                custo;


            tabela.innerHTML += `

                <tr>

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
                        ${estoque}
                    </td>

                    <td>
                        R$ ${custo
                            .toFixed(2)
                            .replace(".", ",")}
                    </td>

                    <td>
                        R$ ${valorTotal
                            .toFixed(2)
                            .replace(".", ",")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-edit"
                            onclick="editarProduto(${indice})"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn btn-delete"
                            onclick="excluirProduto(${indice})"
                        >
                            🗑️
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


/* =====================================================
   EDITAR PRODUTO
===================================================== */

function editarProduto(
    indice
) {


    if (
        !Array.isArray(
            produtos
        ) ||
        !produtos[indice]
    ) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const produto =
        produtos[indice];


    produtoEditando =
        indice;


    /* =================================================
       CAMPOS
    ================================================= */

    const codigoCampo =
        document.getElementById(
            "codigoProduto"
        );


    const eanCampo =
        document.getElementById(
            "eanProduto"
        );


    const nomeCampo =
        document.getElementById(
            "nomeProduto"
        );


    const categoriaCampo =
        document.getElementById(
            "categoriaProduto"
        );


    const unidadeCampo =
        document.getElementById(
            "unidadeProduto"
        );


    const statusCampo =
        document.getElementById(
            "statusProduto"
        );


    /* =================================================
       PREENCHER FORMULÁRIO
    ================================================= */

    if (
        codigoCampo
    ) {

        codigoCampo.value =
            produto.codigo ||
            "";

    }


    if (
        eanCampo
    ) {

        eanCampo.value =
            produto.codigoBarras ||
            "";

    }


    if (
        nomeCampo
    ) {

        nomeCampo.value =
            produto.nome ||
            "";

    }


    if (
        categoriaCampo
    ) {

        categoriaCampo.value =
            produto.categoria ||
            "";

    }


    if (
        unidadeCampo
    ) {

        unidadeCampo.value =
            produto.unidade ||
            "Unidade";

    }


    if (
        statusCampo
    ) {

        statusCampo.value =
            produto.status ||
            "Ativo";

    }


    /* =================================================
       ABRIR ABA PRODUTOS
    ================================================= */

    if (
        typeof mostrarAba ===
        "function"
    ) {


        const aba =
            document.getElementById(
                "produtos"
            );


        const botao =
            document.querySelector(
                '[onclick*="produtos"]'
            );


        if (
            aba
        ) {

            mostrarAba(
                aba,
                botao
            );

        }

    }

}


/* =====================================================
   EXCLUIR PRODUTO
===================================================== */

function excluirProduto(
    indice
) {


    if (
        !Array.isArray(
            produtos
        ) ||
        !produtos[indice]
    ) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const produto =
        produtos[indice];


    const confirmar =
        confirm(
            'Deseja realmente excluir o produto "' +
            produto.nome +
            '"?'
        );


    if (
        !confirmar
    ) {

        return;

    }


    produtos.splice(
        indice,
        1
    );


    /* =================================================
       SALVAR
    ================================================= */

    if (
        typeof salvarBanco ===
        "function"
    ) {

        salvarBanco();

    }


    /* =================================================
       ATUALIZAR PRODUTOS
    ================================================= */

    mostrarProdutos();


    /* =================================================
       ATUALIZAR ESTOQUE
    ================================================= */

    if (
        typeof mostrarEstoque ===
        "function"
    ) {

        mostrarEstoque();

    }


    /* =================================================
       ATUALIZAR MOVIMENTAÇÃO
    ================================================= */

    if (
        typeof atualizarItensMovimentacao ===
        "function"
    ) {

        atualizarItensMovimentacao();

    }


    alert(
        "Produto excluído com sucesso."
    );

}


/* =====================================================
   INICIALIZAR PRODUTOS
===================================================== */

function inicializarProdutos() {


    /* =================================================
       GARANTIR ARRAY
    ================================================= */

    if (
        !Array.isArray(
            produtos
        )
    ) {

        produtos = [];

    }


    /* =================================================
       MOSTRAR LISTA
    ================================================= */

    mostrarProdutos();


    /* =================================================
       NOVO CADASTRO
    ================================================= */

    novoProduto();

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        inicializarProdutos();

    }
);
/* =====================================================
   MÓDULO MATÉRIA-PRIMA
===================================================== */


let materiaPrimaEditando = -1;


/* =====================================================
   GERAR CÓDIGO INTERNO DA MATÉRIA-PRIMA
===================================================== */

function gerarCodigoMateriaPrima() {

    let numero =
        materiasPrimas.length + 1;


    let codigo;


    do {

        codigo =
            "MP" +
            String(numero).padStart(4, "0");


        numero++;


    } while (
        materiasPrimas.some(
            function(materiaPrima) {

                return materiaPrima.codigo === codigo;

            }
        )
    );


    return codigo;

}


/* =====================================================
   NOVA MATÉRIA-PRIMA
===================================================== */

function novaMateriaPrima() {


    materiaPrimaEditando = -1;


    const codigo =
        document.getElementById(
            "codigoMP"
        );


    if (codigo) {

        codigo.value =
            gerarCodigoMateriaPrima();

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

        categoria.value =
            "Ingrediente";

    }


    const unidade =
        document.getElementById(
            "unidadeMP"
        );


    if (unidade) {

        unidade.value =
            "Kg";

    }


    const estoque =
        document.getElementById(
            "estoqueMP"
        );


    if (estoque) {

        estoque.value =
            "0";

    }


    const custo =
        document.getElementById(
            "custoMP"
        );


    if (custo) {

        custo.value =
            "";

    }

}


/* =====================================================
   SALVAR MATÉRIA-PRIMA
===================================================== */

function salvarMateriaPrima() {


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


    if (
        !codigo ||
        !nome ||
        !categoria ||
        !unidade ||
        !estoque ||
        !custo
    ) {


        alert(
            "Erro: algum campo da matéria-prima não foi encontrado."
        );


        return;

    }


    if (
        nome.value.trim() === ""
    ) {


        alert(
            "Informe o nome da matéria-prima."
        );


        nome.focus();


        return;

    }


    const materiaPrima = {


        codigo:

            codigo.value,


        nome:

            nome.value.trim(),


        categoria:

            categoria.value,


        unidade:

            unidade.value,


        estoque:

            Number(
                estoque.value
            ) || 0,


        custo:

            Number(
                custo.value
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


    mostrarMateriasPrimas();


    novaMateriaPrima();


    alert(
        "Matéria-prima salva com sucesso!"
    );

}


/* =====================================================
   MOSTRAR MATÉRIAS-PRIMAS
===================================================== */

function mostrarMateriasPrimas() {


    const tabela =
        document.getElementById(
            "listaMateriaPrima"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    materiasPrimas.forEach(
        function (
            materiaPrima,
            index
        ) {


            const estoque =
                Number(
                    materiaPrima.estoque
                ) || 0;


            const custoUnitario =
                Number(
                    materiaPrima.custo
                ) || 0;


            const valorEstoque =
                estoque *
                custoUnitario;


            tabela.innerHTML += `

                <tr>


                    <td>
                        ${materiaPrima.codigo || ""}
                    </td>


                    <td>
                        ${materiaPrima.nome || ""}
                    </td>


                    <td>
                        ${materiaPrima.categoria || ""}
                    </td>


                    <td>
                        ${materiaPrima.unidade || ""}
                    </td>


                    <td>
                        ${estoque}
                    </td>


                    <td>
                        R$ ${custoUnitario.toFixed(2)}
                    </td>


                    <td>
                        R$ ${valorEstoque.toFixed(2)}
                    </td>


                    <td>


                        <button
                            class="btn btn-primary btn-sm"
                            onclick="editarMateriaPrima(${index})">

                            ✏️

                        </button>


                        <button
                            class="btn btn-delete btn-sm"
                            onclick="excluirMateriaPrima(${index})">

                            🗑️

                        </button>


                    </td>


                </tr>

            `;

        }
    );

}


/* =====================================================
   EDITAR MATÉRIA-PRIMA
===================================================== */

function editarMateriaPrima(index) {


    const materiaPrima =
        materiasPrimas[index];


    if (!materiaPrima) {

        return;

    }


    materiaPrimaEditando =
        index;


    document.getElementById(
        "codigoMP"
    ).value =
        materiaPrima.codigo || "";


    document.getElementById(
        "nomeMP"
    ).value =
        materiaPrima.nome || "";


    document.getElementById(
        "categoriaMP"
    ).value =
        materiaPrima.categoria || "Ingrediente";


    document.getElementById(
        "unidadeMP"
    ).value =
        materiaPrima.unidade || "Kg";


    document.getElementById(
        "estoqueMP"
    ).value =
        materiaPrima.estoque || 0;


    document.getElementById(
        "custoMP"
    ).value =
        materiaPrima.custo || 0;

}


/* =====================================================
   EXCLUIR MATÉRIA-PRIMA
===================================================== */

function excluirMateriaPrima(index) {


    if (
        !confirm(
            "Excluir esta matéria-prima?"
        )
    ) {

        return;

    }


    materiasPrimas.splice(
        index,
        1
    );


    salvarBanco();


    mostrarMateriasPrimas();


    novaMateriaPrima();

}


/* =====================================================
   INICIALIZAÇÃO DA MATÉRIA-PRIMA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarMateriasPrimas();

        novaMateriaPrima();

    }
);
/* =====================================================
   CAROL'S GOURMET
   MÓDULO COMPLETO DE ESTOQUE
===================================================== */


/* =====================================================
   MOSTRAR ESTOQUE
===================================================== */

function mostrarEstoque() {

    const tipoEstoque =
        document.getElementById("tipoEstoque");

    const cabecalho =
        document.getElementById("cabecalhoEstoque");

    const tabela =
        document.getElementById("listaEstoque");


    if (
        !tipoEstoque ||
        !cabecalho ||
        !tabela
    ) {

        return;

    }


    const tipo =
        tipoEstoque.value;


    cabecalho.innerHTML = "";

    tabela.innerHTML = "";


    /* =================================================
       MATÉRIA-PRIMA
    ================================================= */

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


        if (
            !Array.isArray(materiasPrimas) ||
            materiasPrimas.length === 0
        ) {

            tabela.innerHTML = `

                <tr>

                    <td colspan="7" class="text-center">

                        Nenhuma matéria-prima cadastrada.

                    </td>

                </tr>

            `;

            atualizarItensMovimentacao();

            return;

        }


        materiasPrimas.forEach(
            function(materiaPrima) {

                const estoque =
                    Number(
                        materiaPrima.estoque
                    ) || 0;


                const custoUnitario =
                    Number(
                        materiaPrima.custo
                    ) || 0;


                const valorTotal =
                    estoque *
                    custoUnitario;


                tabela.innerHTML += `

                    <tr>

                        <td>
                            ${materiaPrima.codigo || ""}
                        </td>

                        <td>
                            ${materiaPrima.nome || ""}
                        </td>

                        <td>
                            ${materiaPrima.categoria || ""}
                        </td>

                        <td>
                            ${materiaPrima.unidade || ""}
                        </td>

                        <td>
                            ${estoque}
                        </td>

                        <td>
                            R$ ${custoUnitario
                                .toFixed(2)
                                .replace(".", ",")}
                        </td>

                        <td>
                            R$ ${valorTotal
                                .toFixed(2)
                                .replace(".", ",")}
                        </td>

                    </tr>

                `;

            }
        );


        atualizarItensMovimentacao();

        return;

    }


    /* =================================================
       PRODUTO ACABADO
    ================================================= */

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


        if (
            !Array.isArray(produtos) ||
            produtos.length === 0
        ) {

            tabela.innerHTML = `

                <tr>

                    <td colspan="5" class="text-center">

                        Nenhum produto cadastrado.

                    </td>

                </tr>

            `;

            atualizarItensMovimentacao();

            return;

        }


        produtos.forEach(
            function(produto) {

                const estoque =
                    Number(
                        produto.estoque
                    ) || 0;


                const status =
                    estoque > 0
                        ? "Disponível"
                        : "Sem estoque";


                tabela.innerHTML += `

                    <tr>

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
                            ${estoque}
                        </td>

                        <td>
                            ${status}
                        </td>

                    </tr>

                `;

            }
        );


        atualizarItensMovimentacao();

    }

}


/* =====================================================
   ALTERAR TIPO DE ESTOQUE
===================================================== */

function alterarTipoEstoque() {

    mostrarEstoque();

    atualizarItensMovimentacao();

}


/* =====================================================
   ATUALIZAR LISTA DE ITENS
===================================================== */

function atualizarItensMovimentacao() {

    const tipoEstoque =
    document.getElementById(
        "tipoEstoqueMovimentacao"
    );

    const selectItem =
        document.getElementById(
            "itemMovimentacao"
        );


    if (
        !tipoEstoque ||
        !selectItem
    ) {

        return;

    }


    const tipo =
        tipoEstoque.value;


    selectItem.innerHTML = "";


    /* =================================================
       PRIMEIRA OPÇÃO
    ================================================= */

    const primeiraOpcao =
        document.createElement("option");


    primeiraOpcao.value = "";


    primeiraOpcao.textContent =
        "Selecione um item";


    selectItem.appendChild(
        primeiraOpcao
    );


    /* =================================================
       MATÉRIA-PRIMA
    ================================================= */

    if (
        tipo === "materiaPrima"
    ) {

        if (
            !Array.isArray(materiasPrimas) ||
            materiasPrimas.length === 0
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value = "";


            option.textContent =
                "Nenhuma matéria-prima cadastrada";


            selectItem.appendChild(
                option
            );


            return;

        }


        materiasPrimas.forEach(
            function(materiaPrima) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    materiaPrima.codigo;


                option.textContent =
                    materiaPrima.codigo +
                    " - " +
                    materiaPrima.nome;


                selectItem.appendChild(
                    option
                );

            }
        );


        return;

    }


    /* =================================================
       PRODUTO ACABADO
    ================================================= */

    if (
        tipo === "produtoAcabado"
    ) {

        if (
            !Array.isArray(produtos) ||
            produtos.length === 0
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value = "";


            option.textContent =
                "Nenhum produto cadastrado";


            selectItem.appendChild(
                option
            );


            return;

        }


        produtos.forEach(
            function(produto) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    produto.codigo;


                option.textContent =
                    produto.codigo +
                    " - " +
                    produto.nome;


                selectItem.appendChild(
                    option
                );

            }
        );

    }

}


/* =====================================================
   REGISTRAR MOVIMENTAÇÃO
===================================================== */

function registrarMovimentacao() {

   const tipoEstoque =
    document.getElementById(
        "tipoEstoqueMovimentacao"
    );


    const tipoMovimentacao =
        document.getElementById(
            "tipoMovimentacao"
        );


    const itemMovimentacao =
        document.getElementById(
            "itemMovimentacao"
        );


    const quantidadeCampo =
        document.getElementById(
            "quantidadeMovimentacao"
        );


    const dataCampo =
        document.getElementById(
            "dataMovimentacao"
        );


    const observacaoCampo =
        document.getElementById(
            "observacaoMovimentacao"
        );


    /* =================================================
       VERIFICAR CAMPOS
    ================================================= */

    if (
        !tipoEstoque ||
        !tipoMovimentacao ||
        !itemMovimentacao ||
        !quantidadeCampo ||
        !dataCampo
    ) {

        alert(
            "Não foi possível localizar os campos de movimentação."
        );

        return;

    }


    const tipo =
        tipoEstoque.value;


    const operacao =
        tipoMovimentacao.value;


    const codigo =
        itemMovimentacao.value;


    const quantidade =
        Number(
            quantidadeCampo.value
        );


    const data =
        dataCampo.value ||
        new Date()
            .toISOString()
            .split("T")[0];


    const observacao =
        observacaoCampo
            ? observacaoCampo.value.trim()
            : "";


    /* =================================================
       VALIDAR QUANTIDADE
    ================================================= */

    if (
        !quantidade ||
        quantidade <= 0
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    /* =================================================
       VALIDAR ITEM
    ================================================= */

    if (
        !codigo
    ) {

        alert(
            "Selecione um item."
        );

        return;

    }


    /* =================================================
       PRODUTO ACABADO
    ================================================= */

    if (
        tipo === "produtoAcabado"
    ) {

        const produto =
            produtos.find(
                function(item) {

                    return (
                        String(item.codigo) ===
                        String(codigo)
                    );

                }
            );


        if (
            !produto
        ) {

            alert(
                "Produto não encontrado."
            );

            return;

        }


        if (
            produto.estoque === undefined ||
            produto.estoque === null
        ) {

            produto.estoque = 0;

        }


        /* ENTRADA */

        if (
            operacao === "entrada"
        ) {

            produto.estoque =
                Number(produto.estoque) +
                quantidade;

        }


        /* SAÍDA */

        if (
            operacao === "saida"
        ) {

            if (
                Number(produto.estoque) <
                quantidade
            ) {

                alert(
                    "Estoque insuficiente para realizar esta saída."
                );

                return;

            }


            produto.estoque =
                Number(produto.estoque) -
                quantidade;

        }

    }


    /* =================================================
       MATÉRIA-PRIMA
    ================================================= */

    if (
        tipo === "materiaPrima"
    ) {

        const materiaPrima =
            materiasPrimas.find(
                function(item) {

                    return (
                        String(item.codigo) ===
                        String(codigo)
                    );

                }
            );


        if (
            !materiaPrima
        ) {

            alert(
                "Matéria-prima não encontrada."
            );

            return;

        }


        if (
            materiaPrima.estoque === undefined ||
            materiaPrima.estoque === null
        ) {

            materiaPrima.estoque = 0;

        }


        /* ENTRADA */

        if (
            operacao === "entrada"
        ) {

            materiaPrima.estoque =
                Number(materiaPrima.estoque) +
                quantidade;

        }


        /* SAÍDA */

        if (
            operacao === "saida"
        ) {

            if (
                Number(materiaPrima.estoque) <
                quantidade
            ) {

                alert(
                    "Estoque insuficiente para realizar esta saída."
                );

                return;

            }


            materiaPrima.estoque =
                Number(materiaPrima.estoque) -
                quantidade;

        }

    }


    /* =================================================
       REGISTRO DA MOVIMENTAÇÃO
    ================================================= */

    const movimentacao = {

        id:
            Date.now(),

        data:
            data,

        tipo:
            tipo,

        codigo:
            codigo,

        operacao:
            operacao,

        quantidade:
            quantidade,

        observacao:
            observacao

    };


    /* =================================================
       GARANTIR ARRAY
    ================================================= */

    if (
        !Array.isArray(
            movimentacoes
        )
    ) {

        movimentacoes = [];

    }


    movimentacoes.push(
        movimentacao
    );


    /* =================================================
       SALVAR
    ================================================= */

    salvarBanco();


    /* =================================================
       ATUALIZAR TELA
    ================================================= */

    mostrarEstoque();


    atualizarItensMovimentacao();


    atualizarHistoricoMovimentacoes();


    /* =================================================
       LIMPAR CAMPOS
    ================================================= */

    quantidadeCampo.value =
        "";


    if (
        observacaoCampo
    ) {

        observacaoCampo.value =
            "";

    }


    alert(
        "Movimentação registrada com sucesso."
    );

}


/* =====================================================
   HISTÓRICO DE MOVIMENTAÇÕES
===================================================== */

function atualizarHistoricoMovimentacoes() {

    const tabela =
        document.getElementById(
            "historicoMovimentacoes"
        );


    if (
        !tabela
    ) {

        return;

    }


    tabela.innerHTML =
        "";


    if (
        !Array.isArray(movimentacoes) ||
        movimentacoes.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center"
                >

                    Nenhuma movimentação registrada.

                </td>

            </tr>

        `;

        return;

    }


    movimentacoes
        .slice()
        .reverse()
        .forEach(
            function(movimentacao) {


                let nome =
                    movimentacao.codigo;


                /* =================================================
                   PRODUTO
                ================================================= */

                if (
                    movimentacao.tipo ===
                    "produtoAcabado"
                    ||
                    movimentacao.tipo ===
                    "produto"
                ) {

                    const produto =
                        Array.isArray(produtos)
                            ? produtos.find(
                                function(item) {

                                    return (
                                        String(item.codigo) ===
                                        String(
                                            movimentacao.codigo
                                        )
                                    );

                                }
                            )
                            : null;


                    if (
                        produto
                    ) {

                        nome =
                            produto.nome;

                    }

                }


                /* =================================================
                   MATÉRIA-PRIMA
                ================================================= */

                if (
                    movimentacao.tipo ===
                    "materiaPrima"
                ) {

                    const materiaPrima =
                        Array.isArray(materiasPrimas)
                            ? materiasPrimas.find(
                                function(item) {

                                    return (
                                        String(item.codigo) ===
                                        String(
                                            movimentacao.codigo
                                        )
                                    );

                                }
                            )
                            : null;


                    if (
                        materiaPrima
                    ) {

                        nome =
                            materiaPrima.nome;

                    }

                }


                /* =================================================
                   TIPO
                ================================================= */

                const tipoTexto =
                    movimentacao.tipo ===
                    "materiaPrima"
                        ? "Matéria-Prima"
                        : "Produto Acabado";


                /* =================================================
                   OPERAÇÃO
                ================================================= */

                const operacaoTexto =
                    movimentacao.operacao ===
                    "saida"
                        ? "Saída"
                        : "Entrada";


                tabela.innerHTML += `

                    <tr>

                        <td>
                            ${movimentacao.data || "-"}
                        </td>

                        <td>
                            ${tipoTexto}
                        </td>

                        <td>
                            ${nome}
                        </td>

                        <td>
                            ${movimentacao.quantidade}
                        </td>

                        <td>
                            ${operacaoTexto}
                        </td>

                        <td>
                            ${movimentacao.observacao || "-"}
                        </td>

                    </tr>

                `;

            }
        );

}


/* =====================================================
   INICIALIZAR ESTOQUE
===================================================== */

function inicializarEstoque() {

    const tipoEstoque =
        document.getElementById(
            "tipoEstoque"
        );


    const dataMovimentacao =
        document.getElementById(
            "dataMovimentacao"
        );


    /* =================================================
       DATA ATUAL
    ================================================= */

    if (
        dataMovimentacao &&
        !dataMovimentacao.value
    ) {

        dataMovimentacao.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    /* =================================================
       MOSTRAR ESTOQUE
    ================================================= */

    mostrarEstoque();


    /* =================================================
       CARREGAR ITENS
    ================================================= */

    atualizarItensMovimentacao();


    /* =================================================
       HISTÓRICO
    ================================================= */

    atualizarHistoricoMovimentacoes();


    /* =================================================
       EVENTO DO TIPO DE ESTOQUE
    ================================================= */

    if (
        tipoEstoque
    ) {

        tipoEstoque.addEventListener(
            "change",
            function() {

                mostrarEstoque();

                atualizarItensMovimentacao();

            }
        );

    }

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        inicializarEstoque();

    }
);

/* =====================================================
   MÓDULO DE ETIQUETAS
   CAROL'S GOURMET ERP 4.0
===================================================== */


/* =====================================================
   ATUALIZAR PRODUTOS NO SELECT
===================================================== */

function atualizarProdutosEtiquetas() {

    const select =
        document.getElementById("produtoEtiqueta");

    if (!select) {
        return;
    }

    select.innerHTML = "";

    if (
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {

        const opcao =
            document.createElement("option");

        opcao.value = "";

        opcao.textContent =
            "Nenhum produto cadastrado";

        select.appendChild(opcao);

        return;
    }


    const opcaoInicial =
        document.createElement("option");

    opcaoInicial.value = "";

    opcaoInicial.textContent =
        "Selecione um produto";

    select.appendChild(opcaoInicial);


    produtos.forEach(function(produto) {

        const opcao =
            document.createElement("option");

        opcao.value =
            produto.codigo || "";

        opcao.textContent =
            (produto.nome || "Produto sem nome") +
            " - " +
            (produto.codigoBarras || "");

        select.appendChild(opcao);

    });

}


/* =====================================================
   CALCULAR VALIDADE DA ETIQUETA
===================================================== */

function calcularValidadeEtiqueta() {

    const produtoCampo =
        document.getElementById("produtoEtiqueta");

    const fabricacaoCampo =
        document.getElementById("fabricacaoEtiqueta");

    const validadeCampo =
        document.getElementById("validadeEtiqueta");


    if (
        !produtoCampo ||
        !fabricacaoCampo ||
        !validadeCampo
    ) {

        return;
    }


    const produto =
        Array.isArray(produtos)
            ? produtos.find(function(item) {

                return (
                    item.codigo ===
                    produtoCampo.value
                );

            })
            : null;


    if (!produto) {

        validadeCampo.value = "";

        validadeCampo.readOnly = true;

        return;
    }


    const nome =
        String(
            produto.nome || ""
        )
        .toLowerCase()
        .trim();


    let diasValidade = null;


    /* =================================================
       PALHA ITALIANA
    ================================================= */

    if (
        nome.includes("palha italiana")
    ) {

        diasValidade = 20;
    }


    /* =================================================
       BROWNIE
    ================================================= */

    else if (
        nome.includes("brownie")
    ) {

        diasValidade = 20;
    }


    /* =================================================
       BOLO DE POTE
    ================================================= */

    else if (
        nome.includes("bolo de pote")
    ) {

        diasValidade = 7;
    }


    /* =================================================
       OUTROS PRODUTOS
       VALIDADE MANUAL
    ================================================= */

    if (
        diasValidade === null
    ) {

        validadeCampo.readOnly = false;

        return;
    }


    validadeCampo.readOnly = true;


    if (
        !fabricacaoCampo.value
    ) {

        validadeCampo.value = "";

        return;
    }


    const data =
        new Date(
            fabricacaoCampo.value +
            "T00:00:00"
        );


    if (
        isNaN(
            data.getTime()
        )
    ) {

        validadeCampo.value = "";

        return;
    }


    data.setDate(
        data.getDate() +
        diasValidade
    );


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        )
        .padStart(2, "0");


    const dia =
        String(
            data.getDate()
        )
        .padStart(2, "0");


    validadeCampo.value =
        ano +
        "-" +
        mes +
        "-" +
        dia;

}


/* =====================================================
   GERAR ETIQUETA
===================================================== */

function gerarEtiqueta() {

    const produtoCampo =
        document.getElementById("produtoEtiqueta");

    const fabricacaoCampo =
        document.getElementById("fabricacaoEtiqueta");

    const validadeCampo =
        document.getElementById("validadeEtiqueta");


    const produtoNome =
        document.getElementById("mostrarProduto");

    const mostrarFabricacao =
        document.getElementById("mostrarFabricacao");

    const mostrarValidade =
        document.getElementById("mostrarValidade");

    const codigoBarras =
        document.getElementById("codigoBarrasEtiqueta");


    if (
        !produtoCampo ||
        !fabricacaoCampo ||
        !validadeCampo ||
        !produtoNome ||
        !mostrarFabricacao ||
        !mostrarValidade ||
        !codigoBarras
    ) {

        alert(
            "Não foi possível localizar os campos da etiqueta."
        );

        return;
    }


    const produto =
        Array.isArray(produtos)
            ? produtos.find(function(item) {

                return (
                    item.codigo ===
                    produtoCampo.value
                );

            })
            : null;


    if (!produto) {

        alert(
            "Selecione um produto."
        );

        return;
    }


    if (
        !fabricacaoCampo.value
    ) {

        alert(
            "Informe a data de fabricação."
        );

        return;
    }


    if (
        !validadeCampo.value
    ) {

        alert(
            "Informe a data de validade."
        );

        return;
    }


    /* =================================================
       PREENCHER INFORMAÇÕES
    ================================================= */

    produtoNome.textContent =
        produto.nome ||
        "Produto";


    mostrarFabricacao.textContent =
        formatarDataEtiqueta(
            fabricacaoCampo.value
        );


    mostrarValidade.textContent =
        formatarDataEtiqueta(
            validadeCampo.value
        );


    /* =================================================
       LIMPAR CÓDIGO ANTERIOR
    ================================================= */

    codigoBarras.innerHTML = "";


    /* =================================================
       CÓDIGO EAN-13 DO PRODUTO
    ================================================= */

    const codigo =
        String(
            produto.codigoBarras || ""
        )
        .replace(
            /\D/g,
            ""
        );


    if (
        codigo.length !== 13
    ) {

        alert(
            "O produto precisa possuir um código EAN-13 válido para gerar a etiqueta."
        );

        return;
    }


    /* =================================================
       ÁREA CENTRAL DO CÓDIGO DE BARRAS
       
       O SVG FICA DENTRO DE UM CONTAINER
       PARA IMPEDIR QUE O CÓDIGO ULTRAPASSE
       A ÁREA DA ETIQUETA.
    ================================================= */

    const areaCodigo =
        document.createElement("div");


    areaCodigo.style.width =
        "100%";

    areaCodigo.style.height =
        "58px";

    areaCodigo.style.display =
        "flex";

    areaCodigo.style.justifyContent =
        "center";

    areaCodigo.style.alignItems =
        "center";

    areaCodigo.style.overflow =
        "hidden";

    areaCodigo.style.boxSizing =
        "border-box";


    codigoBarras.appendChild(
        areaCodigo
    );


    /* =================================================
       CRIAR SVG
    ================================================= */

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.id =
        "barcodeGerado";


    areaCodigo.appendChild(
        svg
    );


    /* =================================================
       GERAR EAN-13
    ================================================= */

    if (
        typeof JsBarcode !==
        "function"
    ) {

        alert(
            "A biblioteca JsBarcode não foi carregada."
        );

        return;
    }


    JsBarcode(
        svg,
        codigo,
        {

            format:
                "EAN13",

            width:
                1.5,

            height:
                48,

            displayValue:
                true,

            fontSize:
                10,

            fontOptions:
                "normal",

            textAlign:
                "center",

            textPosition:
                "bottom",

            textMargin:
                1,

            margin:
                0,

            marginTop:
                0,

            marginBottom:
                0,

            marginLeft:
                0,

            marginRight:
                0,

            flat:
                true

        }
    );

}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatarDataEtiqueta(data) {

    if (!data) {

        return "--/--/----";
    }


    const partes =
        String(data).split("-");


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

}


/* =====================================================
   SALVAR ETIQUETA COMO PNG
===================================================== */

function salvarEtiquetaPNG() {

    const etiqueta =
        document.getElementById(
            "etiquetaGerada"
        );


    if (!etiqueta) {

        alert(
            "Não foi possível localizar a etiqueta."
        );

        return;
    }


    if (
        typeof html2canvas !==
        "function"
    ) {

        alert(
            "A biblioteca para gerar imagem não foi carregada."
        );

        return;
    }


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
    )
    .then(function(canvas) {

        const link =
            document.createElement("a");


        link.download =
            "etiqueta-carols-gourmet.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

    })
    .catch(function(erro) {

        console.error(
            "Erro ao gerar etiqueta:",
            erro
        );

        alert(
            "Não foi possível gerar a imagem da etiqueta."
        );

    });

}


/* =====================================================
   INICIALIZAR ETIQUETAS
===================================================== */

function inicializarEtiquetas() {

    atualizarProdutosEtiquetas();


    const fabricacao =
        document.getElementById(
            "fabricacaoEtiqueta"
        );


    if (
        fabricacao &&
        !fabricacao.value
    ) {

        fabricacao.value =
            new Date()
            .toISOString()
            .split("T")[0];

    }


    calcularValidadeEtiqueta();

}


/* =====================================================
   ATUALIZAR ETIQUETAS QUANDO PRODUTOS MUDAM
===================================================== */

function atualizarModuloEtiquetas() {

    atualizarProdutosEtiquetas();

    calcularValidadeEtiqueta();

}


/* =====================================================
   EXPORTAR FUNÇÕES PARA O HTML
===================================================== */

window.atualizarProdutosEtiquetas =
    atualizarProdutosEtiquetas;

window.calcularValidadeEtiqueta =
    calcularValidadeEtiqueta;

window.gerarEtiqueta =
    gerarEtiqueta;

window.salvarEtiquetaPNG =
    salvarEtiquetaPNG;

window.inicializarEtiquetas =
    inicializarEtiquetas;

window.atualizarModuloEtiquetas =
    atualizarModuloEtiquetas;
