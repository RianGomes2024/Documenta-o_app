 const telaLogin = document.getElementById('telaLogin');
    const telaCadastroUsuario = document.getElementById('telaCadastroUsuario');
    const telaSistema = document.getElementById('telaSistema');
    const form = document.getElementById('formVeiculo');
    const lista = document.getElementById('listaVeiculos');

    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  
    function logar() {
      const user = document.getElementById('loginUsuario').value;
      const senha = document.getElementById('loginSenha').value;
      const existe = usuarios.find(u => u.usuario === user && u.senha === senha);
      if (existe) {
        mostrarSistema();
      } else {
        alert("Usuário ou senha incorretos.");
      }
    }

    function mostrarSistema() {
      telaLogin.classList.add('hidden');
      telaCadastroUsuario.classList.add('hidden');
      telaSistema.classList.remove('hidden');
      mostrar();
    }

    function sair() {
      telaSistema.classList.add('hidden');
      telaLogin.classList.remove('hidden');
      form.reset();
    }

    function mostrarTelaCadastroUsuario() {
      telaLogin.classList.add('hidden');
      telaCadastroUsuario.classList.remove('hidden');
    }

    function voltarLogin() {
      telaCadastroUsuario.classList.add('hidden');
      telaLogin.classList.remove('hidden');
    }

    function cadastrarUsuario() {
      const usuario = document.getElementById('novoUsuario').value;
      const senha = document.getElementById('novaSenha').value;
      if (usuarios.find(u => u.usuario === usuario)) {
        alert("Usuário já existe.");
        return;
      }
      usuarios.push({ usuario, senha });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      alert("Usuário cadastrado com sucesso!");
      voltarLogin();
    }
    form.onsubmit = function(e) {
      e.preventDefault();
      let novo = {
        id: Date.now(),
        nome: form.nome.value,
        cpf: form.cpf.value,
        marca: form.marca.value,
        modelo: form.modelo.value,
        data: form.dataEntrada.value,
        manutencoes: []
      };
      veiculos.push(novo);
      salvar();
      form.reset();
      mostrar();
    };

    function salvar() {
      localStorage.setItem('veiculos', JSON.stringify(veiculos));
    }

    function registrarManutencao(id) {
      const tipo = document.getElementById('tipoManutencao').value;
      let v = veiculos.find(e => e.id === id);
      let hoje = new Date().toISOString().slice(0, 10);
      v.manutencoes.push({ data: hoje, tipo: tipo });
      salvar();
      mostrar();
    }

    function removerCadastro(id) {
      veiculos = veiculos.filter(e => e.id !== id);
      salvar();
      mostrar();
    }

    function mostrar() {
      lista.innerHTML = '';
      for (let v of veiculos) {
        let ultima = v.manutencoes.length ? v.manutencoes[v.manutencoes.length - 1].data + " (" + v.manutencoes[v.manutencoes.length - 1].tipo + ")" : 'Nenhuma';
        let manutencoesHTML = "";
        for (let m of v.manutencoes) {
          manutencoesHTML += `<div class="manutencao">${m.data} - ${m.tipo}</div>`;
        }
        lista.innerHTML += `
          <div class="veiculo">
            <b>${v.nome}</b> - CPF: ${v.cpf}<br>
            Veículo: ${v.marca} - ${v.modelo}<br>
            Data de entrada: ${v.data}<br>
            Última manutenção: ${ultima}<br>
            ${manutencoesHTML}
            <button onclick="registrarManutencao(${v.id})">Registrar Manutenção</button>
            <button onclick="removerCadastro(${v.id})" style="background:red;">Remover Cadastro</button>
          </div>
        `;
      }
    }