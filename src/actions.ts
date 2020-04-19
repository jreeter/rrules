import 'reflect-metadata';
import { ParameterType } from './parameter-type';

export abstract class BaseActions {
    /**
     * Returns all members annotated with @ruleAction.
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
