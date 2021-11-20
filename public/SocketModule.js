var socket = null;
var memberList = []; //현재 채팅방의 멤버들에 대한 정보
var MyInfo = new Object(); //나의 대한 정보

$(function ()
{
    MyInfo.nickname = prompt("nickName 입력");
    MyInfo.pick = null;
    MyInfo.salt = null;
    socket = io.connect('http://localhost:3000', { cors: { origin: '*' }, query: 'nickname=' + MyInfo.nickname });

    socket.on("receiveMsg", function(data){
        ReceiveMessage(data);
    });

    socket.on("enterOthers", function(data){
        EnterOthers(data);
    });

    socket.on("enterMyself", function(dataList){
        console.log(dataList.length);
        EnterMyself(dataList);
    });

    socket.on("leaveOthers", function(data){
        LeaveOthers(data);
    });

    socket.on("funcFlag", function(data){
        ChangeInfo(data);
    });
});


var sendMsg = () => {
    if (socket != null) {
        var msg = $("#msg").val();

        if (msg.trim().length > 0) {
            socket.emit("sendMsg", msg);
        }
    }
};

var sendMenu = () => {
    if (socket != null) {
        var menu = $("#menu-name").val();
        if(menu!="")
            socket.emit("sendPick", menu);
    }
}

var sendSalt = () => {
    if (socket != null) {
        var salt = $("#salt-num").val();
        if(salt!="")
            socket.emit("sendSalt", salt);
    }
}

function ReceiveMessage(data) {
    console.log("nickName : "+data.nickname + "ID : "+data.id);
    
    var direction = "left";
    var nickname = data.nickname.length > 0 ? data.nickname : data.id;
    var receiverChat = $("section div.chat ul li").clone();
    
    receiverChat.addClass(direction);

    receiverChat.find('.sender span').text(nickname);
    receiverChat.find('.msg pre').text(data.msg);

    $('.chat-box ul').append(receiverChat);
    
    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
}

function EnterOthers(data) {
    console.log("입장  " + data.nickname);

    var ch = true;
    for(var i=0; i<memberList.length;i++)
    {
        if(data.nickname==memberList[i].nickname)
        {
            ch = false;
            break;
        }
    }

    if(ch)
        memberList.push(data);
    
    var direction = "center";
    var sender = data.nickname.length > 0 ? data.nickname : data.id;
    var enterOtherChat = $("section div.enterOthers ul li").clone();

    enterOtherChat.addClass(direction);
    
    enterOtherChat.find('.enterMsg pre').text(sender+"님(이) 입장 하였습니다.");
    
    $('.chat-box ul').append(enterOtherChat);
    
    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
}

function EnterMyself(dataList) {
    console.log("현재 입장중인 인원" + dataList);

    var direction = "center";
    var curParty = "";
    memberList = dataList;
    for(var i=0;i<dataList.length;i++)
    {
        var sender = dataList[i].nickname.length > 0 ? dataList[i].nickname : dataList[i].id;
        curParty += sender +" ";
    }
    
    var enterOtherChat = $("section div.enterOthers ul li").clone();

    enterOtherChat.addClass(direction);
    
    enterOtherChat.find('.enterMsg pre').text("채팅 방에 입장 하셨습니다\n"+"현재 참여 중인 인원 : " + curParty);
    
    $('.chat-box ul').append(enterOtherChat);
    
    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
}

function LeaveOthers(data) {
    console.log("나간 참여자 " + data);
    
    var direction = "center";
    var sender = data.nickname.length > 0 ? data.nickname : data.id;
    var leaveOtherChat = $("section div.enterOthers ul li").clone();

    leaveOtherChat.addClass(direction);
    
    leaveOtherChat.find('.enterMsg pre').text(sender+"님(이) 퇴장 하셨습니다.");
    
    $('.chat-box ul').append(leaveOtherChat);
    
    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
}

function ChangeInfo(data)
{
    for(var i=0; i<memberList.length;i++)
    {
        if(data.nickname==memberList[i].nickname)
        {
            console.log("원래 " +memberList[i].pickYn +","+memberList[i].saltYn);
            console.log(memberList[i].nickname + "Pick change : " + memberList[i].pickYn + " -> "+data.pickYn);
            console.log(memberList[i].nickname + "Salt Change : " + memberList[i].saltYn + " -> "+data.saltYn);            
            memberList[i].pickYn = data.pickYn;
            memberList[i].saltYn = data.saltYn;            
            console.log("바뀜 " +memberList[i].pickYn +","+memberList[i].saltYn);
            break;
        }
    }

    var direction = "center";
    var sender = data.nickname.length > 0 ? data.nickname : data.id;
    var changePickSalt = $("section div.enterOthers ul li").clone();

    changePickSalt.addClass(direction);
    
    changePickSalt.find('.enterMsg pre').text(sender+"님(이) 메뉴 또는 Salt를 변경 또는 확정하였습니다.");
    $('.chat-box ul').append(changePickSalt);
    
    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
}