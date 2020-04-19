import 'reflect-metadata';
import { ParameterType } from './parameter-type';

export abstract class BaseActions {
    /**
     * Returns the methods and their metadata annotated by the @typeOperator
     * for classes that extend BaseType.
     */
    getAllActions() {
        let  metadataKeys: string[] = Reflect.getMetadataKeys(this);
        return metadataKeys.map((key) => {
            return Reflect.getMetadata(key, this);
        }).filter(metadata => metadata.isRuleAction);
    }
}

interface ActionParameters {
    [key: string]: ParameterType
}

export const ruleAction = function(params: ActionParameters, label?: string) {
    return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        Reflect.defineMetadata(propertyKey, {isRuleAction: true, params: params, propertyKey: propertyKey, label: label || propertyKey}, target);
    }
}
