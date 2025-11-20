# Reminisce - Digital Memory Anchor App

A tablet-first web application designed to serve as a daily anchor for individuals with early-to-mid-stage dementia. The app provides three core functions: Orientation (What day is it?), Connection (Who are my loved ones?), and Routine (What do I do next?).

## Features

- **Now Screen (Home)**: Displays current time, day of week, and next scheduled task
- **Memory Lane**: Photo album with captions and optional audio introductions
- **Who Is This? Game**: Gentle, error-free game to help remember family members
- **Photo Upload**: Family members can upload photos with captions and audio

## Design Principles

- One task per screen
- Minimum 24px font size (sans-serif)
- Minimum 80px button height
- Text labels instead of icons
- Persistent red "Home" button on all pages
- High contrast colors
- Error-free, gentle interactions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database** (Start in test mode for development)
4. Enable **Storage** (Start in test mode for development)
5. Go to Project Settings > General > Your apps
6. Copy your Firebase configuration values

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firestore Security Rules (Development)

For development, you can use these test mode rules. **For production, implement proper authentication and security rules.**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Storage Security Rules (Development)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read, write: if true;
    }
    match /audio/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project" and import your repository
5. Add your Firebase environment variables in Vercel's project settings
6. Deploy!

## Project Structure

```
src/
├── components/
│   ├── Home.jsx          # Main "Now" screen
│   ├── MemoryLane.jsx    # Photo album
│   ├── WhoIsThis.jsx     # Memory game
│   ├── Upload.jsx        # Photo upload form
│   ├── HomeButton.jsx    # Persistent home button
│   └── AudioPlayer.jsx   # Audio playback component
├── firebase/
│   └── config.js         # Firebase configuration
└── utils/
    └── timeUtils.js      # Time and task utilities
```

## Usage

1. **Home Screen**: Shows current time, day, and next task
2. **Photos**: Navigate through uploaded photos with captions and audio
3. **Game**: Practice recognizing family members
4. **Upload**: Family members can add new photos at `/upload`

## Technologies

- React 19
- React Router v7
- Tailwind CSS v4
- Firebase (Firestore + Storage)
- Vite

## License

MIT
