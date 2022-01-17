import {render, html, page} from './lib.js';
import { homePage } from './views/home.js';

import * as api from './api/data.js';
import { loginPage } from './views/login.js';
import { logout } from './api/api.js';
import { getUserData } from './util.js';
import { registerPage } from './views/register.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { editPage } from './views/edit.js';
import { detailsPage } from './views/details.js';

window.api = api;


const root = document.getElementById('main-content');
document.getElementById('logoutBtn').addEventListener('click', onLogout);


updateUserNav();

page(decorateContext);

page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/catalog', catalogPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/details/:id', detailsPage);
page.start();




function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;
    next();
}

function updateUserNav() {
    const userData = getUserData();

    if(userData) {
        document.getElementById('user').style.display = 'block';
        document.getElementById('guest').style.display  = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display  = 'block';
    }
}

function onLogout() {
    
    logout();
    updateUserNav();
    page.redirect('/');
   


}