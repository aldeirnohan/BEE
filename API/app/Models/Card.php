<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $fillable = [
        'flag',
        'number',
        'security_code',
        'expiration_date',
        'holder',
        'type'
    ];

    protected $table = 'cards';
}
