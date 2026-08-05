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


    carregarMaterias();


    carregarEstoque();


    iniciarProducao();


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
// PARTE 2/4 CORRIGIDA
// MATÉRIA-PRIMA + ESTOQUE + MOVIMENTAÇÃO
// ======================================================


// ================================
// GARANTIR BANCO
// ================================

if (typeof materias === "undefined") {

    let materias = JSON.parse(
        localStorage.getItem("carols_materias")
    ) || [];

}


if (typeof movimentacoes === "undefined") {

    let movimentacoes = JSON.parse(
        localStorage.getItem("carols_movimentacoes")
    ) || [];

}





function salvarMateriasBanco(){

    localStorage.setItem(
        "carols_materias",
        JSON.stringify(materias)
    );


    localStorage.setItem(
        "carols_movimentacoes",
        JSON.stringify(movimentacoes)
    );

}







// ======================================================
// MATÉRIA PRIMA
// ======================================================



function gerarCodigoMP(){


    return "MP-" +
    String(materias.length + 1)
    .padStart(4,"0");


}





function novaMateriaPrima(){


    let codigo =
    document.getElementById("codigoMP");


    if(codigo){

        codigo.value = gerarCodigoMP();

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
    document.getElementById("nomeMP");


    if(!nome){

        console.log(
            "Campo nomeMP não encontrado"
        );

        return;

    }



    nome = nome.value.trim();




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
        )?.value || gerarCodigoMP(),



        nome:nome,



        categoria:

        document.getElementById(
            "categoriaMP"
        )?.value || "",



        unidade:

        document.getElementById(
            "unidadeMP"
        )?.value || "",



        estoque:

        Number(
            document.getElementById(
                "estoqueMP"
            )?.value || 0
        ),



        custo:

        Number(
            document.getElementById(
                "custoMP"
            )?.value || 0
        )

    };





    materias.push(materia);



    salvarMateriasBanco();



    carregarMaterias();



    atualizarDashboard();



    novaMateriaPrima();




    alert(
        "Matéria-prima salva!"
    );


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


        tabela.innerHTML += `


<tr>

<td>${mp.codigo}</td>

<td>${mp.nome}</td>

<td>${mp.categoria}</td>

<td>${mp.unidade}</td>

<td>${mp.estoque}</td>

<td>R$ ${mp.custo.toFixed(2)}</td>

<td>
R$ ${(mp.estoque * mp.custo).toFixed(2)}
</td>


</tr>


`;


    });


}








// ======================================================
// ESTOQUE
// ======================================================



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



    if(!tabela){

        console.log(
            "listaEstoque não encontrado"
        );

        return;

    }




    tabela.innerHTML="";



    if(cabecalho){

        cabecalho.innerHTML = `


<tr>

<th>Código</th>

<th>Nome</th>

<th>Unidade</th>

<th>Quantidade</th>

</tr>


`;

    }






    materias.forEach(function(mp){



        tabela.innerHTML += `


<tr>

<td>${mp.codigo}</td>

<td>${mp.nome}</td>

<td>${mp.unidade}</td>

<td>${mp.estoque}</td>


</tr>


`;



    });



}









// ======================================================
// PRODUTO ACABADO NO ESTOQUE
// ======================================================


function carregarProdutoAcabadoEstoque(){


    let tabela =
    document.getElementById(
        "listaEstoque"
    );


    if(!tabela){

        return;

    }



    tabela.innerHTML="";



    if(typeof produtos === "undefined"){

        return;

    }





    produtos.forEach(function(produto){



        tabela.innerHTML += `


<tr>

<td>${produto.codigo}</td>

<td>${produto.nome}</td>

<td>${produto.unidade}</td>

<td>${produto.estoque || 0}</td>


</tr>


`;



    });



}







// ======================================================
// MOVIMENTAÇÃO
// ======================================================



