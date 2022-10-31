const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 8888;

app.use(express.json());


async function executarNoBanco(query){
    const conexao = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:'1234',
        database: 'dc'
    });

    const [results, ] = await conexao.execute(query);

    return results;
};

app.get('/produtos', async (req,res) => {
    let produtos = await executarNoBanco('SELECT * FROM produtos');
    res.send(produtos);
});

app.get('/produtos/:id', async (req,res) => {
    let produtoEspecifico = await executarNoBanco(`SELECT * FROM produtos WHERE ${req.params.id} = id`);
    res.send(produtoEspecifico[0]);
});

app.post('/produtos', async (req,res) => {
    let produtoAdicionado = req.body;

    const resultado = await executarNoBanco(
        `
        INSERT INTO produtos 
            (nome, valor, categoria, tamanho)
        VALUES
            ('${produtoAdicionado.nome}', '${produtoAdicionado.valor}', '${produtoAdicionado.categoria}', '${produtoAdicionado.tamanho}')
        `
    );

    produtoAdicionado.id = resultado.insertId;
    res.send(produtoAdicionado);
});

app.patch('/produtos/:id', async(req,res)=> {
    let produtoModificado = req.body;
   
    await executarNoBanco(
        `UPDATE produtos SET 
            categoria = ${produtoModificado.categoria}
        WHERE
            ${req.params.id} = id
    `)

    res.send(produtoModificado);
})

app.delete('/produtos/:id', async(req,res) => {
    await executarNoBanco(`DELETE FROM produtos WHERE ${req.params.id} = id`);
    res.send(204);
});

app.listen(port, () => {
    console.log('Servidor rodando em http://localhost:8888')
});