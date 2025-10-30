const express = require("express");
const app = express();
PORT = 8081;

const fs = require("fs");

const path = require("path");

// Middleware CRÍTICO: Permite que o Express analise (parse) o corpo das requisições JSON (req.body)
app.use(express.json());

app.get("/livros", (req, res) => {


    try {
        //lendo o arquivo json
        const data = fs.readFileSync("./livros.json", "utf-8");
        //transformar o arquivo json em objeto js
        let livros = JSON.parse(data);
        const { nomeLivro } = req.query;
        //pesquisa por nome do livro
        if (nomeLivro) {
            livros = livros.filter(livro => livro.titulo.toLowerCase().includes(nomeLivro.toLowerCase()));
        }

        res.status(200).json(livros);


    } catch (error) {
        console.error("Erro ao ler o arquivo json", error);
        res.status(500).json({ error: " Erro interno no servidor" });
    }
})

//rota post

app.post("/livros", (req, res) => {

    const filePath = path.join(__dirname, "livros.json");

    try {
        const { titulo, autor, ano, quantidade } = req.body;
        const anoLivro = parseFloat(ano);
        const quantidadeLivro = parseFloat(quantidade);

        // inserir os dados no arquivos
        const novoLivro = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            ano: anoLivro,
            quantidade: quantidadeLivro
        };

        const data = fs.readFileSync(filePath, "utf-8");
        let livros = JSON.parse(data);

        // 5. Adicionando o novo produto à lista
        livros.push(novoLivro);

        // 6. Escrevendo a lista atualizada no arquivo JSON (indentado com 4 espaços)
        fs.writeFileSync(filePath, JSON.stringify(livros, null, 4));

        res.status(201).json({
            message: "Livro cadastrado com sucesso",
            livro: novoLivro
        });

    } catch (error) {
        console.error("Erro ao grava no arquivo json", error);
        res.status(500).json({ error: " Erro interno no servidor" });
    }

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta 8081: http://localhost:${PORT}`);
});