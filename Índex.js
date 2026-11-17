const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
const tamanhoMax = 3;

const btnIniciar = document.getElementById("btnIniciar");
const inputSenha = document.getElementById("senhaAlvo");
const barraProgresso = document.getElementById("barraProgresso");
const textoPorcentagem = document.getElementById("porcentagem");
const textoTentativaAtual = document.getElementById("tentativaAtual");
const textoContador = document.getElementById("contadorTentativas");
const textoResultado = document.getElementById("resultado");

// Calcula o total máximo de combinações possíveis para senhas de 1 a 3 caracteres
function calcularTotalCombinacoes(base, maxLen) {
  let total = 0;
  for (let i = 1; i <= maxLen; i++) {
    total += Math.pow(base, i);
  }
  return total;
}

// Gera todas as combinações possíveis de 1 até 3 caracteres
function gerarCombinacoes(chars, maxLen) {
  const lista = [];
  function construir(atual) {
    if (atual.length > 0) {
      lista.push(atual);
    }
    if (atual.length === maxLen) return;
    for (let i = 0; i < chars.length; i++) {
      construir(atual + chars[i]);
    }
  }
  construir("");
  return lista;
}

btnIniciar.addEventListener("click", () => {
  const alvo = inputSenha.value.toLowerCase();

  if (!alvo) {
    alert("Digite uma senha de 1 a 3 caracteres.");
    return;
  }

  // Valida se todos os caracteres estão no conjunto permitido
  for (let char of alvo) {
    if (!caracteres.includes(char)) {
      alert("Use apenas letras minúsculas (a-z) e números (0-9).");
      return;
    }
  }

  btnIniciar.disabled = true;
  textoResultado.textContent = "";
  
  const combinacoes = gerarCombinacoes(caracteres, tamanhoMax);
  const total = calcularTotalCombinacoes(caracteres.length, tamanhoMax);
  let indice = 0;

  // Executa em lotes para não travar a interface e permitir visualizar o progresso
  function processarLote() {
    const tamanhoLote = 150; 

    for (let i = 0; i < tamanhoLote && indice < combinacoes.length; i++) {
      const tentativa = combinacoes[indice];
      indice++;

      const percentual = Math.min(100, Math.round((indice / total) * 100));
      barraProgresso.style.width = percentual + "%";
      textoPorcentagem.textContent = percentual + "%";
      textoTentativaAtual.textContent = tentativa;
      textoContador.textContent = indice;

      if (tentativa === alvo) {
        textoResultado.textContent = `Senha encontrada: "${tentativa}" em ${indice} tentativas!`;
        btnIniciar.disabled = false;
        return;
      }
    }

    if (indice < combinacoes.length) {
      requestAnimationFrame(processarLote);
    } else {
      textoResultado.textContent = "Senha não encontrada.";
      btnIniciar.disabled = false;
    }
  }

  requestAnimationFrame(processarLote);
});