import express from "express";

const app = express();

const PORT = process.env.PORT || 8080;

app.post("/model/train", (req, res) => {
  
});

app.post("/model/generate", (req, res) => {
  
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