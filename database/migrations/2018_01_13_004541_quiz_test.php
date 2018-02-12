<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class QuizTest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_test', function (Blueprint $table) {
            $table->increments('id');
            $table->string('testname', 100)->index();
            $table->enum('testclass', array('Basic', 'Bronze', 'Silver', 'Gold'), 'Base')->index();
            $table->enum('testdegree', array('Easy', 'Medium', 'Hard'), 'Easy')->index();
            $table->unsignedInteger('totalmarks');
            $table->unsignedInteger('limit_time');
            $table->unsignedInteger('count');   
            $table->text('preset')->nullable();  
            $table->integer('uid');
            $table->unsignedTinyInteger('status');                   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz_test');
    }
}
