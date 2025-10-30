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