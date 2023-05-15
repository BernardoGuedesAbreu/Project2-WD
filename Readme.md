# Project Name

PawPal



## Description

Search platorm that helps you decide what dog breeds are best for you !



<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage and filter by breed characteristcs, log in and sign up. 
- **sign up** - As a user I want to sign up on the web page so that I can add favorite breed to my list.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account
- **favorite list** - As a user I want to see the list of my favorite and delete them.
- **edit user** - As a user I want to be able to edit my profile.
- **result** - As a user I want to see the list of breed filter by my preferences.
- **dog listing** - As a user I want to see more details of the breeds , so I can make a more informed choice, and save them to favourites so I can check them later.
- **filterbyCharacteristics** - As a user I want to be able to search all of the existing breeds filtering by characteristics I find appealing, to help me decide which dog breed is most suited for me.


<br>



## Server Routes (Back-end):



| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `index` view.                 |                                                          |
| `GET`      | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                          | Sends Sign Up info to the server and creates user in the DB. | {  email, password  }                                    |
| `GET`      | `/private/edit-profile`            | Private route. Renders `edit-profile` form view.             |                                                          |
| `PUT`      | `/private/edit-profile`            | Private route. Sends edit-profile info to server and updates user in DB. | { email, password, [firstName], [lastName], [imageUrl] } |
| `GET`      | `/private/favorites`               | Private route. Render the `favorites` view.                  |                                                          |
| `POST`     | `/private/favorites/`              | Private route. Adds a new favorite for the current user.     | { name, cuisine, city, }                                 |
| `DELETE`   | `/private/favorites/:breedId` | Private route. Deletes the existing favorite from the current user. |                                                          |
| `GET`      | `/dogbreeds`                     | Renders "dog-breeds-list` view.                              |                                                          |
| `GET`      | `/d
dogbreeds/details/:id`         | Renders `dog-breeds-details` view for the particular dog breed. |                                                          |
 insert updateRoute
 inser delete Route
 route result search charateristics






## Models

User model

```javascript
{
  name: String,
  email: String,
  password: String,
  favorites: [FavoriteId],
}

```



Favorites model

```javascript
{
  placeId: String,
}
```

<br>

## API's
https://thedogapi.com/

<br>


## Packages
\Project2 <br>
├── bcrypt@5.1.0<br>
├── connect-mongo@5.0.0<br>
├── cookie-parser@1.4.6<br>
├── dotenv@16.0.3<br>
├── express-session@1.17.3<br>
├── express@4.18.2<br>
├── hbs@4.2.0<br>
├── mongoose@7.1.1<br>
├── morgan@1.10.0<br>
├── nodemon@2.0.22<br>
└── serve-favicon@2.5.<br>
└── Bootstraps <br>



<br>



## Backlog

[See the Trello board.](https://trello.com/b/Ni3giVKf/ironhackproject)



<br>



## Links



### Git

The url to your repository and to your deployed project

[Repository Link]()

[Deploy Link]()



<br>



### Slides

The url to your presentation slides

[Slides Link]

### Contributors
Bernardo Abreu- [`<github-username>`]https://github.com/BernardoGuedesAbreu - [`<linkedin-profile-link>`]
Niroj Gautam - [`<github-username>`](https://github.com/Niroj167 - [`<linkedin-profile-link>`]