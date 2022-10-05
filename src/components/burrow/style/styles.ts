import { styled } from "@mui/material/styles";

export const Wrapper = styled("div")(({ theme }) => ({
  display: "grid",
  alignItems: "center",
  gridGap: '30px',
  padding: '50px 0',
  margin: '0 auto',
  [theme.breakpoints.up(1024)]: {
    gridTemplateColumns: '1fr 550px',
  },
  [theme.breakpoints.down(1200)]: {
    gridGap: '15px',
  },

}));

export const InfoBlock = styled("div")(({ theme }) => ({
  minHeight: '100%',
  padding: '30px',
  borderRadius: '30px',
  backgroundColor: '#2a2835',
  textAlign: 'center'
}))

export const DepositBlock = styled("div")(({ theme }) => ({
  padding: '30px 30px 50px',
  minHeight: '100%',
  borderRadius: '30px',
  backgroundColor: '#2a2835',
  maxWidth: '100%',
  overflow: 'hidden',
  position: 'relative'
}))

export const PreviewWrapper = styled("div")(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2,1fr)',
  padding: '30px',
  borderRadius: '30px',
  backgroundColor: '#2b2b3c',
  borderTop: '1px solid hsla(0,0%,100%,.06)',
  '> div': {
    textAlign: 'center',
    borderBottom: '1px solid hsla(0,0%,100%,.1)',
    paddingTop: '14px',
    paddingBottom: '14px',
  },
  '> div:nth-child(odd)': {
    borderRight: '1px solid hsla(0,0%,100%,.1)'
  },
  '> div:nth-child(-n+2)': {
    paddingTop: '0px'
  },
  '> div:nth-last-child(-n+2)': {
    paddingBottom: '0px',
    borderBottom: 'none',
  }

}))