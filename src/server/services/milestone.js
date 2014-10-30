// models
var Milestone = require('mongoose').model('Milestone');

// modules
var github = require('../services/github');

module.exports = {

    get: function(user, repo, repo_uuid, number, token, done) {
        Milestone.findOne({
            pull: number,
            repo: repo_uuid
        }, function(err, milestone) {

            if(err || milestone) {
                return done(err, milestone);
            }

            // create milestone if non-existant
            github.call({
                obj: 'issues',
                fun: 'createMilestone',
                arg: {
                    user: user,
                    repo: repo,
                    title: 'Pull Request #' + number
                },
                token: token
            }, function(err, milestone) {
                if(err) {
                    return done(err);
                }

                Milestone.create({
                    pull: number,
                    repo: repo_uuid,
                    number: milestone.number
                }, done);
            });
        });
    },

    close: function(user, repo, repo_uuid, number, token) {
        Milestone.findOne({
            pull: number,
            repo: repo_uuid
        }, function(err, milestone) {
            if(!err && milestone) {
                github.call({
                    obj: 'issues',
                    fun: 'updateMilestone',
                    arg: {
                        user: user,
                        repo: repo,
                        number: milestone.number,
                        state: 'closed'
                    },
                    token: token
                });
            }
        });

    }
};