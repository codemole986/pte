<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->string('address')->nullable();
            $table->string('password');
            $table->string('permission',4,'D')->nullable();
            $table->enum('class', array('Basic', 'Bronze', 'Silver', 'Gold'), 'Base')->index();
            $table->string('verification_code', 20)->nullable();
            $table->integer('visited_count');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        $admin_data = array(
            "id" => 0,
            "first_name" => "John",
            "last_name" => "Doe",
            "email" => "admin@quiz.com",
            "address" => "admin",
            "password" => md5("admin"),
            "permission" => "A",
            "class" => "Basic",
            "verification_code" => str_random(20),
            "visited_count" => 0,
            "created_at" => date("Y-m-d H:i:s"),
        );    

        DB::table('users')->insert($admin_data);
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
