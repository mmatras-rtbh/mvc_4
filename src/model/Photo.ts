import { PG } from './Pg';

// Interfejs reprezentujący strukturę rekordu w tabeli tabela1
export interface Photo {
  idt?: number;
  link: string;
  galeria: string;
  komentarz: string;
}

export class PhotoModel {
  // Pobranie instancji bazy danych (Singleton)
  private static pg = PG.getInstance();

  /**
   * Pobiera wszystkie zdjęcia przypisane do danej kategorii (galerii)
   */
  static async getByCategory(category: string): Promise<Photo[]> {
    const query = 'SELECT * FROM tabela1 WHERE galeria = $1 ORDER BY idt ASC';
    
    // pg-promise: method .any() zwraca tablicę obiektów
    return await PhotoModel.pg.db.any<Photo>(query, [category]);
  }

  /**
   * Dodaje nowy rekord zdjęcia do bazy danych
   */
  static async addPhoto(link: string, galeria: string, komentarz: string): Promise<Photo> {
    const query = `
      INSERT INTO tabela1 (link, galeria, komentarz)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    // pg-promise: method .one() zwraca dokładnie jeden utworzony rekord dzięki RETURNING *
    return await PhotoModel.pg.db.one<Photo>(query, [link, galeria, komentarz]);
  }
}