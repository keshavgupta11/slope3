function App() {
  const [trades, setTrades] = useState([]);
  const [oracleAPY, setOracleAPY] = useState(6.25);
  const [netOI, setNetOI] = useState(0);

  const handleTrade = (direction, dv01) => {
    const newNetOI = direction === 'pay' ? netOI + dv01 : netOI - dv01;
    const k = 0.01 / 50000;
    const priceImpact = newNetOI * k;
    const executionAPY = oracleAPY + (direction === 'pay' ? priceImpact : -priceImpact);
    const margin = dv01 * 20;
    const liquidation = direction === 'pay'
      ? executionAPY - 0.2
      : executionAPY + 0.2;

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

  return (
    <div>
      <h1>Slope APY Simulator</h1>
      <p>Oracle APY: {oracleAPY}%</p>
      <p>Net OI: {netOI}</p>

      <button onClick={() => handleTrade('pay', 10000)}>Trade: Pay 10K</button>
      <button onClick={() => handleTrade('receive', 10000)}>Trade: Receive 10K</button>

      <h2>Trades:</h2>
      <ul>
        {trades.map((trade, idx) => (
          <li key={idx}>
            {trade.direction} | DV01: {trade.dv01} | APY: {trade.executionAPY}% | Margin: {trade.margin} | Liq: {trade.liquidation}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
