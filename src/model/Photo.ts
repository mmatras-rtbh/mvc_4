import { PG } from './Pg';

// Interfejs reprezentujący strukturę rekordu w tabeli tabela1
export interface Photo {
  id?: number;
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
    const query = 'SELECT * FROM tabela1 WHERE galeria = $1 ORDER BY id ASC';
    
    // pg-promise: method .any() zwraca tablicę obiektów
    return await PhotoModel.pg.db.any<Photo>(query, [category]);
  }

  /**
   * Pobiera porcję zdjęć dla danej kategorii z uwzględnieniem stronicowania (pagination)
   */
  static async getByCategoryPaginated(category: string, page: number = 1, limit: number = 3) {
    const offset = (page - 1) * limit;

    // Pobieramy ograniczoną liczbę rekordów dla konkretnej strony
    const photosQuery = `
      SELECT * FROM tabela1 
      WHERE galeria = $1 
      ORDER BY id ASC 
      LIMIT $2 OFFSET $3
    `;

    // Pobieramy całkowitą liczbę zdjęć w tej kategorii
    const countQuery = `
      SELECT COUNT(*) as total FROM tabela1 WHERE galeria = $1
    `;

    const photos = await PhotoModel.pg.db.any<Photo>(photosQuery, [category, limit, offset]);
    const countResult = await PhotoModel.pg.db.one<{ total: string }>(countQuery, [category]);

    const totalItems = parseInt(countResult.total, 10);
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      photos,
      totalItems,
      totalPages,
      currentPage: page,
    };
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