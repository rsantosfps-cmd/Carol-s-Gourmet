/* ===========================================
   CAROL'S GOURMET V2
   utils.js
=========================================== */

const STORAGE_KEY = "carols_gourmet_produtos";

/* ===========================================
   LOCAL STORAGE
=========================================== */

function carregarProdutos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarProdutos(produtos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

/* ===========================================
   CÓDIGO INTERNO
=========================================== */

function gerarCodigoInterno(produtos) {

    const numero = produtos.length + 1;

    return "PROD" + String(numero).padStart(3, "0");

}

/* ===========================================
   EAN-13
=========================================== */

/*
Estrutura

789999 + 6 dígitos + DV

Exemplo

7899990000015

*/

function gerarEAN13(produtos){

    let sequencia = produtos.length + 1;

    let base =
        "789999" +
        String(sequencia).padStart(6,"0");

    let dv = calcularDV(base);

    return base + dv;

}

/* ===========================================
   DÍGITO VERIFICADOR EAN13
=========================================== */

function calcularDV(numero12){

    let soma = 0;

    for(let i=0;i<12;i++){

        let digito = parseInt(numero12.charAt(i));

        if(i % 2 === 0){

            soma += digito;

        }else{

            soma += digito * 3;

        }

    }

    let resto = soma % 10;

    if(resto === 0){

        return 0;

    }

    return 10 - resto;

}

/* ===========================================
   FORMATAÇÃO MOEDA
=========================================== */

function moeda(valor){

    return Number(valor).toLocaleString(

        "pt-BR",

        {

            style:"currency",

            currency:"BRL"

        }

    );

}

/* ===========================================
   DATA BR
=========================================== */

function dataBR(data){

    if(!data) return "";

    let d = new Date(data);

    return d.toLocaleDateString("pt-BR");

}

/* ===========================================
   DATA + 7 DIAS
=========================================== */

function calcularValidade(data){

    let validade = new Date(data);

    validade.setDate(validade.getDate()+7);

    return validade.toISOString().split("T")[0];

}

/* ===========================================
   HOJE
=========================================== */

function hoje(){

    return new Date().toISOString().split("T")[0];

}
