
exports.up = function(knex, Promise) {
  return knex.schema.createTable('monitor_units', table => {
      table.increments('id');
      table.integer('uniqueId');
      table.string('name', 150);
      table.string('ip', 45);
      table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('monitor_units');
};
