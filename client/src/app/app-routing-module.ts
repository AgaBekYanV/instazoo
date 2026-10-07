import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Login} from './auth/login/login';
import {Register} from './auth/register/register';
import {Index} from './layout/index';
import {AuthGuard} from './helper/auth-guard';
import {Profile} from './user/profile/profile';
import {Posts} from './user/posts/posts';
import {AddPost} from './user/add-post/add-post';

const routes: Routes = [
  {path: 'login', component: Login},
  {path: 'register', component: Register},
  {path: 'main', component: Index, canActivate: [AuthGuard]},
  {
    path: 'profile', component: Profile, canActivate: [AuthGuard], children: [
      {path: '', component: Posts, canActivate: [AuthGuard]},
      {path: 'add', component: AddPost, canActivate: [AuthGuard]},
    ]
  },
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
