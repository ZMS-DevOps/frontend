import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchPasswordsValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
        const passwordControl = formGroup.get('password');
        const confirmPasswordControl = formGroup.get('confirmPassword');

        return passwordControl.value !== confirmPasswordControl.value ? {mismatch:true} : null;
  }
}

