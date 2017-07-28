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

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var messages = [{"message1": "Hola ", "message2": ". Nos gustaria que nos compartas tu correo para que te enviemos mas informacion."},
                {"message1": "", "message2": " por favor facilitanos tu correo electronico, te enviaremos mas informacion"},
                {"message1": "", "message2": ", nos gustaria mandarte un correo para mandarte mayores detalles"},
                {"message1": "Hola ", "message2": ", nos podrias facilitar tu correo para enviarte mas informacion al respecto?"},
                {"message1": "", "message2": ", por favor compartenos tu correo electronico, te compartiremos mas informacion"}
                ];

app.post('/webhook/', function(req, res) {
    var fb_entry   = req.body.entry;
    var entry_id   = fb_entry[0].time;
    if(fb_entry[0].changes){
        var changes    = fb_entry[0].changes;
        var field      = changes[0].field;//feed
        if(field == "feed"){
            var item_type  = changes[0].value.item;//comment
	    console.log(req.body);
	    console.log("---------------------");
	    console.log(changes[0].value);
	    console.log("*********************");
            if(item_type == "comment"){
                var sender     = changes[0].value.sender_name;
                var comment_id = changes[0].value.comment_id;
                var post_id    = changes[0].value.post_id;
                var message    = changes[0].value.message;
		var email = 0;
		if(message.indexOf("@")> -1){
		  email = 1;
		}
                sendText(sender, comment_id, email);
                console.log('Everything looks fine');
            }
        }
    }

    res.sendStatus(200);
});


var token = "EAALp6npgAb0BADEZB6unhZCw4uZCerwQPC5OlcU13ixY5mXU0swqUh1muihCUdWBw7QUIj5uOffUjCDY3PyoSNjtJmOHQmFd59mif7SHDmE4w9nJG3LDYH8WvJRlnMltSxbhszVMsqbZAWZBDmi9CAt1P0qvnxMZAjo58WXesGOwZDZD";

function sendText(sender_name, comment_id, email){
    var randomNumber = random(0,4);
    if(email == 1){
      var messageData = sender_name + "! Te enviaremos mas informacion a tu correo. :)"
    }else{
      var  messageData = messages[randomNumber].message1 + sender_name + messages[randomNumber].message2;
    }
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
