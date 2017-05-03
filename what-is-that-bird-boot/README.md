See it in action here (older version):
http://bit.ly/2dWPoh5

System Requirements:

Java 8
Redis running locally

Instructions:
Download the source code from git (you are there already)

Install in your local maven repository image filter jar file (http://www.jhlabs.com/ip/filters/index.html)

navigate to what-is-that-bird-v2/what-is-that-bird-boot and run

mvn install:install-file -Dfile=src/main/webapp/WEB-INF/lib/Filters-1.0.jar -DgroupId=ImageFilters -DartifactId=Filters -Dversion=1.0 -Dpackaging=jar

copy redis-db/dump.rdb to your local redis database

build your package:
mvn package

run the application:
java -jar target/demo-0.0.1-SNAPSHOT.jar

navigate to
http://localhost:8080


to run the utilities you cannot really use the spring boot jar,
you can do the following

mvn compile

cd target/classes

jar -cvf ../whatIsThatBird.jar com

--contents of the jar file
jar tf ../whatIsThatBird.jar

cd ../..

java -cp target/whatIsThatBird.jar:src/main/webapp/WEB-INF/lib/Filters-1.0.jar com.villagomezdiaz.utilities.BackgroundBlacker

questions? send me an email to rommelvillagomez@hotmail.com

