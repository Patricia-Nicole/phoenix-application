import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthRoutingModule } from './modules/auth-routing.module';
import { AuthModule } from './modules/auth.module';
import { StreamsModule } from './modules/streams.module';
import { StreamsRoutingModule } from './modules/streams-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token-interceptor';
import { PhoenixComponent } from './components/phoenix/phoenix.component';
import { BlogComponent } from './components/blog/blog.component';
import { EmotionalIntelligenceComponent } from './components/emotional-intelligence/emotional-intelligence.component';
import { TipsComponent } from './components/tips/tips.component';
import { ProgrammingComponent } from './components/programming/programming.component';
import { JavaComponent } from './components/java/java.component';
import { PythonComponent } from './components/python/python.component';
import { WebDevelopComponent } from './components/web-develop/web-develop.component';
import { HtmlComponent } from './components/html/html.component';
import { CssComponent } from './components/css/css.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { MyProfileFirstComponent } from './components/my-profile-first/my-profile-first.component';
import { MyProfileSecondComponent } from './components/my-profile-second/my-profile-second.component';
import { MyProfileAboutComponent } from './components/my-profile-about/my-profile-about.component';
import { MyProfileContactComponent } from './components/my-profile-contact/my-profile-contact.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { MovieBookMusicComponent } from './components/movie-book-music/movie-book-music.component';
import { MoviesComponent } from './components/movies/movies.component';
import { BooksComponent } from './components/books/books.component';
import { MusicComponent } from './components/music/music.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WebIntroComponent } from './components/web-intro/web-intro.component';

@NgModule({
  declarations: [
    AppComponent,
    PhoenixComponent,
    BlogComponent,
    EmotionalIntelligenceComponent,
    TipsComponent,
    ProgrammingComponent,
    JavaComponent,
    PythonComponent,
    WebDevelopComponent,
    HtmlComponent,
    CssComponent,
    MyProfileComponent,
    MyProfileFirstComponent,
    MyProfileSecondComponent,
    MyProfileAboutComponent,
    MyProfileContactComponent,
    OrganizationComponent,
    MovieBookMusicComponent,
    MoviesComponent,
    BooksComponent,
    MusicComponent,
    SuggestionsComponent,
    WebIntroComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule,
    AuthRoutingModule,
    StreamsModule,
    StreamsRoutingModule
  ],
  providers: [
    CookieService, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
