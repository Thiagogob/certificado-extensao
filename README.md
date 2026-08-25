# Certificados — Oficina "Ecossistema Google na Prática"

Site estático para os participantes da oficina emitirem o próprio certificado
em PDF. Feito para ser aberto no celular por pessoas com pouca familiaridade
com tecnologia: uma tela por vez, letra grande e botões grandes.

Projeto de extensão do Curso de Sistemas de Informação — Unespar,
União da Vitória – PR.

**Não tem servidor, não tem banco de dados e não precisa de instalação.**
São arquivos HTML, CSS e JavaScript que rodam direto no GitHub Pages.

---

## Como funciona

1. A pessoa digita o nome completo.
2. O site mostra o certificado já preenchido, para ela conferir o nome.
3. Ela clica em "Baixar PDF" e o arquivo vai para a pasta Downloads do celular.

Não há conferência de lista: quem abre o site emite o certificado com o nome
que digitar. Se você precisar restringir a emissão a uma lista de nomes, fale
comigo — dá para acrescentar depois.

O nome digitado passa por uma pequena arrumação antes de ir para o
certificado: espaços sobrando são removidos e as iniciais são corrigidas
quando a palavra veio toda em maiúscula ou toda em minúscula
(`maria APARECIDA DA silva` → `Maria Aparecida da Silva`). Palavras já
escritas com maiúscula no meio, como `McDonald`, ficam intactas.

---

## 1. Como publicar

O site é estático: HTML, CSS e JavaScript, sem build e sem backend.
Dá para publicar de duas formas.

### Opção A — Railway (a que está em uso)

O repositório já traz um `Dockerfile` e um `Caddyfile`. O Railway detecta o
`Dockerfile` sozinho e serve os arquivos com o Caddy — não é preciso
configurar nada no painel.

1. Faça commit e push de **todos** os arquivos para o branch `main`.
2. No Railway, o deploy dispara sozinho a cada push.
3. Em **Settings → Networking**, clique em **Generate Domain** para o
   serviço deixar de ficar "Unexposed" e ganhar um endereço público.

> Se o build falhar dizendo que o app contém apenas `readme.md`, é porque os
> arquivos não foram enviados para o GitHub. Confira com
> `git ls-tree -r --name-only HEAD`.

O Caddy escuta na porta que o Railway informa pela variável `PORT`. Não mexa
nisso no `Caddyfile`.

### Opção B — GitHub Pages (grátis, sem Docker)



1. Envie todos os arquivos para o repositório no GitHub, no branch `main`.
2. No GitHub, abra o repositório e clique em **Settings**.
3. No menu da esquerda, clique em **Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
6. Espere de 1 a 2 minutos. O endereço do site aparece no topo dessa mesma
   página, no formato
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
7. Abra esse endereço no celular e teste.

Dica: gere um QR Code desse endereço e projete na sala no fim da oficina.

---

## 2. Como reaproveitar o site em outra edição da oficina

Todos os dados da oficina ficam num único lugar: o objeto `DADOS`, no começo
do arquivo **`js/certificado.js`**. Não é preciso mexer no HTML nem no CSS.

```js
const DADOS = {
  cabecalho1: 'Projeto de Extensão',
  cabecalho2: 'Formação em Tecnologia',

  oficina: 'Ecossistema Google na Prática',
  dataExtenso: '26 de agosto de 2026',
  horario: '19h15 às 21h15',
  cidade: 'União da Vitória – PR',
  cargaHoraria: '2 (duas) horas',

  conteudoRotulo: 'Conteúdo desenvolvido',
  conteudoTexto: 'Conta Google e segurança digital · ...',

  assinaturaNome: 'Marcos Muller',
  assinaturaCargo: 'Coordenador de Projeto de Extensão',
  assinaturaCurso: 'Curso de Sistemas de Informação',

  telefoneContato: '(42) 99164-0304'
};
```

O que cada campo muda:

