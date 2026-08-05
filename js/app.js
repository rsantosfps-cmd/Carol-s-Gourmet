/* =========================================================
   CAROL'S GOURMET ERP 4.0
   APP.JS - PARTE 1
========================================================= */


/* =========================================================
   BANCO LOCAL
========================================================= */

const DB = {

    produtos: "carols_gourmet_produtos",
    materias: "carols_gourmet_materias",
    estoque: "carols_gourmet_estoque",
    producao: "carols_gourmet_producao",
    etiquetas: "carols_gourmet_etiquetas"

};



function carregarBanco(chave) {

    return JSON.parse(
        localStorage.getItem(chave)
    ) || [];

}



function salvarBanco(chave, dados) {

    localStorage.setItem(
        chave,
        JSON.stringify(dados)
    );

}



/* =========================================================
   VARIÁVEIS GLOBAIS
========================================================= */


let produtos = carregarBanco(DB.produtos);

let materias = carregarBanco(DB.materias);

let estoque = carregarBanco(DB.estoque);

let producao = carregarBanco(DB.producao);

let etiquetas = carregarBanco(DB.etiquetas);



/* =========================================================
   MENU / NAVEGAÇÃO
========================================================= */


function toggleMenu(){

    const sidebar =
        document.getElementById("sidebar");


    sidebar.classList.toggle("aberto");

}



function mostrarAba(id, botao){


    document
    .querySelectorAll(".aba")
    .forEach(function(aba){

        aba.classList.remove("ativa");

    });



    const aba =
    document.getElementById(id);



    if(aba){

        aba.classList.add("ativa");

    }



    document
    .querySelectorAll(".menu-item")
    .forEach(function(item){

        item.classList.remove("ativo");

    });



    if(botao){

        botao.classList.add("ativo");

    }



    atualizarTudo();


}




/* =========================================================
   PRODUTOS
========================================================= */



function gerarCodigoProduto(){


    let numero =
    produtos.length + 1;


    return "PROD-" +
    String(numero).padStart(4,"0");


}



function gerarEAN(){


    let numero = "";


    for(let i = 0; i < 12; i++){

        numero +=
        Math.floor(
            Math.random()*10
        );

    }


    return numero;


}




function salvarProduto(){



    const nome =
    document.getElementById(
        "nomeProduto"
    ).value.trim();



    if(!nome){

        alert(
            "Digite o nome do produto"
        );

        return;

    }




    let produto = {


        codigo:
        document.getElementById(
            "codigoProduto"
        ).value
        ||
        gerarCodigoProduto(),



        ean:
        document.getElementById(
            "eanProduto"
        ).value
        ||
        gerarEAN(),



        nome:nome,



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
        ).value,



        estoque:0,


        custo:0,


        valor:0

    };




    produtos.push(produto);



    salvarBanco(
        DB.produtos,
        produtos
    );



    alert(
        "Produto cadastrado!"
    );



    novoProduto();


    atualizarTudo();



}





function novoProduto(){


    const codigo =
    document.getElementById(
        "codigoProduto"
    );


    const ean =
    document.getElementById(
        "eanProduto"
    );



    if(codigo){

        codigo.value =
        gerarCodigoProduto();

    }



    if(ean){

        ean.value =
        gerarEAN();

    }




    document.getElementById(
        "nomeProduto"
    ).value="";



    document.getElementById(
        "categoriaProduto"
    ).value="";



}






function atualizarProdutos(){


    const tabela =
    document.getElementById(
        "listaProdutos"
    );



    if(!tabela){

        return;

    }



    tabela.innerHTML="";




    produtos.forEach(function(produto,index){



        tabela.innerHTML += `


        <tr>


        <td>${produto.codigo}</td>


        <td>${produto.nome}</td>


        <td>${produto.categoria}</td>


        <td>${produto.unidade}</td>


        <td>${produto.estoque || 0}</td>


        <td>
        R$ ${(produto.custo || 0)
        .toFixed(2)}
        </td>


        <td>
        R$ ${(produto.valor || 0)
        .toFixed(2)}
        </td>



        <td>

        <button
        onclick="excluirProduto(${index})">
        🗑️
        </button>


        </td>



        </tr>


        `;



    });



}





