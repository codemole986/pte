<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class QuizTestevent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_testevent', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('start_at');
            $table->integer('uid')->index();
            $table->integer('test_id')->index();
            $table->text('problem_list')->nullable(); 
            $table->unsignedTinyInteger('test_status', 0);       
            $table->timestamp('end_at')->nullable();
            $table->unsignedTinyInteger('evaluate_status', 0);  
            $table->timestamp('evalallow_at')->nullable();
            $table->timestamp('evalstart_at')->nullable();
            $table->timestamp('evalend_at')->nullable();
            //$table->integer('evaluator_id')->index();
            $table->integer('evaluator_id')->nullable();
            $table->unsignedInteger('marks', 0);   
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
        Schema::dropIfExists('quiz_testevent');
    }
}
