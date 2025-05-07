# Introduction

This repo is created to store data of prowaseem.com which is used to show my professional information.

# What does it contain?

It contains my employment history, my projects,the skills I have, education I got, my social links and many other aspects

# Deployment

Using AWS Cli run following commands to deploy build folder and files to S3 Bucket

```
npm run build
aws s3 rm s3://prowaseem.com --recursive
aws s3 cp out s3://prowaseem.com/ --recursive
```
