/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 1

   Banco de dados offline
   LocalStorage
===================================================== */


/* =====================================================
   CHAVES DO SISTEMA
===================================================== */
const DB = {

    empresa:
    "carols_gourmet_empresa",

    produtos:
    "carols_gourmet_produtos",

    materias:
    "carols_gourmet_materias_primas",

    estoque:
    "carols_gourmet_estoque",

    producao:
    "carols_gourmet_producao",

    etiquetas:
    "carols_gourmet_etiquetas",

    vendas:
    "carols_gourmet_vendas",

    usuarios:
    "carols_gourmet_usuarios",

    lotes:
    "carols_gourmet_lotes",

    inventarios:
    "carols_gourmet_inventarios",

    sincronizacao:
    "carols_gourmet_sincronizacao",

    scanner:
    "carols_gourmet_scanner",

    backups:
    "carols_gourmet_backups",

    configuracoes:
    "carols_gourmet_configuracoes",

    historico:
    "carols_gourmet_historico",

financeiro:
"carols_gourmet_financeiro",

fichasTecnicas:
"carols_gourmet_fichas_tecnicas",

fornecedores:
"carols_gourmet_fornecedores",

compras:
"carols_gourmet_compras",

alertas:
"carols_gourmet_alertas",

filaImpressao:
"carols_gourmet_fila_impressao",

cameraLeituras:
"carols_gourmet_camera_leituras",

backups:
"carols_gourmet_backups"

};
/* =====================================================
   INICIALIZAÇÃO DO BANCO
===================================================== */


function iniciarBanco(){


    if(!localStorage.getItem(DB.produtos)){


        localStorage.setItem(
            DB.produtos,
            JSON.stringify([])
        );


    }



    if(!localStorage.getItem(DB.materias)){


        localStorage.setItem(
            DB.materias,
            JSON.stringify([])
        );


    }



    if(!localStorage.getItem(DB.estoque)){


        localStorage.setItem(
            DB.estoque,
            JSON.stringify([])
        );


    }



    if(!localStorage.getItem(DB.producao)){


        localStorage.setItem(
            DB.producao,
            JSON.stringify([])
        );


    }



    if(!localStorage.getItem(DB.etiquetas)){


        localStorage.setItem(
            DB.etiquetas,
            JSON.stringify([])
        );


    }



    if(!localStorage.getItem(DB.historico)){


        localStorage.setItem(
            DB.historico,
            JSON.stringify([])
        );


    }



    if(!localStorage.getItem(DB.configuracoes)){


        localStorage.setItem(
            DB.configuracoes,
            JSON.stringify({

                tema:"carols",

                impressora:"padrao",

                leituraCamera:true

            })
        );


    }


}



/* Executa ao carregar */

iniciarBanco();




/* =====================================================
   FUNÇÕES BASE DO BANCO
===================================================== */


/*
    Salvar qualquer informação
*/

function salvarDados(chave,dados){


    localStorage.setItem(

        chave,

        JSON.stringify(dados)

    );


}



/*
    Ler informações
*/

function lerDados(chave){


    const dados =
    localStorage.getItem(chave);



    if(!dados){

        return [];

    }



    return JSON.parse(dados);


}



/*
    Gerar ID automático
*/

function gerarID(lista){


    if(lista.length === 0){

        return 1;

    }



    return Math.max(

        ...lista.map(item=>item.id)

    ) + 1;


}



/* =====================================================
   EMPRESA
===================================================== */


function salvarEmpresa(dados){


    localStorage.setItem(

        DB.empresa,

        JSON.stringify(dados)

    );


}



function buscarEmpresa(){


    const empresa =
    localStorage.getItem(DB.empresa);



    return empresa ?

    JSON.parse(empresa)

    :

    null;


}



/* =====================================================
   PRODUTOS
===================================================== */


/*
Estrutura:

{
 id,
 codigoBarras,
 nome,
 categoria,
 unidade,
 custo,
 venda,
 estoque,
 validade,
 ativo
}

*/


function listarProdutos(){


    return lerDados(DB.produtos);


}





function salvarProdutos(lista){


    salvarDados(

        DB.produtos,

        lista

    );


}





/*
Busca pelo código de barras

Usado pela webcam
e pelo celular
*/


function buscarProdutoPorCodigo(codigo){


    const produtos =
    listarProdutos();



    return produtos.find(

        produto =>

        produto.codigoBarras == codigo

    );


}



/*
Busca pelo nome

*/


function buscarProdutoNome(nome){


    const produtos =
    listarProdutos();



    return produtos.filter(

        produto =>

        produto.nome
        .toLowerCase()
        .includes(
            nome.toLowerCase()
        )

    );


}





/* =====================================================
   FIM STORAGE.JS PARTE 1
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 2

   Gerenciamento de produtos
===================================================== */


/* =====================================================
   CRIAR PRODUTO
===================================================== */


function criarProduto(produto){


    const produtos =
    listarProdutos();



    /*
       Verifica se código de barras
       já existe
    */


    const existe = produtos.find(

        item =>

        item.codigoBarras ==
        produto.codigoBarras

    );



    if(existe){


        return {

            sucesso:false,

            mensagem:
            "Código de barras já cadastrado"

        };


    }



    const novoProduto = {


        id:
        gerarID(produtos),


        codigoBarras:
        produto.codigoBarras || "",


        nome:
        produto.nome || "",


        categoria:
        produto.categoria || "",


        unidade:
        produto.unidade || "UN",


        custo:
        Number(produto.custo) || 0,


        venda:
        Number(produto.venda) || 0,


        estoque:
        Number(produto.estoque) || 0,


        validade:
        produto.validade || "",


        ativo:true,


        criadoEm:
        new Date().toISOString()


    };



    produtos.push(novoProduto);



    salvarProdutos(produtos);



    registrarHistorico(

        "Produto criado",

        novoProduto

    );



    return {


        sucesso:true,


        produto:
        novoProduto


    };


}



/* =====================================================
   EDITAR PRODUTO
===================================================== */


