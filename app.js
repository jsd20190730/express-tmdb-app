require('dotenv').config()

const express = require('express')
const axios = require('axios')
const path = require('path')
const logger = require('morgan') //morgan is a library
const exphbs = require('express-handlebars')

// establishing the I/O port
const PORT = process.env.PORT || 3000
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views')) // specify that templates will live in the "views" directory
app.engine('.hbs', exphbs({
  extname: '.hbs'
}))
app.set('view engine', '.hbs') // specify that we are using "handlebars" as our template engine

app.use(logger('dev'))
app.use(express.json()) //telling server to parse json properly
app.use(express.urlencoded({
  extended: false
})) //if sending form data we encode url, telling server here to decode
app.use(express.static(path.join(__dirname, 'public'))) //static files in current directory/pulic folder (ex. images)

app.listen(PORT, () => console.log(`App is up and running listening on port ${PORT}`)) //creates webserver and listens to port (console log here will write to server not browser->inspect)

// route handler for GET request to home ("/") route
app.get('/', (req, res, next) => {
  const colors = [{
      color: "red"
    },
    {
      color: "blue"
    },
    {
      color: "purple"
    },
    {
      color: "gold"
    }
  ]

  // "render" the template named "home" in our views folder
  res.render('home', {
    name: 'Rohit',
    colors: colors

  })
})

app.get('/about', (req, res, next) => {
  // "render" the template named "home" in our views folder
  res.render('about')
})

app.get('/contact-us', (req, res, next) => {
  // "render" the template named "home" in our views folder
  res.render('contact-us')
})


// since we using axios function, we need to make the route handler async, to use await in this
app.get('/popular-movies', async (req, res) => {

  const data = await tmdbApi("movie/popular") //pass this to pathParams

  console.log(data.results)

  const movies = data.results //array of movies

  res.render('movie-list', {
    movies:movies
  })
})


// note '/movie/:id' is a route handler
//http://localhost:3000/movies/486589 - note when u hover on the link this shows
app.get('/movies/:id', async(req, res) => {
    console.log(req.params) //object
    const movieId = req.params.id

    const data = await tmdbApi(`movie/${movieId}`)
    console.log(data)

    res.render('movie-detail', {
      movie:data
    })
})



async function tmdbApi(pathParams) {
  try {
    const url = `https://api.themoviedb.org/3/${pathParams}` //made the path dynamic
    const apiKey = process.env.TMDB_API_KEY //'485d13996689e8186014f0c00d52f83f' //

    const response = await axios.get(url, {
      params: {
        api_key: apiKey
      }
    })
    return response.data // axios returns data from api
  } catch (e) {
    console.log(e)
    throw new Error("API Request to TMDb failed")
  }
}
