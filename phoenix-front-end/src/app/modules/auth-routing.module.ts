import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { BlogComponent } from '../components/blog/blog.component';
import { BooksComponent } from '../components/books/books.component';
import { CssComponent } from '../components/css/css.component';
import { EmotionalIntelligenceComponent } from '../components/emotional-intelligence/emotional-intelligence.component';
import { HtmlComponent } from '../components/html/html.component';
import { JavaComponent } from '../components/java/java.component';
import { MovieBookMusicComponent } from '../components/movie-book-music/movie-book-music.component';
import { MoviesComponent } from '../components/movies/movies.component';
import { MusicComponent } from '../components/music/music.component';
import { MyProfileAboutComponent } from '../components/my-profile-about/my-profile-about.component';
import { MyProfileContactComponent } from '../components/my-profile-contact/my-profile-contact.component';
import { MyProfileFirstComponent } from '../components/my-profile-first/my-profile-first.component';
import { MyProfileSecondComponent } from '../components/my-profile-second/my-profile-second.component';
import { MyProfileComponent } from '../components/my-profile/my-profile.component';
import { OrganizationComponent } from '../components/organization/organization.component';
import { PhoenixComponent } from '../components/phoenix/phoenix.component';
import { ProgrammingComponent } from '../components/programming/programming.component';
import { PythonComponent } from '../components/python/python.component';
import { SuggestionsComponent } from '../components/suggestions/suggestions.component';
import { TipsComponent } from '../components/tips/tips.component';
import { WebDevelopComponent } from '../components/web-develop/web-develop.component';
import { WebIntroComponent } from '../components/web-intro/web-intro.component';

const routes: Routes = [
  {
    //default route -> path in browser will just be localhost:4200
    path: '',
    component: PhoenixComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'blog',
    component: BlogComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'organization',
    component: OrganizationComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'movie-book-music',
    component: MovieBookMusicComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'movies',
    component: MoviesComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'books',
    component: BooksComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'music',
    component: MusicComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'suggestions',
    component: SuggestionsComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'myprofile',
    component: MyProfileComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'myprofileFirst',
    component: MyProfileFirstComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'myprofileSecond',
    component: MyProfileSecondComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'myprofileAbout',
    component: MyProfileAboutComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'myprofileContact',
    component: MyProfileContactComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'login',
    component: AuthTabsComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'intro',
    component: WebIntroComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'programming',
    component: ProgrammingComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'java',
    component: JavaComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'python',
    component: PythonComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'web',
    component: WebDevelopComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'html',
    component: HtmlComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'css',
    component: CssComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'tips',
    component: TipsComponent
  },
  {
    //default route -> path in browser will just be localhost:4200
    path: 'emotionalIntelligence',
    component: EmotionalIntelligenceComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
