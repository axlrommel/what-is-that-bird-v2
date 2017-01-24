package com.villagomezdiaz;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.modules.junit4.PowerMockRunner;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

//@RunWith(SpringRunner.class)
//@WebMvcTest(BirdLookupController.class)
@RunWith(PowerMockRunner.class)
public class BirdLookupControllerTest {

	
	@Test
	public void testGetBirdmatches() {
		//pass("Not yet implemented");
	}

	@Test	
	public void testgetBirdList() {
//		Set<String> val = new HashSet<>();
//		val.add("cardinal");
//		val.add("blue jay");
//		BirdLookupController test = new BirdLookupController();
//		test.setRedisEnabled(true);
//		Jedis mockJedis = Mockito.mock(Jedis.class);
//		//JedisPool mockPool = Mockito.mock(JedisPool.class);
//		PowerMockito.mockStatic(WhatIsThatBirdBootApplication.class);
//		PowerMockito.when(WhatIsThatBirdBootApplication.getPool().getResource()).thenReturn(mockJedis);
//		//when(mockPool.getResource()).thenReturn(mockJedis);
//		when(mockJedis.smembers("birds")).thenReturn(val);
//		assertEquals(test.getBirdList("dummy"),"blue jay\ncardinal");
		
	}

}
