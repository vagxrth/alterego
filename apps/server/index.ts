import express from "express";
import type { Request, Response } from "express";
import { TrainModelSchema, GenerateImageSchema, GenerateImagesFromPackSchema } from "@repo/types";
import { prisma } from "@repo/db";

const app = express();

app.use(express.json());


const PORT = process.env.PORT || 8080;

app.post("/model/train", async(req: Request, res: Response) => {
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

app.post("/model/generate", async(req: Request, res: Response) => {
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

app.post("/pack/generate", (req, res) => {
  
});

app.get("/packs", (req, res) => {
  
});

app.get("/images", (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});