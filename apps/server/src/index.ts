import { prismaClient } from './../../../packages/db/index';
import { GenerateImage, GenerateImageFromPack, TrainModel } from './../../../packages/schema/types';
import express from 'express';

const PORT = process.env.PORT || 8080;
const USER_ID = "0410"

const app = express();
app.use(express.json())

app.post('/train', async(req, res) => {
    const parsedBody = TrainModel.safeParse(req.body)

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Incorrect Inputs!"
        })
        return
    }
    const data = await prismaClient.model.create({
        data: {
            name: parsedBody.data.name,
            type: parsedBody.data.type,
            age: parsedBody.data.age,
            ethinicity: parsedBody.data.ethinicity,
            eyeColor: parsedBody.data.eyeColor,
            bald: parsedBody.data.bald,
            userId: USER_ID
        }
    })

    res.json({
        modelId: data.id
    })
})

app.post('/generate', async(req, res) => {
    const parsedBody = GenerateImage.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Incorrect Inputs!"
        })
        return
    }

    const data = await prismaClient.outputImages.create({
        data: {
            prompt: parsedBody.data.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageURL: ""
        }
    })

    res.json({
        imageId: data.id
    })
})

app.post('/pack/generate', async(req, res) => {
    const parsedBody = GenerateImageFromPack.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(411).json({
            message: "Incorrect Inputs!"
        })
        return
    }

    const prompts = await prismaClient.packPrompts.findMany({
        where: {
            packId: parsedBody.data.packId
        }
    })

    const images = await prismaClient.outputImages.createManyAndReturn({
        data: prompts.map((prompt) => ({
            prompt: prompt.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageURL: ""
        }))
    })

    res.json({
        images: images.map((image) => image.id)
    })
})

app.get('/pack/bulk', async(req, res) => {
    const packs = await prismaClient.packs.findMany({})
    res.json({
        packs
    })
})

app.get('/image', (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})