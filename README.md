
# Prueba Wizybot - Hernán Escorcia

_Esta prueba fue realizada utilizando las tecnologías NestJS, Docker, Swagger, TypeOrm y PostgreSQL._

## Nota

Se ha decidido excluir el archivo `.env` de `.gitignore` con el objetivo de facilitar la evaluación de la prueba y asegurar que el entorno de desarrollo esté correctamente configurado.

## Diseño del Diagrama Entidad-Relación 📝

A continuación, se muestra el diagrama de entidad-relación que ilustra las principales entidades y sus relaciones dentro del sistema:

![Diagrama Entidad-Relación](https://github.com/hdes26/wizybot-test/blob/main/src/assets/er-wizy.drawio.png)

## Diseño de Clean Code 📜

El proyecto sigue principios de **Clean Code** para garantizar una base de código mantenible, comprensible y eficiente. El siguiente diagrama muestra los enfoques clave utilizados para asegurar la calidad del código:

![Diagrama Explicación Clean Code](https://github.com/hdes26/wizybot-test/blob/main/src/assets/cleancode.webp)

## Instalación 🔧

Siga los pasos a continuación para configurar y ejecutar el proyecto en su entorno local.

### 1. Clonar el repositorio

Primero, clone el repositorio en su máquina local:

```bash
git clone https://github.com/hdes26/wizybot-test.git
```

### 2. Inicializar el contenedor de Docker

A continuación, inicialice los contenedores de Docker para levantar el entorno de desarrollo:

```bash
docker-compose up
```

Este comando iniciará los servicios necesarios, como la base de datos PostgreSQL y el backend del sistema.

## Base de Datos Preconfigurada 💾

La base de datos está preconfigurada con datos iniciales gracias a los seeders implementados. Los siguientes datos están disponibles desde el inicio:

1. **Bots**:
   - `ProductBot`: Bot enfocado a responder preguntas sobre productos.
   - `CurrencyBot`: Bot enfocado a responder preguntas sobre monedas.

Esto permite probar el sistema de inmediato sin necesidad de crear los datos manualmente. Aunque el tipo de bots guardados aquí no es crucial para la funcionalidad actual, se ha implementado con la idea de mejorar la administración y escalabilidad futura. Tener varios bots en la base de datos facilitará la gestión y permitirá una mejor expansión y personalización del sistema.

## Imagen Docker 🐳

La imagen Docker del servidor se encuentra disponible en Docker Hub. Para obtenerla, utilice el siguiente comando:
Quiero destacar que hace falta levantar una base de datos datos para poder usar esta imagen.

```bash
docker pull hdes26/wizybot-test:latest
```

## Recursos 🔗

- [Repositorio en GitHub](https://github.com/hdes26/wizybot-test)
