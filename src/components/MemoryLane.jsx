import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import AudioPlayer from './AudioPlayer';
import HomeButton from './HomeButton';

export default function MemoryLane() {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const photosRef = collection(db, 'photos');
      const q = query(photosRef, orderBy('uploadedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPhotos(photosData);
      setError(null);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Unable to load photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Memory Lane">
        <div className="text-4xl text-gray-600" role="status" aria-live="polite">Loading photos...</div>
        <HomeButton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Memory Lane">
        <div className="text-4xl text-red-600" role="alert">{error}</div>
        <HomeButton />
      </main>
    );
  }

  if (photos.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8" role="main" aria-label="Memory Lane">
        <div className="text-center space-y-8">
          <h1 className="text-5xl text-gray-600">No photos yet</h1>
          <p className="text-3xl text-gray-500">Photos will appear here when they are added.</p>
        </div>
        <HomeButton />
      </main>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Memory Lane photo gallery">
      <div className="w-full max-w-4xl space-y-8">
        {/* Photo */}
        <figure className="flex justify-center" aria-label={`Photo ${currentIndex + 1} of ${photos.length}`}>
          {currentPhoto.imageUrl ? (
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.caption || currentPhoto.personName || 'Memory photo'}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="text-4xl text-gray-400" role="img" aria-label="Photo not available">Photo not available</div>
          )}
        </figure>

        {/* Caption */}
        {currentPhoto.caption && (
          <figcaption className="text-center">
            <div className="text-4xl font-semibold text-gray-800">
              {currentPhoto.caption}
            </div>
          </figcaption>
        )}

        {/* Person Name */}
        {currentPhoto.personName && (
          <div className="text-center">
            <div className="text-3xl text-gray-600" aria-label="Person name">
              {currentPhoto.personName}
            </div>
          </div>
        )}

        {/* Audio Player */}
        {currentPhoto.audioUrl && (
          <AudioPlayer audioUrl={currentPhoto.audioUrl} />
        )}

        {/* Navigation */}
        <nav aria-label="Photo navigation" className="flex gap-6 justify-center mt-8">
          <button
            onClick={goToPrevious}
            className="btn-large flex-1 max-w-xs"
            aria-label={`Previous photo, currently viewing photo ${currentIndex + 1} of ${photos.length}`}
          >
            Previous
          </button>
          <div className="text-3xl text-gray-600 flex items-center px-4" aria-live="polite" aria-atomic="true">
            <span aria-label={`Photo ${currentIndex + 1} of ${photos.length}`}>
              {currentIndex + 1} of {photos.length}
            </span>
          </div>
          <button
            onClick={goToNext}
            className="btn-large flex-1 max-w-xs"
            aria-label={`Next photo, currently viewing photo ${currentIndex + 1} of ${photos.length}`}
          >
            Next
          </button>
        </nav>
      </div>
      <HomeButton />
    </main>
  );
}

