# Rrules

A simple rules engine ported to Typescript from venmo/business-rules(https://github.com/venmo/business-rules).

# Usage


```ts
class Test {
    constructor(public name: string) {
    }
}

/***
 * Extend BaseVariables to wrap model accessors and define the type of operations to be done (StringType)
 */
class TestVariables extends BaseVariables {
    constructor(public test: Test) {
        super();
    }

    @ruleVariable(StringType, 'Returns the name of the test.')
    getName() {
        return this.test.name;
    }
}

/**
 * Define actions to be taken when conditions are met.
 * */ 
class TestActions extends BaseActions {
    constructor(public test: Test) {
        super();
    }

    @ruleAction({value: ParameterType.STRING}, 'Sets the name of the product.')
    setName(value: string) {
        this.test.name = value;
    }
}
```

Define your rules to be loaded at runtime:

```json
[
  {
    "conditions":{"all":[{"name":"getName","operator":"equalTo","value":"Test"}]},
    "actions":[{"name":"setName","params":{"value":"Hello World!"}}]
  }
]
```

Finally, run the rules:

```ts
let rules: [Rule] = JSON.parse(rulesString);
let test = new Test('Test');
let result = runAll(rules, new TestVariables(test), new TestActions(test));
test.name == 'Hello World' // true!
```

# Testing
`npm run test`

`npm run coverage`