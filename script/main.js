//定义地图对象 
var map; 
var sdannoLayer = new SDRSAnnoLayer();
var sdimgLayer = new SDRasterLayer(); 
var yjfeature;
$(function () { 
    map = new OpenLayers.Map("mapDiv", { 
        allOverlays: true, 
        numZoomLevels: 19, 
        displayProjection: "EPSG:4490", 
        controls: [ 
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.Zoom(), 
        new OpenLayers.Control.ArgParser(), 
        new OpenLayers.Control.Attribution()] 
    }); 
    map.addLayer(sdimgLayer); 
    map.addLayer(sdannoLayer); ;
    map.setCenter(new OpenLayers.LonLat(117.93341, 37.67119), 16); 
    //添加矢量图层
    var graphicLayer = new OpenLayers.Layer.Vector("graphicLayer",
        { style: OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']) });
    map.addLayer(graphicLayer);
    //干管样式
    var zgStyle = {
        strokeColor: '#0080FF',
        strokeWidth: 11,
    };
    //分干管样式
    var fggStyle={
        strokeColor: '#0080FF',
        strokeWidth: 7,
    }
    //渲染分干管
    for(var i = 0; i < fggCoordinates.length; i++) {
        var lineStringArray = [];
        for(var j = 0; j < fggCoordinates[i].length; j++) {
            lineStringArray.push(
                new OpenLayers.Geometry.Point(fggCoordinates[i][j].lon, fggCoordinates[i][j].lat)
            );
        }
        var line = new OpenLayers.Geometry.LineString(lineStringArray); 
        var fggfeature = new OpenLayers.Feature.Vector(line, {id:'fgg'+i}, fggStyle);
        graphicLayer.addFeatures([fggfeature]);
    };
     //渲染干管
    for(var i = 0; i < zgCoordinates.length; i++) {
        var lineStringArray = [];
        for(var j = 0; j < zgCoordinates[i].length; j++) {
            lineStringArray.push(
                new OpenLayers.Geometry.Point(zgCoordinates[i][j].lon, zgCoordinates[i][j].lat)
            );
        }
        var line = new OpenLayers.Geometry.LineString(lineStringArray); 
        var zgfeature = new OpenLayers.Feature.Vector(line, {id:'zg'+i}, zgStyle);
        graphicLayer.addFeatures([zgfeature]);
    };
    var lineStyle = {
        strokeColor: '#cfcfcf',
        strokeWidth: 5,
    };
    var lineFeatureArray = [];
    for(var i = 0; i < lineCoordinates.length; i++) {
        var lineStringArray = [];
        for(var j = 0; j < lineCoordinates[i].length; j++) {
            lineStringArray.push(
                new OpenLayers.Geometry.Point(lineCoordinates[i][j].lon, lineCoordinates[i][j].lat)
            );
        }
        var line = new OpenLayers.Geometry.LineString(lineStringArray); 
            var lineFeature = new OpenLayers.Feature.Vector(line, {id: 'line' + i}, lineStyle);
        lineFeatureArray.push(lineFeature);
        graphicLayer.addFeatures([lineFeature]);
    }
    var circleStyle={
        label:'出水口',
        fontSize: "10px",
        fontColor: "#ff0000",
        labelXOffset: 0,
        labelYOffset: 18,
        strokeColor: "#0000ff", 
        strokeWidth: 1, 
        fillColor: "#0000ff", 
        fillOpacity: 0.3 
    }
    //渲染出水口
    for(var i=0;i<lineCoordinates.length;i++){
         
        if((lineCoordinates[i].length)<3){
            console.log('1');
            var coo=[(lineCoordinates[i][0].lon+lineCoordinates[i][1].lon)/2,(lineCoordinates[i][0].lat+lineCoordinates[i][1].lat)/2];
            var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(coo[0],coo[1]), 0.00015, 20, 0);
            var circlefeature = new OpenLayers.Feature.Vector(circle, null, circleStyle); 
            graphicLayer.addFeatures([circlefeature]); 
        }
    }
    var csk=[
        {lon:(lineCoordinates[0][1].lon+lineCoordinates[0][2].lon)/2,lat:(lineCoordinates[0][1].lat+lineCoordinates[0][2].lat)/2},
        {lon:(lineCoordinates[22][1].lon+lineCoordinates[22][2].lon)/2,lat:(lineCoordinates[22][1].lat+lineCoordinates[22][2].lat)/2},
        {lon:(lineCoordinates[43][0].lon+lineCoordinates[43][1].lon)/2,lat:(lineCoordinates[43][0].lat+lineCoordinates[43][1].lat)/2},
        {lon:(lineCoordinates[44][0].lon+lineCoordinates[44][1].lon)/2,lat:(lineCoordinates[44][0].lat+lineCoordinates[44][1].lat)/2},
    ];
    for(var i=0;i<csk.length;i++){
        var circle = OpenLayers.Geometry.Polygon.createRegularPolygon(new OpenLayers.Geometry.Point(csk[i].lon,csk[i].lat), 0.00015, 20, 0);
        var circlefeature = new OpenLayers.Feature.Vector(circle, null, circleStyle); 
        graphicLayer.addFeatures([circlefeature]); 
    }
    var bengfangStyle = {
            externalGraphic: 'img/bengfang.png', 
            graphicWidth: 50, 
            graphicHeight: 21 
        };
    var qixiangzhanStyle = {
            externalGraphic: 'img/qixiangzhan.png', 
            graphicWidth: 30, 
            graphicHeight: 50
        };
    var turangzhanStyle = {
            externalGraphic: 'img/turangzhan.png', 
            graphicWidth: 30, 
            graphicHeight: 50
        };
    
    // 渲染水表
    for(var i = 0; i < sbCoordinates.length; i++) {
        var pt = new OpenLayers.Geometry.Point(sbCoordinates[i].lon, sbCoordinates[i].lat);
        var shuibiaoStyle = {
            externalGraphic: 'img/shuibiao.png', 
            graphicWidth: 30, 
            graphicHeight: 30,
            fontSize: "14px",
            fontColor: "#ff0000",
            fontWeight: "bold",
            labelXOffset: 0,
            labelYOffset: 18,
        };
        if(i <= 18)
            shuibiaoStyle.label = '' + (i + 1) + '';
        else
            shuibiaoStyle.label = '' + (i + 1 - 19) + '';
        var sbfeature = new OpenLayers.Feature.Vector(pt, {id: i}, shuibiaoStyle);
        graphicLayer.addFeatures([sbfeature]);
    }
    //预警
    function yj(){
        var yjStyle={
            externalGraphic: 'img/timg.gif', 
            graphicWidth: 50, 
            graphicHeight: 50
         }
        var yjpt=new OpenLayers.Geometry.Point(117.93872,37.66654); 
        yjfeature=new OpenLayers.Feature.Vector(yjpt, null, yjStyle);
        graphicLayer.addFeatures([yjfeature]);
    }
    // 泵房
    for(var i = 0; i < bfCoordinates.length; i++) {
        var pt = new OpenLayers.Geometry.Point(bfCoordinates[i].lon, bfCoordinates[i].lat); 
        var bffeature = new OpenLayers.Feature.Vector(pt, {id: 'bf' + i}, bengfangStyle);
        graphicLayer.addFeatures([bffeature]);
    }
    // 气象站
    var pt = new OpenLayers.Geometry.Point(qxzCoordinates[0].lon, qxzCoordinates[0].lat); 
    var qxfeature = new OpenLayers.Feature.Vector(pt, {id: 'qx' + 0}, qixiangzhanStyle);
    graphicLayer.addFeatures([qxfeature]);
    // 土壤监测站
    var pt = new OpenLayers.Geometry.Point(trzCoordinates[0].lon, trzCoordinates[0].lat); 
    var trfeature = new OpenLayers.Feature.Vector(pt, {id: 'tr' + 0}, turangzhanStyle);
    graphicLayer.addFeatures([trfeature]);
    ///根据序列点坐标 进行移动 
    function move(start, end, points) {
        var x1 = points[start].lon;
        var y1 = points[start].lat; 
        var x2 = points[end].lon;
        var y2 = points[end].lat;
        var p = (y2 - y1) / (x2 - x1); //斜率
        var v = 0.000025; //速度 
        var x = points[start].lon;
        var y = points[start].lat;
        var lastFeature;
        var moving = setInterval(function () {
            //分别计算 x,y轴方向速度
            if(x1 > x2)
                x -= (1 / Math.sqrt(1 + p * p)) * v;
            else
                x += (1 / Math.sqrt(1 + p * p)) * v;
            if(x1 > x2)
                y -= (p / Math.sqrt(1 + p * p)) * v;
            else
                y += (p / Math.sqrt(1 + p * p)) * v;

            var line = new OpenLayers.Geometry.LineString([
                new OpenLayers.Geometry.Point(x1, y1),
                new OpenLayers.Geometry.Point(x, y),
            ]);
            var feature = new OpenLayers.Feature.Vector(line, {id:'line'}, {
                strokeColor: '#0080FF',
                strokeWidth: 5,
            });
            graphicLayer.addFeatures([feature]);
            if(lastFeature)
                graphicLayer.removeFeatures([lastFeature]);
            lastFeature = feature;

            //图层刷新 
            // map.graphics.redraw(); 
            graphicLayer.redraw(); 
            if (Math.abs(x - x2) < v && Math.abs(y - y2) < v) {
                clearInterval(moving); 
                start++; 
                end++; 

                if (end < points.length) 
                    move(start, end, points);
                if(end === points.length){
                    flag++;
                }
                /*
                if(flag >= lineCoordinates.length){
                    lineFeatureArray[i].style.strokeColor = '#271ed9';
                    graphicLayer.redraw();
                }
                */
            } 
        }, 50); 
    }

    //坐标转换  
    function corTransform(lon, lat) {  
        var proj = new OpenLayers.Projection("EPSG:4326");  
        var lonlat = new OpenLayers.LonLat(lon, lat);  
        lonlat.transform(proj, this.map.getProjectionObject());  
        return lonlat;   
    }
    // 点击事件注册
    var selectControl = new OpenLayers.Control.SelectFeature([graphicLayer]);
    map.addControl(selectControl); 
    selectControl.activate(); 
    function featureSelected(fea) {
        var feature = fea.feature;
        var classname = fea.feature.geometry.CLASS_NAME;
        var id = feature.data.id;
        console.log(classname);
        //泵房点击事件
        if(/^bf/.test(id)){
            console.log(bfData[id].bfbh);
            bfpopupShow(id);
            function bfpopupShow(id){
                var dom='';
                dom = "<div><div style='width: 620px;padding: 0 15px'>"
                    +"<div style='text-align:center;'><h4>详细信息</h4></div><table class='table'>"
                    +"<tr><td class='table-head'>泵站编号</td><td>"+bfData[id]['bfbh']+"</td>"
                    +"<td class='table-head'>控制面积（亩）</td><td>"+bfData[id]['area']+"</td></tr>"
                    +"<tr><td class='table-head'>泵站设计流量（m³/h）</td><td>"+bfData[id]['flow']+"</td>"
                    +"<td class='table-head'>泵站设计扬程（m）</td><td>"+bfData[id]['sjyc']+"</td></tr>"
                    +"<tr><td colspan='2' class='table-head'>集水管及其连接输水管道直径（mm）</td><td colspan='2'>"+bfData[id]['diameter']+"</td>"
                    +"<tr><td colspan='4' class='table-head'>离心泵选型</td></tr>"
                    +"<tr><td class='table-head'>型号</td><td>"+bfData[id]['lxbxx']['xh']+"</td>"
                    +"<td class='table-head'>流量（m³/h）</td><td>"+bfData[id]['lxbxx']['flow']+"</td></tr>"
                    +"<tr><td class='table-head'>扬程（m）</td><td>"+bfData[id]['lxbxx']['yc']+"</td>"
                    +"<td class='table-head'>单机功率（KW）</td><td>"+bfData[id]['lxbxx']['pw']+"</td></tr>"
                    +"<tr><td class='table-head'>机组数量（台套）</td><td>2</td>"
                    +"<td colspan='2'></td></tr>"
                    +"<tr><td colspan='4' class='table-head'>潜污泵选型</td></tr>"
                    +"<tr><td class='table-head'>型号</td><td>150QW110-15-7.5</td>"
                    +"<td class='table-head'>流量（m³/h）</td><td>110</td></tr>"
                    +"<tr><td class='table-head'>扬程（m）</td><td>15</td>"
                    +"<td class='table-head'>单机功率（KW）</td><td>7.5</td></tr>"
                    +"<tr><td class='table-head'>机组数量（台套）</td><td>2</td>"
                    +"<td colspan='2'></td></tr>"
                    +"<table></div></div>";
                var popup = new OpenLayers.Popup.FramedCloud("xx", 
                    new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y),
                    null, dom, null, true);
                map.addPopup(popup, true);
                // console.log(popup);
                selectControl.unselectAll(); 
            }
        }
        //气象站点击
        else if(/^qx/.test(id)){
            var dom='';
            dom = "<div><div style='width: 620px;padding: 0 15px'>"
                +"<div style='text-align:center;'><h4>详细信息</h4></div><table class='table'>"
                +"<tr><td class='table-head'>创建时间</td><td>2016-05-25 14:43:30</td>"
                +"<td class='table-head'>降雨</td><td>无降雨</td></tr>"
                +"<tr><td class='table-head'>空气温度（℃）</td><td>23.76</td>"
                +"<td class='table-head'>空气湿度（hPa）</td><td>39.02</td></tr>"
                +"<tr><td class='table-head'>CO2浓度（ppm）</td><td>435.49</td>"
                +"<td class='table-head'>风向</td><td>58740.00</td></tr>"
                +"<tr><td class='table-head'>风速（m/s）</td><td >0.94</td>"
                +"<td class='table-head'>光照（lx）</td><td>22.72</td></tr>"
                +"<table></div></div>";
            var popup = new OpenLayers.Popup.FramedCloud("xx", 
                new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y),
                null, dom, null, true);
            map.addPopup(popup, true);
            // console.log(popup);
            selectControl.unselectAll(); 
        }
        //土壤站点击
        else if(/^tr/.test(id)){
            var dom='';
            dom = "<div><div style='width: 620px;padding: 0 15px'>"
                +"<div style='text-align:center;'><h4>详细信息</h4></div><table class='table'>"
                +"<tr><td class='table-head'>创建时间</td><td>2016-05-25 14:13:30</td>"
                +"<td class='table-head'>土壤温度（℃）</td><td>19.45</td></tr>"
                +"<tr><td class='table-head'>土壤湿度（hPa）</td><td>18.52</td>"
                +"<td colspan='2'></td></tr>"
                +"<table></div></div>";
            var popup = new OpenLayers.Popup.FramedCloud("xx", 
                new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y),
                null, dom, null, true);
            map.addPopup(popup, true);
            // console.log(popup);
            selectControl.unselectAll(); 
        }
        //干管点击
        else if(/^zg/.test(id)){
            zgShow(id);
            function zgShow(id){
                var index=id.substring(2);
                console.log(index);
                var _lon=(zgCoordinates[index][0].lon+zgCoordinates[index][1].lon)/2;
                var _lat=(zgCoordinates[index][0].lat+zgCoordinates[index][1].lat)/2;
                var dom='';
                dom = "<div><div style='width: 620px;padding: 0 15px'>"
                    +"<div style='text-align:center;'><h4>干管信息</h4></div><table class='table'>"
                    +"<tr><td class='table-head'>管段</td><td>"+zgData[id]['gd']+"</td>"
                    +"<td class='table-head'>可供同时工作给水栓个数</td><td>"+zgData[id]['count']+"</td></tr>"
                    +"<tr><td class='table-head'>设计流量（m³/h）</td><td>"+zgData[id]['sjflow']+"</td>"
                    +"<td class='table-head'>计算管道内径（mm）</td><td>"+zgData[id]['sjnj']+"</td></tr>"
                    +"<tr><td class='table-head'>选择管径(mm）</td><td>"+zgData[id]['xzgj']+"</td>"
                    +"<td class='table-head'>管段条数</td><td>"+zgData[id]['gdts']+"</td></tr>"
                    +"<tr><td class='table-head'>管段长度（m）</td><td>"+zgData[id]['gdcd']+"</td>"
                    +"<td colspan='2'></td></tr>"
                    +"<table></div></div>";
                var popup = new OpenLayers.Popup.FramedCloud("xx", 
                    new OpenLayers.LonLat(_lon,_lat),
                    null, dom, null, true);
                map.addPopup(popup, true);
                // console.log(popup);
                selectControl.unselectAll(); 
            }
       }
       //分干管点击
        else if(/^fgg/.test(id)){
            fggShow(id);
            function fggShow(id){
                var index=id.substring(3);
                //console.log(index);
                var _lon=(fggCoordinates[index][0].lon+fggCoordinates[index][1].lon)/2;
                var _lat=(fggCoordinates[index][0].lat+fggCoordinates[index][1].lat)/2;
                var dom='';
                dom = "<div><div style='width: 620px;padding: 0 15px'>"
                    +"<div style='text-align:center;'><h4>分干管信息</h4></div><table class='table'>"
                    +"<tr><td class='table-head'>管段</td><td>"+fggData[id]['gd']+"</td>"
                    +"<td class='table-head'>可供同时工作给水栓个数</td><td>"+fggData[id]['count']+"</td></tr>"
                    +"<tr><td class='table-head'>设计流量（m³/h）</td><td>"+fggData[id]['sjflow']+"</td>"
                    +"<td class='table-head'>计算管道内径（mm）</td><td>"+fggData[id]['sjnj']+"</td></tr>"
                    +"<tr><td class='table-head'>选择管径(mm）</td><td>"+fggData[id]['xzgj']+"</td>"
                    +"<td class='table-head'>管段条数</td><td>"+fggData[id]['gdts']+"</td></tr>"
                    +"<tr><td class='table-head'>管段长度（m）</td><td>"+fggData[id]['gdcd']+"</td>"
                    +"<td colspan='2'></td></tr>"
                    +"<table></div></div>";
                var popup = new OpenLayers.Popup.FramedCloud("xx", 
                    new OpenLayers.LonLat(_lon,_lat),
                    null, dom, null, true);
                map.addPopup(popup, true);
                // console.log(popup);
                selectControl.unselectAll(); 
            }
       }
        //支管道点击
       else if(classname.match(/LineString/)){
           var index=id.substring(4);
           var dom='';
            dom = "<div><div style='width: 620px;padding: 0 15px'>"
                +"<div style='text-align:center;'><h4>支管信息</h4></div><table class='table'>"
                +"<tr><td class='table-head'>可供同时工作给水栓个数</td><td>1</td>"
                +"<td class='table-head'>设计流量（m³/h）</td><td>60</td></tr>"
                +"<tr><td class='table-head'>计算管道内径（mm）</td><td>132.94</td>"
                +"<td class='table-head'>选择管径(mm）</td><td>160</td></tr>"
                +"<tr><td class='table-head'>管段条数</td><td>41</td>"
                +"<td class='table-head'>管段长度（m）</td><td>15478</td></tr>"
                +"<table></div></div>";
            var popup = new OpenLayers.Popup.FramedCloud("xx", 
                new OpenLayers.LonLat(lineCoordinates[index][0].lon, lineCoordinates[index][0].lat),
                null, dom, null, true);
            map.addPopup(popup, true);
            // console.log(popup);
            selectControl.unselectAll(); 
       }
        //水表点击
        else{
            // 检索当前水表状态
            var status; // 当前数据
            for(var i = 0;i < useWaterInf.length;i++) {
                if(useWaterInf[i].TerminalCode == sbCoordinates[id].terminalCode) {
                    status = useWaterInf[i];
                }
            }
            for(var i = 0;i < singleUseWaterInf.length;i++) {
                if(singleUseWaterInf[i].TerminalCode == sbCoordinates[id].terminalCode) {
                    status = singleUseWaterInf[i];
                }
            }
            // console.log(status);
            var dom = '';
            if(status) {
                var CreateTime = status['CreateTime'] ? status['CreateTime'].date.split('.')[0] : '暂无数据';
                var EndTime = status['EndTime'] ? status['EndTime'].date.split('.')[0] : '暂无数据';
                var StartTime = status['StartTime'] ? status['StartTime'].date.split('.')[0] : '暂无数据';
                var updatetime = status['updatetime'] ? status['updatetime'].date.split('.')[0] : '暂无数据';

                var FertilizerStus = status['FertilizerStus'] ? status['FertilizerStus'] : '暂无数据';
                var EndAmount = status['EndAmount'] ? status['EndAmount'] : '暂无数据';
                var StartAmount = status['StartAmount'] ? status['StartAmount'] : '暂无数据';
                var SurplusAmount = status['SurplusAmount'] ? status['SurplusAmount'] : '暂无数据';
                var TerminalStatus = status['TerminalStatus'] ? status['TerminalStatus'] : '暂无数据';
                var ThisUsedAmount = status['ThisUsedAmount'] ? status['ThisUsedAmount'] : '暂无数据';
                var TotalAmount = status['TotalAmount'] ? status['TotalAmount'] : '暂无数据';
                var WaterFlow = status['WaterFlow'] ? status['WaterFlow'] : '暂无数据';

                dom = "<div><div style='width: 600px;padding: 0 15px'>"
                +"<div style='text-align:center;'><h4>详细信息</h4></div><table class='table'>"
                +"<tr><td class='table-head'>ID</td><td>"+status['DBID']+"</td>"
                +"<td class='table-head'>用户卡号</td><td>"+status['CardCode']+"</td></tr>"
                +"<tr><td class='table-head'>创建时间</td><td>"+CreateTime+"</td>"
                +"<td class='table-head'>结束用量</td><td>"+EndAmount+"</td></tr>"
                +"<tr><td class='table-head'>结束时间</td><td>"+EndTime+"</td>"
                +"<td class='table-head'>施肥器状态</td><td>"+FertilizerStus+"</td></tr>"
                +"<tr><td class='table-head'>起始用量</td><td>"+StartAmount+"</td>"
                +"<td class='table-head'>开始时间</td><td>"+StartTime+"</td></tr>"
                +"<tr><td class='table-head'>剩余量</td><td>"+SurplusAmount+"</td>"
                +"<td class='table-head'>设备编号</td><td>"+status['TerminalCode']+"</td></tr>"
                +"<tr><td class='table-head'>设备状态</td><td>"+TerminalStatus+"</td>"
                +"<td class='table-head'>本次用量</td><td>"+ThisUsedAmount+"</td></tr>"
                +"<tr><td class='table-head'>总用量</td><td>"+TotalAmount+"</td>"
                +"<td class='table-head'>修改时间</td><td>"+updatetime+"</td></tr>"
                +"<tr><td class='table-head'>流量、流速</td><td>"+WaterFlow+"</td>"
                +"<td></td><td></td></tr>"
                +"<table></div></div>";
            } else {
                dom = "<div><div style='min-height: 100px;width: 400px;padding: 0 15px'>"
                +"<div><h4>详细信息</h4></div>"
                +"<p>暂无数据</p>"
                +"</div></div>";
            }
            
            var popup = new OpenLayers.Popup.FramedCloud("xx", 
                new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y),
                null, dom, null, true);
            map.addPopup(popup, true);
            // console.log(popup);
            selectControl.unselectAll(); 
        }
    }
    
   
    graphicLayer.events.on({ "featureselected": featureSelected }); 
    
    /*map.events.register('click', null, function (e) {
        var pos = $(map.div).offset();
        //坐标转换
        var px = new OpenLayers.Pixel(e.clientX - pos.left, e.clientY - pos.top);
        var lonlat = map.getLonLatFromPixel(px);
        alert(lonlat.lon.toFixed(5) + ";" + lonlat.lat.toFixed(5));
    })*/
    var yjflag=0;
    //模拟流水和预警
    $(document).keydown(function(event){
        //alert(event.keyCode);//弹出按键的对应值 
        if(event.keyCode==81){
            if(!yjflag){
                yj();
                yjflag=1;
            }
        }
        if(event.keyCode==65){
            graphicLayer.removeFeatures([yjfeature]);
            yjflag=0;
        }
        if(event.keyCode==87){
            // 水流绘制
            var flag = 0;
            // 生成随机流水数组
            var arr = [];
            for(var i = 0; i < 5; i++){
                arr[i] = parseInt(lineCoordinates.length/2 * Math.random());
            }
            console.log(arr);
            setTimeout(function(){    
                for(var i = 0; i < lineCoordinates.length/2; i++) {
                    if($.inArray(i, arr) != -1)
                        move(0, 1, lineCoordinates[i]);
                }
            }, 500);
        }
    });
}); 