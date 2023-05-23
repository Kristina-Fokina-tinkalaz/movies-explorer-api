const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
const NotValidError = require('../errors/not-valid-err');


module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => {
      res.send(movie);
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
    thumbnail,
    movieId,
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
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidError('Некорректные данные при создании'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Карточка фильма не найдена');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new Forbidden('Вы не можете удалить фильм, который добавил другой пользователь');
      } else {
        return Movie.findByIdAndRemove(req.params.id).then(() => res.send({ data: movie }));
      }
    })
    .catch(next);
};
