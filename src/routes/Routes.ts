import { Express } from 'express';
import express from 'express';
import { PageController } from '../controller/PageController';
import * as galleryController from '../controller/galleryController';
import { upload } from '../middleware/upload';
// import { mainPage } from '../view/Views';

export class Routes {
  constructor(
    private readonly server: Express,
    private readonly dir: string,
  ) {
    this.server.use(express.static(`${this.dir}/public/css`));
    this.server.get(`/`, PageController.getHomePage());
    this.server.get(`/home`, PageController.getHomePage());
    this.server.get(`/about`, PageController.getAboutPage());
    this.server.get(`/map`, PageController.getMapPage());
    this.server.get(`/portfolio`, PageController.getPortfolioPage());
    
    // Trasy dla galerii zdjęć
    this.server.get(`/gallery`, galleryController.getGallery);
    this.server.get(`/gallery/add`, galleryController.getAddPhotoForm);
    this.server.post(`/gallery/add`, upload.single('photo'), galleryController.postAddPhoto);
    this.server.post(`/gallery/delete`, galleryController.postDeletePhoto);

    this.server.get(`/contact`, PageController.getContactPage());
    this.server.get(`/style`, PageController.getStylePage());
    this.server.get(`/login`, PageController.getLoginPage());
    this.server.get(`/logout`, PageController.handleLogout);

    this.server.post(`/submit-data`, PageController.handleSubmitData);

    // this.server.get(`/kontakt`, PageController.getContactPage());
  }
}
