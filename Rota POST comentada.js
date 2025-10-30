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