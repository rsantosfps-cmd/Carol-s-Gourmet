// ======================================================
// CAROL'S GOURMET ERP 4.0
// APP.JS NOVO - PARTE 1/4
// BASE + PRODUTOS
// ======================================================



// ======================================================
// BANCO DE DADOS
// ======================================================


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




// ======================================================
// SALVAR BANCO
// ======================================================


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





// ======================================================
// INICIALIZAÇÃO
// ======================================================


window.onload = function(){


    carregarProdutos();

    atualizarDashboard();


};






// ======================================================
// MENU LATERAL
// ======================================================


function toggleMenu(){


    let sidebar =
    document.getElementById("sidebar");


    if(sidebar){

        sidebar.classList.toggle("aberto");

    }


}






function mostrarAba(id, botao){


    let abas =
    document.querySelectorAll(".aba");


    abas.forEach(function(aba){

        aba.classList.remove("ativa");

    });



    let aba =
    document.getElementById(id);



    if(aba){

        aba.classList.add("ativa");

    }



    let botoes =
    document.querySelectorAll(".menu-item");


    botoes.forEach(function(item){

        item.classList.remove("ativo");

    });



    if(botao){

        botao.classList.add("ativo");

    }



}







// ======================================================
// DASHBOARD
// ======================================================


function atualizarDashboard(){


    let totalProdutos =
    document.getElementById(
        "totalProdutos"
    );


    if(totalProdutos){

        totalProdutos.innerText =
        produtos.length;

    }




    let totalMP =
    document.getElementById(
        "totalMateriaPrima"
    );


    if(totalMP){

        totalMP.innerText =
        materias.length;

    }




    let data =
    document.getElementById(
        "ultimaAtualizacao"
    );


    if(data){

        data.innerText =
        new Date().toLocaleDateString();

    }



}







// ======================================================
// PRODUTOS
// ======================================================



function gerarCodigoProduto(){


    let numero =
    produtos.length + 1;


    return "PROD-" +
    String(numero).padStart(4,"0");


}






function novoProduto(){


    let codigo =
    document.getElementById(
        "codigoProduto"
    );


    if(codigo){

        codigo.value =
        gerarCodigoProduto();

    }



    let ean =
    document.getElementById(
        "eanProduto"
    );


    if(ean){

        ean.value = "";

    }



    let nome =
    document.getElementById(
        "nomeProduto"
    );


    if(nome){

        nome.value = "";

    }



    let categoria =
    document.getElementById(
        "categoriaProduto"
    );


    if(categoria){

        categoria.value="";

    }


}








function salvarProduto(){


    let nome =
    document.getElementById(
        "nomeProduto"
    );



    if(!nome || nome.value.trim()===""){


        alert(
            "Digite o nome do produto"
        );


        return;

    }





    let produto = {


        codigo:
        document.getElementById(
            "codigoProduto"
        ).value || gerarCodigoProduto(),



        ean:
        document.getElementById(
            "eanProduto"
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
        ).value,



        estoque:0,


        custo:0,


        data:
        new Date().toLocaleString()


    };





    produtos.push(produto);



    salvarBanco();



    carregarProdutos();



    atualizarDashboard();



    alert(
        "Produto salvo com sucesso!"
    );



    novoProduto();



}








function carregarProdutos(){



    let tabela =
    document.getElementById(
        "listaProdutos"
    );



    if(!tabela){

        return;

    }




    tabela.innerHTML="";




    produtos.forEach(function(produto,index){



        let linha =
        document.createElement("tr");



        linha.innerHTML = `


<td>${produto.codigo || ""}</td>

<td>${produto.nome || ""}</td>

<td>${produto.categoria || ""}</td>

<td>${produto.unidade || ""}</td>

<td>${produto.estoque || 0}</td>

<td>
R$ ${Number(produto.custo || 0).toFixed(2)}
</td>

<td>
R$ ${(produto.estoque * produto.custo).toFixed(2)}
</td>


<td>

<button onclick="excluirProduto(${index})">
🗑️
</button>

</td>


`;



        tabela.appendChild(linha);



    });



}








function excluirProduto(index){



    if(confirm("Excluir produto?")){


        produtos.splice(index,1);



        salvarBanco();



        carregarProdutos();



        atualizarDashboard();



    }



}
