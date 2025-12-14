import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import AnimalGenerator from './AnimalGenerator';

const SETTINGS_PASSWORD = 'caregiver2024'; // Simple password - can be moved to env var

export default function Settings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === SETTINGS_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Settings">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-6xl font-bold text-gray-900 text-center">
            Caregiver Settings
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="password" className="block text-3xl font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full text-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                placeholder="Enter password"
                aria-label="Settings password"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-3xl font-semibold text-red-600 p-4 bg-red-100 rounded-lg" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-large w-full"
              aria-label="Submit password"
            >
              Enter
            </button>
          </form>
        </div>
        <HomeButton />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Caregiver Settings">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">Caregiver Settings</h1>
        </header>

        <AnimalGenerator />
      </div>
      <HomeButton />
    </main>
  );
}

