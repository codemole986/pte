import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
	
	permissionNames = [
					{ id:"E", value:"E", title:"Register", text:"Register" },
					{ id:"D", value:"D", title:"Student", text:"Student" },
					{ id:"C", value:"C", title:"Evaluator", text:"Evaluator" },
					{ id:"B", value:"B", title:"Teacher", text:"Teacher" },
					{ id:"A", value:"A", title:"Manager", text:"Manager" },
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
					{ id:"Writing",  text:"Writing",  value:"Writing", title:"Writing" },
					{ id:"Listening", text:"Listening", value:"Listening", title:"Listening" },
					{ id:"Speaking", text:"Speaking", value:"Speaking", title:"Speaking" },
					{ id:"Reading",  text:"Reading",  value:"Reading", title:"Reading" }
				];

	problemTypes = {
		'Writing' : [
					{ id:"WSM", value:"WSM", title:"Summarize Written Text", text:"Summarize Written Text" },
					{ id:"WES", value:"WES", title:"Write Essay", text:"Write Essay" }
				],
		'Listening' : [
					{ id:"LWS", value:"LWS", text:"Summarize Spoke Text", title:"Summarize Spoke Text" },
					{ id:"LSA", value:"LSA", text:"MCQ - Multiple Answers", title:"MCQ - Multiple Answers" },
					{ id:"LTW", value:"LTW", text:"Fill in the Blanks",  title:"Fill in the Blanks" },
					{ id:"LSB", value:"LSB", text:"MCQ - Single Answer", title:"MCQ - Single Answer" },
					{ id:"LCD", value:"LCD", text:"Highlight Incorrect Words",  title:"Highlight Incorrect Words" },
					{ id:"LTS", value:"LTS", text:"Write From Dictation", title:"Write From Dictation" }
				],
		'Speaking' : [
					{ id:"SAL", value:"SAL", text:"Read Aloud",  title:"Read Aloud" },
					{ id:"SRS", value:"SRS", text:"Repeat Sentence", title:"Repeat Sentence" },
					{ id:"SPI", value:"SPI", text:"Describe Image", title:"Describe Image" },
					{ id:"SRL", value:"SRL", text:"Retell Lecture", title:"Retell Lecture" },
					{ id:"SSA", value:"SSA", text:"Answer Short Question", title:"Answer Short Question" },
				],
		'Reading' : [
					{ id:"RSA", value:"RSA", text:"MCQ - Single Answer",  title:"MCQ - Single Answer" },
					{ id:"RMA", value:"RMA", text:"MCQ - Multiple Answers", title:"MCQ - Multiple Answers" },
					{ id:"RRO", value:"RRO", text:"Re-Order Paragraphs",  title:"Re-Order Paragraphs" },
					{ id:"RFB", value:"RFB", text:"Read and Fill in the Blanks", title:"Read and Fill in the Blanks" },
					{ id:"RAN", value:"RAN", text:"Read and FIB select from dropdown", title:"Read and FIB select from dropdown" }
				]
	};

	quizTypeNames = [
					{ value:"WSM", title:"Writing: Summarize Written Text" },
					{ value:"WES", title:"Writing: Write Essay" },
					{ value:"LWS", title:"Listening: Summarize Spoke Text" },
					{ value:"LSA", title:"Listening: MCQ - Multiple Answers" },
					{ value:"LTW", title:"Listening: Fill in the Blanks" },
					{ value:"LSB", title:"Listening: MCQ - Single Answer" },
					{ value:"LCD", title:"Listening: Highlight Incorrect Words" },
					{ value:"LTS", title:"Listening: Write From Dictation" },
					{ value:"SAL", title:"Speaking: Read Aloud" },
					{ value:"SRS", title:"Speaking: Repeat Sentence" },
					{ value:"SPI", title:"Speaking: Describe Image" },
					{ value:"SRL", title:"Speaking: Retell Lecture" },
					{ value:"SSA", title:"Speaking: Answer Short Question" },
					{ value:"RSA", title:"Reading: MCQ - Single Answer" },
					{ value:"RMA", title:"Reading: MCQ - Multiple Answers" },
					{ value:"RRO", title:"Reading: Re-Order Paragraphs" },
					{ value:"RFB", title:"Reading: Read and Fill in the Blanks" },
					{ value:"RAN", title:"Reading: Read and FIB select from dropdown" }
				];

	getTypeName(type: string) {
		for (var i = 0;  i < this.quizTypeNames.length;  i++) {
			if (this.quizTypeNames[i].value == type) {
				return this.quizTypeNames[i].title;
			}
		}
		return '';
	}
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
				return { audio: "" };
			case 'SSA':
				return { text: "" };
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
	getDataFromArray(arr: string[], val: string, id: string) {
		for (var i = 0;  i < arr.length;  i++) {
			if (arr[i][id] == val) {
				return i;
			}
		}
		return -1;
	}
}
