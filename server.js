var express=require ('express'),
    stylus=require('stylus'),
    logger=require('morgan'),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose');

var env=process.env.NODE_ENV =  process.env.NODE_ENV || 'development';
var app=express();

app.set('views',__dirname + '/server/views');
app.set('view engine','jade');

function compile(str,path){
    return stylus(str).set('filename',path);
}

app.use(stylus.middleware(
    {
    src: __dirname  + '/public',
    compile:compile
    }
));

app.use(logger('dev'));


app.use(express.static(__dirname + '/public'));


//Mongo DB Setup - Mangoose
mongoose.connect('mongodb://localhost/multivision');
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open', function callback(){
    console.log("connected to database");
}) ;


var messageSchema=mongoose.Schema({message:String});
var Message=mongoose.model('message',messageSchema) ;
var mongoMessage;

Message.findOne().exec(function(error, messageDoc){
          mongoMessage=messageDoc.message;

})  ;

//For angular
app.get('/partials/:partialPath',function(req,res){
    res.render('partials/' + req.params.partialPath);
}) ;

app.get('*', function(req,res){
    res.render('index',{
       mongoMessage:mongoMessage
    });
}) ;

var port=3030;
app.listen(port);
console.log('Node app started!') ;