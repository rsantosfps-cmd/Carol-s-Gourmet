<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Carol's Gourmet Manager</title>

<link rel="stylesheet" href="css/style.css">

<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>

</head>

<body>

<header>
<h1>Carol's Gourmet Manager</h1>
<p>Sistema de produtos e etiquetas</p>
</header>


<section class="card">

<h2>Cadastrar Produto</h2>


<input id="nome" placeholder="Nome do produto">

<input id="preco" placeholder="Preço">

<input id="quantidade" placeholder="Quantidade">


<button onclick="salvarProduto()">
Cadastrar
</button>


</section>


<section class="card">

<h2>Produtos cadastrados</h2>

<table>

<thead>

<tr>

<th>Produto</th>
<th>Preço</th>
<th>Código</th>
<th>Etiqueta</th>

</tr>

</thead>


<tbody id="listaProdutos">

</tbody>


</table>


</section>



<script src="js/storage.js"></script>

<script src="js/barcode.js"></script>

<script src="js/app.js"></script>


</body>
</html>
