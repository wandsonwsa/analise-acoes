const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('Backend do Projeto Kairos AI está funcionando!');
});

// Rota para fornecer dados simulados
app.get('/api/dados', (req, res) => {
    const dadosSimulados = [
        { id: 1, nome: 'Ativo A', preco: 100 },
        { id: 2, nome: 'Ativo B', preco: 200 },
        { id: 3, nome: 'Ativo C', preco: 150 }
    ];
    res.json(dadosSimulados);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});