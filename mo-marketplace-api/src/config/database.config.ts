export default () => ({
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5433),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'password',
    name: process.env.DB_NAME ?? 'mo_marketplace',
  },
});
