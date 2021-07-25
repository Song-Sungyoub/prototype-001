const scriptName = "rpg";

var status = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];/*{
  name: "",
  userclass: "초보자",
  level: 1,
  hp: 5,
  mp: 5,
  health: 5,
  str: 5,
  int: 5,
  wis: 5,
  dex: 5
};*/

var inveqi = []; //장비
var invcon = []; //소비
var invetc = []; //기타
var map = ["초보자 마을", "초보자 사냥터", "초급 마을", "초급 사냥터"];
var monster = [["슬라임", 1, 10, 10]];
//몬스터 이름, 공격력, 체력, 지급 경험치

var userdata = "";
var umap = "";
var mapch = -1;
var mapchc = "";

var user = [];

function join_checker(user_name, replier){
    if(user_name!=null){
        return true;
    }else{
        replier.reply("가입되어 있지 않은 유저입니다.\n!가입을 통해 가입해주세요");
        return false;
    }
}

function brief_status(user_name, replier){
	replier.reply("당신의 현재 스탯\n이름 : " + status[user[sender]][0] +
      "\n직업 : " + status[user[sender]][1] +
      "\n레벨 : " + status[user[sender]][2] +
      "\nhp : " + status[user[sender]][3] +
      "\nmp : " + status[user[sender]][4] +
      "\n건강 : " + status[user[sender]][5] +
      "\n근력 : " + status[user[sender]][6] +
      "\n지능 : " + status[user[sender]][7] +
      "\n지혜 : " + status[user[sender]][8] +
      "\n민첩 : " + status[user[sender]][9] +
      "\n현재 위치 : " + status[user[sender]][10]);
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(msg == "@!ver" && (sender == "송성엽" || sender == "장호혁")) {
    replier.reply("현재 버전\nVersion 0.2");
  }
  if(msg == "!도움말") {
    replier.reply("텍스트를 기반으로 이용한 RPG게임입니다. \n처음 이용시 !가입을 통해 캐릭터를 생성 후 \"!명령어\"를 통해서 명령어를 확인해주셍7");
    replier.reply("<기본 명령어>\n!가입 : 캐릭터를 생성합니다. \n!명령어 : 명령어를 확인합니다.");
  }
  
  if(msg == "!명령어") {
    replier.reply("<명령어>\n!가입 : 회원가입 \n!명령어 : 명령어를 확인합니다. \n!상태 : 현재 캐릭터 상태 \n!인벤토리 : 현재 인벤토리 \n!맵 : 맵을 확인 \n!위치 : 현재 위치를 확인합니다. \n!이동 <지역 이름> : <지역 이름>으로 캐릭터가 이동합니다.");
  }
  
  if(msg == "!가입") {
    if(Object.keys(user).length == 0 || user[sender] == null) {
      user[sender] = Object.keys(user).length;
      status[user[sender]][0] = sender;
      status[user[sender]][1] = "초보자";
      status[user[sender]][2] = 1;
      for(var i = 3; i < 10; i++) {
        status[user[sender]][i] = 5;
      }
      status[user[sender]][10] = map[0];
      inveqi[user[sender]] = "";
      invcon[user[sender]] = "";
      invetc[user[sender]] = "";
      replier.reply(status[user[sender]][0] + "님 가입에 성공하였습니다.");
      brief_status(user[sender], replier);
      userdata += sender + ", " + user[sender] + "\n";
      for(i = 0; i < 11; i++) {
        userdata += status[user[sender]][i] + ", ";
      }
      userdata = userdata.substring(0, userdata.length-2);
      userdata += "\n";
      DataBase.setDataBase("data", userdata);
    }
    else {
       replier.reply(status[user[sender]][0] + "님은 이미 가입하셨습니다.");
    }
  }
  
  if(msg == "!상태") {
    if(join_checker(user[sender], replier)) {
      brief_status(user[sender]);
    }
  }
  
  if(msg == "!인벤토리") {
    if(join_checker(user[sender], replier)) {
      if(inveqi[user[sender]] == "") {
        replier.reply("장비창이 비어있습니다.");
      }
      else {
        replier.reply(inveqi[user[sender]]);
      }
    
      if(invcon[user[sender]] == "") {
        replier.reply("소비창이 비어있습니다.");
      }
      else {
        replier.reply(invcon[user[sender]]);
      }
    
      if(invetc[user[sender]] == "") {
        replier.reply("기타창이 비어있습니다.");
      }
      else {
        replier.reply(invetc[user[sender]]);
      }
    }
  }
  
  if(msg == "!맵") {
    if(join_checker(user[sender], replier)) {
      umap = "";
      for(i = 0; i < map.length; i++) {
        umap += "【";
        umap += map[i];
        umap += "】 \n";
      }
      umap = umap.substring(0, umap.length-2);
      replier.reply(umap);
    }
  }
  
  if(msg == "!위치") {
    if(join_checker(user[sender], replier)) {
      replier.reply(status[user[sender]][0] + "님의 현재 위치 : " + status[user[sender]][10]);
    }
  }
  
  if(msg == "!이동") {
    if(join_checker(user[sender], replier)) {
      replier.reply("이동할 지역을 \"!이동 <지역 이름>\"와 같이 입력해주세요");
    }
  }
  else if(msg.indexOf("!이동 ") != -1) {
    if(join_checker(user[sender], replier)) {
      mapch = -1;
      mapchc = msg.substring(4, msg.length);
      for(i = 0; i < map.length; i++) {
        if(map[i] == mapchc) {
          mapch = i;
        }
      }
      if(mapch != -1) {
        status[user[sender]][10] = map[mapch];
        replier.reply(status[user[sender]][0] + "님의 현재 위치가 " + status[user[sender]][10] + "로 이동되었습니다.");
      }
      else {
        replier.reply(mapchc + "(이)라는 지역은 맵에 존재하지 않습니다.\n\"!맵\"을 통해 지역을 확인해주세요");
      }
    }
  }
  
  if(!(msg == "!도움말" || msg == "!가입" || msg == "!명령어" || msg == "!상태" || msg == "!인벤토리" || msg == "!맵" || msg == "!위치" || msg.indexOf("!이동 ") != -1 || msg == "!이동") && msg.charAt(0) == "!") {
    if(join_checker(user[sender], replier)) {
      replier.reply("!도움말을 입력하여 도움말을 확인하세요");
    }
  }
  
  if(msg == "@!저장" && sender == "DEBUG") {
    userdata = "";
    userdata += sender + ", " + user[sender] + "\n";
    for(i = 0; i < 10; i++) {
      userdata += status[user[sender]][i] + ", ";
    }
    userdata = userdata.substring(0, userdata.length-2);
    userdata += "\n";
    DataBase.setDataBase("data", userdata);
  }
  
  /*if(msg == "@!불러오기" && sender == "DEBUG SENDER") {
    var data = DataBase.getDataBase("data");
    replier.reply("불러오기 성공");
  }*/
}