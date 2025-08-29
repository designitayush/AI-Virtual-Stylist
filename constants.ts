import type { Background } from './types';

export const INITIAL_PROMPT = `
You are a fashion-focused AI stylist. Your task is to generate a realistic virtual try-on preview.
The user has provided two images:
1. A photo of themselves (standing, facing camera, natural pose).
2. An outfit image (shirt, dress, jacket, pants, etc.).

Your goal is to overlay and blend the outfit seamlessly onto the user's body while adhering to these strict rules:
- **Preserve Identity:** Keep the user's natural skin tone, body shape, and facial details perfectly intact. Do not alter the person.
- **Accurate Fit:** Realistically adjust the outfit's scaling, folds, draping, and perspective to match the user's pose.
- **Photorealism:** Add natural shadows, lighting, and textures to make it look like the outfit is genuinely worn.
- **High-Quality Output:** The final image must be high-resolution and suitable for fashion e-commerce. It must look stylish, natural, and confidence-boosting, not like a photoshop edit.
`;

export const getRefinementPrompt = (type: 'prompt' | 'background', value: string | Background): string => {
    switch (type) {
        case 'prompt':
            return `Based on the provided image of a person wearing an outfit, apply the following textual edit: "${value}".
- You MUST preserve the person's identity (face, body shape, skin tone).
- Only modify what is requested in the edit.
- The final image must be photorealistic and high-quality.`;
        case 'background':
            let backgroundDescription = '';
            switch (value) {
                case 'White Studio':
                    backgroundDescription = 'a clean, minimalist white studio background with soft lighting.';
                    break;
                case 'City Street':
                    backgroundDescription = 'a stylish, slightly blurred city street scene, making it look like a fashion photoshoot.';
                    break;
                case 'Runway':
                    backgroundDescription = 'a fashion show runway with dramatic lighting.';
                    break;
            }
            return `Keep the person and their outfit exactly the same, but change the background to ${backgroundDescription}`;
    }
};
