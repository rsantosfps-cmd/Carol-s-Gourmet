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
   MÓDULO DE PRODUÇÃO
   CAROL'S GOURMET ERP 4.0
===================================================== */


/* =====================================================
   CALCULAR VALIDADE AUTOMÁTICA
===================================================== */

function calcularValidadeProducao() {

    const produtoCampo =
        document.getElementById("produtoProducao");

    const fabricacaoCampo =
        document.getElementById("fabricacaoProducao");

    const validadeCampo =
        document.getElementById("validadeProducao");


    if (
        !produtoCampo ||
        !fabricacaoCampo ||
        !validadeCampo
    ) {

        return;

    }


    const produtoSelecionado =
        produtos.find(function(produto) {

            return (
                produto.codigo ===
                produtoCampo.value
            );

        });


    if (!produtoSelecionado) {

        validadeCampo.value = "";

        validadeCampo.readOnly = true;

        return;

    }


    const nomeProduto =
        (
            produtoSelecionado.nome ||
            ""
        )
        .toLowerCase()
        .trim();


    /* =================================================
       DEFINIR PRAZO DE VALIDADE
    ================================================= */

    let diasValidade = null;


    if (
        nomeProduto.includes("palha italiana")
    ) {

        diasValidade = 20;

    }


    else if (
        nomeProduto.includes("brownie")
    ) {

        diasValidade = 20;

    }


    else if (
        nomeProduto.includes("bolo de pote")
    ) {

        diasValidade = 7;

    }


    /* =================================================
       PRODUTOS COM VALIDADE MANUAL
    ================================================= */

    if (
        diasValidade === null
    ) {

        validadeCampo.readOnly = false;

        validadeCampo.value = "";

        return;

    }


    /* =================================================
       VALIDADE AUTOMÁTICA
    ================================================= */

    validadeCampo.readOnly = true;


    if (
        !fabricacaoCampo.value
    ) {

        validadeCampo.value = "";

        return;

    }


    const dataFabricacao =
        new Date(
            fabricacaoCampo.value +
            "T00:00:00"
        );


    if (
        isNaN(
            dataFabricacao.getTime()
        )
    ) {

        validadeCampo.value = "";

        return;

    }


    dataFabricacao.setDate(
        dataFabricacao.getDate() +
        diasValidade
    );


    const ano =
        dataFabricacao.getFullYear();


    const mes =
        String(
            dataFabricacao.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const dia =
        String(
            dataFabricacao.getDate()
        )
        .padStart(
            2,
            "0"
        );


    validadeCampo.value =
        ano +
        "-" +
        mes +
        "-" +
        dia;

}


/* =====================================================
   ATUALIZAR PRODUTOS NO SELECT DE PRODUÇÃO
===================================================== */

function atualizarProdutosProducao() {

    const select =
        document.getElementById(
            "produtoProducao"
        );


    if (!select) {

        return;

    }


    select.innerHTML = "";


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


        select.appendChild(
            option
        );


        return;

    }


    const opcaoInicial =
        document.createElement(
            "option"
        );


    opcaoInicial.value =
        "";


    opcaoInicial.textContent =
        "Selecione um produto";


    select.appendChild(
        opcaoInicial
    );


    produtos.forEach(
        function(
            produto
        ) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                produto.codigo ||
                "";


            option.textContent =
                (
                    produto.codigo ||
                    ""
                ) +
                " - " +
                (
                    produto.nome ||
                    "Produto sem nome"
                );


            select.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   REGISTRAR PRODUÇÃO
===================================================== */

function registrarProducao() {


    /* =================================================
       LOCALIZAR CAMPOS
    ================================================= */

    const produtoCampo =
        document.getElementById(
            "produtoProducao"
        );


    const quantidadeCampo =
        document.getElementById(
            "quantidadeProducao"
        );


    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoProducao"
        );


    const validadeCampo =
        document.getElementById(
            "validadeProducao"
        );


    const observacaoCampo =
        document.getElementById(
            "observacaoProducao"
        );


    /* =================================================
       VERIFICAR CAMPOS
    ================================================= */

    if (
        !produtoCampo ||
        !quantidadeCampo ||
        !fabricacaoCampo ||
        !validadeCampo ||
        !observacaoCampo
    ) {

        alert(
            "Não foi possível localizar os campos de produção."
        );

        return;

    }


    /* =================================================
       PEGAR VALORES
    ================================================= */

    const codigoProduto =
        produtoCampo.value;


    const quantidade =
        Number(
            quantidadeCampo.value
        );


    const fabricacao =
        fabricacaoCampo.value;


    const validade =
        validadeCampo.value;


    const observacao =
        observacaoCampo.value.trim();


    /* =================================================
       VALIDAR PRODUTO
    ================================================= */

    if (
        codigoProduto === ""
    ) {

        alert(
            "Selecione um produto."
        );

        produtoCampo.focus();

        return;

    }


    /* =================================================
       VALIDAR QUANTIDADE
    ================================================= */

    if (
        !Number.isFinite(
            quantidade
        ) ||
        quantidade <= 0
    ) {

        alert(
            "Informe uma quantidade produzida válida."
        );

        quantidadeCampo.focus();

        return;

    }


    /* =================================================
       VALIDAR DATA DE FABRICAÇÃO
    ================================================= */

    if (
        fabricacao === ""
    ) {

        alert(
            "Informe a data de fabricação."
        );

        fabricacaoCampo.focus();

        return;

    }


    /* =================================================
       LOCALIZAR PRODUTO
    ================================================= */

    const indiceProduto =
        produtos.findIndex(
            function(produto) {

                return (
                    produto.codigo ===
                    codigoProduto
                );

            }
        );


    if (
        indiceProduto === -1
    ) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const produto =
        produtos[
            indiceProduto
        ];


    /* =================================================
       VALIDAR VALIDADE
    ================================================= */

    if (
        validade === ""
    ) {

        alert(
            "Informe a validade do produto."
        );

        validadeCampo.focus();

        return;

    }


    /* =================================================
       GARANTIR ESTOQUE
    ================================================= */

    if (
        produto.estoque === undefined ||
        produto.estoque === null ||
        isNaN(
            Number(
                produto.estoque
            )
        )
    ) {

        produto.estoque =
            0;

    }


    /* =================================================
       SOMAR PRODUÇÃO AO ESTOQUE
    ================================================= */

    produto.estoque =
        Number(
            produto.estoque
        ) +
        quantidade;


    /* =================================================
       GARANTIR ARRAY DE PRODUÇÕES
    ================================================= */

    if (
        !Array.isArray(
            producoes
        )
    ) {

        producoes = [];

    }


    /* =================================================
       CRIAR REGISTRO DA PRODUÇÃO
    ================================================= */

    const registro =
        {

            id:
                Date.now(),

            codigoProduto:
                produto.codigo ||
                "",

            codigoBarras:
                produto.codigoBarras ||
                "",

            produto:
                produto.nome ||
                "",

            quantidade:
                quantidade,

            fabricacao:
                fabricacao,

            validade:
                validade,

            observacao:
                observacao,

            dataRegistro:
                new Date()
                .toISOString()

        };


    /* =================================================
       SALVAR PRODUÇÃO
    ================================================= */

    producoes.push(
        registro
    );


    /* =================================================
       SALVAR BANCO
    ================================================= */

    salvarBanco();


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
       ATUALIZAR DASHBOARD
    ================================================= */

    if (
        typeof atualizarDashboard ===
        "function"
    ) {

        atualizarDashboard();

    }


    /* =================================================
       ATUALIZAR LISTA DE PRODUÇÃO
    ================================================= */

    mostrarProducoes();


    /* =================================================
       ATUALIZAR OUTROS SELECTS
    ================================================= */

    if (
        typeof atualizarItensMovimentacao ===
        "function"
    ) {

        atualizarItensMovimentacao();

    }


    if (
        typeof atualizarProdutosPrecificacao ===
        "function"
    ) {

        atualizarProdutosPrecificacao();

    }


    /* =================================================
       MENSAGEM
    ================================================= */

    alert(
        "Produção registrada com sucesso!"
    );


    /* =================================================
       LIMPAR CAMPOS
    ================================================= */

    quantidadeCampo.value =
        "1";


    observacaoCampo.value =
        "";


    validadeCampo.value =
        "";


    produtoCampo.value =
        "";


    fabricacaoCampo.value =
        new Date()
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   MOSTRAR PRODUÇÕES
===================================================== */

function mostrarProducoes() {


    const tabela =
        document.getElementById(
            "listaProducao"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML =
        "";


    if (
        !Array.isArray(
            producoes
        ) ||
        producoes.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td colspan="4">

                    Nenhuma produção registrada.

                </td>

            </tr>

        `;


        return;

    }


    producoes
        .slice()
        .reverse()
        .forEach(
            function(
                producao
            ) {


                const dataFabricacao =
                    formatarDataProducao(
                        producao.fabricacao
                    );


                const dataValidade =
                    formatarDataProducao(
                        producao.validade
                    );


                tabela.innerHTML += `

                    <tr>

                        <td>

                            ${
                                producao.produto ||
                                ""
                            }

                        </td>


                        <td>

                            ${
                                producao.quantidade ||
                                0
                            }

                        </td>


                        <td>

                            ${
                                dataFabricacao
                            }

                        </td>


                        <td>

                            ${
                                dataValidade
                            }

                        </td>

                    </tr>

                `;

            }
        );

}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatarDataProducao(
    data
) {


    if (
        !data
    ) {

        return "";

    }


    const partes =
        data.split(
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


/* =====================================================
   INICIALIZAR MÓDULO DE PRODUÇÃO
===================================================== */

function inicializarProducao() {


    /* =================================================
       GARANTIR ARRAY
    ================================================= */

    if (
        !Array.isArray(
            producoes
        )
    ) {

        producoes = [];

    }


    /* =================================================
       ATUALIZAR PRODUTOS
    ================================================= */

    atualizarProdutosProducao();


    /* =================================================
       MOSTRAR HISTÓRICO
    ================================================= */

    mostrarProducoes();


    /* =================================================
       DATA DE FABRICAÇÃO
    ================================================= */

    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoProducao"
        );


    if (
        fabricacaoCampo &&
        !fabricacaoCampo.value
    ) {

        fabricacaoCampo.value =
            new Date()
            .toISOString()
            .split("T")[0];

    }

}


/* =====================================================
   EVENTOS DA PRODUÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        inicializarProducao();


        const produtoCampo =
            document.getElementById(
                "produtoProducao"
            );


        const fabricacaoCampo =
            document.getElementById(
                "fabricacaoProducao"
            );


        if (
            produtoCampo
        ) {

            produtoCampo.addEventListener(
                "change",
                calcularValidadeProducao
            );

        }


        if (
            fabricacaoCampo
        ) {

            fabricacaoCampo.addEventListener(
                "change",
                calcularValidadeProducao
            );

        }

    }
);
/* =====================================================
   MÓDULO DE ETIQUETAS
   CAROL'S GOURMET ERP 4.0
===================================================== */


/* =====================================================
   ATUALIZAR PRODUTOS NO SELECT DE ETIQUETAS
===================================================== */

function atualizarProdutosEtiqueta() {

    const select =
        document.getElementById(
            "produtoEtiqueta"
        );


    if (
        !select
    ) {

        return;

    }


    select.innerHTML = "";


    /* =================================================
       VERIFICAR PRODUTOS
    ================================================= */

    if (
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            "";


        option.textContent =
            "Nenhum produto cadastrado";


        select.appendChild(
            option
        );


        return;

    }


    /* =================================================
       OPÇÃO INICIAL
    ================================================= */

    const primeiraOpcao =
        document.createElement(
            "option"
        );


    primeiraOpcao.value =
        "";


    primeiraOpcao.textContent =
        "Selecione um produto";


    select.appendChild(
        primeiraOpcao
    );


    /* =================================================
       CARREGAR PRODUTOS
    ================================================= */

    produtos.forEach(
        function(
            produto
        ) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                produto.codigo ||
                "";


            option.textContent =
                (
                    produto.nome ||
                    "Produto sem nome"
                ) +
                " - " +
                (
                    produto.codigoBarras ||
                    "Sem código"
                );


            select.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   CALCULAR VALIDADE DA ETIQUETA
===================================================== */

function calcularValidadeEtiqueta() {


    const produtoCampo =
        document.getElementById(
            "produtoEtiqueta"
        );


    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoEtiqueta"
        );


    const validadeCampo =
        document.getElementById(
            "validadeEtiqueta"
        );


    if (
        !produtoCampo ||
        !fabricacaoCampo ||
        !validadeCampo
    ) {

        return;

    }


    /* =================================================
       LOCALIZAR PRODUTO
    ================================================= */

    const produtoSelecionado =
        produtos.find(
            function(
                produto
            ) {

                return (
                    produto.codigo ===
                    produtoCampo.value
                );

            }
        );


    if (
        !produtoSelecionado
    ) {

        validadeCampo.value =
            "";

        validadeCampo.readOnly =
            true;

        return;

    }


    /* =================================================
       NOME DO PRODUTO
    ================================================= */

    const nomeProduto =
        (
            produtoSelecionado.nome ||
            ""
        )
        .toLowerCase()
        .trim();


    /* =================================================
       DEFINIR VALIDADE
    ================================================= */

    let diasValidade =
        null;


    /* ---------------------------------------------
       PALHA ITALIANA
    --------------------------------------------- */

    if (
        nomeProduto.includes(
            "palha italiana"
        )
    ) {

        diasValidade =
            20;

    }


    /* ---------------------------------------------
       BROWNIE
    --------------------------------------------- */

    else if (
        nomeProduto.includes(
            "brownie"
        )
    ) {

        diasValidade =
            20;

    }


    /* ---------------------------------------------
       BOLO DE POTE
    --------------------------------------------- */

    else if (
        nomeProduto.includes(
            "bolo de pote"
        )
    ) {

        diasValidade =
            7;

    }


    /* =================================================
       VALIDADE MANUAL
    ================================================= */

    if (
        diasValidade ===
        null
    ) {

        validadeCampo.readOnly =
            false;


        validadeCampo.value =
            "";


        return;

    }


    /* =================================================
       VALIDADE AUTOMÁTICA
    ================================================= */

    validadeCampo.readOnly =
        true;


    if (
        !fabricacaoCampo.value
    ) {

        validadeCampo.value =
            "";

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

        validadeCampo.value =
            "";

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
        .padStart(
            2,
            "0"
        );


    const dia =
        String(
            data.getDate()
        )
        .padStart(
            2,
            "0"
        );


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
        document.getElementById(
            "produtoEtiqueta"
        );


    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoEtiqueta"
        );


    const validadeCampo =
        document.getElementById(
            "validadeEtiqueta"
        );


    const codigoBarrasCampo =
        document.getElementById(
            "codigoBarrasEtiqueta"
        );


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


    if (
        !produtoCampo ||
        !fabricacaoCampo ||
        !validadeCampo ||
        !codigoBarrasCampo ||
        !mostrarProduto ||
        !mostrarFabricacao ||
        !mostrarValidade
    ) {

        alert(
            "Não foi possível localizar os campos da etiqueta."
        );

        return;

    }


    /* =================================================
       VALIDAR PRODUTO
    ================================================= */

    if (
        produtoCampo.value === ""
    ) {

        alert(
            "Selecione um produto."
        );

        produtoCampo.focus();

        return;

    }


    /* =================================================
       LOCALIZAR PRODUTO
    ================================================= */

    const produto =
        produtos.find(
            function(
                item
            ) {

                return (
                    item.codigo ===
                    produtoCampo.value
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


    /* =================================================
       VALIDAR FABRICAÇÃO
    ================================================= */

    if (
        fabricacaoCampo.value === ""
    ) {

        alert(
            "Informe a data de fabricação."
        );

        fabricacaoCampo.focus();

        return;

    }


    /* =================================================
       CALCULAR VALIDADE
    ================================================= */

    calcularValidadeEtiqueta();


    if (
        validadeCampo.value === ""
    ) {

        alert(
            "Informe a validade do produto."
        );

        validadeCampo.focus();

        return;

    }


    /* =================================================
       PEGAR CÓDIGO DE BARRAS
    ================================================= */

    const codigoBarras =
        produto.codigoBarras ||
        "";


    if (
        codigoBarras === ""
    ) {

        alert(
            "Este produto não possui código de barras cadastrado."
        );

        return;

    }


    /* =================================================
       MOSTRAR NOME
    ================================================= */

    mostrarProduto.textContent =
        produto.nome ||
        "Produto";


    /* =================================================
       MOSTRAR DATA DE FABRICAÇÃO
    ================================================= */

    mostrarFabricacao.textContent =
        formatarDataEtiqueta(
            fabricacaoCampo.value
        );


    /* =================================================
       MOSTRAR VALIDADE
    ================================================= */

    mostrarValidade.textContent =
        formatarDataEtiqueta(
            validadeCampo.value
        );


    /* =================================================
       LIMPAR CÓDIGO ANTERIOR
    ================================================= */

    codigoBarrasCampo.innerHTML =
        "";


    /* =================================================
       GERAR CÓDIGO DE BARRAS
       EAN-13
    ================================================= */

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    codigoBarrasCampo.appendChild(
        svg
    );


    try {

        JsBarcode(
            svg,
            codigoBarras,
            {

                format:
                    "EAN13",

                width:
                    1.5,

                height:
                    35,

                displayValue:
                    true,

                fontSize:
                    10,

                margin:
                    0,

                textMargin:
                    2

            }
        );

    }

    catch (
        erro
    ) {

        console.error(
            erro
        );


        alert(
            "Não foi possível gerar o código de barras."
        );


        codigoBarrasCampo.innerHTML =
            "";


        return;

    }

}


/* =====================================================
   FORMATAR DATA DA ETIQUETA
===================================================== */

function formatarDataEtiqueta(
    data
) {


    if (
        !data
    ) {

        return "--/--/----";

    }


    const partes =
        data.split(
            "-"
        );


    if (
        partes.length ===
        3
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


/* =====================================================
   SALVAR ETIQUETA COMO PNG
===================================================== */

function salvarEtiquetaPNG() {


    const etiqueta =
        document.getElementById(
            "etiquetaGerada"
        );


    if (
        !etiqueta
    ) {

        alert(
            "Etiqueta não encontrada."
        );

        return;

    }


    /* =================================================
       VERIFICAR SE EXISTE PRODUTO
    ================================================= */

    const produtoCampo =
        document.getElementById(
            "produtoEtiqueta"
        );


    if (
        !produtoCampo ||
        produtoCampo.value === ""
    ) {

        alert(
            "Selecione um produto e gere a visualização primeiro."
        );

        return;

    }


    /* =================================================
       VERIFICAR HTML2CANVAS
    ================================================= */

    if (
        typeof html2canvas !==
        "function"
    ) {

        alert(
            "A biblioteca de geração de imagem não está carregada."
        );

        return;

    }


    /* =================================================
       GERAR IMAGEM
    ================================================= */

    html2canvas(
        etiqueta,
        {

            scale:
                3,

            backgroundColor:
                "#ffffff"

        }
    )
    .then(
        function(
            canvas
        ) {


            const link =
                document.createElement(
                    "a"
                );


            const produto =
                produtos.find(
                    function(
                        item
                    ) {

                        return (
                            item.codigo ===
                            produtoCampo.value
                        );

                    }
                );


            const nomeArquivo =
                produto &&
                produto.nome
                    ? produto.nome
                        .replace(
                            /[^a-zA-Z0-9À-ÿ ]/g,
                            ""
                        )
                        .replace(
                            /\s+/g,
                            "_"
                        )
                    : "etiqueta";


            link.download =
                "etiqueta_" +
                nomeArquivo +
                ".png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();

        }
    )
    .catch(
        function(
            erro
        ) {

            console.error(
                erro
            );


            alert(
                "Não foi possível gerar a imagem da etiqueta."
            );

        }
    );

}


/* =====================================================
   INICIALIZAR ETIQUETAS
===================================================== */

function inicializarEtiquetas() {


    /* =================================================
       CARREGAR PRODUTOS
    ================================================= */

    atualizarProdutosEtiqueta();


    /* =================================================
       DATA DE FABRICAÇÃO
    ================================================= */

    const fabricacaoCampo =
        document.getElementById(
            "fabricacaoEtiqueta"
        );


    if (
        fabricacaoCampo &&
        !fabricacaoCampo.value
    ) {

        fabricacaoCampo.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    /* =================================================
       LIMPAR VALIDADE
    ================================================= */

    const validadeCampo =
        document.getElementById(
            "validadeEtiqueta"
        );


    if (
        validadeCampo
    ) {

        validadeCampo.value =
            "";

        validadeCampo.readOnly =
            true;

    }

}


/* =====================================================
   EVENTOS DAS ETIQUETAS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        inicializarEtiquetas();


        /* =================================================
           PRODUTO ALTERADO
        ================================================= */

        const produtoCampo =
            document.getElementById(
                "produtoEtiqueta"
            );


        if (
            produtoCampo
        ) {

            produtoCampo.addEventListener(
                "change",
                function() {

                    calcularValidadeEtiqueta();

                }
            );

        }


        /* =================================================
           DATA DE FABRICAÇÃO ALTERADA
        ================================================= */

        const fabricacaoCampo =
            document.getElementById(
                "fabricacaoEtiqueta"
            );


        if (
            fabricacaoCampo
        ) {

            fabricacaoCampo.addEventListener(
                "change",
                function() {

                    calcularValidadeEtiqueta();

                }
            );

        }

    }
);
