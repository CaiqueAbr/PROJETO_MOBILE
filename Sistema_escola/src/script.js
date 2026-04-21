const form = document.getElementById("form");

let alunos = [];

form.addEventListener("submit", function(evento)
{
    evento.preventDefault()

    const aluno = {
        nome: document.getElementById("nomeAluno").value,
        idade: Number(document.getElementById("idadeAluno").value),
        nota: Number(document.getElementById("notaAluno").value),
    };
    
    alunos.push(aluno);

    document.getElementById("listaAlunos").innerHTML = "";
    document.getElementById("infoSemAlunos").innerHTML = "";
    
    calcularEstatisticas();

    adicionarAlunos ();

    form.reset();

});

function calcularEstatisticas ()
{
    let qntAlunos = alunos.length;
    let somaNotas = 0;
    let qntAprovados = 0;
    let qntReprovados = 0;

    alunos.forEach((aluno) => {
        somaNotas += aluno.nota;

        if (aluno.nota >= 6)
        {
            qntAprovados += 1;
        }
        else {
            qntReprovados += 1
        }
    });
    if (qntAlunos > 0)
    {
        let mediaNotas = somaNotas / qntAlunos;
        document.getElementById("mediaTurma").textContent = mediaNotas.toFixed(2);
    }
    else
    {
        document.getElementById("mediaTurma").textContent = "0.00";
    }
    document.getElementById("totalAlunos").textContent = qntAlunos;
    document.getElementById("Aprovados").textContent = qntAprovados;
    document.getElementById("Reprovados").textContent = qntReprovados; 
}

function adicionarAlunos ()
{
    let situacao;

    alunos.forEach((aluno, index) => 
    {
        if (aluno.nota >= 6)
        {
           situacao = "Aprovado";

           document.getElementById("listaAlunos").innerHTML += 
           `<div class="alunos">

                <div class="infoAlunos">
                    <div class="infoNameSitu">
                        <p> ${aluno.nome} </p> 
                        <div class="sitBoxApr"> 
                            <p> <i class="fa-regular fa-circle-check"></i>${situacao}</p> 
                        </div>
                    </div>
        
                    <div class="infoIdadeNota">
                        <p>Idade:</p> 
                        <p class="resulIdade">${aluno.idade} anos </p>
                        <p>Nota:</p> 
                        <p class="resulNotaApr"> ${aluno.nota}</p>
                    </div>
                </div>
                
            <div class="buttonsAluno">
                <button onclick="modalDescAluno(${index})" class="btnDescAluno"> <i class="fa-solid fa-circle-info"></i></button>
                <button onclick="removerAluno(${index})" class="btnExcAluno"> <i class="fa-solid fa-trash-can"></i></button>
            </div>


           </div>`;
        }
        else 
        {
           situacao = "Reprovado";

           document.getElementById("listaAlunos").innerHTML += 
           `<div class="alunos">

               <div class="infoAlunos">

                   <div class="infoNameSitu">
                       <p> ${aluno.nome} </p>
                       <div class="sitBoxRep">
                           <p><i class="fa-regular fa-circle-xmark"></i>${situacao}</p>
                       </div>
                   </div>
                   <div class="infoIdadeNota">
                       <p>Idade:</p>
                       <p class="resulIdade">${aluno.idade} anos </p>
                       <p>Nota:</p>
                       <p class="resulNotaRep"> ${aluno.nota}</p>
                   </div>

                </div>

            <div class="buttonsAluno">

                <button 
                onclick="modalDescAluno(${index})" 
                class="btnDescAluno"> 
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                
                <button onclick="removerAluno(${index})" class="btnExcAluno"> <i class="fa-solid fa-trash-can"></i> </button>
            </div>


           </div>`;
        }
    });
}

function removerAluno (index)
{
    alunos.splice(index, 1);

    document.getElementById("listaAlunos").innerHTML = "";

    if (alunos.length === 0)
    {
        document.getElementById("infoSemAlunos").innerHTML = 
        `
        <i class="fa-solid fa-user-group"></i>
        <h2>Nenhum aluno cadastrado ainda.</h2>
        <p>Cadastre o primeiro aluno usando o formulário ao lado.</p>
        `
    }

    adicionarAlunos();
    calcularEstatisticas();
}

function modalDescAluno(index)
{
    const aluno = alunos[index];
    const situacao = aluno.nota >= 6 ? "Aprovado" : "Reprovado";

    document.getElementById("modalNome").textContent = aluno.nome;
    document.getElementById("modalIdade").textContent = aluno.idade + " anos";
    document.getElementById("modalNota").textContent = aluno.nota;
    document.getElementById("modalSituacao").textContent = situacao;

    document.getElementById("modalOverlay").classList.add("ativo");
}

function fecharModal()
{
    document.getElementById("modalOverlay").classList.remove("ativo");
}