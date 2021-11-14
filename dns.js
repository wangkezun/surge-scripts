const ssid1 = "Rivendell";
const ssid2 = "Mirkwood";
const name = "home-dns";
let home = $network.wifi.ssid === ssid1 || $network.wifi.ssid === ssid2;

const getModuleStatus = new Promise((resolve) => {
  $httpAPI("GET", "v1/modules", null, (data) =>
      resolve(data.enabled.includes(name))
  );
});

getModuleStatus.then((enabled) => {
  if (home && !enabled) {
  //家里,未开启模块 => 开启
    $notification.post("Event", `开启${name}模块`, "");
    enableModule(true);
  } else if (!home && enabled) {
    //不是家里,开启了模块 => 关闭
    $notification.post("Event", `关闭${name}模块`, "");
    enableModule(false);
  } else {
    //其他情况 => 重复触发 => 结束脚本
    //$notification.post("重复触发", "", "");
    $done();
  }
});

function enableModule(status) {
  $httpAPI("POST", "v1/modules", { [name]: status }, () => $done());
}
