import { prismaClient } from './../../../packages/db/index';
import { TrainModel } from './../../../packages/schema/types';
import express from 'express';

const PORT = process.env.PORT || 8080;

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
            bald: parsedBody.data.bald
        }
    })

    res.json({
        modelId: data.id
    })
})

app.post('/generate', (req, res) => {

})

app.post('/pack/generate', (req, res) => {

})

app.get('/pack/bulk', (req, res) => {

})

app.get('/image', (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})