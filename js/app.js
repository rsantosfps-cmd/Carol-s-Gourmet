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
