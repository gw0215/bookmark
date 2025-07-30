import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddBookmark from './pages/AddBookmark';
import EditBookmark from './pages/EditBookmark';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddBookmark />} />
        <Route path="/edit/:id" element={<EditBookmark />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;