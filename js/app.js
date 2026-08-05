// =====================================================
// CAROL'S GOURMET ERP 4.0
// APP.JS NOVO
// PARTE 1/4
// =====================================================


// ================================
// BANCO LOCAL
// ================================

let produtos = JSON.parse(
    localStorage.getItem("carols_produtos")
) || [];


let materias = JSON.parse(
    localStorage.getItem("carols_materias")
) || [];


let movimentacoes = JSON.parse(
    localStorage.getItem("carols_movimentacoes")
) || [];



// ================================
// INICIALIZAÇÃO
// ================================


window.onload = function(){

    carregarProdutos();

    atualizarDashboard();

    novoProduto();

};



// ================================
// MENU LATERAL
// ================================


function toggleMenu(){

    const sidebar =
    document.getElementById("sidebar");


    sidebar.classList.toggle("fechado");

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

}





// ================================
// PRODUTOS
// ================================


function gerarCodigoProduto(){


    let numero =
    produtos.length + 1;


    return "PROD-" +
    numero.toString().padStart(4,"0");

}





function novoProduto(){


    document.getElementById(
        "codigoProduto"
    ).value =
    gerarCodigoProduto();


    document.getElementById(
        "eanProduto"
    ).value="";


    document.getElementById(
        "nomeProduto"
    ).value="";


    document.getElementById(
        "categoriaProduto"
    ).value="";


    document.getElementById(
        "unidadeProduto"
    ).value="Unidade";


    document.getElementById(
        "statusProduto"
    ).value="Ativo";


}





function salvarProduto(){


    let nome =
    document.getElementById(
        "nomeProduto"
    ).value.trim();



    if(nome===""){

        alert(
            "Digite o nome do produto"
        );

        return;

    }




    let produto={


        codigo:
        document.getElementById(
            "codigoProduto"
        ).value,


        ean:
        document.getElementById(
            "eanProduto"
        ).value,


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


        data:
        new Date().toLocaleString()

    };





    produtos.push(produto);



    salvarDados();



    carregarProdutos();


    atualizarDashboard();


    novoProduto();



    alert(
        "Produto salvo com sucesso!"
    );


}







function carregarProdutos(){


    const tabela =
    document.getElementById(
        "listaProdutos"
    );


    if(!tabela)
    return;



    tabela.innerHTML="";




    produtos.forEach(function(produto,index){



        let linha =
        document.createElement("tr");



        linha.innerHTML=`


        <td>${produto.codigo}</td>

        <td>${produto.nome}</td>

        <td>${produto.categoria}</td>

        <td>${produto.unidade}</td>

        <td>${produto.estoque}</td>

        <td>R$ ${produto.custo.toFixed(2)}</td>

        <td>R$ ${(produto.estoque * produto.custo).toFixed(2)}</td>


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


    if(confirm(
        "Excluir produto?"
    )){


        produtos.splice(
            index,
            1
        );


        salvarDados();


        carregarProdutos();


        atualizarDashboard();


    }


}






// ================================
// DASHBOARD
// ================================



function atualizarDashboard(){


    let total =
    document.getElementById(
        "totalProdutos"
    );


    if(total){

        total.innerText =
        produtos.length;

    }




    let mp =
    document.getElementById(
        "totalMateriaPrima"
    );


    if(mp){

        mp.innerText =
        materias.length;

    }





    let data =
    document.getElementById(
        "ultimaAtualizacao"
    );


    if(data){

        data.innerText =
        new Date()
        .toLocaleDateString();

    }


}






// ================================
// SALVAR BANCO
// ================================


function salvarDados(){


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



}
