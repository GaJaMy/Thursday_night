var socket = null;

$(()=>{
    
    socket = io.connect('http://localhost:3000',{cors:{origin:'*'}});

    socket.on("receiveMsg",(data) => {
        var obj = JSON.parse(data);
        ReceiveMessage(obj.nickname,obj.msg);
    });

});


var sendMsg = () => {
    if(socket != null) {
        var msg = $("#msg").val();

        if(msg.trim().length > 0) {
            socket.emit("sendMsg", msg);
        }
    }
};

var sendMenu = () => {
    if(socket!=null)
    {       
        var menu = $("#menu-name").val();
        socket.emit("sendPick",menu);
    }
}

var sendSalt = () => {
    if(socket!=null)
    {
        var salt = $("#salt-num").val();
        socket.emit("sendSalt",salt);
    }
}