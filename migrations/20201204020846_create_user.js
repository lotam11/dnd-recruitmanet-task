
export const up =  function(knex) {
  return knex.schema
    .createTable("user", function (table) {
      table.increments(); // integer id
      table.string('identifier');
      table.string('password');
    })
};

export const down =  function(knex) {

};

export const config = { transaction: false };