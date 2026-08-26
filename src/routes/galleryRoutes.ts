import { Router } from 'express';
import { getGallery, getAddPhotoForm, postAddPhoto } from '../controller/galleryController';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getGallery);
router.get('/add', getAddPhotoForm);
router.post('/add', upload.single('photo'), postAddPhoto);

export default router;