//use the mailchimp API

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const { response } = require("express");
// const path = require("path/posix");

const app = express();
// const staticPath  =  path.join(__dirname+"/pubilc");
// app.use(express.static(staticPath));
// console.log(staticPath)

app.use(bodyParser.urlencoded({extended:true}));
// app.use('/', express.static('/public'))
// app.use(express.static(__dirname+"/public"));

app.use(express.static("pubilc"));
// app.use('/static', express.static(path.join(__dirname, '/public')))

app.get("/",function(req,res){
    // console.log("this is working");
    // console.log(__dirname)
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    var firstname = req.body.first;
    var lastname = req.body.last;
    var mail = req.body.mail;
    //data is to remove 400 error
    var data = {
        members: [
            {
                email_address: mail,
                status:"subscribed",
                merge_fields:{
                    LNAME: lastname,
                    FNAME: firstname
                }
                
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    var options = {
        url: "https://us11.api.mailchimp.com/3.0/lists/ec2d4d2383",
        method : "POST",
        //header is for 401
        headers: {
            "Authorization": "basic b23bdef6bcf6590c78c5d819df47b711-us11"
        },
        body: jsonData

    };
    request(options,function(error, response, body){
        if(error){
            res.send(__dirname+"/failure.html")
        }else{
            if(response.statusCode===200){
                //to sendback data to user
                res.sendFile(__dirname+"/success.html");
            }else{
                res.send(__dirname+"/failure.html")
            }
            
        }
    });

})

app.post("/failure",function(req,res){
    //to redirect to home rout
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("app is running on port 3000.");
    // console.log(response.statusCode)
    
})

