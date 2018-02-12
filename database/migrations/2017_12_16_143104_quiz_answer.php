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
            $table->increments('id');
            $table->integer('testevent_id')->index();
            $table->integer('quiz_id')->index();
            $table->text('answer');
            $table->unsignedInteger('examine_uptime')->nullable();
            $table->float('evaluate_mark', 10, 2);
            $table->integer('uid')->index();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('checker_id')->nullable()->index();
            $table->timestamp('check_time')->nullable();
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
        Schema::dropIfExists('quiz_answer');
    }
}
