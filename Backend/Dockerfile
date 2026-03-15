# Build stage
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
# We build all sub-modules, ignoring test failures for deployment
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# We copy across all built JARs from the submodules
COPY --from=build /app/auth-service/target/*.jar ./auth-service/target/
COPY --from=build /app/notification-service/target/*.jar ./notification-service/target/
COPY --from=build /app/report-service/target/*.jar ./report-service/target/
COPY --from=build /app/diagnosis-service/target/*.jar ./diagnosis-service/target/

# The respective render.yaml "dockerCommand" dictates which jar is run
ENV PORT=8080
EXPOSE 8080
