const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd")
    },
    create: function (req, res) {
        Movies.create(req.body)
        .then(movie=>{
            res.redirect('/movies')
        })
        .catch(error=>{
            console.log(error)
        })
    },
    edit: function(req, res) {
        Movies.findByPk(req.params.id)
        .then(movie=>{
            if(movie){
                res.render('moviesEdit',{Movie:movie})
                
            }else{
                res.send("no existe esa pelicula")
            }
        })
        .catch(error=>{
            console.log(error)
        })
        
    },
    update: function (req,res) {
        Movies.update(
            {
                title:req.body.title,
                rating:req.body.rating,
                awards:req.body.awards,
                release_date:req.body.release_date,
                length:req.body.length
            },
            {
                where:{id:req.params.id}
            }
        )
        .then(movie=>{
            if(movie[0]!==0){
                res.redirect(`/movies/detail/${req.params.id}`)
            }else{
                res.send("no hay nada para modificar")
            }
        })
        .catch(error=>{
            console.log(error)
        })
        
    },
    delete: function (req, res) {
        Movies.findByPk(req.params.id)
        .then(movie=>{
            if(movie){
                res.render('moviesDelete',{Movie:movie})
                
            }else{
                res.send("no existe esa pelicula")
            }
        })
        .catch(error=>{
            console.log(error)
        })
        
    },
    destroy: function (req, res) {
        Movies.destroy({
            where:{id:req.params.id}
        })
        .then(movie=>{
            res.redirect('/movies')
        })
        .catch(error=>{
            res.send(error)
        })
    }

}

module.exports = moviesController;