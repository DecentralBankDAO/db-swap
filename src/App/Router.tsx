import { Route, Routes } from 'react-router-dom';
import BurrowPage from '../components/pages/burrow';
import NotFoundPage from '../components/pages/errors/NotFoundPage';
import MintPage from '../components/pages/mint';




function Router() {
    return (
        <Routes>
            <Route path="/" element={<MintPage />} />
            <Route path="/burrow" element={<BurrowPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default Router;
