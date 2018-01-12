<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class QuizAnswer extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_answer', function (Blueprint $table) {
            $table->increments('id', 32);
            $table->integer('quiz_id');
            $table->text('answer');
            $table->integer('examine_uptime')->nullable();
            $table->float('evaluate_mark', 10, 2);
            $table->integer('uid');
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('checker_id')->nullable();
            $table->timestamp('check_time')->nullable();
            $table->integer('status');
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
        Schema::dropIfExists('quiz_answer');
    }
}
