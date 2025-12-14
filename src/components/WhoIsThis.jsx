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
      
      // Fetch both family photos (with personName) and animals (with type: 'animal')
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(photo => 
        photo.personName || (photo.type === 'animal' && photo.caption)
      );
      
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

    // Determine correct answer based on type
    const correctAnswer = photo.type === 'animal' ? photo.caption : photo.personName;
    const photoType = photo.type === 'animal' ? 'animal' : 'person';

    // Create options: correct answer + one random wrong answer from same type
    const sameTypePhotos = photos.filter(p => 
      p.id !== photo.id && 
      ((photoType === 'animal' && p.type === 'animal' && p.caption) ||
       (photoType === 'person' && p.personName))
    );

    let wrongOption;
    if (sameTypePhotos.length > 0) {
      const wrongPhoto = sameTypePhotos[Math.floor(Math.random() * sameTypePhotos.length)];
      wrongOption = photoType === 'animal' ? wrongPhoto.caption : wrongPhoto.personName;
    } else {
      wrongOption = photoType === 'animal' ? 'Another Animal' : 'Someone Special';
    }

    // Shuffle options
    const opts = [correctAnswer, wrongOption].sort(() => Math.random() - 0.5);
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

  // Determine correct answer and question based on type
  const isAnimal = currentPhoto.type === 'animal';
  const correctAnswer = isAnimal ? currentPhoto.caption : currentPhoto.personName;
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Who is this memory game">
      <div className="w-full max-w-4xl space-y-12">
        {/* Title */}
        <header className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">
            {isAnimal ? 'What is this?' : 'Who is this?'}
          </h1>
        </header>

        {/* Photo */}
        <figure className="flex justify-center">
          {currentPhoto.imageUrl ? (
            <img
              src={currentPhoto.imageUrl}
              alt={isAnimal ? 'What is this animal?' : 'Who is this person?'}
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
                  {isAnimal ? `This is a ${correctAnswer}` : `This is ${correctAnswer}`}
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

