FROM public.ecr.aws/lambda/python:3.9

# Copy function code
COPY scrape_content.py ${LAMBDA_TASK_ROOT}
COPY pyppeteer_based/ ${LAMBDA_TASK_ROOT}/pyppeteer_based
COPY headless-chromium ${LAMBDA_TASK_ROOT}

# Install the function's dependencies using file requirements.txt
# from your project folder.

COPY requirements.txt  .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "scrape_content.handler" ]