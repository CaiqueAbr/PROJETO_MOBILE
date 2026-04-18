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

    calcularEstatisticas();

    document.getElementById("listaAlunos").innerHTML = "";
    document.getElementById("infoSemAlunos").innerHTML = ""

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

    let mediaNotas = somaNotas / qntAlunos

    document.getElementById("totalAlunos").textContent = qntAlunos;
    document.getElementById("mediaTurma").textContent = mediaNotas.toFixed(2);
    document.getElementById("Aprovados").textContent = qntAprovados;
    document.getElementById("Reprovados").textContent = qntReprovados; 
}

function adicionarAlunos ()
{
    

    let situacao;

    alunos.forEach((aluno) => 
    {
        if (aluno.nota >= 6)
        {
           situacao = "Aprovado";
        }
        else 
        {
           situacao = "Reprovado";
        }

        document.getElementById("listaAlunos").innerHTML += 
        `<div class="alunos">
            <div class="infoNameSitu">
                <p> ${aluno.nome} </p> <p> ${situacao} </p>
            </div>
            <div class="infoIdadeNota">
                <p>Idade: ${aluno.idade} anos </p>
                <p>Nota: ${aluno.nota}</p>
            </div>
        </div>
        `;
    });
}