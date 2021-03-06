"use strict";

var CA = require('../'),
    should = require('chai').should();

describe('Applying rules', function () {
    describe('setRule()', function () {
        it('should accept rule string as argument', function () {
            var ca = new CA([3,3]);

            ca.setRule('23/3');

            ca.neighbourhoodType.should.equal('moore');
            ca.neighbourhoodRange.should.equal(1);
            ca.rule.ruleString.should.equal('23/3');

            ca.setRule('1/1V2');

            ca.neighbourhoodType.should.equal('von-neumann');
            ca.neighbourhoodRange.should.equal(2);
            ca.rule.ruleString.should.equal('1/1V2');
        });

        it('should allow the use of function with implicit neighbourhood (moore of range 1)', function () {
            var ca = new CA([3,3]);

            ca.setRule(function () {});

            ca.neighbourhoodType.should.equal('moore');
            ca.neighbourhoodRange.should.equal(1);
            ca.rule.ruleType.should.equal('custom');
        });

        it('should allow the use of function with explicit neighbourhood type and ranges', function () {
            var ca = new CA([3,3]);

            ca.setRule(function () {}, 'von-neumann', 2);

            ca.neighbourhoodType.should.equal('von-neumann');
            ca.neighbourhoodRange.should.equal(2);
            ca.rule.ruleType.should.equal('custom');
        });

        it('should return the instance of the CellularAutomata', function () {
            var ca = new CA([3,3]);

            ca.setRule('1/1V2').should.equal(ca);
        });
    });

    describe('iterate()', function () {
        it('should implicitly make on iteration', function () {
            var ca = new CA([3,3]);

            ca.array.set(1,1,1);

            ca.setRule('S/B12V');
            ca.iterate();

            // 0 1 0
            ca.array.get(0,0).should.equal(0);
            ca.array.get(1,0).should.equal(1);
            ca.array.get(2,0).should.equal(0);
            // 1 0 1
            ca.array.get(0,1).should.equal(1);
            ca.array.get(1,1).should.equal(0);
            ca.array.get(2,1).should.equal(1);
            // 0 1 0
            ca.array.get(0,2).should.equal(0);
            ca.array.get(1,2).should.equal(1);
            ca.array.get(2,2).should.equal(0);
        });

        it('should allow to make multiple iterations', function () {
            var ca = new CA([3,3]);

            ca.array.set(1,1,1);

            ca.setRule('S/B12V');
            ca.iterate(2);

            // 1 0 1
            ca.array.get(0,0).should.equal(1);
            ca.array.get(1,0).should.equal(0);
            ca.array.get(2,0).should.equal(1);
            // 0 0 0
            ca.array.get(0,1).should.equal(0);
            ca.array.get(1,1).should.equal(0);
            ca.array.get(2,1).should.equal(0);
            // 1 0 1
            ca.array.get(0,2).should.equal(1);
            ca.array.get(1,2).should.equal(0);
            ca.array.get(2,2).should.equal(1);
        });

        it('should return the instance of the CellularAutomata', function () {
            var ca = new CA([3,3]);

            ca.setRule('S/B12V');

            ca.iterate(2).should.equal(ca);
        });
    });

    describe('apply() shortcut method', function () {
        it('should implicitly make one iteration', function () {
            var ca = new CA([3,3]);

            ca.array.set(1,1,1);

            ca.apply('S/B12V');

            // 0 1 0
            ca.array.get(0,0).should.equal(0);
            ca.array.get(1,0).should.equal(1);
            ca.array.get(2,0).should.equal(0);
            // 1 0 1
            ca.array.get(0,1).should.equal(1);
            ca.array.get(1,1).should.equal(0);
            ca.array.get(2,1).should.equal(1);
            // 0 1 0
            ca.array.get(0,2).should.equal(0);
            ca.array.get(1,2).should.equal(1);
            ca.array.get(2,2).should.equal(0);
        });

        it('should allow to make multiple iterations', function () {
            var ca = new CA([3,3]);

            ca.array.set(1,1,1);

            ca.apply('S/B12V',2);

            // 1 0 1
            ca.array.get(0,0).should.equal(1);
            ca.array.get(1,0).should.equal(0);
            ca.array.get(2,0).should.equal(1);
            // 0 0 0
            ca.array.get(0,1).should.equal(0);
            ca.array.get(1,1).should.equal(0);
            ca.array.get(2,1).should.equal(0);
            // 1 0 1
            ca.array.get(0,2).should.equal(1);
            ca.array.get(1,2).should.equal(0);
            ca.array.get(2,2).should.equal(1);
        });

        it('should allow the use of function with explicit neighbourhood type and ranges', function () {
            var ca = new CA([3,3]);

            ca.array.set(1,1,1);

            var caFunction = function (currentValue, neighbours) {
                var result = currentValue;

                for (var i = 0; i < neighbours.length; i++) {
                    result += neighbours[i];
                }

                return result;
            };

            ca.apply(caFunction, 2, 'von-neumann', 1);

            // 2 2 2
            ca.array.get(0,0).should.equal(2);
            ca.array.get(1,0).should.equal(2);
            ca.array.get(2,0).should.equal(2);
            // 2 5 2
            ca.array.get(0,1).should.equal(2);
            ca.array.get(1,1).should.equal(5);
            ca.array.get(2,1).should.equal(2);
            // 2 2 2
            ca.array.get(0,2).should.equal(2);
            ca.array.get(1,2).should.equal(2);
            ca.array.get(2,2).should.equal(2);
        });

        it('should return the instance of the CellularAutomata', function () {
            var ca = new CA([3,3]);

            ca.apply('S/B12V',2).should.equal(ca);
        });
    });

    describe('support stochastic rules', function () {
        it('should use the internal rng when using stochastic rules', function () {
            var ca = new CA([3,3]);

            var callToRiggedRng = 0;

            var riggedRng = function riggedRng () {
                callToRiggedRng++;
                return Math.random();
            };

            ca.setRng(riggedRng);
            ca.apply('E / 0..8:0.3', 1);

            callToRiggedRng.should.equal(9);
        });

        it('should correctly take into account the result of the rng function', function () {
            var ca = new CA([1,1]);
            ca.setRng(function () { return 1; });
            ca.apply('E / 0..8:0.3', 1);

            ca.array.get(0,0).should.equal(0);

            ca.setRng(function () { return 0; });
            ca.apply('E / 0..8:0.3', 1);

            ca.array.get(0,0).should.equal(1);
        });
    });
});
