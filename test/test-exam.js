// process.env.NODE_ENV = 'test';
const assert = require('assert');
const Exam = require('../models/exam');

// creates a Exam
describe('creates a Exam', function() {
    beforeEach(function(done) {
        Exam.collection.drop();
        done();
    });
    afterEach(function(done) {
        Exam.collection.drop();
        done();
    });
    it('creates a Exam Save', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const newExam = new Exam({ 
            course: '5ce3fde51c9d440000e8d52e',
            topic: 'Final',
            detail : 'Final Exam',
            date : new Date(),
            timestart : new Date(),
            timeend : new Date(),
            exam : [{
                building : 'IF',
                room : '5T05',
                students : [{
                    student : '5ce400ac1c9d440000e8d52f',
                    row : 0,
                    col : 1
                }],
                examiner : [{
                    id : '5ce402521c9d440000e8d530',
                    type : 'teacher'
                }]
            }]
        });
        newExam.save() //takes some time and returns a promise
            .then(() => {
                assert(!newExam.isNew); //if poke is saved to db it is not new
                done();
            });
    });

});
// creates a Exam



// // find a Exam
describe('find a Exam', function() {
    beforeEach((done) => {
        Exam.collection.drop();
        const newExam = new Exam({ 
            course: '5ce3fde51c9d440000e8d52e',
            topic: 'Final',
            detail : 'Final Exam',
            date : new Date(),
            timestart : new Date(),
            timeend : new Date(),
            exam : [{
                building : 'IF',
                room : '5T05',
                students : [{
                    student : '5ce400ac1c9d440000e8d52f',
                    row : 0,
                    col : 1
                }],
                examiner : [{
                    id : '5ce402521c9d440000e8d530',
                    type : 'teacher'
                }]
            }]
        });
        newExam.save() //takes some time and returns a promise
            .then(() => {
                assert(!newExam.isNew); //if poke is saved to db it is not new
                done();
            });
    });
    afterEach(function(done) {
        Exam.collection.drop();
        done();
    });
    it('finds Exam with the topic of Exam', (done) => {
        Exam.findOne({ topic : 'Final' })
            .then((Exam) => {
                assert(Exam.topic === 'Final');
                done();
            });
    })

});
// // // find a Exam