function atualizarItensMovimentacao(){



    let select =
    document.getElementById(
        "itemMovimentacao"
    );



    if(!select){

        return;

    }



    select.innerHTML = `

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



    let item =
    document.getElementById(
        "itemMovimentacao"
    )?.value;




    let quantidade =
    Number(
        document.getElementById(
            "quantidadeMovimentacao"
        )?.value || 0
    );




    let operacao =
    document.getElementById(
        "tipoMovimentacao"
    )?.value;




    if(!item || quantidade <=0){


        alert(
            "Preencha os dados"
        );


        return;

    }





    let materia =
    materias.find(
        function(mp){

            return mp.codigo === item;

        }
    );





    if(!materia){

        return;

    }





    if(operacao==="entrada"){


        materia.estoque += quantidade;


    }else{


        materia.estoque -= quantidade;


    }






    movimentacoes.push({

        item:materia.nome,

        quantidade:quantidade,

        operacao:operacao,

        data:
        new Date()
        .toLocaleDateString()

    });





    salvarMateriasBanco();



    carregarMaterias();


    carregarEstoque();



    alert(
        "Movimentação salva!"
    );



}
// ======================================================
// CAROL'S GOURMET ERP 4.0
// PARTE 3/4
// PRODUÇÃO + PRECIFICAÇÃO
// ======================================================



// ======================================================
// PRODUÇÃO
// ======================================================



function carregarProdutosProducao(){


    const select =
    document.getElementById(
        "produtoProducao"
    );


    if(!select){

        return;

    }



    select.innerHTML = `

<option value="">
Selecione o produto
</option>

`;



    if(typeof produtos === "undefined"){

        return;

    }



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








function calcularValidadeProducao(){


    const fabricacao =
    document.getElementById(
        "fabricacaoProducao"
    );



    const validade =
    document.getElementById(
        "validadeProducao"
    );



    if(!fabricacao || !validade){

        return;

    }



    if(!fabricacao.value){

        return;

    }



    let data =
    new Date(
        fabricacao.value
    );



    // validade padrão 7 dias

    data.setDate(
        data.getDate() + 7
    );



    validade.value =
    data.toISOString()
    .split("T")[0];


}









function registrarProducao(){



    let produtoCodigo =
    document.getElementById(
        "produtoProducao"
    )?.value;



    let quantidade =
    Number(
        document.getElementById(
            "quantidadeProducao"
        )?.value || 0
    );




    if(!produtoCodigo || quantidade <=0){


        alert(
            "Selecione o produto e informe a quantidade"
        );


        return;

    }






    let produto =
    produtos.find(
        function(p){

            return p.codigo === produtoCodigo;

        }
    );





    if(!produto){


        alert(
            "Produto não encontrado"
        );


        return;

    }






    produto.estoque =
    Number(produto.estoque || 0)
    + quantidade;







    let producao = {


        produto:
        produto.nome,


        codigo:
        produto.codigo,


        quantidade:
        quantidade,


        fabricacao:
        document.getElementById(
            "fabricacaoProducao"
        )?.value || "",


        validade:
        document.getElementById(
            "validadeProducao"
        )?.value || "",


        observacao:
        document.getElementById(
            "observacaoProducao"
        )?.value || ""


    };






    producoes.push(producao);






    salvarBanco();



    carregarListaProducao();



    carregarEstoque();



    atualizarDashboard();





    alert(
        "Produção registrada!"
    );



}








function carregarListaProducao(){



    const tabela =
    document.getElementById(
        "listaProducao"
    );



    if(!tabela){

        return;

    }



    tabela.innerHTML="";





    if(typeof producoes === "undefined"){

        return;

    }





    producoes.forEach(function(p){



        tabela.innerHTML += `


<tr>

<td>${p.produto}</td>

<td>${p.quantidade}</td>

<td>${p.fabricacao}</td>

<td>${p.validade}</td>


</tr>


`;



    });



}








// ======================================================
// PRECIFICAÇÃO
// ======================================================





function carregarProdutosPreco(){



    const select =
    document.getElementById(
        "produtoPreco"
    );



    if(!select){

        return;

    }



    select.innerHTML = `

<option value="">
Selecione o produto
</option>

`;



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








function calcularPreco(){



    let materia =
    Number(
        document.getElementById(
            "custoMateria"
        )?.value || 0
    );



    let embalagem =
    Number(
        document.getElementById(
            "custoEmbalagem"
        )?.value || 0
    );



    let outros =
    Number(
        document.getElementById(
            "outrosCustos"
        )?.value || 0
    );



    let margem =
    Number(
        document.getElementById(
            "margemLucro"
        )?.value || 0
    );







    let custoTotal =
    materia +
    embalagem +
    outros;





    let venda =
    custoTotal *
    (1 + margem / 100);







    let resultadoCusto =
    document.getElementById(
        "resultadoCusto"
    );



    let resultadoVenda =
    document.getElementById(
        "resultadoVenda"
    );





    if(resultadoCusto){

        resultadoCusto.innerText =
        "R$ " +
        custoTotal.toFixed(2);

    }





    if(resultadoVenda){

        resultadoVenda.innerText =
        "R$ " +
        venda.toFixed(2);

    }



}







// ======================================================
// INICIALIZAÇÃO PRODUÇÃO / PRECIFICAÇÃO
// ======================================================


function iniciarProducao(){


    carregarProdutosProducao();


    carregarListaProducao();


    carregarProdutosPreco();


}
// ======================================================
// PARTE 4A
// TARJETAS
// ======================================================


// =========================================
// CARREGAR PRODUTOS
// =========================================

function carregarProdutosTarjeta() {

    const select = document.getElementById("produtoTarjeta");

    if (!select) return;

    select.innerHTML =
        '<option value="">Selecione...</option>';

    produtos.forEach(function (produto) {

        const categoria =
            (produto.categoria || "").toLowerCase();

        if (
            categoria.includes("brownie") ||
            categoria.includes("palha")
        ) {

            const option =
                document.createElement("option");

            option.value = produto.codigo;
            option.textContent = produto.nome;

            select.appendChild(option);

        }

    });

}



// =========================================
// ATUALIZAR VALIDADE
// =========================================

const fabricacaoTarjeta =
document.getElementById("fabricacaoTarjeta");

if (fabricacaoTarjeta) {

    fabricacaoTarjeta.addEventListener("change", function () {

        const validade =
        document.getElementById("validadeTarjeta");

        if (!validade) return;

        const data =
        new Date(this.value);

        data.setDate(data.getDate() + 30);

        validade.value =
        data.toISOString().split("T")[0];

    });

}



// =========================================
// GERAR TARJETAS
// =========================================

function gerarTarjetas() {

    const area =
    document.getElementById("areaTarjetas");

    if (!area) return;

    area.innerHTML = "";



    const codigo =
    document.getElementById("produtoTarjeta").value;

    if (codigo === "") {

        alert("Selecione um produto.");

        return;

    }



    const quantidade =
    Number(
        document.getElementById("quantidadeTarjeta").value
    ) || 1;



    const produto =
    produtos.find(function (p) {

        return p.codigo === codigo;

    });



    if (!produto) {

        alert("Produto não encontrado.");

        return;

    }



    let ean =
    produto.ean || produto.codigoBarras || "";



    if (ean === "") {

        alert(
            "Este produto não possui código EAN cadastrado."
        );

        return;

    }



    for (let i = 0; i < quantidade; i++) {

        const tarjeta =
        document.createElement("div");

        tarjeta.className = "tarjeta";



        tarjeta.innerHTML = `

        <div class="tarjeta-logo">
            Carol's Gourmet
        </div>

        <div class="tarjeta-produto">
            ${produto.nome}
        </div>

        <svg id="bc${i}"></svg>

        <div class="tarjeta-datas">

            <strong>Fab:</strong>
            ${document.getElementById("fabricacaoTarjeta").value}

            <br>

            <strong>Val:</strong>
            ${document.getElementById("validadeTarjeta").value}

        </div>

        `;

        area.appendChild(tarjeta);



        JsBarcode(`#bc${i}`, ean, {

            format: "EAN13",

            width: 2,

            height: 55,

            displayValue: true,

            margin: 0

        });

    }

}



