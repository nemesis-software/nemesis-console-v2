FROM adoptopenjdk/openjdk11:jdk-11.0.5_10-alpine-slim

MAINTAINER Petar Tahchiev <ptahchiev@nemesis.io>

# Set the locale
#RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Prepare work dirs
VOLUME /tmp

WORKDIR /app/

# Add the project
ADD /nemesis-console-v2.war /app/
RUN touch /app/nemesis-console-v2.war
RUN mkdir console
RUN unzip -q -d console /app/nemesis-console-v2.war
RUN rm -rf /app/nemesis-console-v2.war

WORKDIR /app/console/

ENTRYPOINT exec java $NEMESIS_CONSOLE_JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Dspring.profiles.active=docker -cp /app/console/. org.springframework.boot.loader.WarLauncher

EXPOSE 8443
