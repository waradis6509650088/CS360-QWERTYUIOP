'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi }) {
    // Get the authenticated role
    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (authenticatedRole) {
      const permissionsToUpdate = [
        // Article permissions
        { action: 'api::article.article.create', role: authenticatedRole.id },
        { action: 'api::article.article.update', role: authenticatedRole.id },
        { action: 'api::article.article.delete', role: authenticatedRole.id },
        { action: 'api::article.article.find', role: authenticatedRole.id },
        { action: 'api::article.article.findOne', role: authenticatedRole.id },

        // Upload permissions
        {
          action: 'plugin::upload.content-api.upload',
          role: authenticatedRole.id,
        },
        {
          action: 'plugin::upload.content-api.destroy',
          role: authenticatedRole.id,
        },

        // Category permissions
        { action: 'api::category.category.find', role: authenticatedRole.id },
        {
          action: 'api::category.category.findOne',
          role: authenticatedRole.id,
        },
      ];

      for (const perm of permissionsToUpdate) {
        // Check if the permission exists
        const existingPermission = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: perm });

        if (existingPermission) {
          // Update the existing permission to be enabled
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: true },
          });
        } else {
          // Create the permission if it doesn't exist
          await strapi.query('plugin::users-permissions.permission').create({
            data: { ...perm, enabled: true },
          });
        }
      }

      console.log('Permissions for Authenticated role set successfully.');
    }
  },
};
