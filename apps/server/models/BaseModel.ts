export abstract class BaseModel {
  constructor() {}

  public abstract generateImage(prompt: string, tensorPath: string): Promise<{ request_id: string; response_url: string; }>;

  public abstract trainModel(zipUrl: string, triggerWord: string): Promise<{ request_id: string; response_url: string; }>;
}