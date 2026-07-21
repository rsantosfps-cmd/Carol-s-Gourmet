/*=========================================================
    CAROL'S GOURMET ERP
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
    INICIALIZAÇÃO DO SISTEMA
=========================================================*/


document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
);



function iniciarSistema(){


    console.log(
        "Carol's Gourmet ERP iniciado"
    );


    carregarBanco();


    configurarDatas();


    atualizarDashboard();


    mostrarAba(
        "dashboard"
    );


}




/*=========================================================
    BANCO LOCAL
=========================================================*/


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



/*=========================================================
    MENU LATERAL
=========================================================*/


function toggleMenu(){


    const menu =
        document.getElementById(
            "menuLateral"
        );


    if(menu){

        menu.classList.toggle(
            "fechado"
        );

    }


}



/*=========================================================
    CONTROLE DAS ABAS
=========================================================*/


function mostrarAba(
    id,
    botao = null
){



    const abas =
        document.querySelectorAll(
            ".aba"
        );



    abas.forEach(function(aba){


        aba.classList.remove(
            "ativa"
        );


    });





    const selecionada =
        document.getElementById(
            id
        );



    if(selecionada){


        selecionada.classList.add(
            "ativa"
        );


    }





    const botoes =
        document.querySelectorAll(
            ".menu-item"
        );



    botoes.forEach(function(item){


        item.classList.remove(
            "ativo"
        );


    });




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


        totalProdutos.innerText =
            produtos.length;


    }





    const ultima =
        document.getElementById(
            "ultimaAtualizacao"
        );



    if(ultima){


        ultima.innerText =
            new Date()
            .toLocaleString(
                "pt-BR"
            );


    }


}



/*=========================================================
    DATAS AUTOMÁTICAS
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



    campos.forEach(function(id){



        const campo =
            document.getElementById(
                id
            );



        if(campo){


            campo.value =
                hoje;


        }


    });



}



/*=========================================================
    GERAR CÓDIGO INTERNO
=========================================================*/


function gerarCodigoInterno(
    prefixo
){


    const numero =
        Date.now()
        .toString()
        .slice(-6);



    return prefixo + numero;


}




/*=========================================================
    GERAR EAN-13
=========================================================*/


function gerarEAN13(){



    let codigo =
        "789";



    while(codigo.length < 12){


        codigo +=
            Math.floor(
                Math.random()*10
            );


    }




    let soma = 0;



    for(
        let i = 0;
        i < 12;
        i++
    ){


        let numero =
            parseInt(
                codigo[i]
            );



        soma +=
            (i % 2 === 0)
            ?
            numero
            :
            numero * 3;


    }




    let digito =
        (
            10 -
            (soma % 10)
        )
        %
        10;




    return codigo + digito;


}
/*=========================================================
    PARTE 2 - MÓDULO DE PRODUTOS
=========================================================*/


let produtoEditando = -1;



/*=========================================================
    NOVO CADASTRO DE PRODUTO
=========================================================*/


function iniciarFormularioProduto(){


    const codigo =
        document.getElementById(
            "codigoInterno"
        );


    const barras =
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



    if(barras){

        barras.value =
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



    produtoEditando = -1;


}




/*=========================================================
    SALVAR PRODUTO
=========================================================*/


function salvarProduto(){


    const produto = {


        codigo:
            document
            .getElementById(
                "codigoInterno"
            )
            .value,


        codigoBarras:
            document
            .getElementById(
                "codigoBarras"
            )
            .value,


        nome:
            document
            .getElementById(
                "nomeProduto"
            )
            .value
            .trim(),


        categoria:
            document
            .getElementById(
                "categoriaProduto"
            )
            .value,


        unidade:
            document
            .getElementById(
                "unidadeProduto"
            )
            .value,


        status:
            document
            .getElementById(
                "statusProduto"
            )
            .value


    };





    if(produto.nome === ""){


        alert(
            "Informe o nome do produto."
        );


        return;


    }






    if(produtoEditando === -1){


        produtos.push(
            produto
        );


    }
    else{


        produtos[
            produtoEditando
        ] =
            produto;


    }





    salvarBanco();


    atualizarTabelaProdutos();


    atualizarSelectProdutos();


    atualizarDashboard();


    iniciarFormularioProduto();



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



    if(!tabela)
        return;




    tabela.innerHTML = "";





    produtos.forEach(
        function(produto, indice){



        tabela.innerHTML += `

        <tr>

            <td>
                ${produto.codigo}
            </td>


            <td>
                ${produto.nome}
            </td>


            <td>
                ${produto.codigoBarras}
            </td>


            <td>
                ${produto.categoria}
            </td>


            <td>
                ${produto.unidade}
            </td>


            <td>
                ${produto.status}
            </td>


            <td>


                <button onclick="editarProduto(${indice})">

                    ✏️

                </button>



                <button onclick="excluirProduto(${indice})">

                    🗑️

                </button>


            </td>


        </tr>

        `;


    });


}





/*=========================================================
    EDITAR PRODUTO
=========================================================*/


function editarProduto(indice){



    const produto =
        produtos[indice];



    produtoEditando =
        indice;



    document.getElementById(
        "codigoInterno"
    ).value =
        produto.codigo;



    document.getElementById(
        "codigoBarras"
    ).value =
        produto.codigoBarras;



    document.getElementById(
        "nomeProduto"
    ).value =
        produto.nome;



    document.getElementById(
        "categoriaProduto"
    ).value =
        produto.categoria;



    document.getElementById(
        "unidadeProduto"
    ).value =
        produto.unidade;



    document.getElementById(
        "statusProduto"
    ).value =
        produto.status;



}






/*=========================================================
    EXCLUIR PRODUTO
=========================================================*/


function excluirProduto(indice){



    if(
        !confirm(
            "Deseja excluir este produto?"
        )
    )
    return;




    produtos.splice(
        indice,
        1
    );



    salvarBanco();



    atualizarTabelaProdutos();



    atualizarDashboard();



    atualizarSelectProdutos();


}






/*=========================================================
    PESQUISA
=========================================================*/


function pesquisarProduto(){



    const texto =
        document
        .getElementById(
            "pesquisaProduto"
        )
        .value
        .toLowerCase();




    document
    .querySelectorAll(
        "#listaProdutos tr"
    )
    .forEach(function(linha){



        linha.style.display =

        linha.innerText
        .toLowerCase()
        .includes(texto)

        ?

        ""

        :

        "none";



    });


}





/*=========================================================
    LISTAS DE PRODUTOS
=========================================================*/


function atualizarSelectProdutos(){



    const selects = [


        "produtoMovimentacao",

        "produtoProducao",

        "produtoEtiqueta",

        "produtoPreco"


    ];




    selects.forEach(function(id){



        const select =
            document.getElementById(
                id
            );



        if(!select)
            return;




        select.innerHTML = "";





        produtos.forEach(function(produto){



            select.innerHTML += `

            <option value="${produto.codigo}">

                ${produto.nome}

            </option>

            `;


        });



    });



}





/*=========================================================
    BOTÃO NOVO
=========================================================*/


function novoCadastro(){


    iniciarFormularioProduto();


}
