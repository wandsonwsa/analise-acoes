from flask import Flask, jsonify, render_template, request
import yfinance as yf
import numpy as np
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dados')
def get_dados():
    try:
        # Obter o símbolo da ação do parâmetro da URL
        symbol = request.args.get('symbol', 'AAPL').upper()  # Padrão: AAPL

        # Obter os dados históricos dos últimos 20 dias
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="20d")  # Últimos 20 dias

        if data.empty:
            return jsonify({'erro': f'Nenhum dado disponível para o símbolo {symbol}.'})

        # Verificar se as colunas necessárias estão presentes
        required_columns = ['Open', 'High', 'Low', 'Close']
        if not all(column in data.columns for column in required_columns):
            return jsonify({'erro': f'Dados incompletos para o símbolo {symbol}.'})

        # Calcular suporte e resistência
        prices = data['Close'].tolist()
        support = min(prices)
        resistance = max(prices)

        # Último preço de fechamento
        latest_date = data.index[-1].strftime('%Y-%m-%d')
        close_price = data['Close'][-1]

        # Identificar padrões de candlestick
        padroes = []
        for i in range(len(data)):
            open_price = data['Open'][i]
            high_price = data['High'][i]
            low_price = data['Low'][i]
            close_price_candle = data['Close'][i]

            body = abs(close_price_candle - open_price)
            lower_shadow = min(close_price_candle, open_price) - low_price
            upper_shadow = high_price - max(close_price_candle, open_price)

            if (close_price_candle > open_price) and (lower_shadow >= 2 * body) and (upper_shadow <= 0.1 * body):
                padroes.append("Martelo (Hammer)")
            if (close_price_candle < open_price) and (lower_shadow >= 2 * body) and (upper_shadow <= 0.1 * body):
                padroes.append("Hanging Man")
            if abs(open_price - close_price_candle) / (high_price - low_price) < 0.1:
                padroes.append("Doji")

        # Calcular a Média Móvel Simples (SMA) de 5 períodos
        sma_5 = data['Close'].rolling(window=5).mean().replace({np.nan: None}).tolist()

        # Substituir NaN ou None por um valor padrão (ex.: 0)
        sma_5 = [0 if value is None else value for value in sma_5]

        # Preparar dados para o gráfico
        datas = [date.strftime('%Y-%m-%d') for date in data.index]
        preco_fechamento = data['Close'].tolist()

        return jsonify({
            'data': latest_date,
            'ultimo_preco': close_price,
            'suporte': support,
            'resistencia': resistance,
            'padroes': padroes,
            'datas': datas,
            'preco_fechamento': preco_fechamento,
            'sma_5': sma_5  # Adicionando a SMA ao JSON
        })

    except Exception as e:
        return jsonify({'erro': f'Erro interno: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)