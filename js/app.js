// ======================================================
// CAROL'S GOURMET ERP 4.0
// APP.JS NOVO
// PARTE 1/4
// ======================================================



// ================================
// BANCO DE DADOS
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



let producoes = JSON.parse(
    localStorage.getItem("carols_producoes")
) || [];




// ================================
// SALVAR BANCO
// ================================


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




// ================================
// INICIALIZAÇÃO
// ================================


window.onload = function(){


    carregarProdutos();


    atualizarDashboard();


};






// ================================
// MENU LATERAL
// ================================


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





    const novaAba =
    document.getElementById(id);



    if(novaAba){

        novaAba.classList.add("ativa");

    }






    const botoes =
    document.querySelectorAll(".menu-item");



    botoes.forEach(function(item){

        item.classList.remove("ativo");

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

        ean.value="";

    }



    let nome =
    document.getElementById(
        "nomeProduto"
    );


    if(nome){

        nome.value="";

    }





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





    let produto = {


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



    salvarBanco();



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

<td>R$ ${Number(produto.custo || 0).toFixed(2)}</td>

<td>
R$ ${(Number(produto.estoque || 0) * Number(produto.custo || 0)).toFixed(2)}
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


        produtos.splice(
            index,
            1
        );



        salvarBanco();



        carregarProdutos();



        atualizarDashboard();



    }



}









// ================================
// DASHBOARD
// ================================



function atualizarDashboard(){



    const total =
    document.getElementById(
        "totalProdutos"
    );



    if(total){

        total.innerText =
        produtos.length;

    }






    const mp =
    document.getElementById(
        "totalMateriaPrima"
    );



    if(mp){

        mp.innerText =
        materias.length;

    }







    const data =
    document.getElementById(
        "ultimaAtualizacao"
    );



    if(data){

        data.innerText =
        new Date()
        .toLocaleDateString();

    }



}
// ======================================================
// CAROL'S GOURMET ERP 4.0
// PARTE 2/4
// MATÉRIA-PRIMA + ESTOQUE
// ======================================================



// ================================
// MATÉRIA-PRIMA
// ================================



function gerarCodigoMP(){


    let numero =
    materias.length + 1;


    return "MP-" +
    String(numero).padStart(4,"0");


}







function novaMateriaPrima(){



    const codigo =
    document.getElementById(
        "codigoMP"
    );



    if(codigo){

        codigo.value =
        gerarCodigoMP();

    }




    const nome =
    document.getElementById(
        "nomeMP"
    );


    if(nome){

        nome.value="";

    }




    const estoque =
    document.getElementById(
        "estoqueMP"
    );


    if(estoque){

        estoque.value=0;

    }



    const custo =
    document.getElementById(
        "custoMP"
    );


    if(custo){

        custo.value="";

    }



}









function salvarMateriaPrima(){



    let nome =
    document.getElementById(
        "nomeMP"
    ).value.trim();





    if(nome===""){


        alert(
            "Digite o nome da matéria-prima"
        );


        return;


    }







    let materia = {



        codigo:
        document.getElementById(
            "codigoMP"
        ).value || gerarCodigoMP(),




        nome:nome,




        categoria:
        document.getElementById(
            "categoriaMP"
        ).value,




        unidade:
        document.getElementById(
            "unidadeMP"
        ).value,




        estoque:
        Number(
            document.getElementById(
                "estoqueMP"
            ).value
        ) || 0,




        custo:
        Number(
            document.getElementById(
                "custoMP"
            ).value
        ) || 0,




        data:
        new Date().toLocaleString()



    };






    materias.push(materia);



    salvarBanco();



    carregarMaterias();



    atualizarDashboard();



    novaMateriaPrima();





    alert(
        "Matéria-prima salva com sucesso!"
    );



}









function carregarMaterias(){



    const tabela =
    document.getElementById(
        "listaMateriaPrima"
    );



    if(!tabela){

        return;

    }







    tabela.innerHTML="";







    materias.forEach(function(mp,index){



        let linha =
        document.createElement("tr");





        linha.innerHTML = `



<td>${mp.codigo}</td>


<td>${mp.nome}</td>


<td>${mp.categoria}</td>


<td>${mp.unidade}</td>


<td>${mp.estoque}</td>


<td>
R$ ${Number(mp.custo).toFixed(2)}
</td>


<td>
R$ ${(mp.estoque * mp.custo).toFixed(2)}
</td>


`;



        tabela.appendChild(linha);



    });



}









// ================================
// ESTOQUE
// ================================



function alterarTipoEstoque(){


    carregarEstoque();


}








function carregarEstoque(){



    const tabela =
    document.getElementById(
        "listaEstoque"
    );



    const cabecalho =
    document.getElementById(
        "cabecalhoEstoque"
    );



    if(!tabela){

        return;

    }





    tabela.innerHTML="";




    cabecalho.innerHTML=`


<tr>

<th>Código</th>

<th>Nome</th>

<th>Unidade</th>

<th>Quantidade</th>

</tr>


`;







    materias.forEach(function(mp){



        let linha =
        document.createElement("tr");



        linha.innerHTML = `


<td>${mp.codigo}</td>

<td>${mp.nome}</td>

<td>${mp.unidade}</td>

<td>${mp.estoque}</td>


`;



        tabela.appendChild(linha);



    });




}









// ================================
// MOVIMENTAÇÃO DE ESTOQUE
// ================================




function atualizarItensMovimentacao(){



    const select =
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





    materias.forEach(function(mp){



        let option =
        document.createElement("option");



        option.value =
        mp.codigo;



        option.textContent =
        mp.nome;



        select.appendChild(option);



    });



}









function registrarMovimentacao(){



    let codigo =
    document.getElementById(
        "itemMovimentacao"
    ).value;





    let quantidade =
    Number(
        document.getElementById(
            "quantidadeMovimentacao"
        ).value
    );





    let operacao =
    document.getElementById(
        "tipoMovimentacao"
    ).value;





    if(!codigo || !quantidade){


        alert(
            "Preencha os dados da movimentação"
        );


        return;


    }







    let materia =
    materias.find(function(mp){


        return mp.codigo===codigo;


    });






    if(!materia){

        return;

    }






    if(operacao==="entrada"){


        materia.estoque += quantidade;


    }else{


        materia.estoque -= quantidade;


    }







    movimentacoes.push({



        data:
        document.getElementById(
            "dataMovimentacao"
        ).value,



        item:
        materia.nome,



        quantidade:quantidade,



        operacao:operacao,



        observacao:
        document.getElementById(
            "observacaoMovimentacao"
        ).value



    });







    salvarBanco();



    carregarMaterias();



    carregarEstoque();



    alert(
        "Movimentação registrada!"
    );



}
