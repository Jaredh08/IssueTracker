var express = require('express');
var router = express.Router();
var Sequelize = require ('sequelize');
const config = require('../config/database');
module.exports = router;

/** import all of the database models for issues */
const Issues = config.connect.import('../models/IssueTracker_Issues.js');
const IssueStatus = config.connect.import('../models/IssueTracker_IssueStatus.js');
const IssueStatusType = config.connect.import('../models/IssueTracker_IssueStatusType.js');
const IssueType = config.connect.import('../models/IssueTracker_IssueType.js');
const IssueReminderReasons = config.connect.import('../models/IssueTracker_IssueReminderReasons.js');
const IssuePriority = config.connect.import('../models/IssueTracker_IssuePriority.js');
const IssueNotifications = config.connect.import('../models/IssueTracker_IssueNotifications.js');
const IssueComments = config.connect.import('../models/IssueTracker_IssueComments.js');
const IssueAttachments = config.connect.import('../models/IssueTracker_IssueAttachments.js');

/**
 *  GET issue listing.
 *  test in bash with:
 *  curl localhost:3000/issues
 */
router.get('/', (req, res, next) => {
    Issues.findAll()
    .then(issues => {
        console.log(`Found Issues: ${issues}`);
        res.send(issues);
    });
});

/**
 *  POST issues
 *  test in bash with:
 *  curl -XPOST http://localhost:3000/issues -d 'IssueId=4435&ProjectId=111&IssueTitle=REST%20api&IssueCategoryId=54&IssuePriorityId=2&IssueStatusId=2&IssueCreatorId=82&IssueOwnerId=82&IssueAssignedId=82&IssueTypeId=1&HoursRemaining=45'
 */
router.post('/', (req, res, next) => {
    Issues.create(req.body)
    .then((err, newIssue) => {
        if(err) {
            console.log('There was an error completing the insertion: ', err);
            res.send(err);
        }
        else {
            console.log('New Project ${newIssue.ProjectName}, with id ${Issue.id} has been created.');
            res.json(newIssue);
        }
    });
});

/**
 *  GET issue by id
 *  test in bash with
 *  curl -XGET http://localhost:3000/projects/{SOME_UNIQUE_ID}
 */
router.get('/:id', (req, res, next) => {
    Issues.findOne({
        where: {
            IssueId: req.params.id,
        }
    })
    .then((err, iss) => {
        if (err) {
            console.log('There was an error during the query: ', err);
            res.send(err);
        }
        else {
            console.log('Issue: ${iss}');
            res.json(iss);
        }
    });
});

/**
 *  PUT issue by id (update project)
 *  test in bash with
 *  curl -XPUT http://localhost:3000/projects/{SOME_UNIQUE_ID} -d 'IssueId={SOME_UNIQUE_ID}&ProjectClient=Some%20Other%20Guy&ProjectName=REST%20api&ProjectDescription=another%20test&ProjectCreatorId=82&ProjectManagerId=82&ProjectDisabled=false'
 */
router.put('/:id', (req, res, next) => {
    Issues.update(req.body, { where: { IssueId: req.params.id } })
    .then((err, iss) => {
        if (err) {
            console.log('There was an error during the query: ', err);
            res.send(err);
        }
        else {
            console.log('Project: ${iss}');
            res.json(iss);
        }
    });
});

/**
 *  DELETE Issue by id
 *  test in bash with
 *  curl -XDELETE http://localhost:3000/projects/{SOME_UNIQUE_ID}
 */
router.delete('/:id', (req, res, next) => {
    Issues.destroy({
        where: {
            IssueId: req.params.id,
        }
    })
    .then((err, result) => {
    // TODO: even though this seems to work fine, there is an error.
    //       you can see it with the following line
    //       res.sendStatus(err);

        res.json(result);
    });
});

/** Get issue by Project ID
 *  test in bash with
 *  curl -XGET http://localhost:3000/issues/{SOME_UNIQUE_ID}
 */
router.get('/:id', (req, res, next) => {
    Issues.findAll({
        where: {
            ProjectId: req.params.id,
        }
    })
    .then((err, iss) => {
        if (err) {
            console.log('There was an error during the query: ', err);
            res.send(err);
        }
        else {
            console.log('Issue: ${iss}');
            res.json(iss);
        }
    });
});
