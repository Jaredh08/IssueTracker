var express = require('express');
var router = express.Router();
var Sequelize = require ('sequelize');
module.exports = router;

/* establish a connection with the database */
const conn = new Sequelize('issueTrackerDB', 'ApolloAdmin', 'IssueTracker2017', {
    host: 'mtsu-4700-2017.database.windows.net',
    dialect: 'mssql',
    driver: 'tedious',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    port: 1433,
    dialectOptions: {
      encrypt: true
    }
});

// authenticate the connection
conn
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully - projects.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});

/* import database models */
const Projects = conn.import('../models/IssueTracker_Projects.js')
const Users = conn.import('../models/IssueTracker_Users.js')

router.get('/', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
})

/**
 *  GET project listing.
 *  test in bash with:
 *  curl localhost:3000/projects
 */
router.get('/projects.json', (req, res, next) => {
    Projects.findAll()
    .then(projects => {
      console.log(`Found Project: ${projects}`);
      res.send(projects);
    });
});

/**
 *  POST project
 *  test in bash with:
 *  curl -XPOST http://localhost:3000/projects -d 'ProjectId={SOME_UNIQUE_ID}&ProjectClient=Some%20Other%20Guy&ProjectName=REST%20api&ProjectDescription=another%20test&ProjectCreatorId=82&ProjectManagerId=82&ProjectDisabled=false'
*/
router.post('/', (req, res, next) => {
    Projects.create(req.body)
    .then((err, newProj) => {
        if(err) {
          console.log('There was an error completing the insertion: ', err);
          res.send(err);
        }
        else {
          console.log('New Project ${newProj.ProjectName}, with id ${newProj.id} has been created.');
          res.json(newProj);
        }
    });
});

/**
 *  GET project by id
 *  test in bash with
 *  curl -XGET http://localhost:3000/projects/{SOME_UNIQUE_ID}
 */
router.get('/:id', (req, res, next) => {
    Projects.findOne({
        where: {
            ProjectId: req.params.id,
        }
    })
    .then((err, proj) => {
        if (err) {
          console.log('There was an error during the query: ', err);
          res.send(err);
        }
        else {
            console.log('Project: ${proj}');
            res.json(proj);
        }
    });
});

/**
 *  PUT project by id (update project)
 *  test in bash with
 *  curl -XPUT http://localhost:3000/projects/{SOME_UNIQUE_ID} -d 'ProjectId={SOME_UNIQUE_ID}&ProjectClient=Some%20Other%20Guy&ProjectName=REST%20api&ProjectDescription=another%20test&ProjectCreatorId=82&ProjectManagerId=82&ProjectDisabled=false'
*/
router.put('/:id', (req, res, next) => {
    Projects.update(req.body, { where: { ProjectId: req.params.id } })
    .then((err, proj) => {
        if (err) {
            console.log('There was an error during the query: ', err);
            res.send(err);
        }
        else {
            console.log('Project: ${proj}');
            res.json(proj);
        }
    });
});

/**
 *  DELETE project by id
 *  test in bash with
 *  curl -XDELETE http://localhost:3000/projects/{SOME_UNIQUE_ID}
*/
router.delete('/:id', (req, res, next) => {
    Projects.destroy({
        where: {
            ProjectId: req.params.id,
        }
    })
    // TODO: error catching here
    .then((err, result) => {
        res.json({ message: 'Successfully deleted' });
    });

});
