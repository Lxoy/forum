import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { RegisterComponent } from './auth/register-component/register-component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login-component/login-component';
import { HomeComponent } from './home/home-component/home-component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { PaginatePipe } from './home/paginate-pipe';
import { ThreadList } from './home/components/thread-list/thread-list';
import { Sidebar } from './home/components/sidebar/sidebar';
import { NewDiscussionMenu } from './home/components/new-discussion-menu/new-discussion-menu';
import ThreadPage from './home/pages/thread/thread';
import { ThreadFeed } from './home/pages/thread-feed/thread-feed';
import { NotFound } from './home/pages/not-found/not-found';
import { Rules } from './home/pages/rules/rules';
import { About } from './home/pages/about/about';
import { MatChipsModule } from '@angular/material/chips';
import { Profile } from './home/pages/profile/profile';
import { Pagination } from './home/components/pagination/pagination';
import { AuthInterceptor } from './home/core/auth.interceptor';

@NgModule({
  declarations: [
    App,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    PaginatePipe,
    ThreadList,
    Sidebar,
    Pagination,
    NewDiscussionMenu,
    ThreadPage,
    ThreadFeed,
    NotFound,
    Rules,
    About,
    Profile,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
