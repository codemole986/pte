<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class QuizProblems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_problems', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('category', array('Writing', 'Reading', 'Speaking', 'Listening'))->index();
            $table->string('type', 3)->index();
            $table->enum('degree', array('Easy', 'Medium', 'Hard'), 'Easy')->index();
            $table->string('title', 255);
            $table->text('guide');
            $table->text('content');
            $table->text('solution');
            $table->integer('limit_time');
            $table->enum('evaluate_mode', array('Auto', 'Manual'), 'Auto');
            $table->integer('points');
            $table->integer('uid');
            $table->unsignedTinyInteger('status');
            $table->rememberToken();
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
        Schema::dropIfExists('quiz_problems');
    }
}
