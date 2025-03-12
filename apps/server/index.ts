import { prismaClient } from '../../packages/db/index';
import { GenerateImage, GenerateImageFromPack, TrainModel } from '../../packages/schema/types';
import express from 'express';
import { FalAIModel } from './models/FalAIModel';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 8080;
const USER_ID = "0410"
const falAIClient = new FalAIModel();

const s3Client = new S3Client({
    region: 'auto',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || '',
        secretAccessKey: process.env.SECRET_KEY || ''
    },
    endpoint: process.env.ENDPOINT
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.get('/pre-signed-url', async (req, res) => {
    try {
        const key = `models/${Date.now()}_${Math.random()}.zip`;
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME || '',
            Key: key
        });
        
        console.log('Creating presigned URL with:', {
            bucket: process.env.BUCKET_NAME,
            key,
            region: 'auto',
            endpoint: process.env.ENDPOINT
        });
        
        const url = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 5
        });
        
        console.log('Generated presigned URL:', url);
        
        res.json({
            url,
            key
        });
    } catch (error: any) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({
            error: 'Failed to generate presigned URL',
            message: error.message || 'Unknown error'
        });
    }
});

app.post('/train', async(req, res) => {
    const parsedBody = TrainModel.safeParse(req.body)
    const images = req.body.images;

    if (!parsedBody.success) {
        res.status(411).json({
            message: "Incorrect Inputs!"
        })
        return
    }

    const { request_id } = await falAIClient.trainModel(parsedBody.data.zipURL, parsedBody.data.name)

    const data = await prismaClient.model.create({
        data: {
            name: parsedBody.data.name,
            type: parsedBody.data.type,
            age: parsedBody.data.age,
            ethinicity: parsedBody.data.ethinicity,
            eyeColor: parsedBody.data.eyeColor,
            bald: parsedBody.data.bald,
            userId: USER_ID,
            zipURL: parsedBody.data.zipURL,
            falAIRequestId: request_id
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

    const model = await prismaClient.model.findUnique({
        where: {
            id: parsedBody.data.modelId
        }
    })

    if (!model || !model.tensorPath) {
        res.status(411).json({
            message: "Model Not Found!"
        })
        return;
    }

    const { request_id } = await falAIClient.generateImage(parsedBody.data.prompt, model?.tensorPath)

    const data = await prismaClient.outputImages.create({
        data: {
            prompt: parsedBody.data.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageURL: "",
            falAIRequestId: request_id
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

    let requestIds: { request_id: string }[] = await Promise.all(prompts.map((prompt) => falAIClient.generateImage(prompt.prompt, parsedBody.data.modelId)))

    const images = await prismaClient.outputImages.createManyAndReturn({
        data: prompts.map((prompt, index) => ({
            prompt: prompt.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageURL: "",
            falAIRequestId: requestIds[index].request_id 
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

app.get('/image/bulk', async(req, res) => {
    const ids = req.query.ids as string[]
    const limit = req.query.limit as string ?? "10"
    const offset = req.query.offset as string ?? "0"

    const imagesData = await prismaClient.outputImages.findMany({
        where: {
            id: { in: ids },
            userId: USER_ID
        },
        skip: parseInt(offset),
        take: parseInt(limit)
    })

    res.json({
        images: imagesData
    })
})

app.post('/fal-ai/webhook/train', async(req, res) => {
    const requestId = req.body.request_id;
    await prismaClient.model.updateMany({
        where: {
            falAIRequestId: requestId
        },
        data: {
            trainingStatus: "Generated",
            tensorPath: req.body.tensor_path
        }
    })
    res.json({
        message: "Webhook Received!"
    })
})

app.post('/fal-ai/webhook/image', async(req, res) => {
    const requestId = req.body.request_id;
    await prismaClient.outputImages.updateMany({
        where: {
            falAIRequestId: requestId
        },
        data: {
            status: "Generated",
            imageURL: req.body.image_url
        }
    })
    res.json({
        message: "Webhook Received!"
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})