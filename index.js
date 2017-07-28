express =       require('express')
bodyParser =    require('body-parser')
request =       require('request')

app = express()

app.set('port', (process.env.PORT || 5050))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', function(req, res){
  res.send('Hi chatbot is here once again!')
})

app.get('/webhook/', function(req, res){
  if(req.query['hub.verify_token'] === 'thompson54'){
    res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
  var fb_entry   = req.body.entry;
  var entry_id   = fb_entry[0].time;
  var changes    = fb_entry[0].changes;
  var field      = changes[0].field;//feed
  var item_type  = changes[0].value.item;//comment
  var sender     = changes[0].value.sender_name;
  var comment_id = changes[0].value.comment_id;
  var post_id    = changes[0].value.post_id;
  var message    = changes[0].value.message;
  console.log("message: " + message);
  console.log("post id: " + post_id);
  console.log("sender: "  + sender);
  console.log("comment_id: " + comment_id);

  console.log('Everything looks fine');
  res.sendStatus(200);
});

app.listen(app.get('port'), function(){
  console.log('running on port: ', app.get('port'))
})
