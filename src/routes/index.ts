import express from 'express';
import multer from 'multer';

import { messageContoller } from '../controllers/message.controller';
import { searchContoller } from '../controllers/search.controller';
import { uploadContoller } from '../controllers/upload.controller';
import { userPoliciesContoller } from '../controllers/user.policies.controller';

const upload = multer({ dest: 'temp/' });

const router = express.Router();

router.post('/upload', upload.single('file'), uploadContoller);

router.get('/search/:username', searchContoller);

router.get('/user_policies', userPoliciesContoller);

router.post('/message', messageContoller);

export default router;
