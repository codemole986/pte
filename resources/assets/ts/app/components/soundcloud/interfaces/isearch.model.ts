import {Song} from './song.model';


export interface ISearch
{
	search: (keyword: string) => any;
}
