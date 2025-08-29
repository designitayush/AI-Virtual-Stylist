export type Background = 'White Studio' | 'City Street' | 'Runway';

export interface GeminiResponse {
    image: string | null;
    text: string | null;
}
