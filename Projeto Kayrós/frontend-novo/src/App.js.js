import React, { useEffect, useState } from 'react';
import './App.css';
import Grafico from './Grafico'; // Importar o componente de gráfico

function App() {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        // Fazer uma requisição para o backend
        fetch('http://localhost:5000/api/dados')
            .then((response) => response.json())
            .then((data) => setDados(data))
            .catch((error) => console.error('Erro ao buscar dados:', error));
    }, []);

    return (
        <div className="App">
            <h1>Dados do Backend</h1>
            <ul>
                {dados.map((item) => (
                    <li key={item.id}>
                        {item.nome} - Preço: {item.preco}
                    </li>
                ))}
            </ul>

            {/* Exibir o gráfico */}
            {dados.length > 0 && <Grafico dados={dados} />}
        </div>
    );
}

export default App;