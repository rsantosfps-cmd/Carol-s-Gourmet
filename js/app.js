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
// SALVAR DADOS
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
// INICIO DO SISTEMA
// ================================


window.onload = function(){


    carregarProdutos();


    atualizarDashboard();


};




// ================================
// MENU LATERAL
// ================================


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



    abas.forEach(function(item){


        item.classList.remove("ativa");


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






// ================================
// DASHBOARD
// ================================


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







// ================================
// PRODUTOS
// ================================



function gerarCodigoProduto(){


    return "PROD-" +
    String(produtos.length + 1)
    .padStart(4,"0");


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



    let nome =
    document.getElementById(
        "nomeProduto"
    );


    if(nome){

        nome.value="";

    }



    let ean =
    document.getElementById(
        "eanProduto"
    );


    if(ean){

        ean.value="";

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
        ).value
        ||
        gerarCodigoProduto(),



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
        "Produto salvo!"
    );



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



    if(confirm("Excluir produto?")){


        produtos.splice(index,1);


        salvarBanco();


        carregarProdutos();


        atualizarDashboard();


    }


}
// ======================================================
// CAROL'S GOURMET ERP 4.0
// PARTE 2/4
// MATÉRIA-PRIMA + ESTOQUE + MOVIMENTAÇÃO
// ======================================================



// ================================
// MATÉRIA-PRIMA
// ================================


function gerarCodigoMP(){


    let maior = 0;


    materias.forEach(function(mp){


        let numero = Number(
            String(mp.codigo)
            .replace("MP-","")
        );


        if(numero > maior){

            maior = numero;

        }


    });



    return "MP-" +
    String(maior + 1)
    .padStart(4,"0");


}







function novaMateriaPrima(){



    let codigo =
    document.getElementById("codigoMP");



    if(codigo){

        codigo.value =
        gerarCodigoMP();

    }




    let nome =
    document.getElementById("nomeMP");



    if(nome){

        nome.value="";

    }




    let estoque =
    document.getElementById("estoqueMP");



    if(estoque){

        estoque.value=0;

    }



    let custo =
    document.getElementById("custoMP");



    if(custo){

        custo.value="";

    }


}








function salvarMateriaPrima(){



    let nome =
    document
    .getElementById("nomeMP")
    .value
    .trim();



    if(nome===""){


        alert(
            "Digite o nome da matéria-prima"
        );


        return;


    }





    let materia = {


        codigo:
        document.getElementById("codigoMP").value
        ||
        gerarCodigoMP(),



        nome:nome,



        categoria:
        document.getElementById("categoriaMP").value,



        unidade:
        document.getElementById("unidadeMP").value,



        estoque:
        Number(
            document.getElementById("estoqueMP").value
        ) || 0,



        custo:
        Number(
            document.getElementById("custoMP").value
        ) || 0,


        data:
        new Date().toLocaleString()


    };






    materias.push(materia);



    salvarBanco();



    carregarMaterias();



    carregarEstoque();



    atualizarDashboard();



    alert(
        "Matéria-prima salva!"
    );



    novaMateriaPrima();



}









function carregarMaterias(){



    let tabela =
    document.getElementById(
        "listaMateriaPrima"
    );



    if(!tabela){

        return;

    }




    tabela.innerHTML="";





    materias.forEach(function(mp){



        let linha =
        document.createElement("tr");



        linha.innerHTML=`


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



    let tabela =
    document.getElementById(
        "listaEstoque"
    );



    let cabecalho =
    document.getElementById(
        "cabecalhoEstoque"
    );



    if(!tabela || !cabecalho){

        return;

    }





    tabela.innerHTML="";





    let tipo =
    document.getElementById(
        "tipoEstoque"
    );





    let escolha =
    tipo ? tipo.value : "materiaPrima";







    // ==========================
    // MATÉRIA-PRIMA
    // ==========================


    if(escolha==="materiaPrima"){



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



            linha.innerHTML=`

            <td>${mp.codigo}</td>

            <td>${mp.nome}</td>

            <td>${mp.unidade}</td>

            <td>${mp.estoque}</td>

            `;



            tabela.appendChild(linha);



        });



    }









    // ==========================
    // PRODUTO ACABADO
    // ==========================


    if(escolha==="produtoAcabado"){



        cabecalho.innerHTML=`

        <tr>

        <th>Código</th>
        <th>Nome</th>
        <th>Unidade</th>
        <th>Quantidade</th>

        </tr>

        `;





        produtos.forEach(function(produto){



            let linha =
            document.createElement("tr");



            linha.innerHTML=`

            <td>${produto.codigo}</td>

            <td>${produto.nome}</td>

            <td>${produto.unidade}</td>

            <td>${produto.estoque || 0}</td>


            `;



            tabela.appendChild(linha);



        });



    }



}









// ================================
// MOVIMENTAÇÃO
// ================================


function atualizarItensMovimentacao(){



    let select =
    document.getElementById(
        "itemMovimentacao"
    );



    if(!select){

        return;

    }





    select.innerHTML=`

<option value="">
Selecione um item
</option>

`;






    let tipo =
    document.getElementById(
        "tipoEstoqueMovimentacao"
    );





    let escolha =
    tipo ? tipo.value : "materiaPrima";








    if(escolha==="materiaPrima"){



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








    if(escolha==="produtoAcabado"){



        produtos.forEach(function(produto){



            let option =
            document.createElement("option");



            option.value =
            produto.codigo;



            option.textContent =
            produto.nome;



            select.appendChild(option);



        });



    }




}









function registrarMovimentacao(){



    let tipo =
    document.getElementById(
        "tipoEstoqueMovimentacao"
    ).value;




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





    if(!codigo || quantidade<=0){


        alert(
            "Preencha os dados"
        );


        return;

    }






    let item;



    if(tipo==="materiaPrima"){


        item =
        materias.find(function(mp){


            return mp.codigo===codigo;


        });


    }else{


        item =
        produtos.find(function(produto){


            return produto.codigo===codigo;


        });


    }






    if(!item){


        alert(
            "Item não encontrado"
        );


        return;


    }






    if(operacao==="entrada"){


        item.estoque =
        Number(item.estoque || 0)
        + quantidade;



    }else{


        item.estoque =
        Number(item.estoque || 0)
        - quantidade;



    }








    movimentacoes.push({


        tipo:tipo,


        item:item.nome,


        quantidade:quantidade,


        operacao:operacao,


        data:
        document.getElementById(
            "dataMovimentacao"
        ).value,


        observacao:
        document.getElementById(
            "observacaoMovimentacao"
        ).value



    });






    salvarBanco();



    carregarMaterias();



    carregarEstoque();



    atualizarItensMovimentacao();



    alert(
        "Movimentação registrada!"
    );



}
