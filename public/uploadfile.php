<?php
	if ( !empty( $_FILES ) ) {
		$tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
		$type = $_POST["type"];
		$filekind = $_POST["kind"];
	    
	    //$upload_root_path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR ."..\storage\app\public";
	    $upload_root_path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR ."upload";
	    
	    $solution_dir = "s0";
	    $answer_dir = "a1";
	    $quiz_dir = "q2";
	    $quiz_type = $type;

	    if($filekind=="problem") 
	    {
	    	$upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $quiz_dir . DIRECTORY_SEPARATOR . $quiz_type;
	    } 
	    else if($filekind=="answer") 
	    {
	    	$upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $answer_dir . DIRECTORY_SEPARATOR . $quiz_type;
	    }
	    else 
	    {
	    	$upload_dir = $upload_root_path . DIRECTORY_SEPARATOR . $solution_dir . DIRECTORY_SEPARATOR . $quiz_type;
	    }

	    function RecursiveMkdir($path)
	   	{
	       	if (!file_exists($path))
	       	{
	           	RecursiveMkdir(dirname($path));
	           	mkdir($path, 0777);
	       	}
	   	}

	   	if (!file_exists($upload_dir)) 
	   	{
	       	RecursiveMkdir($upload_dir);
	   	}

	   	$fname = $_FILES[ 'file' ][ 'name' ];
	    $uploadPath = $upload_dir . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];

	    move_uploaded_file( $tempPath, $uploadPath );

	    $answer = array( 'status' => 'Success', 'fname'=> $fname);    

	} else {
	    $answer = array( 'status' => 'No Files' );
	}

	echo json_encode( $answer );
?>