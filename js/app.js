/* =========================================================
   CAROL'S GOURMET ERP 4.0
   APP.JS NOVO - PARTE 1
   MOTOR DO SISTEMA
========================================================= */



console.log(
    "Carol's Gourmet iniciado"
);




/* =========================================================
   BANCO LOCAL
========================================================= */


const CHAVES = {


    produtos:
    "carols_gourmet_produtos",


    materias:
    "carols_gourmet_materias",


    estoque:
    "carols_gourmet_estoque",


    producao:
    "carols_gourmet_producao",


    etiquetas:
    "carols_gourmet_etiquetas"


};







let produtos =
JSON.parse(
    localStorage.getItem(
        CHAVES.produtos
    )
)
||
[];




let materias =
JSON.parse(
    localStorage.getItem(
        CHAVES.materias
    )
)
||
[];




let producoes =
JSON.parse(
    localStorage.getItem(
        CHAVES.producao
    )
)
||
[];







function salvarDados(){



    localStorage.setItem(
        CHAVES.produtos,
        JSON.stringify(produtos)
    );



    localStorage.setItem(
        CHAVES.materias,
        JSON.stringify(materias)
    );



    localStorage.setItem(
        CHAVES.producao,
        JSON.stringify(producoes)
    );


}







/* =========================================================
   MENU LATERAL
========================================================= */



function toggleMenu(){



    const menu =
    document.getElementById(
        "sidebar"
    );



    if(!menu){

        return;

    }



    menu.classList.toggle(
        "aberto"
    );


}







/* =========================================================
   TROCA DE ABAS
========================================================= */


function mostrarAba(
    idAba,
    botao
){



    const abas =
    document.querySelectorAll(
        ".aba"
    );




    abas.forEach(
    function(aba){


        aba.classList.remove(
            "ativa"
        );


    });






    const abaSelecionada =
    document.getElementById(
        idAba
    );




    if(abaSelecionada){


        abaSelecionada.classList.add(
            "ativa"
        );


    }






    const botoes =
    document.querySelectorAll(
        ".menu-item"
    );




    botoes.forEach(
    function(btn){


        btn.classList.remove(
            "ativo"
        );


    });





    if(botao){


        botao.classList.add(
            "ativo"
        );


    }





    // fecha menu no celular

    const menu =
    document.getElementById(
        "sidebar"
    );



    if(menu){


        menu.classList.remove(
            "aberto"
        );


    }




}







/* =========================================================
   INICIALIZAÇÃO
========================================================= */


window.addEventListener(
"DOMContentLoaded",
function(){



    console.log(
        "Sistema carregado"
    );



    const primeiraAba =
    document.getElementById(
        "dashboard"
    );



    if(primeiraAba){


        primeiraAba.classList.add(
            "ativa"
        );


    }



});
