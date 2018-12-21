let fs = require('fs');
let http = require('http');
let urlib = require('url');
let querystring = require('querystring');



let server = http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    console.log(req.method);
    if(req.method == "POST"){
      /*   console.log(patheName); */
        var result = "";//接收用户名和密码
        var patheName = req.url;//保存前端发来路由地址

        req.addListener('data', function (data) {
            result += data;
        });

        req.on('end',function(){
            let user = querystring.parse(result);
            console.log(req.url);
            console.log(user);
            if(user.username){
                fs.readFile("db.txt","utf-8",function(err,data){
                    console.log(!err);
                    if(err){//读取文件失败
                        fs.createReadStream('input.txt');
                        console.log("创建成功");
                    }
                    if(!data){//如果无数据
                        
                        if(patheName == "/login"){
                            res.end('{"ok":false,"msg":"用户未注册"}');
                            return;
                        }
                        if(patheName == "/register"){
                            let arr = [];
                            let obj = {};

                            obj.username = user.username;
                            obj.password = user.password;
                            arr.push(obj);

                            fs.writeFile("db.txt",JSON.stringify(arr),"utf-8",(error)=>{
                                if(error){
                                    console.log("写入失败");
                                }
                                
                            });
                            res.end('{"ok":true,"msg":"注册成功"}');
                            return;
                            
                            
                        }
                    }
                   else{//有数据
                        console.log("文件中有数据");
                        let arr = JSON.parse(data);//文件中的
                     
                        for(let i=0;i<arr.length;i++){
                            let obj = arr[i];
                            if(obj.username == user.username){
                                if(patheName == "/login"){
                                    if(obj.password == user.password){
                                        res.end('{"ok":true,"msg":"登录成功"}');
                                        return;
                                    }else{
                                        res.end('{"ok":false,"msg":"密码错误"}');
                                        return;
                                    }
                                }
                                if(patheName == "/register"){
                                    res.end('{"ok":false,"msg":"该用户已注册"}');
                                    return;
                                }
                            }
                        }
                        if(patheName == "/login"){
                            res.end('{"ok":false,"msg":"该用户未注册"}');
                            return;
                        }
                        if(patheName == "/register"){
                            let obj = {};
                            console.log(11111);
                            obj.username = user.username;
                            obj.password = user.password;
                            arr.push(obj);

                            fs.writeFileSync("db.txt" , JSON.stringify(arr) , "utf-8");
                            res.end('{"ok":true,"msg":"注册成功"}');
                            return;
                        }
                    }
                    
                    
                })
            }
            
        })
    }else if(req.method == "GET"){
        console.log("GET");
    }
    
    
   

    

/*     req.on('end', function () {
        if (req.method == "POST") {
            message = querystring.parse(str);
        }  
        if (url == '/register') {
            if (message.type == "reg") {
                if (obj[message.name]) {
                    res.write('{"ok":false,"msg":"用户已存在"}');
                    res.end();
                } else {
                    obj[message.name] = message.pass;
                    res.write('{"ok": true,"msg":"注册成功"}');
                    res.end();
                }
            } else if (message.type == "login") {
                if (obj[message.name]) {
                    if (obj[message.name] == message.pass) {
                        res.write('{"ok":true,"msg":"登录成功"}');
                        res.end();
                    } else {
                        res.write('{"ok":false,"msg":"用户名或密码有误"}');
                        res.end();
                    }               
                } else {
                res.write('{"ok": false,"msg":"此用户不存在"}');
                    res.end();
                }
            }
      } else {
           var filename = "./www" + req.url;
            fs.readFile(filename, function (err,data) {
                if (err) {
                    console.log(err);
                    res.write("404");
                } else {
                    res.setHeader("Content-type", "text/html");
                    res.write(data);
                }
                res.end();
            });

        }

    }) */

});



server.listen(8080);