/* MOTOR DO JOGO: telas, cutscenes, banco SQLite (sql.js), pontuação e progresso. */
'use strict';

const CHAVE = 'scoobySqlProgresso';
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let SQL = null;                 // biblioteca sql.js carregada
let estado = carregar();        // { feitos: {"0-0": pontos}, vistas: {cena: true} }
let atual = null;               // desafio em andamento { f, i, erros, dica }
let cena = null;                // cutscene em andamento
let aoConfirmar = null;         // função chamada pelo botão do modal

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Progresso salvo no navegador ---------- */
function carregar() {
  try { return JSON.parse(localStorage.getItem(CHAVE)) || { feitos: {}, vistas: {} }; }
  catch (e) { return { feitos: {}, vistas: {} }; }
}
function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }
const total = () => Object.values(estado.feitos).reduce((a, b) => a + b, 0);

/* ---------- Navegação entre telas ---------- */
function mostrar(nome) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  $('#tela-' + nome).classList.add('ativa');
  window.scrollTo(0, 0);
}
function irMapa() { $('#modal').hidden = true; desenharMapa(); mostrar('mapa'); }

/* ---------- Cutscenes ---------- */
function tocarCena(nome, depois) {
  cena = { nome, falas: CENAS[nome], i: 0, depois };
  mostrar('cena'); falaAtual();
}
function cenaUmaVez(nome, depois) { estado.vistas[nome] ? depois() : tocarCena(nome, depois); }
function falaAtual() {
  const f = cena.falas[cena.i], p = PERSONAGENS[f.quem];
  $('#cena-avatar').textContent = p.emoji;
  $('#cena-nome').textContent = p.nome;
  $('#cena-texto').textContent = f.fala;
  $('#cena-progresso').textContent = (cena.i + 1) + ' / ' + cena.falas.length;
  $('#cena-prox').textContent = cena.i === cena.falas.length - 1 ? 'Continuar ▶' : 'Próximo ▶';
}
function proxFala() { if (++cena.i >= cena.falas.length) fimCena(); else falaAtual(); }
function fimCena() {
  if (!cena) return;
  estado.vistas[cena.nome] = true; salvar();
  const depois = cena.depois; cena = null; depois();
}

/* ---------- Mapa de fases ---------- */
function liberado(f, i) {
  if (i > 0) return (f + '-' + (i - 1)) in estado.feitos;
  return f === 0 || ((f - 1) + '-3') in estado.feitos;
}
function desenharMapa() {
  $('#mapa-pontos').textContent = total();
  const caixa = $('#mapa-fases'); caixa.innerHTML = '';
  FASES.forEach((fase, f) => {
    const card = document.createElement('div'); card.className = 'card-fase';
    card.innerHTML = `<h3>${fase.icone} Fase ${f + 1}: ${esc(fase.nome)}</h3><p>${esc(fase.conteudo)}</p>`;
    const linha = document.createElement('div'); linha.className = 'desafios';
    fase.desafios.forEach((d, i) => {
      const k = f + '-' + i, feito = k in estado.feitos, livre = liberado(f, i);
      const b = document.createElement('button');
      b.className = 'btn-desafio' + (feito ? ' feito' : '') + (livre ? '' : ' trancado');
      b.disabled = !livre; b.title = d.titulo;
      b.textContent = feito ? `✔ ${i + 1}` : livre ? `${i + 1}` : `🔒 ${i + 1}`;
      b.onclick = () => abrirDesafio(f, i);
      linha.appendChild(b);
    });
    card.appendChild(linha); caixa.appendChild(card);
  });
}

/* ---------- Banco de dados (sql.js) ---------- */
function novoBanco(f) { const db = new SQL.Database(); db.exec(FASES[f].esquema); return db; }
function rodar(db, sql) {
  try { const r = db.exec(sql); return { res: r.length ? r[r.length - 1] : null, afetadas: db.getRowsModified() }; }
  catch (e) { return { erro: e.message }; }
}
function tabelaHTML(r) {
  const cab = r.columns.map(c => `<th>${esc(c)}</th>`).join('');
  const lin = r.values.map(l => '<tr>' + l.map(v => `<td>${v === null ? 'NULL' : esc(v)}</td>`).join('') + '</tr>').join('');
  return `<div class="rolagem"><table><thead><tr>${cab}</tr></thead><tbody>${lin}</tbody></table></div>`;
}
/* Roda o SQL num banco novo e devolve o que será comparado (resultado ou tabela de verificação). */
function saida(f, desafio, sql) {
  const db = novoBanco(f);
  try {
    const r = rodar(db, sql);
    if (r.erro) return { erro: r.erro };
    let res = r.res;
    if (desafio.check) res = rodar(db, desafio.check).res;
    return { chave: JSON.stringify(res ? res.values : null) };
  } finally { db.close(); }
}

/* ---------- Desafios ---------- */
function abrirDesafio(f, i) {
  if (!SQL) return alert('O banco de dados ainda não carregou. Verifique a internet e recarregue a página.');
  cenaUmaVez(FASES[f].cenaInicio, () => {
    iniciar(f, i);
  });
}
function iniciar(f, i) {
  const fase = FASES[f], d = fase.desafios[i];
  atual = { f, i, erros: 0, dica: false };
  $('#d-fase').textContent = `${fase.icone} Fase ${f + 1} · Desafio ${i + 1}/4`;
  $('#d-titulo').textContent = d.titulo;
  $('#d-historia').textContent = d.historia;
  $('#d-dica').hidden = true;
  $('#sql').value = ''; $('#resultado').innerHTML = ''; $('#painel-tabelas').hidden = true;
  msg('', ''); $('#d-pontos').textContent = total();
  mostrar('desafio'); $('#sql').focus();
}
function msg(t, tipo) { const m = $('#mensagem'); m.textContent = t; m.className = 'mensagem ' + tipo; }

