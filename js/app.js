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
// =====================================================
// MATÉRIA PRIMA
// =====================================================


function gerarCodigoMP(){

    let numero = materias.length + 1;

    return "MP-" + String(numero).padStart(4,"0");

}



function salvarMateriaPrima(){


    const nome =
        document.getElementById("nomeMP").value.trim();


    if(!nome){

        alert("Informe o nome da matéria-prima");
        return;

    }



    const materia = {


        codigo:
            document.getElementById("codigoMP").value ||
            gerarCodigoMP(),


        nome:name,

        categoria:
            document.getElementById("categoriaMP").value,


        unidade:
            document.getElementById("unidadeMP").value,


        estoque:
            Number(
                document.getElementById("estoqueMP").value
            ),


        custo:
            Number(
                document.getElementById("custoMP").value
            )

    };



    materias.push(materia);



    salvarDados();


    listarMaterias();


    atualizarDashboard();



    alert("Matéria-prima cadastrada");



    novaMateriaPrima();


}





function listarMaterias(){


    const tabela =
        document.getElementById("listaMateriaPrima");



    if(!tabela)
        return;



    tabela.innerHTML="";



    materias.forEach(function(item,index){


        tabela.innerHTML += `


        <tr>


        <td>${item.codigo}</td>


        <td>${item.nome}</td>


        <td>${item.categoria}</td>


        <td>${item.unidade}</td>


        <td>${item.estoque}</td>


        <td>
        R$ ${item.custo.toFixed(2)}
        </td>


        <td>
        R$ ${(item.estoque * item.custo).toFixed(2)}
        </td>


        </tr>


        `;



    });



}





function novaMateriaPrima(){


    document.getElementById("codigoMP").value =
        gerarCodigoMP();


    document.getElementById("nomeMP").value="";


    document.getElementById("estoqueMP").value=0;


    document.getElementById("custoMP").value="";


}





// =====================================================
// ESTOQUE
// =====================================================



function carregarEstoque(){


    const tipo =
        document.getElementById("tipoEstoque")
        ?.value;



    const cab =
        document.getElementById("cabecalhoEstoque");


    const lista =
        document.getElementById("listaEstoque");



    if(!cab || !lista)
        return;



    lista.innerHTML="";



    if(tipo==="materiaPrima"){



        cab.innerHTML=`

        <tr>

        <th>Código</th>
        <th>Nome</th>
        <th>Quantidade</th>
        <th>Unidade</th>

        </tr>

        `;



        materias.forEach(item=>{


            lista.innerHTML +=`

            <tr>

            <td>${item.codigo}</td>

            <td>${item.nome}</td>

            <td>${item.estoque}</td>

            <td>${item.unidade}</td>


            </tr>


            `;


        });



    }



}





function alterarTipoEstoque(){

    carregarEstoque();

}





// =====================================================
// MOVIMENTAÇÃO
// =====================================================



function atualizarItensMovimentacao(){


    const select =
        document.getElementById("itemMovimentacao");


    const tipo =
        document.getElementById("tipoEstoqueMovimentacao")
        .value;



    if(!select)
        return;



    select.innerHTML=
    `
    <option value="">
    Selecione um item
    </option>
    `;



    if(tipo==="materiaPrima"){



        materias.forEach(item=>{


            select.innerHTML +=`

            <option value="${item.codigo}">

            ${item.nome}

            </option>

            `;


        });



    }



}





function registrarMovimentacao(){



    const codigo =
    document.getElementById("itemMovimentacao").value;



    const quantidade =
    Number(
    document.getElementById("quantidadeMovimentacao").value
    );



    const operacao =
    document.getElementById("tipoMovimentacao").value;



    if(!codigo || !quantidade){


        alert("Preencha todos os campos");

        return;

    }





    let item =
    materias.find(
        x=>x.codigo===codigo
    );



    if(!item){

        alert("Item não encontrado");

        return;

    }




    if(operacao==="entrada"){


        item.estoque += quantidade;


    }else{


        item.estoque -= quantidade;


    }





    movimentacoes.push({


        data:
        document.getElementById("dataMovimentacao").value,


        item:item.nome,


        quantidade,


        operacao,


        observacao:
        document.getElementById("observacaoMovimentacao").value


    });



    salvarDados();


    listarMaterias();


    carregarEstoque();


    listarMovimentacoes();



    alert("Movimentação registrada");



}





function listarMovimentacoes(){


    const tabela =
    document.getElementById("historicoMovimentacoes");



    if(!tabela)
        return;



    tabela.innerHTML="";



    movimentacoes.forEach(m=>{


        tabela.innerHTML +=`


        <tr>


        <td>${m.data}</td>

        <td>${m.item}</td>

        <td>${m.quantidade}</td>

        <td>${m.operacao}</td>

        <td>${m.observacao}</td>


        </tr>


        `;


    });



}
