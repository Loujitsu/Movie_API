const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      year: '2001'
    },
    {
      title: 'Lord of the Rings',
      year: '2003'
    },
    {
      title: 'Fight Club',
      year: '1999'
    },
    {
      title: 'Fifth Element',
      year: '1997'     
    },
    {
      title: 'Mad Max',
      year: '2015'
    },
    {
      title: 'The Martian',
      year: '2015'
    },
    {
      title: 'Alien: Covenant',
      year: '2017'
    },
    {
      title: 'Dune',
      year: '2021'
    },
    {
      title: 'Predator',
      year: '1987'
    },
    {
      title: 'Moneyball',
      year: '2011'
    }
  ];
  
  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my movies club!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
//   Serve static content from the public directory
  app.use(express.static('public'));

  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
  });




  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });



