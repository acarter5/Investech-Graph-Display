var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://Home:psqlpwd@18.216.109.95:5432/company_data');
const faker = require('faker');

// GETS

const recordById = (id, callback) => {
  db.one(`SELECT * FROM companies WHERE id=${id}`)
    .then(function(data) {
      callback(null, data);
    })
    .catch(function(error) {
      callback(error, null);
    });
}

const recordByName = (name, callback) => {
  db.one(`SELECT * FROM companies WHERE name=${name}`)
    .then(function(data) {
      callback(null, data);
    })
    .catch(function(error) {
      callback(error, null);
      console.log(error);
    });
}

//POST

const addRecord = (name, prices, callback) => {
  db.none('INSERT INTO companies (name, prices) VALUES (${name}, ${prices})', {
    name: name,
    prices: prices
  })
    .then(function() {
      callback(null, 'record added')
    })
    .catch(function(error) {
      callback(error, null);
    });
}

//PUT

const updateRecordById = (id, name, prices, callback) => {
  db.one(`UPDATE companies SET name = ${name}, prices = ${prices} where id = ${id}`)
    .then(function() {
      // console.log('record updated');
    })
    .catch(function(error) {
      callback(error, null);
      console.log(error);
    });
}

const updateRecordByName = (name, prices, callback) => {
  db.one(`UPDATE companies SET prices = ${prices} where name = ${name}`)
    .then(function() {
      // console.log('record updated');
    })
    .catch(function(error) {
      callback(error, null);
    });
}

const deleteRecord = (id, callback) => {
  db.one(`DELETE FROM companies WHERE id = ${id}`)
    .then(function() {
      // console.log('record deleted');
    })
    .catch(function(error) {
      callback(error, null);
    });
}

// companies table queries

// const getCompanyData = (id, callback) => {
//  connection.query(`SELECT * FROM companies WHERE companies.id='${id}'`, (err, results) => {
//    if(err){
//      callback(err, null);
//    } else {
//      callback(null, results);
//    }
//  })
// }

// const addCompanyData = (companyName, closingPrice, cb) => {
//  let param = [companyName, closingPrice];
//  let qs = `INSERT INTO companies (name, last_closing_price) VALUES (?, ?);` 
//  connection.query(qs, param, cb);
// }

// const updateCompanyName = (id, closingPrice, cb) => {
//  let qs = `UPDATE companies SET last_closing_price = ${closingPrice} WHERE id = ${id}`;
//  connection.query(qs, cb);
// }

// const deleteCompanyData = (id) => {

// }

// // other

// const makeMeTheData = () => {
//  for(let i = 1; i<= 100; i++) {
//    let param = [faker.company.companyName(), faker.finance.amount(100.00,200.00,2)]
//    let query = `INSERT INTO companies (name, last_closing_price) VALUES (?, ?);`
//    connection.query(query, param);
//    for(let x=1; x<31; x++){
//      connection.query(`INSERT INTO price_records_monthly (id, companyID, price, price_date) VALUES (null, '${i}','${faker.commerce.price(100.00,200.00,2)}','2018-07-${x} 22:28:09.000000');`)
//    }
//  }
// }


// setTimeout(makeMeTheData, 15000);

module.exports = {
  recordById,
  recordByName,
  addRecord,
  updateRecordByName,
  updateRecordById,
  deleteRecord
};