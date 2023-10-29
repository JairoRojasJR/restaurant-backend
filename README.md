### INTRODUCCIÓN

- Este es el backend de la apliación del negocio restaurant-sf.

### COMANDO INCIAL PARA PODER DESPLEGAR LA APLICACIÓN EN PRODUCCIÓN

# SI EL HOSTING NO TIENE INSTALADO PNPM

`npm install -g pnpm && pnpm pkg delete scripts.prepare && pnpm install && pnpm run build && pnpm run start`

# SI YA TIENE INSTALADO PNPM

`pnpm pkg delete scripts.prepare && pnpm install && pnpm run build && pnpm run start`