function excluirProduto(index){


    if(confirm(
        "Excluir produto?"
    )){


        produtos.splice(
            index,
            1
        );


        salvarBanco(
            DB.produtos,
            produtos
        );


        atualizarTudo();


    }



}







/* =========================================================
   DASHBOARD
========================================================= */


function atualizarDashboard(){



    const totalProdutos =
    document.getElementById(
        "totalProdutos"
    );



    if(totalProdutos){

        totalProdutos.innerText =
        produtos.length;

    }





    const totalMateria =
    document.getElementById(
        "totalMateriaPrima"
    );



    if(totalMateria){

        totalMateria.innerText =
        materias.length;

    }




    const data =
    document.getElementById(
        "ultimaAtualizacao"
    );



    if(data){

        data.innerText =
        new Date()
        .toLocaleDateString(
            "pt-BR"
        );

    }



}







/* =========================================================
   ATUALIZAÇÃO GERAL
========================================================= */


function atualizarTudo(){


    produtos =
    carregarBanco(DB.produtos);



    materias =
    carregarBanco(DB.materias);



    estoque =
    carregarBanco(DB.estoque);



    producao =
    carregarBanco(DB.producao);



    etiquetas =
    carregarBanco(DB.etiquetas);



    atualizarProdutos();


    atualizarDashboard();



}





/* =========================================================
   INICIALIZAÇÃO
========================================================= */


document.addEventListener(
"DOMContentLoaded",
function(){


    atualizarTudo();


    novoProduto();


});
/* =========================================================
   PARTE 2 - MATÉRIA PRIMA / ESTOQUE / PRODUÇÃO
========================================================= */


/* =========================================================
   CARREGAMENTO
========================================================= */


let materias = JSON.parse(
    localStorage.getItem(
        "carols_gourmet_materias"
    )
) || [];



let movimentacoes = JSON.parse(
    localStorage.getItem(
        "carols_gourmet_movimentacoes"
    )
) || [];



let producoes = JSON.parse(
    localStorage.getItem(
        "carols_gourmet_producoes"
    )
) || [];






function salvarMaterias(){


    localStorage.setItem(
        "carols_gourmet_materias",
        JSON.stringify(materias)
    );


}






function salvarMovimentacoes(){


    localStorage.setItem(
        "carols_gourmet_movimentacoes",
        JSON.stringify(movimentacoes)
    );


}






function salvarProducoes(){


    localStorage.setItem(
        "carols_gourmet_producoes",
        JSON.stringify(producoes)
    );


}





/* =========================================================
   MATÉRIA PRIMA
========================================================= */



function gerarCodigoMP(){


    return "MP-" +
    String(
        materias.length + 1
    )
    .padStart(4,"0");


}






function novaMateriaPrima(){



    let codigo =
    document.getElementById(
        "codigoMP"
    );



    if(codigo){

        codigo.value =
        gerarCodigoMP();

    }




    document.getElementById(
        "nomeMP"
    ).value="";



    document.getElementById(
        "estoqueMP"
    ).value="0";



    document.getElementById(
        "custoMP"
    ).value="";


}






function salvarMateriaPrima(){



    let nome =
    document.getElementById(
        "nomeMP"
    )
    .value
    .trim();




    if(nome===""){


        alert(
            "Informe o nome da matéria-prima"
        );


        return;

    }





    let mp = {



        codigo:
        document.getElementById(
            "codigoMP"
        )
        .value
        ||
        gerarCodigoMP(),



        nome:nome,



        categoria:
        document.getElementById(
            "categoriaMP"
        )
        .value,



        unidade:
        document.getElementById(
            "unidadeMP"
        )
        .value,



        quantidade:
        Number(
            document.getElementById(
                "estoqueMP"
            )
            .value
        )
        ||
        0,



        custo:
        Number(
            document.getElementById(
                "custoMP"
            )
            .value
        )
        ||
        0



    };





    materias.push(mp);



    salvarMaterias();



    atualizarMateriaPrima();



    novaMateriaPrima();



    alert(
        "Matéria-prima salva!"
    );



}







