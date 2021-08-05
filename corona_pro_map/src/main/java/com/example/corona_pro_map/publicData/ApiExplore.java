package com.example.corona_pro_map.publicData;
import org.apache.tomcat.jni.Local;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@RestController
public class ApiExplore {

    @GetMapping("/jsonapi")
    public String callApiWithJson(@RequestParam("localname") String localname){
        StringBuffer result = new StringBuffer();
        // 현재시간
        LocalDate now = LocalDate.now();
        DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyyMMdd");
        String createtDate = now.minusDays(16).format(format);
        String endDate = now.minusDays(1).format(format);

        try {
            String apiUrl = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?" +
                    "serviceKey=e182mugN8iX8RG8gO0xgR57jVZsKUJlJFs6sQT7dNszOQKQvePyRcJL1tODm2TBycA%2FI0obauEDEOkA6XinByA%3D%3D" +
                    "&numOfRows=10" +
                    "&pageNo=1" +
                    "&startCreateDt=" + createtDate +
                    "&endCreateDt=" + endDate ;
            System.out.println("apiUrl = " + apiUrl);
            URL url = new URL(apiUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(), "UTF-8"));
            String returnLine;
            while((returnLine = bufferedReader.readLine()) != null) {
                result.append(returnLine + "\n");
            }
            urlConnection.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
        JSONObject jsonObject = XML.toJSONObject(result.toString());
//        System.out.println("jsonObject = " + jsonObject.toString());
        System.out.println("jsonObject = " + jsonObject);
        Object resultCode = jsonObject.getJSONObject("response").getJSONObject("header").get("resultCode");
//        System.out.println("resultCode = " + resultCode.toString());
        List<String> filterd = new ArrayList<>();
        JSONArray jsonArray = new JSONArray();
        JSONArray itemData;
        
        if(resultCode.toString().equals("00")){
            itemData = jsonObject.getJSONObject("response").getJSONObject("body").getJSONObject("items").getJSONArray("item");
//            System.out.println("itemData = " + itemData);
            for(int i =0; i< itemData.length(); i++){
                JSONObject obj =  itemData.getJSONObject(i);
                String gubun = obj.getString("gubun");
                if(!gubun.equals("검역") && !gubun.equals("합계") && gubun.equals(localname)){
                    jsonArray.put(obj);
                }
            }
//            System.out.println("jsonArray = " + jsonArray);
        }else{
            itemData = null;
        }
        System.out.println(jsonArray.toString());
        return jsonArray.toString();
    }

}