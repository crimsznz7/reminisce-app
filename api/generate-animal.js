import OpenAI from 'openai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Extract prompt from request body
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }

    const animalName = prompt.trim();

    // Dementia-friendly prompt engineering
    const enhancedPrompt = `A realistic, high-quality photo of a gentle ${animalName} in nature, bright colors, clear visibility, easy to recognize`;

    // Generate image using DALL-E 3
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = imageResponse.data[0].url;

    // Generate audio using TTS
    const audioText = `This is a ${animalName}`;
    const audioResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: audioText,
    });

    // Convert audio buffer to base64
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    // Return both image URL and audio as base64
    return res.status(200).json({
      image_url: imageUrl,
      audio_base64: audioBase64,
      animal_name: animalName,
    });
  } catch (error) {
    console.error('Error generating animal memory:', error);
    
    // Don't expose API key or internal errors
    const errorMessage = error.message || 'Failed to generate animal memory';
    
    return res.status(500).json({
      error: 'An error occurred while generating the animal memory. Please try again.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}

