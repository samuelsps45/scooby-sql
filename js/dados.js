/* DADOS DO JOGO: personagens, cutscenes, fases e desafios.
   Para criar um novo desafio, basta copiar um objeto da lista "desafios". */
'use strict';

const PERSONAGENS = {
  scooby:  { nome: 'Scooby',  emoji: '🐶' },
  salsicha:{ nome: 'Salsicha',emoji: '🍔' },
  fred:    { nome: 'Fred',    emoji: '🧣' },
  daphne:  { nome: 'Daphne',  emoji: '💜' },
  velma:   { nome: 'Velma',   emoji: '🔍' },
  vilao:   { nome: 'Vilão',   emoji: '👻' }
};

const CENAS = {
  intro: [
    { quem: 'fred',    fala: 'Pessoal, recebemos três chamados de assombração na cidade. A Mistério S.A. está oficialmente no caso!' },
    { quem: 'velma',   fala: 'Todo fantasma tem uma explicação lógica. Desta vez a prova está guardada em bancos de dados, e precisamos de alguém que fale SQL.' },
    { quem: 'salsicha',fala: 'Eu falo "sanduíche" fluentemente. Serve? Scooby, quer ajudar?' },
    { quem: 'scooby',  fala: 'Rá-rá-rá! Ruh-roh... Reu reu! (Eu topo, mas só com biscoito!)' },
    { quem: 'daphne',  fala: 'Então é com você, detetive! Escreva os comandos SQL e a gente desmascara o culpado. Vamos começar pela mansão!' }
  ],
  f1: [
    { quem: 'daphne',  fala: 'Chegamos à Mansão Assombrada. Os moradores dizem que um vulto vaga pelos corredores.' },
    { quem: 'velma',   fala: 'Anotei os suspeitos e as pistas em tabelas. Use SELECT para consultar e WHERE para filtrar.' },
    { quem: 'salsicha',fala: 'Eu consulto o fantasma... quer dizer, a geladeira. Boa sorte!' }
  ],
  f1fim: [
    { quem: 'fred',    fala: 'Ótimo trabalho! A lista de suspeitos encolheu bastante.' },
    { quem: 'velma',   fala: 'Mas faltam dados no cinema abandonado. Lá você vai alterar o banco com INSERT, UPDATE e DELETE.' }
  ],
  f2: [
    { quem: 'salsicha',fala: 'Esse cinema abandonado é muito assustador. Parece que a tela está piscando sozinha!' },
    { quem: 'scooby',  fala: 'Ruh-roh! Rinema! Rassustador!' },
    { quem: 'velma',   fala: 'Temos testemunhas e evidências para organizar. Vamos manter o banco de dados em dia.' }
  ],
  f2fim: [
    { quem: 'daphne',  fala: 'Testemunhas atualizadas e evidências organizadas. O caso está quase fechado!' },
    { quem: 'fred',    fala: 'Resta o laboratório secreto. Lá você vai criar e apagar tabelas, e depois desmascarar o vilão.' }
  ],
  f3: [
    { quem: 'velma',   fala: 'Este é o laboratório secreto. Precisamos de tabelas novas para guardar os disfarces e as armadilhas.' },
    { quem: 'fred',    fala: 'E vamos jogar fora as tabelas inúteis. Cuidado: DROP TABLE apaga tudo de uma vez!' }
  ],
  f3fim: [
    { quem: 'velma',   fala: 'Pelos meus cálculos, o culpado está na lista de funcionários. Hora da grande revelação!' }
  ],
  final: [
    { quem: 'vilao',   fala: 'Eu teria me dado bem se esse detetive de SQL não tivesse aparecido!' },
    { quem: 'fred',    fala: 'Era o vigia noturno, o Sr. Hugo, fingindo ser fantasma para afastar as pessoas!' },
    { quem: 'salsicha',fala: 'Gente, o fantasma tinha um nome e uma linha no banco de dados. Bem simples!' },
    { quem: 'scooby',  fala: 'Scooby-Dooby-Doo! Ra-ra-ra-ra!' },
    { quem: 'daphne',  fala: 'Caso encerrado! Você aprendeu SELECT, WHERE, INSERT, UPDATE, DELETE, CREATE TABLE e DROP TABLE.' }
  ]
};

