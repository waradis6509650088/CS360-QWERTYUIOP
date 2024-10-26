module.exports = ({ env }) => ({
  scheduler: {
    enabled: true,
    config: {
      model: 'scheduler',
    },
  },
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});
