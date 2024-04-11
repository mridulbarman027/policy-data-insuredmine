import express from 'express';
import multer from 'multer';

import { uploadContoller } from '../controllers/upload.controller';

const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.post('/upload', upload.single('file'), uploadContoller);

export default router;
