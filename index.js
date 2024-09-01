let nomes = JSON.parse(localStorage.getItem('nomes')) || [];
let nome = document.getElementById('nome');
let telefone = document.getElementById('telefone');
let email = document.getElementById('email');
let sexo = document.getElementById('sexo');
let data = document.getElementById('data');
let senha = document.getElementById('senha');
let id_tmp = document.getElementById('id_tmp');

let btn_cadastrar = document.getElementById('btn_cadastrar');
let Masculino = parseInt(localStorage.getItem('Masculino')) || 0;
let Feminino = parseInt(localStorage.getItem('Feminino')) || 0;
let Outro = parseInt(localStorage.getItem('Outro')) || 0;
let Prefiro_nao_dizer = parseInt(localStorage.getItem('Prefiro_nao_dizer')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    atualizar_lista();
    drawChart();
});

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault();

    if (nome.value == "" || telefone.value == "" || email.value == "" || sexo.value == "" || data.value == "" || senha.value == "") {
        let msg = document.getElementById('mensagens');
        msg.classList.remove('d-none');
        setTimeout(() => {
            msg.classList.add('d-none');
        }, 3000);
    } else {
        if (id_tmp.value == "") {
            nomes.push([nome.value, telefone.value, email.value, sexo.value, data.value, senha.value]);
            atualizarContagemGenero(sexo.value, 1);
        } else {
            atualizarContagemGenero(nomes[id_tmp.value][3], -1);
            atualizarContagemGenero(sexo.value, 1);

            nomes[id_tmp.value][0] = nome.value;
            nomes[id_tmp.value][1] = telefone.value;
            nomes[id_tmp.value][2] = email.value;
            nomes[id_tmp.value][3] = sexo.value;
            nomes[id_tmp.value][4] = data.value;
            nomes[id_tmp.value][5] = senha.value;
        }
        atualizar_lista();
        salvarDados();
        resetForm();
        drawChart();
    }
});

function atualizarContagemGenero(sexo, valor) {
    if (sexo === "Masculino") Masculino += valor;
    else if (sexo === "Feminino") Feminino += valor;
    else if (sexo === "Outro") Outro += valor;
    else if (sexo === "Prefiro nao dizer") Prefiro_nao_dizer += valor;
}

function resetForm() {
    nome.value = "";
    telefone.value = "";
    email.value = "";
    sexo.value = "";
    data.value = "";
    senha.value = "";
}

function atualizar_lista() {
    let lista = document.getElementById('lista');
    lista.innerHTML = "";
    nomes.forEach((nm, index) => {
        lista.innerHTML += `
    <tr>
    <td>${nm[0]}</td>
    <td>${nm[1]}</td>
    <td>${nm[2]}</td>
    <td>${nm[3]}</td>
    <td>${nm[4]}</td>
    <td>${nm[5]}</td>
    <td>
    <button class="btn btn-warning" onclick="editar(${index})"><i class="bi bi-pencil-square"></i></button>
    <button class="btn btn-danger" onclick="apagar(${index})"><i class="bi bi-trash3"></i></button>
    </td>
    </tr>`;
    });
    id_tmp.value = "";
}

function editar(indice) {
    nome.value = nomes[indice][0];
    telefone.value = nomes[indice][1];
    email.value = nomes[indice][2];
    sexo.value = nomes[indice][3];
    data.value = nomes[indice][4];
    senha.value = nomes[indice][5];
    btn_cadastrar.classList.remove('btn-warning');
    btn_cadastrar.classList.add('btn-info');
    id_tmp.value = indice;
}

function apagar(indice) {
    let confirmacao = confirm('Deseja apagar o item "' + nomes[indice][0] + '"?');
    if (confirmacao) {
        atualizarContagemGenero(nomes[indice][3], -1);
        nomes.splice(indice, 1);
        atualizar_lista();
        salvarDados();
        drawChart();
    } else {
        alert("Exclusão cancelada");
    }
}

function salvarDados() {
    localStorage.setItem('nomes', JSON.stringify(nomes));
    localStorage.setItem('Masculino', Masculino);
    localStorage.setItem('Feminino', Feminino);
    localStorage.setItem('Outro', Outro);
    localStorage.setItem('Prefiro_nao_dizer', Prefiro_nao_dizer);
}

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Gênero', 'Quantidade'],
        ['Masculino', Masculino],
        ['Feminino', Feminino],
        ['Outro', Outro],
        ['Prefiro nao dizer', Prefiro_nao_dizer]
    ]);

    var options = {
        title: 'Distribuição de Gênero'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
