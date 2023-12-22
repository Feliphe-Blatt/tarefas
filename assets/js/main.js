function escopo() {
    /////////////////////////////////////////////////////////////////////////// Salva tarefas na memória do navegador e caso haja 
    function salvaTarefas(a) {
        const tarefasJSON = JSON.stringify(a);
        localStorage.setItem('tarefas', tarefasJSON);
    }

    function pegaTarefasSalvas(a) {
        const temp = localStorage.getItem('tarefas');
        const listaDeTarefas = JSON.parse(temp);
        for (i in listaDeTarefas) {
            a.push(listaDeTarefas[i]);
        }
    }

    function atualizaLista(a) {
        corpo.innerHTML = listaPadrao;

        for (let i = 0; i < a.length; i++) {
            escreveTarefa(a[i], i);
        }
    }

    /////////////////////////////////////////////////////////////////////////// Alternam visão dos elementos html
    function alternaLista() {
        if (flagLista) {

            lista.style.opacity = 0;
            flagLista = false;
            lista.style.visibility = 'hidden';

            corpo.innerHTML = listaPadrao;

        } else {
            atualizaLista(tarefas);

            lista.style.opacity = 1;
            flagLista = true;
            lista.style.visibility = 'visible';
        }
    }

    function alternaEdit() {
        if (flagEdit) {

            edit.style.opacity = 0;
            edit.style.visibility = 'hidden';
            flagEdit = false;

        } else {
            edit.style.opacity = 1;
            edit.style.visibility = 'visible';
            flagEdit = true;
        }
    }

    ///////////////////////////////////////////////////////////////////////////  Escrevendo tarefa no documento html
    function escreveTarefa(tarefa, i) {

        if (typeof i === 'undefined') i = 'x';  //  Definindo valor padrão para 'i' caso não seja passado valor

        const tableRoll = document.createElement('tr');
        tableRoll.innerHTML = `
        <td>
            <h1 class="listItem" id="item-${i}">
                ${tarefa}
            </h1>
        </td>
        <td>
            <button class="list-edit" id="btn-edit-${i}" title="Editar a tarefa">Editar</button>
            <button class="list-erase" id="btn-erase-${i}" title="Apagar a tarefa">Apagar</button>
        </td>
        `;
        corpo.appendChild(tableRoll);
    }

    /////////////////////////////////////////////////////////////////////////// Adiciona a tarefa

    function limpaInput() {
        tarefaParaAdd.value = '';
        tarefaParaAdd.focus();
    }

    function addTarefa(tarefa, flagLista) {

        if (flagLista) {
            escreveTarefa(tarefa, tarefas.length);
        }
        tarefas.push(tarefa);
        limpaInput();
    }

    /////////////////////////////////////////////////////////////////////////// Apaga a tarefa
    function apagarTarefa(element) {

        const botoes = element.parentElement;  // Remove da lista no documento HTML
        botoes.parentElement.remove();

        let idTarefa = element.id.replace('btn-erase-', '');  // Seleciona e separa index
        const itemRemovido = tarefas.splice(idTarefa, 1);
        return itemRemovido;
    }

    /////////////////////////////////////////////////////////////////////////// Substitui a tarefa a editar
    function pegaTarefaParaEditar(element) {
        let idTarefa = element.id.replace('btn-edit-', '');  // Seleciona e separa index
        tarefaParaEditar.value = tarefas[idTarefa];
        return idTarefa;
    }

    function editaBotao(element, texto) {
        const i = pegaTarefaParaEditar(element);
        const temp = document.querySelector(`#btn-edit-${i}`);
        temp.innerHTML = texto;
    }

    function verificaEdit(element) {
        if (flagEdit) {
            if (idAnterior === element.id) {
                alternaEdit();
                editaBotao(element, 'Editar');
            } else {
                const botaoAnterior = document.querySelector(`#${idAnterior}`);
                botaoAnterior.innerHTML = "Editar";
                editaBotao(element, 'Cancelar');
            }
        } else {
            alternaEdit();
            editaBotao(element, 'Cancelar');
        }
    }

    function editaTarefa(tarefaEditada) {
        const temp = idAnterior.replace('btn-edit-', '');
        tarefas[temp] = tarefaEditada;
    }

    ///////////////////////////////////////////////////////////////////////////  Variáveis e eventos

    const lista = document.querySelector('#list');
    const edit = document.querySelector('#edit');
    const tarefaParaAdd = document.querySelector('#task-to-add');
    const tarefaParaEditar = document.querySelector('#task-to-edit');
    const corpo = document.querySelector('#lista-de-tarefas');

    let flagLista = false;
    let flagEdit = false;
    let idAnterior = 'x';

    const listaPadrao = `
        <tr>
            <td>
                <h1 class="listItem" id="item-x">
                    Exemplo de tarefa
                </h1>
            </td>
            <td>
                <button class="list-edit" id="btn-edit-x" title="Editar a tarefa">Editar</button>
                <button class="list-erase" id="btn-erase-x" title="Apagar a tarefa">Apagar</button>
            </td>
        </tr>
    `;

    let tarefas = [];
    pegaTarefasSalvas(tarefas);
    console.log('Tarefas que já estavam salvas:\n->', tarefas);

    tarefaParaAdd.addEventListener('keypress', function (e) {  // Quando 'enter' for pressionado na adição da tarefa
        if (e.keyCode === 13) {
            if (!tarefaParaAdd.value) return;
            addTarefa(tarefaParaAdd.value, flagLista);
            salvaTarefas(tarefas);
        }
    });
    tarefaParaEditar.addEventListener('keypress', function (e) {  // Quando 'enter' for pressionado na edição da tarefa
        if (e.keyCode === 13) {
            if (!tarefaParaEditar.value) return;
            editaTarefa(tarefaParaEditar.value);
            salvaTarefas(tarefas);
            if (flagLista) atualizaLista(tarefas);
            alternaEdit();
        }
    });


    document.addEventListener('click', function (event) {
        const element = event.target;

        if (element.classList.contains('add-tarefa')) {  // Adição de tarefa
            if (!tarefaParaAdd.value) return;
            addTarefa(tarefaParaAdd.value, flagLista);
            salvaTarefas(tarefas);
        }
        if (element.classList.contains('edit-tarefa')) {  // Botão para de fato editar
            if (!tarefaParaEditar.value) return;
            editaTarefa(tarefaParaEditar.value);
            salvaTarefas(tarefas);
            if (flagLista) atualizaLista(tarefas);
            alternaEdit();
        }
        if (element.classList.contains('list-alt')) {  // Alternar visão da lista
            alternaLista(tarefas);
        }
        if (element.classList.contains('list-edit')) {  // Alterna visão da edição da tarefa
            if (element.id === 'btn-edit-x') return;  //  Nada acontece com o Exemplo de tarefa
            verificaEdit(element);
            idAnterior = element.id;
        }
        if (element.classList.contains('list-erase')) {  // Apagar tarefa
            if (element.id === 'btn-erase-x') return;  //  Nada acontece com o Exemplo de tarefa
            if (flagEdit === true) alternaEdit();
            apagarTarefa(element);
            salvaTarefas(tarefas);
            atualizaLista(tarefas);
        }
    });
}
escopo();
