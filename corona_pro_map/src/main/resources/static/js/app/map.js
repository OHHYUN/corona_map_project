var map;
// CTPRVN(도, 시)
var URL_CTPRVN = "/geo/TL_SCCO_CTPRVN.json";
var polygons_CTPRVN=[];
// SIG(시, 군, 구)
var URL_SIG = "/geo/TL_SCCO_SIG.json";
var polygons_SIG=[];

var customOverlay;

var svg = d3.select(".canvas").attr("height",600),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    x = d3.scaleBand().padding(0.1),
    y = d3.scaleLinear(),
    theData = undefined;

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


$(document).ready(function() {

    fnInit();
    function fnInit(){
        fnSetChart();

//        // START!
//        window.addEventListener("resize", draw);


        loadData("제주");
        fnSetMap();
        loadJsonMap(URL_CTPRVN, polygons_CTPRVN);
//        loadJsonMap(URL_SIG, polygons_SIG);
        draw();
    }

    function fnSetMap(){
        var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(37.5693255,126.9838179), //지도의 중심좌표.
            level: 11 //지도의 레벨(확대, 축소 정도)
        };

        map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        customOverlay = new kakao.maps.CustomOverlay({});
    }

    function loadJsonMap(jsonData, polygons){
        $.getJSON(jsonData, function(geojson) {
            var data = geojson.features;
            var coordinates = [];    //좌표 저장할 배열
            var name = '';            //행정 구 이름
            // console.log(data);
            $.each(data, function(index, val) {
                coordinates = val.geometry.coordinates;
                if(jsonData == URL_CTPRVN){
                    name = val.properties.CTP_KOR_NM;
                }else{
                    name = val.properties.SIG_KOR_NM;
                }
                displayArea(coordinates, name, polygons);
            })
        })
    }

//행정구역 폴리곤
    function displayArea(coordinates, name, polygons) {

        var path = [];            //폴리곤 그려줄 path
        var points = [];        //중심좌표 구하기 위한 지역구 좌표들

        $.each(coordinates[0], function(index, coordinate) {        //console.log(coordinates)를 확인해보면 보면 [0]번째에 배열이 주로 저장이 됨.  그래서 [0]번째 배열에서 꺼내줌.
            var point = new Object();
            point.x = coordinate[1];
            point.y = coordinate[0];
            points.push(point);
            path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));            //new kakao.maps.LatLng가 없으면 인식을 못해서 path 배열에 추가
        })

        // 다각형을 생성합니다
        var polygon = new kakao.maps.Polygon({
            map : map, // 다각형을 표시할 지도 객체
            path : path,
            strokeWeight : 2,
            strokeColor : '#004c80',
            strokeOpacity : 0.8,
            fillColor : '#fff',
            fillOpacity : 0.7
        });

        polygons.push(polygon);            //폴리곤 제거하기 위한 배열

        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
        // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
        kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
            polygon.setOptions({
                fillColor : '#09f'
            });

            customOverlay.setContent('<div class="area">' + name + '</div>');

            customOverlay.setPosition(mouseEvent.latLng);
            customOverlay.setMap(map);
        });

        // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
        kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {

            customOverlay.setPosition(mouseEvent.latLng);
        });

        // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
        // 커스텀 오버레이를 지도에서 제거합니다
        kakao.maps.event.addListener(polygon, 'mouseout', function() {
            polygon.setOptions({
                fillColor : '#fff'
            });
            customOverlay.setMap(null);
        });

        // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 해당 지역 확대을 확대합니다.
        kakao.maps.event.addListener(polygon, 'click', function() {

            $("#localname").text(name);
            var loadDataParamName = "경기"
            if(name == "경기도"){
                loadDataParamName = "경기"
            }else if(name == "충청북도"){
                loadDataParamName = "충북"
            }else if(name == "충청남도"){
                loadDataParamName = "충남"
            }else if(name == "강원도"){
                loadDataParamName = "강원"
            }else if(name == "경상북도"){
                loadDataParamName = "경북"
            }else if(name == "서울특별시"){
                loadDataParamName = "서울"
            }else if(name == "제주특별자치도"){
                loadDataParamName = "제주"
            }

            loadData(loadDataParamName);
            // 현재 지도 레벨에서 2레벨 확대한 레벨
//            var level = map.getLevel()-2;

            // 지도를 클릭된 폴리곤의 중앙 위치를 기준으로 확대합니다
//            map.setLevel(level, {anchor: centroid(points), animate: {
//                    duration: 350            //확대 애니메이션 시간
//                }});

//            deletePolygon(polygons);                    //폴리곤 제거
        });
    }

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'zoom_changed', function() {

        // 지도의 현재 레벨을 얻어옵니다
        var level = map.getLevel();

        if(level > 10){
            var message = '현재 지도 레벨은 ' + level + ' 입니다';
            // console.log("message" + message);
            fnloadPolygon(polygons_CTPRVN, map);
            fnloadPolygon(polygons_SIG, null);
        }else{
            var message = '현재 지도 레벨은 ' + level + ' 입니다';
            // console.log("messagezzzzzzzzzzz" + message);
            fnloadPolygon(polygons_CTPRVN, null);
            fnloadPolygon(polygons_SIG, map);
        }
    });

    function fnloadPolygon(polygons, map){
        $.each(polygons, function(index, value){
            value.setMap(map);
        });
    }
    /**
        d3 chart 생성
    **/
    function fnSetChart(){
     // SETUP
        g.append("g")
                .attr("class", "axis axis--x");

        g.append("g")
                .attr("class", "axis axis--y");

        g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("수");
    }


    // DRAWING

    function draw() {

        var bounds = svg.node().getBoundingClientRect(),
                width = bounds.width - margin.left - margin.right,
                height = bounds.height - margin.top - margin.bottom;

        x.rangeRound([0, width]);
        y.rangeRound([height, 0]);
        g.select(".axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

        g.select(".axis--y")
                .call(d3.axisLeft(y));

        var bars = g.selectAll(".bar")
                .data(theData);
        // ENTER
        bars
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.stdDay.substring(10,13)); })
                .attr("y", function (d) { return y(d.defCnt); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.defCnt); });

        // UPDATE
        bars.attr("x", function (d) { return x(d.stdDay.substring(10,13)); })
                .attr("y", function (d) { return y(d.defCnt); })
                .attr("width", x.bandwidth())
                .attr("height", function (d) { return height - y(d.defCnt); });

        // EXIT
        bars.exit()
                .remove();

    }

    // LOADING DATA
    var data;
    function getData(){
        $.ajax({
            type: 'GET',
            url: '/jsonapi',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            success: function(obj){
                data = obj;
                // console.log(data);
                loadData(data);
            }
        });
    }

    function loadData(localname) {
        // d3.json()
        d3.json("/jsonapi?localname="+localname, function (error, data) {
            if (error) throw error;
            theData = data;
            theData = theData.sort(function(a, b){
                return a.seq - b.seq;
            })
            console.log(theData);
            x.domain(theData.map(function (d) {
                    return d.stdDay.substring(10,13);
            }));
            y.domain([0, d3.max(theData, function (d) {
                    console.log(d.defCnt);
                    return d.defCnt;
            })]);
            draw();
        });
    }


});