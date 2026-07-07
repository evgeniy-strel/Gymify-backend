# 🏋️ Gymify Backend

Backend-часть PWA-приложения **[Gymify](https://github.com/evgeniy-strel/Gymify)**.


## 🛠 Технологии

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)


## 🗄️ База данных

В качестве СУБД используется **Supabase (PostgreSQL)**.

### Структура данных

```text
Programs
    │
    └── Weeks
            │
            └── Days
            		|
                    └ Exercises
                           └── Sets
BodyWeight
Timers
```

### Основные таблицы

| Таблица | Назначение |
|---------|------------|
| **Programs** | Тренировочные программы пользователя. Содержит название, описание, текущую и общую продолжительность программы. |
| **Weeks** | Недели тренировочной программы. Связаны с конкретной программой через `program_id`. |
| **Days** | Тренировочные дни, содержащие информацию о статусе выполнения, времени начала и окончания тренировки. |
| **Exercises** | Список упражнений для каждого тренировочного дня с порядком их выполнения. |
| **Sets** | Подходы упражнений с количеством повторений, рабочим весом и отметкой о выполнении. |
| **BodyWeight** | История измерений веса пользователя с датой фиксации результата. |
| **Timers** | Данные таймеров отдыха, включая время окончания, push-подписку и параметры уведомлений. |
