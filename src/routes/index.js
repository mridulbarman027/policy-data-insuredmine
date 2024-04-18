import express from 'express';
import multer from 'multer';

import { messageContoller } from '../controllers/message.controller.js';
import { searchContoller } from '../controllers/search.controller.js';
import { uploadContoller } from '../controllers/upload.controller.js';
import { userPoliciesContoller } from '../controllers/user.policies.controller.js';

const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.post('/upload', upload.single('file'), uploadContoller);

router.get('/search/:username', searchContoller);

router.get('/user_policies', userPoliciesContoller);

router.post('/message', messageContoller);

export default router;
