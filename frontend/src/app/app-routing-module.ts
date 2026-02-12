import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register-component/register-component';
import { LoginComponent } from './auth/login-component/login-component';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './home/home-component/home-component';
import { authGuard } from './home/core/guards/auth-guard';
import { ThreadList } from './home/components/thread-list/thread-list';
import ThreadPage from './home/pages/thread/thread';
import { ThreadFeed } from './home/pages/thread-feed/thread-feed';
import { NotFound } from './home/pages/not-found/not-found';
import { Rules } from './home/pages/rules/rules';
import { About } from './home/pages/about/about';
import { Profile } from './home/pages/profile/profile';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ThreadFeed },
      { path: 'explore', component: ThreadFeed },
      { path: 'popular', component: ThreadFeed },
      { path: 'category/:id', component: ThreadFeed },
      { path: 'thread/:id', component: ThreadPage },
      { path: 'rules', component: Rules },
      { path: 'about', component: About},
      { path: 'profile', component: Profile}
    ]
  },

  { path: '**', component: NotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
