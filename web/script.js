document.addEventListener('DOMContentLoaded', function() {
    const urlAuto = 'http://localhost:3000/automovel';
    const urlEstadia = 'http://localhost:3000/estadia';
    let automovelAtual = null;
    let estadiaAtual = null;
    const automoveis = [];
    const estadias = [];

    const cadastro = document.getElementById('cadastro');
    const formCad = document.getElementById('formCad');
    const detalhes = document.getElementById('detalhes');
    const cadastroEstadia = document.getElementById('cadastroEstadia');
    const formEstadia = document.getElementById('formEstadia');
    const detalhesEstadia = document.getElementById('detalhesEstadia');

    const placa = document.getElementById('placa');
    const proprietario = document.getElementById('proprietario');
    const tipo = document.getElementById('tipo');
    const modelo = document.getElementById('modelo');
    const marca = document.getElementById('marca');
    const cor = document.getElementById('cor');
    const ano = document.getElementById('ano');
    const telefone = document.getElementById('telefone');

    const tituloAuto = document.getElementById('tituloAuto');
    const placaEdit = document.getElementById('placaEdit');
    const proprietarioEdit = document.getElementById('proprietarioEdit');
    const tipoEdit = document.getElementById('tipoEdit');
    const modeloEdit = document.getElementById('modeloEdit');
    const marcaEdit = document.getElementById('marcaEdit');
    const corEdit = document.getElementById('corEdit');
    const anoEdit = document.getElementById('anoEdit');
    const telefoneEdit = document.getElementById('telefoneEdit');

    if (document.querySelector('title').textContent.includes('Automóveis')) {
        carregarAutomoveis();

        ano?.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        anoEdit?.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        formCad?.addEventListener('submit', function (e) {
            e.preventDefault();
            const novoAuto = {
                placa: placa.value.toUpperCase(),
                proprietario: proprietario.value,
                tipo: tipo.value,
                modelo: modelo.value,
                marca: marca.value || null,
                cor: cor.value || null,
                ano: ano.value ? Number(ano.value) : null,
                telefone: telefone.value
            };

            fetch(urlAuto + '/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoAuto)
            })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw err });
                return res.json();
            })
            .then(() => {
                alert("Automóvel adicionado com sucesso!");
                cadastro.classList.add('oculto');
                formCad.reset();
                carregarAutomoveis();
            })
            .catch(err => alert(err.error || "Erro ao salvar automóvel"));
        });
    }

    function carregarAutomoveis() {
        fetch(urlAuto + '/listar')
            .then(res => res.json())
            .then(data => {
                automoveis.length = 0;
                automoveis.push(...data);
                listarAutomoveis();
            })
            .catch(() => alert('Problemas com a conexão da API'));
    }

    function listarAutomoveis() {
        const container = document.querySelector('main');
        container.innerHTML = '';

        if (automoveis.length === 0) {
            container.innerHTML = '<div class="msg-vazia"><p>Nenhum veículo cadastrado.</p></div>';
            return;
        }

        automoveis.forEach(auto => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <h3>${auto.placa}</h3>
                <p><b>Modelo:</b> ${auto.modelo}</p>
                <p><b>Proprietário:</b> ${auto.proprietario}</p>
                <p><b>Tipo:</b> ${auto.tipo}</p>
                <p><b>Marca:</b> ${auto.marca || '-'}</p>
                <p><b>Cor:</b> ${auto.cor || '-'}</p>
            `;
            card.onclick = () => abrirAutomovel(auto);
            container.appendChild(card);
        });
    }

    function abrirAutomovel(auto) {
        automovelAtual = auto;
        tituloAuto.innerHTML = auto.placa;
        placaEdit.value = auto.placa;
        proprietarioEdit.value = auto.proprietario;
        tipoEdit.value = auto.tipo;
        modeloEdit.value = auto.modelo;
        marcaEdit.value = auto.marca || '';
        corEdit.value = auto.cor || '';
        anoEdit.value = auto.ano || '';
        telefoneEdit.value = auto.telefone;
        detalhes.classList.remove('oculto');
    }

    window.salvarEdicao = function() {
        const autoEditado = {
            proprietario: proprietarioEdit.value,
            tipo: tipoEdit.value,
            modelo: modeloEdit.value,
            marca: marcaEdit.value || null,
            cor: corEdit.value || null,
            ano: anoEdit.value ? Number(anoEdit.value) : null,
            telefone: telefoneEdit.value
        };

        fetch(urlAuto + '/atualizar/' + automovelAtual.placa, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(autoEditado)
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            alert("Automóvel atualizado com sucesso!");
            detalhes.classList.add('oculto');
            carregarAutomoveis();
        })
        .catch(() => alert("Erro ao editar automóvel"));
    }

    window.excluirAutomovel = function() {
        if (!confirm("Deseja excluir o automóvel?")) return;
        
        fetch(urlAuto + '/excluir/' + automovelAtual.placa, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw err });
            return res.json();
        })
        .then(() => {
            alert("Automóvel excluído com sucesso!");
            detalhes.classList.add('oculto');
            carregarAutomoveis();
        })
        .catch(err => alert(err.error || "Erro ao excluir automóvel"));
    }

    if (document.querySelector('title').textContent.includes('Estadias')) {
        carregarEstadias();
        carregarPlacasSelect();

        formEstadia?.addEventListener('submit', function (e) {
            e.preventDefault();
            const novaEstadia = {
                placa: placaEstadia.value,
                valorHora: Number(valorHora.value)
            };

            fetch(urlEstadia + '/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaEstadia)
            })
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw err });
                return res.json();
            })
            .then(() => {
                alert("Entrada registrada com sucesso!");
                cadastroEstadia.classList.add('oculto');
                formEstadia.reset();
                carregarEstadias();
            })
            .catch(err => alert(err.error || "Erro ao registrar entrada"));
        });
    }

    function carregarEstadias() {
        fetch(urlEstadia + '/listar')
            .then(res => res.json())
            .then(data => {
                estadias.length = 0;
                estadias.push(...data);
                listarEstadias();
            })
            .catch(() => alert('Erro ao carregar estadias'));
    }

    function listarEstadias() {
        const container = document.getElementById('mainEstadias');
        container.innerHTML = '';

        if (estadias.length === 0) {
            container.innerHTML = '<div class="msg-vazia"><p>Nenhuma estadia registrada.</p></div>';
            return;
        }

        estadias.forEach(est => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            const status = est.saida ? 'Finalizada' : 'Ativa';
            const entrada = new Date(est.entrada).toLocaleString('pt-BR');

            card.innerHTML = `
                <h3>${est.placa}</h3>
                <p><b>Modelo:</b> ${est.automovel.modelo}</p>
                <p><b>Entrada:</b> ${entrada}</p>
                <p><b>Valor/Hora:</b> R$ ${est.valorHora.toFixed(2)}</p>
                <p><b>Status:</b> ${status}</p>
                ${est.valorTotal ? `<p><b>Total:</b> R$ ${est.valorTotal.toFixed(2)}</p>` : ''}
            `;
            card.onclick = () => abrirEstadia(est);
            container.appendChild(card);
        });
    }

    function carregarPlacasSelect() {
        fetch(urlAuto + '/listar')
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById('placaEstadia');
                if (!select) return;
                
                select.innerHTML = '<option value="">Selecione...</option>';
                data.forEach(auto => {
                    const opt = document.createElement('option');
                    opt.value = auto.placa;
                    opt.textContent = `${auto.placa} - ${auto.modelo}`;
                    select.appendChild(opt);
                });
            });
    }

    window.abrirEstadia = function(est) {
        estadiaAtual = est;
        tituloEstadia.innerHTML = `Estadia #${est.id}`;
        estPlaca.value = est.placa;
        estProprietario.value = est.automovel.proprietario;
        estEntrada.value = new Date(est.entrada).toLocaleString('pt-BR');
        estSaida.value = est.saida ? new Date(est.saida).toLocaleString('pt-BR') : '-';
        estValorHora.value = 'R$ ' + est.valorHora.toFixed(2);
        estValorTotal.value = est.valorTotal ? 'R$ ' + est.valorTotal.toFixed(2) : '-';
        
        document.getElementById('btnFinalizar').style.display = est.saida ? 'none' : 'inline-block';
        detalhesEstadia.classList.remove('oculto');
    }

    window.finalizarEstadia = function() {
        if (!confirm("Deseja finalizar esta estadia?")) return;
        
        fetch(urlEstadia + '/atualizar/' + estadiaAtual.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then((data) => {
            alert(`Estadia finalizada! Total: R$ ${data.valorTotal.toFixed(2)}`);
            detalhesEstadia.classList.add('oculto');
            carregarEstadias();
        })
        .catch(() => alert("Erro ao finalizar estadia"));
    }

    window.excluirEstadia = function() {
        if (!confirm("Deseja excluir esta estadia?")) return;
        
        fetch(urlEstadia + '/excluir/' + estadiaAtual.id, {
            method: 'DELETE'
        })
        .then(() => {
            alert("Estadia excluída com sucesso!");
            detalhesEstadia.classList.add('oculto');
            carregarEstadias();
        })
        .catch(() => alert("Erro ao excluir estadia"));
    }

});