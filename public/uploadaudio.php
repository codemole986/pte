<?php
function RecursiveMkdir($path)
{
	if (!file_exists($path))
	{
	   	RecursiveMkdir(dirname($path));
	   	mkdir($path, 0777);
	}
}

if(!is_dir("recordings")){
	$res = mkdir("recordings",0777); 
}

$upload_root_path = "recordings";	
$qid = isset($_POST["quizid"])?$_POST["quizid"]:0;	
$tevent_id = isset($_POST["testid"])?$_POST["testid"]:0;	
$id = isset($_POST["userid"])?$_POST["userid"]:0;	

if($tevent_id == 0) {
	$answer_upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $id. DIRECTORY_SEPARATOR . $qid;	
} else {
	$answer_upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $tevent_id . DIRECTORY_SEPARATOR . $qid;	
}		

if (!file_exists($answer_upload_dir)) {
	RecursiveMkdir($answer_upload_dir);
}

// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
// decode it
$decodedData = base64_decode($data);
// print out the raw data, 
//echo ($decodedData);
$filename = 'speaking-' . date( 'Y-m-d-H-i-s' ) .'.mp3';
// write the data out to the file
$fp = fopen($answer_upload_dir.DIRECTORY_SEPARATOR.$filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);

$out_data["filename"] = $filename;

echo json_encode( $out_data );
?>
