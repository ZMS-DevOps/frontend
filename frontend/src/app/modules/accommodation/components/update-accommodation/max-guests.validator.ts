import {AbstractControl, ValidatorFn} from "@angular/forms";
export function maxGuestsValidator(minGuestsField: string, maxGuestsField: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const minGuests = formGroup.get(minGuestsField);
    const maxGuests = formGroup.get(maxGuestsField);

    if (minGuests && maxGuests && maxGuests.value < minGuests.value) {
      return { 'maxGuestsLessThanMinGuests': true };
    }
    return null;
  };
}
