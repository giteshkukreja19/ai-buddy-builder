
import { HfInference } from "@huggingface/inference";

export interface TransformationStyle {
  id: string;
  name: string;
  description: string;
  model: string;
  prompt: string;
}

export const transformationStyles: TransformationStyle[] = [
  {
    id: "portrait-sketch",
    name: "Portrait Sketch",
    description: "Highly detailed hand-drawn portrait with fine pencil strokes and grayscale shading",
    model: "vinesmsuic/portraitsketch-diffusion",
    prompt: "Transform this image into a highly detailed, hand-drawn portrait sketch."
  },
  {
    id: "ghibli",
    name: "Studio Ghibli",
    description: "Soft, dreamy animation style with vibrant colors and whimsical elements",
    model: "nitrosocke/Ghibli-Diffusion",
    prompt: "Reimagine this image in the style of a Studio Ghibli animated film."
  },
  {
    id: "anime",
    name: "Anime Style",
    description: "Bold lines, vibrant colors, and expressive anime aesthetics",
    model: "cagliostrolab/animagine-xl-3.1",
    prompt: "Convert this image into anime style artwork with clean, bold outlines."
  },
  {
    id: "watercolor",
    name: "Watercolor Painting",
    description: "Soft, flowing watercolor art with gentle color blending",
    model: "cyborgcamel/WatercolorDiffusion",
    prompt: "Transform this image into a delicate watercolor painting."
  }
];

// Initialize the Hugging Face Inference client
export const inference = new HfInference();

export const applySimulatedTransform = (imageDataUrl: string, selectedStyle: string): Promise<string> => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageDataUrl); // Fallback if canvas context can't be created
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Apply a style based on selection (basic canvas filters)
      switch (selectedStyle) {
        case 'portrait-sketch':
          // Apply grayscale
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
          }
          ctx.putImageData(imageData, 0, 0);
          break;
          
        case 'ghibli':
          // Simulate Ghibli style with color saturation
          ctx.filter = 'saturate(130%) brightness(105%)';
          ctx.drawImage(img, 0, 0);
          break;
          
        case 'anime':
          // Simulate anime style with high contrast
          ctx.filter = 'contrast(120%) saturate(110%)';
          ctx.drawImage(img, 0, 0);
          break;
          
        case 'watercolor':
          // Simulate watercolor with blur and brightness
          ctx.filter = 'blur(1px) brightness(105%)';
          ctx.drawImage(img, 0, 0);
          break;
          
        default:
          // No filter
          break;
      }
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = imageDataUrl;
  });
};
