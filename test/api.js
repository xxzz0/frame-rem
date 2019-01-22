//初始化
$.mockjax({
	url: 'Common/SelectUser.aspx',
	responseText:{
		"name": "",
		"gamestatus": 1,
  		"lotterystatus": 1,
  		"status": 1
	}
});
//提交信息
$.mockjax({
	url: 'Common/UpdUser.aspx',
	responseText:{
  		"status": 1
	}
});
//点击抽奖
$.mockjax({
	url: 'Common/AddLottery.aspx',
	responseText:{
		"name": "红包",
  		"index": 0,
  		"lotterystatus": 0,
  		"status": 1,
  		"money":2
	}
});
//提交游戏数据
$.mockjax({
	url: 'Common/AddGameLog.aspx',
	responseText:{
		"gamestatus": 1,
		"status": 1
	}
});