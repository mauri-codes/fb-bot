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
  sendText(sender, comment_id);
  console.log('Everything looks fine');
  res.sendStatus(200);
});

var token = "EAALp6npgAb0BADEZB6unhZCw4uZCerwQPC5OlcU13ixY5mXU0swqUh1muihCUdWBw7QUIj5uOffUjCDY3PyoSNjtJmOHQmFd59mif7SHDmE4w9nJG3LDYH8WvJRlnMltSxbhszVMsqbZAWZBDmi9CAt1P0qvnxMZAjo58WXesGOwZDZD";

function sendText(sender_name, comment_id){
    var  messageData = "hola " + sender_name + ". Por favor facilitanos tu correo para enviarte mas información.";
    request({
        url: "https://graph.facebook.com/" + comment_id + "/comments",
        qs: {access_token: token},
        method: "POST",
        json: {
            message: messageData
        }
    }, function (error, response, body) {
        if(error){
            console.log("sending error");
        }else if(response.body.error){
            console.log("response body error");
       }
        }
    )
}

app.listen(app.get('port'), function(){
  console.log('running on port: ', app.get('port'))
})
