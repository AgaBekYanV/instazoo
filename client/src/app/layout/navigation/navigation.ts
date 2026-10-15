import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {User} from '../../models/User';
import {TokenStorage} from '../../service/token-storage';
import {UserService} from '../../service/userService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: false,
  styleUrl: './navigation.css',
  templateUrl: './navigation.html',
})
export class Navigation implements OnInit {

  isLoggedIn = false;
  isDataLoaded = false;
  user!: User;

  constructor(private tokenStorage: TokenStorage,
              private userService: UserService,
              private router: Router) {}


    ngOnInit(): void {
        this.isLoggedIn = !!this.tokenStorage.getToken();
        if(this.isLoggedIn){
          this.userService.getCurrentUser()
            .subscribe(data=>{
              this.user = data;
              this.isDataLoaded = true;
            });
        }
    }

    logout(){
    this.tokenStorage.logOut();
    this.router.navigate(['/login']);
    }
}
