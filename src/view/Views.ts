import { Photo } from './model/Photo'; // Dostosuj ścieżkę do pliku z interfejsem/klasą Photo

export class Views {
  private static pageTemplate(title: string, content: string, sessionAuthorise?: string): string {
    return `
      <!DOCTYPE html>
        <html lang="pl">
          <head>
              <meta charset="utf-8">    
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${title}</title>
              <link href="/styles.css" rel="stylesheet" type="text/css">
              <script>
                const savedColor = sessionStorage.getItem('bgColor');
                if (savedColor) {
                  document.documentElement.style.setProperty('--bg-color', savedColor);
                }
              </script>
          </head>
          <body>
            <div class="image-container">
              <img src="https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638882786/EducationHub/photos/sun-blasts-a-m66-flare.jpg" alt="Sample Image">
            </div>

            <!-- Menu -->
            <div class="menu">
              <a href="/home">Home</a>
              <a href="/about">About</a>
              <a href="/map">Map</a>
              <a href="/portfolio">Portfolio</a>
              <a href="/gallery">Galeria</a>
              <a href="/contact">Contact</a>
              <a href="/style">Style</a>
              ${!sessionAuthorise ? `<a href="/login">Login</a>` : ''}
              ${sessionAuthorise ? `<a href="/logout">Witaj ${sessionAuthorise}, wyloguj</a>` : ''}
            </div>

            <!-- Content Section -->
            <div class="content">
              ${content}
            </div>
            
            <div class="footer">
              <p>Kontakt do administratora strony: <a href="mailto:mrc.matras@gmail.com">admin</a></p>
              <p>Licznik gości:</p>
              <script type="text/javascript" src="https://freevisitorcounters.com/en/home/counter/1449953/t/3"></script>
            </div>
          </body>
        </html>
    `;
  }

  static getHomePage(authorise: string): string {
    return this.pageTemplate('Home Page', `
      <div id="home" class="content">
        <h2>Welcome to the Home Page</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    `, authorise)
  }
  
  static getAboutPage(authorise: string): string {
    return this.pageTemplate('About Us Page',
      `
        <div id="about" class="content">
          <h2>About Us</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      `, authorise
    )
  }
  
  static getMapPage(authorise: string): string {
    return this.pageTemplate('Map Page', `
      <div id="map" class="content">
        <h2>Map</h2>
        <iframe
          width="600"
          height="450"
          style="border:0"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2563.037860918468!2d19.9328481!3d50.0541115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b6d053619f5%3A0xacb9dfc4d67fa598!2sZamek%20Kr%C3%B3lewski%20na%20Wawelu!5e0!3m2!1spl!2spl!4v1700000000000"
        >
        </iframe>
      </div>
    `, authorise)
  }
  
  static getPortfolioPage(authorise: string): string {
    return this.pageTemplate('Portfolio Page', `
      <div id="portfolio" class="content">
        <h2>Portfolio</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    `, authorise)
  }
  
