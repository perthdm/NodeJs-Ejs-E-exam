// process.env.NODE_ENV = 'test';
const assert = require('assert');
const Building = require('../models/building');
// creates a Building
describe('creates a Building', function () {
    beforeEach(function (done) {
        Building.collection.drop();
        done();
    });
    afterEach(function (done) {
        Building.collection.drop();
        done();
    });
    it('creates a Building Save', (done) => {
        //assertion is not included in mocha so 
        //require assert which was installed along with mocha
        const newBuilding = new Building({
            namebuilding: 'IF',
            fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ',
            room: [{
                no: "IF-5T05",
                capacity: 100,
                row: 10,
                column: 10
            }]
        });
        newBuilding.save() //takes some time and returns a promise
            .then(() => {
                assert(!newBuilding.isNew); //if poke is saved to db it is not new
                done();
            });
    });

});
// creates a Building

// Delete a Building
describe('Delete a Building', function() {
    beforeEach((done) => {
        Building.collection.drop();
        var newBuilding = new Building({
            namebuilding: 'IF',
            fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ',
            room: [{
                no: "IF-5T05",
                capacity: 100,
                row: 10,
                column: 10
            }]
        });
        newBuilding.save() //takes some time and returns a promise
            .then(() => {
                assert(!newBuilding.isNew); //if poke is saved to db it is not new
                done();
            });
    });
    afterEach(function(done) {
        Building.collection.drop();
        done();
    });
    it('removes a Building using its instance', (done) => {
        Building.remove({ fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ' })
            .then(() => Building.findOne({ fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ' }))
            .then((Building) => {
                assert(Building === null);
                done();
            });

    });

    it('removes multiple Building', (done) => {
        Building.remove()
            .then(() => Building.findOne({ fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ' }))
            .then((Building) => {
                assert(Building === null);
                done();
            });
    });

});
// Delete a Building



// // find a Building
describe('find a Building', function() {
    beforeEach((done) => {
        Building.collection.drop();
        var newBuilding = new Building({
            namebuilding: 'IF',
            fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ',
            room: [{
                no: "IF-5T05",
                capacity: 100,
                row: 10,
                column: 10
            }]
        });
        newBuilding.save() //takes some time and returns a promise
            .then(() => {
                assert(!newBuilding.isNew); //if poke is saved to db it is not new
                done();
            });
    });
    afterEach(function(done) {
        Building.collection.drop();
        done();
    });
    it('finds Building with the fullnamebuilding of Building', (done) => {
        Building.findOne({ fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ' })
            .then((Building) => {
                assert(Building.fullnamebuilding === 'ตึกคณะวิทยาการสารสนเทศ');
                done();
            });
    })

});
// // // find a Building


// // Update a Building
describe('Update a Building', () => {
    beforeEach((done) => {
        Building.collection.drop();
        var newBuilding = new Building({
            namebuilding: 'IF',
            fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ',
            room: [{
                no: "IF-5T05",
                capacity: 100,
                row: 10,
                column: 10
            }]
        });
        newBuilding.save() //takes some time and returns a promise
            .then(() => {
                assert(!newBuilding.isNew); //if poke is saved to db it is not new
                done();
            });
    });

    afterEach(function(done) {
        Building.collection.drop();
        done();
    });

    function assertHelper(statement, done) {
        statement
            .then(() => Building.find({}))
            .then((Building) => {
                assert(Building.length === 1);
                assert(Building[0].fullnamebuilding === 'ตึกคณะวิทยาการสารสนเทศ');
                assert(Building[0].namebuilding === 'if');
                done();
            });
    }


    it('update one Bu using model', (done) => {
        assertHelper(Building.findOneAndUpdate({
            fullnamebuilding: 'ตึกคณะวิทยาการสารสนเทศ'}, { $set : { namebuilding: 'if' }}, done));
    });

});
// // Update a Building