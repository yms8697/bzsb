//定义地图对象 
var map; 
var sdannoLayer = new SDRSAnnoLayer();
var sdimgLayer = new SDRasterLayer(); 
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

    var zgStyle = {
        strokeColor: '#0080FF',
        strokeWidth: 8,
    };
    for(var i = 0; i < zgCoordinates.length; i++) {
        var lineStringArray = [];
        for(var j = 0; j < zgCoordinates[i].length; j++) {
            lineStringArray.push(
                new OpenLayers.Geometry.Point(zgCoordinates[i][j].lon, zgCoordinates[i][j].lat)
            );
        }
        var line = new OpenLayers.Geometry.LineString(lineStringArray); 
            var feature = new OpenLayers.Feature.Vector(line, {i}, zgStyle);
        graphicLayer.addFeatures([feature]);
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
            var lineFeature = new OpenLayers.Feature.Vector(line, {i}, lineStyle);
        lineFeatureArray.push(lineFeature);
        graphicLayer.addFeatures([lineFeature]);
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
        var feature = new OpenLayers.Feature.Vector(pt, {id: i}, shuibiaoStyle);
        graphicLayer.addFeatures([feature]);
    }
    // 泵房
    for(var i = 0; i < bfCoordinates.length; i++) {
        var pt = new OpenLayers.Geometry.Point(bfCoordinates[i].lon, bfCoordinates[i].lat); 
        var feature = new OpenLayers.Feature.Vector(pt, {id: 'bf' + i}, bengfangStyle);
        graphicLayer.addFeatures([feature]);
    }
    // 气象站
    var pt = new OpenLayers.Geometry.Point(qxzCoordinates[0].lon, qxzCoordinates[0].lat); 
    var feature = new OpenLayers.Feature.Vector(pt, {id: 'qx' + 0}, qixiangzhanStyle);
    graphicLayer.addFeatures([feature]);
    // 土壤监测站
    var pt = new OpenLayers.Geometry.Point(trzCoordinates[0].lon, trzCoordinates[0].lat); 
    var feature = new OpenLayers.Feature.Vector(pt, {id: 'tr' + 0}, turangzhanStyle);
    graphicLayer.addFeatures([feature]);
    
    // 水流绘制
    var flag = 0;
    // 生成随机流水数组
    var arr = [];
    for(var i = 0; i < 5; i++){
        arr[i] = parseInt(lineCoordinates.length * Math.random());
    }
    console.log(arr);
    setTimeout(function(){    
        for(var i = 0; i < lineCoordinates.length; i++) {
            if($.inArray(i, arr) != -1)
                move(0, 1, lineCoordinates[i]);
        }
    }, 500);
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
            var feature = new OpenLayers.Feature.Vector(line, null, {
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

    // 水表点击事件注册
    var selectControl = new OpenLayers.Control.SelectFeature([graphicLayer]);
    map.addControl(selectControl); 
    selectControl.activate(); 
    function featureSelected(fea) {
        var feature = fea.feature;
        var id = feature.data.id;
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
            +"<div><h4>详细信息</h4></div><table class='table'>"
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
    graphicLayer.events.on({ "featureselected": featureSelected }); 
    /*
    map.events.register('click', null, function (e) {          
        var pos = $(map.div).offset();
        //坐标转换
        var px = new OpenLayers.Pixel(e.clientX - pos.left, e.clientY - pos.top);
        var lonlat = map.getLonLatFromPixel(px);
        alert(lonlat.lon.toFixed(5) + ";" + lonlat.lat.toFixed(5));
    })
    */
}); 