module.exports = async (ctx, next) => {
  if (!ctx.request.header.authorization) {
    return ctx.unauthorized('No token provided');
  }

  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = strapi.plugins['users-permissions'].services.jwt.verify(token);
    
    ctx.state.user = decoded;
    return await next();
  } catch (err) {
    return ctx.unauthorized('Invalid token');
  }
};
