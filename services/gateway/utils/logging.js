import morgan from 'morgan';

export const logger  = (app) => {
  app.use(morgan('combined'));
}
