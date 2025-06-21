import express from "express";
import type { Request, Response } from "express";
import { TrainModelSchema, GenerateImageSchema, GenerateImagesFromPackSchema } from "@repo/types";
import { prisma } from "@repo/db";
import { FalAIModel } from "./models/FalAIModel";
import { S3Client } from "bun";
const app = express();

app.use(express.json());


const PORT = process.env.PORT || 8080;

const falAIModel = new FalAIModel();

app.get("/presigned-url", async (req: Request, res: Response) => {
  const key = `models/${Bun.randomUUIDv7()}.zip`;
  const url = S3Client.presign(key, {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    bucket: process.env.BUCKET_NAME,
    endpoint: process.env.ENDPOINT,
    expiresIn: 60 * 60,
  })
  res.status(200).json({ url, key });
});

app.post("/model/train", async (req: Request, res: Response) => {
  const parsedBody = TrainModelSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ error: parsedBody.error.message });
    return;
  }

  const { name, type, age, ethnicity, eyeColor, bald, zipUrl } = parsedBody.data;

  const { request_id } = await falAIModel.trainModel(zipUrl, name);

  const model = await prisma.model.create({
    data: {
      name,
      type,
      age,
      ethnicity,
      eyeColor,
      bald,
      zipUrl,
      requestId: request_id,
    },
  });

  res.status(200).json({ modelId: model.id });
});

app.post("/model/generate", async (req: Request, res: Response) => {
  const parsedBody = GenerateImageSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(411).json({ error: parsedBody.error.message });
    return;
  }

  const { prompt, modelId } = parsedBody.data;

  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });

  if (!model || !model.tensorPath) {
    res.status(404).json({ error: "Model not found" });
    return;
  }

  const { request_id } = await falAIModel.generateImage(prompt, model.tensorPath);

  const images = await prisma.outputImages.create({
    data: {
      prompt,
      modelId,
      imageUrl: "",
      requestId: request_id,
    },
  })

  res.status(200).json({ imageId: images.id });
});

app.post("/pack/generate", async (req: Request, res: Response) => {
  const parsedBody = GenerateImagesFromPackSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(411).json({ error: parsedBody.error.message });
    return;
  }

  const { packId, modelId } = parsedBody.data;

  const prompts = await prisma.packPrompts.findMany({
    where: {
      packId,
    },
  })

  const model = await prisma.model.findFirst({
    where: {
      id: modelId,
    },
  });

  if (!model || !model.tensorPath) {
    res.status(404).json({ error: "Model not found" });
    return; 
  }

  let requestIds: { request_id: string }[] = await Promise.all(prompts.map((prompt) => falAIModel.generateImage(prompt.prompt, model.tensorPath!)))

  const images = await prisma.outputImages.createManyAndReturn({
    data:
      prompts.map((prompt, index) => ({
        prompt: prompt.prompt,
        modelId,
        imageUrl: "",
        requestId: requestIds[index].request_id, 
      })),
  });

  res.status(200).json({ imageIds: images.map((image) => image.id) });
});

app.get("/packs", async(req, res) => {
  const packs = await prisma.pack.findMany();
  res.status(200).json({ packs });
});

app.get("/images", async(req, res) => {
  const imageIds = req.query.imageIds as string[];
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;
  
  if (!imageIds) {
    res.status(400).json({ error: "imageIds is required" });  
    return;
  }
  const images = await prisma.outputImages.findMany({
    where: {
      id: {
        in: imageIds,
      },
    },
    take: limit ? parseInt(limit) : 10,
    skip: offset ? parseInt(offset) : 0,
  });
  res.status(200).json({ images });
});

app.post("/fal-ai/webhook/generate", async(req, res) => {
  const { request_id, image_url } = req.body;
  
  await prisma.outputImages.updateMany({
    where: {
      requestId: request_id,
    },
    data: {
      status: "Completed",
      imageUrl: image_url,
    },
  });
});

app.post("/fal-ai/webhook/train", async(req, res) => {
  const { request_id, tensor_path } = req.body;
  
  await prisma.model.updateMany({
    where: {
      requestId: request_id,
    },
    data: {
      status: "Completed",
      tensorPath: tensor_path,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});