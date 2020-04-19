import { BaseVariables } from './variables';
import { BaseActions } from './actions'

export interface Rule {
    conditions: Conditions,
    actions: [Action]
}

interface Conditions {
    any?: [Condition],
    all?: [Condition]
}

interface Condition {
    name: string,
    operator: string,
    value: any
}

interface Action {
    name: string,
    params: Object
}

function run(rule: Rule, definedVariables: any, definedActions: BaseActions): boolean {
    let rule_triggered = check_conditions(rule.conditions, definedVariables);
    if (rule_triggered) 
        doActions(rule.actions, definedActions);
    return rule_triggered;
}

function check_conditions(conditions: Conditions, definedVariables: any): boolean {
    
    let keys = Object.keys(conditions);

    if(keys.length != 1) 
        throw new Error('Conditions not well defined.');

    if (keys[0] == 'any') {
        for(let condition of conditions.any ?? []) {
            if(checkCondition(condition, definedVariables)) 
                return true;
        }
        return false;
    }

    if (keys[0] == 'all') {
        for(let condition of conditions.all ?? []) {
            if(!checkCondition(condition, definedVariables)) 
                return false;
        }
        return true;
    }

    return false;
}

function checkCondition(condition: Condition, definedVariables: any): boolean {

    let metadata = definedVariables.getAllVariables().find((p: { propertyKey: string }) => p.propertyKey === condition.name);

    if (!metadata) 
        throw new Error(`Property name: ${condition.name} does not exist in metadata/defined variables.`);

    // Get the value from the class.
    let value = definedVariables[metadata.propertyKey]();

    // Create an instance of the operator class.
    let fieldTypeInstance = new metadata.fieldType(value);

    // Compare the condition value to the object value via the operator class method.
    // TODO make sure the condition operator is available on the fieldTypeInstance
    let result = fieldTypeInstance[condition.operator](condition.value);

    return result;

}

function doActions(ruleActions: [Action], definedActions: any) {
    
    for(let action of ruleActions) {

        let method = action.name;
        let parameters = action.params;

        if(typeof definedActions[method] !== 'function') 
            throw new Error(`No method: ${method} found on ${definedActions.constructor.name}`);

        // Execute the action.    
        definedActions[method].apply(definedActions, Object.values(parameters));

    }

}


export const runAll = function(ruleList: [Rule], definedVariables: BaseVariables, definedActions: BaseActions, stopOnFirstTrigger = false): boolean {
    let ruleWasTriggered = false;

    for(let rule of ruleList) {
        ruleWasTriggered = run(rule, definedVariables, definedActions);
        if(ruleWasTriggered && stopOnFirstTrigger) 
            return true;
    }

    return ruleWasTriggered;
}