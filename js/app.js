/* =====================================================
   CAROL'S GOURMET ERP 4.0
   APP.JS NOVO
===================================================== */


/* =====================================================
   BANCO LOCAL
===================================================== */

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



function salvarBanco(){

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

}



/* =====================================================
   MENU LATERAL
===================================================== */


function toggleMenu(){

    const menu =
    document.getElementById("sidebar");


    if(menu){

        menu.classList.toggle("aberto");

    }

}




function mostrarAba(id, botao){


    const abas =
    document.querySelectorAll(".aba");


    abas.forEach(function(aba){

        aba.classList.remove("ativa");

    });



    const selecionada =
    document.getElementById(id);



    if(selecionada){

        selecionada.classList.add("ativa");

    }



    const botoes =
    document.querySelectorAll(".menu-item");


    botoes.forEach(function(btn){

        btn.classList.remove("ativo");

    });



    if(botao){

        botao.classList.add("ativo");

    }



    if(
        window.innerWidth < 800
    ){

        document
        .getElementById("sidebar")
        ?.classList.remove("aberto");

    }



}



/* =====================================================
   INICIALIZAÇÃO
===================================================== */


window.onload = function(){


    gerarCodigoProduto();

    gerarCodigoMateria();


    atualizarProdutos();


    atualizarMaterias();


    atualizarDashboard();


    carregarEstoque();


};




/* =====================================================
   PRODUTOS
===================================================== */


function gerarCodigoProduto(){


    const campo =
    document.getElementById("codigoProduto");


    if(!campo) return;



    let numero =
    produtos.length + 1;



    campo.value =
    "PROD-" +
    String(numero).padStart(4,"0");


}



function salvarProduto(){


    const nome =
    document.getElementById("nomeProduto")
    .value.trim();



    if(!nome){

        alert(
        "Digite o nome do produto"
        );

        return;

    }



    const produto = {


        id:
        Date.now(),


        codigo:
        document.getElementById("codigoProduto").value,


        nome:


        nome,


        categoria:
        document.getElementById("categoriaProduto").value,


        unidade:
        document.getElementById("unidadeProduto").value,


        status:
        document.getElementById("statusProduto").value,


        estoque:0,


        custo:0,


        valor:0,


        ean:
        gerarEAN()



    };



    produtos.push(produto);



    salvarBanco();


    atualizarProdutos();


    atualizarDashboard();


    alert(
    "Produto salvo com sucesso!"
    );


    novoProduto();


}





function gerarEAN(){


    let numero =
    Math.floor(
    Math.random()*900000000000
    )
    +
    100000000000;



    return numero.toString();



}





function novoProduto(){


    document
    .getElementById("nomeProduto")
    .value="";


    document
    .getElementById("categoriaProduto")
    .value="";


    gerarCodigoProduto();


}
