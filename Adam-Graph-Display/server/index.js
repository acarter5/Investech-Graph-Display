require('newrelic');
const compression = require('compression');
const express = require('express');
const path = require('path');
const redis = require('redis');
const app = express();
var bodyParser = require('body-parser')
var db = require('../DB/index.js')
const PORT = process.env.PORT || 3001;
const client = redis.createClient('6379', 'redis');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.use((req, res, next) => {
  console.log(`serving request ${req.method} at ${req.url}`);
  next();
});


// random paths i need for loader.io stuff

app.get('/loaderio-2f6b366aeeb0bebf6d280ff95d0d8093/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loaderio-2f6b366aeeb0bebf6d280ff95d0d8093.txt'), function(err) {
    if (err) {
      (err);
    } else {
      console.log('sent File');
    }
  })
});

app.get('/loaderids', (req, res) => {
  res.sendFile(path.join(__dirname, 'loaderIds.JSON'), function(err) {
    if (err) {
      next(err);
    } else {
      console.log('sent File');
    }
  })
});

//price_records_monthly table routes

app.get('/prices/:id/', (req, res) => {
  const companyId = req.params.id;
  client.get(companyId, (err, data) => {
    if (data) {
      res.send(JSON.parse(data));
    } else {
      db.recordById(req.params.id, (err, results) => {
        try {
          client.setex(companyId, 60, JSON.stringify(results));
          res.status(200).send(results);
        } catch (err) {
          res.status(404).send(err);
        }
      })
    }
  })
})

app.get('/pricesByName/:name/', (req, res) => {
   db.recordByName(req.params.id, (err, results) => {
    try {
      res.status(200).send(results);
    } catch (err) {
      res.status(404).send(err);
    }
   })
})

app.post('/prices', (req, res) => {
  db.addRecord(req.body.name, req.body.prices, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send('record added');
    }
  }) 
})

app.put('/prices/:id', (req, res) => {
  db.updateRecordById(req.params.id, req.body.name, req.body.prices, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send('record updated');
    }
  }) 
})

app.put('/pricesByName/:name', (req, res) => {
  db.updateRecordById(req.params.name, req.body.prices, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  }) 
})

app.delete('/prices/:id', (req, res) => {
  db.deleteRecord(req.params.id, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send('record deleted');
    }
  }) 
})

//companies table routes

// app.get('/companies/:id', (req, res) => {
//  db.recordById(req.params.id, (err, results) => {
//    if(err) {
//      res.status(404).send(err);
//    } else {
//      res.status(200).send(results);
//    }
//  })
// })

// app.post('/companies', (req, res) => {
//   db.addCompanyData(req.body.name, req.body.closingPrice, (err, results) => {
//     if(err) {
//       res.status(404).send(err);
//     } else {
//       res.status(200).send('company added');
//     }
//   })
// })

// app.put('/companies/:id', (req, res) => {
//   db.updateCompanyName(req.params.id, req.body.closingPrice, (err, results) => {
//     if(err) {
//       res.status(404).send(err);
//     } else {
//       res.status(200).send('company updated');
//     }
//   })
// })

// app.delete('/companies/:id', (req, res) => {

// })

app.use('/:id',express.static(path.join(__dirname, '../client/dist')));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

