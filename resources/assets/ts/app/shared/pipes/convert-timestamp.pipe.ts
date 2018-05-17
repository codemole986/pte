import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({ name : 'converttimestamp' })
export class ConverttimestampPipe implements PipeTransform {
  transform(val : number) : string {
    var str_timestamp;

    var hh;
    var mm;
    var ss;

    hh = Math.floor(Number(val).valueOf() / 3600);
    ss = Number(val).valueOf() - hh * 3600;
    mm = Math.floor(Number(ss).valueOf() / 60);
    ss = Number(ss).valueOf() - mm * 60;

    str_timestamp = '';

    if (hh > 0) {
      str_timestamp += hh+':';
    }

    if(Number(mm).valueOf() < 10) {
      str_timestamp += '0'+Number(mm).valueOf()+':';
    } else {
      str_timestamp += Number(mm).valueOf()+':';
    }

    if (Number(ss).valueOf() < 10) {
      str_timestamp += '0'+Number(ss).valueOf();
    } else {
      str_timestamp += Number(ss).valueOf();
    }

    return str_timestamp;
  }
}
