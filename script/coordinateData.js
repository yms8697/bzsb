var useWaterInf, singleUseWaterInf;
$.ajax({
    type: "GET",
    url: "http://115.28.68.229/sqlserver/?id=UseWaterInf",
    dataType: "json",
    success: function(data){
        useWaterInf = data;
    }
});
$.ajax({
    type: "GET",
    url: "http://115.28.68.229/sqlserver/?id=SingleUseWaterInf",
    dataType: "json",
    success: function(data){
        singleUseWaterInf = data;
    }
});

// 干管
var zgCoordinates = [
    [{lon: 117.92618,lat: 37.66507}, {lon: 117.94120,lat: 37.66675}],
    [{lon:  117.93475,lat: 37.66608}, {lon: 117.93320,lat: 37.67545}]
];
//干管信息
var zgData={
    zg0:{gd:'AD',count:8,sjflow:480,sjnj:376.00,xzgj:400,gdts:1,gdcd:765},
    zg1:{gd:'DE',count:8,sjflow:480,sjnj:376.00,xzgj:400,gdts:1,gdcd:765},
}
//分干管
var fggCoordinates=[
    [{lon: 117.91929,lat: 37.66426},{lon: 117.92618,lat: 37.66507}],
    [{lon: 117.94120,lat: 37.66675},{lon: 117.94504,lat: 37.66707}],
    [{lon: 117.92515,lat: 37.67033}, {lon: 117.93332,lat: 37.67164}],
    [{lon: 117.93332,lat: 37.67164},{lon: 117.94631,lat: 37.67374}],
    [{lon: 117.93032,lat: 37.67529},{lon: 117.94446,lat: 37.67773}]
];
//分干管信息
var fggData={
    fgg0:{gd:'C1',count:5,sjflow:300,sjnj:297.25,xzgj:315,gdts:1,gdcd:575},
    fgg1:{gd:'C1-3',count:2,sjflow:120,sjnj:188.00,xzgj:200,gdts:1,gdcd:575},
    fgg2:{gd:'E1',count:6,sjflow:360,sjnj:325.63,xzgj:355,gdts:1,gdcd:620},
    fgg3:{gd:'E1-2',count:3,sjflow:180,sjnj:230.25,xzgj:250,gdts:1,gdcd:590},
    fgg4:{gd:'B1',count:3,sjflow:180,sjnj:230.25,xzgj:250,gdts:1,gdcd:470}
}
// 普通管线坐标
var lineCoordinates = [
    [{lon: 117.91929,lat: 37.66426}, {lon: 117.91828,lat: 37.66580}, {lon: 117.91800,lat: 37.66862}],
    [{lon: 117.91963,lat: 37.66422}, {lon: 117.91929,lat: 37.66907}],
    [{lon: 117.92101,lat: 37.66439}, {lon: 117.92058,lat: 37.66924}],
    [{lon: 117.92210,lat: 37.66450}, {lon: 117.92167,lat: 37.66937}],
    [{lon: 117.92373,lat: 37.66473}, {lon: 117.92287,lat: 37.66962}],
    [{lon: 117.92489,lat: 37.66486}, {lon: 117.92401,lat: 37.66984}],
    [{lon: 117.92618,lat: 37.66507}, {lon: 117.92519,lat: 37.67007}],
    [{lon: 117.92742,lat: 37.66520}, {lon: 117.92648,lat: 37.67025}],
    [{lon: 117.92871,lat: 37.66535}, {lon: 117.92777,lat: 37.67040}],
    [{lon: 117.92991,lat: 37.66553}, {lon: 117.92897,lat: 37.67057}],
    [{lon: 117.93120,lat: 37.66563}, {lon: 117.93026,lat: 37.67070}],
    [{lon: 117.93244,lat: 37.66585}, {lon: 117.93150,lat: 37.67083}],
    [{lon: 117.93371,lat: 37.66606}, {lon: 117.93274,lat: 37.67108}],
    [{lon: 117.93506,lat: 37.66623}, {lon: 117.93412,lat: 37.67125}],
    [{lon: 117.93601,lat: 37.66628}, {lon: 117.93536,lat: 37.67160}],
    [{lon: 117.93729,lat: 37.66632}, {lon: 117.93669,lat: 37.67177}],
    [{lon: 117.93871,lat: 37.66647}, {lon: 117.93789,lat: 37.67203}],
    [{lon: 117.94000,lat: 37.66662}, {lon: 117.93927,lat: 37.67203}],
    [{lon: 117.94120,lat: 37.66675}, {lon: 117.94056,lat: 37.67228}],
    [{lon: 117.94249,lat: 37.66683}, {lon: 117.94184,lat: 37.67228}],
    [{lon: 117.94382,lat: 37.66698}, {lon: 117.94304,lat: 37.67241}],
    [{lon: 117.94506,lat: 37.66705}, {lon: 117.94429,lat: 37.67293}],
    [{lon: 117.94504,lat: 37.66707}, {lon: 117.94596,lat: 37.66919}, {lon: 117.94553,lat: 37.67289}], 
    //zg21-zg41
    [{lon: 117.92451,lat: 37.67027}, {lon: 117.92345,lat: 37.67263}],
    [{lon: 117.92515,lat: 37.67033}, {lon: 117.92463,lat: 37.67372}],
    [{lon: 117.92641,lat: 37.67057}, {lon: 117.92588,lat: 37.67398}],
    [{lon: 117.92708,lat: 37.67061}, {lon: 117.92684,lat: 37.67246}],
    [{lon: 117.92828,lat: 37.67087}, {lon: 117.92777,lat: 37.67437}],
    [{lon: 117.92950,lat: 37.67108}, {lon: 117.92918,lat: 37.67291}],
    [{lon: 117.93077,lat: 37.67121}, {lon: 117.93021,lat: 37.67454}],
    [{lon: 117.93208,lat: 37.67143}, {lon: 117.93154,lat: 37.67458}],
    [{lon: 117.93332,lat: 37.67164}, {lon: 117.93277,lat: 37.67507}],
    [{lon: 117.93472,lat: 37.67188}, {lon: 117.93433,lat: 37.67544}],
    [{lon: 117.93605,lat: 37.67207}, {lon: 117.93562,lat: 37.67563}],
    [{lon: 117.93740,lat: 37.67231}, {lon: 117.93699,lat: 37.67572}],
    [{lon: 117.93858,lat: 37.67250}, {lon: 117.93822,lat: 37.67589}],
    [{lon: 117.93991,lat: 37.67269}, {lon: 117.93946,lat: 37.67628}],
    [{lon: 117.94184,lat: 37.67308}, {lon: 117.94146,lat: 37.67658}],
    [{lon: 117.94249,lat: 37.67319}, {lon: 117.94214,lat: 37.67625}],
    [{lon: 117.94369,lat: 37.67327}, {lon: 117.94334,lat: 37.67653}],
    [{lon: 117.94571,lat: 37.67368}, {lon: 117.94528,lat: 37.67709}],
    [{lon: 117.94631,lat: 37.67374}, {lon: 117.94594,lat: 37.67724}],
    //zg5-zg19
    [{lon: 117.93032,lat: 37.67529}, {lon: 117.93017,lat: 37.67561},{lon: 117.93255,lat: 37.67608}],
    [{lon: 117.93316,lat: 37.67575}, {lon: 117.93260,lat: 37.68023},{lon: 117.92983,lat: 37.68008}],
    [{lon: 117.93425,lat: 37.67607}, {lon: 117.93387,lat: 37.67933},{lon: 117.93432,lat: 37.67942}, {lon: 117.93421,lat: 37.68019}],
    [{lon: 117.93567,lat: 37.67629}, {lon: 117.93511,lat: 37.67957}],
    [{lon: 117.93893,lat: 37.67676}, {lon: 117.93863,lat: 37.67914}],
    [{lon: 117.94189,lat: 37.67724}, {lon: 117.94171,lat: 37.67778},{lon: 117.93573,lat: 37.68072},{lon: 117.93571,lat: 37.68121}],
    [{lon: 117.94195,lat: 37.67731}, {lon: 117.94146,lat: 37.68136}],
    [{lon: 117.94264,lat: 37.67739}, {lon: 117.94210,lat: 37.68123}],
    [{lon: 117.94332,lat: 37.67750}, {lon: 117.94283,lat: 37.68153}],
    [{lon: 117.94388,lat: 37.67765}, {lon: 117.94337,lat: 37.68166}],
    [{lon: 117.94446,lat: 37.67773}, {lon: 117.94403,lat: 37.68170}]
];
// 水表坐标
var sbCoordinates = [
    {lon: 117.92207,lat: 37.66459,terminalCode: 400001},
    {lon: 117.92381,lat: 37.66487,terminalCode: 400002},
    {lon: 117.92499,lat: 37.66493,terminalCode: 400003},
    {lon: 117.92624,lat: 37.66517,terminalCode: 400004},
    {lon: 117.92748,lat: 37.66530,terminalCode: 400005},
    {lon: 117.92877,lat: 37.66547,terminalCode: 400006},
    {lon: 117.92997,lat: 37.66564,terminalCode: 400007},
    {lon: 117.93128,lat: 37.66581,terminalCode: 400008},
    {lon: 117.93248,lat: 37.66598,terminalCode: 400009},
    {lon: 117.93377,lat: 37.66613,terminalCode: 400010},
    {lon: 117.93516,lat: 37.66628,terminalCode: 400011},
    {lon: 117.93600,lat: 37.66633,terminalCode: 400012},
    {lon: 117.93735,lat: 37.66637,terminalCode: 400013},
    {lon: 117.93872,lat: 37.66654,terminalCode: 400014},
    {lon: 117.94010,lat: 37.66675,terminalCode: 400015},
    {lon: 117.94130,lat: 37.66680,terminalCode: 400016},
    {lon: 117.94259,lat: 37.66690,terminalCode: 400017},
    {lon: 117.94383,lat: 37.66706,terminalCode: 400018},
    {lon: 117.94508,lat: 37.66699,terminalCode: 400019},
    // 二批水表
    {lon: 117.93217,lat: 37.67593,terminalCode: 500001},
    {lon: 117.93307,lat: 37.67582,terminalCode: 500002},
    {lon: 117.93424,lat: 37.67602,terminalCode: 500003},
    {lon: 117.93573,lat: 37.67660,terminalCode: 500004},
    {lon: 117.93897,lat: 37.67716,terminalCode: 500005},
    {lon: 117.94116,lat: 37.67816,terminalCode: 500006},
    {lon: 117.94195,lat: 37.67780,terminalCode: 500007},
    {lon: 117.94266,lat: 37.67791,terminalCode: 500008},
    {lon: 117.94332,lat: 37.67803,terminalCode: 500009},
    {lon: 117.94388,lat: 37.67808,terminalCode: 1705020001},
    {lon: 117.94448,lat: 37.67816,terminalCode: 1705020002},
    {lon: 117.93268,lat: 37.67172,terminalCode: 1704200014},
    {lon: 117.93319,lat: 37.67181,terminalCode: 1704200006},
    {lon: 117.93458,lat: 37.67202,terminalCode: 1704200012},
    {lon: 117.93729,lat: 37.67247,terminalCode: 1704200004},
    {lon: 117.93980,lat: 37.67284,terminalCode: 1704200002},
    {lon: 117.94171,lat: 37.67316,terminalCode: 1705020004},
    {lon: 117.94358,lat: 37.67346,terminalCode: 1704200015},
    {lon: 117.94559,lat: 37.67374,terminalCode: 1705020003},
];

// 泵房坐标
var bfCoordinates = [
    {lon: 117.93361,lat: 37.66540},
    {lon: 117.93537,lat: 37.66555},
];
//泵房信息
var bfData={
        bf0:{bfbh:'BZ04',area:3064,flow:1163,sjyc:20.2,lxbxx:{xh:'250SS30',flow:635,yc:21.0,pw:55},diameter:"600-200/200/315/400"},
        bf1:{bfbh:'BZ05',area:2697,flow:952,sjyc:19.9,lxbxx:{xh:'250S-24',flow:486,yc:23.5,pw:45},diameter:'600-200/355/355'}
    }
// 气象站坐标
var qxzCoordinates = [
    {lon: 117.93449,lat: 37.66573},
]; 

// 土壤监测站
var trzCoordinates = [
    {lon: 117.93439,lat: 37.66656},
];
