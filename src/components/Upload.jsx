import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase/config';
import HomeButton from './HomeButton';

export default function Upload() {
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [personName, setPersonName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setMessage('');
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage('Please select a photo');
      setMessageType('error');
      return;
    }

    if (!caption.trim()) {
      setMessage('Please enter a caption');
      setMessageType('error');
      return;
    }

    try {
      setUploading(true);
      setMessage('');

      // Upload image
      const imageRef = ref(storage, `photos/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Upload audio if provided
      let audioUrl = null;
      if (audioFile) {
        const audioRef = ref(storage, `audio/${Date.now()}_${audioFile.name}`);
        await uploadBytes(audioRef, audioFile);
        audioUrl = await getDownloadURL(audioRef);
      }

      // Save to Firestore
      await addDoc(collection(db, 'photos'), {
        imageUrl,
        audioUrl,
        caption: caption.trim(),
        personName: personName.trim() || null,
        uploadedAt: serverTimestamp(),
      });

      setMessage('Photo uploaded successfully!');
      setMessageType('success');
      
      // Reset form
      setImageFile(null);
      setAudioFile(null);
      setCaption('');
      setPersonName('');
      e.target.reset();
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage('Error uploading photo. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white" role="main" aria-label="Upload photo form">
      <div className="w-full max-w-2xl space-y-8">
        <header>
          <h1 className="text-6xl font-bold text-gray-900 text-center">
            Add a Photo
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" aria-label="Photo upload form">
          {/* Image Upload */}
          <fieldset className="space-y-4" disabled={uploading}>
            <legend className="block text-3xl font-semibold text-gray-700 mb-2">
              Photo <span className="text-red-600" aria-label="required">*</span>
            </legend>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-2xl text-gray-700 border-2 border-gray-300 rounded-lg p-4 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
              disabled={uploading}
              aria-required="true"
              aria-describedby={imageFile ? "image-selected" : undefined}
            />
            {imageFile && (
              <div id="image-selected" className="text-2xl text-green-600" role="status" aria-live="polite">
                Selected: {imageFile.name}
              </div>
            )}
          </fieldset>

          {/* Caption */}
          <fieldset className="space-y-4" disabled={uploading}>
            <label htmlFor="caption" className="block text-3xl font-semibold text-gray-700">
              Caption <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              placeholder="Enter a caption for this photo"
              disabled={uploading}
              aria-required="true"
            />
          </fieldset>

          {/* Person Name */}
          <fieldset className="space-y-4" disabled={uploading}>
            <label htmlFor="personName" className="block text-3xl font-semibold text-gray-700">
              Person Name (for the game)
            </label>
            <input
              id="personName"
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full text-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              placeholder="Enter the person's name"
              disabled={uploading}
            />
          </fieldset>

          {/* Audio Upload */}
          <fieldset className="space-y-4" disabled={uploading}>
            <label htmlFor="audioFile" className="block text-3xl font-semibold text-gray-700">
              Audio Introduction (optional)
            </label>
            <input
              id="audioFile"
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="block w-full text-2xl text-gray-700 border-2 border-gray-300 rounded-lg p-4 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
              disabled={uploading}
              aria-describedby={audioFile ? "audio-selected" : undefined}
            />
            {audioFile && (
              <div id="audio-selected" className="text-2xl text-green-600" role="status" aria-live="polite">
                Selected: {audioFile.name}
              </div>
            )}
          </fieldset>

          {/* Message */}
          {message && (
            <div
              role={messageType === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              className={`text-3xl font-semibold p-4 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="btn-large w-full"
            aria-label={uploading ? 'Uploading photo, please wait' : 'Upload photo'}
            aria-busy={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
      <HomeButton />
    </main>
  );
}

