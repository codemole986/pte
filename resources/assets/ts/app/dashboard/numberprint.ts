import {Pipe, PipeTransform} from '@angular/core';

@Pipe ({
	name : 'numberprint'
})


export class NumberprintPipe implements PipeTransform {
	transform(d : number) : string {
		var thousands = ',';
		var decimal = '.';
		var precision = 3;
		var prefix = '';

		var negative = d < 0 ? '-' : '';
		d = Math.abs( d );

		var intPart = d;
		var floatPart = (precision  &&  (d - intPart) > 0) ?
			decimal+(d - intPart).toFixed( precision ).substring( 2 ):
			'';

		while(floatPart.substr(-1) == '0'){
			floatPart = floatPart.substr(0, floatPart.length-1);
		}
		
		return negative + (prefix||'') +
			intPart.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g, thousands
			) +
			floatPart;
	}
}

	