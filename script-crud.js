var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var estadoInicial = {
    tarefas: [
        {
            descricao: "Tarefa concluída",
            concluida: true,
        },
        {
            descricao: "Tarefa pendente 1",
            concluida: false,
        },
        {
            descricao: "Tarefa pendente 2",
            concluida: false,
        },
    ],
    tarefaSelecionada: null,
    editando: false,
};
var selecionarTarefa = function (estado, tarefa) {
    return __assign(__assign({}, estado), { tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa });
};
var adicionarTarefa = function (estado, tarefa) {
    return __assign(__assign({}, estado), { tarefas: __spreadArray(__spreadArray([], estado.tarefas, true), [tarefa], false) });
};
// Deleta uma tarefa. Retorna um novo estado.
var deletar = function (estado) {
    if (estado.tarefaSelecionada) {
        var tarefas = estado.tarefas.filter(function (t) { return t != estado.tarefaSelecionada; });
        return __assign(__assign({}, estado), { tarefas: tarefas, tarefaSelecionada: null, editando: false });
    }
    else {
        return estado;
    }
};
// Deleta todas as tarefas. Retorna um novo estado.
var deletarTodas = function (estado) {
    return __assign(__assign({}, estado), { tarefas: [], tarefaSelecionada: null, editando: false });
};
// Deleta todas as tarefas concluídas. Retorna um novo estado.
var deletarTodasConcluidas = function (estado) {
    var tarefas = estado.tarefas.filter(function (t) { return !t.concluida; });
    return __assign(__assign({}, estado), { tarefas: tarefas, tarefaSelecionada: null, editando: false });
};
// Modifica o estado para entrar no modo de edição. Retorna um novo estado.
var editarTarefa = function (estado, tarefa) {
    return __assign(__assign({}, estado), { editando: !estado.editando, tarefaSelecionada: tarefa });
};
var atualizarUI = function () {
    var taskIconSvg = "\n      <svg class=\"app__section-task-icon-status\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n          fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n          <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#FFF\" />\n          <path\n              d=\"M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z\"\n              fill=\"#01080E\" />\n      </svg>\n  ";
    var ulTarefas = document.querySelector(".app__section-task-list");
    var formAdicionarTarefa = document.querySelector(".app__form-add-task");
    var btnAdicionarTarefa = document.querySelector(".app__button--add-task");
    var textarea = document.querySelector(".app__form-textarea");
    var labelTarefaAtiva = document.querySelector(".app__section-active-task-description");
    var btnCancelar = document.querySelector(".app__form-footer__button--cancel");
    var btnDeletar = document.querySelector(".app__form-footer__button--delete");
    var btnDeletarConcluidas = document.querySelector("#btn-remover-concluidas");
    var btnDeletarTodas = document.querySelector("#btn-remover-todas");
    labelTarefaAtiva.textContent = estadoInicial.tarefaSelecionada
        ? estadoInicial.tarefaSelecionada.descricao
        : null;
    if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
        formAdicionarTarefa.classList.remove("hidden");
        textarea.value = estadoInicial.tarefaSelecionada.descricao;
    }
    else {
        formAdicionarTarefa.classList.add("hidden");
        textarea.value = "";
    }
    if (!btnAdicionarTarefa) {
        throw Error("Caro colega, o elemento btnAdicionarTarefa não foi encontrado. Favor rever.");
    }
    btnAdicionarTarefa.onclick = function () {
        formAdicionarTarefa === null || formAdicionarTarefa === void 0 ? void 0 : formAdicionarTarefa.classList.toggle("hidden");
    };
    formAdicionarTarefa.onsubmit = function (evento) {
        evento.preventDefault();
        var descricao = textarea.value;
        estadoInicial = adicionarTarefa(estadoInicial, {
            descricao: descricao,
            concluida: false,
        });
        atualizarUI();
    };
    btnCancelar.onclick = function () {
        formAdicionarTarefa.classList.add("hidden");
    };
    btnDeletar.onclick = function () {
        estadoInicial = deletar(estadoInicial);
        formAdicionarTarefa.classList.add("hidden");
        atualizarUI();
    };
    btnDeletarConcluidas.onclick = function () {
        estadoInicial = deletarTodasConcluidas(estadoInicial);
        atualizarUI();
    };
    btnDeletarTodas.onclick = function () {
        estadoInicial = deletarTodas(estadoInicial);
        atualizarUI();
    };
    if (ulTarefas) {
        ulTarefas.innerHTML = "";
    }
    estadoInicial.tarefas.forEach(function (tarefa) {
        var li = document.createElement("li");
        li.classList.add("app__section-task-list-item");
        var svgIcon = document.createElement("svg");
        svgIcon.innerHTML = taskIconSvg;
        var paragraph = document.createElement("p");
        paragraph.classList.add("app__section-task-list-item-description");
        paragraph.textContent = tarefa.descricao;
        var button = document.createElement("button");
        button.classList.add("app_button-edit");
        var editIcon = document.createElement("img");
        editIcon.setAttribute("src", "/imagens/edit.png");
        button.appendChild(editIcon);
        if (tarefa.concluida) {
            button.setAttribute("disabled", "true");
            li.classList.add("app__section-task-list-item-complete");
        }
        if (tarefa == estadoInicial.tarefaSelecionada) {
            li.classList.add("app__section-task-list-item-active");
        }
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);
        li.addEventListener("click", function () {
            console.log("A tarefa foi clicada", tarefa);
            estadoInicial = selecionarTarefa(estadoInicial, tarefa);
            atualizarUI();
        });
        // Adicionar evento de clique para editar uma tarefa
        editIcon.onclick = function (evento) {
            evento.stopPropagation();
            estadoInicial = editarTarefa(estadoInicial, tarefa);
            atualizarUI();
        };
        ulTarefas === null || ulTarefas === void 0 ? void 0 : ulTarefas.appendChild(li);
    });
};
document.addEventListener("TarefaFinalizada", function () {
    if (estadoInicial.tarefaSelecionada) {
        estadoInicial.tarefaSelecionada.concluida = true;
        atualizarUI();
    }
});
atualizarUI();
