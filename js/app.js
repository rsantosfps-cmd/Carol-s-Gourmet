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
// INICIALIZA MATÉRIA-PRIMA
// ================================

function carregarSistemaMateriaPrima(){

    carregarMaterias();

    carregarEstoque();

    atualizarItensMovimentacao();

}



// ================================
// GERAR CÓDIGO MP
// ================================


function gerarCodigoMP(){


    let maior = 0;


    materias.forEach(function(mp){


        let numero =
        Number(
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





// ================================
// NOVA MATÉRIA-PRIMA
// ================================


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







// ================================
// SALVAR MATÉRIA-PRIMA
// ================================


function salvarMateriaPrima(){



    let nome =
    document
    .getElementById("nomeMP")
    .value
    .trim();



    if(nome===""){


        alert(
        "Informe o nome da matéria-prima"
        );


        return;


    }




    let materia = {


        codigo:
        document
        .getElementById("codigoMP")
        .value
        ||
        gerarCodigoMP(),



        nome:nome,



        categoria:
        document
        .getElementById("categoriaMP")
        .value,



        unidade:
        document
        .getElementById("unidadeMP")
        .value,



        estoque:
        Number(
        document
        .getElementById("estoqueMP")
        .value
        ) || 0,



        custo:
        Number(
        document
        .getElementById("custoMP")
        .value
        ) || 0,



        data:
        new Date()
        .toLocaleString()



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







// ================================
// LISTA MATÉRIAS
// ================================


function carregarMaterias(){



    let tabela =
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



    let cab =
    document.getElementById(
    "cabecalhoEstoque"
    );



    if(!tabela){

        return;

    }




    cab.innerHTML=`


<tr>

<th>Código</th>

<th>Nome</th>

<th>Unidade</th>

<th>Quantidade</th>

</tr>


`;



    tabela.innerHTML="";





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







// ================================
// ATUALIZA SELECT MOVIMENTAÇÃO
// ================================


function atualizarItensMovimentacao(){



    let select =
    document.getElementById(
    "itemMovimentacao"
    );



    if(!select){

        return;

    }




    select.innerHTML=
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








// ================================
// REGISTRAR MOVIMENTAÇÃO
// ================================


function registrarMovimentacao(){



    let codigo =
    document
    .getElementById("itemMovimentacao")
    .value;



    let quantidade =
    Number(
    document
    .getElementById("quantidadeMovimentacao")
    .value
    );



    let tipo =
    document
    .getElementById("tipoMovimentacao")
    .value;



    if(!codigo || quantidade<=0){


        alert(
        "Preencha os dados da movimentação"
        );


        return;

    }





    let mp =
    materias.find(function(item){


        return item.codigo===codigo;


    });





    if(!mp){

        alert(
        "Matéria-prima não encontrada"
        );

        return;

    }






    if(tipo==="entrada"){


        mp.estoque += quantidade;


    }else{


        mp.estoque -= quantidade;


    }






    movimentacoes.push({

        data:
        document
        .getElementById("dataMovimentacao")
        .value,

        item:
        mp.nome,

        quantidade:quantidade,

        operacao:tipo,

        observacao:
        document
        .getElementById("observacaoMovimentacao")
        .value


    });






    salvarBanco();



    carregarMaterias();


    carregarEstoque();



    alert(
    "Movimentação realizada!"
    );



}
