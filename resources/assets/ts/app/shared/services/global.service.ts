import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
	
	permissionNames = [
					{ value:"E", title:"Register" },
					{ value:"D", title:"Student" },
					{ value:"C", title:"Evaluator" },
					{ value:"B", title:"Teacher" },
					{ value:"A", title:"Manager" },
			];

	simpleclassnames = [        
        { value:"Basic", title:"Basic" },
        { value:"Bronze", title:"Bronze" },
        { value:"Silver", title:"Silver" },
        { value:"Gold", title:"Gold" }
        ];
	classnames = [
        { value:"", title:"User Class" },
        { value:"Basic", title:"Basic" },
        { value:"Bronze", title:"Bronze" },
        { value:"Silver", title:"Silver" },
        { value:"Gold", title:"Gold" },
        ];
	problemCategoryNames = ["Writing", "Listening", "Speaking", "Reading"];
	quizCategoryNames = [
					{ value:"Writing", title:"Writing" },
					{ value:"Listening", title:"Listening" },
					{ value:"Speaking", title:"Speaking" },
					{ value:"Reading", title:"Reading" }
				];

	problemTypes = {
		'Writing' : [
					{ value:"WSM", title:"Summarize Written Text" },
					{ value:"WES", title:"Write Essay" }
				],
		'Listening' : [
					{ value:"LWS", title:"Listen and Write a Summary" },
					{ value:"LSA", title:"Listen and Select Answer" },
					{ value:"LTW", title:"Listen and Type Words" },
					{ value:"LSB", title:"Listen and Select the Best" },
					{ value:"LCD", title:"Listen and Click Differ" },
					{ value:"LTS", title:"Listen and Type Sentence" }
				],
		'Speaking' : [
					{ value:"SAL", title:"Speak Aloud" },
					{ value:"SRS", title:"Repeat Sentence" },
					{ value:"SPI", title:"Speak about Picture" },
					{ value:"SRL", title:"Retell about Lecture" },
					{ value:"SSA", title:"Speak Shot Answer" },
				],
		'Reading' : [
					{ value:"RSA", title:"Read and Single Answer" },
					{ value:"RMA", title:"Read and Multiple Answer" },
					{ value:"RRO", title:"Read and Restore Order" },
					{ value:"RFB", title:"Read and Fill in the Blanks" },
					{ value:"RAN", title:"Read and Select Answer" }
				]
	};

	quizTypeNames = [
					{ value:"WSM", title:"Writing: Summarize Written Text" },
					{ value:"WES", title:"Writing: Write Essay" },
					{ value:"LWS", title:"Listening: Listen and Write a Summary" },
					{ value:"LSA", title:"Listening: Listen and Select Answer" },
					{ value:"LTW", title:"Listening: Listen and Type Words" },
					{ value:"LSB", title:"Listening: Listen and Select the Best" },
					{ value:"LCD", title:"Listening: Listen and Click Differ" },
					{ value:"LTS", title:"Listening: Listen and Type Sentence" },
					{ value:"SAL", title:"Speaking: Speak Aloud" },
					{ value:"SRS", title:"Speaking: Repeat Sentence" },
					{ value:"SPI", title:"Speaking: Speak about Picture" },
					{ value:"SRL", title:"Speaking: Retell about Lecture" },
					{ value:"SSA", title:"Speaking: Speak Shot Answer" },
					{ value:"RSA", title:"Reading: Read and Single Answer" },
					{ value:"RMA", title:"Reading: Read and Multiple Answer" },
					{ value:"RRO", title:"Reading: Read and Restore Order" },
					{ value:"RFB", title:"Reading: Read and Fill in the Blanks" },
					{ value:"RAN", title:"Reading: Read and Select Answer" }
				];

	getContentObject(type: string) {
		switch (type) {
			case 'WSM':
				return { text: "" };
			case 'WES':
				return { text: "" };
			case 'SAL':
				return { text: "" };
			case 'SRS':
				return { text: "", audio: "" };
			case 'SPI':
				return { text: "", picture: "" };
			case 'SRL':
				return { text: "", list: [""] };
			case 'SSA':
				return { text: "", audio: "" };
			case 'LWS':
				return { text: "", audio: "" };
			case 'LTS':
				return { text: "", audio: "" };
			case 'LTW': case 'LCD':
				return {
							audio: "",
							text: "",
							select: {
								options: [""]
							}
				};
			case 'LSA': case 'LSB':
				return {
							audio: "",
							select: {
								guide: "",
								options: [""]
							}
						};
			case 'RSA': case 'RMA':
				return {
							text: "",
							picture: "",
							select: {
								guide: "",
								options: [""]
							}
						};
			case 'RRO':
				return {
							select: {
								options: [""]
							}
						};
			case 'RFB':
				return {
							text: "",
							select: {
								options: [""]
							}
				}
			case 'RAN':
				return {
							text: "",
							selectlist: [{
								options: [{}]
							}]
				}
		}
	}

	getSolutionObject(type: string) {
		switch (type) {
			case 'WSM':
				return { text: "" };
			case 'WES':
				return { text: "" };
			case 'SAL':
				return { text: "", audio: "" };
			case 'SRS':
				return { text: "", audio: "" };
			case 'SPI':
				return { text: "", audio: "" };
			case 'SRL':
				return { text: "", list: [""] };
			case 'SSA':
				return { text: "", audio: "" };
			case 'LWS':
				return { text: "" };
			case 'LTS':
				return { text: "" };
			case 'LTW': case 'LCD':
				return { audio: "" };
			case 'LSA':
				return { optionno: [""] };
			case 'LSB':
				return { optionno: "" };
			case 'RSA':
				return { optionno: "" };
			case 'RMA':
			 	return { optionno: [""] };
			case 'RRO':
				return {};
			case 'RFB':
				return { optionno: [""] };
			case 'RAN':
				return { optionno: [{}] };
		}
	}

	getIndexFromArray(arr: string[], val: string) {
		for (var i = 0;  i < arr.length;  i++) {
			if (arr[i] == val) {
				return i;
			}
		}
		return -1;
	}
}
