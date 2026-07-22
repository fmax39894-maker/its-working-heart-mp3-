import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import multer from "multer";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import Tesseract from "tesseract.js";
import { v4 as uuid } from "uuid";
import mime from "mime-types";

const app = express();
const PORT = process.env.PORT || 3000;

await fs.ensureDir("uploads");
await fs.ensureDir("temp");
await fs.ensureDir("outputs");

app.use(helmet());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan("combined"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuid() + ext);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024
    }
});

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "Professional Text Extractor API",
        version: "1.0.0",
        endpoints: [
            "/extract",
            "/extract-url",
            "/health"
        ]
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "online",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});
// Image preprocessing + OCR helper

async function preprocessImage(inputPath) {
    const outputPath = `temp/${uuid()}.png`;

    await sharp(inputPath)
        .rotate()
        .grayscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(outputPath);

    return outputPath;
}

async function extractTextFromImage(imagePath) {
    const processed = await preprocessImage(imagePath);

    try {
        const result = await Tesseract.recognize(
            processed,
            "eng",
            {
                logger: () => {}
            }
        );

        return result.data.text.trim();

    } finally {
        await fs.remove(processed);
    }
}

app.post("/extract", upload.single("image"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image uploaded."
        });
    }

    try {

        const text = await extractTextFromImage(req.file.path);

        await fs.remove(req.file.path);

        res.json({
            success: true,
            characters: text.length,
            text
        });

    } catch (err) {

        console.error(err);

        await fs.remove(req.file.path);

        res.status(500).json({
            success: false,
            message: "OCR failed."
        });
    }
});