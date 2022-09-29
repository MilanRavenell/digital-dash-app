FROM public.ecr.aws/lambda/python:3.9

# Copy function code
COPY scrape_content.py ${LAMBDA_TASK_ROOT}
COPY pyppeteer_based/ ${LAMBDA_TASK_ROOT}/pyppeteer_based
COPY headless-chromium ${LAMBDA_TASK_ROOT}
COPY Tor_linux/ ${LAMBDA_TASK_ROOT}/Tor_linux
COPY Tor_linux/Tor /opt/lib
COPY local.conf /etc/ld.so.conf.d
COPY tor_config/ ${LAMBDA_TASK_ROOT}/tor_config

RUN echo "/var/task/Tor_linux/Tor" | tee /etc/ld.so.conf

RUN echo "ExitNodes {US}" | tee ${LAMBDA_TASK_ROOT}/tor_config/torrc
RUN echo "GeoIPFile ${LAMBDA_TASK_ROOT}/tor_config/geoip" >> ${LAMBDA_TASK_ROOT}/tor_config/torrc
RUN echo "GeoIPv6File ${LAMBDA_TASK_ROOT}/tor_config/geoip6" >> ${LAMBDA_TASK_ROOT}/tor_config/torrc

ENV HOME="/tmp"
ENV LD_LIBRARY_PATH="${LAMBDA_TASK_ROOT}/Tor_linux/Tor:${LD_LIBRARY_PATH}"
RUN /sbin/ldconfig

# Install the function's dependencies using file requirements.txt
# from your project folder.

COPY requirements.txt  .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "scrape_content.handler" ]