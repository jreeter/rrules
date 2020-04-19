import 'reflect-metadata';
import { ParameterType } from './parameter-type';

export abstract class BaseType {
    /**
     * Returns the methods and their metadata annotated by the @typeOperator
     * for classes that extend BaseType.
     */
    getAllOperators() {
        let  metadataKeys: string[] = Reflect.getMetadataKeys(this);
        return metadataKeys.map((key) => {
            return Reflect.getMetadata(key, this);
        }).filter(metadata => metadata.isOperator);
    }

}

export const typeOperator = function(type: ParameterType, label?: string) {
    return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        Reflect.defineMetadata(propertyKey, {isOperator: true, type: type, propertyKey: propertyKey, label: label || propertyKey}, target);
    }
}

export class StringType extends BaseType {

    constructor(public value?: string) {
        super();
    }
    
    @typeOperator(ParameterType.STRING)
    equalTo(otherValue: string) {
        return this.value === otherValue;
    }

    @typeOperator(ParameterType.STRING)
    doesNotEqual(value: string) {
        return this.value !== value;
    }
    
    @typeOperator(ParameterType.STRING)
    contains(value: string) {
        return this.value?.includes(value);
    }
}
