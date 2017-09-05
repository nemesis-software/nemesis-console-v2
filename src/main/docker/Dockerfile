FROM cogniteev/oracle-java

MAINTAINER Petar Tahchiev <ptahchiev@nemesis.io>

# Set the locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install unzip
RUN apt-get update
RUN apt-get install unzip -y

# Prepare work dirs
VOLUME /tmp

WORKDIR /apps/

# Add the project
ADD /nemesis-console-v2.war /apps/
RUN bash -c 'touch /apps/nemesis-console-v2.war'
RUN bash -c 'unzip -q -d console /apps/nemesis-console-v2.war'

WORKDIR /apps/console/

# Run the project
# add this for debug ,"-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000"
ENTRYPOINT ["java","-Xss512K","-Xms2g","-Xmx2g","-XX:MaxMetaspaceSize=256m","-XX:ReservedCodeCacheSize=256m","-XX:CompressedClassSpaceSize=128m","-XX:+HeapDumpOnOutOfMemoryError","-Djava.security.egd=file:/dev/./urandom","-Dspring.profiles.active=docker","-cp","/apps/console/.","org.springframework.boot.loader.WarLauncher"]

EXPOSE 8443