// =========================================
// INICIALIZAÇÃO
// =========================================

window.addEventListener("load", function () {

    carregarProdutosTarjeta();

});
// ======================================================
// PARTE 4B
// IMPRESSÃO E EXPORTAÇÃO DAS TARJETAS
// ======================================================


// ========================================
// ORGANIZAR FOLHA A4
// ========================================

function organizarFolhaTarjetas() {

    const origem =
    document.getElementById("areaTarjetas");

    const folha =
    document.getElementById("folhaTarjetas");

    if (!origem || !folha) return;

    folha.innerHTML = "";

    origem.querySelectorAll(".tarjeta").forEach(function (item) {

        folha.appendChild(item.cloneNode(true));

    });

}



// ========================================
// EXPORTAR PNG
// ========================================

function salvarTarjetasPNG() {

    organizarFolhaTarjetas();

    const folha =
    document.getElementById("folhaTarjetas");

    html2canvas(folha, {

        scale: 3,

        backgroundColor: "#ffffff"

    }).then(function (canvas) {

        const link =
        document.createElement("a");

        link.download =
        "tarjetas-carols-gourmet.png";

        link.href =
        canvas.toDataURL("image/png");

        link.click();

    });

}



// ========================================
// IMPRESSÃO A4
// ========================================

function imprimirTarjetas() {

    organizarFolhaTarjetas();

    const conteudo =
    document.getElementById("folhaTarjetas").innerHTML;

    const janela =
    window.open("", "", "width=1000,height=900");

    janela.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Tarjetas</title>

<style>

@page{

size:A4 portrait;

margin:8mm;

}

body{

margin:0;

padding:0;

font-family:Arial,sans-serif;

}

.folha{

display:grid;

grid-template-columns:repeat(3,5cm);

justify-content:center;

gap:6mm;

}

.tarjeta{

width:5cm;

height:21cm;

border:1px solid #000;

border-radius:8px;

padding:8px;

box-sizing:border-box;

display:flex;

flex-direction:column;

justify-content:space-between;

align-items:center;

background:#fff;

}

.tarjeta-logo{

font-size:18px;

font-weight:bold;

text-align:center;

}

.tarjeta-produto{

font-size:16px;

font-weight:bold;

text-align:center;

margin-top:10px;

margin-bottom:10px;

}

.tarjeta-datas{

font-size:11px;

text-align:center;

line-height:18px;

}

svg{

width:100%;

height:auto;

}

</style>

</head>

<body>

<div class="folha">

${conteudo}

</div>

<script>

window.onload=function(){

window.print();

window.close();

}

</script>

</body>

</html>

`);

    janela.document.close();

}
