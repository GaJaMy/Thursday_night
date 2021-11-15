const webSocket = new WebSocket("");

webSocket.onopen = ()=>{
    console.log("서버 연결 성공");
}

webSocket.onmessage = function(event){
    console.log("서버에서 받음 이벤트 Name : ");
}