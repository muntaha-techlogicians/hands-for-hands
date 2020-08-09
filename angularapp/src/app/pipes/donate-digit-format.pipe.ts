import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'donateDigitFormat'
})
export class DonateDigitFormatPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }


  transform(input: any, args?: any): any {
     var exp, rounded, suffixes = ['k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

     if (Number.isNaN(input) || input == null) {
       return '0';
     }

     if (input < 1000) {
       return input;
     }

     exp = Math.floor(Math.log(input) / Math.log(1000));

     return (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];


   }

}
