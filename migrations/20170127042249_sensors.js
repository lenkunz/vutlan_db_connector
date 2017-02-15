
exports.up = function(knex, Promise) {
  return knex.schema.createTable('sensors', table => {
      table.increments('id');
      table.integer('uniqueId');
      table.string('name', 150);
      table.string('type', 100);
      table.string('status', 100);
      table.string('value', 100);
      table.string('deviceType', 100);

      table.float('lowAlarm').nullable();
      table.float('lowWarning').nullable();
      table.float('highAlarm').nullable();
      table.float('highWarning').nullable();
      table.float('at0').nullable();
      table.float('at75').nullable();
      table.float('pulse').nullable();

      table.integer('monitor_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('monitor_units')
        .onDelete('cascade');

      table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sensors');
};
