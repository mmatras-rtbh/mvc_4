import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Odczyt kategorii z body formularza
    const category = req.body.galeria || 'standing';
    cb(null, path.join(__dirname, `../public/photos/${category}`));
  },
  filename: (req, file, cb) => {
    // Zachowanie nazwy pliku lub dodanie timestampu
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });