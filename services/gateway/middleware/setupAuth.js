import { verifyToken } from "./auth.js"; //NOTE: remember to include the path including .js
import checkRole from "./checkRole.js";

export const setupAuth = (app, routes) => {
    routes.forEach(r => {
        if (r.auth) {
            app.use(r.url, verifyToken);
            if (r.role) {
                app.use(r.url, checkRole(r.role));
            }
        }
    });
};