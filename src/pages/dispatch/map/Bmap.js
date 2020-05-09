
import React, { Component } from 'react';
import routepoints from './data'
class Bmap extends Component {
    componentDidMount() {
        const { BMap, BMAP_STATUS_SUCCESS } = window

        //车辆配送路径
        function addLine(longitudeFrom, latitudeFrom, longitudeTo, latitudeTo) {
            //if (!map)
            //return;
            var pointFrom = new BMap.Point(longitudeFrom, latitudeFrom);
            var pointTo = new BMap.Point(longitudeTo, latitudeTo);
            var driving = new BMap.DrivingRoute(map, {
                renderOptions: {
                    map: map,
                    autoViewport: true
                },
                onPolylinesSet: function (Route) {
                    //当线条添加完成时调用
                    for (var i = 0; i < Route.length; i++) {
                        var polyline = Route[i].getPolyline();//获取线条遮挡物
                        polyline.setStrokeColor('#' + Math.floor(Math.random() * 16777215).toString(16));//设置颜色
                        polyline.setStrokeWeight(5);//设置宽度
                        polyline.setStrokeOpacity(1);//设置透明度
                    }
                },
                onMarkersSet: function (routes) {
                    //当地图标记添加完成时调用
                    for (var i = 0; i < routes.length; i++) {
                        //判断是否是途经点
                        if (typeof (routes[i].Km) == "undefined") {
                            map.removeOverlay(routes[i].marker); //删除起始默认图标
                        } else {
                            map.removeOverlay(routes[i].Km); //删除途经默认图标
                        }
                    }
                }
            });

            driving.enableAutoViewport();//自动调整层级

            driving.search(pointFrom, pointTo);

        }

        //创建标注点并添加到地图中
        function addMarker(routepoints) {
            //循环建立标注点
            for (var j = 0, pointx = routepoints.length; j < pointx; j++) {
                for (var i = 0, pointsLen = routepoints[j].length; i < pointsLen; i++) {
                    var point = new BMap.Point(routepoints[j][i].lng, routepoints[j][i].lat); //将标注点转化成地图上的点
                    //起点终点颜色标注
                    if (i == 0) {
                        var marker = new BMap.Label("起点", { position: point });
                    }
                    else if (i == pointsLen - 1) {
                        var marker = new BMap.Label("终点", { position: point });
                    }
                    else {
                        var marker = new BMap.Marker(point); //将点转化成标注点
                    }
                    map.addOverlay(marker); //将标注点添加到地图上

                }
            }

        }

        // 百度地图API功能
        var map = new BMap.Map("allmap"); // 创建Map实例
        map.centerAndZoom(new BMap.Point(121.4, 31.2), 12); // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
        map.addControl(new BMap.NavigationControl()); //添加控件：缩放地图的
        map.addControl(new BMap.ScaleControl()); //添加控件：地图显示比例的控件，默认在左下方；
        map.addControl(new BMap.OverviewMapControl()); //添加控件：地图的缩略图的控件，默认在右下方； TrafficControl    
        map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        for (var j = 0, pointx = routepoints.length; j < pointx; j++) {
            for (var i = 0, pointsLen = routepoints[j].length - 1; i < pointsLen; i++) {
                addLine(routepoints[j][i].lng, routepoints[j][i].lat,
                    routepoints[j][i + 1].lng, routepoints[j][i + 1].lat);
            }
        }
        addMarker(routepoints);
        /*window.onload = function () {
            var url = "c101.json";
            var request = new XMLHttpRequest();
            request.open("get",url);
            request.send(null);
            request.onload = function () {
                if(request.status == 200) {
                    routepoints = JSON.parse(request.responseText);
                    console.log(routepoints);
                    for (var j = 0, pointx = routepoints.length; j < pointx; j++) {
                        for (var i = 0, pointsLen = routepoints[j].length - 1; i < pointsLen; i++) {
                            addLine(routepoints[j][i].lng, routepoints[j][i].lat,
                                    routepoints[j][i + 1].lng, routepoints[j][i + 1].lat);
                        }
                    }
    
                    addMarker(routepoints);
                }
            }
        }*/
    }

    render() {
        return (
            <div id="allmap" style={{ width: '100%', height: '350px' }}></div>
        );
    }
}
export default Bmap;
