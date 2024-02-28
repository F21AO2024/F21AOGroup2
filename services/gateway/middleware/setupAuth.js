import { verifyToken } from "./auth.js"; //NOTE: remember to include the path including .js

export const setupAuth = (app, routes) => {
    routes.forEach(r => {
        if (r.auth) {
            app.use(r.url, verifyToken);
        }
    });
};