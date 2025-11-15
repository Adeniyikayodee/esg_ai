// src/routes/portfolio.routes.ts
import { Router } from 'express';
import multer from 'multer';
import * as portfolioController from '../controllers/portfolio.controller';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Portfolio routes
router.post('/upload', upload.single('file'), portfolioController.uploadPortfolio);
router.get('/:id', portfolioController.getPortfolio);
router.post('/:id/analyse', portfolioController.analysePortfolio);

export default router;