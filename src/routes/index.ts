import express from 'express';
import multer from 'multer';

import { searchContoller } from '../controllers/search.controller';
import { uploadContoller } from '../controllers/upload.controller';

const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.post('/upload', upload.single('file'), uploadContoller);

router.get('/search/:username', searchContoller);

export default router;
