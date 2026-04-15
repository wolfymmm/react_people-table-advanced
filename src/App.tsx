import { Routes, Route, Navigate } from 'react-router-dom';
import { PeoplePage } from './components/PeoplePage';
import { Navbar } from './components/Navbar';
import './App.scss';

export const App = () => {
  return (
    <div data-cy="app">
      <Navbar />

      <div className="section">
        <div className="container">
          <Routes>
            {/* Головна сторінка — тільки один заголовок */}
            <Route path="/" element={<h1 className="title">Home Page</h1>} />

            {/* Редирект з /home на / (якщо тести цього вимагають) */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Сторінка людей — заголовок тепер живе всередині PeoplePage або тут */}
            <Route path="/people" element={<PeoplePage />}>
               <Route path=":slug" element={<PeoplePage />} />
            </Route>

            {/* Сторінка 404 — показується лише якщо шлях не збігається */}
            <Route path="*" element={<h1 className="title">Page not found</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
