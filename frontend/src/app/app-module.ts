import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { RegisterComponent } from './auth/register-component/register-component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login-component/login-component';
import { HomeComponent } from './home/home-component/home-component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { CategoryFilterPipe } from './home/category-filter-pipe';
import { MatSelectModule } from '@angular/material/select';
import { PaginatePipe } from './home/paginate-pipe';
import { ThreadList } from './home/components/thread-list/thread-list';
import { Sidebar } from './home/components/sidebar/sidebar';
import { Pagination } from './home/components/pagination/pagination';
import { NewDiscussionMenu } from './home/components/new-discussion-menu/new-discussion-menu';

@NgModule({
  declarations: [
    App,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    CategoryFilterPipe,
    PaginatePipe,
    ThreadList,
    Sidebar,
    Pagination,
    NewDiscussionMenu,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

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
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
