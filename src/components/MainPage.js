import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import styled from "styled-components";
import Header from './Header'
import Loading from './Loading';
import Summary from './Summary';

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: ${({ color }) => color};
  border-radius: 100%;
  display: inline-block;
  margin-left: 10px;
`;

function calculateCost(startTime, rate) {
  const now = Date.now();
  const elapsed = (now - startTime) / 1000;

  return ((elapsed / 60 / 60) * rate).toFixed(2);
}

function calculateEnergy(startTime, kwh) {
  const now = Date.now();
  const elapsed = (now - startTime) / 3600000;

  return (elapsed * kwh).toFixed(4);
}

function Connector({ connector, active }) {

  const [price, setPrice] = useState();
  const [cost, setCost] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [pressed, setPressed] = useState(false);
  const connected = useRef();
  const { setSummary } = useContext(SummaryContext);

  useEffect(() => {
    fetch(process.env.REACT_APP_API + "/api/rate/" + connector.rate).then(
      async (rsp) => {
        const data = await rsp.json();
        const elements = data.data.elements;
        const price = elements[0].price_components[0];
        price.currency = data.data.currency;
        setPrice(price);
      }
    );
  }, []);

  function handleConnection() {
    if (connected.current) {
      clearInterval(connected.current.timer);
      const cost = calculateCost(connected.current.time, price.price);
      const energy = calculateEnergy(connected.current.time, connector.power);
      setSummary({
        cost: cost,
        currency: price.currency,
        energy,
        starttime: connected.current.time,
        endtime: Date.now()
      });
      setCost();
      setEnergy();
      connected.current = null;
      setPressed(false);
    }
    else {
      setPressed(true);
      connected.current = {
        time: Date.now(),
        timer: setInterval(() => {
          const cost = calculateCost(connected.current.time, price.price);
          const energy = calculateEnergy(connected.current.time, connector.power);
          setCost(cost);
          setEnergy(energy);
        }, 10 * 1000),
      };
    }
  }

  return (
    <div className="flex items-center bg-white p-4 rounded mb-5">
      <div className="flex-1">
        {connector && connector.power_type}
      </div>
      {price && (
        <>
          <div className="mr-4">{price.type}</div>
          <div className="w-20">{price.price}</div>
          {pressed && (
            <div className="bg-gray-200 mr-4 px-5 flex rounded">
              <div className="mr-4 py-2">{cost} {price.currency}</div>
              <div className="py-2">{energy} KWH</div>
            </div>
          )}
          <div>
            <button 
              className={"bg-gray-200 py-2 px-4 rounded w-28" + 
                (pressed ? " bg-red-500" : (active) ? " bg-blue-500" : " bg-gray-300") +
                (active ? " text-white" : " cursor-not-allowed text-gray-400")
              } 
              disabled={!active} 
              title={!active ? 'Charge station is offline' : ''} 
              onClick={handleConnection} 
            >{pressed ? "Stop": "Start"}</button>
          </div>
        </>
      )}
    </div>
  )
}

function Station({ station }) {

  const [connectors, setConnectors] = useState();

  useEffect(() => {
    fetch(process.env.REACT_APP_API + "/api/connectors/" + station._id).then(
      async (rsp) => {
        const data = await rsp.json();
        const connectors = data.data.result;
        setConnectors(connectors);
      }
    );
  }, [])

  return (
    <div className="py-10">
      <div className="mb-5 flex">
        <div className="bg-white py-2 px-4 rounded">
          Station: {station.endpoint}
          <Dot
            color={station.online ? "#2ecc71" : "#e74c3c"}
            title={station.online ? "online": "offline"}
          />
        </div>
      </div>
        <div>
          {connectors && connectors.map((connector, i) => (
            <Connector key={i} connector={connector} active={station.online} />
          ))}
        </div>
    </div>
  )
}

export const SummaryContext = createContext();

export default function MainPage() {

  const [busy, setBusy] = useState(true);
  const [station, setStation] = useState();
  const [summary, setSummary] = useState();

  useEffect(() => {
    fetch(process.env.REACT_APP_API + "/api/chargestations").then(
      async (rsp) => {
        const data = await rsp.json();
        const stations = data.data.result[0];
        setStation(stations);
        setBusy(false);
      }
    );
  }, [])

  if (busy) return <Loading />

  return (
    <SummaryContext.Provider value={{ setSummary }}>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <div className="flex-1">
          <div className="container mx-auto">
            {station && <Station station={station} />}
            {summary && <Summary summary={summary} />}
          </div>
        </div>
      </div>
    </SummaryContext.Provider>
  )
}
