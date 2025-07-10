import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export default function CotacaoData() {
  const [inicio, setInicio] = useState(null);
  const [fim, setFim] = useState(null);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarCotacao = async () => {
    if (!inicio || !fim) return alert('Selecione as duas datas!');

    const dataInicio = format(inicio, 'yyyyMMdd');
    const dataFim = format(fim, 'yyyyMMdd');

    setLoading(true);
    try {
      const resposta = await fetch(
        `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${dataInicio}&end_date=${dataFim}`
      );
      const json = await resposta.json();
      setDados(json);
    } catch (erro) {
      alert('Erro ao buscar dados');
      console.error(erro);
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Buscar Cotação USD/BRL</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Data Início:</label><br />
        <DatePicker
          selected={inicio}
          onChange={(date) => setInicio(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Data Fim:</label><br />
        <DatePicker
          selected={fim}
          onChange={(date) => setFim(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data"
        />
      </div>

      <button onClick={buscarCotacao}>Buscar</button>

      {loading && <p>Carregando...</p>}

      {dados.length > 0 && (
        <table border="1" cellPadding={5} style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Compra</th>
              <th>Venda</th>
              <th>Alta</th>
              <th>Baixa</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.timestamp}>
                <td>{new Date(item.timestamp * 1000).toLocaleDateString()}</td>
                <td>R$ {parseFloat(item.bid).toFixed(2)}</td>
                <td>R$ {parseFloat(item.ask).toFixed(2)}</td>
                <td>R$ {parseFloat(item.high).toFixed(2)}</td>
                <td>R$ {parseFloat(item.low).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
