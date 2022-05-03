import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class RegisterValidator {

    static match(formField: string, toBeMatchedField: string): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(formField);
            const controlToBeMatched = group.get(toBeMatchedField);

            if (!control || !controlToBeMatched) {
                console.error('Either one of the control is empty');
            }
            const error = (control?.value === controlToBeMatched?.value) ? null : { noMatch: true };

            controlToBeMatched?.setErrors(error)

            return error


        }
    }
}
