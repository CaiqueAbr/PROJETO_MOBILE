let formFilter = document.getElementById("formFilter");
let formProdutos = document.getElementById("formProdutos");

let listaProdCarrinho = JSON.parse(localStorage.getItem("listaProdCarrinho")) || [];

formFilter.addEventListener("submit", (event) =>{

    let selectFilter = document.getElementById("selectFilter");
    let valueOption = selectFilter.value;

    let todosProdutos = document.querySelectorAll(".divProdutos");

    
    if (valueOption === "ate 50") {

        todosProdutos.forEach(i => {
            let precoProd = i.querySelector(".precoProd").textContent;

            if (parseFloat(precoProd) > 50){
                i.style.display = "none";
            }
            else {
                i.style.display = "block";
            }
        })  
    }
    else if (valueOption === "acima 50") {
            todosProdutos.forEach(i => {
                let precoProd = i.querySelector(".precoProd").textContent;

                if (parseFloat(precoProd) <= 50){
                    i.style.display = "none";
                }
                else {
                    i.style.display = "block";
                }
            })
    }
    else {
        todosProdutos.forEach (i => {
            i.style.display = "block";
        })
    }
    

    event.preventDefault();
})

formProdutos.addEventListener("submit", (event) => {

    let produto = event.submitter;
    let divProduto = produto.closest(".divProdutos");
    let nomeProd = divProduto.querySelector(".nomeProd").textContent;
    let precoProd = divProduto.querySelector(".precoProd").textContent;

    let produtoExistente = listaProdCarrinho.find(item => item.nome === nomeProd);
    if (produtoExistente) {
       produtoExistente.quantidade += 1; 
    }

    else {

        let objProduto = 
        {
            nome: nomeProd,
            preco: parseFloat(precoProd),
            quantidade: 1
        };
        listaProdCarrinho.push(objProduto);
    }

    let jsonListaProdCarrinho = JSON.stringify(listaProdCarrinho);
    
    localStorage.setItem("listaProdCarrinho", jsonListaProdCarrinho);
    
    event.preventDefault();
})

let btnCart = document.getElementById("btnCart");
let modalCart = document.getElementById("modalCart");
let btnFecharCart = document.getElementById("btnFecharModal");
let cartItens = document.getElementById("cartItens");
let cartVazio = document.getElementById("cartVazio");
let cartRodape = document.getElementById("cartRodape");
let cartTotalNum = document.getElementById("totalNum");

btnCart.addEventListener("click", () => {
    
    abrirModal();
})

btnFecharCart.addEventListener("click", () =>{
    modalCart.close();
    
    cartItens.innerHTML = "";
    cartVazio.style.display = "flex";
    cartRodape.style.display = "none"
    
})

function abrirModal() {
    
    modalCart.showModal();
    
    if (listaProdCarrinho.length > 0){
        cartVazio.style.display = "none";
        cartRodape.style.display = "flex";
    }
    else {
        cartVazio.style.display = "flex";
        cartRodape.style.display = "none";
    }
    
    let precoTotal = 0;
    
    listaProdCarrinho.forEach((index, i) => {
        
        let nomeProd = index.nome;
        let qntProd = index.quantidade;
        let precoProd = index.preco;
        
        precoTotal += qntProd * parseFloat(precoProd);
        
        
        cartItens.innerHTML += `
        <div class="itemCart">
        <div class="itemInfo">
        <p class="itemNome">${nomeProd}</p>
        <p class="itemPrecoUnit">${precoProd}</p>
        </div>
        <div class="itemControles">
        <button class="btnQtd" onclick="diminuirQuantidade(${i})">−</button>
        <span class="itemQtd">${qntProd}</span>
        <button class="btnQtd" onclick="aumentarQuantidade(${i})">+</button>
        </div>
        <div class="itemDireita">
        <p class="itemPrecoTotal">${precoProd}</p>
        <button class="btnRemover" onclick="removerProduto(${i})">🗑 REMOVER</button>
        </div>
        </div>
        `
    });
    cartTotalNum.innerHTML = precoTotal.toFixed(2);

    let jsonListaProdCarrinho = JSON.stringify(listaProdCarrinho);
    
    localStorage.setItem("listaProdCarrinho", jsonListaProdCarrinho);
}

function diminuirQuantidade(i) {
    listaProdCarrinho[i].quantidade -= 1;

    if(listaProdCarrinho[i].quantidade == 0){
        listaProdCarrinho.splice(i, 1);
    }

    cartItens.innerHTML = "";
    abrirModal();
}
function aumentarQuantidade(i) {
    listaProdCarrinho[i].quantidade += 1;
    
    cartItens.innerHTML = "";
    abrirModal();
}
function removerProduto(i) {
    listaProdCarrinho.splice(i, 1)

    cartItens.innerHTML = "";
    abrirModal();
}



