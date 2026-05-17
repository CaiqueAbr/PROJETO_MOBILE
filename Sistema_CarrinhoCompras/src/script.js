let formFilter = document.getElementById("formFilter");
let formProdutos = document.getElementById("formProdutos");
let listaProdCarrinho = [];

formProdutos.addEventListener("submit", (event) => {

    let produto = event.submitter;
    let divProduto = produto.closest(".divProdutos");
    let nomeProd = divProduto.querySelector(".nomeProd").textContent;
    let precoProd = divProduto.querySelector(".precoProd").textContent;

    console.log(precoProd);
    console.log(nomeProd);

    event.preventDefault();

})


