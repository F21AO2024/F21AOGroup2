import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxies = (app, routes) => {
    routes.forEach(r => {
        app.use(r.url, createProxyMiddleware(r.proxy));
    })
}
