import { useContext } from "react";
import moment from 'moment';
import styled from "styled-components";
import { SummaryContext } from "./MainPage";

const Container = styled.div`
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
`;

export default function Summary({ summary }) {
  const { setSummary } = useContext(SummaryContext);
  return (
    <Container>
      <div className="bg-white container mx-auto w-5/12 p-10 rounded">
        <div className="flex mb-10">
          <h1 className="text-3xl flex-1">Transaction</h1>
          <div
            className="text-4xl leading-3 cursor-pointer"
            onClick={() => setSummary()}
          >
            &times;
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr >
              <td>Start time</td>
              <td>{moment(summary.starttime).format('DD-MM-YY hh:mm:ss A')}</td>
            </tr>
            <tr>
              <td>End time</td>
              <td>{moment(summary.endtime).format('DD-MM-YY hh:mm:ss A')}</td>
            </tr>
            <tr>
              <td>Energy</td>
              <td>{summary.energy} KWH</td>
            </tr>
            <tr>
              <td>Cost</td>
              <td>{summary.cost} {summary.currency}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}
