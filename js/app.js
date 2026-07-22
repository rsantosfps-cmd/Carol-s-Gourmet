/*=========================================================
    CAROL'S GOURMET ERP 4.0
    APP.JS
    PARTE 1 - BASE DO SISTEMA
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
    INICIALIZAÇÃO DO SISTEMA
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
);


function iniciarSistema(){

    console.log(
        "Carol's Gourmet ERP 4.0 iniciado."
    );


    // Carrega os dados salvos

    carregarBanco();


    // Configura as datas do sistema

    configurarDatas();


    // Inicializa o Dashboard

    atualizarDashboard();


    // Inicializa o formulário de produto

    novoCadastro();


    // Inicializa o formulário de matéria-prima

    novaMateriaPrima();


    // Atualiza tabelas

    atualizarTabelaProdutos();

    atualizarTabelaMateriaPrima();


    // Atualiza listas

    atualizarSelectProdutos();


    // Abre o Dashboard

    mostrarAba(
        "dashboard"
    );

}


/*=========================================================
    BANCO DE DADOS LOCAL
=========================================================*/

function carregarBanco(){


    produtos =
        JSON.parse(
            localStorage.getItem(
                "produtos"
            )
        ) || [];



    materiasPrimas =
        JSON.parse(
            localStorage.getItem(
                "materiasPrimas"
            )
        ) || [];



    movimentacoes =
        JSON.parse(
            localStorage.getItem(
                "movimentacoes"
            )
        ) || [];



    producoes =
        JSON.parse(
            localStorage.getItem(
                "producoes"
            )
        ) || [];



    precificacoes =
        JSON.parse(
            localStorage.getItem(
                "precificacoes"
            )
        ) || [];

}


/*=========================================================
    SALVAR BANCO
=========================================================*/

function salvarBanco(){


    localStorage.setItem(
        "produtos",
        JSON.stringify(
            produtos
        )
    );


    localStorage.setItem(
        "materiasPrimas",
        JSON.stringify(
            materiasPrimas
        )
    );


    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(
            movimentacoes
        )
    );


    localStorage.setItem(
        "producoes",
        JSON.stringify(
            producoes
        )
    );


    localStorage.setItem(
        "precificacoes",
        JSON.stringify(
            precificacoes
        )
    );

}


/*=========================================================
    MENU LATERAL
=========================================================*/

function toggleMenu(){


    const menu =
        document.getElementById(
            "menuLateral"
        );


    if(!menu){

        return;

    }


    menu.classList.toggle(
        "fechado"
    );

}


/*=========================================================
    CONTROLE DAS ABAS
=========================================================*/

function mostrarAba(
    id,
    botao = null
){


    // Esconde todas as abas

    const abas =
        document.querySelectorAll(
            ".aba"
        );


    abas.forEach(
        function(aba){

            aba.classList.remove(
                "ativa"
            );

        }
    );


    // Mostra a aba selecionada

    const abaSelecionada =
        document.getElementById(
            id
        );


    if(abaSelecionada){

        abaSelecionada.classList.add(
            "ativa"
        );

    }


    // Remove destaque dos botões

    const botoes =
        document.querySelectorAll(
            ".menu-item"
        );


    botoes.forEach(
        function(item){

            item.classList.remove(
                "ativo"
            );

        }
    );


    // Destaca o botão clicado

    if(botao){

        botao.classList.add(
            "ativo"
        );

    }

}


/*=========================================================
    DASHBOARD
=========================================================*/

function atualizarDashboard(){


    const totalProdutos =
        document.getElementById(
            "totalProdutos"
        );


    if(totalProdutos){

        totalProdutos.textContent =
            produtos.length;

    }


    const ultimaAtualizacao =
        document.getElementById(
            "ultimaAtualizacao"
        );


    if(ultimaAtualizacao){

        ultimaAtualizacao.textContent =
            new Date().toLocaleString(
                "pt-BR"
            );

    }

}


