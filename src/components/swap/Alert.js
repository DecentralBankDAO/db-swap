import styled from 'styled-components';
import Warning from "../../assets/svg/warning.png";

const AlertWarapper = styled.div`
    border-radius: 40px;
    background: #444445;
    border: 1px solid #9fa47b;
    display: flex;
    padding: 15px;
    margin-top: 25px;
    font-size: 16px;
    align-items: center;
    color: white;
    justify-content: space-between;
    max-width: 490px;
    width: 100%;
    gap: 15px;
    span {
        text-align: left;
    }
`;

export const Alert = ({ usdtBalance }) => {
  return (
      <AlertWarapper>
          <img src={Warning} />
          <span>{`Oops. Currently you can exchange upto ${usdtBalance} USN. For further redeeming of USN please proceed to `}
            <a href="https://usnpp.auroralabs.dev/" target="_blank">https://usnpp.auroralabs.dev/</a>
          </span>
      </AlertWarapper>
  );
};