const FASES = [
  {
    nome: 'A Mansão Assombrada', icone: '🏚️', conteudo: 'Consultas com SELECT e WHERE',
    cenaInicio: 'f1', cenaFim: 'f1fim',
    esquema: `
      CREATE TABLE suspeitos (id INTEGER PRIMARY KEY, nome TEXT, profissao TEXT, idade INTEGER, cidade TEXT);
      CREATE TABLE pistas (id INTEGER PRIMARY KEY, descricao TEXT, local TEXT, suspeito_id INTEGER);
      INSERT INTO suspeitos VALUES
        (1,'Sr. Carvalho','zelador',52,'Vila Nova'),(2,'Dona Marta','bibliotecária',61,'Vila Nova'),
        (3,'Prof. Bento','arqueólogo',45,'Porto Alto'),(4,'Lúcia Prado','corretora',38,'Vila Nova'),
        (5,'Otávio Reis','zelador',29,'Porto Alto'),(6,'Clara Mendes','jornalista',33,'Serra Azul');
      INSERT INTO pistas VALUES
        (1,'Pegada de bota com lama','Porão',1),(2,'Chave dourada','Biblioteca',2),(3,'Fio de lã azul','Sótão',4),
        (4,'Pó luminoso','Porão',5),(5,'Bilhete rasgado','Biblioteca',3),(6,'Lanterna quebrada','Jardim',1);`,
    desafios: [
      { titulo: 'Quem está na lista?',
        historia: 'Velma pede para ver todos os dados da tabela suspeitos, com todas as colunas.',
        dica: 'SELECT * FROM nome_da_tabela;',
        solucao: 'SELECT * FROM suspeitos;' },
      { titulo: 'Só o essencial',
        historia: 'Fred quer uma lista enxuta: apenas as colunas nome e profissao da tabela suspeitos, nessa ordem.',
        dica: 'Em vez de *, escreva os nomes das colunas separados por vírgula.',
        solucao: 'SELECT nome, profissao FROM suspeitos;' },
      { titulo: 'Moradores de Vila Nova',
        historia: 'Daphne descobriu que o fantasma mora em Vila Nova. Mostre todas as colunas dos suspeitos cuja cidade é \'Vila Nova\'.',
        dica: 'Use WHERE cidade = \'Vila Nova\'. O texto vai entre aspas simples.',
        solucao: "SELECT * FROM suspeitos WHERE cidade = 'Vila Nova';" },
      { titulo: 'Zelador de Porto Alto',
        historia: 'Uma testemunha viu um zelador de Porto Alto no porão. Mostre todas as colunas dos suspeitos com profissao = \'zelador\' E cidade = \'Porto Alto\'.',
        dica: 'Combine as duas condições com AND.',
        solucao: "SELECT * FROM suspeitos WHERE profissao = 'zelador' AND cidade = 'Porto Alto';" }
    ]
  },
  {
    nome: 'O Cinema Abandonado', icone: '🎬', conteudo: 'Alterando dados: INSERT, UPDATE e DELETE',
    cenaInicio: 'f2', cenaFim: 'f2fim',
    esquema: `
      CREATE TABLE testemunhas (id INTEGER PRIMARY KEY, nome TEXT, depoimento TEXT);
      CREATE TABLE evidencias (id INTEGER PRIMARY KEY, objeto TEXT, local TEXT, status TEXT);
      INSERT INTO testemunhas VALUES (1,'Zeca','Ouvi passos no palco'),(2,'Ana','A tela piscou três vezes'),(3,'Zé Mentira','Eu vi um dragão!');
      INSERT INTO evidencias VALUES
        (1,'Pipoca verde','Saguão','pendente'),(2,'Tinta fosforescente','Palco','pendente'),
        (3,'Fita velha','Projeção','pendente'),(4,'Máscara de borracha','Palco','pendente');`,
    desafios: [
      { titulo: 'Nova testemunha',
        historia: 'O Salsicha viu tudo! Insira em testemunhas: id 4, nome \'Salsicha\', depoimento \'Vi um fantasma na tela!\'.',
        dica: 'INSERT INTO testemunhas (id, nome, depoimento) VALUES (4, \'...\', \'...\');',
        solucao: "INSERT INTO testemunhas (id, nome, depoimento) VALUES (4, 'Salsicha', 'Vi um fantasma na tela!');",
        check: 'SELECT * FROM testemunhas ORDER BY id;' },
      { titulo: 'Fita analisada',
        historia: 'A Velma analisou a evidência de id 3. Altere o status dela para \'analisada\'.',
        dica: 'UPDATE evidencias SET status = \'analisada\' WHERE id = 3;  Sem WHERE, todas as linhas mudam!',
        solucao: "UPDATE evidencias SET status = 'analisada' WHERE id = 3;",
        check: 'SELECT * FROM evidencias ORDER BY id;' },
      { titulo: 'Mudança de cenário',
        historia: 'As evidências do \'Palco\' foram levadas ao \'Camarim\'. Atualize o campo local de todas as evidências cujo local é \'Palco\'.',
        dica: 'UPDATE evidencias SET local = \'Camarim\' WHERE local = \'Palco\';',
        solucao: "UPDATE evidencias SET local = 'Camarim' WHERE local = 'Palco';",
        check: 'SELECT * FROM evidencias ORDER BY id;' },
      { titulo: 'Testemunha falsa',
        historia: 'O \'Zé Mentira\' inventou a história do dragão. Delete essa testemunha da tabela testemunhas.',
        dica: 'DELETE FROM testemunhas WHERE nome = \'Zé Mentira\';',
        solucao: "DELETE FROM testemunhas WHERE nome = 'Zé Mentira';",
        check: 'SELECT * FROM testemunhas ORDER BY id;' }
    ]
  },
  {
    nome: 'O Laboratório Secreto', icone: '🧪', conteudo: 'Estrutura: CREATE TABLE e DROP TABLE, e o desafio final',
    cenaInicio: 'f3', cenaFim: 'f3fim',
    esquema: `
      CREATE TABLE funcionarios (id INTEGER PRIMARY KEY, nome TEXT, cargo TEXT, turno TEXT, idade INTEGER);
      CREATE TABLE rascunhos (id INTEGER, anotacao TEXT);
      INSERT INTO funcionarios VALUES
        (1,'Hugo Lima','Vigia','Noite',58),(2,'Rita Souza','Vigia','Dia',44),
        (3,'Paulo Nunes','Cientista','Noite',51),(4,'Vera Tosta','Vigia','Noite',35);
      INSERT INTO rascunhos VALUES (1,'lixo'),(2,'mais lixo');`,
    desafios: [
      { titulo: 'Tabela de disfarces',
        historia: 'Crie a tabela disfarces com as colunas id (INTEGER), nome (TEXT) e tipo (TEXT), nessa ordem.',
        dica: 'CREATE TABLE disfarces (id INTEGER, nome TEXT, tipo TEXT);',
        solucao: 'CREATE TABLE disfarces (id INTEGER, nome TEXT, tipo TEXT);',
        check: "SELECT name, type FROM pragma_table_info('disfarces') ORDER BY cid;" },
      { titulo: 'Tabela de capturados',
        historia: 'Crie a tabela capturados com id (INTEGER), nome (TEXT) e idade (INTEGER), nessa ordem.',
        dica: 'Separe as colunas por vírgula e termine com ponto e vírgula.',
        solucao: 'CREATE TABLE capturados (id INTEGER, nome TEXT, idade INTEGER);',
        check: "SELECT name, type FROM pragma_table_info('capturados') ORDER BY cid;" },
      { titulo: 'Limpando o laboratório',
        historia: 'A tabela rascunhos só tem lixo. Apague a tabela inteira.',
        dica: 'DROP TABLE nome_da_tabela;',
        solucao: 'DROP TABLE rascunhos;',
        check: "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;" },
      { titulo: 'Desafio final: quem é o fantasma?',
        historia: 'O culpado é um funcionário com cargo \'Vigia\', turno \'Noite\' e idade maior que 40. Mostre apenas o nome dele.',
        dica: 'SELECT nome FROM funcionarios WHERE cargo = ... AND turno = ... AND idade > 40;',
        solucao: "SELECT nome FROM funcionarios WHERE cargo = 'Vigia' AND turno = 'Noite' AND idade > 40;" }
    ]
  }
];
