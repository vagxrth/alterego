import { fal } from "@fal-ai/client";
import { BaseModel } from "./BaseModel";

export class FalAIModel extends BaseModel {
  constructor() {
    super();
  }

  private async generateImage(prompt: string, tensorPath: string) {
    const result = await fal.subscribe("fal-ai/flux-lora", {
        input: {
          prompt: prompt,
          loras: [{ path: tensorPath, scale: 1 }],
        }
      });

      return result;
  }

  private async trainModel(inputImages: string[], triggerWord: string) {

  }
}