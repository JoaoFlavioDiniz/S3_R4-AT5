// Importa o framework Express, que facilita a criação de rotas e manipulação de requisições HTTP.
const express = require("express");
// Cria uma instância do aplicativo Express.
const app = express();
// Define a porta em que o servidor irá escutar.
const PORT = 8081;

// Importa o módulo nativo 'fs' (File System) do Node.js, usado para ler e escrever arquivos.
const fs = require("fs");

// Importa o módulo nativo 'path' do Node.js, usado para trabalhar com caminhos de diretório.
const path = require("path");

// Middleware CRÍTICO: Permite que o Express analise (parse) o corpo das requisições JSON (req.body)
// Isso é essencial para receber dados de requisições POST, PUT e PATCH.
app.use(express.json());

// ----------------------------------------------------------------------
// ROTA GET: Buscar livros (todos ou por nome)
// ----------------------------------------------------------------------
app.get("/livros", (req, res) => {

    // Inicia um bloco try-catch para lidar com possíveis erros (especialmente na leitura do arquivo).
    try {
        // Lendo o arquivo json de forma síncrona, usando a codificação 'utf-8'.
        const data = fs.readFileSync("./livros.json", "utf-8");
        
        // Transforma o conteúdo JSON (string) lido do arquivo em um objeto/array JavaScript.
        let livros = JSON.parse(data);
        
        // Desestrutura para obter o parâmetro 'nomeLivro' da query string da URL (ex: ?nomeLivro=...)
        const { nomeLivro } = req.query;
        
        // Inicia a lógica de pesquisa por nome do livro.
        if (nomeLivro) {
            // Filtra a lista de livros: compara o título do livro (em minúsculas) com o termo de pesquisa (em minúsculas).
            livros = livros.filter(livro => livro.titulo.toLowerCase().includes(nomeLivro.toLowerCase()));
        }

        // Retorna o status 200 (OK) e envia o array de livros (filtrado ou completo) como resposta JSON.
        res.status(200).json(livros);

    } catch (error) {
        // Se ocorrer um erro (ex: arquivo não encontrado ou JSON inválido), exibe o erro no console do servidor.
        console.error("Erro ao ler o arquivo json", error);
        // Retorna o status 500 (Internal Server Error) e envia uma mensagem de erro ao cliente.
        res.status(500).json({ error: " Erro interno no servidor" });
    }
})

// ----------------------------------------------------------------------
// ROTA POST: Adicionar um novo livro
// ----------------------------------------------------------------------
app.post("/livros", (req, res) => {

    // Constrói o caminho completo e seguro para o arquivo, combinando o diretório atual (__dirname) com o nome do arquivo.
    const filePath = path.join(__dirname, "livros.json");

    try {
        // Desestrutura para obter os dados do novo livro do corpo da requisição (req.body, graças ao express.json()).
        const { titulo, autor, ano, quantidade } = req.body;
        
        // Converte o valor 'ano' (que veio como string) para um número decimal (float).
        const anoLivro = parseFloat(ano);
        
        // Converte o valor 'quantidade' para um número decimal (float).
        const quantidadeLivro = parseFloat(quantidade);

        // Cria o novo objeto livro com os dados recebidos, garantindo que titulo e autor sejam strings limpas (sem espaços em branco no início/fim).
        const novoLivro = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            ano: anoLivro,
            quantidade: quantidadeLivro
        };

        // Lê o conteúdo atual do arquivo JSON de forma síncrona.
        const data = fs.readFileSync(filePath, "utf-8");
        
        // Converte o conteúdo JSON em um array JavaScript.
        let livros = JSON.parse(data);

        // Adiciona o novo objeto livro ao array de livros existente.
        livros.push(novoLivro);

        // Escreve o array de livros completo e atualizado de volta no arquivo JSON.
        // O argumento 'null, 4' formata o JSON com indentação de 4 espaços, facilitando a leitura humana.
        fs.writeFileSync(filePath, JSON.stringify(livros, null, 4));

        // Retorna o status 201 (Created), indicando que o recurso foi criado com sucesso, e envia os dados do novo livro.
        res.status(201).json({
            message: "Livro cadastrado com sucesso",
            livro: novoLivro
        });

    } catch (error) {
        // Se houver um erro durante o processo (leitura, escrita, ou dados inválidos), exibe no console.
        console.error("Erro ao grava no arquivo json", error);
        // Retorna o status 500 (Internal Server Error) ao cliente.
        res.status(500).json({ error: " Erro interno no servidor" });
    }

});

// Inicia o servidor para escutar por requisições na porta definida (8081).
app.listen(PORT, () => {
    // Imprime uma mensagem no console quando o servidor inicia com sucesso.
    console.log(`Servidor rodando na porta 8081: http://localhost:${PORT}`);
});
