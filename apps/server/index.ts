import express from "express";
import type { Request, Response } from "express";
import { TrainModelSchema, GenerateImageSchema, GenerateImagesFromPackSchema } from "@repo/types";
import { prisma } from "@repo/db";

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 8080;

app.post("/model/train", async (req: Request, res: Response) => {
  const parsedBody = TrainModelSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({ error: parsedBody.error.message });
    return;
  }

  const { name, type, age, ethnicity, eyeColor, bald } = parsedBody.data;

  const model = await prisma.model.create({
    data: {
      name,
      type,
      age,
      ethnicity,
      eyeColor,
      bald,
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

  const images = await prisma.outputImages.create({
    data: {
      prompt,
      modelId,
      imageUrl: "",
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

  const images = await prisma.outputImages.createManyAndReturn({
    data:
      prompts.map((prompt) => ({
        prompt: prompt.prompt,
        modelId,
        imageUrl: "",
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
  console.log(req.body);
  //TODO: update the model status to generated
  res.status(200).json({ message: "Webhook received" });
});

app.post("/fal-ai/webhook/train", async(req, res) => {
  console.log(req.body);
  //TODO: update the model status to trained
  res.status(200).json({ message: "Webhook received" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});