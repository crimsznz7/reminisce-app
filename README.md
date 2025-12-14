# Reminisce - Digital Memory Anchor App

A tablet-first web application designed to serve as a daily anchor for individuals with early-to-mid-stage dementia. The app provides three core functions: Orientation (What day is it?), Connection (Who are my loved ones?), and Routine (What do I do next?).

## Features

- **Now Screen (Home)**: Displays current time, day of week, and next scheduled task
- **Memory Lane**: Photo album with captions and optional audio introductions (family photos and AI-generated animal memories)
- **Who Is This? Game**: Gentle, error-free game to help remember family members and animals
- **Photo Upload**: Family members can upload photos with captions and audio
- **AI Animal Generator**: Caregivers can generate animal memories using OpenAI DALL-E 3 and text-to-speech (password-protected settings)

## Design Principles

- One task per screen
- Minimum 24px font size (sans-serif)
- Minimum 80px button height
- Text labels instead of icons
- Persistent red "Home" button on all pages
- High contrast colors
- Error-free, gentle interactions

## AI Animal Generation

The app includes an AI-powered animal memory generator for caregivers:
- Access via Settings menu (password: `caregiver2024`)
- Uses OpenAI DALL-E 3 for image generation
- Uses OpenAI TTS for audio narration
- Generated animals appear in Memory Lane and the game

**Environment Variable Required:**
- `OPENAI_API_KEY` - Add this to Vercel environment variables (not as VITE_ prefix since it's server-side)