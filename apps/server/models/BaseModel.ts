export class BaseModel {
    constructor() {

    }

    public async generateImage(prompt: string, tensorPath: string): Promise<{ request_id: string; response_url: string }> {
        throw new Error("Method Not Implemented!");
    }

    public async trainModel(zipURL: string, triggerWord: string): Promise<{ request_id: string; response_url: string }> {
        throw new Error("Method Not Implemented!");
    }
}