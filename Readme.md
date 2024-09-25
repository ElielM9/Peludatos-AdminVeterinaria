<div align="center">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML" />&nbsp;&nbsp;
<img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SASS" />&nbsp;&nbsp;
<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>&nbsp;&nbsp;
<img src="https://img.shields.io/badge/Gulp-CF4647?style=for-the-badge&logo=gulp&logoColor=white" alt="Gulp" />&nbsp;&nbsp;

</div>


## Uso 
### El proyecto debe contener: 
1. Un archivo gulpfile.js donde se colocarán todas las configuraciones del proyecto.
### 1.- Instalaciones únicas
Sólo se instala una vez de manera global 
```bash
npm install --global gulp-cli
```
### 2.- Instalaciones de cada proyecto
Estos comandos deben ejecutarse en cada proyecto que vaya a ser utilizado Gulp. 
#### Si se tiene el Package.json solo ejecutar el: 
```bash
npm i // npm install 
```
#### No se tiene el package.json 
```bash
npm init
npm install --save-dev gulp
```
#### HTML
```bash
npm install --save gulp-htmlmin ##Minifica y limpia nuestro HTML
```
#### SCSS

```bash
npm i --save-dev sass gulp-sass ##Instalar SASS en Gulp. 
npm i --save-dev gulp-postcss autoprefixer ##Crea versiones compatibles con navegadores. 
npm i --save-dev cssnano ##Minifica el código de CSS. 
npm i --save-dev gulp-purgecss ##Limpia el CSS que no se usa.
```

### JavaScript 
```bash
npm i --save-dev gulp-terser-js ##Minifica el codigo JS
```

#### Plugins de imágenes

```bash
npm i --save-dev gulp-imagemin@7.1.0 ##Aligerar imágenes.
npm i --save-dev gulp-cache ##Ayuda a procesar las imágenes en caché. 
npm i --save-dev gulp-webp@4 ##Convierte imágenes a webp.
npm i --save-dev gulp-avif ##Convierte imágenes a Avif.
```

#### Plugins extra

```bash
npm i --save-dev gulp-plumber ##Evita que se detenga la ejecución al presentar errores.
npm i --save-dev gulp-cache-bust ##Limpia la caché
npm i --save-dev gulp-sourcemaps ##Crea un mapa para poder visualizarlo. 
npm i --save-dev gulp-concat ##Une todos nuestros archivos en uno solo.
```
 