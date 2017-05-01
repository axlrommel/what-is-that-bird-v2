package com.villagomezdiaz;

import java.io.IOException;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.villagomezdiaz.common.ImageReaderFromRequest;
import com.villagomezdiaz.common.ds.BirdMatchingResultsSample;
import com.villagomezdiaz.utilities.ImageComparer;

import redis.clients.jedis.Jedis;

@RestController
public class BirdLookupController {
	
	@Value("${spring.data.redis.repositories.enabled}")
	private String redisEnabled;
	
	@RequestMapping(method = RequestMethod.POST, value = "/JSONServlet2")
    public void getBirdmatches(@RequestBody String request, HttpServletResponse response) {
		
		
		ObjectMapper mapper = new ObjectMapper();
		response.setContentType("application/json");
		response.setHeader("Cache-Control", "nocache");
        response.setCharacterEncoding("utf-8");
        ImageComparer comparer = new ImageComparer();
        Jedis jedis = null;
        
		try {			
			if(redisEnabled.equalsIgnoreCase("TRUE")) {
				ImageReaderFromRequest img = new ImageReaderFromRequest(request);
				//BufferedImage i = img.getPayload();
				jedis = WhatIsThatBirdBootApplication.getPool().getResource();
				mapper.writeValue(response.getOutputStream(), comparer.getMatchingResults(
						img.getPayload(), jedis));
			}
			else {
				mapper.writeValue(response.getOutputStream(), BirdMatchingResultsSample.getBirdMatchingResultsSample());
			}

		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
			if(redisEnabled.equalsIgnoreCase("TRUE")) {
				WhatIsThatBirdBootApplication.getPool().returnResourceObject(jedis);
			}
		}
    }
	

	@RequestMapping(method = RequestMethod.GET, value = "/InfoServlet")
	String getBirdList(@RequestParam (value="birds", required=false, defaultValue="bird") String request) {
		StringBuffer retval = new StringBuffer();
    	Jedis jedis = null;
        
        try {
        	if(redisEnabled.equalsIgnoreCase("TRUE")) {
	        	jedis = WhatIsThatBirdBootApplication.getPool().getResource();
	        	StringBuffer listOfBirds = new StringBuffer();
	        	Set<String> list1 = jedis.smembers("birds");
				retval.append("<p>Source: <a href=\"http://www.vision.caltech.edu/visipedia/CUB-200-2011.html\">Caltech-UCSD Birds-200-2011</a></p>");
				retval.append("<p>");
	        	for(String l:list1) {
	        		listOfBirds.append(l + "</br>");
	        	}
	        	retval.append(listOfBirds.toString());
				retval.append("</p>");
        	}
        	else {
        		StringBuffer listOfBirds = new StringBuffer();
        		listOfBirds.append("cardinal\n");
        		listOfBirds.append("blue jay\n");
        		retval.append(listOfBirds.toString());
        	}
        }
        catch(Exception e) {
        	e.printStackTrace();
			retval.append("Server Error");
        }
		if(redisEnabled.equalsIgnoreCase("TRUE")) {
			WhatIsThatBirdBootApplication.getPool().returnResourceObject(jedis);
		}
		return retval.toString();
	}
	
	public void setRedisEnabled(boolean val) {
		if(val) {
			redisEnabled = "true";
		}
	}
}
