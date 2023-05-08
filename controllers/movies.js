const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
const NotValidError = require('../errors/not-valid-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      const result = [];
      movie.forEach((movie) => {
        result.push({
          _id: movie._id,
          country: movie.country,
          director: movie.director,
          duration: movie.duration,
          year: movie.year,
          description: movie.description,
          image: movie.image,
          trailerLink: movie.trailer,
          nameRU: movie.nameRU,
          nameEN: movie.nameEN,
          thumbnail: movie.thumbnail,
          owner: movie.owner,
        });
      });
      res.send(result);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationEror') {
        next(new NotValidError('Некорректные данные при создании'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Карточка не найдена');
      }
       else if (!movie.owner.equals(req.user._id)) {
        throw new Forbidden('Вы не можете удалить фильм, который добавил другой пользователь');
      }
      else {
        return Movie.findByIdAndRemove(req.params.movieId).then(() => res.send({ data: movie }));
      }
    })
    .catch(next);
};

