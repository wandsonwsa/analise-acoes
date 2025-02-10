import React from 'react';
import { Line } from 'react-chartjs-2'; // Importação correta

const Grafico = ({ dados }) => {
    // Preparar os dados para o gráfico
    const data = {
        labels: dados.map(item => item.nome), // Nomes dos ativos no eixo X
        datasets: [
            {
                label: 'Preço',
                data: dados.map(item => item.preco), // Preços no eixo Y
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div>
            <h2>Gráfico de Preços</h2>
            <Line data={data} />
        </div>
    );
};

export default Grafico;