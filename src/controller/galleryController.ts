import { Request, Response } from 'express';
import 'multer';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { PhotoModel } from '../model/Photo';
import { Views } from '../view/Views'; // 1. Zaimportuj klasę Views

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getGallery = async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || 'standing';
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 1;

    const { photos, totalPages, currentPage } = await PhotoModel.getByCategoryPaginated(category, page, limit);
    
    // Jeśli używasz sesji, pobierz autora (np. req.session.user), w przeciwnym razie przekaż pusty string ''
    const authorise = (req.session as any)?.user || '';

    // 2. Wygeneruj HTML za pomocą metody statycznej i wyślij przez res.send()
    const html = Views.getGalleryPage(authorise, photos, category, currentPage, totalPages);
    res.send(html);
  } catch (error) {
    console.error('Błąd w getGallery:', error);
    res.status(500).send('Błąd serwera podczas ładowania galerii');
  }
};

export const getAddPhotoForm = (req: Request, res: Response) => {
  const authorise = (req.session as any)?.user || '';
  
  // Zastąp res.render('add-photo') wywołaniem gotowego widoku
  const html = Views.getAddPhotoPage(authorise);
  res.send(html);
};

export const postAddPhoto = async (req: Request, res: Response) => {
  try {
    const { galeria, komentarz } = req.body;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: `gallery/${galeria}`,
      });

      await PhotoModel.addPhoto(uploadResult.secure_url, galeria, komentarz);
    }

    res.redirect(`/gallery?category=${galeria}`);
  } catch (error) {
    console.error('Błąd w postAddPhoto:', error);
    res.status(500).send('Błąd serwera podczas dodawania zdjęcia');
  }
};

export const postDeletePhoto = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.body.id, 10);
    const category = (req.body.category as string) || 'standing';

    if (id) {
      const photo = await PhotoModel.getById(id);

      if (photo) {
        if (photo.link.startsWith('http')) {
          const match = photo.link.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
          if (match && match[1]) {
            await cloudinary.uploader.destroy(match[1]);
          }
        } else {
          const filePath = path.join(process.cwd(), 'public', 'photos', photo.galeria, photo.link);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        await PhotoModel.deletePhoto(id);
      }
    }

    res.redirect(`/gallery?category=${category}`);
  } catch (error) {
    console.error('Błąd w postDeletePhoto:', error);
    res.status(500).send('Błąd serwera podczas usuwania zdjęcia');
  }
};
