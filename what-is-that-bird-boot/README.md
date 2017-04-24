System Requirements:

Java 8
Redis running locally


Instructions:
Download the source code
navigate to what-is-that-bird-v2/what-is-that-bird-boot
mvn install:install-file -Dfile=src/main/webapp/WEB-INF/lib/Filters-1.0.jar -DgroupId=ImageFilters -DartifactId=Filters -Dversion=1.0 -Dpackaging=jar
mvn package
java -jar target/demo-0.0.1-SNAPSHOT.jar

