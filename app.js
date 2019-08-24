var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var worldbank_indicators = require('./wordbank_indicators')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
let array = ["CC.PER.RNK","GE.PER.RNK","PV.PER.RNK","RL.PER.RNK","RQ.PER.RNK", "VA.PER.RNK"];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', async function(req,res,next){
  worldbank_indicators.getCoreData().then(async function(coreData) {
    //console.log(coreData)
  
    let total_object = []
    for(let indicator of coreData[1]){
      //if(indicator.id)
      if(array.indexOf(indicator.id) > -1){
        indicator.ind_data = await worldbank_indicators.getIndicatorInfo(indicator.id)
        console.log("GOT")
        total_object.push(indicator)  
      }
    }
    res.send(total_object)
    //res.send(coreData)
  })
});
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