| Campo | Onde aparece |
|---|---|
| `oficina` | título da página e nome da oficina no corpo do certificado |
| `dataExtenso` | corpo do certificado e rodapé |
| `horario` | corpo do certificado e rodapé |
| `cidade` | corpo do certificado e rodapé |
| `cargaHoraria` | corpo do certificado (escreva por extenso: `4 (quatro) horas`) |
| `conteudoTexto` | bloco "Conteúdo desenvolvido"; separe os tópicos com ` · ` |
| `assinaturaNome` | rubrica manuscrita **e** o nome impresso abaixo da linha |
| `assinaturaCargo` / `assinaturaCurso` | duas linhas abaixo da assinatura |
| `telefoneContato` | pé do formulário (o link `tel:` é montado sozinho) |

### Trocar o logo

Substitua **`assets/unespar.png`** por outro arquivo, mantendo o mesmo nome.
Use PNG com fundo transparente e pelo menos 600 px no lado maior.

A altura no certificado está fixa em **26 mm** (`.cab__logo`, em
`css/style.css`) e a largura se ajusta sozinha. O logo atual é vertical
(marca em cima, nome embaixo); com um logo horizontal dá para reduzir essa
altura para 20 mm e sobra espaço no certificado.

> **Atenção:** o arquivo atual é o logo do *Campus de Paranaguá*.
> A oficina é em União da Vitória — vale trocar pelo logo do campus certo.

---

## 3. Como conferir o certificado sem preencher o formulário

Abra o site acrescentando `?preview=1` no fim do endereço:

```
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/?preview=1
```

Isso mostra o certificado com um nome de exemplo. Para testar com outro nome:

```
?preview=Antônio Sebastião Ferreira
```

Serve só para conferir o visual. O download continua funcionando normalmente.

---

## 4. Rodar no seu computador antes de publicar

O site funciona abrindo o `index.html` com dois cliques, mas para testar em
condições iguais às do GitHub Pages, use um servidor local:

```bash
python3 -m http.server 8000
```

Depois abra <http://localhost:8000> no navegador.

---

## Estrutura dos arquivos

```
index.html          as duas telas: formulário e certificado
css/style.css       identidade visual e o desenho do certificado
js/certificado.js   dados da oficina, montagem do certificado e o PDF
js/app.js           telas, arrumação do nome e eventos dos botões
assets/unespar.png  logo do cabeçalho
Dockerfile          servidor estático para o Railway (não é usado no Pages)
Caddyfile           configuração do servidor
```

---

## Detalhes técnicos

**Identidade visual.** As cores estão como variáveis CSS no topo de
`css/style.css` (`--tinta`, `--conta`, `--drive`, `--docs`, `--plan`,
`--gemini`). A faixa de cinco cores no topo da página e do certificado é o
elemento que amarra os materiais da oficina.

**Fontes** (Google Fonts): Poppins nos títulos e rótulos, Source Serif 4 no
texto corrido, Parisienne só na rubrica da assinatura. O PDF só é gerado
depois de `document.fonts.ready`, senão o arquivo sai com a fonte errada.

**Tamanho fixo.** O certificado é sempre desenhado em 297 × 210 mm (A4
paisagem), usando só milímetros e pontos. Na tela ele é apenas reduzido com
`transform: scale()`. Por isso o PDF sai idêntico no celular de 320 px e no
computador.

**PDF**: html2canvas (`scale: 3`, para não sair serrilhado) + jsPDF, os dois
carregados de CDN. O arquivo é salvo como
`certificado-nome-do-participante.pdf`.

**Impressão**: o botão "Imprimir" é o caminho de reserva se o download falhar
em algum navegador de celular. O `@page` já está configurado como A4 paisagem
sem margem — basta escolher "Salvar como PDF" na tela de impressão.

**Nomes muito longos** são reduzidos automaticamente (de 22 pt até 14 pt) para
caberem em uma linha só e não empurrarem o resto do certificado para fora da
folha.

**Espaço na folha.** O certificado ocupa quase toda a área útil: sobram cerca
de 2 mm. Se você acrescentar linhas ao `conteudoTexto` ou ao corpo, confira o
resultado com `?preview=1` antes de publicar.
