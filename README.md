# laravel 5.4 with angular 4 start project

## Installation:

```
composer install
npm install
```
Create `.env` file (can be based on `.env.example`
```
php artisan key:generate
```

### When using local drive for uploading files, create a symbolic link at public/storage which points to the  storage/app/public directory.
```
php artisan storage:link
```

## Building

```
npm run dev
```

## Watching

```
npm run watch
```

## Server

```
php artisan serve
```

## To include component template to the component use following code:
```ts
'template': require('./app.component.html'),
```


## To include component style to the component use following code:
```ts
'styles': [`${require('./app.component.scss')}`]
```
