import { useNavigate } from 'react-router-dom';

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="btn-home"
      aria-label="Go to Home"
    >
      Home
    </button>
  );
}

