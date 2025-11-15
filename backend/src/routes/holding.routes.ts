// src/routes/holding.routes.ts
import { Router } from 'express';
import * as holdingController from '../controllers/holding.controller';

const router = Router();

// Holding routes
router.post('/:portfolioId/holding/:holdingId/peers', holdingController.findPeers);
router.post('/:portfolioId/holding/:holdingId/replace', holdingController.replaceHolding);

export default router;