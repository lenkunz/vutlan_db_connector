
exports.up = function(knex, Promise) {
  return knex.schema.createTable('sensor_histories', table => {
      table.increments('id');
      table.string('valueType', 50);
      table.string('status', 150);
      table.string('value', 150);
      table.string('deviceType').nullable();

      table.integer('sensor_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('sensors')
        .onDelete('cascade');
        
      table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sensor_histories');
};
