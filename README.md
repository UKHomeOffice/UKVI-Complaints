# UKVI-Complaints [![Docker Repository on Quay](https://quay.io/repository/ukhomeofficedigital/ukvi-complaints/status "Docker Repository on Quay")](https://quay.io/repository/ukhomeofficedigital/ukvi-complaints)

## Getting started

The UKVI complaints service is a HOF app that users of UKVI can use to send complaints to the team.
The service has been integrated with the DECS case working system, by pushing each form submission to an AWS SQS queue which the DECS system will retrieve.

Get the project from Github
```bash
$ git clone git@github.com:UKHomeOffice/UKVI-Complaints.git && cd UKVI-Complaints
```
Install the dependencies and build the project resources
```bash
$ npm install
```
[Install Docker Compose](https://docs.docker.com/compose/install/)
Run the services locally with Docker Compose
```bash
$ docker-compose up
```

### Set up AWS SQS queue locally

Run AWS services locally using localstack.

```bash
$ docker run --rm -p 4566:4566 -p 4571:4571 localstack/localstack
```

To create an SQS queue on the localstack instance.
```bash
aws \
sqs create-queue \
--queue-name local-queue \
--endpoint-url http://localhost:4566 \
--region eu-west-2
```

This will return a url, add this to config to place items on that queue: 
```
http://localhost:4566/000000000000/local-queue
```

To view what is on the queue currently run:
```bash
aws --endpoint-url=http://localhost:4566 --region eu-west-2 sqs receive-message --queue-url http://localhost:4566/000000000000/local-queue --max-number-of-messages 10
```


### Running in dev

Getting your hands dirty (You'll need [Redis](http://redis.io/) for this)
```bash
$ npm run dev
```

### Running the mock service

The easiest way to run the service is to use the mock SQS and email credentials, using the command:
```bash
$ npm run start:mock
```

You can initiate the mock SQS docker image by using the command:
```bash
$ npm run sqs-setup
```

Then shut down the docker image by using the command:
```bash
$ npm run sqs-cleanup
```

### Testing

To run the linting tests:
```bash
$ npm run test:lint
```

To run the unit tests:
```bash
$ npm run test:unit
```

To launch the server and test the integration with the SQS queue (To run these tests you need to have the mock SQS running via docker using the command in the previous section):
```bash
$ npm run test:sqs:server
```

To test all three (This command will initiate the mock SQS service and shut it down after the tests have run):
```bash
$ npm test
```
