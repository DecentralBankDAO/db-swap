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

export const Alert = ({ message }) => {
  return (
      <AlertWarapper>
          <img src={Warning} />
          <span>{message}</span>
      </AlertWarapper>
  );
};