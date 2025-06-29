import React, { useState } from 'react';
import './styles.css';

function App() {
  const [trades, setTrades] = useState([]);
  const [oracleAPY, setOracleAPY] = useState(6.25);
  const [netOI, setNetOI] = useState(0);

  const handleTrade = (direction, dv01) => {
    const newNetOI = direction === 'pay' ? netOI + dv01 : netOI - dv01;
    const k = 0.01 / 50000; // 50k DV01 = 1% move
    const priceImpact = newNetOI * k;
    const executionAPY = oracleAPY + (direction === 'pay' ? priceImpact : -priceImpact);
    const margin = dv01 * 20;
    const liquidation = direction === 'pay' ? executionAPY - 0.2 : executionAPY + 0.2;

    const newTrade = {
      direction,
      dv01,
      executionAPY: executionAPY.toFixed(3),
      margin,
      liquidation: liquidation.toFixed(3),
    };

    setTrades([...trades, newTrade]);
    setNetOI(newNetOI);
  };

  const resetSim = () => {
    setTrades([]);
    setNetOI(0);
  };

  return (
    <div className="container">
      <h1>Slope DV01 Simulator</h1>
      <div className="input-group">
        <label>Oracle APY: </label>
        <input
          type="number"
          value={oracleAPY}
          onChange={(e) => setOracleAPY(parseFloat(e.target.value))}
        />
        <button onClick={resetSim}>Reset</button>
      </div>
      <div className="buttons">
        <button onClick={() => handleTrade('pay', 5000)}>Pay Fixed 5k DV01</button>
        <button onClick={() => handleTrade('pay', 2000)}>Pay Fixed 2k DV01</button>
        <button onClick={() => handleTrade('receive', 5000)}>Receive Fixed 5k DV01</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Direction</th>
            <th>DV01</th>
            <th>APY</th>
            <th>Margin</th>
            <th>Liquidation</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i}>
              <td>{t.direction}</td>
              <td>{t.dv01}</td>
              <td>{t.executionAPY}%</td>
              <td>${t.margin}</td>
              <td>{t.liquidation}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
