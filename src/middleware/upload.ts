import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Odczyt kategorii przesłanej w formularzu (lub domyślna 'standing')
    const category = req.body.galeria || 'standing';

    // process.cwd() zawsze wskazuje na katalog główny projektu
    const dest = path.join(process.cwd(), 'public', 'photos', category);

    // Automatyczne utworzenie folderu docelowego, jeśli jeszcze nie istnieje
    fs.mkdirSync(dest, { recursive: true });

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Unikalna nazwa pliku (znacznik czasu + oczyszczona oryginalna nazwa)
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_');
    const uniqueName = `${Date.now()}-${sanitizedOriginalName}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
