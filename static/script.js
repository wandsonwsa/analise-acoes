document.getElementById('atualizar').addEventListener('click', function () {
    const symbol = document.getElementById('symbol').value.trim().toUpperCase();
    if (!symbol) {
        alert('Por favor, insira um símbolo válido.');
        return;
    }

    fetch(`/dados?symbol=${symbol}`)
        .then(response => response.json())
        .then(data => {
            const resultadoDiv = document.getElementById('resultado');
            if (data.erro) {
                resultadoDiv.innerHTML = `<p><strong>Erro:</strong> ${data.erro}</p>`;
                return;
            }

            resultadoDiv.innerHTML = `
                <p><strong>Data:</strong> ${data.data}</p>
                <p><strong>Último Preço de Fechamento:</strong> ${data.ultimo_preco}</p>
                <p><strong>Suporte:</strong> ${data.suporte}</p>
                <p><strong>Resistência:</strong> ${data.resistencia}</p>
                <p><strong>Padrões Detectados:</strong> ${data.padroes.join(', ') || 'Nenhum'}</p>
            `;

            // Criar o gráfico
            const ctx = document.getElementById('grafico').getContext('2d');

            // Verificar se o gráfico já existe e destruí-lo antes de criar um novo
            if (window.grafico && typeof window.grafico.destroy === 'function') {
                window.grafico.destroy(); // Limpar o gráfico anterior, se existir
            }

            // Criar um gradiente de fundo
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
            gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

            window.grafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.datas, // Datas dos últimos 20 dias
                    datasets: [
                        {
                            label: 'Preço de Fechamento',
                            data: data.preco_fechamento, // Preços de fechamento
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: gradient, // Gradiente de fundo
                            borderWidth: 2,
                            fill: true // Preencher a área sob a linha
                        },
                        {
                            label: 'Média Móvel Simples (5 períodos)',
                            data: data.sma_5, // Média Móvel Simples
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            fill: false // Não preencher a área sob a linha
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Data',
                                color: '#333',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Preço',
                                color: '#333',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Erro ao obter dados:', error);
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.innerHTML = `<p><strong>Erro:</strong> Não foi possível carregar os dados.</p>`;
        });
});