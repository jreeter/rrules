
import 'reflect-metadata';
import { BaseType } from "./operators";

export abstract class BaseVariables {
    /**
     * Returns the methods and their metadata annotated by the @typeOperator
     * for classes that extend BaseType.
     */
    getAllVariables() {
        let  metadataKeys: string[] = Reflect.getMetadataKeys(this);
        return metadataKeys.map((key) => {
            return Reflect.getMetadata(key, this);
        }).filter(metadata => metadata.isRuleVariable);
    }

}

export const ruleVariable = function(type: typeof BaseType, label?: string) {
    return function(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        Reflect.defineMetadata(propertyKey, {isRuleVariable: true, fieldType: type, propertyKey: propertyKey, label: label || propertyKey}, target);
    }
}
