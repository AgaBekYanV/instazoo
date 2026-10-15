# 🦜 InstaZoo

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-22.1.6-red.svg)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**InstaZoo** — это модель социальной сети для публикации фотографий, построенная на основе клиент-серверной архитектуры. Проект предоставляет бэкенд с ролевой моделью доступа и валидацией данных, а также динамичный и отзывчивый пользовательский интерфейс.

---

## 📑 Оглавление
- [О проекте](#-о-проекте)
- [Особенности](#-особенности)
- [Технологический стек](#-технологический-стек)
- [Структура проекта](#-структура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [Тестирование](#-тестирование)
- [Вклад в проект](#-вклад-в-проект)
- [Лицензия](#-лицензия)

---

##  Особенности

-  **Ролевая модель доступа**: Разграничение прав между пользователями, модераторами и администраторами на базе Spring Security.
-  **Валидация данных**: Строгая проверка входящих данных на всех уровнях приложения для обеспечения целостности и безопасности.
-  **Контейнеризация**: Полная поддержка Docker и Docker Compose для быстрого и воспроизводимого развертывания окружения.
-  **Современный UI**: Адаптивный и быстрый интерфейс, разработанный на Angular.
-  **Надежное хранение**: Использование PostgreSQL 16 для управления данными.

---

##  Технологический стек

### Backend (`/server`)
- **Язык**: Java 21
- **Фреймворк**: Spring Boot 4.1.0 (Spring Web, Spring Data JPA, Spring Security)
- **База данных**: PostgreSQL 16
- **Сборка**: Maven 3.9.11
- **Инструменты**: Docker, Docker Compose

### Frontend (`/client`)
- **Фреймворк**: Angular 22.1.6
- **Язык**: TypeScript
- **Разметка и стили**: HTML5, CSS3
- **Тестирование**: Vitest (Unit-тесты), Angular CLI (E2E)

---

## 📂 Структура проекта

```text
instazoo/
├── client/                 # Фронтенд-приложение (Angular)
│   ├── src/                # Исходный код клиентской части
│   ├── public/             # Статические ресурсы
│   ├── angular.json        # Конфигурация Angular CLI
│   └── package.json        # Зависимости Node.js
├── server/                 # Бэкенд-приложение (Spring Boot)
│   ├── src/                # Исходный код серверной части (Java)
│   ├── pom.xml             # Зависимости и плагины Maven
│   └── docker-compose.yml  # Конфигурация для запуска БД и сервера
├── .gitignore              # Игнорируемые файлы Git
└── README.md               # Основной файл документации