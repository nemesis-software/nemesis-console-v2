FROM eclipse-temurin:18-jre-alpine as builder

MAINTAINER Petar Tahchiev <ptahchiev@nemesis.io>

RUN  apk update \
  && apk upgrade \
  && rm -rf /var/cache/apk/*

ARG WAR_FILE

# Set the locale
#RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Prepare work dirs
VOLUME /tmp

WORKDIR /app/

# Add the project
COPY target/${WAR_FILE} /apps/
RUN touch /apps/${WAR_FILE} \
&& mkdir console \
&& unzip -q -d console /apps/${WAR_FILE} \
&& rm -rf /apps/${WAR_FILE} \
&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app/console/

ENTRYPOINT exec java $NEMESIS_CONSOLE_JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 -Dspring.profiles.active=docker -cp /app/console/. org.springframework.boot.loader.WarLauncher

EXPOSE 8443
