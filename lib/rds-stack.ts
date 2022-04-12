import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as sns from '@aws-cdk/aws-sns';
import { type } from 'os';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Alarm, AlarmActionConfig } from '@aws-cdk/aws-cloudwatch';

export class RdsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cluster =  rds.DatabaseCluster.fromDatabaseClusterAttributes (this, "test", {
      clusterIdentifier: 'test',
    
      // the properties below are optional
      // clusterEndpointAddress: 'clusterEndpointAddress',
      // engine: clusterEngine,
      instanceEndpointAddresses: ['test.cluster-crfohsmyvulz.us-east-1.rds.amazonaws.com', 'test.cluster-ro-crfohsmyvulz.us-east-1.rds.amazonaws.com'],
      instanceIdentifiers: ['test-instance-1', 'test-instance-1-us-east-1b'],
      // port: 123,
      // readerEndpointAddress: 'readerEndpointAddress',
      // securityGroups: [securityGroup],
    });

    // SNS Topic
    const topic = new sns.Topic(this, 'Topic', {
      displayName: 'rds-test',
      topicName: 'rds-test',
    });

    new sns.Subscription(this, 'Subscription', {
      topic,
      endpoint: 'dipendrac3@gmail.com',
      protocol: sns.SubscriptionProtocol.EMAIL,
    });
    
    // Import existing SNS Topic
    //const topic = sns.Topic.fromTopicArn(this, "AlertForwarder", "arn:aws:sns:us-east-1:123456:AlertForwarder");

    //VolumeReadIOPS
    const VolumeReadIOPSmetric = new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName: 'VolumeReadIOPS',
      dimensionsMap: {
        dbClusterIdentifier: cluster.clusterIdentifier
      }
    });

    const VolumeReadIOPSAlarm = new cloudwatch.Alarm(this, 'VolumeReadIOPSAlarm', {
      metric: VolumeReadIOPSmetric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    VolumeReadIOPSAlarm.addAlarmAction({
      bind(): AlarmActionConfig {
        return { alarmActionArn: topic.topicArn}
      }
    });

    //VolumeWriteIOPS
    const VolumeWriteIOPSmetric = new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName: 'VolumeWriteIOPS',
      dimensionsMap: {
        dbClusterIdentifier: cluster.clusterIdentifier
      }
    });

    const VolumeWriteIOPSAlarm = new cloudwatch.Alarm(this, 'VolumeWriteIOPSAlarm', {
      metric: VolumeWriteIOPSmetric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    VolumeWriteIOPSAlarm.addAlarmAction({
      bind(): AlarmActionConfig {
        return { alarmActionArn: topic.topicArn}
      }
    });

    //ReadIOPS
    const ReadIOPSmetric = new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName: 'ReadIOPS',
      dimensionsMap: {
        DBInstanceIdentifier: cluster.instanceIdentifiers[1]
      }
    });

    const ReadIOPSAlarm = new cloudwatch.Alarm(this, 'ReadIOPSAlarm', {
      metric: ReadIOPSmetric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    ReadIOPSAlarm.addAlarmAction({
      bind(): AlarmActionConfig {
        return { alarmActionArn: topic.topicArn}
      }
    });

    // WriteIOPS
    const WriteIOPSmetric = new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName: 'WriteIOPS',
      dimensionsMap: {
        DBInstanceIdentifier: cluster.instanceIdentifiers[0]
      }
    });

    const WriteIOPSAlarm = new cloudwatch.Alarm(this, 'WriteIOPSAlarm', {
      metric: WriteIOPSmetric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    WriteIOPSAlarm.addAlarmAction({
      bind(): AlarmActionConfig {
        return { alarmActionArn: topic.topicArn}
      }
    });

    //ReaderDiskQueueDepth
    const ReaderDiskQueueDepthmetric = new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName: 'DiskQueueDepth',
      dimensionsMap: {
        DBInstanceIdentifier: cluster.instanceIdentifiers[1]
      }
    });

    const ReaderDiskQueueDepthAlarm = new cloudwatch.Alarm(this, 'ReaderDiskQueueDepthAlarm', {
      metric: ReaderDiskQueueDepthmetric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    ReaderDiskQueueDepthAlarm.addAlarmAction({
      bind(): AlarmActionConfig {
        return { alarmActionArn: topic.topicArn}
      }
    });
    
    //WriterDiskQueueDepth
    const WriterDiskQueueDepthmetric = new cloudwatch.Metric({
      namespace: 'AWS/RDS',
      metricName: 'DiskQueueDepth',
      dimensionsMap: {
        DBInstanceIdentifier: cluster.instanceIdentifiers[0]
      }
    });

    const WriterDiskQueueDepthAlarm = new cloudwatch.Alarm(this, 'WriterDiskQueueDepthAlarm', {
      metric: WriterDiskQueueDepthmetric,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    WriterDiskQueueDepthAlarm.addAlarmAction({
      bind(): AlarmActionConfig {
        return { alarmActionArn: topic.topicArn}
      }
    });

   }
 }
