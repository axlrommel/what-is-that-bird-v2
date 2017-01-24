package com.villagomezdiaz;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@SpringBootApplication
public class WhatIsThatBirdBootApplication implements CommandLineRunner{

	@Value("${spring.data.redis.repositories.enabled}")
	private String redisEnabled;
	
	@Value("${spring.redis.host}")
	private String hostName;
	
	@Value("${spring.redis.port}")
	private int port;
	
	private static JedisPool pool = null;
	
	public static void main(String[] args) {
		SpringApplication.run(WhatIsThatBirdBootApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		
		if(redisEnabled.equalsIgnoreCase("TRUE")) {
			setPool(new JedisPool(new JedisPoolConfig(),hostName,port));
		}
		
	}

	public static JedisPool getPool() {
		return pool;
	}

	public static void setPool(JedisPool pool) {
		WhatIsThatBirdBootApplication.pool = pool;
	}
	
	
}
