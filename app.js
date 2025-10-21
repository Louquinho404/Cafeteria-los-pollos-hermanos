import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DADOS_PATH = path.join(__dirname, 'dados.json');


app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const lerDados = () => {
    try {
        const dadosJson = readFileSync(DADOS_PATH, 'utf-8');
        return JSON.parse(dadosJson);
    } catch (error) {
        console.error('Erro ao ler dados:', error);
        return [];
    }
};


const salvarDados = (dados) => {
    try {
        const dadosJson = JSON.stringify(dados, null, 2);
        writeFileSync(DADOS_PATH, dadosJson, 'utf-8');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
};


app.get('/ler', (req, res) => {
    const dados = lerDados();
    res.json(dados);
});


app.post('/salvar', (req, res) => {
    const novoPedido = req.body; 

   
    if (!novoPedido || !novoPedido.pedidos || novoPedido.total === undefined) {
        return res.status(400).send("Dados incompletos. Requer 'pedidos' e 'total'.");
    }

    const dadosAtuais = lerDados();
    dadosAtuais.push(novoPedido); 

    salvarDados(dadosAtuais);

    console.log('Dados recebidos e salvos:', novoPedido);
    res.send('Dados salvos com sucesso!');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
