import { Request, Response } from 'express';
import 'multer';
import { PhotoModel } from '../model/Photo';

export const getGallery = async (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'standing';
  const photos = await PhotoModel.getByCategory(category);
  
  // Renderowanie widoku głównego z przekazaniem zdjęć i aktualnej kategorii
  res.render('gallery.ejs', { photos, currentCategory: category });
};

export const getAddPhotoForm = (req: Request, res: Response) => {
  res.render('add-photo');
};

export const postAddPhoto = async (req: Request, res: Response) => {
  const { galeria, komentarz } = req.body;
  const filename = req.file?.filename; // Nazwa zapisanego pliku przez Multer

  if (filename) {
    await PhotoModel.addPhoto(filename, galeria, komentarz);
  }

  res.redirect(`/?category=${galeria}`);
};
