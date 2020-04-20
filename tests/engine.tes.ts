import { BaseVariables, ruleVariable } from "../src/variables";
import { BaseActions, ruleAction } from "../src/actions";
import { StringType } from "../src/operators";
import { ParameterType } from "../src/parameter-type";
import { runAll, Rule } from "../src/engine";
import { expect } from "chai";


describe('Rule Engine Test', () => {

    it('Should run actions when equalTo operator passes.', function() {

        let str = JSON.stringify([
            {
                conditions: {
                    all: [{
                        name: 'getName',
                        operator: 'equalTo',
                        value: 'Test'
                    }]
                },
                actions: [
                    {
                        name: 'setName',
                        params: {
                            value: 'Hello World!'
                        }
                    }
                ]
            }
        ]);

        // Simulating json load from db, etc.
        let rules: [Rule] = JSON.parse(str);
        let test = new Test('Test');
        let testVariables = new TestVariables(test);
        let testActions = new TestActions(test);
        let result = runAll(rules, testVariables, testActions);

        expect(result).to.be.true;
        expect(test.name).to.be.equal('Hello World!');
        

    });

    it('Should run actions when doesNotEqual operator passes.', function() {

        let str = JSON.stringify([
            {
                conditions: {
                    all: [{
                        name: 'getName',
                        operator: 'doesNotEqual',
                        value: 'Hello World!'
                    }]
                },
                actions: [
                    {
                        name: 'setName',
                        params: {
                            value: 'I was changed!'
                        }
                    }
                ]
            }
        ]);

        // Simulating json load from db, etc.
        let rules: [Rule] = JSON.parse(str);
        let test = new Test('Test');
        let testVariables = new TestVariables(test);
        let testActions = new TestActions(test);
        let result = runAll(rules, testVariables, testActions);

        expect(result).to.be.true;
        expect(test.name).to.be.equal('I was changed!');
        

    });

    it('Should run actions when contains operator passes.', function() {

        let str = JSON.stringify([
            {
                conditions: {
                    all: [{
                        name: 'getName',
                        operator: 'contains',
                        value: 'Hello'
                    }]
                },
                actions: [
                    {
                        name: 'setName',
                        params: {
                            value: 'Hello contained!'
                        }
                    }
                ]
            }
        ]);

        // Simulating json load from db, etc.
        let rules: [Rule] = JSON.parse(str);
        let test = new Test('Hello World!');
        let testVariables = new TestVariables(test);
        let testActions = new TestActions(test);
        let result = runAll(rules, testVariables, testActions);

        expect(result).to.be.true;
        expect(test.name).to.be.equal('Hello contained!');
        

    });

});

class Test {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
}

class TestVariables extends BaseVariables {
    constructor(public test: Test) {
        super();
    }

    @ruleVariable(StringType, 'Returns the name of the test.')
    getName() {
        return this.test.name;
    }
}

class TestActions extends BaseActions {
    constructor(public test: Test) {
        super();
    }

    @ruleAction({value: ParameterType.STRING}, 'Sets the name of the product.')
    setName(value: string) {
        this.test.name = value;
    }
}
