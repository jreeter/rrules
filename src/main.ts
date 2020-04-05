import { BaseVariables, ruleVariable } from "./variables";
import { StringType, BaseType } from "./operators";
import { BaseActions, ruleAction } from "./actions";
import { FieldType } from "./field-type";
import { runAll, Rule } from "./engine";
import Product from './models/Product';

class ProductVariables extends BaseVariables {

    constructor(public product: Product) {
        super();
    }

    @ruleVariable(StringType)
    productName() {
        return this.product.name;
    }

}

class ProductActions extends BaseActions {

    constructor(public product: Product) {
        super();
    }

    @ruleAction({name: FieldType.STRING})
    setProductName(name: string) {
        this.product.name = name;
    }
}


let p = new Product('test');
let pv = new ProductVariables(p);
let pa = new ProductActions(p);


let rules: [Rule] = [{
    conditions: {
        any: [{
            name: 'productName',
            operator: 'equalTo',
            value: 'test'
        }]
    },
    actions: [{
        name: 'setProductName',
        params: {'name': 'Josh Reeter'}
    }]
}];

let result: boolean = runAll(rules, pv, pa)

