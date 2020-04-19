import { expect } from 'chai';
import { BaseActions, ruleAction } from '../src/actions';
import { ParameterType } from '../src/parameter-type';

describe('Actions Test', () => {
    
    it('Should find 0 actions registered.', () => {

        class TestAction extends BaseActions {
            testAction(value: any): void {
            }
        }

        let testClass = new TestAction();

        expect(testClass.getAllActions().length).to.be.equal(0);
    });

    it('Should find 1 action registered.', () => {
        
        class TestAction extends BaseActions {
            @ruleAction({}, 'Does nothing, only a test')
            testAction(value: any): void {
            }
        }

        let testClass = new TestAction();

        expect(testClass.getAllActions().length).to.be.equal(1);
    });

    it('Action should have label and params.', () => {
        
        class TestAction extends BaseActions {
            @ruleAction({test: ParameterType.STRING}, 'Does nothing, only a test')
            testAction(value: any): void {
            }
        }

        let testClass = new TestAction();
        
        for(let action of testClass.getAllActions()) {
            expect(action.label).to.not.be.null;
            expect(action.params).to.not.be.null;
        }

        
    });
    



});