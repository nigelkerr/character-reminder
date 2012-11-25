
//var bkanji = "上下大八入工山口九一人力川七十三二女又玉本子丸正犬夕出目了火五四才手天刀王左中月々田右六小土立石丁日千木水白文円矢市牛切方戸太父少友毛半心内生久台母午北今古兄元外分公引止用万広冬";
var bkanji = "上下大八入工山口九一人力川七十三二女又玉本子丸正犬夕出目了火五四才手天刀王左中月々田右六小土立石丁日千木水白文円矢市牛切方戸太父少友毛半心内生久台母午北今古兄元外分公引止用万広冬央男名不申年";

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponseCallback) {
    console.log("starting request listener");
    if ( request.message == "kanji" ) {
      sendResponseCallback({kanjilist: bkanji});
    } else {
      console.log("Unexpected message value " + request.message + ", ignoring.");
    }
  }
);

