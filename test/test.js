var assert = require("assert")


describe('hooks', function () {
    before(function () {

    })
    after(function () {
        // runs after all tests in this block
    })
    beforeEach(function () {
        // runs before each test in this block
    })
    afterEach(function () {
        // runs after each test in this block
    })

    describe('Array', function () {
        describe('#indexOf()', function () {
            it('should return -1 when the value is not present', function () {
                assert.equal(-1, [1, 2, 3].indexOf(5));
                assert.equal(-1, [1, 2, 3].indexOf(0));
            })
        })
    })

})