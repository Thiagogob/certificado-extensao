/* ==========================================================================
   app.js
   Controla as duas telas do site: formulário e pré-visualização.

   Não existe lista de participantes: quem abre o site digita o próprio nome
   e recebe o certificado com esse nome.
   ========================================================================== */

/* Mensagem mostrada depois do download. */
const MENSAGEM_SUCESSO =
  'Pronto! O arquivo foi salvo na pasta <strong>Downloads</strong> do seu celular.';

/* Palavras que ficam em minúscula no meio de um nome próprio. */
const PARTICULAS = ['de', 'da', 'do', 'das', 'dos', 'e'];

/* --------------------------------------------------------------------------
   Arrumação do nome digitado
   Tira os espaços sobrando e corrige as iniciais de cada palavra que veio
   toda em maiúscula ou toda em minúscula ("MARIA" e "maria" viram "Maria").
   Palavras já escritas com maiúscula no meio ficam intactas, para não
   estragar grafias como "McDonald" ou "D'Ávila".
   -------------------------------------------------------------------------- */
function arrumarNome(digitado) {
  const nome = digitado.replace(/\s+/g, ' ').trim();
  if (nome === '') return '';

  return nome.split(' ').map(function (palavra, posicao) {
    const minuscula = palavra.toLowerCase();

    // "Maria de Souza", mas "De Souza" se "de" for a primeira palavra.
    if (posicao > 0 && PARTICULAS.indexOf(minuscula) !== -1) return minuscula;

    // Palavra com maiúscula no meio: a pessoa escreveu de propósito.
    const uniforme = (palavra === minuscula) || (palavra === palavra.toUpperCase());
    if (!uniforme) return palavra;

    return minuscula.charAt(0).toUpperCase() + minuscula.slice(1);
  }).join(' ');
}

/* --------------------------------------------------------------------------
   Troca de telas — uma coisa por vez
   -------------------------------------------------------------------------- */
const telas = ['telaFormulario', 'telaPreview'];

function mostrarTela(id) {
  telas.forEach(function (t) {
    document.getElementById(t).hidden = (t !== id);
  });
  window.scrollTo(0, 0);
}

/* --------------------------------------------------------------------------
   Mensagens do formulário (linguagem simples, sempre dizendo
   o que fazer em seguida)
   -------------------------------------------------------------------------- */
function avisar(mensagem, ehErro) {
  const aviso = document.getElementById('avisoNome');
  aviso.textContent = mensagem;
  aviso.classList.toggle('campo__aviso--erro', !!ehErro);
}

function limparAviso() {
  avisar('Escreva nome e sobrenome.', false);
}

/* --------------------------------------------------------------------------
   Início
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', iniciar);

function iniciar() {
  // Preenche os textos fixos do certificado a partir de DADOS (certificado.js).
  montarCertificado();
  document.getElementById('tituloOficina').textContent =
    'Oficina “' + DADOS.oficina + '”';

  // Telefone de contato vem do mesmo lugar que o resto dos dados.
  const telefone = document.querySelector('.ajuda__telefone');
  telefone.textContent = DADOS.telefoneContato;
  telefone.href = 'tel:+55' + DADOS.telefoneContato.replace(/\D/g, '');

  ligarEventos();

  // Modo de conferência visual: index.html?preview=1 mostra o certificado
  // preenchido com um nome de exemplo, sem passar pelo formulário.
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.has('preview')) {
    const exemplo = parametros.get('preview');
    mostrarCertificado(!exemplo || exemplo === '1'
      ? 'Maria Aparecida da Silva'
      : exemplo);
  }
}

/* --------------------------------------------------------------------------
   Eventos
   -------------------------------------------------------------------------- */
function ligarEventos() {
  const campo = document.getElementById('campoNome');

  document.getElementById('formNome').addEventListener('submit', aoEnviarNome);
  campo.addEventListener('input', limparAviso);

  document.getElementById('botaoBaixar').addEventListener('click', aoBaixarPDF);
  document.getElementById('botaoImprimir').addEventListener('click', imprimirCertificado);
  document.getElementById('botaoCorrigir').addEventListener('click', voltarAoFormulario);
}

/* O único motivo para não avançar é o campo estar vazio. */
function aoEnviarNome(evento) {
  evento.preventDefault();

  const campo = document.getElementById('campoNome');
  const nome = arrumarNome(campo.value);

  if (nome === '') {
    avisar('Digite o seu nome completo no campo acima.', true);
    campo.focus();
    return;
  }

  mostrarCertificado(nome);
}

/* Mostra a pré-visualização com o nome já escrito no certificado. */
function mostrarCertificado(nome) {
  preencherNome(nome);
  document.getElementById('nomeConferencia').textContent = nome;
  mostrarTela('telaPreview');
  ajustarEscala();                 // só dá para medir a largura com a tela visível

  const dica = document.getElementById('dicaDownload');
  dica.innerHTML = MENSAGEM_SUCESSO;
  dica.hidden = true;
}

function voltarAoFormulario() {
  const campo = document.getElementById('campoNome');
  mostrarTela('telaFormulario');
  limparAviso();
  campo.focus();
  campo.select();
}

/* --------------------------------------------------------------------------
   Download do PDF
   -------------------------------------------------------------------------- */
async function aoBaixarPDF() {
  const botao = document.getElementById('botaoBaixar');
  const rotuloOriginal = botao.textContent;
  const nome = document.getElementById('certNome').textContent;

  botao.disabled = true;
  botao.textContent = 'Gerando seu certificado...';

  try {
    await gerarPDF(nome);
    const dica = document.getElementById('dicaDownload');
    dica.innerHTML = MENSAGEM_SUCESSO;
    dica.hidden = false;
  } catch (erro) {
    console.error('Falha ao gerar o PDF:', erro);
    const dica = document.getElementById('dicaDownload');
    dica.innerHTML = 'Não conseguimos preparar o arquivo agora. ' +
                     'Use o botão <strong>Imprimir</strong>, logo abaixo, ' +
                     'para salvar o seu certificado.';
    dica.hidden = false;
  } finally {
    botao.disabled = false;
    botao.textContent = rotuloOriginal;
  }
}
