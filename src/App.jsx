import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MemoryLane from './components/MemoryLane';
import WhoIsThis from './components/WhoIsThis';
import Upload from './components/Upload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memory-lane" element={<MemoryLane />} />
        <Route path="/who-is-this" element={<WhoIsThis />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
