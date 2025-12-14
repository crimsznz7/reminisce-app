import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase/config';

export default function AnimalGenerator() {
  const [animalName, setAnimalName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!animalName.trim()) {
      setMessage('Please enter an animal name');
      setMessageType('error');
      return;
    }

    try {
      setGenerating(true);
      setMessage('');
      setImageUrl(null);
      setAudioBase64(null);
      setAudioUrl(null);

      // Call API endpoint
      const response = await fetch('/api/generate-animal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: animalName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate animal memory');
      }

      const data = await response.json();
      setImageUrl(data.image_url);
      setAudioBase64(data.audio_base64);

      // Convert base64 to blob and create object URL for audio preview
      const audioBlob = base64ToBlob(data.audio_base64, 'audio/mpeg');
      const audioObjectUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioObjectUrl);
    } catch (error) {
      console.error('Error generating animal:', error);
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setGenerating(false);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleSave = async () => {
    if (!imageUrl || !audioBase64) {
      setMessage('Please generate an animal memory first');
      setMessageType('error');
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      // Convert base64 audio to blob
      const audioBlob = base64ToBlob(audioBase64, 'audio/mpeg');

      // Download image from URL and convert to blob
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Upload image to Firebase Storage
      const imageRef = ref(storage, `photos/animals/${Date.now()}_${animalName.trim().toLowerCase()}.png`);
      await uploadBytes(imageRef, imageBlob);
      const uploadedImageUrl = await getDownloadURL(imageRef);

      // Upload audio to Firebase Storage
      const audioRef = ref(storage, `audio/animals/${Date.now()}_${animalName.trim().toLowerCase()}.mp3`);
      await uploadBytes(audioRef, audioBlob);
      const uploadedAudioUrl = await getDownloadURL(audioRef);

      // Save to Firestore
      await addDoc(collection(db, 'photos'), {
        imageUrl: uploadedImageUrl,
        audioUrl: uploadedAudioUrl,
        caption: animalName.trim(),
        type: 'animal',
        personName: null,
        uploadedAt: serverTimestamp(),
      });

      setMessage('Animal memory saved successfully!');
      setMessageType('success');

      // Reset form
      setAnimalName('');
      setImageUrl(null);
      setAudioBase64(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } catch (error) {
      console.error('Error saving animal memory:', error);
      setMessage('Error saving animal memory. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-5xl font-bold text-gray-900 text-center">
        Generate Animal Memory
      </h2>

      <form onSubmit={handleGenerate} className="space-y-8">
        <div className="space-y-4">
          <label htmlFor="animalName" className="block text-3xl font-semibold text-gray-700">
            Animal Name
          </label>
          <input
            id="animalName"
            type="text"
            value={animalName}
            onChange={(e) => setAnimalName(e.target.value)}
            className="w-full text-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            placeholder="e.g., Lion, Elephant, Dog"
            disabled={generating || saving}
            aria-label="Animal name"
          />
        </div>

        <button
          type="submit"
          disabled={generating || saving}
          className="btn-large w-full"
          aria-label="Generate animal memory"
        >
          {generating ? 'Dreaming up a memory...' : 'Generate'}
        </button>
      </form>

      {/* Loading Spinner */}
      {generating && (
        <div className="text-center space-y-4">
          <div className="text-4xl text-gray-600">Dreaming up a memory...</div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        </div>
      )}

      {/* Generated Image */}
      {imageUrl && !generating && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={`Generated ${animalName}`}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="space-y-4">
              <div className="text-3xl font-semibold text-gray-700 text-center">
                Audio Preview
              </div>
              <audio
                src={audioUrl}
                controls
                className="w-full h-16"
                aria-label="Generated audio preview"
              />
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-large w-full bg-green-600 hover:bg-green-700 active:bg-green-800 focus:ring-green-300"
            aria-label="Save to Memory Lane"
          >
            {saving ? 'Saving...' : 'Save to Memory Lane'}
          </button>
        </div>
      )}

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
    </div>
  );
}

