function salvarDados(produtos){

localStorage.setItem(
"carol_produtos",
JSON.stringify(produtos)
);

}


function carregarDados(){

return JSON.parse(
localStorage.getItem("carol_produtos")
) || [];

}
