/* ==========================================================================
   certificado.js
   Tudo que diz respeito ao documento: os dados da oficina, o preenchimento
   do certificado na tela e a geração do PDF.

   PARA REAPROVEITAR O SITE EM OUTRA EDIÇÃO DA OFICINA, mude apenas o objeto
   DADOS logo abaixo. Nada mais precisa ser tocado.
   ========================================================================== */

const DADOS = {
  // --- cabeçalho (duas linhas, em maiúsculas) ---
  cabecalho1: 'Projeto de Extensão',
  cabecalho2: 'Formação em Tecnologia',

  // --- identificação da oficina ---
  oficina: 'Ecossistema Google na Prática',
  dataExtenso: '26 de agosto de 2026',
  horario: '19h15 às 21h15',
  cidade: 'União da Vitória – PR',
  cargaHoraria: '2 (duas) horas',

  // --- conteúdo desenvolvido ---
  conteudoRotulo: 'Conteúdo desenvolvido',
  conteudoTexto:
    'Conta Google e segurança digital · ' +
    'Google Drive: organização e armazenamento de arquivos na nuvem · ' +
    'Google Documentos: criação, edição e exportação em PDF · ' +
    'Google Planilhas: fórmulas básicas e controle de gastos · ' +
    'Gemini: uso responsável de inteligência artificial · ' +
    'Compartilhamento de arquivos e níveis de acesso.',

  // --- assinatura ---
  assinaturaNome: 'Marcos Muller',
  assinaturaCargo: 'Coordenador de Projeto de Extensão',
  assinaturaCurso: 'Curso de Sistemas de Informação',

  // --- contato da organização (aparece na tela de erro) ---
  telefoneContato: '(42) 99164-0304'
};

/* Texto do corpo do certificado. Os trechos entre <strong> saem em Poppins 600. */
function textoDoCorpo() {
  return 'participou da oficina <strong>&ldquo;' + DADOS.oficina + '&rdquo;</strong>, ' +
         'atividade do projeto de extensão de formação em tecnologia, realizada em ' +
         '<strong>' + DADOS.dataExtenso + '</strong>, das ' +
         '<strong>' + DADOS.horario + '</strong>, em ' + DADOS.cidade + ', ' +
         'com carga horária total de <strong>' + DADOS.cargaHoraria + '</strong>.';
}

/* Rodapé: cidade · data · horário */
function textoDoRodape() {
  return DADOS.cidade + ' · ' + DADOS.dataExtenso + ' · ' + DADOS.horario;
}

/* --------------------------------------------------------------------------
   Medidas do certificado em pixels.
   Em CSS, 1mm equivale sempre a 96/25.4 px, em qualquer aparelho.
   -------------------------------------------------------------------------- */
const PX_POR_MM  = 96 / 25.4;
const LARGURA_PX = 297 * PX_POR_MM;   // 1122.52
const ALTURA_PX  = 210 * PX_POR_MM;   //  793.70

/* --------------------------------------------------------------------------
   Preenchimento do certificado
   -------------------------------------------------------------------------- */

/* Escreve nos elementos marcados com data-campo os textos fixos da oficina. */
function montarCertificado() {
  const textos = {
    cabecalho1:     DADOS.cabecalho1,
    cabecalho2:     DADOS.cabecalho2,
    conteudoRotulo: DADOS.conteudoRotulo,
    conteudoTexto:  DADOS.conteudoTexto,
    rubrica:        DADOS.assinaturaNome,
    assinaturaNome: DADOS.assinaturaNome,
    assinaturaCargo:DADOS.assinaturaCargo,
    assinaturaCurso:DADOS.assinaturaCurso
  };

  for (const campo in textos) {
    const elemento = document.querySelector('[data-campo="' + campo + '"]');
    if (elemento) elemento.textContent = textos[campo];
  }

  // Estes dois têm trechos em negrito, então vão como HTML.
  document.querySelector('[data-campo="corpo"]').innerHTML  = textoDoCorpo();
  document.querySelector('[data-campo="rodape"]').innerHTML = textoDoRodape();
}

/* Escreve o nome do participante no certificado.
   Nomes muito longos são reduzidos até caberem em uma única linha,
   para não empurrar o resto do certificado para fora da folha. */
function preencherNome(nome) {
  const campo = document.getElementById('certNome');
  campo.textContent = nome;

  let tamanho = 22;                       // em pt, como manda o layout
  campo.style.fontSize = tamanho + 'pt';

  // Conta em quantas linhas o nome foi quebrado.
  const quantasLinhas = function () {
    const intervalo = document.createRange();
    intervalo.selectNodeContents(campo);
    return intervalo.getClientRects().length;
  };

  while (tamanho > 14 && quantasLinhas() > 1) {
    tamanho -= 1;
    campo.style.fontSize = tamanho + 'pt';
  }
}

/* --------------------------------------------------------------------------
   Escala de exibição
   O certificado é sempre desenhado em 297×210mm. Na tela ele é apenas
   reduzido com transform:scale(), para caber na largura do celular.
   -------------------------------------------------------------------------- */
function ajustarEscala() {
  const wrap   = document.getElementById('folhaWrap');
  const escala = document.getElementById('folhaEscala');
  if (!wrap || !escala) return;

  const fator = wrap.clientWidth / LARGURA_PX;
  escala.style.transform = 'scale(' + fator + ')';
  wrap.style.height = (ALTURA_PX * fator) + 'px';
}

window.addEventListener('resize', ajustarEscala);

/* --------------------------------------------------------------------------
   Nome do arquivo: certificado-maria-aparecida-da-silva.pdf
   -------------------------------------------------------------------------- */
function gerarSlug(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')       // tudo que não for letra/número vira hífen
    .replace(/^-+|-+$/g, '');          // sem hífen nas pontas
}

/* --------------------------------------------------------------------------
   Geração do PDF
   Devolve uma Promise. Lança erro se algo falhar (quem chama avisa o usuário).
   -------------------------------------------------------------------------- */
async function gerarPDF(nome) {
  // Sem esperar as fontes, o PDF sai com a fonte errada.
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const no = document.getElementById('certificado');

  // Durante a captura o certificado volta ao tamanho natural e sem recorte.
  document.body.classList.add('em-captura');
  window.scrollTo(0, 0);

  let canvas;
  try {
    canvas = await html2canvas(no, {
      scale: 3,                    // sem isso o PDF sai serrilhado
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: LARGURA_PX,
      height: ALTURA_PX,
      windowWidth: LARGURA_PX,
      windowHeight: ALTURA_PX,
      scrollX: 0,
      scrollY: 0
    });
  } finally {
    document.body.classList.remove('em-captura');
    ajustarEscala();
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
  pdf.save('certificado-' + gerarSlug(nome) + '.pdf');
}

/* Caminho de reserva: imprimir (e salvar como PDF pelo próprio navegador). */
function imprimirCertificado() {
  window.print();
}
