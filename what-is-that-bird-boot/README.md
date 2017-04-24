System Requirements:

Java 8
Redis running locally

Instructions:
Download the source code

navigate to what-is-that-bird-v2/what-is-that-bird-boot and install jar file in your local maven repository.
jar file can also be found here: http://www.jhlabs.com/ip/filters/index.html

mvn install:install-file -Dfile=src/main/webapp/WEB-INF/lib/Filters-1.0.jar -DgroupId=ImageFilters -DartifactId=Filters -Dversion=1.0 -Dpackaging=jar

copy redis-db/dump.rdb to your local redis database

build your package:
mvn package

run the application:
java -jar target/demo-0.0.1-SNAPSHOT.jar

questions? send me an email to rommelvillagomez@hotmail.com