function executar() {
  const sql = $('#sql').value.trim();
  if (!sql) return msg('Digite um comando SQL primeiro.', 'info');
  const db = novoBanco(atual.f), r = rodar(db, sql); db.close();
  if (r.erro) { $('#resultado').innerHTML = ''; return msg('Erro de SQL: ' + r.erro, 'erro'); }
  if (r.res) {
    $('#resultado').innerHTML = tabelaHTML(r.res);
    msg(`${r.res.values.length} linha(s) retornada(s).`, 'info');
  } else {
    $('#resultado').innerHTML = '';
    msg(`Comando executado. Linhas afetadas: ${r.afetadas}. Use "Resolver mistério" para conferir.`, 'info');
  }
}
function verificar() {
  const sql = $('#sql').value.trim();
  if (!sql) return msg('Digite um comando SQL primeiro.', 'info');
  executar();
  const d = FASES[atual.f].desafios[atual.i];
  const usuario = saida(atual.f, d, sql);
  if (usuario.erro) return msg('Erro de SQL: ' + usuario.erro, 'erro');
  const certo = saida(atual.f, d, d.solucao);
  if (usuario.chave !== certo.chave) {
    atual.erros++;
    return msg('Ainda não é isso. Releia a história com atenção (−20 pts nesta tentativa).', 'erro');
  }
  const pts = Math.max(20, 100 - 20 * atual.erros - (atual.dica ? 20 : 0));
  const k = atual.f + '-' + atual.i;
  estado.feitos[k] = Math.max(estado.feitos[k] || 0, pts); salvar();
  $('#d-pontos').textContent = total();
  msg('Mistério resolvido! 🎉', 'ok');
  fimDesafio(pts);
}
function fimDesafio(pts) {
  const { f, i } = atual, ultimo = i === 3;
  $('#modal-titulo').textContent = '🎉 Pista encontrada!';
  $('#modal-texto').textContent = `Você ganhou ${pts} pontos. Total: ${total()}.`;
  $('#modal-ok').textContent = !ultimo ? 'Próximo desafio ▶' : f < 2 ? 'Concluir fase ▶' : 'Desmascarar o vilão ▶';
  aoConfirmar = () => {
    $('#modal').hidden = true;
    if (!ultimo) return iniciar(f, i + 1);
    cenaUmaVez(FASES[f].cenaFim, () => {
      if (f < 2) return irMapa();
      cenaUmaVez('final', telaFinal);
    });
  };
  $('#modal').hidden = false;
}
function dica() {
  const d = FASES[atual.f].desafios[atual.i];
  if (!atual.dica) atual.dica = true;
  $('#d-dica').textContent = '💡 ' + d.dica; $('#d-dica').hidden = false;
}
function tabelas() {
  const painel = $('#painel-tabelas');
  if (!painel.hidden) { painel.hidden = true; return; }
  const db = novoBanco(atual.f); let html = '';
  const nomes = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  (nomes.length ? nomes[0].values : []).forEach(([n]) => {
    const r = db.exec(`SELECT * FROM "${n}"`);
    html += `<h4>Tabela ${esc(n)}</h4>` + (r.length ? tabelaHTML(r[0]) : '<p>(vazia)</p>');
  });
  db.close(); painel.innerHTML = html; painel.hidden = false;
}

/* ---------- Final e menu ---------- */
function telaFinal() {
  const p = total();
  $('#f-pontos').textContent = p;
  $('#f-rank').textContent = p >= 1000 ? 'Detetive lendário de SQL! 🕵️' : p >= 700 ? 'Ótimo detetive! 🔦' : 'Bom começo! Refaça os desafios para ganhar mais pontos. 💪';
  mostrar('final');
}
function novo() {
  if (Object.keys(estado.feitos).length && !confirm('Isso apaga seu progresso atual. Continuar?')) return;
  estado = { feitos: {}, vistas: {} }; salvar();
  tocarCena('intro', irMapa);
}
function continuar() { cenaUmaVez('intro', irMapa); }

const ACOES = {
  novo, continuar, reiniciar: novo, executar, verificar, dica, tabelas,
  ajuda: () => mostrar('ajuda'),
  menu: () => { $('#modal').hidden = true; mostrar('menu'); },
  mapa: irMapa, modalmapa: irMapa,
  limpar: () => { $('#sql').value = ''; $('#sql').focus(); },
  proxfala: proxFala, pular: fimCena,
  modalok: () => aoConfirmar && aoConfirmar()
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-acao]');
  if (b && ACOES[b.dataset.acao]) ACOES[b.dataset.acao]();
});
$('#sql').addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') executar(); });

/* ---------- Inicialização do sql.js ---------- */
if (typeof initSqlJs === 'function') {
  initSqlJs({ locateFile: f => CDN + f })
    .then(lib => { SQL = lib; $('#status-sql').textContent = '✔ Banco de dados SQLite pronto.'; })
    .catch(() => { $('#status-sql').textContent = '⚠ Não foi possível iniciar o SQLite. Recarregue a página.'; });
} else {
  $('#status-sql').textContent = '⚠ Não foi possível baixar o sql.js. Verifique sua conexão com a internet.';
}