function editarProduto(id,alteracoes){


    const produtos =
    listarProdutos();



    const index =
    produtos.findIndex(

        produto =>
        produto.id == id

    );



    if(index === -1){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    produtos[index] = {


        ...produtos[index],


        ...alteracoes,


        atualizadoEm:
        new Date().toISOString()


    };



    salvarProdutos(produtos);



    registrarHistorico(

        "Produto atualizado",

        produtos[index]

    );



    return {


        sucesso:true,


        produto:
        produtos[index]


    };


}



/* =====================================================
   EXCLUIR PRODUTO
===================================================== */


function excluirProduto(id){


    let produtos =
    listarProdutos();



    const produto =
    produtos.find(

        item =>
        item.id == id

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    produtos =
    produtos.filter(

        item =>
        item.id != id

    );



    salvarProdutos(produtos);



    registrarHistorico(

        "Produto excluído",

        produto

    );



    return {


        sucesso:true


    };


}



/* =====================================================
   ATIVAR / DESATIVAR PRODUTO
===================================================== */


function alterarStatusProduto(id,status){


    const produtos =
    listarProdutos();



    const produto =
    produtos.find(

        item =>
        item.id == id

    );



    if(!produto){


        return false;


    }



    produto.ativo =
    status;



    salvarProdutos(produtos);



    return true;


}



/* =====================================================
   LISTAR PRODUTOS ATIVOS
===================================================== */


function listarProdutosAtivos(){


    return listarProdutos()

    .filter(

        produto =>
        produto.ativo

    );


}



/* =====================================================
   CONTADORES
===================================================== */


function totalProdutos(){


    return listarProdutos().length;


}



function totalProdutosAtivos(){


    return listarProdutosAtivos().length;


}



/* =====================================================
   HISTÓRICO
===================================================== */


function registrarHistorico(tipo,dados){


    const historico =
    lerDados(DB.historico);



    historico.push({


        id:
        gerarID(historico),


        tipo:


        tipo,


        dados:


        dados,


        data:

        new Date().toISOString()


    });



    salvarDados(

        DB.historico,

        historico

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 2
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 3

   Controle de estoque
===================================================== */


/* =====================================================
   LISTAR ESTOQUE
===================================================== */


function listarEstoque(){


    return lerDados(DB.estoque);


}



/* =====================================================
   SALVAR ESTOQUE
===================================================== */


function salvarEstoque(lista){


    salvarDados(

        DB.estoque,

        lista

    );


}



/* =====================================================
   LOCALIZAR PRODUTO NO ESTOQUE
===================================================== */


function buscarEstoquePorProduto(idProduto){


    const estoque =
    listarEstoque();



    return estoque.find(

        item =>

        item.idProduto == idProduto

    );


}



/* =====================================================
   ENTRADA DE ESTOQUE
===================================================== */


function entradaEstoque(idProduto,quantidade,motivo="Entrada"){


    const produtos =
    listarProdutos();



    const produto =
    produtos.find(

        item =>
        item.id == idProduto

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    produto.estoque += Number(quantidade);



    salvarProdutos(produtos);



    registrarMovimentoEstoque({

        produto:idProduto,

        tipo:"ENTRADA",

        quantidade:Number(quantidade),

        motivo:motivo

    });



    return {


        sucesso:true,


        estoqueAtual:
        produto.estoque


    };


}



/* =====================================================
   SAÍDA DE ESTOQUE
===================================================== */


function saidaEstoque(idProduto,quantidade,motivo="Saída"){


    const produtos =
    listarProdutos();



    const produto =
    produtos.find(

        item =>
        item.id == idProduto

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    if(produto.estoque < quantidade){


        return {


            sucesso:false,


            mensagem:
            "Estoque insuficiente"


        };


    }



    produto.estoque -= Number(quantidade);



    salvarProdutos(produtos);



    registrarMovimentoEstoque({

        produto:idProduto,

        tipo:"SAIDA",

        quantidade:Number(quantidade),

        motivo:motivo

    });



    return {


        sucesso:true,


        estoqueAtual:
        produto.estoque


    };


}



/* =====================================================
   AJUSTE MANUAL DE ESTOQUE
===================================================== */


function ajustarEstoque(idProduto,novaQuantidade){


    const produtos =
    listarProdutos();



    const produto =
    produtos.find(

        item =>
        item.id == idProduto

    );



    if(!produto){


        return false;


    }



    const anterior =
    produto.estoque;



    produto.estoque =
    Number(novaQuantidade);



    salvarProdutos(produtos);



    registrarMovimentoEstoque({

        produto:idProduto,

        tipo:"AJUSTE",

        anterior:anterior,

        novo:
        novaQuantidade

    });



    return true;


}



/* =====================================================
   CONSULTAR ESTOQUE BAIXO
===================================================== */


function produtosEstoqueBaixo(limite=5){


    return listarProdutos()

    .filter(

        produto =>

        produto.estoque <= limite

        &&

        produto.ativo

    );


}



/* =====================================================
   MOVIMENTAÇÃO DE ESTOQUE
===================================================== */


function registrarMovimentoEstoque(dados){


    const historico =
    lerDados(DB.historico);



    historico.push({


        id:
        gerarID(historico),


        modulo:
        "ESTOQUE",


        ...dados,


        data:
        new Date().toISOString()


    });



    salvarDados(

        DB.historico,

        historico

    );


}



/* =====================================================
   RELATÓRIO DE ESTOQUE
===================================================== */


function resumoEstoque(){


    const produtos =
    listarProdutos();



    return {


        totalItens:

        produtos.length,


        quantidadeTotal:

        produtos.reduce(

            (total,item)=>

            total + item.estoque,

            0

        ),


        baixoEstoque:

        produtosEstoqueBaixo().length


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 3
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 4

   Controle de produção
===================================================== */


/* =====================================================
   LISTAR PRODUÇÕES
===================================================== */


function listarProducoes(){


    return lerDados(DB.producao);


}



/* =====================================================
   SALVAR PRODUÇÕES
===================================================== */


function salvarProducoes(lista){


    salvarDados(

        DB.producao,

        lista

    );


}



/* =====================================================
   CRIAR FICHA TÉCNICA
===================================================== */


/*
Exemplo:

{
produtoFinal:1,

ingredientes:[
 {
  produto:5,
  quantidade:2
 }
]

}

*/


function criarFichaTecnica(dados){


    const producoes =
    listarProducoes();



    const ficha = {


        id:
        gerarID(producoes),


        tipo:
        "FICHA",


        produtoFinal:
        dados.produtoFinal,


        ingredientes:
        dados.ingredientes || [],


        criadoEm:
        new Date().toISOString()


    };



    producoes.push(ficha);



    salvarProducoes(producoes);



    return ficha;


}



/* =====================================================
   BUSCAR FICHA DO PRODUTO
===================================================== */


function buscarFichaTecnica(idProduto){


    const producoes =
    listarProducoes();



    return producoes.find(

        item =>

        item.tipo === "FICHA"

        &&

        item.produtoFinal == idProduto

    );


}



/* =====================================================
   CRIAR ORDEM DE PRODUÇÃO
===================================================== */


function criarOrdemProducao(idProduto,quantidade){


    const producoes =
    listarProducoes();



    const ordem = {


        id:
        gerarID(producoes),


        tipo:
        "ORDEM",


        produto:
        idProduto,


        quantidade:
        Number(quantidade),


        status:
        "ABERTA",


        data:
        new Date().toISOString()


    };



    producoes.push(ordem);



    salvarProducoes(producoes);



    registrarHistorico(

        "Ordem de produção criada",

        ordem

    );



    return ordem;


}



/* =====================================================
   FINALIZAR PRODUÇÃO
===================================================== */


function finalizarProducao(idOrdem){


    const producoes =
    listarProducoes();



    const ordem =
    producoes.find(

        item =>

        item.id == idOrdem

        &&

        item.tipo=="ORDEM"

    );



    if(!ordem){


        return {


            sucesso:false,


            mensagem:
            "Produção não encontrada"


        };


    }



    if(ordem.status === "FINALIZADA"){


        return {


            sucesso:false,


            mensagem:
            "Produção já finalizada"


        };


    }



    const ficha =
    buscarFichaTecnica(

        ordem.produto

    );



    /*
       Baixa ingredientes
    */


    if(ficha){


        ficha.ingredientes.forEach(

            item => {


                saidaEstoque(

                    item.produto,

                    item.quantidade *
                    ordem.quantidade,

                    "Produção"

                );


            }

        );


    }



    /*
       Entrada produto pronto
    */


    entradaEstoque(

        ordem.produto,

        ordem.quantidade,

        "Produção finalizada"

    );



    ordem.status =
    "FINALIZADA";


    ordem.finalizadaEm =
    new Date().toISOString();



    salvarProducoes(producoes);



    registrarHistorico(

        "Produção finalizada",

        ordem

    );



    return {


        sucesso:true,


        ordem:ordem


    };


}



/* =====================================================
   PRODUÇÕES EM ABERTO
===================================================== */


function producoesPendentes(){


    return listarProducoes()

    .filter(

        item =>

        item.tipo==="ORDEM"

        &&

        item.status==="ABERTA"

    );


}



/* =====================================================
   RESUMO DA PRODUÇÃO
===================================================== */


function resumoProducao(){


    const lista =
    listarProducoes();



    return {


        abertas:

        lista.filter(

            item =>

            item.status==="ABERTA"

        ).length,


        finalizadas:

        lista.filter(

            item =>

            item.status==="FINALIZADA"

        ).length


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 4
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 5

   Sistema de etiquetas
===================================================== */


/* =====================================================
   LISTAR ETIQUETAS
===================================================== */


function listarEtiquetas(){


    return lerDados(DB.etiquetas);


}



/* =====================================================
   SALVAR ETIQUETAS
===================================================== */


function salvarEtiquetas(lista){


    salvarDados(

        DB.etiquetas,

        lista

    );


}



/* =====================================================
   GERAR CÓDIGO INTERNO DE LOTE
===================================================== */


function gerarLote(){


    const agora =
    new Date();



    return (

        agora.getFullYear()

        +

        String(
            agora.getMonth()+1
        ).padStart(2,"0")

        +

        String(
            agora.getDate()
        ).padStart(2,"0")

        +

        String(
            agora.getHours()
        ).padStart(2,"0")

        +

        String(
            agora.getMinutes()
        ).padStart(2,"0")

    );


}



/* =====================================================
   CRIAR ETIQUETA
===================================================== */


/*

Estrutura:

{
produto,
codigoBarras,
lote,
validade,
quantidade
}

*/


function criarEtiqueta(dados){


    const etiquetas =
    listarEtiquetas();



    const produto =
    buscarProdutoPorCodigo(

        dados.codigoBarras

    )
    ||

    listarProdutos().find(

        item =>

        item.id == dados.produto

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    const etiqueta = {


        id:
        gerarID(etiquetas),


        produtoId:
        produto.id,


        nomeProduto:
        produto.nome,


        codigoBarras:
        produto.codigoBarras,


        lote:
        dados.lote

        ||

        gerarLote(),


        validade:
        dados.validade

        ||

        produto.validade,


        quantidade:
        dados.quantidade || 1,


        criadoEm:
        new Date().toISOString()


    };



    etiquetas.push(etiqueta);



    salvarEtiquetas(etiquetas);



    registrarHistorico(

        "Etiqueta criada",

        etiqueta

    );



    return {


        sucesso:true,


        etiqueta:etiqueta


    };


}



/* =====================================================
   BUSCAR ETIQUETA PELO CÓDIGO
===================================================== */


/*

Essa função será usada pelo scanner

*/


function buscarEtiquetaPorCodigo(codigo){


    const etiquetas =
    listarEtiquetas();



    return etiquetas.find(

        item =>

        item.codigoBarras == codigo

    );


}



/* =====================================================
   HISTÓRICO DE ETIQUETAS
===================================================== */


function etiquetasDoProduto(idProduto){


    return listarEtiquetas()

    .filter(

        item =>

        item.produtoId == idProduto

    );


}



/* =====================================================
   PREPARAR IMPRESSÃO
===================================================== */


function dadosImpressaoEtiqueta(idEtiqueta){


    const etiquetas =
    listarEtiquetas();



    return etiquetas.find(

        item =>

        item.id == idEtiqueta

    );


}



/* =====================================================
   GERAR ETIQUETA AUTOMÁTICA
   APÓS PRODUÇÃO
===================================================== */


function gerarEtiquetaProducao(idProduto,quantidade,validade){


    const produto =
    listarProdutos().find(

        item =>

        item.id == idProduto

    );



    if(!produto){


        return false;


    }



    return criarEtiqueta({


        produto:idProduto,


        codigoBarras:
        produto.codigoBarras,


        quantidade:quantidade,


        validade:validade


    });


}



/* =====================================================
   FIM STORAGE.JS PARTE 5
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 6

   Configurações, backup e segurança
===================================================== */


/* =====================================================
   CONFIGURAÇÕES
===================================================== */


function buscarConfiguracoes(){


    const dados =
    localStorage.getItem(
        DB.configuracoes
    );



    return dados ?

    JSON.parse(dados)

    :

    {};

}



/* Salvar configurações */


function salvarConfiguracoes(config){


    localStorage.setItem(

        DB.configuracoes,

        JSON.stringify(config)

    );


}



/* Atualizar uma configuração */


function atualizarConfiguracao(chave,valor){


    const config =
    buscarConfiguracoes();



    config[chave] =
    valor;



    salvarConfiguracoes(config);



    return config;


}



/* =====================================================
   DADOS DA EMPRESA
===================================================== */


function atualizarEmpresa(dados){


    const empresa = {


        nome:

        dados.nome || "Carol's Gourmet",


        cnpj:

        dados.cnpj || "",


        telefone:

        dados.telefone || "",


        endereco:

        dados.endereco || "",


        logo:

        dados.logo || "",


        atualizado:

        new Date().toISOString()


    };



    salvarEmpresa(empresa);



    return empresa;


}



/* =====================================================
   BACKUP COMPLETO
===================================================== */


/*

Cria uma cópia de todo banco

Produtos
Estoque
Produção
Etiquetas
Configurações

*/


function criarBackup(){


    const backup = {


        sistema:

        "Carol's Gourmet ERP 4.0",


        data:

        new Date().toISOString(),


        empresa:

        buscarEmpresa(),


        produtos:

        listarProdutos(),


        estoque:

        listarEstoque(),


        producao:

        listarProducoes(),


        etiquetas:

        listarEtiquetas(),


        configuracoes:

        buscarConfiguracoes(),


        historico:

        lerDados(DB.historico)


    };



    return JSON.stringify(

        backup,

        null,

        2

    );


}



/* =====================================================
   RESTAURAR BACKUP
===================================================== */


function restaurarBackup(arquivo){


    try{


        const backup =
        typeof arquivo === "string"

        ?

        JSON.parse(arquivo)

        :

        arquivo;



        salvarDados(

            DB.produtos,

            backup.produtos || []

        );



        salvarDados(

            DB.estoque,

            backup.estoque || []

        );



        salvarDados(

            DB.producao,

            backup.producao || []

        );



        salvarDados(

            DB.etiquetas,

            backup.etiquetas || []

        );



        salvarDados(

            DB.historico,

            backup.historico || []

        );



        salvarDados(

            DB.configuracoes,

            backup.configuracoes || {}

        );



        if(backup.empresa){

            salvarEmpresa(

                backup.empresa

            );

        }



        return {


            sucesso:true


        };



    }

    catch(erro){



        return {


            sucesso:false,


            erro:erro.message


        };

    }


}



/* =====================================================
   EXPORTAR BANCO
===================================================== */


function exportarBanco(){


    const dados = {


        produtos:
        listarProdutos(),


        estoque:
        listarEstoque(),


        producao:
        listarProducoes(),


        etiquetas:
        listarEtiquetas(),


        historico:
        lerDados(DB.historico)


    };



    const blob =

    new Blob(

        [

            JSON.stringify(
                dados,
                null,
                2
            )

        ],

        {

            type:
            "application/json"

        }

    );



    return URL.createObjectURL(blob);


}



/* =====================================================
   APAGAR BANCO
===================================================== */


function apagarBanco(){


    Object.values(DB)

    .forEach(

        chave =>

        localStorage.removeItem(chave)

    );



    iniciarBanco();



    return true;


}



/* =====================================================
   INFORMAÇÕES DO SISTEMA
===================================================== */


function infoSistema(){


    return {


        produtos:

        totalProdutos(),


        producoes:

        listarProducoes().length,


        etiquetas:

        listarEtiquetas().length,


        ultimaAtualizacao:

        new Date().toISOString()


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 6
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 7

   Custos e formação de preço
===================================================== */


/* =====================================================
   BUSCAR CUSTO DE UM PRODUTO
===================================================== */


function buscarCustoProduto(idProduto){


    const produto =
    listarProdutos().find(

        item =>
        item.id == idProduto

    );



    if(!produto){

        return 0;

    }



    return Number(produto.custo) || 0;


}



/* =====================================================
   CALCULAR CUSTO DA FICHA TÉCNICA
===================================================== */


/*

Receita:

Produto final:
Bolo

Ingredientes:

Farinha 2kg
Chocolate 1kg

*/


function calcularCustoFicha(idProduto){


    const ficha =
    buscarFichaTecnica(idProduto);



    if(!ficha){


        return {


            custoTotal:0,


            ingredientes:[]

        };


    }



    let custoTotal = 0;



    const detalhes = [];



    ficha.ingredientes.forEach(

        item => {



            const custo =
            buscarCustoProduto(

                item.produto

            );



            const subtotal =

            custo *

            item.quantidade;



            custoTotal += subtotal;



            detalhes.push({


                produto:
                item.produto,


                quantidade:
                item.quantidade,


                custo:
                custo,


                subtotal:
                subtotal


            });



        }

    );



    return {


        custoTotal:
        custoTotal,


        ingredientes:
        detalhes


    };


}



/* =====================================================
   CUSTO POR UNIDADE PRODUZIDA
===================================================== */


function custoUnitarioProducao(
    idProduto,
    quantidade
){


    const resultado =

    calcularCustoFicha(idProduto);



    if(!quantidade){

        return 0;

    }



    return (

        resultado.custoTotal /

        quantidade

    );


}



/* =====================================================
   CALCULAR MARGEM
===================================================== */


function calcularMargem(
    custo,
    venda
){


    if(venda <= 0){

        return 0;

    }



    return (

        ((venda - custo)

        /

        venda)

        *

        100

    );


}



/* =====================================================
   SUGESTÃO DE PREÇO
===================================================== */


function sugerirPrecoVenda(
    custo,
    margem=50
){


    if(custo <= 0){

        return 0;

    }



    return (

        custo /

        (1 -

        margem / 100)

    );


}



/* =====================================================
   PREÇO PARA IFOOD
===================================================== */


/*

Considera:

Taxas
embalagem
comissão

*/

function sugerirPrecoIFood(
    precoNormal,
    taxa=25
){


    return (

        precoNormal /

        (1 -

        taxa / 100)

    );


}



/* =====================================================
   ANALISAR PRODUTO
===================================================== */


function analisarProdutoPreco(idProduto){


    const produto =

    listarProdutos().find(

        item =>

        item.id == idProduto

    );



    if(!produto){


        return null;


    }



    const custo =
    Number(produto.custo);



    const venda =
    Number(produto.venda);



    return {


        produto:

        produto.nome,


        custo:

        custo,


        venda:

        venda,


        lucro:

        venda - custo,


        margem:

        calcularMargem(

            custo,

            venda

        ),


        sugestao:

        sugerirPrecoVenda(

            custo,

            50

        ),


        ifood:

        sugerirPrecoIFood(

            venda

        )


    };


}



/* =====================================================
   SIMULADOR DE PREÇO
===================================================== */


function simularPreco(
    custo,
    margem,
    taxaIFood
){


    const venda =

    sugerirPrecoVenda(

        custo,

        margem

    );



    return {


        custo:

        custo,


        venda:

        venda,


        iFood:

        sugerirPrecoIFood(

            venda,

            taxaIFood

        )


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 7
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 8

   Dashboard e indicadores
===================================================== */


/* =====================================================
   TOTAL DE ITENS EM ESTOQUE
===================================================== */


function quantidadeTotalEstoque(){


    const produtos =
    listarProdutos();



    return produtos.reduce(

        (total,produto)=>

        total +

        Number(produto.estoque || 0),

        0

    );


}



/* =====================================================
   VALOR DE CUSTO DO ESTOQUE
===================================================== */


function valorCustoEstoque(){


    const produtos =
    listarProdutos();



    return produtos.reduce(

        (total,produto)=>


        total +

        (

            Number(produto.estoque || 0)

            *

            Number(produto.custo || 0)

        ),


        0

    );


}



/* =====================================================
   VALOR DE VENDA DO ESTOQUE
===================================================== */


function valorVendaEstoque(){


    const produtos =
    listarProdutos();



    return produtos.reduce(

        (total,produto)=>


        total +

        (

            Number(produto.estoque || 0)

            *

            Number(produto.venda || 0)

        ),


        0

    );


}



/* =====================================================
   LUCRO ESTIMADO DO ESTOQUE
===================================================== */


function lucroEstimadoEstoque(){


    return (

        valorVendaEstoque()

        -

        valorCustoEstoque()

    );


}



/* =====================================================
   PRODUTOS COM ESTOQUE BAIXO
===================================================== */


function alertaEstoque(){


    return {


        quantidade:

        produtosEstoqueBaixo().length,


        produtos:

        produtosEstoqueBaixo()


    };


}



/* =====================================================
   RESUMO DE PRODUÇÃO
===================================================== */


function resumoProducaoDashboard(){


    const producoes =
    listarProducoes();



    return {


        abertas:

        producoes.filter(

            item =>

            item.tipo==="ORDEM"

            &&

            item.status==="ABERTA"

        ).length,



        finalizadas:

        producoes.filter(

            item =>

            item.tipo==="ORDEM"

            &&

            item.status==="FINALIZADA"

        ).length


    };


}



/* =====================================================
   PRODUTOS CADASTRADOS
===================================================== */


function resumoProdutos(){


    const produtos =
    listarProdutos();



    return {


        total:

        produtos.length,


        ativos:

        produtos.filter(

            item =>

            item.ativo

        ).length,


        inativos:

        produtos.filter(

            item =>

            !item.ativo

        ).length


    };


}



/* =====================================================
   RESUMO FINANCEIRO
===================================================== */


function resumoFinanceiro(){


    return {


        estoqueCusto:

        valorCustoEstoque(),



        estoqueVenda:

        valorVendaEstoque(),



        lucroPossivel:

        lucroEstimadoEstoque()


    };


}



/* =====================================================
   DASHBOARD COMPLETO
===================================================== */


function carregarDashboard(){


    return {


        produtos:

        resumoProdutos(),



        estoque:


        {


            quantidade:

            quantidadeTotalEstoque(),


            baixo:

            alertaEstoque().quantidade,


            valorCusto:

            valorCustoEstoque(),


            valorVenda:

            valorVendaEstoque()


        },



        producao:

        resumoProducaoDashboard(),



        financeiro:

        resumoFinanceiro(),



        atualizado:

        new Date().toISOString()


    };


}



/* =====================================================
   FORMATAR MOEDA
===================================================== */


function formatarMoeda(valor){


    return Number(valor)

    .toLocaleString(

        "pt-BR",

        {

            style:"currency",

            currency:"BRL"

        }

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 8
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 9

   Vendas e movimentação comercial
===================================================== */


/* =====================================================
   INICIALIZAR VENDAS
===================================================== */


function iniciarVendas(){


    if(!localStorage.getItem(DB.vendas)){


        salvarDados(

            DB.vendas,

            []

        );


    }


}


iniciarVendas();



/* =====================================================
   LISTAR VENDAS
===================================================== */


function listarVendas(){


    return lerDados(DB.vendas);


}



/* =====================================================
   SALVAR VENDAS
===================================================== */


function salvarVendas(lista){


    salvarDados(

        DB.vendas,

        lista

    );


}



/* =====================================================
   REGISTRAR VENDA
===================================================== */


function registrarVenda(dados){


    const vendas =
    listarVendas();



    const produto =
    buscarProdutoPorCodigo(

        dados.codigoBarras

    )

    ||

    listarProdutos().find(

        item =>

        item.id == dados.produto

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    const quantidade =

    Number(dados.quantidade || 1);



    const resultado =

    saidaEstoque(

        produto.id,

        quantidade,

        "Venda"

    );



    if(!resultado.sucesso){


        return resultado;


    }



    const venda = {


        id:

        gerarID(vendas),


        produtoId:

        produto.id,


        codigoBarras:

        produto.codigoBarras,


        produto:

        produto.nome,


        quantidade:

        quantidade,


        valorUnitario:

        produto.venda,


        total:

        produto.venda *

        quantidade,


        data:

        new Date().toISOString()


    };



    vendas.push(venda);



    salvarVendas(vendas);



    registrarHistorico(

        "Venda registrada",

        venda

    );



    return {


        sucesso:true,


        venda:venda


    };


}



/* =====================================================
   VENDA PELO SCANNER
===================================================== */


/*

Essa função será usada pelo:

- Leitor USB
- Webcam
- Celular

*/


function venderPorCodigo(codigo,quantidade=1){


    return registrarVenda({


        codigoBarras:

        codigo,


        quantidade:

        quantidade


    });


}



/* =====================================================
   FATURAMENTO
===================================================== */


function faturamentoTotal(){


    const vendas =
    listarVendas();



    return vendas.reduce(

        (total,venda)=>


        total +

        Number(venda.total),


        0

    );


}



/* =====================================================
   FATURAMENTO DO DIA
===================================================== */


function faturamentoHoje(){


    const hoje =

    new Date()

    .toISOString()

    .substring(0,10);



    return listarVendas()

    .filter(

        venda =>

        venda.data

        .substring(0,10)

        ==

        hoje

    )

    .reduce(

        (total,venda)=>

        total +

        venda.total,

        0

    );


}



/* =====================================================
   PRODUTOS MAIS VENDIDOS
===================================================== */


function produtosMaisVendidos(){


    const vendas =
    listarVendas();



    const resumo = {};



    vendas.forEach(

        venda => {


            if(!resumo[venda.produto]){


                resumo[venda.produto]={


                    nome:

                    venda.produto,


                    quantidade:

                    0


                };


            }



            resumo[venda.produto]

            .quantidade +=

            venda.quantidade;


        }


    );



    return Object.values(resumo)

    .sort(

        (a,b)=>

        b.quantidade -

        a.quantidade

    );


}



/* =====================================================
   RESUMO COMERCIAL
===================================================== */


function resumoVendas(){


    return {


        quantidade:

        listarVendas().length,


        faturamento:

        faturamentoTotal(),


        hoje:

        faturamentoHoje(),


        maisVendidos:

        produtosMaisVendidos()

    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 9
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 10

   Usuários e permissões
===================================================== */


/* =====================================================
   INICIALIZAR USUÁRIOS
===================================================== */


function iniciarUsuarios(){


    if(!localStorage.getItem(DB.usuarios)){


        const usuarioInicial = [


            {


                id:1,


                nome:"Administrador",


                usuario:"admin",


                senha:"1234",


                perfil:"ADMIN",


                ativo:true


            }


        ];



        salvarDados(

            DB.usuarios,

            usuarioInicial

        );


    }


}


iniciarUsuarios();



/* =====================================================
   LISTAR USUÁRIOS
===================================================== */


function listarUsuarios(){


    return lerDados(DB.usuarios);


}



/* =====================================================
   CRIAR USUÁRIO
===================================================== */


function criarUsuario(dados){


    const usuarios =
    listarUsuarios();



    const existe = usuarios.find(

        usuario =>

        usuario.usuario

        ==

        dados.usuario

    );



    if(existe){


        return {


            sucesso:false,


            mensagem:
            "Usuário já existe"


        };


    }



    const novo = {


        id:

        gerarID(usuarios),


        nome:

        dados.nome,


        usuario:

        dados.usuario,


        senha:

        dados.senha,


        perfil:

        dados.perfil || "OPERADOR",


        ativo:true


    };



    usuarios.push(novo);



    salvarDados(

        DB.usuarios,

        usuarios

    );



    registrarHistorico(

        "Usuário criado",

        {

            usuario:
            novo.usuario,

            perfil:
            novo.perfil

        }

    );



    return {


        sucesso:true,


        usuario:novo


    };


}



/* =====================================================
   LOGIN
===================================================== */


function login(usuario,senha){


    const usuarios =
    listarUsuarios();



    const encontrado = usuarios.find(

        item =>


        item.usuario == usuario

        &&

        item.senha == senha

        &&

        item.ativo


    );



    if(!encontrado){


        return {


            sucesso:false,


            mensagem:
            "Usuário ou senha inválidos"


        };


    }



    localStorage.setItem(

        "usuario_logado",

        JSON.stringify(encontrado)

    );



    return {


        sucesso:true,


        usuario:
        encontrado


    };


}



/* =====================================================
   USUÁRIO ATUAL
===================================================== */


function usuarioAtual(){


    const usuario =

    localStorage.getItem(

        "usuario_logado"

    );



    return usuario ?

    JSON.parse(usuario)

    :

    null;


}



/* =====================================================
   LOGOUT
===================================================== */


function logout(){


    localStorage.removeItem(

        "usuario_logado"

    );


}



/* =====================================================
   PERMISSÕES
===================================================== */


function verificarPermissao(permissao){


    const usuario =
    usuarioAtual();



    if(!usuario){


        return false;


    }



    if(usuario.perfil==="ADMIN"){


        return true;


    }



    const permissoes = {


        PRODUCAO:[

            "PRODUCAO",

            "ETIQUETA"

        ],


        OPERADOR:[

            "VENDA",

            "ESTOQUE"

        ]


    };



    return (

        permissoes[usuario.perfil]

        ||

        []

    )

    .includes(permissao);



}



/* =====================================================
   REGISTRAR AÇÃO DO USUÁRIO
===================================================== */


function registrarAcaoUsuario(
acao,
dados={}
){


    const usuario =
    usuarioAtual();



    registrarHistorico(

        acao,

        {


            usuario:

            usuario ?

            usuario.nome

            :

            "Sistema",


            dados: dados


        }

    );


}



/* =====================================================
   ALTERAR SENHA
===================================================== */


function alterarSenha(
id,
novaSenha
){


    const usuarios =
    listarUsuarios();



    const usuario =
    usuarios.find(

        item=>

        item.id==id

    );



    if(!usuario){


        return false;


    }



    usuario.senha =
    novaSenha;



    salvarDados(

        DB.usuarios,

        usuarios

    );



    return true;


}



/* =====================================================
   FIM STORAGE.JS PARTE 10
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 11

   Matéria-prima e insumos
===================================================== */


/* =====================================================
   LISTAR MATÉRIAS-PRIMAS
===================================================== */


function listarMateriasPrimas(){


    return lerDados(DB.materias);


}



/* =====================================================
   SALVAR MATÉRIAS-PRIMAS
===================================================== */


function salvarMateriasPrimas(lista){


    salvarDados(

        DB.materias,

        lista

    );


}



/* =====================================================
   CRIAR MATÉRIA-PRIMA
===================================================== */


/*

Exemplo:

{
nome:"Chocolate",

unidade:"KG",

custo:35,

estoque:10

}

*/


function criarMateriaPrima(dados){


    const lista =
    listarMateriasPrimas();



    const existente =
    lista.find(

        item =>

        item.nome.toLowerCase()

        ==

        dados.nome.toLowerCase()

    );



    if(existente){


        return {


            sucesso:false,


            mensagem:
            "Matéria-prima já cadastrada"


        };


    }



    const nova = {


        id:

        gerarID(lista),


        nome:

        dados.nome,


        categoria:

        dados.categoria || "Ingrediente",


        unidade:

        dados.unidade || "KG",


        fornecedor:

        dados.fornecedor || "",


        custo:

        Number(dados.custo)||0,


        estoque:

        Number(dados.estoque)||0,


        estoqueMinimo:

        Number(dados.estoqueMinimo)||0,


        ativo:true,


        criado:

        new Date().toISOString()


    };



    lista.push(nova);



    salvarMateriasPrimas(lista);



    registrarHistorico(

        "Matéria-prima criada",

        nova

    );



    return {


        sucesso:true,


        materia:nova


    };


}



/* =====================================================
   EDITAR MATÉRIA-PRIMA
===================================================== */


function editarMateriaPrima(id,dados){


    const lista =
    listarMateriasPrimas();



    const index =
    lista.findIndex(

        item =>

        item.id==id

    );



    if(index<0){


        return false;


    }



    lista[index] = {


        ...lista[index],


        ...dados,


        atualizado:

        new Date().toISOString()


    };



    salvarMateriasPrimas(lista);



    return true;


}



/* =====================================================
   BUSCAR MATÉRIA-PRIMA
===================================================== */


function buscarMateriaPrima(id){


    return listarMateriasPrimas()

    .find(

        item =>

        item.id==id

    );


}



/* =====================================================
   ENTRADA DE COMPRA
===================================================== */


function entradaMateriaPrima(
id,
quantidade,
valorCompra
){


    const lista =
    listarMateriasPrimas();



    const item =
    lista.find(

        materia =>

        materia.id==id

    );



    if(!item){


        return false;


    }



    /*
      Atualiza custo médio
    */


    if(valorCompra){


        item.custo =

        (

            (

            item.custo *

            item.estoque

            )

            +

            (

            valorCompra *

            quantidade

            )

        )

        /

        (

            item.estoque

            +

            quantidade

        );


    }



    item.estoque +=

    Number(quantidade);



    salvarMateriasPrimas(lista);



    registrarHistorico(

        "Entrada matéria-prima",

        {

            produto:item.nome,

            quantidade:quantidade

        }

    );



    return true;


}



/* =====================================================
   SAÍDA PARA PRODUÇÃO
===================================================== */


function consumirMateriaPrima(
id,
quantidade
){


    const lista =
    listarMateriasPrimas();



    const item =
    lista.find(

        materia =>

        materia.id==id

    );



    if(!item){


        return {


            sucesso:false,


            mensagem:
            "Ingrediente não encontrado"


        };


    }



    if(item.estoque < quantidade){


        return {


            sucesso:false,


            mensagem:
            "Estoque insuficiente"


        };


    }



    item.estoque -=

    Number(quantidade);



    salvarMateriasPrimas(lista);



    registrarHistorico(

        "Consumo produção",

        {

            materia:item.nome,

            quantidade:quantidade

        }

    );



    return {


        sucesso:true


    };


}



/* =====================================================
   ALERTA DE INSUMOS
===================================================== */


function materiasEstoqueBaixo(){


    return listarMateriasPrimas()

    .filter(

        item =>

        item.estoque <=

        item.estoqueMinimo

    );


}



/* =====================================================
   VALOR DO ESTOQUE DE INSUMOS
===================================================== */


function valorEstoqueMaterias(){


    return listarMateriasPrimas()

    .reduce(

        (total,item)=>


        total +

        (

        item.estoque *

        item.custo

        ),


        0

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 11
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 12

   Produção integrada com matéria-prima
===================================================== */


/* =====================================================
   LISTAR RECEITAS
===================================================== */


function listarReceitas(){


    const producoes =
    listarProducoes();



    return producoes.filter(

        item =>

        item.tipo === "RECEITA"

    );


}



/* =====================================================
   SALVAR RECEITAS
===================================================== */


function salvarReceitas(lista){


    const producoes =
    listarProducoes();



    const outras =

    producoes.filter(

        item =>

        item.tipo !== "RECEITA"

    );



    salvarProducoes(

        [

            ...outras,

            ...lista

        ]

    );


}



/* =====================================================
   CRIAR RECEITA PROFISSIONAL
===================================================== */


/*

Exemplo:

Produto:
Bolo Chocolate

Ingredientes:

[
 {
  materiaPrima:1,
  quantidade:2
 },

 {
  materiaPrima:2,
  quantidade:1
 }
]

*/


function criarReceita(dados){


    const receitas =
    listarReceitas();



    const nova = {


        id:

        gerarID(receitas),


        tipo:

        "RECEITA",


        produtoFinal:

        dados.produtoFinal,


        nome:

        dados.nome || "",


        rendimento:

        Number(dados.rendimento || 1),


        ingredientes:

        dados.ingredientes || [],


        criado:

        new Date().toISOString()


    };



    receitas.push(nova);



    salvarReceitas(receitas);



    registrarHistorico(

        "Receita criada",

        nova

    );



    return nova;


}



/* =====================================================
   BUSCAR RECEITA DO PRODUTO
===================================================== */


function buscarReceitaProduto(idProduto){


    return listarReceitas()

    .find(

        receita =>

        receita.produtoFinal == idProduto

    );


}



/* =====================================================
   VERIFICAR INGREDIENTES
===================================================== */


function verificarIngredientesProducao(
idProduto,
quantidade
){


    const receita =

    buscarReceitaProduto(idProduto);



    if(!receita){


        return {


            sucesso:false,


            mensagem:
            "Receita não cadastrada"


        };


    }



    const faltando=[];



    receita.ingredientes.forEach(

        item=>{


            const materia =

            buscarMateriaPrima(

                item.materiaPrima

            );



            const necessario =

            item.quantidade *

            quantidade;



            if(

            !materia ||

            materia.estoque < necessario

            ){


                faltando.push({

                    ingrediente:

                    materia ?

                    materia.nome

                    :

                    "Desconhecido",


                    necessario:

                    necessario,


                    disponivel:

                    materia ?

                    materia.estoque

                    :

                    0

                });


            }


        }

    );



    if(faltando.length){


        return {


            sucesso:false,


            faltando:faltando


        };


    }



    return {


        sucesso:true


    };


}



/* =====================================================
   CALCULAR CUSTO DA PRODUÇÃO
===================================================== */


function calcularCustoProducao(
idProduto,
quantidade
){


    const receita =

    buscarReceitaProduto(idProduto);



    if(!receita){

        return 0;

    }



    let custo=0;



    receita.ingredientes.forEach(

        item=>{


            const materia =

            buscarMateriaPrima(

                item.materiaPrima

            );



            if(materia){


                custo +=

                (

                materia.custo *

                item.quantidade *

                quantidade

                );


            }


        }

    );



    return custo;


}



/* =====================================================
   PRODUZIR PRODUTO
===================================================== */


/*

Processo completo:

1 verifica ingredientes

2 baixa matéria-prima

3 adiciona produto final

4 registra produção

*/


function produzirProduto(
idProduto,
quantidade
){


    const verifica =

    verificarIngredientesProducao(

        idProduto,

        quantidade

    );



    if(!verifica.sucesso){


        return verifica;


    }



    const receita =

    buscarReceitaProduto(idProduto);



    receita.ingredientes.forEach(

        item=>{


            consumirMateriaPrima(

                item.materiaPrima,

                item.quantidade *

                quantidade

            );


        }

    );



    entradaEstoque(

        idProduto,

        quantidade,

        "Produção"

    );



    const producao = {


        id:

        Date.now(),


        tipo:

        "PRODUCAO_REALIZADA",


        produto:

        idProduto,


        quantidade:

        quantidade,


        custo:

        calcularCustoProducao(

            idProduto,

            quantidade

        ),


        data:

        new Date().toISOString()


    };



    const lista =
    listarProducoes();



    lista.push(producao);



    salvarProducoes(lista);



    registrarHistorico(

        "Produção realizada",

        producao

    );



    return {


        sucesso:true,


        producao:producao


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 12
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 13

   Lotes, validade e rastreabilidade
===================================================== */


/* =====================================================
   INICIALIZAR LOTES
===================================================== */


function iniciarLotes(){


    if(!localStorage.getItem(DB.lotes)){


        salvarDados(

            DB.lotes,

            []

        );


    }


}


iniciarLotes();



/* =====================================================
   LISTAR LOTES
===================================================== */


function listarLotes(){


    return lerDados(DB.lotes);


}



/* =====================================================
   SALVAR LOTES
===================================================== */


function salvarLotes(lista){


    salvarDados(

        DB.lotes,

        lista

    );


}



/* =====================================================
   GERAR NÚMERO DO LOTE
===================================================== */


function gerarNumeroLote(){


    const data =

    new Date();



    return (

        "CG"

        +

        data.getFullYear()

        +

        String(

            data.getMonth()+1

        )

        .padStart(2,"0")

        +

        String(

            data.getDate()

        )

        .padStart(2,"0")

        +

        Math.floor(

            Math.random()*999

        )

    );


}



/* =====================================================
   CALCULAR VALIDADE
===================================================== */


function calcularValidade(dias){


    const data =

    new Date();



    data.setDate(

        data.getDate()

        +

        Number(dias)

    );



    return data

    .toISOString()

    .substring(0,10);


}



/* =====================================================
   CRIAR LOTE
===================================================== */


function criarLote(dados){


    const lotes =
    listarLotes();



    const lote = {


        id:

        gerarID(lotes),


        numero:

        dados.numero

        ||

        gerarNumeroLote(),


        produto:

        dados.produto,


        quantidade:

        dados.quantidade,


        fabricacao:

        new Date()

        .toISOString()

        .substring(0,10),


        validade:

        dados.validade,


        custo:

        dados.custo || 0,


        status:

        "ATIVO"


    };



    lotes.push(lote);



    salvarLotes(lotes);



    registrarHistorico(

        "Lote criado",

        lote

    );



    return lote;


}



/* =====================================================
   BUSCAR LOTES DO PRODUTO
===================================================== */


function buscarLotesProduto(idProduto){


    return listarLotes()

    .filter(

        lote =>

        lote.produto == idProduto

    );


}



/* =====================================================
   BUSCAR PELO NÚMERO DO LOTE
===================================================== */


function buscarLote(numero){


    return listarLotes()

    .find(

        lote =>

        lote.numero == numero

    );


}



/* =====================================================
   PRODUÇÃO GERANDO LOTE
===================================================== */


function finalizarProducaoComLote(
idProduto,
quantidade,
diasValidade=30
){


    const resultado =

    produzirProduto(

        idProduto,

        quantidade

    );



    if(!resultado.sucesso){


        return resultado;


    }



    const lote =

    criarLote({


        produto:

        idProduto,


        quantidade:

        quantidade,


        validade:

        calcularValidade(

            diasValidade

        ),


        custo:

        resultado.producao.custo


    });



    const etiqueta =

    gerarEtiquetaProducao(

        idProduto,

        quantidade,

        lote.validade

    );



    return {


        sucesso:true,


        producao:

        resultado.producao,


        lote:

        lote,


        etiqueta:

        etiqueta


    };


}



/* =====================================================
   PRODUTOS PRÓXIMOS DO VENCIMENTO
===================================================== */


function produtosVencendo(dias=7){


    const hoje =

    new Date();



    const limite =

    new Date();



    limite.setDate(

        hoje.getDate()

        +

        dias

    );



    return listarLotes()

    .filter(

        lote => {


            const validade =

            new Date(

                lote.validade

            );



            return validade <= limite;


        }

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 13
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 14

   Relatórios gerenciais
===================================================== */


/* =====================================================
   RELATÓRIO DE PRODUTOS
===================================================== */


function relatorioProdutos(){


    const produtos =
    listarProdutos();



    return {


        total:

        produtos.length,


        ativos:

        produtos.filter(

            item => item.ativo

        ).length,


        produtos:

        produtos.map(

            item => ({


                nome:

                item.nome,


                codigo:

                item.codigoBarras,


                estoque:

                item.estoque,


                custo:

                item.custo,


                venda:

                item.venda


            })

        )


    };


}



/* =====================================================
   RELATÓRIO DE ESTOQUE
===================================================== */


function relatorioEstoque(){


    return {


        quantidadeTotal:

        quantidadeTotalEstoque(),


        valorCusto:

        valorCustoEstoque(),


        valorVenda:

        valorVendaEstoque(),


        lucro:

        lucroEstimadoEstoque(),


        estoqueBaixo:

        produtosEstoqueBaixo()


    };


}



/* =====================================================
   RELATÓRIO DE PRODUÇÃO
===================================================== */


function relatorioProducao(){


    const lista =

    listarProducoes();



    const producoes =

    lista.filter(

        item =>

        item.tipo ===

        "PRODUCAO_REALIZADA"

    );



    return {


        total:

        producoes.length,


        quantidadeProduzida:

        producoes.reduce(

            (total,item)=>

            total +

            Number(item.quantidade),


            0

        ),


        custoProducao:

        producoes.reduce(

            (total,item)=>

            total +

            Number(item.custo),


            0

        ),


        registros:

        producoes


    };


}



/* =====================================================
   RELATÓRIO DE VENDAS
===================================================== */


function relatorioVendas(){


    const vendas =

    listarVendas();



    return {


        totalVendas:

        vendas.length,


        quantidadeVendida:

        vendas.reduce(

            (total,item)=>

            total +

            item.quantidade,


            0

        ),


        faturamento:

        faturamentoTotal(),


        produtos:

        produtosMaisVendidos(),


        registros:

        vendas


    };


}



/* =====================================================
   RELATÓRIO FINANCEIRO
===================================================== */


function relatorioFinanceiro(){


    const vendas =

    faturamentoTotal();



    const custoEstoque =

    valorCustoEstoque();



    return {


        faturamento:

        vendas,


        estoque:

        custoEstoque,


        lucroEstimado:

        vendas -

        custoEstoque


    };


}



/* =====================================================
   RELATÓRIO DE VALIDADE
===================================================== */


function relatorioValidade(){


    const lotes =

    listarLotes();



    return {


        vencendo:

        produtosVencendo(7),


        todos:

        lotes


    };


}



/* =====================================================
   RELATÓRIO COMPLETO
===================================================== */


function gerarRelatorioGeral(){


    return {


        empresa:

        buscarEmpresa(),



        produtos:

        relatorioProdutos(),



        estoque:

        relatorioEstoque(),



        producao:

        relatorioProducao(),



        vendas:

        relatorioVendas(),



        financeiro:

        relatorioFinanceiro(),



        validade:

        relatorioValidade(),



        gerado:

        new Date()

        .toISOString()


    };


}



/* =====================================================
   FILTRO POR PERÍODO
===================================================== */


function filtrarPorPeriodo(
lista,
inicio,
fim
){


    return lista.filter(

        item => {


            const data =

            new Date(item.data);



            return (

                data >=

                new Date(inicio)

            )

            &&

            (

                data <=

                new Date(fim)

            );


        }

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 14
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 15

   Inventário e conferência
===================================================== */


/* =====================================================
   INICIALIZAR INVENTÁRIOS
===================================================== */


function iniciarInventarios(){


    if(!localStorage.getItem(DB.inventarios)){


        salvarDados(

            DB.inventarios,

            []

        );


    }


}


iniciarInventarios();



/* =====================================================
   LISTAR INVENTÁRIOS
===================================================== */


function listarInventarios(){


    return lerDados(DB.inventarios);


}



/* =====================================================
   SALVAR INVENTÁRIOS
===================================================== */


function salvarInventarios(lista){


    salvarDados(

        DB.inventarios,

        lista

    );


}



/* =====================================================
   ABRIR INVENTÁRIO
===================================================== */


function criarInventario(){


    const inventarios =

    listarInventarios();



    const inventario = {


        id:

        gerarID(inventarios),


        status:

        "ABERTO",


        data:

        new Date().toISOString(),


        itens:[]


    };



    inventarios.push(inventario);



    salvarInventarios(inventarios);



    return inventario;


}



/* =====================================================
   BUSCAR INVENTÁRIO ABERTO
===================================================== */


function inventarioAberto(){


    return listarInventarios()

    .find(

        item =>

        item.status==="ABERTO"

    );


}



/* =====================================================
   ADICIONAR PRODUTO PELO CÓDIGO
===================================================== */


/*

Usado pelo scanner:

Leitor USB
Webcam
Celular

*/


function adicionarInventarioCodigo(
codigo,
quantidade=1
){


    const inventario =

    inventarioAberto();



    if(!inventario){


        return {


            sucesso:false,


            mensagem:
            "Nenhum inventário aberto"


        };


    }



    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    let item =

    inventario.itens.find(

        item =>

        item.produtoId == produto.id

    );



    if(item){


        item.contado +=

        Number(quantidade);


    }

    else{


        inventario.itens.push({


            produtoId:

            produto.id,


            codigo:

            produto.codigoBarras,


            nome:

            produto.nome,


            sistema:

            produto.estoque,


            contado:

            Number(quantidade)


        });


    }



    salvarInventarios(

        listarInventarios()

    );



    return {


        sucesso:true,


        produto:produto


    };


}



/* =====================================================
   FINALIZAR INVENTÁRIO
===================================================== */


function finalizarInventario(id){


    const inventarios =

    listarInventarios();



    const inventario =

    inventarios.find(

        item =>

        item.id==id

    );



    if(!inventario){


        return false;


    }



    inventario.itens =

    inventario.itens.map(

        item=>({


            ...item,


            diferenca:

            item.contado -

            item.sistema


        })

    );



    inventario.status=

    "FINALIZADO";



    salvarInventarios(

        inventarios

    );



    registrarHistorico(

        "Inventário finalizado",

        inventario

    );



    return inventario;


}



/* =====================================================
   AJUSTAR ESTOQUE PELO INVENTÁRIO
===================================================== */


function aplicarAjusteInventario(id){


    const inventarios =

    listarInventarios();



    const inventario =

    inventarios.find(

        item =>

        item.id==id

    );



    if(!inventario){


        return false;


    }



    inventario.itens.forEach(

        item=>{


            ajustarEstoque(

                item.produtoId,

                item.contado

            );


        }

    );



    inventario.status=

    "APLICADO";



    salvarInventarios(

        inventarios

    );



    registrarHistorico(

        "Ajuste inventário aplicado",

        inventario

    );



    return true;


}



/* =====================================================
   DIFERENÇAS DE INVENTÁRIO
===================================================== */


function diferencasInventario(id){


    const inventario =

    listarInventarios()

    .find(

        item =>

        item.id==id

    );



    if(!inventario){

        return [];

    }



    return inventario.itens.filter(

        item =>

        item.diferenca !==0

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 15
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 16

   Preparação para sincronização
===================================================== */


/* =====================================================
   INICIAR SINCRONIZAÇÃO
===================================================== */


function iniciarSincronizacao(){


    if(!localStorage.getItem(DB.sincronizacao)){


        salvarDados(

            DB.sincronizacao,

            {

                dispositivo:

                gerarIdentificacaoDispositivo(),


                ultimaSincronizacao:

                null,


                pendentes:

                []

            }

        );


    }


}


iniciarSincronizacao();



/* =====================================================
   IDENTIFICAR DISPOSITIVO
===================================================== */


function gerarIdentificacaoDispositivo(){


    let id =

    localStorage.getItem(

        "carols_device_id"

    );



    if(!id){


        id =

        "CG-"

        +

        Date.now();



        localStorage.setItem(

            "carols_device_id",

            id

        );


    }



    return id;


}



/* =====================================================
   DADOS DE SINCRONIZAÇÃO
===================================================== */


function dadosSincronizacao(){


    return lerDados(

        DB.sincronizacao

    );


}



/* =====================================================
   REGISTRAR ALTERAÇÃO PENDENTE
===================================================== */


function adicionarPendencia(
modulo,
acao,
dados
){


    const sync =

    dadosSincronizacao();



    sync.pendentes.push({


        id:

        Date.now(),


        modulo:

        modulo,


        acao:

        acao,


        dados:

        dados,


        data:

        new Date()

        .toISOString()


    });



    salvarDados(

        DB.sincronizacao,

        sync

    );


}



/* =====================================================
   LISTAR PENDÊNCIAS
===================================================== */


function listarPendencias(){


    const sync =

    dadosSincronizacao();



    return sync.pendentes || [];


}



/* =====================================================
   LIMPAR SINCRONIZAÇÃO
===================================================== */


function limparPendencias(){


    const sync =

    dadosSincronizacao();



    sync.pendentes=[];



    sync.ultimaSincronizacao=

    new Date()

    .toISOString();



    salvarDados(

        DB.sincronizacao,

        sync

    );


}



/* =====================================================
   STATUS DO SISTEMA
===================================================== */


function statusSincronizacao(){


    const sync =

    dadosSincronizacao();



    return {


        dispositivo:

        sync.dispositivo,


        pendentes:

        sync.pendentes.length,


        ultima:

        sync.ultimaSincronizacao


    };


}



/* =====================================================
   PREPARAR EXPORTAÇÃO COMPLETA
===================================================== */


function pacoteSincronizacao(){


    return {


        dispositivo:

        gerarIdentificacaoDispositivo(),



        empresa:

        buscarEmpresa(),



        produtos:

        listarProdutos(),



        materias:

        listarMateriasPrimas(),



        estoque:

        listarEstoque(),



        producao:

        listarProducoes(),



        vendas:

        listarVendas(),



        etiquetas:

        listarEtiquetas(),



        lotes:

        listarLotes(),



        data:

        new Date()

        .toISOString()


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 16
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 17

   Alertas inteligentes
===================================================== */


/* =====================================================
   CRIAR ALERTA
===================================================== */


function criarAlerta(
tipo,
titulo,
mensagem,
prioridade="MEDIA",
dados={}
){


    return {


        id:

        Date.now(),


        tipo:

        tipo,


        titulo:

        titulo,


        mensagem:

        mensagem,


        prioridade:

        prioridade,


        dados:

        dados,


        data:

        new Date()

        .toISOString(),


        lido:false


    };


}



/* =====================================================
   GERAR ALERTAS DE ESTOQUE
===================================================== */


function alertasEstoqueProdutos(){


    const alertas=[];



    produtosEstoqueBaixo()

    .forEach(

        produto=>{


            alertas.push(

                criarAlerta(

                    "ESTOQUE",

                    "Estoque baixo",

                    produto.nome +

                    " está com estoque baixo",

                    "ALTA",

                    produto

                )

            );


        }

    );



    return alertas;


}



/* =====================================================
   ALERTAS DE MATÉRIA-PRIMA
===================================================== */


function alertasMateriaPrima(){


    const alertas=[];



    materiasEstoqueBaixo()

    .forEach(

        item=>{


            alertas.push(

                criarAlerta(

                    "INSUMO",

                    "Matéria-prima baixa",

                    item.nome +

                    " precisa de reposição",

                    "ALTA",

                    item

                )

            );


        }

    );



    return alertas;


}



/* =====================================================
   ALERTAS DE VALIDADE
===================================================== */


function alertasValidade(){


    const alertas=[];



    produtosVencendo(7)

    .forEach(

        lote=>{


            alertas.push(

                criarAlerta(

                    "VALIDADE",

                    "Produto próximo do vencimento",

                    "Lote " +

                    lote.numero +

                    " vence em breve",

                    "MEDIA",

                    lote

                )

            );


        }

    );



    return alertas;


}



/* =====================================================
   PRODUTOS PARADOS
===================================================== */


/*

Produto sem venda por período

*/

function produtosSemMovimento(
dias=30
){


    const vendas =

    listarVendas();



    const limite =

    new Date();



    limite.setDate(

        limite.getDate()

        -

        dias

    );



    const vendidos =

    vendas

    .filter(

        venda =>

        new Date(venda.data)

        >=

        limite

    )

    .map(

        venda=>

        venda.produtoId

    );



    return listarProdutos()

    .filter(

        produto =>


        !vendidos.includes(

            produto.id

        )

    );


}



/* =====================================================
   ALERTA DE PRODUTO PARADO
===================================================== */


function alertasProdutosParados(){


    return produtosSemMovimento()

    .map(

        produto=>


        criarAlerta(

            "VENDA",

            "Produto sem movimentação",

            produto.nome +

            " não teve vendas recentes",

            "BAIXA",

            produto

        )


    );


}



/* =====================================================
   CENTRAL DE ALERTAS
===================================================== */


function gerarAlertasSistema(){


    return [

        ...alertasEstoqueProdutos(),


        ...alertasMateriaPrima(),


        ...alertasValidade(),


        ...alertasProdutosParados()

    ];



}



/* =====================================================
   CONTADOR DE ALERTAS
===================================================== */


function resumoAlertas(){


    const alertas =

    gerarAlertasSistema();



    return {


        total:

        alertas.length,


        alta:

        alertas.filter(

            item=>

            item.prioridade==="ALTA"

        ).length,


        media:

        alertas.filter(

            item=>

            item.prioridade==="MEDIA"

        ).length,


        baixa:

        alertas.filter(

            item=>

            item.prioridade==="BAIXA"

        ).length,


        lista:

        alertas


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 17
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 18

   Controle de scanner
===================================================== */


/* =====================================================
   CONFIGURAÇÃO DO SCANNER
===================================================== */


function iniciarScanner(){


    if(!localStorage.getItem(DB.scanner)){


        salvarDados(

            DB.scanner,

            {


                ativo:true,


                modo:
                "CAMERA",


                ultimoCodigo:null,


                data:null


            }


        );


    }


}


iniciarScanner();



/* =====================================================
   CONFIGURAÇÃO ATUAL
===================================================== */


function configuracaoScanner(){


    return lerDados(

        DB.scanner

    );


}



/* =====================================================
   ALTERAR MODO SCANNER
===================================================== */


/*

Tipos:

CAMERA

USB

BLUETOOTH

*/


function alterarModoScanner(modo){


    const scanner =

    configuracaoScanner();



    scanner.modo = modo;



    salvarDados(

        DB.scanner,

        scanner

    );


}



/* =====================================================
   RECEBER CÓDIGO DO LEITOR
===================================================== */


/*

Essa função recebe:

- leitor USB
- bluetooth
- câmera

*/


function receberCodigoScanner(codigo){


    const scanner =

    configuracaoScanner();



    scanner.ultimoCodigo = codigo;



    scanner.data =

    new Date()

    .toISOString();



    salvarDados(

        DB.scanner,

        scanner

    );



    return buscarProdutoPorCodigo(

        codigo

    );


}



/* =====================================================
   CONSULTAR PRODUTO PELO SCANNER
===================================================== */


function consultarScanner(codigo){


    const produto =

    receberCodigoScanner(

        codigo

    );



    if(!produto){


        return {


            encontrado:false,


            mensagem:
            "Produto não cadastrado"


        };


    }



    return {


        encontrado:true,


        produto:produto,


        estoque:

        produto.estoque,


        preco:

        produto.venda


    };


}



/* =====================================================
   SCANNER PARA VENDA
===================================================== */


function scannerVenda(codigo,quantidade=1){


    return venderPorCodigo(

        codigo,

        quantidade

    );


}



/* =====================================================
   SCANNER PARA INVENTÁRIO
===================================================== */


function scannerInventario(
codigo,
quantidade=1
){


    return adicionarInventarioCodigo(

        codigo,

        quantidade

    );


}



/* =====================================================
   SCANNER PARA PRODUÇÃO
===================================================== */


function scannerProducao(codigo){


    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:
            "Produto não encontrado"


        };


    }



    return {


        sucesso:true,


        produto:produto


    };


}



/* =====================================================
   HISTÓRICO DE LEITURAS
===================================================== */


function historicoScanner(){


    const scanner =

    configuracaoScanner();



    return {


        ultimoCodigo:

        scanner.ultimoCodigo,


        ultimaLeitura:

        scanner.data,


        modo:

        scanner.modo


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 18
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 19

   Backup e restauração
===================================================== */


/* =====================================================
   INICIALIZAR BACKUPS
===================================================== */


function iniciarBackups(){


    if(!localStorage.getItem(DB.backups)){


        salvarDados(

            DB.backups,

            []

        );


    }


}


iniciarBackups();



/* =====================================================
   LISTAR BACKUPS
===================================================== */


function listarBackups(){


    return lerDados(

        DB.backups

    );


}



/* =====================================================
   CRIAR BACKUP COMPLETO
===================================================== */


function criarBackup(){


    const backup = {


        id:

        Date.now(),


        versao:

        "ERP 4.0",


        data:

        new Date()

        .toISOString(),



        dados:

        {


            empresa:

            lerDados(

                DB.empresa

            ),


            produtos:

            listarProdutos(),


            materias:

            listarMateriasPrimas(),


            estoque:

            listarEstoque(),


            producao:

            listarProducoes(),


            vendas:

            listarVendas(),


            etiquetas:

            listarEtiquetas(),


            lotes:

            listarLotes(),


            usuarios:

            listarUsuarios(),


            inventarios:

            listarInventarios()


        }


    };



    const backups =

    listarBackups();



    backups.push(

        backup

    );



    salvarDados(

        DB.backups,

        backups

    );



    registrarHistorico(

        "Backup criado",

        {

            id:

            backup.id

        }

    );



    return backup;


}



/* =====================================================
   EXPORTAR BACKUP
===================================================== */


/*

Prepara os dados

para baixar em arquivo JSON

*/


function exportarBackup(){


    const backup =

    criarBackup();



    return JSON.stringify(

        backup,

        null,

        2

    );


}



/* =====================================================
   RESTAURAR BACKUP
===================================================== */


function restaurarBackup(backup){


    if(!backup || !backup.dados){


        return {


            sucesso:false,


            mensagem:
            "Backup inválido"


        };


    }



    salvarDados(

        DB.empresa,

        backup.dados.empresa

    );



    salvarDados(

        DB.produtos,

        backup.dados.produtos

    );



    salvarDados(

        DB.materias,

        backup.dados.materias

    );



    salvarDados(

        DB.estoque,

        backup.dados.estoque

    );



    salvarDados(

        DB.producao,

        backup.dados.producao

    );



    salvarDados(

        DB.vendas,

        backup.dados.vendas

    );



    salvarDados(

        DB.etiquetas,

        backup.dados.etiquetas

    );



    salvarDados(

        DB.lotes,

        backup.dados.lotes

    );



    salvarDados(

        DB.usuarios,

        backup.dados.usuarios

    );



    salvarDados(

        DB.inventarios,

        backup.dados.inventarios

    );



    registrarHistorico(

        "Sistema restaurado",

        {

            backup:

            backup.id

        }

    );



    return {


        sucesso:true


    };


}



/* =====================================================
   BACKUP AUTOMÁTICO
===================================================== */


function backupAutomatico(){


    const ultimo =

    listarBackups()

    .slice(-1)[0];



    if(!ultimo){


        criarBackup();


        return;


    }



    const ultimaData =

    new Date(

        ultimo.data

    );



    const hoje =

    new Date();



    const diferenca =

    hoje -

    ultimaData;



    const dias =

    diferenca /

    (

        1000 *

        60 *

        60 *

        24

    );



    if(dias >= 1){


        criarBackup();


    }


}



/* =====================================================
   TAMANHO DO BANCO
===================================================== */


function tamanhoBanco(){


    let total=0;



    Object.values(DB)

    .forEach(

        chave=>{


            const dado =

            localStorage.getItem(

                chave

            );



            if(dado){


                total +=

                dado.length;


            }


        }

    );



    return {


        bytes:

        total,


        kb:

        (

            total /

            1024

        )

        .toFixed(2)


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 19
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 20

   Configurações do sistema
===================================================== */


/* =====================================================
   INICIALIZAR CONFIGURAÇÕES
===================================================== */


function iniciarConfiguracoes(){


    if(!localStorage.getItem(DB.configuracoes)){


        const configuracaoInicial = {


            empresa:


            {


                nome:

                "Carol's Gourmet",


                cnpj:

                "",


                telefone:

                "",


                endereco:

                "",


                logo:

                ""


            },



            etiqueta:


            {


                mostrarLogo:

                true,


                mostrarCodigo:

                true,


                mostrarValidade:

                true,


                mostrarLote:

                true


            },



            producao:


            {


                validadePadrao:

                30,


                unidadePadrao:

                "UN"


            },



            financeiro:


            {


                margemLucro:

                50,


                taxaIFood:

                25


            },



            sistema:


            {


                tema:

                "claro",


                moeda:

                "BRL",


                versao:

                "ERP 4.0"


            }



        };



        salvarDados(

            DB.configuracoes,

            configuracaoInicial

        );


    }


}


iniciarConfiguracoes();



/* =====================================================
   BUSCAR CONFIGURAÇÕES
===================================================== */


function buscarConfiguracoes(){


    return lerDados(

        DB.configuracoes

    );


}



/* =====================================================
   ALTERAR CONFIGURAÇÃO
===================================================== */


function alterarConfiguracao(
grupo,
campo,
valor
){


    const config =

    buscarConfiguracoes();



    if(!config[grupo]){


        return false;


    }



    config[grupo][campo]=valor;



    salvarDados(

        DB.configuracoes,

        config

    );



    registrarHistorico(

        "Configuração alterada",

        {

            grupo:

            grupo,


            campo:

            campo

        }

    );



    return true;


}



/* =====================================================
   DADOS DA EMPRESA
===================================================== */


function buscarEmpresa(){


    const config =

    buscarConfiguracoes();



    return config.empresa;


}



/* =====================================================
   ALTERAR DADOS EMPRESA
===================================================== */


function atualizarEmpresa(dados){


    const config =

    buscarConfiguracoes();



    config.empresa = {


        ...config.empresa,


        ...dados


    };



    salvarDados(

        DB.configuracoes,

        config

    );



    return true;


}



/* =====================================================
   CONFIGURAÇÃO DE ETIQUETA
===================================================== */


function configuracaoEtiqueta(){


    const config =

    buscarConfiguracoes();



    return config.etiqueta;


}



/* =====================================================
   VALIDADE PADRÃO
===================================================== */


function validadePadrao(){


    const config =

    buscarConfiguracoes();



    return config.producao

    .validadePadrao;


}



/* =====================================================
   MARGEM PADRÃO
===================================================== */


function margemPadrao(){


    const config =

    buscarConfiguracoes();



    return config.financeiro

    .margemLucro;


}



/* =====================================================
   TAXA IFOOD
===================================================== */


function taxaIFood(){


    const config =

    buscarConfiguracoes();



    return config.financeiro

    .taxaIFood;


}



/* =====================================================
   EXPORTAR CONFIGURAÇÃO
===================================================== */


function exportarConfiguracao(){


    return JSON.stringify(

        buscarConfiguracoes(),

        null,

        2

    );


}



/* =====================================================
   RESTAURAR CONFIGURAÇÃO
===================================================== */


function restaurarConfiguracao(dados){


    if(!dados){


        return false;


    }



    salvarDados(

        DB.configuracoes,

        dados

    );



    return true;


}



/* =====================================================
   FIM STORAGE.JS PARTE 20
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 21

   Gerador de etiquetas
===================================================== */


/* =====================================================
   LISTAR ETIQUETAS
===================================================== */


function listarEtiquetas(){


    return lerDados(

        DB.etiquetas

    );


}



/* =====================================================
   SALVAR ETIQUETAS
===================================================== */


function salvarEtiquetas(lista){


    salvarDados(

        DB.etiquetas,

        lista

    );


}



/* =====================================================
   GERAR CÓDIGO INTERNO DA ETIQUETA
===================================================== */


function gerarCodigoEtiqueta(){


    return (

        "789"

        +

        Date.now()

        .toString()

        .slice(-10)

    );


}



/* =====================================================
   CRIAR ETIQUETA
===================================================== */


function criarEtiqueta(dados){


    const etiquetas =

    listarEtiquetas();



    const empresa =

    buscarEmpresa();



    const etiqueta = {


        id:

        gerarID(etiquetas),



        produto:

        dados.produto,



        codigoBarras:

        dados.codigoBarras

        ||

        gerarCodigoEtiqueta(),



        lote:

        dados.lote || "",



        fabricacao:

        dados.fabricacao

        ||

        new Date()

        .toISOString()

        .substring(0,10),



        validade:

        dados.validade || "",



        quantidade:

        dados.quantidade || 1,



        empresa:

        empresa.nome,



        status:

        "GERADA",



        criado:

        new Date()

        .toISOString()


    };



    etiquetas.push(etiqueta);



    salvarEtiquetas(

        etiquetas

    );



    registrarHistorico(

        "Etiqueta criada",

        etiqueta

    );



    return etiqueta;


}



/* =====================================================
   GERAR ETIQUETA DA PRODUÇÃO
===================================================== */


function gerarEtiquetaProducao(
idProduto,
quantidade,
validade
){


    const produto =

    listarProdutos()

    .find(

        item =>

        item.id==idProduto

    );



    if(!produto){


        return null;


    }



    const etiqueta =

    criarEtiqueta({


        produto:

        produto.nome,



        codigoBarras:

        produto.codigoBarras,



        quantidade:

        quantidade,



        validade:

        validade


    });



    return etiqueta;


}



/* =====================================================
   BUSCAR ETIQUETA PELO CÓDIGO
===================================================== */


function buscarEtiquetaCodigo(codigo){


    return listarEtiquetas()

    .find(

        item =>

        item.codigoBarras == codigo

    );


}



/* =====================================================
   ETIQUETAS DO PRODUTO
===================================================== */


function etiquetasProduto(idProduto){


    return listarEtiquetas()

    .filter(

        item =>

        item.produtoId==idProduto

    );


}



/* =====================================================
   MODELO DE IMPRESSÃO
===================================================== */


function modeloEtiqueta(etiqueta){


    return {


        linha1:

        etiqueta.empresa,


        linha2:

        etiqueta.produto,


        linha3:

        "Lote: "

        +

        etiqueta.lote,


        linha4:

        "Validade: "

        +

        etiqueta.validade,


        linha5:

        etiqueta.codigoBarras


    };


}



/* =====================================================
   PREPARAR IMPRESSÃO
===================================================== */


/*

Essa função será usada

pela tela de impressão

*/


function prepararImpressaoEtiqueta(id){


    const etiqueta =

    listarEtiquetas()

    .find(

        item =>

        item.id==id

    );



    if(!etiqueta){


        return null;


    }



    return modeloEtiqueta(

        etiqueta

    );


}



/* =====================================================
   CANCELAR ETIQUETA
===================================================== */


function cancelarEtiqueta(id){


    const etiquetas =

    listarEtiquetas();



    const etiqueta =

    etiquetas.find(

        item =>

        item.id==id

    );



    if(!etiqueta){


        return false;


    }



    etiqueta.status=

    "CANCELADA";



    salvarEtiquetas(

        etiquetas

    );



    return true;


}



/* =====================================================
   FIM STORAGE.JS PARTE 21
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 22

   Dashboard avançado
===================================================== */


/* =====================================================
   FATURAMENTO POR PERÍODO
===================================================== */


function faturamentoPeriodo(
inicio,
fim
){


    const vendas =

    listarVendas();



    return vendas

    .filter(

        venda=>{


            const data =

            new Date(venda.data);



            return (

                data >=

                new Date(inicio)

            )

            &&

            (

                data <=

                new Date(fim)

            );


        }

    )

    .reduce(

        (total,venda)=>

        total +

        Number(venda.total),

        0

    );


}



/* =====================================================
   CUSTO DE PRODUÇÃO TOTAL
===================================================== */


function custoProducaoTotal(){


    const producoes =

    listarProducoes();



    return producoes

    .reduce(

        (total,item)=>

        total +

        Number(item.custo || 0),

        0

    );


}



/* =====================================================
   LUCRO ESTIMADO
===================================================== */


function lucroEstimado(){


    const faturamento =

    faturamentoTotal();



    const custo =

    custoProducaoTotal();



    return {


        faturamento:

        faturamento,


        custo:

        custo,


        lucro:

        faturamento -

        custo


    };


}



/* =====================================================
   MARGEM MÉDIA
===================================================== */


function margemMedia(){


    const dados =

    lucroEstimado();



    if(dados.faturamento===0){


        return 0;


    }



    return (

        (

            dados.lucro /

            dados.faturamento

        )

        *

        100

    )

    .toFixed(2);


}



/* =====================================================
   PRODUTOS MAIS VENDIDOS
===================================================== */


function produtosMaisVendidos(){


    const vendas =

    listarVendas();



    const ranking={};



    vendas.forEach(

        venda=>{


            if(!ranking[venda.produtoId]){


                ranking[venda.produtoId]=0;


            }



            ranking[venda.produtoId]

            +=

            Number(venda.quantidade);



        }

    );



    return Object.keys(ranking)

    .map(

        id=>{


            const produto =

            listarProdutos()

            .find(

                item=>

                item.id==id

            );



            return {


                produto:

                produto ?

                produto.nome :

                "Não encontrado",


                quantidade:

                ranking[id]


            };


        }

    )

    .sort(

        (a,b)=>

        b.quantidade -

        a.quantidade

    );


}



/* =====================================================
   PRODUTOS CAMPEÕES
===================================================== */


function produtosCampeoes(
limite=5
){


    return produtosMaisVendidos()

    .slice(

        0,

        limite

    );


}



/* =====================================================
   PRODUÇÃO DO PERÍODO
===================================================== */


function producaoPeriodo(
inicio,
fim
){


    const producoes =

    listarProducoes();



    return producoes.filter(

        item=>{


            const data =

            new Date(item.data);



            return (

                data >=

                new Date(inicio)

            )

            &&

            (

                data <=

                new Date(fim)

            );


        }

    );


}



/* =====================================================
   RESUMO DO DIA
===================================================== */


function resumoHoje(){


    const hoje =

    new Date()

    .toISOString()

    .substring(0,10);



    const vendas =

    listarVendas()

    .filter(

        item=>

        item.data

        .substring(0,10)

        ==

        hoje

    );



    return {


        vendas:

        vendas.length,


        faturamento:

        vendas.reduce(

            (total,item)=>

            total +

            Number(item.total),

            0

        ),


        alertas:

        resumoAlertas(),


        estoque:

        relatorioEstoque()


    };


}



/* =====================================================
   DASHBOARD COMPLETO
===================================================== */


function dashboardGeral(){


    return {


        faturamento:

        faturamentoTotal(),


        lucro:

        lucroEstimado(),


        margem:

        margemMedia(),


        estoque:

        relatorioEstoque(),


        producao:

        relatorioProducao(),


        vendas:

        relatorioVendas(),


        campeoes:

        produtosCampeoes(),


        alertas:

        resumoAlertas(),


        atualizado:

        new Date()

        .toISOString()


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 22
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 23

   Usuários e permissões
===================================================== */


/* =====================================================
   INICIALIZAR USUÁRIOS
===================================================== */


function iniciarUsuarios(){


    if(!localStorage.getItem(DB.usuarios)){


        salvarDados(

            DB.usuarios,

            [

                {

                    id:1,

                    nome:
                    "Administrador",

                    usuario:
                    "admin",

                    senha:
                    "1234",

                    perfil:
                    "ADMIN",

                    ativo:true,

                    permissoes:

                    [

                        "TODOS"

                    ]

                }

            ]

        );


    }


}


iniciarUsuarios();



/* =====================================================
   LISTAR USUÁRIOS
===================================================== */


function listarUsuarios(){


    return lerDados(

        DB.usuarios

    );


}



/* =====================================================
   SALVAR USUÁRIOS
===================================================== */


function salvarUsuarios(lista){


    salvarDados(

        DB.usuarios,

        lista

    );


}



/* =====================================================
   CRIAR USUÁRIO
===================================================== */


function criarUsuario(dados){


    const usuarios =

    listarUsuarios();



    const usuario = {


        id:

        gerarID(usuarios),


        nome:

        dados.nome,


        usuario:

        dados.usuario,


        senha:

        dados.senha,


        perfil:

        dados.perfil || "OPERADOR",


        ativo:

        true,


        permissoes:

        dados.permissoes || []


    };



    usuarios.push(usuario);



    salvarUsuarios(

        usuarios

    );



    registrarHistorico(

        "Usuário criado",

        {

            usuario:

            usuario.usuario

        }

    );



    return usuario;


}



/* =====================================================
   BUSCAR USUÁRIO
===================================================== */


function buscarUsuario(login){


    return listarUsuarios()

    .find(

        item =>

        item.usuario == login

    );


}



/* =====================================================
   LOGIN
===================================================== */


function loginUsuario(
usuario,
senha
){


    const encontrado =

    listarUsuarios()

    .find(

        item =>


        item.usuario == usuario

        &&

        item.senha == senha

        &&

        item.ativo


    );



    if(!encontrado){


        return {


            sucesso:false,


            mensagem:
            "Usuário ou senha inválidos"


        };


    }



    salvarDados(

        "carols_usuario_logado",

        encontrado

    );



    registrarHistorico(

        "Login realizado",

        {

            usuario:

            usuario

        }

    );



    return {


        sucesso:true,


        usuario:

        encontrado


    };


}



/* =====================================================
   USUÁRIO LOGADO
===================================================== */


function usuarioLogado(){


    return lerDados(

        "carols_usuario_logado"

    );


}



/* =====================================================
   LOGOUT
===================================================== */


function logoutUsuario(){


    localStorage.removeItem(

        "carols_usuario_logado"

    );


}



/* =====================================================
   VERIFICAR PERMISSÃO
===================================================== */


function possuiPermissao(
modulo
){


    const usuario =

    usuarioLogado();



    if(!usuario){


        return false;


    }



    if(

        usuario.permissoes

        .includes(

            "TODOS"

        )

    ){


        return true;


    }



    return usuario.permissoes

    .includes(

        modulo

    );


}



/* =====================================================
   ALTERAR STATUS USUÁRIO
===================================================== */


function alterarStatusUsuario(
id,
status
){


    const usuarios =

    listarUsuarios();



    const usuario =

    usuarios.find(

        item =>

        item.id==id

    );



    if(!usuario){


        return false;


    }



    usuario.ativo = status;



    salvarUsuarios(

        usuarios

    );



    return true;


}



/* =====================================================
   ALTERAR SENHA
===================================================== */


function alterarSenha(
id,
novaSenha
){


    const usuarios =

    listarUsuarios();



    const usuario =

    usuarios.find(

        item =>

        item.id==id

    );



    if(!usuario){


        return false;


    }



    usuario.senha = novaSenha;



    salvarUsuarios(

        usuarios

    );



    return true;


}



/* =====================================================
   PERFIS PADRÃO
===================================================== */


function perfisSistema(){


    return {


        ADMIN:

        [

            "TODOS"

        ],



        PRODUCAO:

        [

            "PRODUCAO",

            "ETIQUETAS"

        ],



        ESTOQUE:

        [

            "ESTOQUE",

            "INVENTARIO"

        ],



        VENDAS:

        [

            "VENDAS"

        ]


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 23
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 24

   Auditoria e histórico
===================================================== */


/* =====================================================
   INICIALIZAR HISTÓRICO
===================================================== */


function iniciarHistorico(){


    if(!localStorage.getItem(DB.historico)){


        salvarDados(

            DB.historico,

            []

        );


    }


}


iniciarHistorico();



/* =====================================================
   LISTAR HISTÓRICO
===================================================== */


function listarHistorico(){


    return lerDados(

        DB.historico

    );


}



/* =====================================================
   SALVAR HISTÓRICO
===================================================== */


function salvarHistorico(lista){


    salvarDados(

        DB.historico,

        lista

    );


}



/* =====================================================
   REGISTRAR AÇÃO
===================================================== */


function registrarHistorico(
acao,
dados={}
){


    const historico =

    listarHistorico();



    const usuario =

    usuarioLogado();



    const registro = {


        id:

        Date.now(),


        usuario:

        usuario ?

        usuario.nome :

        "Sistema",


        usuarioId:

        usuario ?

        usuario.id :

        null,


        acao:

        acao,


        dados:

        dados,


        data:

        new Date()

        .toISOString(),


        dispositivo:

        gerarIdentificacaoDispositivo()


    };



    historico.push(

        registro

    );



    salvarHistorico(

        historico

    );



    return registro;


}



/* =====================================================
   BUSCAR POR USUÁRIO
===================================================== */


function historicoUsuario(
idUsuario
){


    return listarHistorico()

    .filter(

        item =>

        item.usuarioId == idUsuario

    );


}



/* =====================================================
   BUSCAR POR AÇÃO
===================================================== */


function historicoAcao(
acao
){


    return listarHistorico()

    .filter(

        item =>

        item.acao == acao

    );


}



/* =====================================================
   HISTÓRICO POR PERÍODO
===================================================== */


function historicoPeriodo(
inicio,
fim
){


    return listarHistorico()

    .filter(

        item=>{


            const data =

            new Date(item.data);



            return (

                data >=

                new Date(inicio)

            )

            &&

            (

                data <=

                new Date(fim)

            );


        }

    );


}



/* =====================================================
   ÚLTIMAS MOVIMENTAÇÕES
===================================================== */


function ultimasMovimentacoes(
limite=10
){


    return listarHistorico()

    .slice(

        -limite

    )

    .reverse();


}



/* =====================================================
   LIMPAR HISTÓRICO
===================================================== */


function limparHistorico(){


    salvarDados(

        DB.historico,

        []

    );


}



/* =====================================================
   RESUMO DE AUDITORIA
===================================================== */


function resumoAuditoria(){


    const lista =

    listarHistorico();



    return {


        total:

        lista.length,


        usuarios:

        [

            ...

            new Set(

                lista.map(

                    item=>

                    item.usuario

                )

            )

        ],


        ultima:

        lista

        .slice(-1)[0]

    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 24
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 25

   Financeiro completo
===================================================== */


/* =====================================================
   INICIALIZAR FINANCEIRO
===================================================== */


function iniciarFinanceiro(){


    if(!localStorage.getItem(DB.financeiro)){


        salvarDados(

            DB.financeiro,

            {


                entradas:[],


                saidas:[],


                contasPagar:[],


                contasReceber:[]


            }


        );


    }


}


iniciarFinanceiro();



/* =====================================================
   BUSCAR FINANCEIRO
===================================================== */


function buscarFinanceiro(){


    return lerDados(

        DB.financeiro

    );


}



/* =====================================================
   SALVAR FINANCEIRO
===================================================== */


function salvarFinanceiro(dados){


    salvarDados(

        DB.financeiro,

        dados

    );


}



/* =====================================================
   REGISTRAR ENTRADA
===================================================== */


function registrarEntrada(
descricao,
valor,
categoria="VENDA"
){


    const financeiro =

    buscarFinanceiro();



    const entrada = {


        id:

        Date.now(),


        descricao:

        descricao,


        valor:

        Number(valor),


        categoria:

        categoria,


        data:

        new Date()

        .toISOString(),


        tipo:

        "ENTRADA"


    };



    financeiro.entradas.push(

        entrada

    );



    salvarFinanceiro(

        financeiro

    );



    registrarHistorico(

        "Entrada financeira",

        entrada

    );



    return entrada;


}



/* =====================================================
   REGISTRAR SAÍDA
===================================================== */


function registrarSaida(
descricao,
valor,
categoria="DESPESA"
){


    const financeiro =

    buscarFinanceiro();



    const saida = {


        id:

        Date.now(),


        descricao:

        descricao,


        valor:

        Number(valor),


        categoria:

        categoria,


        data:

        new Date()

        .toISOString(),


        tipo:

        "SAIDA"


    };



    financeiro.saidas.push(

        saida

    );



    salvarFinanceiro(

        financeiro

    );



    registrarHistorico(

        "Saída financeira",

        saida

    );



    return saida;


}



/* =====================================================
   CONTAS A PAGAR
===================================================== */


function criarContaPagar(dados){


    const financeiro =

    buscarFinanceiro();



    const conta = {


        id:

        Date.now(),


        descricao:

        dados.descricao,


        fornecedor:

        dados.fornecedor || "",


        valor:

        Number(dados.valor),


        vencimento:

        dados.vencimento,


        pago:false


    };



    financeiro.contasPagar.push(

        conta

    );



    salvarFinanceiro(

        financeiro

    );



    return conta;


}



/* =====================================================
   CONTAS A RECEBER
===================================================== */


function criarContaReceber(dados){


    const financeiro =

    buscarFinanceiro();



    const conta = {


        id:

        Date.now(),


        descricao:

        dados.descricao,


        cliente:

        dados.cliente || "",


        valor:

        Number(dados.valor),


        vencimento:

        dados.vencimento,


        recebido:false


    };



    financeiro.contasReceber.push(

        conta

    );



    salvarFinanceiro(

        financeiro

    );



    return conta;


}



/* =====================================================
   PAGAR CONTA
===================================================== */


function pagarConta(id){


    const financeiro =

    buscarFinanceiro();



    const conta =

    financeiro.contasPagar.find(

        item =>

        item.id==id

    );



    if(!conta){


        return false;


    }



    conta.pago=true;



    registrarSaida(

        conta.descricao,

        conta.valor,

        "CONTA_PAGA"

    );



    salvarFinanceiro(

        financeiro

    );



    return true;


}



/* =====================================================
   RECEBER CONTA
===================================================== */


function receberConta(id){


    const financeiro =

    buscarFinanceiro();



    const conta =

    financeiro.contasReceber.find(

        item =>

        item.id==id

    );



    if(!conta){


        return false;


    }



    conta.recebido=true;



    registrarEntrada(

        conta.descricao,

        conta.valor,

        "CONTA_RECEBIDA"

    );



    salvarFinanceiro(

        financeiro

    );



    return true;


}



/* =====================================================
   SALDO ATUAL
===================================================== */


function saldoFinanceiro(){


    const financeiro =

    buscarFinanceiro();



    const entradas =

    financeiro.entradas.reduce(

        (total,item)=>

        total +

        item.valor,

        0

    );



    const saidas =

    financeiro.saidas.reduce(

        (total,item)=>

        total +

        item.valor,

        0

    );



    return {


        entradas:

        entradas,


        saidas:

        saidas,


        saldo:

        entradas -

        saidas


    };


}



/* =====================================================
   FLUXO DE CAIXA
===================================================== */


function fluxoCaixa(){


    return {


        saldo:

        saldoFinanceiro(),


        pagar:

        buscarFinanceiro()

        .contasPagar,


        receber:

        buscarFinanceiro()

        .contasReceber


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 25
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 26

   Venda integrada ao ERP
===================================================== */


/* =====================================================
   INICIALIZAR VENDAS
===================================================== */


function iniciarVendas(){


    if(!localStorage.getItem(DB.vendas)){


        salvarDados(

            DB.vendas,

            []

        );


    }


}


iniciarVendas();



/* =====================================================
   LISTAR VENDAS
===================================================== */


function listarVendas(){


    return lerDados(

        DB.vendas

    );


}



/* =====================================================
   SALVAR VENDAS
===================================================== */


function salvarVendas(lista){


    salvarDados(

        DB.vendas,

        lista

    );


}



/* =====================================================
   CRIAR VENDA
===================================================== */


function criarVenda(dados){


    const vendas =

    listarVendas();



    const venda = {


        id:

        gerarID(vendas),


        produtoId:

        dados.produtoId,


        codigo:

        dados.codigo || "",


        produto:

        dados.produto,


        quantidade:

        Number(dados.quantidade),


        valorUnitario:

        Number(dados.valorUnitario),


        total:

        Number(dados.quantidade)

        *

        Number(dados.valorUnitario),


        cliente:

        dados.cliente || "Consumidor",


        data:

        new Date()

        .toISOString(),


        status:

        "FINALIZADA"


    };



    vendas.push(venda);



    salvarVendas(

        vendas

    );



    return venda;


}



/* =====================================================
   VENDA POR CÓDIGO DE BARRAS
===================================================== */


function venderPorCodigo(
codigo,
quantidade=1
){


    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return {


            sucesso:false,


            mensagem:

            "Produto não encontrado"


        };


    }



    if(produto.estoque < quantidade){


        return {


            sucesso:false,


            mensagem:

            "Estoque insuficiente"


        };


    }



    const venda =

    criarVenda({


        produtoId:

        produto.id,


        codigo:

        codigo,


        produto:

        produto.nome,


        quantidade:

        quantidade,


        valorUnitario:

        produto.venda


    });



    baixarEstoque(

        produto.id,

        quantidade

    );



    registrarEntrada(

        "Venda "

        +

        produto.nome,

        venda.total,

        "VENDA"

    );



    registrarHistorico(

        "Venda realizada",

        venda

    );



    return {


        sucesso:true,


        venda:venda


    };


}



/* =====================================================
   CANCELAR VENDA
===================================================== */


function cancelarVenda(id){


    const vendas =

    listarVendas();



    const venda =

    vendas.find(

        item =>

        item.id==id

    );



    if(!venda){


        return false;


    }



    if(venda.status==="CANCELADA"){


        return false;


    }



    venda.status=

    "CANCELADA";



    adicionarEstoque(

        venda.produtoId,

        venda.quantidade

    );



    registrarSaida(

        "Cancelamento venda "

        +

        venda.produto,

        venda.total,

        "ESTORNO"

    );



    salvarVendas(

        vendas

    );



    registrarHistorico(

        "Venda cancelada",

        venda

    );



    return true;


}



/* =====================================================
   VENDAS DO DIA
===================================================== */


function vendasHoje(){


    const hoje =

    new Date()

    .toISOString()

    .substring(0,10);



    return listarVendas()

    .filter(

        venda =>

        venda.data

        .substring(0,10)

        ==

        hoje

        &&

        venda.status==="FINALIZADA"

    );


}



/* =====================================================
   FATURAMENTO TOTAL
===================================================== */


function faturamentoTotal(){


    return listarVendas()

    .filter(

        venda =>

        venda.status==="FINALIZADA"

    )

    .reduce(

        (total,venda)=>

        total +

        venda.total,

        0

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 26
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 27

   Custos e ficha técnica
===================================================== */


/* =====================================================
   INICIALIZAR FICHAS
===================================================== */


function iniciarFichasTecnicas(){


    if(!localStorage.getItem(DB.fichasTecnicas)){


        salvarDados(

            DB.fichasTecnicas,

            []

        );


    }


}


iniciarFichasTecnicas();



/* =====================================================
   LISTAR FICHAS
===================================================== */


function listarFichasTecnicas(){


    return lerDados(

        DB.fichasTecnicas

    );


}



/* =====================================================
   SALVAR FICHAS
===================================================== */


function salvarFichasTecnicas(lista){


    salvarDados(

        DB.fichasTecnicas,

        lista

    );


}



/* =====================================================
   CRIAR FICHA TÉCNICA
===================================================== */


function criarFichaTecnica(dados){


    const fichas =

    listarFichasTecnicas();



    const ficha = {


        id:

        gerarID(fichas),


        produtoId:

        dados.produtoId,


        produto:

        dados.produto,


        rendimento:

        Number(dados.rendimento),


        ingredientes:

        dados.ingredientes || [],


        criado:

        new Date()

        .toISOString()


    };



    fichas.push(ficha);



    salvarFichasTecnicas(

        fichas

    );



    return ficha;


}



/* =====================================================
   CALCULAR CUSTO DA FICHA
===================================================== */


function calcularCustoFicha(idProduto){


    const ficha =

    listarFichasTecnicas()

    .find(

        item =>

        item.produtoId==idProduto

    );



    if(!ficha){


        return 0;


    }



    return ficha.ingredientes

    .reduce(

        (total,item)=>{


            const materia =

            listarMateriasPrimas()

            .find(

                m =>

                m.id==item.materiaId

            );



            if(!materia){


                return total;


            }



            const custo =

            Number(materia.custo)



            *

            Number(item.quantidade);



            return total + custo;



        },

        0

    );


}



/* =====================================================
   CUSTO POR UNIDADE
===================================================== */


function custoUnitarioProduto(
idProduto
){


    const ficha =

    listarFichasTecnicas()

    .find(

        item =>

        item.produtoId==idProduto

    );



    if(!ficha){


        return 0;


    }



    const custo =

    calcularCustoFicha(

        idProduto

    );



    return custo /

    Number(

        ficha.rendimento

    );


}



/* =====================================================
   SUGESTÃO DE PREÇO
===================================================== */


function sugerirPrecoVenda(
idProduto
){


    const custo =

    custoUnitarioProduto(

        idProduto

    );



    const margem =

    margemPadrao();



    return custo *

    (

        1 +

        (

            margem /

            100

        )

    );


}



/* =====================================================
   LUCRO POR PRODUTO
===================================================== */


function lucroProduto(
idProduto
){


    const produto =

    listarProdutos()

    .find(

        item =>

        item.id==idProduto

    );



    if(!produto){


        return null;


    }



    const custo =

    custoUnitarioProduto(

        idProduto

    );



    return {


        produto:

        produto.nome,


        custo:

        custo,


        venda:

        produto.venda,


        lucro:

        produto.venda -

        custo



    };


}



/* =====================================================
   RANKING DE LUCRO
===================================================== */


function rankingLucro(){


    return listarProdutos()

    .map(

        produto=>{


            return lucroProduto(

                produto.id

            );


        }

    )

    .filter(

        item=>

        item

    )

    .sort(

        (a,b)=>

        b.lucro -

        a.lucro

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 27
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 28

   Matéria-prima avançada
===================================================== */


/* =====================================================
   INICIALIZAR FORNECEDORES
===================================================== */


function iniciarFornecedores(){


    if(!localStorage.getItem(DB.fornecedores)){


        salvarDados(

            DB.fornecedores,

            []

        );


    }


}


iniciarFornecedores();



/* =====================================================
   INICIALIZAR COMPRAS
===================================================== */


function iniciarCompras(){


    if(!localStorage.getItem(DB.compras)){


        salvarDados(

            DB.compras,

            []

        );


    }


}


iniciarCompras();



/* =====================================================
   LISTAR FORNECEDORES
===================================================== */


function listarFornecedores(){


    return lerDados(

        DB.fornecedores

    );


}



/* =====================================================
   CADASTRAR FORNECEDOR
===================================================== */


function criarFornecedor(dados){


    const lista =

    listarFornecedores();



    const fornecedor = {


        id:

        gerarID(lista),


        nome:

        dados.nome,


        cnpj:

        dados.cnpj || "",


        telefone:

        dados.telefone || "",


        contato:

        dados.contato || "",


        ativo:true


    };



    lista.push(fornecedor);



    salvarDados(

        DB.fornecedores,

        lista

    );



    registrarHistorico(

        "Fornecedor cadastrado",

        fornecedor

    );



    return fornecedor;


}



/* =====================================================
   BUSCAR FORNECEDOR
===================================================== */


function buscarFornecedor(id){


    return listarFornecedores()

    .find(

        item=>

        item.id==id

    );


}



/* =====================================================
   LISTAR COMPRAS
===================================================== */


function listarCompras(){


    return lerDados(

        DB.compras

    );


}



/* =====================================================
   REGISTRAR COMPRA DE MATÉRIA-PRIMA
===================================================== */


function registrarCompraMateriaPrima(dados){


    const compras =

    listarCompras();



    const compra = {


        id:

        gerarID(compras),


        materiaId:

        dados.materiaId,


        fornecedorId:

        dados.fornecedorId,


        quantidade:

        Number(dados.quantidade),


        unidade:

        dados.unidade || "KG",


        custo:

        Number(dados.custo),


        lote:

        dados.lote || "",


        validade:

        dados.validade || "",


        data:

        new Date()

        .toISOString()


    };



    compras.push(compra);



    salvarDados(

        DB.compras,

        compras

    );



    atualizarCustoMateriaPrima(

        dados.materiaId,

        dados.custo

    );



    adicionarEstoqueMateriaPrima(

        dados.materiaId,

        dados.quantidade

    );



    registrarSaida(

        "Compra matéria-prima",

        dados.custo *

        dados.quantidade,

        "COMPRA"

    );



    registrarHistorico(

        "Compra registrada",

        compra

    );



    return compra;


}



/* =====================================================
   ATUALIZAR CUSTO DA MATÉRIA-PRIMA
===================================================== */


function atualizarCustoMateriaPrima(
id,
novoCusto
){


    const materias =

    listarMateriasPrimas();



    const materia =

    materias.find(

        item =>

        item.id==id

    );



    if(!materia){


        return false;


    }



    materia.custo =

    Number(novoCusto);



    salvarDados(

        DB.materias,

        materias

    );



    return true;


}



/* =====================================================
   COMPRAS POR FORNECEDOR
===================================================== */


function comprasFornecedor(
idFornecedor
){


    return listarCompras()

    .filter(

        item =>

        item.fornecedorId==idFornecedor

    );


}



/* =====================================================
   MATÉRIAS VENCENDO
===================================================== */


function materiasVencendo(
dias=30
){


    const hoje =

    new Date();



    return listarCompras()

    .filter(

        item=>{


            const validade =

            new Date(

                item.validade

            );


            const diferenca =

            (

                validade -

                hoje

            )

            /

            (

                1000 *

                60 *

                60 *

                24

            );



            return diferenca <= dias;


        }

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 28
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 29

   Inventário inteligente
===================================================== */


/* =====================================================
   INICIALIZAR INVENTÁRIO
===================================================== */


function iniciarInventario(){


    if(!localStorage.getItem(DB.inventarios)){


        salvarDados(

            DB.inventarios,

            []

        );


    }


}


iniciarInventario();



/* =====================================================
   LISTAR INVENTÁRIOS
===================================================== */


function listarInventarios(){


    return lerDados(

        DB.inventarios

    );


}



/* =====================================================
   SALVAR INVENTÁRIOS
===================================================== */


function salvarInventarios(lista){


    salvarDados(

        DB.inventarios,

        lista

    );


}



/* =====================================================
   CRIAR INVENTÁRIO
===================================================== */


function criarInventario(){


    const inventarios =

    listarInventarios();



    const inventario = {


        id:

        gerarID(inventarios),


        data:

        new Date()

        .toISOString(),


        status:

        "ABERTO",


        itens:[]


    };



    inventarios.push(

        inventario

    );



    salvarInventarios(

        inventarios

    );



    registrarHistorico(

        "Inventário iniciado",

        inventario

    );



    return inventario;


}



/* =====================================================
   ADICIONAR ITEM AO INVENTÁRIO
===================================================== */


function adicionarItemInventario(
idInventario,
idProduto,
quantidadeReal
){


    const inventarios =

    listarInventarios();



    const inventario =

    inventarios.find(

        item =>

        item.id==idInventario

    );



    if(!inventario){


        return false;


    }



    const produto =

    listarProdutos()

    .find(

        item =>

        item.id==idProduto

    );



    if(!produto){


        return false;


    }



    const item = {


        produtoId:

        produto.id,


        produto:

        produto.nome,


        estoqueSistema:

        Number(produto.estoque || 0),


        estoqueReal:

        Number(quantidadeReal),


        diferenca:

        Number(quantidadeReal)

        -

        Number(produto.estoque || 0)


    };



    inventario.itens.push(

        item

    );



    salvarInventarios(

        inventarios

    );



    return item;


}



/* =====================================================
   FINALIZAR INVENTÁRIO
===================================================== */


function finalizarInventario(id){


    const inventarios =

    listarInventarios();



    const inventario =

    inventarios.find(

        item =>

        item.id==id

    );



    if(!inventario){


        return false;


    }



    inventario.status=

    "FINALIZADO";



    salvarInventarios(

        inventarios

    );



    registrarHistorico(

        "Inventário finalizado",

        inventario

    );



    return true;


}



/* =====================================================
   AJUSTAR ESTOQUE PELO INVENTÁRIO
===================================================== */


function aplicarAjusteInventario(id){


    const inventarios =

    listarInventarios();



    const inventario =

    inventarios.find(

        item =>

        item.id==id

    );



    if(!inventario){


        return false;


    }



    inventario.itens

    .forEach(

        item=>{


            if(item.diferenca!==0){


                ajustarEstoque(

                    item.produtoId,

                    item.diferenca

                );


            }


        }

    );



    inventario.ajustado=true;



    salvarInventarios(

        inventarios

    );



    registrarHistorico(

        "Ajuste de inventário aplicado",

        inventario

    );



    return true;


}



/* =====================================================
   DIFERENÇAS DE ESTOQUE
===================================================== */


function diferencasInventario(id){


    const inventario =

    listarInventarios()

    .find(

        item =>

        item.id==id

    );



    if(!inventario){


        return [];


    }



    return inventario.itens

    .filter(

        item =>

        item.diferenca!==0

    );


}



/* =====================================================
   ÚLTIMO INVENTÁRIO
===================================================== */


function ultimoInventario(){


    return listarInventarios()

    .slice(-1)[0];


}



/* =====================================================
   FIM STORAGE.JS PARTE 29
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 30

   Scanner e leitura de código de barras
===================================================== */


/* =====================================================
   INICIALIZAR SCANNER
===================================================== */


function iniciarScanner(){


    if(!localStorage.getItem(DB.scanner)){


        salvarDados(

            DB.scanner,

            {


                dispositivoAtual:

                "NENHUM",


                tipo:

                "",


                leituras:[]


            }


        );


    }


}


iniciarScanner();



/* =====================================================
   BUSCAR CONFIGURAÇÃO SCANNER
===================================================== */


function buscarScanner(){


    return lerDados(

        DB.scanner

    );


}



/* =====================================================
   CONFIGURAR SCANNER
===================================================== */


function configurarScanner(
tipo,
nome
){


    const scanner =

    buscarScanner();



    scanner.tipo = tipo;


    scanner.dispositivoAtual = nome;



    salvarDados(

        DB.scanner,

        scanner

    );



    registrarHistorico(

        "Scanner configurado",

        scanner

    );


    return scanner;


}



/* =====================================================
   REGISTRAR LEITURA
===================================================== */


function registrarLeituraCodigo(
codigo,
origem="USB"
){


    const scanner =

    buscarScanner();



    const leitura = {


        codigo:

        codigo,


        origem:

        origem,


        data:

        new Date()

        .toISOString()


    };



    scanner.leituras.push(

        leitura

    );



    salvarDados(

        DB.scanner,

        scanner

    );



    return leitura;


}



/* =====================================================
   BUSCAR PRODUTO PELO CÓDIGO
===================================================== */


function buscarProdutoPorCodigo(
codigo
){


    return listarProdutos()

    .find(

        produto =>


        produto.codigoBarras == codigo


    );


}



/* =====================================================
   LEITURA COMPLETA
===================================================== */


function processarCodigoBarras(
codigo,
origem="USB"
){


    registrarLeituraCodigo(

        codigo,

        origem

    );



    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return {


            encontrado:false,


            codigo:codigo,


            mensagem:

            "Produto não cadastrado"


        };


    }



    return {


        encontrado:true,


        produto:produto


    };


}



/* =====================================================
   ENTRADA POR CÓDIGO
===================================================== */


function entradaPorCodigo(
codigo,
quantidade
){


    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return false;


    }



    adicionarEstoque(

        produto.id,

        quantidade

    );



    registrarHistorico(

        "Entrada via scanner",

        {

            produto:

            produto.nome,


            quantidade:

            quantidade


        }

    );



    return true;


}



/* =====================================================
   SAÍDA POR CÓDIGO
===================================================== */


function saidaPorCodigo(
codigo,
quantidade
){


    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return false;


    }



    baixarEstoque(

        produto.id,

        quantidade

    );



    registrarHistorico(

        "Saída via scanner",

        {

            produto:

            produto.nome,


            quantidade:

            quantidade


        }

    );



    return true;


}



/* =====================================================
   VENDA POR SCANNER
===================================================== */


function vendaScanner(
codigo,
quantidade=1
){


    registrarLeituraCodigo(

        codigo,

        "VENDA"

    );



    return venderPorCodigo(

        codigo,

        quantidade

    );


}



/* =====================================================
   ÚLTIMAS LEITURAS
===================================================== */


function ultimasLeiturasScanner(
limite=20
){


    const scanner =

    buscarScanner();



    return scanner.leituras

    .slice(

        -limite

    )

    .reverse();


}



/* =====================================================
   LIMPAR HISTÓRICO SCANNER
===================================================== */


function limparLeiturasScanner(){


    const scanner =

    buscarScanner();



    scanner.leituras=[];



    salvarDados(

        DB.scanner,

        scanner

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 30
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 31

   Relatórios profissionais
===================================================== */


/* =====================================================
   RELATÓRIO DE VENDAS
===================================================== */


function relatorioVendas(
inicio,
fim
){


    let vendas =

    listarVendas();



    if(inicio && fim){


        vendas = vendas.filter(

            item=>{


                const data =

                new Date(item.data);



                return (

                    data >=

                    new Date(inicio)

                )

                &&

                (

                    data <=

                    new Date(fim)

                );


            }

        );


    }



    return {


        quantidade:

        vendas.length,


        total:

        vendas.reduce(

            (total,item)=>

            total +

            Number(item.total),

            0

        ),


        vendas:


        vendas


    };


}



/* =====================================================
   RELATÓRIO DE PRODUÇÃO
===================================================== */


function relatorioProducao(
inicio,
fim
){


    let producao =

    listarProducoes();



    if(inicio && fim){


        producao = producao.filter(

            item=>{


                const data=

                new Date(item.data);



                return (

                    data >=

                    new Date(inicio)

                )

                &&

                (

                    data <=

                    new Date(fim)

                );


            }

        );


    }



    return {


        quantidadeLotes:

        producao.length,


        unidades:

        producao.reduce(

            (total,item)=>

            total +

            Number(

                item.quantidade || 0

            ),

            0

        ),


        producao:

        producao


    };


}



/* =====================================================
   RELATÓRIO DE ESTOQUE
===================================================== */


function relatorioEstoque(){


    const estoque =

    listarEstoque();



    return {


        totalItens:

        estoque.length,


        baixoEstoque:

        estoque.filter(

            item=>

            item.quantidade <=

            item.minimo

        ),


        itens:

        estoque


    };


}



/* =====================================================
   RELATÓRIO FINANCEIRO
===================================================== */


function relatorioFinanceiro(){


    const financeiro =

    buscarFinanceiro();



    const entradas =

    financeiro.entradas.reduce(

        (total,item)=>

        total +

        item.valor,

        0

    );



    const saidas =

    financeiro.saidas.reduce(

        (total,item)=>

        total +

        item.valor,

        0

    );



    return {


        entradas:

        entradas,


        saidas:

        saidas,


        resultado:

        entradas -

        saidas,


        contasPagar:

        financeiro.contasPagar,


        contasReceber:

        financeiro.contasReceber


    };


}



/* =====================================================
   RELATÓRIO DE PRODUTOS
===================================================== */


function relatorioProdutos(){


    return listarProdutos()

    .map(

        produto=>{


            return {


                nome:

                produto.nome,


                codigo:

                produto.codigoBarras,


                estoque:

                produto.estoque || 0,


                custo:

                custoUnitarioProduto(

                    produto.id

                ),


                preco:

                produto.venda || 0,


                lucro:

                lucroProduto(

                    produto.id

                )


            };


        }

    );


}



/* =====================================================
   RELATÓRIO DE CUSTOS
===================================================== */


function relatorioCustos(){


    return listarProdutos()

    .map(

        produto=>{


            return {


                produto:

                produto.nome,


                custo:

                custoUnitarioProduto(

                    produto.id

                ),


                margem:

                margemMedia()


            };


        }

    );


}



/* =====================================================
   RESUMO GERAL
===================================================== */


function resumoRelatorios(){


    return {


        vendas:

        relatorioVendas(),


        producao:

        relatorioProducao(),


        estoque:

        relatorioEstoque(),


        financeiro:

        relatorioFinanceiro(),


        produtos:

        relatorioProdutos(),


        gerado:

        new Date()

        .toISOString()


    };


}



/* =====================================================
   EXPORTAR RELATÓRIO JSON
===================================================== */


function exportarRelatorio(){


    return JSON.stringify(

        resumoRelatorios(),

        null,

        2

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 31
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 32

   Sistema de alertas inteligentes
===================================================== */


/* =====================================================
   INICIALIZAR ALERTAS
===================================================== */


function iniciarAlertas(){


    if(!localStorage.getItem(DB.alertas)){


        salvarDados(

            DB.alertas,

            []

        );


    }


}


iniciarAlertas();



/* =====================================================
   LISTAR ALERTAS
===================================================== */


function listarAlertas(){


    return lerDados(

        DB.alertas

    );


}



/* =====================================================
   SALVAR ALERTAS
===================================================== */


function salvarAlertas(lista){


    salvarDados(

        DB.alertas,

        lista

    );


}



/* =====================================================
   CRIAR ALERTA
===================================================== */


function criarAlerta(
tipo,
titulo,
descricao,
nivel="MEDIO"
){


    const alertas =

    listarAlertas();



    const alerta = {


        id:

        Date.now(),


        tipo:

        tipo,


        titulo:

        titulo,


        descricao:

        descricao,


        nivel:

        nivel,


        resolvido:false,


        data:

        new Date()

        .toISOString()


    };



    alertas.push(

        alerta

    );



    salvarAlertas(

        alertas

    );



    return alerta;


}



/* =====================================================
   ALERTA DE ESTOQUE BAIXO
===================================================== */


function verificarEstoqueBaixo(){


    const estoque =

    listarEstoque();



    estoque.forEach(

        item=>{


            if(

                item.quantidade <=

                item.minimo

            ){


                criarAlerta(

                    "ESTOQUE",

                    "Estoque baixo",

                    item.nome

                    +

                    " está abaixo do mínimo",

                    "ALTO"

                );


            }


        }

    );


}



/* =====================================================
   ALERTA DE VALIDADE
===================================================== */


function verificarValidades(){


    const materias =

    materiasVencendo(

        30

    );



    materias.forEach(

        item=>{


            criarAlerta(

                "VALIDADE",

                "Produto próximo do vencimento",

                item.lote

                +

                " vence em "

                +

                item.validade,

                "MEDIO"

            );


        }

    );


}



/* =====================================================
   ALERTA FINANCEIRO
===================================================== */


function verificarFinanceiro(){


    const financeiro =

    buscarFinanceiro();



    financeiro.contasPagar

    .forEach(

        conta=>{


            if(!conta.pago){


                criarAlerta(

                    "FINANCEIRO",

                    "Conta pendente",

                    conta.descricao

                    +

                    " - R$ "

                    +

                    conta.valor,

                    "ALTO"

                );


            }


        }

    );


}



/* =====================================================
   EXECUTAR VERIFICAÇÕES
===================================================== */


function verificarTodosAlertas(){


    verificarEstoqueBaixo();


    verificarValidades();


    verificarFinanceiro();



    return listarAlertas();


}



/* =====================================================
   ALERTAS PENDENTES
===================================================== */


function alertasPendentes(){


    return listarAlertas()

    .filter(

        item=>

        !item.resolvido

    );


}



/* =====================================================
   RESOLVER ALERTA
===================================================== */


function resolverAlerta(id){


    const alertas =

    listarAlertas();



    const alerta =

    alertas.find(

        item=>

        item.id==id

    );



    if(!alerta){


        return false;


    }



    alerta.resolvido=true;



    salvarAlertas(

        alertas

    );



    registrarHistorico(

        "Alerta resolvido",

        alerta

    );



    return true;


}



/* =====================================================
   RESUMO DOS ALERTAS
===================================================== */


function resumoAlertas(){


    const alertas =

    alertasPendentes();



    return {


        total:

        alertas.length,


        altos:

        alertas.filter(

            item=>

            item.nivel==="ALTO"

        ).length,


        lista:

        alertas


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 32
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 33

   Sincronização e preparação para nuvem
===================================================== */


/* =====================================================
   INICIALIZAR SINCRONIZAÇÃO
===================================================== */


function iniciarSincronizacao(){


    if(!localStorage.getItem(DB.sincronizacao)){


        salvarDados(

            DB.sincronizacao,

            {


                ultimaSincronizacao:null,


                pendentes:[],


                modo:

                "OFFLINE"


            }


        );


    }


}


iniciarSincronizacao();



/* =====================================================
   BUSCAR CONFIGURAÇÃO
===================================================== */


function buscarSincronizacao(){


    return lerDados(

        DB.sincronizacao

    );


}



/* =====================================================
   SALVAR CONFIGURAÇÃO
===================================================== */


function salvarSincronizacao(dados){


    salvarDados(

        DB.sincronizacao,

        dados

    );


}



/* =====================================================
   REGISTRAR ALTERAÇÃO PENDENTE
===================================================== */


function registrarAlteracao(
modulo,
acao,
dados
){


    const sync =

    buscarSincronizacao();



    const registro = {


        id:

        Date.now(),


        modulo:

        modulo,


        acao:

        acao,


        dados:

        dados,


        data:

        new Date()

        .toISOString(),


        enviado:false


    };



    sync.pendentes.push(

        registro

    );



    salvarSincronizacao(

        sync

    );



    return registro;


}



/* =====================================================
   LISTAR PENDÊNCIAS
===================================================== */


function listarPendenciasSync(){


    return buscarSincronizacao()

    .pendentes

    .filter(

        item=>

        !item.enviado

    );


}



/* =====================================================
   MARCAR COMO SINCRONIZADO
===================================================== */


function finalizarSincronizacao(){


    const sync =

    buscarSincronizacao();



    sync.pendentes

    .forEach(

        item=>{


            item.enviado=true;


        }

    );



    sync.ultimaSincronizacao=

    new Date()

    .toISOString();



    salvarSincronizacao(

        sync

    );



    registrarHistorico(

        "Sincronização realizada",

        sync

    );



    return true;


}



/* =====================================================
   ALTERAR MODO ONLINE/OFFLINE
===================================================== */


function alterarModoSistema(
modo
){


    const sync =

    buscarSincronizacao();



    sync.modo=

    modo;



    salvarSincronizacao(

        sync

    );


}



/* =====================================================
   STATUS DA SINCRONIZAÇÃO
===================================================== */


function statusSincronizacao(){


    const sync =

    buscarSincronizacao();



    return {


        modo:

        sync.modo,


        ultima:

        sync.ultimaSincronizacao,


        pendentes:

        listarPendenciasSync()

        .length


    };


}



/* =====================================================
   BACKUP COMPLETO DO ERP
===================================================== */


function exportarBancoCompleto(){


    const banco = {


        empresa:

        lerDados(DB.empresa),


        produtos:

        lerDados(DB.produtos),


        materias:

        lerDados(DB.materias),


        estoque:

        lerDados(DB.estoque),


        producao:

        lerDados(DB.producao),


        vendas:

        lerDados(DB.vendas),


        financeiro:

        lerDados(DB.financeiro),


        historico:

        lerDados(DB.historico),


        configuracoes:

        lerDados(DB.configuracoes),


        data:

        new Date()

        .toISOString()


    };



    return JSON.stringify(

        banco,

        null,

        2

    );


}



/* =====================================================
   RESTAURAR BANCO
===================================================== */


function importarBancoCompleto(json){


    const banco =

    JSON.parse(json);



    Object.keys(banco)

    .forEach(

        chave=>{


            if(DB[chave]){


                salvarDados(

                    DB[chave],

                    banco[chave]

                );


            }


        }

    );



    registrarHistorico(

        "Banco restaurado",

        {

            data:

            new Date()

            .toISOString()

        }

    );


    return true;


}



/* =====================================================
   FIM STORAGE.JS PARTE 33
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 34

   Configurações gerais do sistema
===================================================== */


/* =====================================================
   INICIALIZAR CONFIGURAÇÕES
===================================================== */


function iniciarConfiguracoes(){


    if(!localStorage.getItem(DB.configuracoes)){


        salvarDados(

            DB.configuracoes,

            {


                empresa:{


                    nome:

                    "Carol's Gourmet",


                    telefone:

                    "",


                    endereco:

                    "",


                    logo:

                    ""

                },


                etiqueta:{


                    largura:

                    "100mm",


                    altura:

                    "50mm",


                    mostrarValidade:

                    true,


                    mostrarCodigo:

                    true


                },


                scanner:{


                    ativo:

                    true,


                    tipo:

                    "USB"


                },


                camera:{


                    ativo:

                    true,


                    origem:

                    "WEBCAM"


                },


                financeiro:{


                    margemPadrao:

                    50


                },


                sistema:{


                    unidadePadrao:

                    "UN",


                    tema:

                    "Carol's Gourmet"


                }


            }


        );


    }


}


iniciarConfiguracoes();



/* =====================================================
   BUSCAR CONFIGURAÇÕES
===================================================== */


function buscarConfiguracoes(){


    return lerDados(

        DB.configuracoes

    );


}



/* =====================================================
   SALVAR CONFIGURAÇÕES
===================================================== */


function salvarConfiguracoes(dados){


    salvarDados(

        DB.configuracoes,

        dados

    );


}



/* =====================================================
   ATUALIZAR DADOS DA EMPRESA
===================================================== */


function atualizarEmpresa(dados){


    const config =

    buscarConfiguracoes();



    config.empresa = {


        ...config.empresa,


        ...dados


    };



    salvarConfiguracoes(

        config

    );



    return config;


}



/* =====================================================
   CONFIGURAR ETIQUETA
===================================================== */


function configurarEtiqueta(dados){


    const config =

    buscarConfiguracoes();



    config.etiqueta = {


        ...config.etiqueta,


        ...dados


    };



    salvarConfiguracoes(

        config

    );


    return config.etiqueta;


}



/* =====================================================
   CONFIGURAR SCANNER
===================================================== */


function configurarScannerSistema(dados){


    const config =

    buscarConfiguracoes();



    config.scanner = {


        ...config.scanner,


        ...dados


    };



    salvarConfiguracoes(

        config

    );



    return config.scanner;


}



/* =====================================================
   CONFIGURAR CÂMERA
===================================================== */


function configurarCamera(dados){


    const config =

    buscarConfiguracoes();



    config.camera = {


        ...config.camera,


        ...dados


    };



    salvarConfiguracoes(

        config

    );



    return config.camera;


}



/* =====================================================
   ALTERAR MARGEM PADRÃO
===================================================== */


function alterarMargemPadrao(valor){


    const config =

    buscarConfiguracoes();



    config.financeiro.margemPadrao =

    Number(valor);



    salvarConfiguracoes(

        config

    );



    return valor;


}



/* =====================================================
   BUSCAR MARGEM PADRÃO
===================================================== */


function margemPadrao(){


    const config =

    buscarConfiguracoes();



    return config.financeiro.margemPadrao || 50;


}



/* =====================================================
   ALTERAR UNIDADE PADRÃO
===================================================== */


function alterarUnidadePadrao(unidade){


    const config =

    buscarConfiguracoes();



    config.sistema.unidadePadrao =

    unidade;



    salvarConfiguracoes(

        config

    );


}



/* =====================================================
   RESETAR CONFIGURAÇÕES
===================================================== */


function resetarConfiguracoes(){


    localStorage.removeItem(

        DB.configuracoes

    );


    iniciarConfiguracoes();


}



/* =====================================================
   RESUMO DO SISTEMA
===================================================== */


function resumoConfiguracoes(){


    const config =

    buscarConfiguracoes();



    return {


        empresa:

        config.empresa.nome,


        scanner:

        config.scanner.tipo,


        camera:

        config.camera.origem,


        margem:

        config.financeiro.margemPadrao,


        etiqueta:

        config.etiqueta


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 34
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 35

   Sistema profissional de etiquetas
===================================================== */


/* =====================================================
   INICIALIZAR ETIQUETAS
===================================================== */


function iniciarEtiquetas(){


    if(!localStorage.getItem(DB.etiquetas)){


        salvarDados(

            DB.etiquetas,

            []

        );


    }


}


iniciarEtiquetas();



/* =====================================================
   LISTAR ETIQUETAS
===================================================== */


function listarEtiquetas(){


    return lerDados(

        DB.etiquetas

    );


}



/* =====================================================
   SALVAR ETIQUETAS
===================================================== */


function salvarEtiquetas(lista){


    salvarDados(

        DB.etiquetas,

        lista

    );


}



/* =====================================================
   GERAR CÓDIGO DE BARRAS
===================================================== */


function gerarCodigoBarras(){


    const numero =


    Date.now()

    .toString()

    .substring(2,14);



    return numero;


}



/* =====================================================
   CRIAR ETIQUETA
===================================================== */


function criarEtiqueta(dados){


    const etiquetas =

    listarEtiquetas();



    const etiqueta = {


        id:

        gerarID(etiquetas),


        produtoId:

        dados.produtoId,


        produto:

        dados.produto,


        codigoBarras:

        dados.codigoBarras || gerarCodigoBarras(),


        lote:

        dados.lote || "",


        fabricacao:

        dados.fabricacao ||

        new Date()

        .toISOString(),


        validade:

        dados.validade || "",


        quantidade:

        Number(dados.quantidade || 1),


        preco:

        Number(dados.preco || 0),


        status:

        "CRIADA",


        criadaEm:

        new Date()

        .toISOString()


    };



    etiquetas.push(

        etiqueta

    );



    salvarEtiquetas(

        etiquetas

    );



    registrarHistorico(

        "Etiqueta criada",

        etiqueta

    );



    return etiqueta;


}



/* =====================================================
   ETIQUETA POR PRODUTO
===================================================== */


function criarEtiquetaProduto(
idProduto,
quantidade=1
){


    const produto =

    listarProdutos()

    .find(

        item =>

        item.id==idProduto

    );



    if(!produto){


        return false;


    }



    return criarEtiqueta({


        produtoId:

        produto.id,


        produto:

        produto.nome,


        codigoBarras:

        produto.codigoBarras,


        quantidade:

        quantidade,


        preco:

        produto.venda


    });


}



/* =====================================================
   BUSCAR ETIQUETA POR CÓDIGO
===================================================== */


function buscarEtiquetaCodigo(
codigo
){


    return listarEtiquetas()

    .find(

        item =>

        item.codigoBarras == codigo

    );


}



/* =====================================================
   ETIQUETAS DO PRODUTO
===================================================== */


function etiquetasProduto(
idProduto
){


    return listarEtiquetas()

    .filter(

        item =>

        item.produtoId==idProduto

    );


}



/* =====================================================
   ALTERAR STATUS IMPRESSÃO
===================================================== */


function marcarEtiquetaImpressa(id){


    const etiquetas =

    listarEtiquetas();



    const etiqueta =

    etiquetas.find(

        item =>

        item.id==id

    );



    if(!etiqueta){


        return false;


    }



    etiqueta.status=

    "IMPRESSA";



    etiqueta.impressaEm=

    new Date()

    .toISOString();



    salvarEtiquetas(

        etiquetas

    );



    registrarHistorico(

        "Etiqueta impressa",

        etiqueta

    );



    return true;


}



/* =====================================================
   ÚLTIMAS ETIQUETAS
===================================================== */


function ultimasEtiquetas(
limite=20
){


    return listarEtiquetas()

    .slice(

        -limite

    )

    .reverse();


}



/* =====================================================
   REIMPRESSÃO
===================================================== */


function reimprimirEtiqueta(id){


    const etiqueta =

    listarEtiquetas()

    .find(

        item =>

        item.id==id

    );



    if(!etiqueta){


        return false;


    }



    etiqueta.status=

    "REIMPRESSAO";



    salvarEtiquetas(

        listarEtiquetas()

    );



    return etiqueta;


}



/* =====================================================
   FIM STORAGE.JS PARTE 35
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 36

   Impressão profissional de etiquetas
===================================================== */


/* =====================================================
   INICIALIZAR FILA IMPRESSÃO
===================================================== */


function iniciarFilaImpressao(){


    if(!localStorage.getItem(DB.filaImpressao)){


        salvarDados(

            DB.filaImpressao,

            []

        );


    }


}


iniciarFilaImpressao();



/* =====================================================
   LISTAR FILA
===================================================== */


function listarFilaImpressao(){


    return lerDados(

        DB.filaImpressao

    );


}



/* =====================================================
   SALVAR FILA
===================================================== */


function salvarFilaImpressao(lista){


    salvarDados(

        DB.filaImpressao,

        lista

    );


}



/* =====================================================
   ADICIONAR ETIQUETA NA FILA
===================================================== */


function adicionarFilaImpressao(
idEtiqueta
){


    const fila =

    listarFilaImpressao();



    const etiqueta =

    listarEtiquetas()

    .find(

        item =>

        item.id==idEtiqueta

    );



    if(!etiqueta){


        return false;


    }



    fila.push({


        etiquetaId:

        etiqueta.id,


        produto:

        etiqueta.produto,


        codigo:

        etiqueta.codigoBarras,


        status:

        "AGUARDANDO"


    });



    salvarFilaImpressao(

        fila

    );



    return true;


}



/* =====================================================
   GERAR HTML DA ETIQUETA
===================================================== */


function gerarHtmlEtiqueta(id){


    const etiqueta =

    listarEtiquetas()

    .find(

        item =>

        item.id==id

    );



    if(!etiqueta){


        return "";


    }



    return `


<div class="etiqueta">


<h3>

${etiqueta.produto}

</h3>


<p>

Lote:

${etiqueta.lote || "-"}

</p>


<p>

Validade:

${etiqueta.validade || "-"}

</p>


<p>

Preço:

R$ ${etiqueta.preco.toFixed(2)}

</p>


<div class="codigo">

${etiqueta.codigoBarras}

</div>


</div>


`;


}



/* =====================================================
   IMPRIMIR ETIQUETA
===================================================== */


function imprimirEtiqueta(id){


    const html =

    gerarHtmlEtiqueta(id);



    if(!html){


        return false;


    }



    const janela =

    window.open(

        "",

        "_blank"

    );



    janela.document.write(`


<html>

<head>


<style>


.etiqueta{


width:100mm;

height:50mm;

font-family:Arial;

border:1px solid #000;

padding:5mm;

}


.codigo{


font-size:18px;

letter-spacing:3px;

margin-top:10px;


}


</style>


</head>


<body>


${html}


</body>


</html>


`);



    janela.document.close();



    janela.print();



    marcarEtiquetaImpressa(id);



    return true;


}



/* =====================================================
   FINALIZAR FILA
===================================================== */


function finalizarImpressao(idEtiqueta){


    const fila =

    listarFilaImpressao();



    const item =

    fila.find(

        item =>

        item.etiquetaId==idEtiqueta

    );



    if(!item){


        return false;


    }



    item.status=

    "IMPRESSA";



    salvarFilaImpressao(

        fila

    );



    return true;


}



/* =====================================================
   ETIQUETAS PENDENTES
===================================================== */


function etiquetasPendentesImpressao(){


    return listarFilaImpressao()

    .filter(

        item =>

        item.status==="AGUARDANDO"

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 36
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 37

   Integração de câmera e leitura visual
===================================================== */


/* =====================================================
   INICIALIZAR LEITURAS DE CÂMERA
===================================================== */


function iniciarCameraLeituras(){


    if(!localStorage.getItem(DB.cameraLeituras)){


        salvarDados(

            DB.cameraLeituras,

            []

        );


    }


}


iniciarCameraLeituras();



/* =====================================================
   LISTAR LEITURAS DA CÂMERA
===================================================== */


function listarCameraLeituras(){


    return lerDados(

        DB.cameraLeituras

    );


}



/* =====================================================
   REGISTRAR CÂMERA
===================================================== */


function registrarCamera(
nome,
tipo
){


    const config =

    buscarConfiguracoes();



    config.camera = {


        ativo:true,


        nome:nome,


        tipo:tipo


    };



    salvarConfiguracoes(

        config

    );



    return config.camera;


}



/* =====================================================
   REGISTRAR CÓDIGO DA CÂMERA
===================================================== */


function registrarLeituraCamera(
codigo
){


    const leituras =

    listarCameraLeituras();



    const leitura = {


        id:

        Date.now(),


        codigo:

        codigo,


        origem:

        "CAMERA",


        data:

        new Date()

        .toISOString()


    };



    leituras.push(

        leitura

    );



    salvarDados(

        DB.cameraLeituras,

        leituras

    );



    return leitura;


}



/* =====================================================
   PROCESSAR CÓDIGO DA CÂMERA
===================================================== */


function processarCodigoCamera(
codigo
){


    registrarLeituraCamera(

        codigo

    );



    const produto =

    buscarProdutoPorCodigo(

        codigo

    );



    if(!produto){


        return {


            encontrado:false,


            mensagem:

            "Código não cadastrado",


            codigo:

            codigo


        };


    }



    return {


        encontrado:true,


        produto:produto,


        acao:

        "SELECIONAR_PRODUTO"


    };


}



/* =====================================================
   BUSCA RÁPIDA PARA VENDA
===================================================== */


function vendaCamera(
codigo
){


    const resultado =

    processarCodigoCamera(

        codigo

    );



    if(!resultado.encontrado){


        return false;


    }



    return resultado.produto;


}



/* =====================================================
   BUSCA RÁPIDA PARA ESTOQUE
===================================================== */


function estoqueCamera(
codigo
){


    const resultado =

    processarCodigoCamera(

        codigo

    );



    if(!resultado.encontrado){


        return false;


    }



    return resultado.produto;


}



/* =====================================================
   ÚLTIMAS LEITURAS CÂMERA
===================================================== */


function ultimasLeiturasCamera(
limite=20
){


    return listarCameraLeituras()

    .slice(

        -limite

    )

    .reverse();


}



/* =====================================================
   LIMPAR HISTÓRICO CÂMERA
===================================================== */


function limparLeiturasCamera(){


    salvarDados(

        DB.cameraLeituras,

        []

    );


}



/* =====================================================
   FIM STORAGE.JS PARTE 37
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 38

   Dashboard principal
===================================================== */


/* =====================================================
   VENDAS DO DIA
===================================================== */


function vendasHoje(){


    const hoje =

    new Date()

    .toISOString()

    .substring(0,10);



    return listarVendas()

    .filter(

        venda=>{


            return venda.data

            .substring(0,10)

            ==

            hoje;


        }

    );


}



/* =====================================================
   TOTAL VENDAS HOJE
===================================================== */


function totalVendasHoje(){


    return vendasHoje()

    .reduce(

        (total,item)=>

        total +

        Number(item.total || 0),

        0

    );


}



/* =====================================================
   PRODUÇÃO HOJE
===================================================== */


function producaoHoje(){


    const hoje =

    new Date()

    .toISOString()

    .substring(0,10);



    return listarProducoes()

    .filter(

        item=>{


            return item.data

            .substring(0,10)

            ==

            hoje;


        }

    );


}



/* =====================================================
   PRODUTOS MAIS VENDIDOS
===================================================== */


function produtosMaisVendidos(
limite=5
){


    const vendas =

    listarVendas();



    const produtos = {};



    vendas.forEach(

        venda=>{


            venda.itens

            .forEach(

                item=>{


                    if(!produtos[item.nome]){


                        produtos[item.nome]=0;


                    }


                    produtos[item.nome]

                    +=

                    Number(item.quantidade);


                }

            );


        }

    );



    return Object.entries(

        produtos

    )

    .map(

        item=>{


            return {


                produto:item[0],


                quantidade:item[1]


            };


        }

    )

    .sort(

        (a,b)=>

        b.quantidade -

        a.quantidade

    )

    .slice(

        0,

        limite

    );


}



/* =====================================================
   STATUS ESTOQUE
===================================================== */


function statusEstoqueDashboard(){


    const estoque =

    relatorioEstoque();



    return {


        total:

        estoque.totalItens,


        baixo:

        estoque.baixoEstoque.length


    };


}



/* =====================================================
   STATUS FINANCEIRO
===================================================== */


function statusFinanceiroDashboard(){


    const financeiro =

    relatorioFinanceiro();



    return {


        entrada:

        financeiro.entradas,


        saida:

        financeiro.saidas,


        saldo:

        financeiro.resultado


    };


}



/* =====================================================
   STATUS ALERTAS
===================================================== */


function statusAlertasDashboard(){


    const alertas =

    resumoAlertas();



    return {


        total:

        alertas.total,


        criticos:

        alertas.altos


    };


}



/* =====================================================
   RESUMO GERAL DASHBOARD
===================================================== */


function carregarDashboard(){


    return {


        empresa:

        buscarConfiguracoes()

        .empresa

        .nome,



        vendasHoje:


        {


            quantidade:

            vendasHoje().length,


            valor:

            totalVendasHoje()


        },



        producaoHoje:


        {


            quantidade:

            producaoHoje().length


        },



        estoque:

        statusEstoqueDashboard(),



        financeiro:

        statusFinanceiroDashboard(),



        alertas:

        statusAlertasDashboard(),



        produtos:

        produtosMaisVendidos(),



        atualizado:

        new Date()

        .toISOString()


    };


}



/* =====================================================
   ATALHOS RÁPIDOS
===================================================== */


function atalhosDashboard(){


    return [


        {


            nome:

            "Novo Produto",


            acao:

            "produto"


        },


        {


            nome:

            "Nova Produção",


            acao:

            "producao"


        },


        {


            nome:

            "Criar Etiqueta",


            acao:

            "etiqueta"


        },


        {


            nome:

            "Nova Venda",


            acao:

            "venda"


        }


    ];


}



/* =====================================================
   FIM STORAGE.JS PARTE 38
===================================================== */
/* =====================================================
   CAROL'S GOURMET ERP 4.0
   STORAGE.JS - PARTE 39

   Sistema offline e segurança de dados
===================================================== */


/* =====================================================
   INICIALIZAR BACKUPS
===================================================== */


function iniciarBackups(){


    if(!localStorage.getItem(DB.backups)){


        salvarDados(

            DB.backups,

            []

        );


    }


}


iniciarBackups();



/* =====================================================
   LISTAR BACKUPS
===================================================== */


function listarBackups(){


    return lerDados(

        DB.backups

    );


}



/* =====================================================
   CRIAR BACKUP AUTOMÁTICO
===================================================== */


function criarBackupAutomatico(){


    const backup = {


        id:

        Date.now(),


        data:

        new Date()

        .toISOString(),


        banco:

        exportarBancoCompleto(),


        tamanho:

        exportarBancoCompleto()

        .length


    };



    const backups =

    listarBackups();



    backups.push(

        backup

    );



    salvarDados(

        DB.backups,

        backups

    );



    registrarHistorico(

        "Backup criado",

        {

            data:

            backup.data

        }

    );



    return backup;


}



/* =====================================================
   ÚLTIMO BACKUP
===================================================== */


function ultimoBackup(){


    return listarBackups()

    .slice(-1)[0];


}



/* =====================================================
   VERIFICAR SISTEMA
===================================================== */


function verificarIntegridade(){


    const modulos = [


        DB.produtos,


        DB.estoque,


        DB.producao,


        DB.vendas,


        DB.financeiro,


        DB.configuracoes


    ];



    const resultado = [];



    modulos.forEach(

        modulo=>{


            resultado.push({


                modulo:


                modulo,


                ativo:


                localStorage

                .getItem(modulo)

                !==

                null


            });


        }

    );



    return resultado;


}



/* =====================================================
   MODO OFFLINE
===================================================== */


function statusOffline(){


    return {


        modo:

        "OFFLINE",


        internet:

        navigator.onLine,


        banco:

        "LOCALSTORAGE",


        funcionamento:

        true


    };


}



/* =====================================================
   RESTAURAR BACKUP
===================================================== */


function restaurarBackup(id){


    const backup =

    listarBackups()

    .find(

        item =>

        item.id==id

    );



    if(!backup){


        return false;


    }



    importarBancoCompleto(

        backup.banco

    );



    registrarHistorico(

        "Backup restaurado",

        {

            id:

            id

        }

    );



    return true;


}



/* =====================================================
   LIMPAR BACKUPS ANTIGOS
===================================================== */


function limparBackupsAntigos(
quantidade=10
){


    let backups =

    listarBackups();



    if(backups.length >

    quantidade){


        backups =

        backups.slice(

            -quantidade

        );


        salvarDados(

            DB.backups,

            backups

        );


    }


}



/* =====================================================
   STATUS DE SEGURANÇA
===================================================== */


function statusSeguranca(){


    return {


        backups:

        listarBackups()

        .length,


        ultimo:

        ultimoBackup(),


        integridade:

        verificarIntegridade(),


        modo:

        statusOffline()


    };


}



/* =====================================================
   FIM STORAGE.JS PARTE 39
===================================================== */
