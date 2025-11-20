import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import HomeButton from './HomeButton';

export default function WhoIsThis() {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      loadNewPhoto();
    }
  }, [photos]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const photosRef = collection(db, 'photos');
      const querySnapshot = await getDocs(photosRef);
      
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(photo => photo.personName); // Only photos with person names
      
      setPhotos(photosData);
      setError(null);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Unable to load photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadNewPhoto = () => {
    if (photos.length === 0) return;

    // Get random photo
    const randomIndex = Math.floor(Math.random() * photos.length);
    const photo = photos[randomIndex];
    setCurrentPhoto(photo);

    // Create options: correct answer + one random wrong answer
    const wrongPhotos = photos.filter(p => p.id !== photo.id && p.personName);
    const wrongOption = wrongPhotos.length > 0
      ? wrongPhotos[Math.floor(Math.random() * wrongPhotos.length)].personName
      : 'Someone Special';

    // Shuffle options
    const opts = [photo.personName, wrongOption].sort(() => Math.random() - 0.5);
    setOptions(opts);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    // Auto-advance after 3 seconds if correct, or after showing feedback
    setTimeout(() => {
      loadNewPhoto();
    }, 3000);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Who is this game">
        <div className="text-4xl text-gray-600" role="status" aria-live="polite">Loading game...</div>
        <HomeButton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Who is this game">
        <div className="text-4xl text-red-600" role="alert">{error}</div>
        <HomeButton />
      </main>
    );
  }

  if (photos.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Who is this game">
        <div className="text-center space-y-8">
          <h1 className="text-5xl text-gray-600">No photos available</h1>
          <p className="text-3xl text-gray-500">Add photos with names to play the game.</p>
        </div>
        <HomeButton />
      </main>
    );
  }

  if (!currentPhoto) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Who is this game">
        <div className="text-4xl text-gray-600" role="status" aria-live="polite">Loading...</div>
        <HomeButton />
      </main>
    );
  }

  const isCorrect = selectedAnswer === currentPhoto.personName;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Who is this memory game">
      <div className="w-full max-w-4xl space-y-12">
        {/* Title */}
        <header className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">Who is this?</h1>
        </header>

        {/* Photo */}
        <figure className="flex justify-center">
          {currentPhoto.imageUrl ? (
            <img
              src={currentPhoto.imageUrl}
              alt="Who is this person?"
              className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="text-4xl text-gray-400" role="img" aria-label="Photo not available">Photo not available</div>
          )}
        </figure>

        {/* Options */}
        {!showFeedback && (
          <section aria-label="Answer options" className="flex flex-col gap-6">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="btn-large w-full"
                aria-label={`Select ${option} as the answer`}
              >
                {option}
              </button>
            ))}
          </section>
        )}

        {/* Feedback */}
        {showFeedback && (
          <section aria-live="polite" aria-atomic="true" className="text-center space-y-6">
            {isCorrect ? (
              <div className="text-5xl font-bold text-green-600" role="status">
                That's right! Great job!
              </div>
            ) : (
              <div className="space-y-4" role="status">
                <div className="text-4xl font-semibold text-blue-600">
                  Let's try again
                </div>
                <div className="text-5xl font-bold text-green-600">
                  This is {currentPhoto.personName}
                </div>
              </div>
            )}
            <div className="text-3xl text-gray-500" aria-live="polite">
              Loading next photo...
            </div>
          </section>
        )}
      </div>
      <HomeButton />
    </main>
  );
}

