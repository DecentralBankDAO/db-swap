import React from 'react';
import ReactDOM from 'react-dom';

import './i18n';
import './styles/index.css';

import { Buffer } from 'buffer';
import App from './App/App';
import { BrowserRouter } from 'react-router-dom';
// import { RecoilRoot } from 'recoil';
import { createStore } from 'redux';
import { ThemeProvider } from "@mui/material/styles";
import { createBrowserHistory } from 'history';
import createRootReducer from './redux/combineReducers';
import { Provider } from 'react-redux';
import createMiddleware from './redux/middleware'
import { NearProviderWithSandbox } from './config/near-env';
import theme from './theme';

// NOTE: necessary fix for a client because `Buffer` object is used by 'near-api-js' lib.
global.Buffer = Buffer;
const history = createBrowserHistory();


export const store = createStore(createRootReducer(), createMiddleware(history));

export type RootState = ReturnType<typeof store.getState>;


ReactDOM.render(
    <React.StrictMode>
        <NearProviderWithSandbox>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                     <App />
                    </BrowserRouter>
                </ThemeProvider>
            </Provider>
        </NearProviderWithSandbox>
    </React.StrictMode>,
    document.getElementById('root')
);
