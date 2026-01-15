## Stage 1: Build the JAR
#FROM eclipse-temurin:24-jdk AS build
#
## Set working directory
#WORKDIR /app
#
## Copy Maven files and download dependencies
#COPY pom.xml .
#RUN apt-get update && apt-get install -y maven && mvn dependency:go-offline
#
## Copy source and build
#COPY src ./src
#RUN mvn clean package -DskipTests
#
## Stage 2: Run the app
#FROM eclipse-temurin:24-jdk
#
## Set working directory
#WORKDIR /app
#
## Copy JAR from the build stage
#COPY --from=build /app/target/AMS-0.0.1-SNAPSHOT.jar app.jar
#
## Expose Spring Boot port
#EXPOSE 8080
#
## Run the application
#ENTRYPOINT ["java", "-jar", "app.jar"]


FROM maven:3.9.6

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/AMS-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/AMS-0.0.1-SNAPSHOT.jar"]
