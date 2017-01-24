package com.villagomezdiaz.common;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;

public class ImageReaderFromRequest {

	BufferedImage image;
	
	public BufferedImage getPayload() {
		
    	return image;
    	
	}
	
	public ImageReaderFromRequest(String message) throws Exception {
		super();
		String encodedImage = null;

    	// string=data%3Aimage%2Fjpeg%3Bbase64%2C%2F9j%2F4AAQSkZJRgA
    	// need to change to:
    	// "data:image/jpeg;base64,/9j/4AAQSkZ..."
    	int idx1 = message.indexOf("data%3Aimage");
    	String newMessage = message.substring(idx1);
    	String newMessage1 = newMessage.replace("%2F", "/").replace("%3A", ":").replace("%3B", ";").replace("%2C", ",");
    	
		String d1 = new String(java.net.URLDecoder.decode(newMessage1, "UTF-8"));
		int index = d1.indexOf(",");
		encodedImage = d1.substring(index + 1);
		
		//debug stuff if needed
		
//		PrintWriter out = new PrintWriter("C:\\Users\\Owner\\Downloads\\file1.html");
//		out.println("<!DOCTYPE html>\n<html>\n<body>\n<h1>Heading</h1>\n<p>Paragraph.</p>");
//		out.println("<img src=\"" + d1 + "\">");
//		out.println("</body>\n</html>");
//		out.close();
    		
    	
    	if( encodedImage != null) {
    		byte[] byteArray = Base64.decodeBase64(encodedImage);
    		InputStream in = new ByteArrayInputStream(byteArray);
    		image = ImageIO.read(in);
    		
    		//more debug if needed
    		//ImageIO.write(image, "jpg", new File("/home/pi/Downloads/file1.jpeg"));

    	}
	}
	
}
