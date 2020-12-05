
export const up =  function(knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments(); // integer id
      table.string('identifier');
      table.string('hash');
    })
};

export const down =  function(knex) {

};

export const config = { transaction: false };