  static getContactPage(
    authorise: string,
    data?: Record<'create_time' | 'name', string>[]
  ): string {

    // 1. Generujemy wiersze tabeli, jeśli dane istnieją i nie są puste
    const tableRows = data && data.length > 0
      ? data.map(row => `
          <tr>
            <td>${row.name}</td>
            <td>${new Date(row.create_time).toLocaleDateString('pl-PL')}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="2">Brak danych do wyświetlenia</td></tr>';

    // 2. Składamy całą tabelę HTML
    const tableHtml = `
      <table class="contact-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Data utworzenia</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    // 3. Wstrzykujemy tabelę do głównego szablonu
    return this.pageTemplate(
      'Contact Page',
      `
        <div id="contact" class="content">
          <h2>Contact Us</h2>
          <div>
            ${tableHtml}
          </div>
        </div>
      `,
      authorise
    );

    // return this.pageTemplate(
    //   'Contact Page',
    //   `
    //     <div id="contact" class="content">
    //       <h2>Contact Us</h2>
    //       <div>
    //         ${data ?? []}
    //       </div>
    //     </div>
    //   `,
    //   authorise
    // )
  }

  static getLoginPage(): string {
    return this.pageTemplate('Login Page', `
      <div id="contact" class="content">
        <h2>Login Page</h2>
        <form action="/submit-data" method="POST">
          <label for="name">Imię:</label><br>
          <input type="text" id="name" name="name" required><br><br>

          <label for="email">Email:</label><br>
          <input type="email" id="email" name="email" required><br><br>

          <input type="submit" value="Wyślij">
        </form>

      </div>
    `)
  }

  static getStylePage(authorise: string): string {
    return this.pageTemplate('Style Page', `
      <div id="style" class="content">
        <h2>Choose your style!</h2>
        <p><a href="javascript:void(0)" onclick="tempMenuColor('white')">White menu</a></p>
        <p><a href="javascript:void(0)" onclick="tempMenuColor('red')">Red menu</a></p>
        <p><a href="javascript:void(0)" onclick="permMenuColor('black')">Black menu FOREVER!</a></p>
        <p><a href="javascript:void(0)" onclick="permMenuColor('white')">White menu FOREVER!</a></p>
      </div>

      <script>
        const menuDiv = document.querySelector('.menu');

        // Function to change menu background color temporarily
        function tempMenuColor(color) {
          menuDiv.style.backgroundColor = color;
        }

        // Function to change menu background color for the duration of session
        function permMenuColor(color) {
          menuDiv.style.backgroundColor = color;
          sessionStorage.setItem('bgColor', color);
          // document.documentElement.style.setProperty('--bg-color', color);
          
        }
      </script>
    `, authorise)
  }

  // ==========================================
  // ZADANIE 5: GALERIA ZDJĘĆ
  // ==========================================

  /**
   * Generuje wspólne menu nawigacyjne dla sekcji galerii (lewy panel)
   */
  static getGallerySidebar(activeCategory?: string): string {
    const categories = [
      { id: 'standing', label: 'Postać stojąca' },
      { id: 'sitting', label: 'Postać siedząca' },
      { id: 'portraits', label: 'Portrety' },
      { id: 'interesting', label: 'Ciekawe' },
      { id: 'perspective', label: 'Perspektywy' },
    ];

    const categoryLinks = categories
      .map(
        (cat) => `
        <a href="/gallery?category=${cat.id}" class="${activeCategory === cat.id ? 'active' : ''}">
          ${cat.label}
        </a>
      `
      )
      .join('');

    return `
      <div class="gallery-sidebar">
        ${categoryLinks}
        <hr />
        <a href="/gallery/add" class="add-btn">Dodaj zdjęcie</a>
      </div>
    `;
  }

  /**
   * Widok wyświetlania galerii zdjęć (dwukolumnowy układ)
   */
  static getGalleryPage(authorise: string, photos: Photo[], currentCategory: string = 'standing'): string {
    const sidebarHtml = this.getGallerySidebar(currentCategory);

    // Generowanie tabeli/listy ze zdjęciami z prawego panelu
    const photosRowsHtml = photos.length > 0
      ? photos
          .map(
            (photo) => `
            <tr>
              <td class="photo-cell">
                <img src="/photos/${photo.galeria}/${photo.link}" alt="${photo.komentarz}" />
              </td>
              <td class="comment-cell">
                ${photo.komentarz}
              </td>
            </tr>
          `
          )
          .join('')
      : `<tr><td colspan="2" style="text-align:center; padding: 20px;">Brak zdjęć w tej kategorii.</td></tr>`;

    const content = `
      <style>
        .gallery-container {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }
        .gallery-sidebar {
          width: 200px;
          border: 1px solid #ccc;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          background-color: #f9f9f9;
        }
        .gallery-sidebar a {
          text-decoration: none;
          color: #333;
          padding: 6px 10px;
          border-radius: 4px;
        }
        .gallery-sidebar a:hover, .gallery-sidebar a.active {
          background-color: #e0e0e0;
          font-weight: bold;
        }
        .gallery-sidebar a.add-btn {
          color: #d9534f;
          font-weight: bold;
        }
        .gallery-main {
          flex: 1;
        }
        .gallery-table {
          width: 100%;
          border-collapse: collapse;
        }
        .gallery-table td {
          border: 1px solid #333;
          padding: 10px;
          vertical-align: middle;
        }
        .photo-cell {
          width: 150px;
          text-align: center;
        }
        .photo-cell img {
          max-width: 120px;
          max-height: 120px;
          object-fit: contain;
        }
        .comment-cell {
          font-size: 1.1em;
        }
      </style>

      <h2>Internetowa Galeria Zdjęć</h2>
      <div class="gallery-container">
        <!-- Lewy panel (Menu) -->
        ${sidebarHtml}

        <!-- Prawy panel (Zdjęcia) -->
        <div class="gallery-main">
          <table class="gallery-table">
            <tbody>
              ${photosRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return this.pageTemplate('Galeria Zdjęć', content, authorise);
  }

  /**
   * Widok formularza dodawania nowego zdjęcia
   */
  static getAddPhotoPage(authorise: string): string {
    const sidebarHtml = this.getGallerySidebar();

    const content = `
      <style>
        .gallery-container {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }
        .gallery-sidebar {
          width: 200px;
          border: 1px solid #ccc;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          background-color: #f9f9f9;
        }
        .gallery-sidebar a {
          text-decoration: none;
          color: #333;
          padding: 6px 10px;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }
        .upload-form label {
          font-weight: bold;
        }
        .upload-form input, .upload-form select, .upload-form textarea {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
      </style>

      <h2>Dodaj Nowe Zdjęcie</h2>
      <div class="gallery-container">
        <!-- Lewy panel (Menu) -->
        ${sidebarHtml}

        <!-- Prawy panel (Formularz) -->
        <div class="gallery-main">
          <form action="/gallery/add" method="POST" enctype="multipart/form-data" class="upload-form">
            <div>
              <label for="galeria">Kategoria / Galeria:</label>
              <select name="galeria" id="galeria" required>
                <option value="standing">Postać stojąca</option>
                <option value="sitting">Postać siedząca</option>
                <option value="portraits">Portrety</option>
                <option value="interesting">Ciekawe</option>
                <option value="perspective">Perspektywy</option>
              </select>
            </div>

            <div>
              <label for="photo">Wybierz plik ze zdjęciem:</label>
              <input type="file" id="photo" name="photo" accept="image/*" required />
            </div>

            <div>
              <label for="komentarz">Komentarz / Opis:</label>
              <textarea id="komentarz" name="komentarz" rows="3" placeholder="Wpisz opis zdjęcia..."></textarea>
            </div>

            <div>
              <input type="submit" value="Zapisz zdjęcie" style="background-color: #4CAF50; color: white; cursor: pointer; border: none; padding: 10px;" />
            </div>
          </form>
        </div>
      </div>
    `;

    return this.pageTemplate('Dodaj zdjęcie', content, authorise);
  }
}