# Scooby-Doo: O Mistério do Banco de Dados

Jogo educativo para praticar SQL básico (SELECT, WHERE, INSERT, UPDATE, DELETE, CREATE TABLE, DROP TABLE).
Feito com HTML, CSS, JavaScript puro e SQLite no navegador (sql.js / WebAssembly).

## Estrutura
```
index.html          -> redireciona para html/jogo.html (necessário para o GitHub Pages)
html/jogo.html      -> todas as telas do jogo
css/style.css       -> visual e responsividade
js/dados.js         -> personagens, cutscenes, fases e desafios (edite aqui para criar desafios)
js/jogo.js          -> lógica: telas, SQL, pontuação, progresso
assets/img/logo.svg -> recursos visuais
```

## Como rodar no computador
Abra `index.html` no navegador (precisa de internet para baixar o sql.js do CDN).

## Como publicar no GitHub Pages
1. Coloque o conteúdo desta pasta na raiz do repositório e faça commit e push.
2. No GitHub: Settings > Pages > Source: "Deploy from a branch" > branch `main` / pasta `/ (root)` > Save.
3. Aguarde 1 a 2 minutos e acesse `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Fluxo do jogo
Menu > cutscene de introdução > mapa > 3 fases x 4 desafios (cada fase com cutscenes) > cena final > tela de pontuação.
Pontuação: até 100 pts por desafio (-20 por erro, -20 se usar a dica, mínimo 20). Máximo: 1200. O progresso fica salvo no navegador.

## Como criar um novo desafio
Em `js/dados.js`, copie um objeto da lista `desafios` e altere `titulo`, `historia`, `dica` e `solucao`.
Para comandos que alteram dados (INSERT, UPDATE, DELETE, CREATE, DROP), adicione `check`: um SELECT que mostra o estado esperado do banco.
