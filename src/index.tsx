import React from 'react';
import ReactDOM from 'react-dom';

import './i18n';
import './styles/index.css';

import { Buffer } from 'buffer';
import App from './App/App';
import { NearEnvironment, NearProvider } from 'react-near';
import { BrowserRouter } from 'react-router-dom';

// NOTE: necessary fix for a client because `Buffer` object is used by 'near-api-js' lib.
global.Buffer = Buffer;

ReactDOM.render(
    <React.StrictMode>
        <NearProvider environment={NearEnvironment.TestNet}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </NearProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