function atualizarMateriaPrima(){



    let tabela =
    document.getElementById(
        "listaMateriaPrima"
    );



    if(!tabela){

        return;

    }





    tabela.innerHTML="";




    materias.forEach(
    function(mp){



        tabela.innerHTML += `


        <tr>

        <td>${mp.codigo}</td>

        <td>${mp.nome}</td>

        <td>${mp.categoria}</td>

        <td>${mp.unidade}</td>

        <td>${mp.quantidade}</td>

        <td>
        R$ ${mp.custo.toFixed(2)}
        </td>

        <td>
        R$ ${(mp.quantidade * mp.custo).toFixed(2)}
        </td>


        </tr>


        `;



    });


}







/* =========================================================
   ESTOQUE
========================================================= */



function alterarTipoEstoque(){


    atualizarEstoque();


}






function atualizarEstoque(){



    let tabela =
    document.getElementById(
        "listaEstoque"
    );



    if(!tabela){

        return;

    }




    tabela.innerHTML="";




    materias.forEach(
    function(mp){



        tabela.innerHTML += `


        <tr>


        <td>${mp.nome}</td>

        <td>${mp.unidade}</td>

        <td>${mp.quantidade}</td>


        <td>
        R$ ${mp.custo.toFixed(2)}
        </td>


        </tr>


        `;


    });



}







/* =========================================================
   MOVIMENTAÇÃO
========================================================= */



function atualizarItensMovimentacao(){



    let select =
    document.getElementById(
        "itemMovimentacao"
    );



    if(!select){

        return;

    }




    select.innerHTML =
    `
    <option value="">
    Selecione um item
    </option>
    `;



    materias.forEach(
    function(mp,index){



        select.innerHTML += `


        <option value="${index}">

        ${mp.nome}

        </option>


        `;


    });



}








function registrarMovimentacao(){



    let indice =
    document.getElementById(
        "itemMovimentacao"
    )
    .value;



    let quantidade =
    Number(
        document.getElementById(
            "quantidadeMovimentacao"
        )
        .value
    );



    let operacao =
    document.getElementById(
        "tipoMovimentacao"
    )
    .value;




    if(indice===""){


        alert(
            "Selecione o item"
        );


        return;

    }






    let mp =
    materias[indice];





    if(operacao==="entrada"){


        mp.quantidade += quantidade;


    }
    else{


        mp.quantidade -= quantidade;


        if(mp.quantidade < 0){

            mp.quantidade=0;

        }

    }




    movimentacoes.push({


        data:
        new Date()
        .toLocaleDateString(),


        item:mp.nome,


        quantidade:quantidade,


        operacao:operacao


    });





    salvarMaterias();


    salvarMovimentacoes();



    atualizarMateriaPrima();


    atualizarEstoque();



    alert(
        "Movimentação realizada!"
    );



}






/* =========================================================
   PRODUÇÃO
========================================================= */


function atualizarProdutosProducao(){



    let select =
    document.getElementById(
        "produtoProducao"
    );



    if(!select){

        return;

    }




    select.innerHTML="";



    produtos.forEach(
    function(produto,index){



        select.innerHTML += `


        <option value="${index}">

        ${produto.nome}

        </option>


        `;



    });


}








function registrarProducao(){



    let indice =
    document.getElementById(
        "produtoProducao"
    )
    .value;



    let quantidade =
    Number(
        document.getElementById(
            "quantidadeProducao"
        )
        .value
    );





    if(indice===""){

        return;

    }





    let produto =
    produtos[indice];




    produto.estoque =
    Number(produto.estoque || 0)
    +
    quantidade;





    localStorage.setItem(
        "carols_gourmet_produtos",
        JSON.stringify(produtos)
    );




    producoes.push({


        produto:
        produto.nome,


        quantidade:quantidade,


        data:
        new Date()
        .toLocaleDateString()


    });




    salvarProducoes();



    atualizarProdutos();



    alert(
        "Produção registrada!"
    );



}







/* =========================================================
   INICIALIZAÇÃO
========================================================= */



window.addEventListener(
"load",
function(){


    atualizarMateriaPrima();


    atualizarEstoque();


    atualizarItensMovimentacao();


    atualizarProdutosProducao();



});
