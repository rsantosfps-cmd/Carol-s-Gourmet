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
   NOVO PRODUTO
===================================================== */

function novoProduto() {

    produtoEditando = -1;


    const codigo =
        document.getElementById(
            "codigoInterno"
        );


    const barras =
        document.getElementById(
            "codigoBarras"
        );


    if (codigo) {

        codigo.value =
            gerarCodigoProduto();

    }


    if (barras) {

        barras.value =
            gerarEAN();

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

        unidade.value =
            "Unidade";

    }


    const status =
        document.getElementById(
            "statusProduto"
        );


    if (status) {

        status.value =
            "Ativo";

    }

}


/* =====================================================
   SALVAR PRODUTO
===================================================== */

function salvarProduto() {


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

            document.getElementById(
                "nomeProduto"
            ).value.trim(),


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
        produto.nome === ""
    ) {

        alert(
            "Informe o nome do produto."
        );

        return;

    }


    if (
        produtoEditando === -1
    ) {

        produtos.push(
            produto
        );

    } else {

        produtos[
            produtoEditando
        ] =
            produto;

    }


    salvarBanco();


    mostrarProdutos();


    atualizarDashboard();


    alert(
        "Produto salvo com sucesso."
    );


    novoProduto();

}


/* =====================================================
   LISTAR PRODUTOS
===================================================== */

function mostrarProdutos() {


    const tabela =
        document.getElementById(
            "listaProdutos"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    produtos.forEach(
        function (
            produto,
            index
        ) {


            tabela.innerHTML += `

                <tr>

                    <td>
                        ${produto.codigo || ""}
                    </td>


                    <td>
                        ${produto.nome || ""}
                    </td>


                    <td>
                        ${produto.codigoBarras || ""}
                    </td>


                    <td>
                        ${produto.categoria || ""}
                    </td>


                    <td>
                        ${produto.unidade || ""}
                    </td>


                    <td>
                        ${produto.status || ""}
                    </td>


                    <td>

                        <button
                            class="btn btn-primary btn-sm"
                            onclick="editarProduto(${index})">

                            ✏️

                        </button>


                        <button
                            class="btn btn-delete btn-sm"
                            onclick="excluirProduto(${index})">

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

function editarProduto(index) {


    produtoEditando =
        index;


    const produto =
        produtos[index];


    if (!produto) {

        return;

    }


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
        produto.categoria || "";


    document.getElementById(
        "unidadeProduto"
    ).value =
        produto.unidade || "Unidade";


    document.getElementById(
        "statusProduto"
    ).value =
        produto.status || "Ativo";

}


/* =====================================================
   EXCLUIR PRODUTO
===================================================== */

function excluirProduto(index) {


    if (
        !confirm(
            "Excluir este produto?"
        )
    ) {

        return;

    }


    produtos.splice(
        index,
        1
    );


    salvarBanco();


    mostrarProdutos();


    atualizarDashboard();

}


/* =====================================================
   INICIALIZAÇÃO DOS PRODUTOS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarProdutos();

        novoProduto();

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