/*=========================================================
    CONFIGURAÇÃO DE DATAS
=========================================================*/

function configurarDatas(){


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


    campos.forEach(
        function(id){


            const campo =
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


/*=========================================================
    GERADOR DE CÓDIGO INTERNO
=========================================================*/

function gerarCodigoInterno(
    prefixo
){


    const numero =

        Date.now()
        .toString()
        .slice(-6);


    return (

        prefixo +

        numero

    );

}


/*=========================================================
    GERADOR DE EAN-13
=========================================================*/

function gerarEAN13(){


    let codigo = "789";


    while(
        codigo.length < 12
    ){

        codigo +=

            Math.floor(
                Math.random() * 10
            );

    }


    let soma = 0;


    for(
        let i = 0;

        i < 12;

        i++
    ){


        const numero =

            parseInt(
                codigo[i]
            );


        if(
            i % 2 === 0
        ){

            soma += numero;

        }else{

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

        codigo +

        digito

    );

}
/*=========================================================
    PARTE 2 - MÓDULO DE PRODUTOS
=========================================================*/


/*=========================================================
    NOVO CADASTRO DE PRODUTO
=========================================================*/

function novoCadastro(){


    produtoEditando = -1;


    const codigo =
        document.getElementById(
            "codigoInterno"
        );


    const codigoBarras =
        document.getElementById(
            "codigoBarras"
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


    if(codigo){

        codigo.value =
            gerarCodigoInterno(
                "PRD"
            );

    }


    if(codigoBarras){

        codigoBarras.value =
            gerarEAN13();

    }


    if(nome){

        nome.value = "";

    }


    if(categoria){

        categoria.value =
            "Doce";

    }


    if(unidade){

        unidade.value =
            "Unidade";

    }


    if(status){

        status.value =
            "Ativo";

    }

}


/*=========================================================
    SALVAR PRODUTO
=========================================================*/

function salvarProduto(){


    const nome =
        document.getElementById(
            "nomeProduto"
        );


    if(
        !nome ||
        nome.value.trim() === ""
    ){

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


    if(
        produtoEditando === -1
    ){

        produtos.push(
            produto
        );

    }else{

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

}


/*=========================================================
    TABELA DE PRODUTOS
=========================================================*/

function atualizarTabelaProdutos(){


    const tabela =
        document.getElementById(
            "listaProdutos"
        );


    if(!tabela){

        return;

    }


    tabela.innerHTML = "";


    produtos.forEach(
        function(
            produto,
            indice
        ){


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

                </tr>

            `;


        }
    );

}


/*=========================================================
    EDITAR PRODUTO
=========================================================*/

function editarProduto(
    indice
){


    const produto =
        produtos[indice];


    if(!produto){

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


    mostrarAba(
        "produtos"
    );

}


/*=========================================================
    EXCLUIR PRODUTO
=========================================================*/

function excluirProduto(
    indice
){


    if(
        !confirm(
            "Deseja excluir este produto?"
        )
    ){

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

}


/*=========================================================
    PESQUISAR PRODUTO
=========================================================*/

function pesquisarProduto(){


    const campo =
        document.getElementById(
            "pesquisaProduto"
        );


    if(!campo){

        return;

    }


    const texto =
        campo.value
        .toLowerCase();


    const linhas =
        document.querySelectorAll(
            "#listaProdutos tr"
        );


    linhas.forEach(
        function(linha){


            const conteudo =

                linha.innerText
                .toLowerCase();


            if(
                conteudo.includes(
                    texto
                )
            ){

                linha.style.display =
                    "";

            }else{

                linha.style.display =
                    "none";

            }


        }
    );

}


/*=========================================================
    ATUALIZAR SELECTS DE PRODUTOS
=========================================================*/

function atualizarSelectProdutos(){


    const selects = [


        "produtoMovimentacao",


        "produtoProducao",


        "produtoEtiqueta",


        "produtoPreco"


    ];


    selects.forEach(
        function(id){


            const select =
                document.getElementById(
                    id
                );


            if(!select){

                return;

            }


            select.innerHTML = "";


            produtos.forEach(
                function(produto){


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
    );

}
/*=========================================================
    PARTE 3 - MÓDULO DE MATÉRIA-PRIMA
=========================================================*/


/*=========================================================
    NOVO CADASTRO DE MATÉRIA-PRIMA
=========================================================*/

function novaMateriaPrima(){


    materiaPrimaEditando = -1;


    const codigo =
        document.getElementById(
            "codigoMP"
        );


    const codigoBarras =
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


    if(codigo){

        codigo.value =
            gerarCodigoInterno(
                "MP"
            );

    }


    /*
        A matéria-prima não recebe
        código de barras automático.
    */

    if(codigoBarras){

        codigoBarras.value = "";

    }


    if(nome){

        nome.value = "";

    }


    if(categoria){

        categoria.selectedIndex = 0;

    }


    if(unidade){

        unidade.selectedIndex = 0;

    }


    if(estoque){

        estoque.value = "0";

    }


    if(custo){

        custo.value = "";

    }

}


/*=========================================================
    SALVAR MATÉRIA-PRIMA
=========================================================*/

function salvarMateriaPrima(){


    const nome =
        document.getElementById(
            "nomeMP"
        );


    if(
        !nome ||
        nome.value.trim() === ""
    ){

        alert(
            "Informe o nome da matéria-prima."
        );

        return;

    }


    const estoqueCampo =
        document.getElementById(
            "estoqueMP"
        );


    const custoCampo =
        document.getElementById(
            "custoMP"
        );


    const estoque =
        parseFloat(
            estoqueCampo.value
        ) || 0;


    const custo =
        parseFloat(
            custoCampo.value
        ) || 0;


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


            estoque,


        custo:


            custo


    };


    if(
        materiaPrimaEditando === -1
    ){

        materiasPrimas.push(
            materiaPrima
        );

    }else{

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

}


/*=========================================================
    TABELA DE MATÉRIA-PRIMA
=========================================================*/

function atualizarTabelaMateriaPrima(){


    const tabela =
        document.getElementById(
            "listaMateriaPrima"
        );


    if(!tabela){

        return;

    }


    tabela.innerHTML = "";


    materiasPrimas.forEach(
        function(
            materia,
            indice
        ){


            tabela.innerHTML += `

                <tr>

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
                        ${materia.estoque || 0}
                    </td>


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

                </tr>

            `;


        }
    );

}


/*=========================================================
    EDITAR MATÉRIA-PRIMA
=========================================================*/

function editarMateriaPrima(
    indice
){


    const materia =
        materiasPrimas[indice];


    if(!materia){

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


    mostrarAba(
        "materiaPrima"
    );

}


/*=========================================================
    EXCLUIR MATÉRIA-PRIMA
=========================================================*/

function excluirMateriaPrima(
    indice
){


    if(
        !confirm(
            "Deseja excluir esta matéria-prima?"
        )
    ){

        return;

    }


    materiasPrimas.splice(
        indice,
        1
    );


    salvarBanco();


    atualizarTabelaMateriaPrima();


    novaMateriaPrima();

}


/*=========================================================
    PESQUISAR MATÉRIA-PRIMA
=========================================================*/

function pesquisarMateriaPrima(){


    const campo =
        document.getElementById(
            "pesquisaMP"
        );


    if(!campo){

        return;

    }


    const texto =
        campo.value
        .toLowerCase();


    const linhas =
        document.querySelectorAll(
            "#listaMateriaPrima tr"
        );


    linhas.forEach(
        function(linha){


            const conteudo =

                linha.innerText
                .toLowerCase();


            linha.style.display =

                conteudo.includes(
                    texto
                )

                ? ""

                : "none";


        }
    );

}
