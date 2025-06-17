/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';



@ValidatorConstraint({ async: false })
class IsLessThan100ForPercentConstraint
    implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { object } = args;
        return object['type'] !== 'PERCENT' || value < 100;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Value must be less than 100 when type is PERCENT';
    }
}

export function IsLessThan100ForPercent(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsLessThan100ForPercentConstraint,
        });
    };
}