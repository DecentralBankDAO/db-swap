import { Route, Routes } from 'react-router-dom';
import HomePage from '../components/pages/home/HomePage';
import NotFoundPage from '../components/pages/errors/NotFoundPage';
import { Main } from '../components/main';
import { IframePage } from '../components/pages/iframe/IframePage';




function Router() {
    return (
        <Routes>
            {/* <Route path="/" element={<Main />} /> */}
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/buy" element={<IframePage/>} /> */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default Router;
