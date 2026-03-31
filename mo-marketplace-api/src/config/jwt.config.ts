export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET ?? 'mysecret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
});
